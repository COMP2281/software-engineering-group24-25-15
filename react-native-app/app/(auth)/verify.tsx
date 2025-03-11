import { View, Text, TouchableOpacity, ImageBackground, Alert } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useState } from "react";
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

	const [verifyLoading, setVerifyLoading] = useState(false);
	const [resendLoading, setResendLoading] = useState(false);

	const handleVerification = async () => {
		if (!email) {
			Alert.alert("Error", "Email information is missing");
			return;
		}

		setVerifyLoading(true);

		try {
			await checkVerifiedEmail({ username: "", email, password: "" });
			Alert.alert("Success", "Email has been verified");
			router.replace("/sign-in");
		} catch (error) {
			Alert.alert("Verification Failed", error instanceof Error ? error.message : "Something went wrong");
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

	return (
		<View className="flex-1">
			<ImageBackground source={images.mainBackground} className="w-full h-full" resizeMode="cover" />
			<View className="absolute flex h-3/4 items-center justify-center w-full flex-col">
				<Text className="text-4xl text-white font-righteous mb-6">Verify Your Email</Text>
				<Text className="text-xl text-grey-200 mb-8 font-righteous">{email}</Text>
				<Text className="text-base text-grey-200 mb-8 text-center px-6 font-righteous">
					We've sent a verification email to your address. Please check your inbox and follow the instructions to verify your account.
				</Text>
				<Button text="I Verified" onPress={handleVerification} loading={verifyLoading} />
				<Button text="Resend Email" onPress={handleResendEmail} loading={resendLoading} />

				<TouchableOpacity className="mt-8" onPress={() => router.replace("/sign-in")}>
					<Text className="text-blue-100 font-righteous">Back to Sign In</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
};

export default VerifyEmail;
