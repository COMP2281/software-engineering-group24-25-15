import { View, Text, ImageBackground, TextInput, TouchableOpacity, Image, ActivityIndicator, Alert } from "react-native";
import { useState } from "react";

import { BackButton } from "@/components/Utilities";
import { sendFriendRequest } from "@/lib/api/friends";
import { useAuth } from "@/lib/auth/authContext";

import images from "@/constants/images";
import icons from "@/constants/icons";

const AddFriend = () => {
	const { token } = useAuth();
	const [userId, setUserId] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async () => {
		if (!userId.trim() || !token) return;

		const numericUserId = parseInt(userId.trim());

		if (isNaN(numericUserId)) {
			Alert.alert("Invalid Input", "Please enter a valid numeric user ID");
			return;
		}

		setIsSubmitting(true);
		try {
			await sendFriendRequest(token, numericUserId);
			Alert.alert("Success", "Friend request sent successfully");
			setUserId(""); // Clear the input after successful request
		} catch (error) {
			console.error("Error sending friend request:", error);
			Alert.alert("Error", "Failed to send friend request. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<View className="flex-1">
			<ImageBackground source={images.profileBackground} className="w-full h-full flex items-center" resizeMode="cover">
				<BackButton />
				<View className="mt-32 w-full flex items-center mb-10">
					<Text className="text-5xl font-righteous text-white text-center mb-2">Add Friends</Text>
					<Text className="text-lg text-gray-100 font-thin text-center">Enter your friend's user ID to send a request.</Text>
					<View className="w-4/5 border-b border-blue-100 mt-10 flex flex-row items-center justify-between">
						<TextInput
							className="w-4/5 py-2 text-white text-xl font-righteous"
							placeholder="Enter user ID..."
							value={userId}
							onChangeText={(text) => {
								// Only allow numeric input
								if (/^\d*$/.test(text)) {
									setUserId(text);
								}
							}}
							numberOfLines={1}
							placeholderTextColor="#666"
							keyboardType="numeric"
							onSubmitEditing={handleSubmit}
						/>
						<TouchableOpacity onPress={handleSubmit} activeOpacity={0.5} disabled={isSubmitting}>
							{isSubmitting ? (
								<ActivityIndicator size="small" color="#83b0d0" />
							) : (
								<Image className="size-6" tintColor={"#83b0d0"} source={icons.search} />
							)}
						</TouchableOpacity>
					</View>
				</View>
			</ImageBackground>
		</View>
	);
};

export default AddFriend;
