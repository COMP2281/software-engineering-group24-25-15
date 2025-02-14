import { TouchableOpacity, Text, Image } from "react-native";
import { router } from "expo-router";

import icons from "@/constants/icons";

const BackButton = () => {
	return (
		<TouchableOpacity className=" p-4 bg-black-100 flex items-center justify-center rounded-full">
			<Text className="text-5xl font-righteous text-grey-200 uppercase" style={{ lineHeight: 60 }} onPress={() => router.back()}>
				<Image source={icons.back} className="size-6" resizeMode="contain" />
			</Text>
		</TouchableOpacity>
	);
};

export default BackButton;
