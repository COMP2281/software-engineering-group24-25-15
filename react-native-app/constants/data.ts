import { router } from "expo-router";

import icons from "./icons";
import images from "./images";

export const friends = [
	{
		title: "Friends",
		icon: icons.people,
		onPress: () => {
			router.push({ pathname: "/friend-list" });
		},
	},
	{
		title: "Friend Requests",
		icon: icons.mail,
		onPress: () => {
			router.push({ pathname: "/friend-requests" });
		},
	},
];

export const settings = [
	{
		title: "Profile",
		icon: icons.person,
	},
	{
		title: "Language",
		icon: icons.language,
	},
	{
		title: "Help Center",
		icon: icons.info,
	},
];

export const topics = ["Cyber Security", "AI", "Data", "Cloud Computing"];

export const bots = [
	{ name: "Bot 1", image: images.profile1 },
	{ name: "Bot 2", image: images.profile2 },
	{ name: "Bot 3", image: images.profile3 },
];

export const friendsList = [
	{ name: "Friend 1", avatar: images.profile1, status: "online", id: 1, username: "friend1" },
	{ name: "Friend 2", avatar: images.profile2, status: "offline", id: 2, username: "friend2" },
	{ name: "Friend 3", avatar: images.profile3, status: "in-game", id: 3, username: "friend3" },
	{ name: "Friend 4", avatar: images.profile4, status: "online", id: 4, username: "friend4" },
	{ name: "Friend 5", avatar: images.profile5, status: "offline", id: 5, username: "friend5" },
	{ name: "Friend 6", avatar: images.profile6, status: "in-game", id: 6, username: "friend6" },
	{ name: "Friend 7", avatar: images.profile7, status: "online", id: 7, username: "friend7" },
	{ name: "Friend 8", avatar: images.profile8, status: "offline", id: 8, username: "friend8" },
];
