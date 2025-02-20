import { View, Text, ImageBackground, Image, TouchableOpacity, ImageSourcePropType } from "react-native";
import { useState } from "react";


import images from "@/constants/images";
import icons from "@/constants/icons";

const MenuButton = ({ text }: { text: string }) => (
	<TouchableOpacity className="">
		<Text className="text-white font-righteous text-xl">{text}</Text>
	</TouchableOpacity>
);

interface Account {
	profile: ImageSourcePropType;
	name: string;
	email: string;
}

const profile = () => {
	return (
		<View className="flex-1">
			<ImageBackground source={images.profileBackground} className="w-full h-full flex justify-start items-center" resizeMode="cover">
				<View className="flex justify-center items-center rounded-2xl px-4 py-2 mt-24">
					<Image source={images.profile1} className="size-32 rounded-full shadow-lg" />
					<View className="items-center mt-4">
						<Text className="text-white text-2xl font-righteous">James Harvey</Text>
						<TouchableOpacity className="flex flex-row items-center" onPress={() => {}} activeOpacity={0.6}>
							<Image source={icons.edit} className="size-4 mr-2" tintColor={"#6b7280"} />
							<Text className="text-gray-500 text-lg font-righteous">Edit Profile</Text>
						</TouchableOpacity>
					</View>
				</View>
				<View className="w-3/4 mt-32">
					<MenuButton text="Button" />
					<MenuButton text="" />
					<MenuButton text="" />
					<MenuButton text="" />
					<MenuButton text="" />
				</View>
			</ImageBackground>
		</View>
	);
};





const ProfileTop = ({ profile, name }: Account) => (
	<View className="flex justify-center items-center rounded-2xl px-4 py-2 mt-24">
		<Image source={images.profile1} className="size-32 rounded-full shadow-lg" />
		<View className="items-center mt-4">
			<Text className="text-white text-2xl font-righteous">James Harvey</Text>
			<TouchableOpacity className="flex flex-row items-center" onPress={() => {}} activeOpacity={0.6}>
				<Image source={icons.edit} className="size-4 mr-2" tintColor={"#6b7280"} />
				<Text className="text-gray-500 text-lg font-righteous">Edit Profile</Text>
			</TouchableOpacity>
		</View>
	</View>
);

const Profile = () => {
	const [activeTab, setActiveTab] = useState("profile");
	switch (activeTab) {
		case "profiledetails":
			return <ProfileDetails />
		case "settings":
			return <Settings />
		default:
			return (
				<View className="flex-1">
					<ImageBackground source={images.leaderboardBackground} className="w-full h-full flex justify-start items-center" resizeMode="cover">
						<ProfileTop profile={images.profile1} name="James Harvey" email="abc_def@outlook.com" />
						<View className="flex-1 mt-14">
							<View className="flex flex-row items-center justify-between px-4 py-5 border-b border-gray-300">
								<TouchableOpacity className="flex flex-row" onPress={() => setActiveTab("profiledetails")}>
									<Image source={icons.profile} className="w-8 h-9 rounded-full mr-4" />
									<Text className="text-white font-righteous text-xl">Profile Details</Text>
								</TouchableOpacity>
							</View>
							<View className="flex flex-row items-center justify-between px-4 py-5 border-b border-gray-300">
								<TouchableOpacity className="flex flex-row" onPress={() => setActiveTab("settings")}>
									<Image source={icons.stats} className="w-10 h-9 rounded-full mr-4" />
									<Text className="text-white font-righteous text-xl">Settings</Text>
								</TouchableOpacity>
							</View>
							<View className="flex flex-row items-center justify-between px-4 py-5 border-b border-gray-300">
								<TouchableOpacity className="flex flex-row">
									<Image source={icons.back} className="w-10 h-9 rounded-full mr-4" />
									<Text className="text-white font-righteous text-xl">Log Out</Text>
								</TouchableOpacity>
							</View>
						</View>
						
					</ImageBackground>
				</View>
			);
	};
};

const ProfileDetailsContent = ({ profile, name, email }: Account) => (
	<View className="flex-1">
		<View className="mt-8 flex justify-center items-center">
			<Image source={profile} className="size-36 rounded-full shadow-lg" />
			<Text className="mt-3 text-white text-2xl font-righteous">{name}</Text>
		</View>
		<Text className="mt-20 text-white text-xl font-righteous">{email}</Text>
	</View>
);

const SettingsContent = () => (
	<View className="flex-1">
		<View className="mt-6 flex justify-center items-center">
			<Text className="mt-20 text-white text-xl font-righteous">Volume</Text>
			<Text className="mt-10 text-white text-xl font-righteous">Difficulty</Text>
		</View>
	</View>
);

const ProfileDetails = () => {
	const [activeTab, setActiveTab] = useState("profiledetails");
	switch (activeTab) {
		case "profile":
			return <Profile />
		case "settings":
			return <Settings />
		default:
			return (
				<View className="flex-1">
					<ImageBackground source={images.leaderboardBackground} className="w-full h-full flex justify-start items-center" resizeMode="cover">
					<View className="flex-1">
						<View className="mt-6 flex justify-center items-center">
							<Text className="mt-3 text-white text-2xl font-righteous">Profile Details</Text>
						</View>	
						<ProfileDetailsContent profile={images.profile1} name="James Harvey" email="abc_def@outlook.com" />					
					</View>					
					<View className="flex flex-row items-center justify-between px-4 py-5 border-b border-gray-300">
							<TouchableOpacity className="flex flex-row" onPress={() => setActiveTab("profile")}>
								<Text className="text-white font-righteous text-xl">Back</Text>
							</TouchableOpacity>
						</View>
					</ImageBackground>
				</View>
			);
	};
};

const Settings = () => {
	const [activeTab, setActiveTab] = useState("settings");
	switch (activeTab) {
		case "profile":
			return <Profile />
		case "profiledetails":
			return <ProfileDetails />
		default:
			return (
				<View className="flex-1">
					<ImageBackground source={images.leaderboardBackground} className="w-full h-full flex justify-start items-center" resizeMode="cover">
					<View className="flex-1">
						<View className="mt-6 flex justify-center items-center">
							<Text className="mt-3 text-white text-2xl font-righteous">Settings</Text>
						</View>	
						<SettingsContent />					
					</View>
						<View className="flex flex-row items-center justify-between px-4 py-5 border-b border-gray-300">
								<TouchableOpacity className="flex flex-row" onPress={() => setActiveTab("profile")}>
									<Text className="text-white font-righteous text-xl">Back</Text>
								</TouchableOpacity>
							</View>
					</ImageBackground>
				</View>
			);
	};
};


export default Profile;
