import { ImageBackground, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { LandingButton } from "../components";
import { images } from "../constants";

const LandingPage = () => {
	return (
		<SafeAreaView className="flex-1" edges={["left", "right"]}>
			<ImageBackground source={images.logo} resizeMode="cover" className="h-1/2"></ImageBackground>
			<View className="h-1/2 bg-blue-800 flex flex-col justify-around items-center">
				<View>
					<LandingButton text="LOG IN" href={"/game"}></LandingButton>
					<LandingButton text="SIGN UP" href={""}></LandingButton>
				</View>
			</View>
		</SafeAreaView>
	);
};

export default LandingPage;
