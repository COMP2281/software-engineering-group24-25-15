import { StyleSheet, Text } from "react-native";
import { Link } from "expo-router";

const MenuButton = (props) => {
	return (
		<Link className="w-4/5 bg-grey-primary py-7 px-20 rounded-full mb-12" style={styles.shadow} href={props.href}>
			<Text className="text-center text-4xl font-bold text-white">{props.text}</Text>
		</Link>
	);
};

export default MenuButton;

const styles = StyleSheet.create({
	shadow: {
		boxShadow: "0 0 10px white",
	},
});
