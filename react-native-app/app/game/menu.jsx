import { ImageBackground, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { images, icons } from "../../constants";

import { MenuButton, RoundButton } from "../../components";

const Menu = () => {
	return (
		<SafeAreaView className="flex-1" edges={["left", "right"]}>
			<ImageBackground source={images.background} resizeMode="cover" className="flex-1 justify-between items-center">
				<View className="px-5 flex flex-row justify-between items-center w-full h-24">
					<RoundButton href={""} icon={icons.settings}></RoundButton>
					<RoundButton href={""} icon={icons.volume}></RoundButton>
				</View>
				<View className="flex justify-start items-center w-full">
					<MenuButton text="PLAY" href={"/game"}></MenuButton>
					<MenuButton text="HOST" href={""}></MenuButton>
					<MenuButton text="PRACTICE" href={""}></MenuButton>
				</View>
			</ImageBackground>
		</SafeAreaView>
	);
};

export default Menu;
