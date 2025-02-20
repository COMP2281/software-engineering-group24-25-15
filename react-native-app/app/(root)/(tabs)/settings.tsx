import { View, Text, ImageBackground, Image, TouchableOpacity } from "react-native";

import images from "@/constants/images";
import icons from "@/constants/icons";

const MenuButton = ({ text }: { text: string }) => (
	<TouchableOpacity className="">
		<Text className="text-white font-righteous text-xl">{text}</Text>
	</TouchableOpacity>
);

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

export default profile;
