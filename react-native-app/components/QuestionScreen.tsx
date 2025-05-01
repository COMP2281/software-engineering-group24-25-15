import React from "react";
import { View, Text, ImageBackground, TouchableOpacity, Image, ScrollView } from "react-native";
import images from "@/constants/images";
import { Question } from "@/lib/api/gameService";
import { bots } from "@/constants/data";
import TypewriterText from "./TypewriterText";

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
	// Get host message based on time left
	const hostMessage = timeLeft < 5 
		? "Hurry up! Time's almost out!" 
		: currentQuestion 
			? "Choose the correct answer!" 
			: "Loading question...";

	return (
		<ImageBackground source={images.subBackground} className="w-full h-full" resizeMode="cover">
			<View className="flex-1 justify-between p-6">
				{/* Top Section with fixed height to prevent movement */}
				<View style={{ height: 200 }}>
					{/* Header and Timer */}
					<View className="flex-row items-center justify-between mt-6">
						<TouchableOpacity onPress={onExit}>
							<Text className="text-white text-xl font-righteous">Exit</Text>
						</TouchableOpacity>
						<Text className="text-white text-xl font-righteous">Time: {timeLeft}s</Text>
					</View>

					{/* Round and Score Display */}
					<View className="flex-row justify-between items-center mt-2">
						<Text className="text-white text-xl font-righteous">
							Round {currentRound + 1}/{Array.isArray(topics) ? topics.length : 0}
						</Text>
						<Text className="text-white text-lg font-righteous">
							Question {currentQuestionIndex + 1}/3
						</Text>
						<Text className="text-white text-xl font-righteous">Score: {totalScore}</Text>
					</View>

					{/* Question display with larger height and visible scrollbar */}
					<View className="mt-3 bg-black-200 rounded-2xl border-2 border-blue-200" style={{ height: 120 }}>
						<ScrollView 
							contentContainerStyle={{ padding: 16 }}
							showsVerticalScrollIndicator={true} // Changed to true to show scrollbar
							indicatorStyle="white" // White scrollbar indicator
						>
							<Text className="text-white text-lg font-righteous">
								{currentQuestion?.question || "Loading question..."}
							</Text>
						</ScrollView>
					</View>
				</View>

				{/* Middle Section: Host and players with fixed height and positions */}
				<View style={{ height: 320 }} className="my-1">
					{/* Use an absolute container so we can position each image precisely */}
					<View className="absolute w-full h-full">
						{/* Top row: Two players slightly higher - Increased size */}
						{/* Middle Left */}
						<View style={{ position: 'absolute', top: '5%', left: '28%' }}>
							<Image 
								source={bots[0]?.image || images.profile1} 
								className="w-20 h-20 rounded-full border-2 border-blue-100" // Increased from 16 to 20
							/>
						</View>
						{/* Middle Right */}
						<View style={{ position: 'absolute', top: '5%', right: '28%' }}>
							<Image 
								source={bots[1]?.image || images.profile2} 
								className="w-20 h-20 rounded-full border-2 border-blue-100" // Increased from 16 to 20
							/>
						</View>

						{/* Second row: Two players slightly lower and further to the left/right */}
						{/* Lower Left */}
						<View style={{ position: 'absolute', top: '15%', left: '8%' }}>
							<Image 
								source={bots[2]?.image || images.profile3} 
								className="w-20 h-20 rounded-full border-2 border-blue-100" // Increased from 16 to 20
							/>
						</View>
						{/* Lower Right */}
						<View style={{ position: 'absolute', top: '15%', right: '8%' }}>
							<Image 
								source={images.profile1} 
								className="w-20 h-20 rounded-full border-2 border-blue-300" // Increased from 16 to 20
							/>
						</View>

						{/* Host in the center - fixed proper centering */}
						<View style={{ 
							position: 'absolute',
							left: '50%',
							top: '50%',
							transform: [{ translateX: -72 }, { translateY: -72 }]
						}}>
							<Image 
								source={images.profile3} 
								className="w-36 h-36 rounded-full border-2 border-blue-100" 
							/>
						</View>
					</View>

					{/* Host message bubble at bottom, not overlapping host */}
					<View className="absolute bottom-0 left-0 right-0">
						<View 
							className="bg-black-200 p-4 rounded-2xl border-2 border-blue-200 mx-6" 
							style={{ height: 60, justifyContent: 'center' }}
						>
							<TypewriterText 
								className="text-white text-lg font-righteous text-center" 
								text={hostMessage} 
								speed={40}
							/>
						</View>
					</View>
				</View>

				{/* Bottom Section: Answer buttons with visible scrollbar */}
				<View style={{ height: 250 }} className="mt-1">
					{/* Answer options with consistent height and visible scrollbar */}
					<ScrollView 
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
										className={`bg-black-100 border-2 border-blue-100 rounded-3xl mb-2 ${isEliminated ? "opacity-50" : ""}`}
										style={{ height: 54, justifyContent: 'center' }}
									>
										{/* Center text and make it larger */}
										<View className="flex items-center justify-center px-3">
											<Text 
												className="text-grey-200 text-center font-righteous" 
												style={{ fontSize: 18 }}
												numberOfLines={2}
											>
												{option || `Option ${index + 1}`}
											</Text>
										</View>
									</TouchableOpacity>
								);
							})}
					</ScrollView>

					{/* Extra Buttons Row */}
					<View className="flex-row justify-between mt-2">
						<TouchableOpacity
							onPress={onHint}
							disabled={hintUsed}
							className={`bg-black-100 border-2 border-blue-100 rounded-3xl flex-1 mr-2 ${hintUsed ? "opacity-50" : ""}`}
							style={{ height: 50, justifyContent: 'center' }}
						>
							<Text className="text-grey-200 text-center font-righteous" style={{ fontSize: 18 }}>Hint</Text>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={onElimination}
							disabled={eliminationUsed}
							className={`bg-black-100 border-2 border-blue-100 rounded-3xl flex-1 ml-2 ${eliminationUsed ? "opacity-50" : ""}`}
							style={{ height: 50, justifyContent: 'center' }}
						>
							<Text className="text-grey-200 text-center font-righteous" style={{ fontSize: 18 }}>50/50</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</ImageBackground>
	);
};

export default QuestionScreen;
