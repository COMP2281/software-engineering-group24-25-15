import { View, Text, ImageBackground, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView, Keyboard } from "react-native";
import { useState, useEffect } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Audio } from "expo-av";

import images from "@/constants/images";
import { useAuth } from "@/lib/auth/authContext";
import { loginUser } from "@/lib/auth/authApi";
import { Logo } from "@/components/Utilities";

const SignIn = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(false);
	const [keyboardVisible, setKeyboardVisible] = useState(false);

	const { login } = useAuth();

	useEffect(() => {
		const keyboardDidShowListener = Keyboard.addListener("keyboardDidShow", () => {
			setKeyboardVisible(true);
		});
		const keyboardDidHideListener = Keyboard.addListener("keyboardDidHide", () => {
			setKeyboardVisible(false);
		});

		return () => {
			keyboardDidShowListener.remove();
			keyboardDidHideListener.remove();
		};
	}, []);

	const toggleShowPassword = () => {
		setShowPassword(!showPassword);
	};

	const handleSignIn = async () => {
		if (!username || !password) {
			Alert.alert("Error", "Please enter both username and password");
			return;
		}

		setLoading(true);

		try {
			const response = await loginUser({ username, password });

			// Store tokens and username in the global context
			await login(response.access, response.refresh, response.username, response.id);

			// Navigation is handled by the index page which will redirect based on auth state
			router.replace("/");
		} catch (error) {
			Alert.alert("Login Failed", error instanceof Error ? error.message : "Something went wrong");
		} finally {
			setLoading(false);
		}
	};

	const playButtonClickSound = async () => {
		try {
			const sound = new Audio.Sound();
			await sound.loadAsync(require("@/assets/audio/button_click.mp3"));
			await sound.playAsync();
		} catch (error) {
			console.error("Error playing button click sound", error);
		}
	};

	return (
		<KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
			<ImageBackground source={images.mainBackground} className="w-full h-full" resizeMode="cover">
				<ScrollView contentContainerStyle={{ flexGrow: 1 }}>
					<View className="flex-1 justify-center items-center">
						<Logo height="pb-10" />
						<View className="w-4/5 flex flex-col mb-6">
							<TextInput
								className="w-full px-5 py-5 bg-black-100 border-2 border-blue-100 rounded-2xl text-grey-200 text-xl font-righteous"
								placeholder="Username"
								value={username}
								onChangeText={setUsername}
								numberOfLines={1}
								placeholderTextColor="#666"
								autoCapitalize="none"
							/>
						</View>
						<View className="w-4/5 flex flex-col mb-6">
							<View className="px-4 bg-black-100 border-2 border-blue-100 rounded-2xl flex flex-row justify-between items-center">
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
							<TouchableOpacity
								onPress={() => {
									router.push("/reset-password");
								}}
								className="mt-1"
							>
								<Text className="text-blue-300 text-xs font-bold">Forgotten Password?</Text>
							</TouchableOpacity>
						</View>
						<TouchableOpacity
							className={`w-1/2 flex justify-center items-center bg-black-100 rounded-3xl py-3 mb-5 border-2 border-blue-100 ${
								loading ? "opacity-50" : ""
							}`}
							onPress={async () => {
								await playButtonClickSound();
								await handleSignIn();
							}}
							disabled={loading}
						>
							<Text className="text-grey-200 font-righteous uppercase">{loading ? "Signing In..." : "Sign In"}</Text>
						</TouchableOpacity>
					</View>

					{!keyboardVisible && (
						<View className="w-full flex justify-center items-center pb-5 pt-5">
							<Text className="text-grey-200 font-righteous">Don't have an account?</Text>
							<TouchableOpacity
								onPress={() => {
									router.push("/sign-up");
								}}
								className="mt-2"
							>
								<Text className="text-blue-100 font-righteous">Sign Up</Text>
							</TouchableOpacity>
						</View>
					)}
				</ScrollView>
			</ImageBackground>
		</KeyboardAvoidingView>
	);
};

export default SignIn;
