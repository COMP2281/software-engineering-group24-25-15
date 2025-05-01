import React from "react";
import { View, Text, ImageBackground, TouchableOpacity } from "react-native";
import images from "@/constants/images";

type BotPlayer = {
	name: string;
	image: any;
};

type RoundSummaryScreenProps = {
	currentRound: number;
	roundScore: number;
	totalScore: number;
	botPlayers: BotPlayer[];
	botScores: number[];
	onNextRound: () => void;
};

const RoundSummaryScreen: React.FC<RoundSummaryScreenProps> = ({ currentRound, roundScore, totalScore, botPlayers, botScores, onNextRound }) => {
	const safeBotPlayers = Array.isArray(botPlayers) ? botPlayers : [];
	const safeBotScores = Array.isArray(botScores) ? botScores : [];

	return (
		<ImageBackground source={images.subBackground} className="w-full h-full" resizeMode="cover">
			<View className="flex-1 justify-center p-6">
				<Text className="text-white text-3xl font-righteous text-center mb-6">Round {currentRound + 1} Complete</Text>

				<View className="bg-black-200 p-6 rounded-2xl border-2 border-blue-200 mb-8">
					<Text className="text-white text-xl font-righteous mb-4">Scores this round:</Text>

					<Text className="text-white text-lg font-righteous">You: {roundScore} points</Text>

					{safeBotPlayers.map((bot, index) => {
						let botRoundScore = 0;
						if (index < safeBotScores.length) {
							if (currentRound > 0) {
								const previousTotal = Math.floor(safeBotScores[index] / (currentRound + 1));
								botRoundScore = safeBotScores[index] - previousTotal;
							} else {
								botRoundScore = safeBotScores[index];
							}
						}
						return (
							<Text key={index} className="text-white text-lg font-righteous">
								{bot.name || `Bot ${index + 1}`}: {botRoundScore} points
							</Text>
						);
					})}
				</View>

				<Text className="text-white text-xl font-righteous text-center mb-6">Total Score: {totalScore}</Text>

				<TouchableOpacity onPress={onNextRound} className="bg-black-100 border-2 border-blue-100 rounded-3xl p-4 mt-4">
					<Text className="text-grey-200 text-center text-xl font-righteous">Next Round</Text>
				</TouchableOpacity>
			</View>
		</ImageBackground>
	);
};

export default RoundSummaryScreen;
