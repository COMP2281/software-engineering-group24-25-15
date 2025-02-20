import { View, Text, Image } from "react-native";
import { Tabs } from "expo-router";

import icons from "@/constants/icons";

const TabIcon = ({ focused, icon, title }: { focused: boolean; icon: any; title: string }) => {
	return (
		<View className="flex-1 mt-3 flex-col items-center">
			<Image source={icon} tintColor={focused ? "#83B0D0" : "#666876"} resizeMode="contain" className="size-8" />
			<Text className={`${focused ? "text-white font-righteous" : "text-gray-500 font-righteous"} text-xs w-full text-center mt-1`}>
				{title}
			</Text>
		</View>
	);
};

const TabsLayout = () => {
	return (
		<Tabs
			screenOptions={{
				headerShown: false,
				tabBarShowLabel: false,
				tabBarStyle: {
					backgroundColor: "#000",
					minHeight: 80,
					borderTopWidth: 0,
				},
			}}
		>
			<Tabs.Screen
				name="leaderboard"
				options={{
					title: "Leaderboard",
					tabBarIcon: ({ focused }) => <TabIcon icon={icons.leaderboard} focused={focused} title="Leaderboard" />,
				}}
			/>
			<Tabs.Screen
				name="statistics"
				options={{
					title: "Stats",
					tabBarIcon: ({ focused }) => <TabIcon icon={icons.stats} focused={focused} title="Stats" />,
				}}
			/>
			<Tabs.Screen
				name="index"
				options={{
					title: "Play",
					tabBarIcon: ({ focused }) => <TabIcon icon={icons.play} focused={focused} title="Home" />,
					tabBarStyle: { position: "absolute", backgroundColor: "transparent", minHeight: 80, borderTopWidth: 0 },
				}}
			/>
			<Tabs.Screen
				name="chat"
				options={{
					title: "AI Chat",
					tabBarIcon: ({ focused }) => <TabIcon icon={icons.chat} focused={focused} title="AI Chat" />,
				}}
			/>
			<Tabs.Screen
				name="settings"
				options={{
					title: "Settings",
					tabBarIcon: ({ focused }) => <TabIcon icon={icons.settings} focused={focused} title="Settings" />,
				}}
			/>
		</Tabs>
	);
};

export default TabsLayout;
