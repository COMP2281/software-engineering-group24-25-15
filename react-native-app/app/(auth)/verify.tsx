import { View, Text, TouchableOpacity, ImageBackground } from "react-native";

import images from "@/constants/images";

interface MenuButtonProps {
	text: string;
	onPress?: () => void;
}

const Button = ({ text, onPress }: MenuButtonProps) => {
	return (
		<TouchableOpacity className="bg-black-100 rounded-3xl w-1/2 py-1 flex justify-center items-center mt-5" activeOpacity={0.8} onPress={onPress}>
			<Text className="text-2xl font-righteous text-grey-200 uppercase" style={{ lineHeight: 60 }}>
				{text}
			</Text>
		</TouchableOpacity>
	);
};

const VerifyEmail = () => {
	const email = "";
	return (
		<View className="flex-1">
			<ImageBackground source={images.mainBackground} className="w-full h-full" resizeMode="cover" />
			<View className="absolute flex h-3/4 items-center justify-center w-full flex-col">
				<Text className="text-3xl text-white font-righteous">Verify Your Email Address</Text>
				<Text>{email}</Text>
				<Button text="I Activated" />
				<Button text="Resend Email" />
			</View>
		</View>
	);
};

export default VerifyEmail;
