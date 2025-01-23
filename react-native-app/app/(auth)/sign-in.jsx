import { ImageBackground, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import React from "react";
import { InputBox } from "../../components";
import { images } from "../../constants";

const SignIn = () => {
	return (
		<SafeAreaView className="flex-1" edges={["left", "right"]}>
			<ImageBackground source={images.logo} resizeMode="cover" className="h-1/2"></ImageBackground>
			<View className="h-1/2 bg-blue-800 flex flex-col justify-center items-center">
				<View>
					<InputBox label="Username" innerText="Type username here..."></InputBox>
				</View>
			</View>
		</SafeAreaView>
	);
};

export default SignIn;
