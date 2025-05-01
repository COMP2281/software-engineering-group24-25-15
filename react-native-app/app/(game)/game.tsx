import React, { useState, useRef, useEffect } from "react";
import { View, Animated, ImageBackground, Image, Text, TouchableOpacity, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { questions } from "@/constants/data";
import images from "@/constants/images";

// Define types for the question and options
interface Question {
	question: string;
	options: string[];
	correctAnswer: string;
}

const Timer = ({ timeLeft }: { timeLeft: number }) => {
	return (
		<View className="absolute top-1/2 right-1/2 translate-x-[50%] z-10 -translate-y-[75%] bg-gray-800/70 px-4 py-2 rounded-full">
			<Text className="text-white font-righteous text-lg">{timeLeft}</Text>
		</View>
	);
};

const FloorGrid = ({ currentFloor, totalFloors }: { currentFloor: number; totalFloors: number }) => {
	const translateY = useRef(new Animated.Value(0)).current;
	const [containerHeight, setContainerHeight] = useState<number>(0); // State to store parent height

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
					onLayout={(event) => {
						// Get the height of the parent element
						const { height } = event.nativeEvent.layout;
						setContainerHeight(height);
					}}
				>
					{Array.from({ length: totalFloors }, (_, index) => (
						<View key={index} className="flex flex-row justify-between items-center border-t-4 border-floor h-1/3">
							<View className="w-20 h-full bg-gray-200/10 justify-center items-center">
								<Text className="text-white text-center font-righteous">{totalFloors - index - 1}</Text>
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

export default function Game() {
	const [currentFloor, setCurrentFloor] = useState<number>(0);
	const [currentQuestion, setCurrentQuestion] = useState<string | null>(null);
	const [options, setOptions] = useState<string[]>([]);
	const [gameWon, setGameWon] = useState<boolean>(false);
	const [timeLeft, setTimeLeft] = useState<number>(30); // Moved timeLeft state inside component
	const totalFloors = questions.length;

	useEffect(() => {
		// Set initial question
		loadQuestion(0);
	}, []);

	// Add timer effect inside component
	useEffect(() => {
		if (timeLeft > 0 && !gameWon) {
			const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
			return () => clearTimeout(timer);
		} else if (timeLeft === 0 && !gameWon) {
			alert("Time's up! Moving to the next question.");
			const nextFloor = currentFloor + 1;

			if (nextFloor >= totalFloors) {
				setGameWon(true);
				setCurrentQuestion("Congratulations! You reached the top!");
				setOptions([]);
			} else {
				setCurrentFloor(nextFloor);
				loadQuestion(nextFloor);
				setTimeLeft(30); // Reset timer for the next question
			}
		}
	}, [timeLeft, currentFloor, gameWon, totalFloors]);

	const loadQuestion = (floorNum: number): void => {
		if (floorNum >= questions.length) {
			setCurrentQuestion("You've reached the top!");
			setOptions([]);
			return;
		}

		const questionData: Question = questions[floorNum];
		setCurrentQuestion(questionData.question);
		setOptions(questionData.options);
		setTimeLeft(30); // Reset timer when loading a new question
	};

	const handleAnswer = (answer: string): void => {
		const correctAnswer = questions[currentFloor].correctAnswer;

		if (answer === correctAnswer) {
			const nextFloor = currentFloor + 1;
			setCurrentFloor(nextFloor);

			if (nextFloor >= totalFloors) {
				setGameWon(true);
				setCurrentQuestion("Congratulations! You reached the top!");
				setOptions([]);
			} else {
				loadQuestion(nextFloor);
			}
		} else {
			// Wrong answer feedback
			alert("Incorrect! Try again.");
		}
	};

	const resetGame = (): void => {
		setCurrentFloor(0);
		setGameWon(false);
		setTimeLeft(30); // Reset timer when resetting game
		loadQuestion(0);
	};

	return (
		<View className="flex-1">
			<ImageBackground source={images.profileBackground} className="w-full h-full " resizeMode="cover">
				<View className="mx-6 flex flex-col justify-start items-center">
					<View className="flex flex-row justify-center items-center w-full">
						<Image source={images.aiHostSmall} className="pr-4" />
						<View className="flex-1 justify-center items-center bg-grey-200/30 py-4 px-6 rounded-3xl border border-blue-200">
							<Text className="text-white font-righteous">{currentQuestion}</Text>
						</View>
					</View>
					<View className="w-full flex flex-row flex-wrap justify-between">
						{options.map((option, index) => (
							<TouchableOpacity
								key={index}
								onPress={() => handleAnswer(option)}
								activeOpacity={0.8}
								className="bg-grey-200/10 border border-blue-200 rounded-3xl py-3 w-[48%] flex justify-center items-center mt-4"
							>
								<Text className="text-xl font-righteous text-grey-200 uppercase" style={{ lineHeight: 60 }}>
									{option}
								</Text>
							</TouchableOpacity>
						))}
					</View>
				</View>

				{!gameWon && <Timer timeLeft={timeLeft} />}
				<FloorGrid currentFloor={currentFloor} totalFloors={totalFloors} />
			</ImageBackground>
		</View>
	);
}
