import { StyleSheet, Text } from "react-native";
import { Link } from "expo-router";

const MenuButton = (props) => {
	return (
		<Link style={styles.button} href={props.href}>
			<Text style={styles.text}>{props.text}</Text>
		</Link>
	);
};

export default MenuButton;

const styles = StyleSheet.create({
	button: {
		width: "80%",
		backgroundColor: "#353535",
		paddingVertical: 8,
		paddingHorizontal: 80,
		borderRadius: 100,
		boxShadow: "0 0 10px white",
		marginBottom: 40,
	},
	text: {
		textAlign: "center",
		color: "white",
		fontSize: 35,
		lineHeight: 65,
		fontWeight: "bold",
	},
});
