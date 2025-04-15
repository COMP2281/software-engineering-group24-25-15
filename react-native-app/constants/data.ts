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

export const questions = [
	{
		question: "What is 2 + 2?",
		options: ["3", "4", "5", "6"],
		correctAnswer: "4",
	},
	{
		question: "Which planet is closest to the sun?",
		options: ["Earth", "Venus", "Mercury", "Mars"],
		correctAnswer: "Mercury",
	},
	{
		question: "What is the capital of France?",
		options: ["London", "Berlin", "Madrid", "Paris"],
		correctAnswer: "Paris",
	},
	{
		question: "How many legs does a spider have?",
		options: ["6", "8", "10", "12"],
		correctAnswer: "8",
	},
	{
		question: "Which is the largest mammal?",
		options: ["Elephant", "Blue Whale", "Giraffe", "Hippopotamus"],
		correctAnswer: "Blue Whale",
	},
	{
		question: "What is the chemical symbol for gold?",
		options: ["Au", "Ag", "Fe", "Go"],
		correctAnswer: "Au",
	},
	{
		question: "How many sides does a hexagon have?",
		options: ["5", "6", "7", "8"],
		correctAnswer: "6",
	},
	{
		question: "What is the largest organ in the human body?",
		options: ["Brain", "Liver", "Skin", "Heart"],
		correctAnswer: "Skin",
	},
	{
		question: "Which gas do plants absorb from the atmosphere?",
		options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"],
		correctAnswer: "Carbon Dioxide",
	},
	{
		question: "What is 7 × 8?",
		options: ["54", "56", "63", "64"],
		correctAnswer: "56",
	},
];
