import React, { useState, useRef, useEffect } from "react";
import { View, Animated, ImageBackground, Image, Text, TouchableOpacity, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "@/lib/auth/authContext";
import { getQuestions } from "@/lib/api/gameService";
import { getMockQuestions, MOCK_QUESTIONS } from "@/lib/api/mockQuestions";
import images from "@/constants/images";

interface Question {
	question: string;
	options: string[];
	correctAnswer: string;
}

// Constants
const TOTAL_FLOORS = 10; // size of the tower (change as you like)
const topics = Object.keys(MOCK_QUESTIONS);
const randomTopic = () => topics[Math.floor(Math.random() * topics.length)];

// Floor grid
const FloorGrid = ({ currentFloor, totalFloors }: { currentFloor: number; totalFloors: number }) => {
	const translateY = useRef(new Animated.Value(0)).current;
	const [containerHeight, setContainerHeight] = useState(0);

	useEffect(() => {
		if (containerHeight > 0) {
			// Calculate percentage-based translation
			const percentageTranslation = -((totalFloors - 3 - currentFloor) * containerHeight) / 3;

			// Animate the floor position when the current floor changes
			Animated.timing(translateY, {
				toValue: percentageTranslation,
				duration: 500,
				useNativeDriver: true,
			}).start();
		}
	}, [currentFloor, totalFloors, containerHeight]);

	return (
		<View className="relative flex-1 flex-col">
			{/* Floors */}
			<View id="floors" className="absolute h-3/4 w-full bottom-2 flex flex-col justify-end overflow-hidden">
				<Animated.View
					className="flex-1"
					style={{ transform: [{ translateY }] }}
					onLayout={(e) => setContainerHeight(e.nativeEvent.layout.height)}
				>
					{Array.from({ length: totalFloors }, (_, i) => (
						<View key={i} className="flex flex-row justify-between items-center border-t-4 border-floor h-1/3">
							<View className="w-20 h-full bg-gray-200/10 justify-center items-center">
								<Text className="text-white text-center font-righteous">{totalFloors - i - 1}</Text>
							</View>
							<View className="flex-1 h-full bg-gray-300/10" />
							<View className="flex-1 h-full bg-gray-400/10" />
							<View className="w-20 h-full bg-gray-500/10" />
						</View>
					))}
				</Animated.View>
			</View>

			{/* Gradient lines for the top of the floor */}
			<View className="absolute w-full h-full bg-transparent inset-0">
				<View className="absolute left-20 h-full">
					<LinearGradient colors={["transparent", "#2C2E39"]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 0.2 }} className="w-1 h-full" />
				</View>
				<View className="absolute left-1/2 -ml-px h-full">
					<LinearGradient colors={["transparent", "#2C2E39"]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 0.2 }} className="w-1 h-full" />
				</View>
				<View className="absolute right-20 h-full">
					<LinearGradient colors={["transparent", "#2C2E39"]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 0.2 }} className="w-1 h-full" />
				</View>
			</View>

			{/* Thick floor line */}
			<View className="absolute bg-gray-400 h-2 w-full bottom-0"></View>
		</View>
	);
};

// Main
export default function Game() {
	const { token, isAuthenticated } = useAuth();

	// State variables
	const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
	const [currentFloor, setCurrentFloor] = useState(0);
	const [gameWon, setGameWon] = useState(false);
	const [incorrectAnswers, setIncorrectAnswers] = useState<string[]>([]);

	// Fetch question from API or mock data
	const fetchQuestion = async (): Promise<Question> => {
		let attempt = 0;
		while (attempt < 5) {
			// try a few topics before giving up
			attempt += 1;
			const topic = randomTopic();
			try {
				// Try API first, then fallback to mock data
				let raw: any[] = [];
				if (isAuthenticated && token) {
					raw = await getQuestions(token, topic, 1, false);
				}
				if (!Array.isArray(raw) || raw.length === 0) {
					raw = getMockQuestions(topic, 1);
				}
				const q = raw[0];
				if (q && q.question && Array.isArray(q.options) && q.options.length > 0) {
					return {
						question: q.question,
						options: q.options,
						correctAnswer: q.correct_answer,
					};
				}
			} catch (e) {
				// Ignore and try a different topic
			}
		}
		// If everything fails, return a hardcoded placeholder
		return {
			question: "Sorry, we couldn't load a question right now. Try again later!",
			options: ["OK"],
			correctAnswer: "OK",
		};
	};

	// first question on mount
	useEffect(() => {
		fetchQuestion().then(setCurrentQuestion);
	}, []);

	// helpers
	const resetQuestion = async () => {
		// Reset for new question
		setIncorrectAnswers([]);
		const nextQ = await fetchQuestion();
		setCurrentQuestion(nextQ);
	};

	const advanceFloor = async () => {
		const next = currentFloor + 1;

		if (next >= TOTAL_FLOORS) {
			setGameWon(true);
			return;
		}

		setCurrentFloor(next);
		resetQuestion();
	};

	const handleAnswer = (answer: string) => {
		if (!currentQuestion || gameWon) return;

		if (answer === currentQuestion.correctAnswer) {
			// Only advance the floor on correct answer
			advanceFloor();
		} else {
			// Add this answer to incorrectAnswers list to display red border
			if (!incorrectAnswers.includes(answer)) {
				setIncorrectAnswers((prev) => [...prev, answer]);
			}
		}
	};

	// render
	return (
		<View className="flex-1">
			<ImageBackground source={images.profileBackground} className="w-full h-full" resizeMode="cover">
				<View className="mx-6 flex flex-col justify-start items-center">
					{/* Question bubble */}
					<View className="flex flex-row justify-center items-center w-full">
						<Image source={images.aiHostSmall} className="pr-4" />
						<View className="flex-1 justify-center items-center bg-grey-200/30 py-4 px-6 rounded-3xl border border-blue-200">
							<Text className="text-white font-righteous">
								{gameWon ? "Congratulations! You reached the top!" : currentQuestion?.question ?? "Loading…"}
							</Text>
						</View>
					</View>

					{/* Options */}
					<ScrollView className="h-72 w-full" contentContainerClassName="w-full flex flex-col justify-between items-center overflow-hidden">
						{!gameWon &&
							currentQuestion?.options.map((opt, idx) => (
								<TouchableOpacity
									key={idx}
									onPress={() => handleAnswer(opt)}
									activeOpacity={0.8}
									style={{
										borderColor: incorrectAnswers.includes(opt) ? "#ef4444" : "#bfdbfe",
										borderWidth: 1,
										borderRadius: 24,
										marginTop: 16,
										paddingVertical: 12,
										width: "100%",
										display: "flex",
										justifyContent: "center",
										alignItems: "center",
										backgroundColor: "rgba(229, 231, 235, 0.1)",
									}}
								>
									<Text className="text-lg font-righteous text-grey-200 px-4">{opt}</Text>
								</TouchableOpacity>
							))}
					</ScrollView>
				</View>

				<FloorGrid currentFloor={currentFloor} totalFloors={TOTAL_FLOORS} />
			</ImageBackground>
		</View>
	);
}
