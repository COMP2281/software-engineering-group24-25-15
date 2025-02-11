import { StyleSheet, Image } from "react-native";
import { Link } from "expo-router";

const RoundButton = (props) => {
	return (
		<Link className="w-14 h-14 bg-grey-primary p-4 rounded-full" style={styles.shadow} href={props.href}>
			<Image source={props.icon} />
		</Link>
	);
};

export default RoundButton;

const styles = StyleSheet.create({
	shadow: {
		boxShadow: "0 0 10px white",
	},
});
