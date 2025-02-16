import { View, Text, ImageBackground, Image, TouchableOpacity } from "react-native";

import images from "@/constants/images";

const MenuButton = () => (
	<TouchableOpacity className="">
		<Text className="text-white font-righteous text-xl">Button</Text>
	</TouchableOpacity>
);

const profile = () => {
	return (
		<View className="flex-1">
			<ImageBackground source={images.leaderboardBackground} className="w-full h-full flex justify-start items-center" resizeMode="cover">
				<View className="mt-32 flex justify-center items-center">
					<Image source={images.profile1} className="size-36 rounded-full shadow-lg" />
					<Text className="mt-3 text-white text-2xl font-righteous">James Harvey</Text>
				</View>
				<View className="w-3/4 mt-32">
					<MenuButton />
				</View>
			</ImageBackground>
		</View>
	);
};

export default profile;
