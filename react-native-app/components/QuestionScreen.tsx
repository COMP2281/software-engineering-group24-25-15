import React from "react";
import { View, Text, ImageBackground, TouchableOpacity, Image } from "react-native";
import images from "@/constants/images";
import { Question } from "@/lib/api/gameService";
import { bots } from "@/constants/data";

type QuestionScreenProps = {
	currentRound: number;
	currentQuestionIndex: number;
	topics: string[];
	totalScore: number;
	timeLeft: number;
	currentQuestion: Question | null;
	hintUsed: boolean;
	eliminationUsed: boolean;
	eliminatedOptions: boolean[];
	onAnswer: (selectedOption: string) => void;
	onHint: () => void;
	onElimination: () => void;
	onExit: () => void;
};

const QuestionScreen: React.FC<QuestionScreenProps> = ({
	currentRound,
	currentQuestionIndex,
	topics,
	totalScore,
	timeLeft,
	currentQuestion,
	hintUsed,
	eliminationUsed,
	eliminatedOptions,
	onAnswer,
	onHint,
	onElimination,
	onExit,
}) => {
	return (
		<ImageBackground source={images.subBackground} className="w-full h-full" resizeMode="cover">
			<View className="flex-1 justify-between p-6">
				{/* Top Section: Header, timer, score and the question */}
				<View>
					{/* Header and Timer */}
					<View className="flex-row items-center mt-10 justify-between">
						<TouchableOpacity onPress={onExit}>
							<Text className="text-white text-xl font-righteous">Exit</Text>
						</TouchableOpacity>
						<Text className="text-white text-xl font-righteous">Time: {timeLeft}s</Text>
					</View>

					{/* Round and Score Display */}
					<View className="mt-2 flex-row justify-between">
						<Text className="text-white text-xl font-righteous">
							Round {currentRound + 1}/{Array.isArray(topics) ? topics.length : 0}
						</Text>
						<Text className="text-white text-xl font-righteous">Score: {totalScore}</Text>
					</View>

					{/* Progress indicator - with safe values */}
					<View className="mt-2 flex-row justify-center">
						<Text className="text-white text-lg font-righteous">
							Question {currentQuestionIndex + 1}/{currentQuestion && Array.isArray(currentQuestion.options) ? 3 : 3}
						</Text>
					</View>

					{/* Question display - with safety check */}
					{currentQuestion && (
						<View className="mt-6 bg-black-200 p-4 rounded-2xl border-2 border-blue-200">
							<Text className="text-white text-lg font-righteous">{currentQuestion.question}</Text>
						</View>
					)}
				</View>

				{/* Graphics Section: Players and host */}
				<View className="mt-6">
					{/* Player images row - with safe array handling */}
					<View className="flex-row justify-around">
						{Array.isArray(bots) &&
							bots.map((bot, index) => (
								<Image
									key={index}
									source={bot?.image || images.profile1} // Provide default image as fallback
									className={`w-16 h-16 rounded-full border-2 border-blue-100 ${index === 1 || index === 2 ? "-mt-10" : ""}`}
								/>
							))}
						<Image source={images.profile1} className="w-16 h-16 rounded-full border-2 border-blue-300" />
					</View>

					{/* Host image */}
					<View className="flex-row justify-center my-4">
						<Image source={images.profile3} className="w-28 h-28 rounded-full border-2 border-blue-100 -mt-5" />
					</View>

					{/* Host message */}
					<View className="mt-4 bg-black-200 p-4 rounded-2xl border-2 border-blue-200 mx-12">
						<Text className="text-white text-xl font-righteous text-center">
							{timeLeft < 5 ? "Hurry up! Time's almost out!" : currentQuestion ? "Choose the correct answer!" : "Loading question..."}
						</Text>
					</View>
				</View>

				{/* Bottom Section: Answer options and help buttons */}
				<View className="mb-10">
					{/* Debug info to see if we have a question */}
					{!currentQuestion && <Text className="text-white text-lg font-righteous text-center mb-4">Waiting for questions to load...</Text>}

					{/* Fallback if no options array */}
					{currentQuestion && (!Array.isArray(currentQuestion.options) || currentQuestion.options.length === 0) && (
						<>
							{["Option A", "Option B", "Option C", "Option D"].map((option, index) => (
								<TouchableOpacity
									key={index}
									onPress={() => onAnswer(option)}
									className="bg-black-100 border-2 border-blue-100 rounded-3xl p-3 mb-2"
								>
									<Text className="text-grey-200 text-center text-xl font-righteous">{option}</Text>
								</TouchableOpacity>
							))}
						</>
					)}

					{/* Answer options - with enhanced safety checks */}
					{currentQuestion &&
						Array.isArray(currentQuestion.options) &&
						currentQuestion.options.length > 0 &&
						currentQuestion.options.map((option, index) => {
							const isEliminated =
								Array.isArray(eliminatedOptions) && eliminatedOptions.length > index ? eliminatedOptions[index] : false;

							return (
								<TouchableOpacity
									key={index}
									onPress={() => !isEliminated && option && onAnswer(option)}
									disabled={isEliminated}
									className={`bg-black-100 border-2 border-blue-100 rounded-3xl p-3 mb-2 ${isEliminated ? "opacity-50" : ""}`}
								>
									<Text className="text-grey-200 text-center text-xl font-righteous">{option || `Option ${index + 1}`}</Text>
								</TouchableOpacity>
							);
						})}

					{/* Extra Buttons Row */}
					<View className="flex-row justify-between mt-2">
						<TouchableOpacity
							onPress={onHint}
							disabled={hintUsed}
							className={`bg-black-100 border-2 border-blue-100 rounded-3xl p-3 flex-1 mr-2 ${hintUsed ? "opacity-50" : ""}`}
						>
							<Text className="text-grey-200 text-center text-xl font-righteous">Hint</Text>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={onElimination}
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
};

export default QuestionScreen;
