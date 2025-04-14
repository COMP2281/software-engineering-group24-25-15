import { TouchableOpacity, Image, View, Text } from "react-native";
import { router } from "expo-router";

import icons from "@/constants/icons";
import AddFriend from "./../app/(friends)/add-friend";

export const BackButton = () => (
	<TouchableOpacity onPress={() => router.back()} className="absolute top-6 left-6">
		<Image source={icons.back} className="size-10" tintColor={"#fff"}></Image>
	</TouchableOpacity>
);

export const AddFriendButton = () => (
	<TouchableOpacity
		onPress={() => {
			router.push("/add-friend");
		}}
		className="absolute top-7 right-6"
	>
		<Image source={icons.addFriend} className="size-8" tintColor={"#fff"} />
	</TouchableOpacity>
);

export const Logo = ({ height }: { height?: string }) => (
	<View className={`w-full flex justify-center items-center ${height ? height : "h-1/2"}`}>
		<Text className="uppercase tracking-[10px] -rotate-2 text-6xl text-gray-100 font-olibrick mr-40">The</Text>
		<Text className="uppercase tracking-[10px] -rotate-2 text-6xl text-gray-100 font-olibrick ml-40">Tower</Text>
	</View>
);
