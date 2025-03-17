import { TouchableOpacity, Image } from "react-native";
import { router } from "expo-router";

import icons from "@/constants/icons";

const BackButton = () => (
	<TouchableOpacity onPress={() => router.back()} className="absolute top-6 left-6">
		<Image source={icons.back} className="size-10" tintColor={"#fff"}></Image>
	</TouchableOpacity>
);

export default BackButton;
