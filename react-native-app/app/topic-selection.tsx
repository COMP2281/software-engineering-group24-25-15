import { useState } from "react";
import { View, Text, TouchableOpacity, ImageBackground } from "react-native";
import { router, Redirect } from "expo-router";
import images from "@/constants/images";
import { useAuth } from "@/lib/auth/authContext";
import { topics } from "@/constants/data";
import BackButton from "@/components/Buttons";

interface TopicButtonProps {
	topic: string;
	selected: boolean;
	onPress: () => void;
}

const TopicButton: React.FC<TopicButtonProps> = ({ topic, selected, onPress }) => {
	return (
		<TouchableOpacity
			onPress={onPress}
			className={`border-blue-200 border-2 rounded-3xl p-4 mb-3 ${selected ? " bg-gray-700" : " bg-black-100"}`}
			activeOpacity={0.8}
		>
			<Text className="text-grey-200 text-center text-xl font-righteous">{topic}</Text>
		</TouchableOpacity>
	);
};

export default function TopicSelection() {
	const { isAuthenticated } = useAuth();
	const [selectedTopics, setSelectedTopics] = useState<string[]>([]);

	// If not logged in, redirect to sign-in
	if (!isAuthenticated) {
		return <Redirect href="/(auth)/sign-in" />;
	}

	const toggleTopic = (topic: string) => {
		if (selectedTopics.includes(topic)) {
			setSelectedTopics(selectedTopics.filter((t) => t !== topic));
		} else {
			// Only allow selecting up to 3 topics
			if (selectedTopics.length < 3) {
				setSelectedTopics([...selectedTopics, topic]);
			}
		}
	};

	const handleNext = () => {
		if (selectedTopics.length > 0) {
			// Navigate to difficulty selection with selected topics
			router.push({
				pathname: "/difficulty-selection",
				params: { topics: JSON.stringify(selectedTopics) },
			});
		}
	};

	return (
		<ImageBackground source={images.profileBackground} className="w-full h-full" resizeMode="cover">
			<BackButton />
			<View className="flex-1 p-6">
				<View className="flex-1 justify-center">
					<Text className="text-white text-3xl font-righteous text-center mb-8">Select Topics</Text>
					<Text className="text-white text-lg font-righteous text-center mb-6">Choose up to 3 topics for your game</Text>

					<View className="space-y-4 mb-8">
						{topics.map((topic) => (
							<TopicButton key={topic} topic={topic} selected={selectedTopics.includes(topic)} onPress={() => toggleTopic(topic)} />
						))}
					</View>

					<TouchableOpacity
						onPress={handleNext}
						disabled={selectedTopics.length === 0}
						className={`bg-black-100 border-2 border-blue-100 rounded-3xl p-4 ${selectedTopics.length === 0 ? "opacity-50" : ""}`}
					>
						<Text className="text-grey-200 text-center text-xl font-righteous">Next</Text>
					</TouchableOpacity>
				</View>
			</View>
		</ImageBackground>
	);
}
