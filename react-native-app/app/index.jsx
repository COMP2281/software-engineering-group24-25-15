import { ImageBackground, StyleSheet } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import MenuButton from "../components/MenuButton";

const Home = () => (
	<SafeAreaProvider>
		<SafeAreaView style={styles.container} edges={["left", "right"]}>
			<ImageBackground source={require("../assets/background.png")} resizeMode="cover" style={styles.image}>
				<MenuButton text="PLAY"></MenuButton>
				<MenuButton text="OPTIONS"></MenuButton>
			</ImageBackground>
		</SafeAreaView>
	</SafeAreaProvider>
);

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	image: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
});

export default Home;
