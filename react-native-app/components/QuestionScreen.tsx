import React from "react";
import { View, Text, ImageBackground, TouchableOpacity, Image, ScrollView } from "react-native";
import images from "@/constants/images";
import icons from "@/constants/icons";
import { Question } from "@/lib/api/gameService";
import { Timer } from "@/components/Utilities";
import TypewriterText from "./TypewriterText";
import { useState, useEffect } from "react";

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

const BotProfile = ({ tintColor, answered }: { tintColor: string; answered: boolean }) => (
	<View
		className={`flex-col items-center justify-center p-4 bg-gray-800/70 border-2 ${
			answered ? "border-green-400" : "border-blue-200"
		} rounded-full`}
	>
		<Image source={icons.robot} className="size-16" tintColor={tintColor} />
	</View>
);

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
	// State to track if the bots have answered
	const [botAnswers, setBotAnswers] = useState([false, false, false]);

	useEffect(() => {
		// Set a random timeout for each bot to change its answered state
		const timeouts = botAnswers.map(
			(_, index) =>
				setTimeout(() => {
					setBotAnswers((prev) => {
						const updated = [...prev];
						updated[index] = true;
						return updated;
					});
				}, Math.random() * (timeLeft * 1000 - 2000)) // Random time before timeLeft hits zero
		);

		// Cleanup timeouts on unmount or when timeLeft changes
		return () => timeouts.forEach((timeout) => clearTimeout(timeout));
	}, [timeLeft]);
	// Get host message based on time left
	const hostMessage = timeLeft < 5 ? "Hurry up! Time's almost out!" : currentQuestion ? "Choose the correct answer!" : "Loading question...";

	return (
		<ImageBackground source={images.leaderboardBackground} className="w-full h-full" resizeMode="cover">
			<View className="flex-col justify-center items-center px-6 py-2 w-full h-full">
				<View className="flex-1 justify-between">
					{/* Header and Timer */}
					<View className="flex-row items-center justify-between mt-2">
						<TouchableOpacity onPress={onExit}>
							<Image source={icons.back} className="size-10" tintColor={"#fff"} />
						</TouchableOpacity>
						<Timer timeLeft={timeLeft} bgColor="bg-transparent" />
					</View>

					{/* Round and Score Display */}
					<View className="flex-row justify-between items-center px-10 py-2 bg-gray-600/20 rounded-full">
						<Text className="text-white text-xl font-righteous">
							Round {currentRound + 1}/{Array.isArray(topics) ? topics.length : 0}
						</Text>
						<Text className="text-white text-lg font-righteous">Question {currentQuestionIndex + 1}/3</Text>
						<Text className="text-white text-xl font-righteous">Score: {totalScore}</Text>
					</View>

					<View className="flex flex-row justify-center items-center w-full h-48">
						<Image source={images.aiHostSmall} className="pr-4" />
						<View className="flex-1 justify-center items-center bg-grey-200/30 py-4 px-6 rounded-3xl border border-blue-200 h-full">
							<ScrollView
								contentContainerClassName=""
								showsVerticalScrollIndicator={true} // Changed to true to show scrollbar
								indicatorStyle="white" // White scrollbar indicator
							>
								<Text className="text-white text-lg font-righteous">{currentQuestion?.question || "Loading question..."}</Text>
							</ScrollView>
						</View>
					</View>

					{/* Host message bubble at bottom, not overlapping host */}
					<View className="">
						<View className="p-4 rounded-full bg-gray-800/70">
							<TypewriterText className="text-white text-lg font-righteous text-center" text={hostMessage} speed={40} />
						</View>
					</View>

					<View className="flex-row justify-between items-center mt-2 px-10 py-2">
						<BotProfile tintColor={""} answered={botAnswers[0]} />
						<BotProfile tintColor={""} answered={botAnswers[1]} />
						<BotProfile tintColor={""} answered={botAnswers[2]} />
					</View>
				</View>

				<View className="flex-col w-full justify-between items-center mt-3 h-1/3">
					<ScrollView
						className="w-full"
						contentContainerClassName="w-full"
						showsVerticalScrollIndicator={true} // Changed to true to show scrollbar
						indicatorStyle="white" // White scrollbar indicator
					>
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
										className={`w-full border-2 border-blue-100 rounded-3xl mb-2 py-4 px-4 ${isEliminated ? "opacity-50" : ""}`}
									>
										<View className="flex items-center justify-center px-3 w-full">
											<Text className="text-grey-200 text-center font-righteous" style={{ fontSize: 18 }} numberOfLines={2}>
												{option || `Option ${index + 1}`}
											</Text>
										</View>
									</TouchableOpacity>
								);
							})}
					</ScrollView>
				</View>
				{/* Extra Buttons Row */}
				<View className="flex-row justify-between mt-2">
					<TouchableOpacity
						onPress={onHint}
						disabled={hintUsed}
						className={`border-2 border-blue-100 rounded-3xl flex-1 mr-2 ${hintUsed ? "opacity-50" : ""}`}
						style={{ height: 50, justifyContent: "center" }}
					>
						<Text className="text-grey-200 text-center font-righteous" style={{ fontSize: 18 }}>
							Hint
						</Text>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={onElimination}
						disabled={eliminationUsed}
						className={`border-2 border-blue-100 rounded-3xl flex-1 ml-2 ${eliminationUsed ? "opacity-50" : ""}`}
						style={{ height: 50, justifyContent: "center" }}
					>
						<Text className="text-grey-200 text-center font-righteous" style={{ fontSize: 18 }}>
							50/50
						</Text>
					</TouchableOpacity>
				</View>
			</View>
		</ImageBackground>
	);
};

export default QuestionScreen;
