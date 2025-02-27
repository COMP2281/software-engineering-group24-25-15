import { View, Text, TouchableOpacity, ImageBackground } from "react-native";

import images from "@/constants/images";

const VerifyEmail = () => {
	const email = "";
	return (
		<View className="flex-1">
			<ImageBackground source={images.mainBackground} className="w-full h-full" resizeMode="cover" />
			<View className="absolute">
				<Text>Verify Your Email Address</Text>
				<Text>{email}</Text>
				<TouchableOpacity onPress={() => {}}>
					<Text>Resend email</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
};

export default VerifyEmail;
