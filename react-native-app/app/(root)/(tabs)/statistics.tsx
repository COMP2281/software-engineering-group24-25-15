import { View, Text } from "react-native";
import { ImageBackground } from "react-native";
import images from "@/constants/images";

// Dummy statistics values for demonstration
const stats = {
	gamesPlayed: 10,
	questionsAnswered: 50,
	questionsCorrect: 40,
	questionsIncorrect: 10,
	highScore: 300,
	totalScore: 1000,
};

export default function Statistics() {
	return (
		<ImageBackground source={images.mainBackground} className="w-full h-full" resizeMode="cover">
			<View className="flex-1 p-4">
				<View className="flex flex-wrap justify-between">
					{/* Games Played */}
					<View className="w-1/2 p-2">
						<View className="bg-black-100 border-2 border-blue-100 rounded-3xl h-40 justify-center items-center">
							<Text className="text-white text-2xl font-righteous">Games Played</Text>
							<Text className="text-white text-4xl font-righteous">{stats.gamesPlayed}</Text>
						</View>
					</View>
					{/* Questions Answered */}
					<View className="w-1/2 p-2">
						<View className="bg-black-100 border-2 border-blue-100 rounded-3xl h-40 justify-center items-center">
							<Text className="text-white text-2xl font-righteous">Questions Answered</Text>
							<Text className="text-white text-4xl font-righteous">{stats.questionsAnswered}</Text>
						</View>
					</View>
					{/* Questions Correct */}
					<View className="w-1/2 p-2">
						<View className="bg-black-100 border-2 border-blue-100 rounded-3xl h-40 justify-center items-center">
							<Text className="text-white text-2xl font-righteous">Questions Correct</Text>
							<Text className="text-white text-4xl font-righteous">{stats.questionsCorrect}</Text>
						</View>
					</View>
					{/* Questions Incorrect */}
					<View className="w-1/2 p-2">
						<View className="bg-black-100 border-2 border-blue-100 rounded-3xl h-40 justify-center items-center">
							<Text className="text-white text-2xl font-righteous">Questions Incorrect</Text>
							<Text className="text-white text-4xl font-righteous">{stats.questionsIncorrect}</Text>
						</View>
					</View>
					{/* High Score */}
					<View className="w-1/2 p-2">
						<View className="bg-black-100 border-2 border-blue-100 rounded-3xl h-40 justify-center items-center">
							<Text className="text-white text-2xl font-righteous">High Score</Text>
							<Text className="text-white text-4xl font-righteous">{stats.highScore}</Text>
						</View>
					</View>
					{/* Total Score */}
					<View className="w-1/2 p-2">
						<View className="bg-black-100 border-2 border-blue-100 rounded-3xl h-40 justify-center items-center">
							<Text className="text-white text-2xl font-righteous">Total Score</Text>
							<Text className="text-white text-4xl font-righteous">{stats.totalScore}</Text>
						</View>
					</View>
				</View>
			</View>
		</ImageBackground>
	);
}
