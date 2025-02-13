import { View, Text, ImageBackground, TextInput, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";

import images from "@/constants/images";

const SignIn = () => {
	const [password, setPassword] = useState("");

	const [showPassword, setShowPassword] = useState(false);

	const toggleShowPassword = () => {
		setShowPassword(!showPassword);
	};

	return (
		<SafeAreaView className="flex-1">
			<ImageBackground source={images.mainBackground} className="w-full h-full" resizeMode="cover" />
			<View className="absolute flex justify-center items-center w-full h-full">
				<Text className="text-5xl font-righteous text-grey-200 uppercase mb-6">Logo</Text>
				<View className="w-4/5 flex flex-col mb-6">
					<TextInput
						className="w-full px-5 py-5 bg-black-100 border-2 border-blue-100 rounded-2xl text-grey-200 text-xl font-righteous"
						placeholder="Username"
						numberOfLines={1}
						placeholderTextColor="#666"
					/>
					<TouchableOpacity onPress={() => {}} className="mt-1">
						<Text className="text-blue-300 text-xs font-bold w-4/5">Forgotten Username?</Text>
					</TouchableOpacity>
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
						/>
						<MaterialCommunityIcons name={showPassword ? "eye-off" : "eye"} size={24} color="#aaa" onPress={toggleShowPassword} />
					</View>
					<TouchableOpacity onPress={() => {}} className="mt-1">
						<Text className="text-blue-300 text-xs font-bold">Forgotten Password?</Text>
					</TouchableOpacity>
				</View>
				<TouchableOpacity
					className="w-1/2 flex justify-center items-center bg-black-100 rounded-3xl py-3 mb-5 border-2 border-blue-100"
					onPress={() => {}}
				>
					<Text className="text-grey-200 font-righteous uppercase">Sign In</Text>
				</TouchableOpacity>
			</View>
			<View className="absolute bottom-0 w-full flex justify-center items-center pb-5">
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
		</SafeAreaView>
	);
};

export default SignIn;
