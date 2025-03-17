import React from "react";
import { View, Text, ImageBackground, TouchableOpacity, Image } from "react-native";
import images from "@/constants/images";

type IntroductionScreenProps = {
	currentRound: number;
	topics: string[];
	hostIntroductions: string[];
	onStart: () => void;
};

const IntroductionScreen: React.FC<IntroductionScreenProps> = ({ currentRound, topics, hostIntroductions, onStart }) => {
	const safeCurrentRound = Math.min(currentRound, Array.isArray(topics) ? topics.length - 1 : 0);
	const currentTopic = Array.isArray(topics) && topics.length > safeCurrentRound ? topics[safeCurrentRound] : "Unknown Topic";
	const introduction =
		Array.isArray(hostIntroductions) && hostIntroductions.length > safeCurrentRound
			? hostIntroductions[safeCurrentRound]
			: `Welcome to the ${currentTopic} round! Let's test your knowledge.`;

	return (
		<ImageBackground source={images.subBackground} className="w-full h-full" resizeMode="cover">
			<View className="flex-1 justify-center p-6">
				<Text className="text-white text-3xl font-righteous text-center mb-6">
					Round {safeCurrentRound + 1}: {currentTopic}
				</Text>

				<View className="bg-black-200 p-6 rounded-2xl border-2 border-blue-200 mb-8">
					<Text className="text-white text-xl font-righteous text-center">{introduction}</Text>
				</View>

				<View className="flex-row justify-center my-6">
					<Image source={images.profile3} className="w-28 h-28 rounded-full border-2 border-blue-100" />
				</View>

				<TouchableOpacity onPress={onStart} className="bg-black-100 border-2 border-blue-100 rounded-3xl p-4 mt-6">
					<Text className="text-grey-200 text-center text-xl font-righteous">Start Round</Text>
				</TouchableOpacity>
			</View>
		</ImageBackground>
	);
};

export default IntroductionScreen;
