import { ImageBackground, View, TouchableOpacity, Text } from "react-native";
import { Redirect, router } from "expo-router";
import { useAuth } from "@/lib/auth/authContext";

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
	const { isAuthenticated } = useAuth();

	// If not logged in, redirect to sign-in
	if (!isAuthenticated) {
		return <Redirect href="/sign-in" />;
	}

	return (
		<>
			<View>
				<ImageBackground source={images.mainBackground} className="w-full h-full" resizeMode="cover" />
				<View className="absolute h-full w-full top-0 flex items-center justify-center pt-32">
					<View className="w-full h-1/2 flex justify-center items-center">
						<MenuButton text="Game" onPress={() => router.push("/topic-selection")} />
						<MenuButton text="Practice" onPress={() => router.push("/practice")} />
					</View>
				</View>
			</View>
		</>
	);
}
