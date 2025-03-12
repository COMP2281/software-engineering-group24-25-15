import { View, Text, ImageBackground, Image, TouchableOpacity, ScrollView, ImageSourcePropType } from "react-native";
import { router } from "expo-router";
import { useAuth } from "@/lib/auth/authContext";

import images from "@/constants/images";
import icons from "@/constants/icons";
import { settings } from "@/constants/data";

interface SettingsItemProps {
	icon: ImageSourcePropType;
	title: string;
	onPress?: () => void;
	textStyle?: string;
	showArrow?: boolean;
}

const SettingsItem = ({ icon, title, onPress, textStyle, showArrow = true }: SettingsItemProps) => {
	return (
		<TouchableOpacity onPress={onPress} className="flex flex-row items-center justify-between py-3">
			<View className="flex flex-row items-center gap-3">
				<Image source={icon} className="size-6" tintColor={"#fff"} />
				<Text className={`text-lg font-righteous text-white ${textStyle}`}>{title}</Text>
			</View>

			{showArrow && <Image source={icons.rightArrow} className="size-5" tintColor={"#fff"} />}
		</TouchableOpacity>
	);
};

const Profile = () => {
	const { logout, username } = useAuth();
	const muted = false;

	const handleLogout = () => {
		logout();
		router.push("/sign-in");
	};

	return (
		<View className="h-full bg-white">
			<ImageBackground source={images.leaderboardBackground} className="w-full h-full" resizeMode="cover">
				<ScrollView showsHorizontalScrollIndicator={false} contentContainerClassName="pb-32 px-7">
					<View className="flex-row justify-between items-center py-6">
						<Text className="text-white text-3xl font-righteous">Profile</Text>
						<TouchableOpacity onPress={() => {}} className="mr-4">
							<Image source={icons.addFriend} className="size-6" tintColor={"#fff"} />
						</TouchableOpacity>
					</View>

					<View className="flex-row justify-center flex">
						<View className="flex-col flex items-center relative mt-5">
							<Image source={images.profile1} className="size-44 relative rounded-full" />
							<TouchableOpacity className="absolute bottom-11 right-2">
								<Image source={icons.edit} className="size-9" />
							</TouchableOpacity>
							<Text className="text-2xl font-righteous text-white mt-2">{username}</Text>
						</View>
					</View>
					<View className="flex flex-col mt-5 border-t pt-5 border-white">
						{settings.slice().map((item, index) => (
							<SettingsItem key={index} {...item} />
						))}
					</View>
					<View className="flex flex-col mt-5 border-t pt-5 border-white">
						<SettingsItem icon={muted ? icons.mute : icons.volume} title="Sound" onPress={() => {}} showArrow={false} />
						<SettingsItem icon={icons.logout} title="Logout" onPress={handleLogout} textStyle="text-danger" showArrow={false} />
					</View>
				</ScrollView>
			</ImageBackground>
		</View>
	);
};

export default Profile;
