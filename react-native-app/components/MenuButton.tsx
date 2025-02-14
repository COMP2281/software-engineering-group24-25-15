import { TouchableOpacity, Text } from "react-native";
import { RelativePathString, router } from "expo-router";

const MenuButton = ({ text, link }: { text: string; link?: string }) => {
	return (
		<TouchableOpacity
			className="bg-black-100 rounded-3xl w-3/4 py-3 flex justify-center items-center mt-5"
			onPress={() => {
				if (link) router.push(link as RelativePathString);
			}}
		>
			<Text className="text-5xl font-righteous text-grey-200 uppercase" style={{ lineHeight: 60 }}>
				{text}
			</Text>
		</TouchableOpacity>
	);
};

export default MenuButton;
