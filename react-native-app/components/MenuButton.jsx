import { StyleSheet, View } from "react-native";
import { Link } from "expo-router";

const MenuButton = (props) => {
	return (
		<View style={styles.menuButton}>
			<Link style={styles.menuText} href={"/game"}>
				{props.text}
			</Link>
		</View>
	);
};

export default MenuButton;

const styles = StyleSheet.create({
	menuButton: {
		width: "80%",
		backgroundColor: "#353535",
		paddingVertical: 8,
		paddingHorizontal: 80,
		borderRadius: 100,
		boxShadow: "0 0 10px white",
	},
	menuText: {
		textAlign: "center",
		color: "white",
		fontSize: 42,
		lineHeight: 84,
		fontWeight: "bold",
	},
});
