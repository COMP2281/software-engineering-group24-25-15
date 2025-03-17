import React from "react";
import { View, Text, ImageBackground, TouchableOpacity } from "react-native";
import images from "@/constants/images";

type BotPlayer = {
	name: string;
	image: any;
};

type GameSummaryScreenProps = {
	totalScore: number;
	correctCount: number;
	topics: string[];
	botPlayers: BotPlayer[];
	botScores: number[];
	onReturnHome: () => void;
};

const GameSummaryScreen: React.FC<GameSummaryScreenProps> = ({ totalScore, correctCount, topics, botPlayers, botScores, onReturnHome }) => {
	const safeBotPlayers = Array.isArray(botPlayers) ? botPlayers : [];
	const safeBotScores = Array.isArray(botScores) ? botScores : [];

	const allPlayers = [
		{ name: "You", score: totalScore },
		...safeBotPlayers.map((bot, index) => ({
			name: bot.name || `Bot ${index + 1}`,
			score: index < safeBotScores.length ? safeBotScores[index] : 0,
		})),
	].sort((a, b) => b.score - a.score);

	const userRank = allPlayers.findIndex((player) => player.name === "You") + 1;
	const safeTopicsLength = Array.isArray(topics) ? topics.length : 0;
	const totalQuestions = safeTopicsLength * 3;

	return (
		<ImageBackground source={images.subBackground} className="w-full h-full" resizeMode="cover">
			<View className="flex-1 justify-center p-6">
				<Text className="text-white text-3xl font-righteous text-center mb-6">Game Complete</Text>

				<View className="bg-black-200 p-6 rounded-2xl border-2 border-blue-200 mb-8">
					<Text className="text-white text-xl font-righteous mb-4">Final Scores:</Text>

					{allPlayers.map((player, index) => (
						<Text key={index} className={`text-white text-lg font-righteous ${player.name === "You" ? "text-blue-300" : ""}`}>
							{index + 1}. {player.name}: {player.score} points
						</Text>
					))}
				</View>

				<Text className="text-white text-xl font-righteous text-center mb-2">
					You answered {correctCount} out of {totalQuestions} questions correctly
				</Text>

				<Text className="text-white text-xl font-righteous text-center mb-6">
					{userRank === 1 ? "Congratulations! You won!" : `You placed ${userRank}${userRank === 2 ? "nd" : userRank === 3 ? "rd" : "th"}`}
				</Text>

				<TouchableOpacity onPress={onReturnHome} className="bg-black-100 border-2 border-blue-100 rounded-3xl p-4 mt-4">
					<Text className="text-grey-200 text-center text-xl font-righteous">Return to Home</Text>
				</TouchableOpacity>
			</View>
		</ImageBackground>
	);
};

export default GameSummaryScreen;
