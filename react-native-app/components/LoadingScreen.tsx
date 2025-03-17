import React from "react";
import { View, Text, ImageBackground, ActivityIndicator } from "react-native";
import images from "@/constants/images";

const LoadingScreen = () => {
	return (
		<ImageBackground source={images.subBackground} className="w-full h-full" resizeMode="cover">
			<View className="flex-1 justify-center items-center">
				<ActivityIndicator size="large" color="#ffffff" />
				<Text className="text-white text-xl font-righteous mt-4">Loading game...</Text>
			</View>
		</ImageBackground>
	);
};

export default LoadingScreen;
