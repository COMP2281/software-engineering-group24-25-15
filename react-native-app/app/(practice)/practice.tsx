import { useState, useEffect, useMemo } from "react";
import { View, Alert } from "react-native";
import { router, useLocalSearchParams, Redirect } from "expo-router";
import { useAuth } from "@/lib/auth/authContext";
import { getQuestions, getAIResponse, updateStatistics, Question } from "@/lib/api/gameService";
import { Difficulty } from "../(game)/difficulty-selection";
import { getMockQuestions, getMockIntroduction } from "@/lib/api/mockQuestions";
import { bots } from "@/constants/data";
import LoadingScreen from "@/components/LoadingScreen";
import IntroductionScreen from "@/components/IntroductionScreen";
import QuestionScreen from "@/components/QuestionScreen";
import RoundSummaryScreen from "@/components/RoundSummaryScreen";
import GameSummaryScreen from "@/components/GameSummaryScreen";
import { useGameState } from "@/lib/hooks/useGameState";
import { useGameLogic } from "@/lib/hooks/useGameLogic";

export default function Game() {
	const { token, isAuthenticated } = useAuth();
	const params = useLocalSearchParams<{ topics: string; difficulty: string }>();

	// If not logged in, redirect to sign-in
	if (!isAuthenticated) {
		return <Redirect href="/(auth)/sign-in" />;
	}

	// Memoize the parsed topics to prevent re-parsing on every render
	const topics = useMemo(() => {
		try {
			return params.topics ? JSON.parse(params.topics as string) : [];
		} catch (e) {
			console.error("Error parsing topics:", e);
			return [];
		}
	}, [params.topics]);

	const difficulty = (params.difficulty as Difficulty) || "Medium";

	// Use custom hooks for game state and logic
	const gameState = useGameState();
	const { handleAnswer, handleHint, handleElimination, startRoundAfterIntro, startNextRound, returnHome, handleTimeOut } = useGameLogic(
		gameState,
		difficulty,
		token
	);

	// Load questions and introductions from API
	useEffect(() => {
		// Skip if there are no topics or no token
		if (!Array.isArray(topics) || topics.length === 0 || !token) return;

		console.log("Loading game data with topics:", topics);

		let mounted = true; // To handle component unmount

		const loadGameData = async () => {
			// Check authentication
			if (!token) {
				Alert.alert("Authentication Required", "You need to be logged in to play the game.", [
					{
						text: "Go to Login",
						onPress: () => router.replace("/(auth)/sign-in"),
					},
				]);
				return;
			}

			try {
				gameState.setLoading(true);
				const fetchedQuestions: Question[][] = [];
				const introductions: string[] = [];

				// Fetch questions for each selected topic
				for (const topic of topics) {
					console.log(`Loading questions for topic: ${topic}`);
					try {
						const topicQuestions = await getQuestions(token, topic, 3, true);

						// Only update state if component is still mounted
						if (!mounted) return;

						if (Array.isArray(topicQuestions) && topicQuestions.length > 0) {
							fetchedQuestions.push(topicQuestions);

							// Get AI host introduction for each topic
							const promptText = `Write a brief one-sentence introduction for a quiz about ${topic}. Do not ask how you can help. Start with "Welcome to" or "Get ready for".`;
							try {
								const intro = await getAIResponse(token, promptText);
								if (!mounted) return;
								introductions.push(intro);
							} catch (introError) {
								console.error(`Error fetching introduction for ${topic}:`, introError);
								introductions.push(getMockIntroduction(topic));
							}
						} else {
							console.warn(`No questions returned for topic: ${topic}, using mock data`);
							fetchedQuestions.push(getMockQuestions(topic));
							introductions.push(getMockIntroduction(topic));
						}
					} catch (topicError) {
						console.error(`Error loading data for topic ${topic}:`, topicError);
						fetchedQuestions.push(getMockQuestions(topic));
						introductions.push(getMockIntroduction(topic));
					}
				}

				if (!mounted) return;

				if (fetchedQuestions.length === 0) {
					throw new Error("No questions could be loaded for any topic");
				}

				gameState.setQuestions(fetchedQuestions);
				gameState.setHostIntroductions(introductions);
				console.log("Game data loaded successfully with", fetchedQuestions.length, "topics");
			} catch (error) {
				if (!mounted) return;

				console.error("Failed to load game data:", error);
				Alert.alert("Error", "Failed to load game data. Would you like to try again?", [
					{
						text: "Try Again",
						onPress: () => loadGameData(),
					},
					{
						text: "Go Back",
						onPress: () => router.back(),
						style: "cancel",
					},
				]);
			} finally {
				if (mounted) {
					gameState.setLoading(false);
				}
			}
		};

		loadGameData();

		// Cleanup function to handle component unmount
		return () => {
			mounted = false;
		};
	}, [token, topics]);

	// Timer effect: resets on question/round changes
	useEffect(() => {
		if (gameState.gameStage !== "question" || !gameState.currentQuestion) return;

		gameState.setTimeLeft(20);
		const interval = setInterval(() => {
			gameState.setTimeLeft((prev) => {
				if (prev <= 1) {
					clearInterval(interval);
					handleTimeOut();
					return 0;
				}
				return prev - 1;
			});
		}, 1000);

		return () => clearInterval(interval);
	}, [gameState.currentRound, gameState.currentQuestionIndex, gameState.gameStage, gameState.currentQuestion]);

	// Initialize eliminatedOptions when the current question changes
	useEffect(() => {
		if (gameState.currentQuestion && gameState.gameStage === "question" && Array.isArray(gameState.currentQuestion.options)) {
			gameState.setEliminatedOptions(new Array(gameState.currentQuestion.options.length).fill(false));
		} else {
			gameState.setEliminatedOptions([]);
		}
	}, [gameState.currentQuestion, gameState.gameStage]);

	// Show loading screen while fetching data
	if (gameState.loading) {
		return <LoadingScreen />;
	}

	// Render different screens based on game stage
	switch (gameState.gameStage) {
		case "introduction":
			return (
				<IntroductionScreen
					currentRound={gameState.currentRound}
					topics={topics}
					hostIntroductions={gameState.hostIntroductions}
					onStart={startRoundAfterIntro}
				/>
			);
		case "roundSummary":
			return (
				<RoundSummaryScreen
					currentRound={gameState.currentRound}
					roundScore={gameState.roundScore}
					totalScore={gameState.totalScore}
					botPlayers={bots}
					botScores={gameState.botScores}
					onNextRound={startNextRound}
				/>
			);
		case "gameSummary":
			return (
				<GameSummaryScreen
					totalScore={gameState.totalScore}
					correctCount={gameState.correctCount}
					topics={topics}
					botPlayers={bots}
					botScores={gameState.botScores}
					onReturnHome={returnHome}
				/>
			);
		case "question":
		default:
			return (
				<QuestionScreen
					currentRound={gameState.currentRound}
					currentQuestionIndex={gameState.currentQuestionIndex}
					topics={topics}
					totalScore={gameState.totalScore}
					timeLeft={gameState.timeLeft}
					currentQuestion={gameState.currentQuestion}
					hintUsed={gameState.hintUsed}
					eliminationUsed={gameState.eliminationUsed}
					eliminatedOptions={gameState.eliminatedOptions}
					onAnswer={handleAnswer}
					onHint={handleHint}
					onElimination={handleElimination}
					onExit={() => router.back()}
				/>
			);
	}
}
