import { View, Text, ImageBackground, TextInput, TouchableOpacity, Alert } from "react-native";
import { useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";

import images from "@/constants/images";
import { registerUser } from "@/lib/user/userApi";

const SignUp = () => {
	const [email, setEmail] = useState("");
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [loading, setLoading] = useState(false);

	const toggleShowPassword = () => {
		setShowPassword(!showPassword);
	};

	const toggleShowConfirmPassword = () => {
		setShowConfirmPassword(!showConfirmPassword);
	};

	const handleSignUp = async () => {
		// Form validation
		if (!email || !username || !password || !confirmPassword) {
			Alert.alert("Error", "All fields are required");
			return;
		}

		if (password !== confirmPassword) {
			Alert.alert("Error", "Passwords do not match");
			return;
		}

		// Email validation
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			Alert.alert("Error", "Please enter a valid email address");
			return;
		}

		setLoading(true);

		try {
			const userData = {
				username,
				email,
				password,
				re_password: confirmPassword,
			};

			await registerUser(userData);

			// Navigate to verification page with email
			router.push({
				pathname: "/verify",
				params: { email },
			});
		} catch (error) {
			console.log(error);
			Alert.alert("Registration Failed", error instanceof Error ? error.message : "Something went wrong");
		} finally {
			setLoading(false);
		}
	};

	return (
		<View className="flex-1">
			<ImageBackground source={images.mainBackground} className="w-full h-full" resizeMode="cover" />
			<View className="absolute flex justify-center items-center w-full h-full">
				<Text className="text-5xl font-righteous text-grey-200 uppercase mb-6">Logo</Text>

				<TextInput
					className="w-4/5 mb-5 px-5 py-5 bg-black-100 border-2 border-blue-100 rounded-2xl text-grey-200 text-xl font-righteous"
					placeholder="Email"
					value={email}
					onChangeText={setEmail}
					numberOfLines={1}
					placeholderTextColor="#666"
					keyboardType="email-address"
					autoCapitalize="none"
				/>

				<TextInput
					className="w-4/5 mb-5 px-5 py-5 bg-black-100 border-2 border-blue-100 rounded-2xl text-grey-200 text-xl font-righteous"
					placeholder="Username"
					value={username}
					onChangeText={setUsername}
					numberOfLines={1}
					placeholderTextColor="#666"
					autoCapitalize="none"
				/>

				<View className="w-4/5 mb-5 px-4 bg-black-100 border-2 border-blue-100 rounded-2xl flex flex-row justify-between items-center">
					<TextInput
						secureTextEntry={!showPassword}
						value={password}
						onChangeText={setPassword}
						className="flex-1 py-5 px-1 text-xl text-grey-200 font-righteous h-full"
						numberOfLines={1}
						placeholder="Password"
						placeholderTextColor="#666"
						autoCapitalize="none"
					/>
					<MaterialCommunityIcons name={showPassword ? "eye-off" : "eye"} size={24} color="#aaa" onPress={toggleShowPassword} />
				</View>

				<View className="w-4/5 mb-5 px-4 bg-black-100 border-2 border-blue-100 rounded-2xl flex flex-row justify-between items-center">
					<TextInput
						secureTextEntry={!showConfirmPassword}
						value={confirmPassword}
						onChangeText={setConfirmPassword}
						className="flex-1 py-5 px-1 text-xl text-grey-200 font-righteous h-full"
						numberOfLines={1}
						placeholder="Confirm Password"
						placeholderTextColor="#666"
						autoCapitalize="none"
					/>
					<MaterialCommunityIcons
						name={showConfirmPassword ? "eye-off" : "eye"}
						size={24}
						color="#aaa"
						onPress={toggleShowConfirmPassword}
					/>
				</View>

				<TouchableOpacity
					className={`w-1/2 flex justify-center items-center bg-black-100 rounded-3xl py-3 mb-5 border-2 border-blue-100 ${
						loading ? "opacity-50" : ""
					}`}
					onPress={handleSignUp}
					disabled={loading}
				>
					<Text className="text-grey-200 font-righteous uppercase">{loading ? "Signing Up..." : "Sign Up"}</Text>
				</TouchableOpacity>
			</View>

			<View className="absolute bottom-0 w-full flex justify-center items-center pb-5">
				<Text className="text-grey-200 font-righteous">Already have an account?</Text>
				<TouchableOpacity
					onPress={() => {
						router.push("/sign-in");
					}}
					className="mt-2"
				>
					<Text className="text-blue-100 font-righteous">Sign In</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
};

export default SignUp;
