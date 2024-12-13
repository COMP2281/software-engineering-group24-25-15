import { ImageBackground, StyleSheet, View } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";

import { images, icons } from "../constants";

import { MenuButton, RoundButton } from "../components";

const Home = () => {
	return (
		<SafeAreaProvider>
			<SafeAreaView style={styles.container} edges={["left", "right"]}>
				<ImageBackground source={images.background} resizeMode="cover" style={styles.image}>
					<View style={styles.topButtons}>
						<RoundButton href={""} icon={icons.settings}></RoundButton>
						<RoundButton href={""} icon={icons.volume}></RoundButton>
					</View>
					<View style={styles.buttons}>
						<MenuButton text="PLAY" href={"/game"}></MenuButton>
						<MenuButton text="HOST" href={""}></MenuButton>
						<MenuButton text="PRACTICE" href={""}></MenuButton>
					</View>
				</ImageBackground>
			</SafeAreaView>
		</SafeAreaProvider>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	image: {
		flex: 1,
		justifyContent: "space-between",
		alignItems: "center",
	},
	topButtons: {
		paddingHorizontal: "5%",
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		width: "100%",
		height: 90,
	},
	buttons: {
		display: "flex",
		justifyContent: "flex-start",
		alignItems: "center",
		width: "100%",
	},
});

export default Home;
