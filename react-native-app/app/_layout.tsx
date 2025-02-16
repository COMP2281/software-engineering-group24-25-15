import React, { useState, useEffect } from "react";
import { View, Image, ActivityIndicator, StyleSheet, Text } from "react-native";
import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

import icons from "@/constants/icons";
import images from "@/constants/images";

import "./global.css";

// Helper to get all image URIs from the asset objects
const getAllImageAssets = () => {
	return [...Object.values(icons), ...Object.values(images)];
};

const Preloader = ({ children }: { children: any }) => {
	const [isLoading, setIsLoading] = useState(true);
	const [loadedImages, setLoadedImages] = useState(new Set());
	const imageAssets = getAllImageAssets();

	const [fontsLoaded] = useFonts({
		"Righteous-Regular": require("../assets/fonts/Righteous-Regular.ttf"),
	});

	useEffect(() => {
		const loadAssets = async () => {
			try {
				// Create promises for all image assets
				const imagePromises = imageAssets.map(
					(img) =>
						new Promise((resolve, reject) => {
							if (typeof img === "number") {
								// Handle require('./image') assets
								Image.resolveAssetSource(img);
								setLoadedImages((prev) => new Set([...prev, img]));
								resolve(undefined);
							} else {
								Image.prefetch(img)
									.then(() => {
										setLoadedImages((prev) => new Set([...prev, img]));
										resolve(undefined);
									})
									.catch(reject);
							}
						})
				);

				// Wait for both fonts and images to load
				await Promise.all([...imagePromises, SplashScreen.hideAsync()]);

				setIsLoading(false);
			} catch (error) {
				console.error("Error loading assets:", error);
				setIsLoading(false);
			}
		};

		if (fontsLoaded) {
			loadAssets();
		}
	}, [fontsLoaded]);

	if (!fontsLoaded || isLoading) {
		return (
			<View style={styles.loadingContainer}>
				<ActivityIndicator size="large" color="#ffffff" />
				<View style={styles.progressContainer}>
					<Text style={styles.progressText}>
						Loading assets: {loadedImages.size}/{imageAssets.length}
					</Text>
				</View>
			</View>
		);
	}

	return (
		<Stack
			screenOptions={{
				headerShown: false,
				statusBarStyle: "light",
				statusBarBackgroundColor: "black",
			}}
		>
			{children}
		</Stack>
	);
};

const styles = StyleSheet.create({
	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#000000",
	},
	progressContainer: {
		marginTop: 20,
	},
	progressText: {
		fontSize: 16,
		color: "#ffffff",
		fontFamily: "Righteous-Regular",
	},
});

export default function RootLayout() {
	return <Preloader children={undefined} />;
}
