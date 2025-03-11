import { useState, useEffect } from "react";
import { View, Text, ImageBackground, TouchableOpacity, Alert, Image } from "react-native";
import { router } from "expo-router";
import images from "@/constants/images";

// Define questions with a correct option index (0-based)
const questions = [
	{ question: "What is IBM SkillsBuild?", correct: 1 },
	{ question: "What does SkillsBuild offer?", correct: 2 },
	{ question: "How does SkillsBuild help professionals?", correct: 0 },
	{ question: "What type of courses are available?", correct: 3 },
	{ question: "Why use IBM SkillsBuild?", correct: 2 },
];

// Define hints array (one per question)
const hints = [
	"IBM SkillsBuild is IBM's platform for skill development.",
	"It offers interactive courses and practical projects.",
	"It helps professionals upskill with industry-relevant content.",
	"Courses span technology, business and more.",
	"It combines learning with engaging game elements.",
];

// Define dynamic AI host messages for each question
const hostMessages = [
	"Which answer is correct?",
	"Think carefully before you answer!",
	"Remember your lessons!",
	"Focus - choose wisely!",
	"This is the final question, good luck!",
];

export default function Game() {
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [hintUsed, setHintUsed] = useState(false);
	const [eliminationUsed, setEliminationUsed] = useState(false);
	const [eliminatedOptions, setEliminatedOptions] = useState([false, false, false, false]);
	const [timeLeft, setTimeLeft] = useState(20);
	const [totalScore, setTotalScore] = useState(0);
	const [correctCount, setCorrectCount] = useState(0);
	const [gameFinished, setGameFinished] = useState(false);

	// Timer effect: resets every question; if time reaches 0, treat as unanswered
	useEffect(() => {
		if (gameFinished) return;
		setTimeLeft(20);
		const interval = setInterval(() => {
			setTimeLeft((prev) => {
				if (prev <= 1) {
					clearInterval(interval);
					// Time out: treat as incorrect answer and move to next question
					handleTimeOut();
					return 0;
				}
				return prev - 1;
			});
		}, 1000);
		return () => clearInterval(interval);
	}, [currentQuestionIndex, gameFinished]);

	// Called when timer runs out
	const handleTimeOut = () => {
		if (currentQuestionIndex < questions.length - 1) {
			setCurrentQuestionIndex((prev) => prev + 1);
		} else {
			setGameFinished(true);
		}
		setHintUsed(false);
		setEliminationUsed(false);
		setEliminatedOptions([false, false, false, false]);
	};

	// Handler for answer selection
	const handleAnswer = (selectedIndex: number) => {
		if (selectedIndex === questions[currentQuestionIndex].correct) {
			const scoreForQuestion = Math.floor((timeLeft / 20) * 50);
			setTotalScore((prev) => prev + scoreForQuestion);
			setCorrectCount((prev) => prev + 1);
		}
		advanceQuestion();
	};

	// Advance question or finish game and reset states
	const advanceQuestion = () => {
		if (currentQuestionIndex < questions.length - 1) {
			setCurrentQuestionIndex((prev) => prev + 1);
		} else {
			setGameFinished(true);
		}
		setHintUsed(false);
		setEliminationUsed(false);
		setEliminatedOptions([false, false, false, false]);
	};

	// Handler for the hint button: allow only one hint per question.
	const handleHint = () => {
		if (!hintUsed) {
			Alert.alert("Hint", hints[currentQuestionIndex]);
			setHintUsed(true);
		}
	};

	// Handler for the 50/50 elimination button: now eliminates 2 wrong answers.
	const handleElimination = () => {
		if (!eliminationUsed) {
			// Filter out the correct answer index
			const wrongIndices = [];
			for (let i = 0; i < 4; i++) {
				if (i !== questions[currentQuestionIndex].correct) {
					wrongIndices.push(i);
				}
			}
			// Shuffle the wrong indices
			for (let i = wrongIndices.length - 1; i > 0; i--) {
				const j = Math.floor(Math.random() * (i + 1));
				[wrongIndices[i], wrongIndices[j]] = [wrongIndices[j], wrongIndices[i]];
			}
			// Mark the first two wrong indices as eliminated
			const newEliminated = [false, false, false, false];
			if (wrongIndices.length > 0) newEliminated[wrongIndices[0]] = true;
			if (wrongIndices.length > 1) newEliminated[wrongIndices[1]] = true;
			setEliminatedOptions(newEliminated);
			setEliminationUsed(true);
			Alert.alert("50/50", "Two incorrect options have been removed.");
		}
	};

	// Return Home button handler (assumes index screen is home)
	const returnHome = () => {
		router.push("/");
	};

	// If game finished, display summary
	if (gameFinished) {
		return (
			<ImageBackground source={images.subBackground} className="w-full h-full" resizeMode="cover">
				<View className="flex-1 justify-center items-center p-6">
					<Text className="text-white text-3xl font-righteous mb-4">Game Over</Text>
					<Text className="text-white text-xl font-righteous mb-2">Total Score: {totalScore}</Text>
					<Text className="text-white text-xl font-righteous mb-6">
						Correct Answers: {correctCount} / {questions.length}
					</Text>
					<TouchableOpacity onPress={returnHome} className="bg-black-100 border-2 border-blue-100 rounded-3xl p-3">
						<Text className="text-grey-200 text-center text-xl font-righteous">Return Home</Text>
					</TouchableOpacity>
				</View>
			</ImageBackground>
		);
	}

	return (
		<ImageBackground source={images.subBackground} className="w-full h-full" resizeMode="cover">
			<View className="flex-1 justify-between p-6">
				{/* Top Section: Header, timer, score and the question (moved to top) */}
				<View>
					{/* Header and Timer */}
					<View className="flex-row items-center mt-10 justify-between">
						<TouchableOpacity onPress={() => router.back()}>
							<Text className="text-white text-xl font-righteous">Back</Text>
						</TouchableOpacity>
						<Text className="text-white text-xl font-righteous">Time: {timeLeft}s</Text>
					</View>
					{/* Score Display */}
					<View className="mt-2">
						<Text className="text-white text-xl font-righteous text-center">Score: {totalScore}</Text>
					</View>
					{/* Question at the top */}
					<View className="mt-6 bg-black-200 p-4 rounded-2xl border-2 border-blue-200">
						<Text className="text-white text-lg font-righteous">{questions[currentQuestionIndex].question}</Text>
					</View>
				</View>
				{/* Graphics Section: 4 player images in a row above a larger host image and host output */}
				<View className="mt-6">
					{/* Player images row with middle images moved up */}
					<View className="flex-row justify-around">
						<Image source={images.profile1} className="w-16 h-16 rounded-full border-2 border-blue-100" />
						<Image source={images.profile2} className="w-16 h-16 rounded-full border-2 border-blue-100 -mt-10" />
						<Image source={images.profile3} className="w-16 h-16 rounded-full border-2 border-blue-100 -mt-10" />
						<Image source={images.profile1} className="w-16 h-16 rounded-full border-2 border-blue-100" />
					</View>
					{/* Larger Host image */}
					<View className="flex-row justify-center my-4">
						<Image source={images.profile3} className="w-28 h-28 rounded-full border-2 border-blue-100 -mt-5" />
					</View>
					{/* Host output text */}
					<View className="mt-4 bg-black-200 p-4 rounded-2xl border-2 border-blue-200 mx-12">
						<Text className="text-white text-xl font-righteous text-center">
							{hostMessages[currentQuestionIndex % hostMessages.length]}
						</Text>
					</View>
				</View>
				{/* Bottom Section: Four Answer Buttons and Extra Buttons (Hint and 50/50) */}
				<View className="mb-10">
					{["Option 1", "Option 2", "Option 3", "Option 4"].map((option, index) => (
						<TouchableOpacity
							key={index}
							onPress={!eliminatedOptions[index] ? () => handleAnswer(index) : undefined}
							className={`bg-black-100 border-2 border-blue-100 rounded-3xl p-3 mb-2 ${eliminatedOptions[index] ? "opacity-50" : ""}`}
						>
							<Text className="text-grey-200 text-center text-xl font-righteous">{option}</Text>
						</TouchableOpacity>
					))}
					{/* Extra Buttons Row */}
					<View className="flex-row justify-between">
						<TouchableOpacity
							onPress={handleHint}
							disabled={hintUsed}
							className={`bg-black-100 border-2 border-blue-100 rounded-3xl p-3 flex-1 mr-2 ${hintUsed ? "opacity-50" : ""}`}
						>
							<Text className="text-grey-200 text-center text-xl font-righteous">Hint</Text>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={handleElimination}
							disabled={eliminationUsed}
							className={`bg-black-100 border-2 border-blue-100 rounded-3xl p-3 flex-1 ml-2 ${eliminationUsed ? "opacity-50" : ""}`}
						>
							<Text className="text-grey-200 text-center text-xl font-righteous">50/50</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</ImageBackground>
	);
}
