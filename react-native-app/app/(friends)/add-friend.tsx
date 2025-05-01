import { View, Text, ImageBackground, TextInput, TouchableOpacity, Image, FlatList, ActivityIndicator, Alert } from "react-native";
import { useState } from "react";

import { BackButton } from "@/components/Utilities";
import { searchUsers, sendFriendRequest } from "@/lib/api/friends";
import { useAuth } from "@/lib/auth/authContext";

import images from "@/constants/images";
import icons from "@/constants/icons";

interface UserProps {
	id: number;
	username: string;
	onPress: () => void;
	isLoading?: boolean;
}

const User = ({ username, onPress, isLoading = false }: UserProps) => (
	<View className="flex flex-row items-center justify-between px-4 py-3 border-2 rounded-2xl bg-black-50 border-blue-100 w-4/5 h-20 mb-4">
		<View className="flex flex-row items-center">
			<Image source={images.profile1} className="size-12 rounded-full mr-3" />
			<Text className="text-xl text-white font-righteous">{username}</Text>
		</View>
		<TouchableOpacity onPress={onPress} activeOpacity={0.5} disabled={isLoading}>
			{isLoading ? <ActivityIndicator size="small" color="#83b0d0" /> : <Text className="text-lg text-blue-100 font-righteous">Add</Text>}
		</TouchableOpacity>
	</View>
);

const AddFriend = () => {
	const { token } = useAuth();
	const [username, setUsername] = useState("");
	const [searchResults, setSearchResults] = useState<any[]>([]);
	const [isSearching, setIsSearching] = useState(false);
	const [pendingRequests, setPendingRequests] = useState<Record<number, boolean>>({});

	const handleSearch = async () => {
		if (!username.trim() || !token) return;

		setIsSearching(true);
		try {
			const results = await searchUsers(token, username.trim());
			setSearchResults(results);
		} catch (error) {
			console.error("Error searching users:", error);
			Alert.alert("Error", "Failed to search for users. Please try again.");
		} finally {
			setIsSearching(false);
		}
	};

	const handleSendRequest = async (userId: number) => {
		if (!token) return;

		setPendingRequests((prev) => ({ ...prev, [userId]: true }));
		try {
			await sendFriendRequest(token, userId);
			Alert.alert("Success", "Friend request sent successfully");
			// Remove the user from search results after successful request
			setSearchResults((results) => results.filter((user) => user.id !== userId));
		} catch (error) {
			console.error("Error sending friend request:", error);
			Alert.alert("Error", "Failed to send friend request. Please try again.");
		} finally {
			setPendingRequests((prev) => ({ ...prev, [userId]: false }));
		}
	};

	return (
		<View className="flex-1">
			<ImageBackground source={images.profileBackground} className="w-full h-full flex items-center" resizeMode="cover">
				<BackButton />
				<View className="mt-32 w-full flex items-center mb-10">
					<Text className="text-5xl font-righteous text-white text-center mb-2">Add Friends</Text>
					<Text className="text-lg text-gray-100 font-thin text-center">Search for your friends by username.</Text>
					<View className="w-4/5 border-b border-blue-100 mt-10 flex flex-row items-center justify-between">
						<TextInput
							className="w-4/5 py-2 text-white text-xl font-righteous"
							placeholder="Search for friends here..."
							value={username}
							onChangeText={setUsername}
							numberOfLines={1}
							placeholderTextColor="#666"
							autoCapitalize="none"
							onSubmitEditing={handleSearch}
						/>
						<TouchableOpacity onPress={handleSearch} activeOpacity={0.5} disabled={isSearching}>
							{isSearching ? (
								<ActivityIndicator size="small" color="#83b0d0" />
							) : (
								<Image className="size-6" tintColor={"#83b0d0"} source={icons.search} />
							)}
						</TouchableOpacity>
					</View>
				</View>

				{searchResults.length > 0 ? (
					<FlatList
						data={searchResults}
						renderItem={({ item }) => (
							<User
								id={item.id}
								username={item.username}
								onPress={() => handleSendRequest(item.id)}
								isLoading={pendingRequests[item.id]}
							/>
						)}
						keyExtractor={(item) => item.id.toString()}
						className="w-full"
						contentContainerStyle={{ alignItems: "center" }}
					/>
				) : isSearching ? (
					<ActivityIndicator size="large" color="#83b0d0" className="mt-12" />
				) : username.trim() !== "" && !isSearching && searchResults.length === 0 ? (
					<Text className="text-lg text-gray-200 mt-12">No users found</Text>
				) : null}
			</ImageBackground>
		</View>
	);
};

export default AddFriend;
