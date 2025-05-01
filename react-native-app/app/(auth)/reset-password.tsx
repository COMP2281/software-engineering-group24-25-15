import { View, Text, ImageBackground, TextInput, TouchableOpacity, ScrollView, Alert } from "react-native";
import { useState } from "react";
import { Audio } from "expo-av";

import { resetPassword } from "@/lib/user/userApi"; // Adjust the import path as necessary
import images from "@/constants/images";
import { Logo } from "@/components/Utilities";
import { BackButton } from "@/components/Utilities";

const ResetPassword = () => {
	const [email, setEmail] = useState("");
	const [loading, setLoading] = useState(false);

	const playButtonClickSound = async () => {
		try {
			const sound = new Audio.Sound();
			await sound.loadAsync(require("@/assets/audio/button_click.mp3"));
			await sound.playAsync();
		} catch (error) {
			console.error("Error playing button click sound", error);
		}
	};

	const handlePasswordReset = async () => {
		if (!email) {
			alert("Please enter your email address.");
			return;
		}

		setLoading(true);

		try {
			const response = await resetPassword(email);

			if (!response.success) {
				throw new Error("Failed to send password reset email. Please try again.");
			}

			alert("Password reset email sent successfully!");
		} catch (error) {
			Alert.alert("Password Reset Failed", error instanceof Error ? error.message : "Email not sent");
		} finally {
			setLoading(false);
		}
	};

	return (
		<ImageBackground source={images.mainBackground} className="w-full h-full" resizeMode="cover">
			<ScrollView contentContainerStyle={{ flexGrow: 1 }}>
				<View className="flex-1 justify-center items-center">
					<BackButton />
					<Logo height="pb-10" />
					<View className="w-4/5 flex flex-col mb-6">
						<TextInput
							className="w-full px-5 py-5 bg-black-100 border-2 border-blue-100 rounded-2xl text-grey-200 text-xl font-righteous"
							placeholder="Email"
							value={email}
							onChangeText={setEmail}
							numberOfLines={1}
							placeholderTextColor="#666"
							autoCapitalize="none"
						/>
					</View>
					<TouchableOpacity
						className={`w-1/2 flex justify-center items-center bg-black-100 rounded-3xl py-3 mb-5 border-2 border-blue-100 ${
							loading ? "opacity-50" : ""
						}`}
						onPress={async () => {
							await playButtonClickSound();
							await handlePasswordReset();
						}}
						disabled={loading}
					>
						<Text className="text-grey-200 font-righteous uppercase">{loading ? "Sending Email..." : "Reset Password"}</Text>
					</TouchableOpacity>
				</View>
			</ScrollView>
		</ImageBackground>
	);
};

export default ResetPassword;
