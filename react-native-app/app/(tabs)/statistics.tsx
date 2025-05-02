import { View, Text } from "react-native";
import { ImageBackground } from "react-native";
import images from "@/constants/images";
import { useAuth } from "@/lib/auth/authContext";
import { fetchStatistics } from "@/lib/api/statistics";
import { useState, useCallback } from "react";
import { RefreshControl, ScrollView } from "react-native";

interface StatisticsData {
	score: number;
	games: number;
	wins: number;
}

export default function Statistics() {
	const { username, token } = useAuth();
	const [data, setData] = useState<StatisticsData>({ score: 0, games: 0, wins: 0 });
	const [refreshing, setRefreshing] = useState(false);

	// Fetch statistics data
	const fetchData = async () => {
		if (token) {
			const data = await fetchStatistics(token);
			if (data) {
				setData(data);
			} else {
				console.error("Failed to fetch statistics data");
			}
		}
	};

	// Handle refresh
	const onRefresh = useCallback(async () => {
		setRefreshing(true);
		await fetchData();
		setRefreshing(false);
	}, [token]);

	// Render the component with a background image and scroll to refresh
	return (
		<ImageBackground source={images.leaderboardBackground} className="w-full h-full" resizeMode="cover">
			<ScrollView contentContainerStyle={{ flex: 1 }} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
				<View className="flex items-center justify-center w-full h-full">
					<Text className="text-white font-righteous text-3xl">Statistics</Text>
					<Text className="text-gray-300 font-righteous text-xl mb-10">{username}</Text>

					<View className="flex flex-row justify-around items-center w-full">
						<View className="flex items-center justify-center w-1/4 bg-gray-800 rounded-lg border-2 border-blue-300 p-4">
							<Text className="text-white font-righteous text-2xl">Games</Text>
							<Text className="text-gray-300 font-righteous text-2xl">{data.games}</Text>
						</View>
						<View className="flex items-center justify-center w-1/4 bg-gray-800 rounded-lg border-2 border-blue-300 p-4">
							<Text className="text-white font-righteous text-2xl">Score</Text>
							<Text className="text-gray-300 font-righteous text-2xl">{data.score}</Text>
						</View>
						<View className="flex items-center justify-center w-1/4 bg-gray-800 rounded-lg border-2 border-blue-300 p-4">
							<Text className="text-white font-righteous text-2xl">Wins</Text>
							<Text className="text-gray-300 font-righteous text-2xl">{data.wins}</Text>
						</View>
					</View>
				</View>
			</ScrollView>
		</ImageBackground>
	);
}
