import { StyleSheet, Image } from "react-native";
import { Link } from "expo-router";

const RoundButton = (props) => {
	return (
		<Link style={styles.button} href={props.href}>
			<Image source={props.icon} />
		</Link>
	);
};

export default RoundButton;

const styles = StyleSheet.create({
	button: {
		width: 60,
		height: 60,
		backgroundColor: "#353535",
		padding: 15,
		borderRadius: 100,
		boxShadow: "0 0 10px white",
	},
});
