import { View, Text, ImageBackground, TextInput, TouchableOpacity, Image, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useRef } from "react";

import images from "@/constants/images";
import icons from "@/constants/icons";

interface Message {
	text: string;
	isUser: boolean;
}

const MessageBubble = ({ text, isUser }: Message) => {
	return (
		<View className={`flex flex-row ${isUser ? "justify-end" : "justify-start"} mb-4`}>
			<View className={`px-4 py-3 rounded-2xl max-w-[80%] ${isUser ? "bg-gray-700" : "bg-blue-100"}`}>
				<Text className="text-grey-200 font-righteous">{text}</Text>
			</View>
		</View>
	);
};

const AIChat = () => {
	const [inputMessage, setInputMessage] = useState("");
	const [messages, setMessages] = useState<Message[]>([]);
	const scrollViewRef = useRef<ScrollView>(null);

	const handleSubmit = () => {
		if (inputMessage.trim() === "") return;

		const userMessage: Message = {
			text: inputMessage,
			isUser: true,
		};

		const aiMessage: Message = {
			text: inputMessage,
			isUser: false,
		};

		setMessages((prevMessages) => [...prevMessages, userMessage, aiMessage]);
		setInputMessage("");

		setTimeout(() => {
			scrollViewRef.current?.scrollToEnd({ animated: true });
		}, 100);
	};

	return (
		<SafeAreaView className="flex-1">
			<ImageBackground source={images.aiBackground} className="w-full h-full" resizeMode="cover">
				<View className="absolute h-full w-full flex">
					<ScrollView
						ref={scrollViewRef}
						className="flex-1 px-4"
						contentContainerStyle={{ paddingTop: 20 }}
						onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
					>
						{messages.map((message, index) => (
							<MessageBubble key={index} text={message.text} isUser={message.isUser} />
						))}
					</ScrollView>

					<View className="p-4">
						<View className="flex flex-row justify-between items-center">
							<TextInput
								className="w-4/5 px-4 py-3 bg-grey border-2 border-blue-100 rounded-2xl text-grey-200 font-righteous"
								value={inputMessage}
								onChangeText={setInputMessage}
								multiline
								numberOfLines={10}
								placeholder="Type your message..."
								placeholderTextColor="#666"
							/>
							<TouchableOpacity onPress={handleSubmit} className="p-2">
								<Image source={icons.aiSubmit} className="size-12" />
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</ImageBackground>
		</SafeAreaView>
	);
};

export default AIChat;
