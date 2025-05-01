import { View, Text, ImageBackground, TouchableOpacity, Image, ScrollView, ImageSourcePropType } from "react-native";
import { useState } from "react";

import images from "@/constants/images";
import icons from "@/constants/icons";
import { router } from "expo-router";
import { AddFriendButton } from "@/components/Utilities";

interface Tab {
	title: string;
	active: boolean;
	onPress: () => void;
}

interface Entry {
	profile: ImageSourcePropType;
	name: string;
	position: number;
	score: number;
}

const Tab = ({ title, active, onPress }: Tab) => (
	<TouchableOpacity onPress={onPress} className={`flex-1 py-3 bg-transparent ${active ? "border-b-2 border-gray-300" : ""}`}>
		<Text className={`text-center text-lg font-righteous ${active ? "text-gray-300" : "text-gray-400"}`}>{title}</Text>
	</TouchableOpacity>
);

const LeaderboardEntry = ({ profile, name, position, score }: Entry) => (
	<View className="flex flex-row items-center justify-between px-4 py-3 border-b border-gray-300">
		<View className="flex flex-row items-center">
			<Text className="text-gray-400 text-lg">{position}</Text>
			<Image source={profile} className="w-10 h-10 rounded-full ml-4" />
			<Text className="text-gray-300 text-lg ml-4 font-righteous">{name}</Text>
		</View>
		<Text className="text-gray-300 text-lg">{score}</Text>
	</View>
);

const UserEntry = ({ profile, name, position, score }: Entry) => (
	<View className="flex flex-row items-center justify-between px-4 py-3 border-b bg-blue-100 rounded-md">
		<View className="flex flex-row items-center">
			<Text className="text-white text-lg">{position}</Text>
			<Image source={profile} className="w-10 h-10 rounded-full ml-4" />
			<Text className="text-white text-lg ml-4 font-righteous">{name}</Text>
		</View>
		<Text className="text-white text-lg">{score}</Text>
	</View>
);

const FriendsLeaderboard = () => (
	<ScrollView className="flex-1 p-4">
		<UserEntry profile={images.profile1} name="You" position={1} score={110} />
		{Array.from({ length: 50 }, (_, i) => {
			const profiles = [images.profile1, images.profile2, images.profile3];
			const randomProfile = profiles[Math.floor(Math.random() * profiles.length)];
			return <LeaderboardEntry key={i} profile={randomProfile} name={`User ${i + 1}`} position={i + 2} score={100 - i} />;
		})}
	</ScrollView>
);

const GlobalLeaderboard = () => (
	<View className="flex-1 p-4">
		<Text className="text-lg text-white">Global Leaderboard Content</Text>
	</View>
);

const Leaderboard = () => {
	const [activeTab, setActiveTab] = useState("friends");

	return (
		<View className="flex-1">
			<ImageBackground source={images.leaderboardBackground} className="w-full h-full" resizeMode="cover">
				<AddFriendButton />
				<View className="flex-1">
					<View className="flex-row justify-between items-center px-4 py-6">
						<Text className="text-white text-3xl font-righteous">Leaderboard</Text>
					</View>
					<View className="flex-row bg-transparent">
						<Tab title="Friends" active={activeTab === "friends"} onPress={() => setActiveTab("friends")} />
						<Tab title="Global" active={activeTab === "global"} onPress={() => setActiveTab("global")} />
					</View>
					{activeTab === "friends" ? <FriendsLeaderboard /> : <GlobalLeaderboard />}
				</View>
			</ImageBackground>
		</View>
	);
};

export default Leaderboard;
