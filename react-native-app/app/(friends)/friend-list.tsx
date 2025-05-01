import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl, Image, ImageBackground } from "react-native";
import { router } from "expo-router";

import { fetchFriends, Friend } from "@/lib/api/friends";
import { useAuth } from "@/lib/auth/authContext";

import { BackButton, AddFriendButton } from "@/components/Utilities";

import images from "@/constants/images";
import icons from "@/constants/icons";
import { friendsList } from "@/constants/data";

const FriendListScreen = () => {
	const { token, isAuthenticated } = useAuth();

	const [friends, setFriends] = useState<Friend[]>([]);
	const [loading, setLoading] = useState(false);
	const [refreshing, setRefreshing] = useState(false);

	const loadFriends = async () => {
		// if (!token) return;
		// setLoading(true);
		// try {
		// 	const data = await fetchFriends(token);
		// 	setFriends(data);
		// } catch (error) {
		// 	console.error("Error loading friends:", error);
		// } finally {
		// 	setLoading(false);
		// }
		setFriends(friendsList);
	};

	// Load friends on initial render
	useEffect(() => {
		if (isAuthenticated) {
			loadFriends();
		}
	}, [isAuthenticated, token]);

	const handleRefresh = async () => {
		setRefreshing(true);
		await loadFriends();
		setRefreshing(false);
	};

	const navigateToRequests = () => {
		router.push("/friend-requests");
	};

	const navigateToAddFriend = () => {
		router.push("/add-friend");
	};

	const renderFriendItem = ({ item }: { item: Friend }) => (
		<View className="flex-row items-center p-4 mt-4 rounded-lg shadow bg-gray-700 border-blue-100">
			<View className="w-12 h-12 rounded-full bg-gray-300 justify-center items-center relative">
				{item.avatar ? (
					<Image source={item.avatar} className="w-12 h-12 rounded-full" />
				) : (
					<Image source={images.profile1} className="w-12 h-12 rounded-full" />
				)}
				<View
					className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
						item.status === "online" ? "bg-green-500" : item.status === "in-game" ? "bg-blue-500" : "bg-gray-500"
					}`}
				/>
			</View>
			<View className="flex-1 ml-3">
				<Text className="text-base font-semibold text-white">{item.username}</Text>
				<Text className="text-sm text-gray-100 mt-0.5">{item.status}</Text>
			</View>
		</View>
	);

	if (loading && !refreshing) {
		return (
			<View className="flex-1 justify-center items-center">
				<ActivityIndicator size="large" color="#2196F3" />
			</View>
		);
	}

	return (
		<View className="flex-1">
			<ImageBackground source={images.leaderboardBackground} className="flex-1 items-center" resizeMode="cover">
				<BackButton />
				<AddFriendButton />
				<View className="mt-32 w-4/5 flex items-center mb-8 pb-10 border-b-2 border-grey-200">
					<Text className="text-5xl font-righteous text-white text-center mb-2">Friends</Text>
				</View>
				<FlatList
					className="w-4/5"
					data={friends}
					showsVerticalScrollIndicator={false}
					showsHorizontalScrollIndicator={false}
					renderItem={renderFriendItem}
					keyExtractor={(item) => item.id.toString()}
					contentContainerStyle={{ flexGrow: 1, paddingBottom: 16 }}
					refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={["#2196F3"]} />}
					ListEmptyComponent={
						<View className="flex-1 justify-center items-center">
							<Text className="text-xl text-white font-righteous mb-4">No friends yet</Text>
							<TouchableOpacity className="py-2.5 px-4 bg-blue-800 rounded-full" onPress={navigateToAddFriend}>
								<Text className="text-white font-semibold">Add Friends</Text>
							</TouchableOpacity>
						</View>
					}
				/>
			</ImageBackground>
		</View>
	);
};

export default FriendListScreen;
