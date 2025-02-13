import { View, Text, ImageBackground } from "react-native";

import images from "@/constants/images";

const Leaderboard = () => {
	return (
		<View className="flex-1">
			<ImageBackground source={images.subBackground} className="w-full h-full" resizeMode="cover" />
		</View>
	);
};

export default Leaderboard;
