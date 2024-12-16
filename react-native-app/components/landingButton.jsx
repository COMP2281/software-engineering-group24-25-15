import { Link } from "expo-router";
import { Text, StyleSheet, TouchableHighlight } from "react-native";

const LandingButton = (props) => {
	return (
		<Link href={props.href} asChild>
			<TouchableHighlight className="w-4/5 py-7 px-20 mb-12 bg-blue-500 rounded-full" underlayColor="#2B6CB0" style={styles.shadow}>
				<Text className="text-white text-center text-2xl">{props.text}</Text>
			</TouchableHighlight>
		</Link>
	);
};

export default LandingButton;

const styles = StyleSheet.create({
	shadow: {
		boxShadow: "0 0 10px #658EAC",
	},
});
