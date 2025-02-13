import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";

import "./global.css";

export default function RootLayout() {
	const [fontsLoaded] = useFonts({
		"Righteous-Regular": require("../assets/fonts/Righteous-Regular.ttf"),
	});

	useEffect(() => {
		if (!fontsLoaded) {
			SplashScreen.hideAsync();
		}
	}, [fontsLoaded]);

	if (!fontsLoaded) return null;

	return <Stack screenOptions={{ headerShown: false, statusBarStyle: "light", statusBarBackgroundColor: "black" }} />;
}
