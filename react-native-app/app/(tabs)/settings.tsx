import { View, Text, ImageBackground, Image, TouchableOpacity, ScrollView, ImageSourcePropType } from "react-native";
import { router } from "expo-router";
import { useAuth } from "@/lib/auth/authContext";
import { useState, useEffect } from "react";
import AudioManager from "../audio-manager";

import images from "@/constants/images";
import icons from "@/constants/icons";
import { settings, friends } from "@/constants/data";
import { AddFriendButton } from "@/components/Utilities";

interface SettingsItemProps {
	icon: ImageSourcePropType;
	title: string;
	onPress?: () => void;
	textStyle?: string;
	showArrow?: boolean;
	tintColor?: string;
}

const SettingsItem = ({ icon, title, onPress, textStyle, showArrow = true, tintColor = "#fff" }: SettingsItemProps) => {
	return (
		<TouchableOpacity onPress={onPress} className="flex flex-row items-center justify-between py-3">
			<View className="flex flex-row items-center gap-3">
				<Image source={icon} className="size-6" tintColor={tintColor} />
				<Text className={`text-lg font-righteous text-white ${textStyle}`}>{title}</Text>
			</View>

			{showArrow && <Image source={icons.rightArrow} className="size-5" tintColor={"#fff"} />}
		</TouchableOpacity>
	);
};

const Settings = () => {
	const { logout, username } = useAuth();
	const [muted, setMuted] = useState(AudioManager.getMuted());

	const handleLogout = () => {
		logout();
		router.push("/sign-in");
	};

	const handleToggleMute = async () => {
		await AudioManager.toggleMute();
		setMuted(AudioManager.getMuted());
	};

	return (
		<View className="h-full bg-white">
			<ImageBackground source={images.leaderboardBackground} className="w-full h-full px-7" resizeMode="cover">
				<AddFriendButton />
				<View className="flex-row justify-between items-center py-6">
					<Text className="text-white text-3xl font-righteous">Settings</Text>
				</View>

				<ScrollView showsHorizontalScrollIndicator={false}>
					<View className="flex-row justify-center flex mb-3">
						<View className="flex-col flex items-center relative mt-5">
							<Image source={images.profile1} className="size-44 relative rounded-full" />
							<TouchableOpacity className="absolute bottom-11 right-2">
								<Image source={icons.edit} className="size-9" />
							</TouchableOpacity>
							<Text className="text-2xl font-righteous text-white mt-2">{username}</Text>
						</View>
					</View>
					<View className="flex flex-col mt-5 border-t pt-5 border-white">
						{friends.slice().map((item, index) => (
							<SettingsItem key={index} {...item} />
						))}
					</View>
					<View className="flex flex-col mt-5 border-t pt-5 border-white">
						{settings.slice().map((item, index) => (
							<SettingsItem key={index} {...item} />
						))}
					</View>
					<View className="flex flex-col mt-5 border-t pt-5 border-white">
						<SettingsItem icon={muted ? icons.mute : icons.volume} title="Sound" onPress={handleToggleMute} showArrow={false} />
						<SettingsItem icon={icons.logout} title="Logout" onPress={handleLogout} showArrow={false} tintColor="#ef4444" />
					</View>
				</ScrollView>
			</ImageBackground>
		</View>
	);
};

export default Settings;
