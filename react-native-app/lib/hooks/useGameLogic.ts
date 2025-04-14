import { Alert } from "react-native";
import { router } from "expo-router";
import { updateStatistics } from "@/lib/api/gameService";
import { Difficulty } from "@/app/(game)/difficulty-selection";
import { GameState } from "./useGameState";
import { bots } from "@/constants/data";

export function useGameLogic(gameState: GameState, difficulty: Difficulty, token: string | null) {
	// Reset per-question state
	const resetQuestionState = () => {
		gameState.setHintUsed(false);
		gameState.setEliminationUsed(false);
		// Initialize eliminatedOptions safely
		if (gameState.currentQuestion && Array.isArray(gameState.currentQuestion.options)) {
			gameState.setEliminatedOptions(new Array(gameState.currentQuestion.options.length).fill(false));
		} else {
			gameState.setEliminatedOptions([]);
		}
	};

	// Update bot scores based on difficulty
	const updateBotScores = () => {
		const newBotScores = [...gameState.botScores];

		const minScore = difficulty === "Easy" ? 30 : difficulty === "Medium" ? 50 : 80;
		const maxScore = difficulty === "Easy" ? 80 : difficulty === "Medium" ? 120 : 150;

		for (let i = 0; i < bots.length; i++) {
			const randomScore = Math.floor(Math.random() * (maxScore - minScore + 1)) + minScore;
			newBotScores[i] += randomScore;
		}

		gameState.setBotScores(newBotScores);
	};

	// Advance to the next question, round, or end game
	const advanceQuestion = (wasCorrect: boolean) => {
		// Make sure questions and the current round questions are defined
		if (!Array.isArray(gameState.questions) || !Array.isArray(gameState.questions[gameState.currentRound])) {
			console.error("No questions available for the current round");
			return;
		}

		// If we have more questions in the current round
		if (gameState.currentQuestionIndex < gameState.questions[gameState.currentRound].length - 1) {
			gameState.setCurrentQuestionIndex((prev) => prev + 1);
			resetQuestionState();
		}
		// If we have more rounds
		else if (gameState.currentRound < gameState.questions.length - 1) {
			// Generate bot scores for the round
			updateBotScores();
			// Show round summary
			gameState.setGameStage("roundSummary");
		}
		// Game is over
		else {
			// Final bot scores update
			updateBotScores();
			// Submit player score to server
			if (token) {
				updateStatistics(token, gameState.totalScore).catch(console.error);
			}
			gameState.setGameStage("gameSummary");
		}
	};

	// Handle timer expiration
	const handleTimeOut = () => {
		advanceQuestion(false);
	};

	// Handle answer selection
	const handleAnswer = (selectedOption: string) => {
		if (!gameState.currentQuestion) return;

		const isCorrect = selectedOption === gameState.currentQuestion.correct_answer;

		if (isCorrect) {
			// Calculate score based on time left and difficulty
			const difficultyMultiplier = difficulty === "Easy" ? 1 : difficulty === "Medium" ? 1.5 : 2;
			const scoreForQuestion = Math.floor((gameState.timeLeft / 20) * 50 * difficultyMultiplier);

			gameState.setTotalScore((prev) => prev + scoreForQuestion);
			gameState.setRoundScore((prev) => prev + scoreForQuestion);
			gameState.setCorrectCount((prev) => prev + 1);
		}

		advanceQuestion(isCorrect);
	};

	// Handler for the hint button
	const handleHint = () => {
		if (!gameState.hintUsed && gameState.currentQuestion?.hint) {
			Alert.alert("Hint", gameState.currentQuestion.hint);
			gameState.setHintUsed(true);
		} else if (!gameState.currentQuestion?.hint) {
			Alert.alert("No Hint", "Sorry, no hint is available for this question.");
		}
	};

	// Handler for the 50/50 elimination button
	const handleElimination = () => {
		if (!gameState.eliminationUsed && gameState.currentQuestion && Array.isArray(gameState.currentQuestion.options)) {
			const correctAnswer = gameState.currentQuestion.correct_answer;
			const wrongOptions = gameState.currentQuestion.options.filter((option) => option !== correctAnswer);

			// Pick 2 random wrong options to eliminate (or fewer if not enough wrong options)
			const eliminateCount = Math.min(2, wrongOptions.length);
			const shuffledWrongOptions = [...wrongOptions].sort(() => 0.5 - Math.random());
			const optionsToEliminate = shuffledWrongOptions.slice(0, eliminateCount);

			// Safely map over the options array
			const newEliminated = gameState.currentQuestion.options.map((option) => optionsToEliminate.includes(option));

			gameState.setEliminatedOptions(newEliminated);
			gameState.setEliminationUsed(true);
			Alert.alert("50/50", `${eliminateCount} incorrect options have been removed.`);
		}
	};

	// Start the round after the introduction
	const startRoundAfterIntro = () => {
		gameState.setGameStage("question");
	};

	// Start the next round
	const startNextRound = () => {
		gameState.setCurrentRound((prev) => prev + 1);
		gameState.setCurrentQuestionIndex(0);
		gameState.setRoundScore(0);
		gameState.setGameStage("introduction");
		resetQuestionState();
	};

	// Return to Home screen
	const returnHome = () => {
		router.push("/");
	};

	return {
		handleAnswer,
		handleHint,
		handleElimination,
		startRoundAfterIntro,
		startNextRound,
		returnHome,
		handleTimeOut,
	};
}
