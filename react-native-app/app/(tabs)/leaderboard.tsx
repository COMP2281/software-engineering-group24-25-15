import { View, Text, ImageBackground, TouchableOpacity, Image, ScrollView, ImageSourcePropType, RefreshControl } from "react-native";
import { useState, useEffect } from "react";

import { fetchFriends, Friend } from "@/lib/api/friends";
import { useAuth } from "@/lib/auth/authContext";

import images from "@/constants/images";
import { AddFriendButton } from "@/components/Utilities";
import { fetchLeaderboard, LeaderboardEntry } from "@/lib/api/leaderboard";

interface Tab {
	title: string;
	active: boolean;
	onPress: () => void;
}

interface EntryProps {
	profile: ImageSourcePropType;
	name: string;
	position: number;
	score: number;
	isCurrentUser?: boolean;
}

const Tab = ({ title, active, onPress }: Tab) => (
	<TouchableOpacity onPress={onPress} className={`flex-1 py-3 bg-transparent ${active ? "border-b-2 border-gray-300" : ""}`}>
		<Text className={`text-center text-lg font-righteous ${active ? "text-gray-300" : "text-gray-400"}`}>{title}</Text>
	</TouchableOpacity>
);

const LeaderboardEntryComponent = ({ name, position, score, isCurrentUser = false }: EntryProps) => (
	<View
		className={`flex flex-row items-center justify-between px-4 py-3 border-b border-gray-300 ${isCurrentUser ? "bg-blue-100 rounded-md" : ""}`}
	>
		<View className="flex flex-row items-center">
			<Text className={`text-lg ${isCurrentUser ? "text-white" : "text-gray-400"}`}>{position}</Text>
			<Image source={images.profile1} className="w-10 h-10 rounded-full ml-4" />
			<Text className={`text-lg ml-4 font-righteous ${isCurrentUser ? "text-white" : "text-gray-300"}`}>{isCurrentUser ? "Me" : name}</Text>
		</View>
		<Text className={`text-lg ${isCurrentUser ? "text-white" : "text-gray-300"}`}>{score}</Text>
	</View>
);

const Leaderboard = () => {
	const { token, isAuthenticated, username } = useAuth();

	const [activeTab, setActiveTab] = useState("friends");
	const [friends, setFriends] = useState<Friend[]>([]);
	const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
	const [loading, setLoading] = useState(false);
	const [refreshing, setRefreshing] = useState(false);

	// Load data on initial mount
	useEffect(() => {
		if (token) {
			loadData();
		}
	}, [token]);

	// Load friends and leaderboard data
	const loadData = async () => {
		if (!token) return;
		setLoading(true);
		try {
			const [friendsData, leaderboardResult] = await Promise.all([fetchFriends(token), fetchLeaderboard(token)]);

			// Debug the structure of the returned data
			console.log("Leaderboard API response:", JSON.stringify(leaderboardResult));

			if (friendsData) {
				console.log("Friends data:", JSON.stringify(friendsData));
				setFriends(friendsData);
			}

			// Handle different possible data structures
			if (leaderboardResult) {
				let entries = [];

				// Check if the result itself is an array
				if (Array.isArray(leaderboardResult)) {
					entries = leaderboardResult;
				}
				// Check if it has an entries property that's an array
				else if (leaderboardResult.entries && Array.isArray(leaderboardResult.entries)) {
					entries = leaderboardResult.entries;
				}
				// If it's an object but not in expected format, it might be directly the entries
				else if (typeof leaderboardResult === "object") {
					console.log("Unexpected leaderboard structure, attempting to convert object to array");
					// Try to extract entries from object
					const possibleEntries = Object.values(leaderboardResult).filter(
						(item) => item && typeof item === "object" && "username" in item && "score" in item
					);
					if (possibleEntries.length > 0) {
						entries = possibleEntries;
					}
				}

				// Sort entries by score
				const sortedEntries = [...entries].sort((a, b) => b.score - a.score);
				console.log("Processed leaderboard entries:", sortedEntries);
				setLeaderboardData(sortedEntries);
			} else {
				console.log("No leaderboard data returned");
				setLeaderboardData([]);
			}
		} catch (error) {
			console.error("Error loading data:", error);
		} finally {
			setLoading(false);
			setRefreshing(false);
		}
	};

	const onRefresh = () => {
		setRefreshing(true);
		loadData();
	};

	// Check if user is a friend
	const isFriend = (username: string): boolean => {
		return friends.some((friend) => friend.username === username);
	};

	// Get the current user's username from the auth context
	const currentUsername = username;

	const renderFriendsLeaderboard = () => {
		// Filter leaderboard to only show friends and current user
		const friendsLeaderboard = leaderboardData.filter((entry) => isFriend(entry.username) || entry.username === currentUsername);

		// Sort friends by score
		const sortedFriends = friendsLeaderboard.sort((a, b) => b.score - a.score);

		return (
			<ScrollView className="flex-1 p-4" refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
				{sortedFriends.length > 0 ? (
					sortedFriends.map((entry, index) => (
						<LeaderboardEntryComponent
							key={index}
							profile={images.profile1}
							name={entry.username}
							position={index + 1}
							score={entry.score}
							isCurrentUser={entry.username === currentUsername}
						/>
					))
				) : (
					<View className="flex-1 items-center justify-center p-8">
						<Text className="text-gray-300 text-lg text-center">
							{loading ? "Loading friends..." : "Add friends to see them on the leaderboard!"}
						</Text>
					</View>
				)}
			</ScrollView>
		);
	};

	const renderGlobalLeaderboard = () => {
		return (
			<ScrollView className="flex-1 p-4" refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
				{leaderboardData.length > 0 ? (
					leaderboardData.map((entry, index) => (
						<LeaderboardEntryComponent
							key={index}
							profile={images.profile1}
							name={entry.username}
							position={index + 1}
							score={entry.score}
							isCurrentUser={entry.username === currentUsername}
						/>
					))
				) : (
					<View className="flex-1 items-center justify-center p-8">
						<Text className="text-gray-300 text-lg text-center">
							{loading ? "Loading leaderboard..." : "No leaderboard data available"}
						</Text>
					</View>
				)}
			</ScrollView>
		);
	};

	return (
		<View className="flex-1">
			<ImageBackground source={images.leaderboardBackground} className="w-full h-full" resizeMode="cover">
				<AddFriendButton />
				<View className="flex-1">
					<View className="flex-row justify-between items-center px-4 py-6">
						<Text className="text-white text-3xl font-righteous">Leaderboard</Text>
					</View>
					<View className="flex-row bg-transparent">
						<Tab title="Friends" active={activeTab === "friends"} onPress={() => setActiveTab("friends")} />
						<Tab title="Global" active={activeTab === "global"} onPress={() => setActiveTab("global")} />
					</View>
					{activeTab === "friends" ? renderFriendsLeaderboard() : renderGlobalLeaderboard()}
				</View>
			</ImageBackground>
		</View>
	);
};

export default Leaderboard;
