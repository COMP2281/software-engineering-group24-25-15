import { View, Text, TextInput, StyleSheet } from "react-native";
import React, { useState } from "react";

const InputBox = (props) => {
	const [text, setText] = useState("");
	return (
		<View>
			<Text>InputBox</Text>
			<TextInput
				className="w-full h-20 px-8 bg-blue-800 rounded-full border-blue-500 border-2 text-white"
				placeholder={props.innerText}
				onChangeText={setText}
				value={text}
				style={styles.shadow}
			/>
		</View>
	);
};

export default InputBox;

const styles = StyleSheet.create({
	shadow: {
		boxShadow: "0 0 10px #658EAC",
	},
});
