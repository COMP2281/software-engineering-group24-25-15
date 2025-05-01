import { View, Text, TouchableOpacity, ImageBackground, Alert, TextInput } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useState } from "react";
import { Audio } from 'expo-av';
import { checkVerifiedEmail, resendEmail } from "@/lib/user/userApi";
import images from "@/constants/images";

interface ButtonProps {
	text: string;
	onPress?: () => void;
	loading?: boolean;
}

const Button = ({ text, onPress, loading }: ButtonProps) => {
	return (
		<TouchableOpacity
			className={`bg-black-100 rounded-3xl w-1/2 py-3 flex justify-center items-center mt-5 border-2 border-blue-100 ${
				loading ? "opacity-50" : ""
			}`}
			activeOpacity={0.8}
			onPress={onPress}
			disabled={loading}
		>
			<Text className="text-2xl font-righteous text-grey-200 uppercase">{loading ? "Processing..." : text}</Text>
		</TouchableOpacity>
	);
};

const VerifyEmail = () => {
	const params = useLocalSearchParams();
	const email = params.email as string;

	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [verifyLoading, setVerifyLoading] = useState(false);
	const [resendLoading, setResendLoading] = useState(false);

	const handleVerification = async () => {
		if (!email || !username || !password) {
			Alert.alert("Error", "Please enter your username and password to verify your account");
			return;
		}

		setVerifyLoading(true);

		try {
			const isVerified = await checkVerifiedEmail({
				username,
				email,
				password,
			});

			if (isVerified) {
				Alert.alert("Success", "Your email has been verified", [
					{
						text: "Sign In",
						onPress: () => router.replace("/sign-in"),
					},
				]);
			} else {
				Alert.alert("Not Verified", "Your email has not been verified yet. Please check your inbox and follow the verification link.");
			}
		} catch (error) {
			Alert.alert("Verification Failed", error instanceof Error ? error.message : "Something went wrong");
		} finally {
			setVerifyLoading(false);
		}
	};

	const handleResendEmail = async () => {
		if (!email) {
			Alert.alert("Error", "Email information is missing");
			return;
		}

		setResendLoading(true);

		try {
			await resendEmail(email);
			Alert.alert("Success", "Verification email has been resent");
		} catch (error) {
			Alert.alert("Failed", error instanceof Error ? error.message : "Failed to resend verification email");
		} finally {
			setResendLoading(false);
		}
	};

	const playButtonClickSound = async () => {
		try {
			const sound = new Audio.Sound();
			await sound.loadAsync(require("../../assets/audio/button_click.mp3")); 
			await sound.playAsync();
		} catch (error) {
			console.error("Error playing button click sound", error);
		}
	};

	return (
		<View className="flex-1">
			<ImageBackground source={images.mainBackground} className="w-full h-full" resizeMode="cover" />
			<View className="absolute flex h-3/4 items-center justify-center w-full flex-col">
				<Text className="text-4xl text-white font-righteous mb-6">Verify Your Email</Text>
				<Text className="text-xl text-grey-200 mb-8 font-righteous">{email}</Text>
				<Text className="text-base text-grey-200 mb-8 text-center px-6 font-righteous">
					We've sent a verification email to your address. Please check your inbox and follow the instructions to verify your account.
				</Text>

				<View className="w-4/5 mb-3">
					<TextInput
						className="w-full mb-3 px-5 py-5 bg-black-100 border-2 border-blue-100 rounded-2xl text-grey-200 text-xl font-righteous"
						placeholder="Username"
						value={username}
						onChangeText={setUsername}
						placeholderTextColor="#666"
						autoCapitalize="none"
					/>

					<TextInput
						className="w-full px-5 py-5 bg-black-100 border-2 border-blue-100 rounded-2xl text-grey-200 text-xl font-righteous"
						placeholder="Password"
						value={password}
						onChangeText={setPassword}
						secureTextEntry
						placeholderTextColor="#666"
						autoCapitalize="none"
					/>
				</View>

				<Button text="Check Verification" 
				onPress={async () => {
					await playButtonClickSound();
					await handleVerification();
				}} 
				loading={verifyLoading} />
				<Button text="Resend Email" 
				onPress={async () => {
					await playButtonClickSound();
					await handleResendEmail();
				}} 
				loading={resendLoading} />

				<TouchableOpacity className="mt-8" onPress={() => router.replace("/sign-in")}>
					<Text className="text-blue-100 font-righteous">Back to Sign In</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
};

export default VerifyEmail;
