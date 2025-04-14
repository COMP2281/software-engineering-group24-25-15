import React, { useEffect, useState } from "react";
import { View, Text, ImageBackground, TouchableOpacity, Image, FlatList, ActivityIndicator, Alert } from "react-native";
import { router } from "expo-router";

import { BackButton, AddFriendButton } from "@/components/Utilities";
import { fetchReceivedRequests, fetchSentRequests, acceptFriendRequest, FriendRequest } from "@/lib/api/friends";
import { useAuth } from "@/lib/auth/authContext";

import images from "@/constants/images";
import icons from "@/constants/icons";

interface RequestProps {
	username: string;
	onAccept?: () => void;
	isPending?: boolean;
	isSent?: boolean;
}

const RequestItem = ({ username, onAccept, isPending = false, isSent = false }: RequestProps) => (
	<View className="flex flex-row items-center justify-between px-4 py-3 border-2 rounded-2xl bg-black-50 border-blue-100 w-4/5 h-20 mb-4">
		<View className="flex flex-row items-center">
			<Image source={images.profile1} className="size-12 rounded-full mr-3" />
			<Text className="text-xl text-white font-righteous">{username}</Text>
		</View>
		{!isSent && onAccept ? (
			<TouchableOpacity onPress={onAccept} activeOpacity={0.5} disabled={isPending}>
				{isPending ? (
					<ActivityIndicator size="small" color="#83b0d0" />
				) : (
					<Text className="text-lg text-blue-100 font-righteous">Accept</Text>
				)}
			</TouchableOpacity>
		) : (
			<Text className="text-lg text-gray-400 font-righteous">Pending</Text>
		)}
	</View>
);

const FriendRequestsScreen = () => {
	const { token } = useAuth();
	const [receivedRequests, setReceivedRequests] = useState<FriendRequest[]>([]);
	const [sentRequests, setSentRequests] = useState<FriendRequest[]>([]);
	const [loading, setLoading] = useState(false);
	const [activeTab, setActiveTab] = useState<"received" | "sent">("received");
	const [pendingAccept, setPendingAccept] = useState<Record<number, boolean>>({});

	const loadRequests = async () => {
		if (!token) return;

		setLoading(true);
		try {
			const [received, sent] = await Promise.all([fetchReceivedRequests(token), fetchSentRequests(token)]);
			setReceivedRequests(received);
			setSentRequests(sent);
		} catch (error) {
			console.error("Error loading friend requests:", error);
			Alert.alert("Error", "Failed to load friend requests. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadRequests();
	}, [token]);

	const handleAcceptRequest = async (requestId: number) => {
		if (!token) return;

		setPendingAccept((prev) => ({ ...prev, [requestId]: true }));
		try {
			await acceptFriendRequest(token, requestId);
			// Remove from received requests
			setReceivedRequests((requests) => requests.filter((request) => request.id !== requestId));
			Alert.alert("Success", "Friend request accepted!");
		} catch (error) {
			console.error("Error accepting friend request:", error);
			Alert.alert("Error", "Failed to accept friend request. Please try again.");
		} finally {
			setPendingAccept((prev) => ({ ...prev, [requestId]: false }));
		}
	};

	return (
		<View className="flex-1">
			<ImageBackground source={images.profileBackground} className="w-full h-full flex items-center" resizeMode="cover">
				<BackButton />
				<AddFriendButton />
				<View className="mt-32 w-full flex items-center mb-6">
					<Text className="text-5xl font-righteous text-white text-center mb-4">Friend Requests</Text>

					<View className="flex-row justify-center space-x-4 w-4/5 mb-6">
						<TouchableOpacity
							className={`py-2 px-4 rounded-full border ${
								activeTab === "received" ? "bg-black-50  border-blue-100" : "bg-transparent border-transparent"
							}`}
							onPress={() => setActiveTab("received")}
						>
							<Text className={`text-lg font-righteous ${activeTab === "received" ? "text-blue-100" : "text-white"}`}>
								Received ({receivedRequests.length})
							</Text>
						</TouchableOpacity>

						<TouchableOpacity
							className={`py-2 px-4 rounded-full border ${
								activeTab === "sent" ? "bg-black-50 border-blue-100" : "bg-transparent border-transparent"
							}`}
							onPress={() => setActiveTab("sent")}
						>
							<Text className={`text-lg font-righteous ${activeTab === "sent" ? "text-blue-100" : "text-white"}`}>
								Sent ({sentRequests.length})
							</Text>
						</TouchableOpacity>
					</View>
				</View>

				{loading ? (
					<ActivityIndicator size="large" color="#83b0d0" className="mt-8" />
				) : activeTab === "received" ? (
					<FlatList
						data={receivedRequests}
						renderItem={({ item }) => (
							<RequestItem
								username={item.from_user.username}
								onAccept={() => handleAcceptRequest(item.id)}
								isPending={pendingAccept[item.id]}
							/>
						)}
						keyExtractor={(item) => item.id.toString()}
						className="w-full"
						contentContainerStyle={{ alignItems: "center", paddingBottom: 20 }}
						ListEmptyComponent={<Text className="text-lg text-grey-200 mt-4">No received requests</Text>}
					/>
				) : (
					<FlatList
						data={sentRequests}
						renderItem={({ item }) => <RequestItem username={item.to_user.username} isSent={true} />}
						keyExtractor={(item) => item.id.toString()}
						className="w-full"
						contentContainerStyle={{ alignItems: "center", paddingBottom: 20 }}
						ListEmptyComponent={<Text className="text-lg text-grey-200 mt-4">No sent requests</Text>}
					/>
				)}
			</ImageBackground>
		</View>
	);
};

export default FriendRequestsScreen;
