import { ImageBackground, View, TouchableOpacity, Text, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import images from "@/constants/images";

interface MenuButtonProps {
	text: string;
	onPress?: () => void;
}

const MenuButton = ({ text, onPress }: MenuButtonProps) => {
	return (
		<TouchableOpacity className="bg-black-100 rounded-3xl w-3/4 py-3 flex justify-center items-center mt-5" onPress={onPress}>
			<Text className="text-5xl font-righteous text-grey-200 uppercase" style={{ lineHeight: 60 }}>
				{text}
			</Text>
		</TouchableOpacity>
	);
};

export default function Index() {
	return (
		<SafeAreaView>
			<ImageBackground source={images.mainBackground} className="w-full h-full" resizeMode="cover" />
			<View className="absolute h-full w-full top-0 flex items-center justify-center pt-32">
				<View className="w-full h-1/3 flex justify-center items-center">
					<Text className="uppercase font-righteous text-5xl text-white">Logo</Text>
				</View>
				<View className="w-full h-1/2 flex justify-center items-center">
					<MenuButton text="Game" />
					<MenuButton text="Practise" />
				</View>
			</View>
		</SafeAreaView>
	);
}
