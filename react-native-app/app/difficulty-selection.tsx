import React, { useState } from "react";
import { View, Text, TouchableOpacity, ImageBackground } from "react-native";
import { router, useLocalSearchParams, Redirect } from "expo-router";
import { useAuth } from "@/lib/auth/authContext";
import images from "@/constants/images";
import BackButton from "@/components/Buttons";

export type Difficulty = "Easy" | "Medium" | "Hard";

interface DifficultyButtonProps {
	difficulty: Difficulty;
	selectedDifficulty: Difficulty | null;
	onSelect: (difficulty: Difficulty) => void;
}

const DifficultyButton = ({ difficulty, selectedDifficulty, onSelect }: DifficultyButtonProps) => {
	return (
		<TouchableOpacity
			onPress={() => onSelect(difficulty)}
			className={`border-2 border-blue-100 rounded-3xl p-4 mb-3 ${selectedDifficulty === difficulty ? "bg-gray-700" : "bg-black-100"}`}
			activeOpacity={0.8}
		>
			<Text className="text-grey-200 text-center text-xl font-righteous">{difficulty}</Text>
		</TouchableOpacity>
	);
};

export default function DifficultySelection() {
	const { isAuthenticated } = useAuth();
	const params = useLocalSearchParams<{ topics: string }>();
	const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null);

	// If not logged in, redirect to sign-in
	if (!isAuthenticated) {
		return <Redirect href="/sign-in" />;
	}

	const topics = params.topics ? JSON.parse(params.topics as string) : [];

	const handleSelectDifficulty = (difficulty: Difficulty) => {
		setSelectedDifficulty(difficulty);
	};

	const handleStartGame = () => {
		if (selectedDifficulty) {
			router.push({
				pathname: "/game",
				params: {
					topics: params.topics,
					difficulty: selectedDifficulty,
				},
			});
		}
	};

	return (
		<ImageBackground source={images.profileBackground} className="w-full h-full" resizeMode="cover">
			<BackButton />
			<View className="flex-1 p-6">
				<View className="flex-1 justify-center">
					<Text className="text-white text-3xl font-righteous text-center mb-8">Select Difficulty</Text>

					<Text className="text-gray-400 text-lg font-righteous text-center mb-6">{topics.join("  |  ")}</Text>

					<View className="space-y-4 mb-8">
						{(["Easy", "Medium", "Hard"] as Difficulty[]).map((difficulty) => (
							<DifficultyButton
								key={difficulty}
								difficulty={difficulty}
								selectedDifficulty={selectedDifficulty}
								onSelect={handleSelectDifficulty}
							/>
						))}
					</View>

					<TouchableOpacity
						onPress={handleStartGame}
						disabled={!selectedDifficulty}
						className={`bg-black-100 border-2 border-blue-100 rounded-3xl p-4 ${!selectedDifficulty ? "opacity-50" : ""}`}
					>
						<Text className="text-grey-200 text-center text-xl font-righteous">Start Game</Text>
					</TouchableOpacity>
				</View>
			</View>
		</ImageBackground>
	);
}
