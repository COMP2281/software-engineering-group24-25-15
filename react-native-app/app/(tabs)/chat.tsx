import { View, Text, ImageBackground, TextInput, TouchableOpacity, Image, ScrollView, ActivityIndicator, Alert } from "react-native";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/lib/auth/authContext";
import { API_URL } from "@/constants/config";
import TypewriterText from "@/components/TypewriterText";

import images from "@/constants/images";
import icons from "@/constants/icons";

interface Message {
	text: string;
	isUser: boolean;
}

// Function to get AI response from backend
const getAIResponse = async (token: string | null, userMessage: string): Promise<string> => {
	if (!token) {
		throw new Error("Authentication required");
	}

	try {
		// Construct the URL with the encoded request parameter
		const url = `${API_URL}/game/responce/?request=${encodeURIComponent(userMessage)}`;
		
		const response = await fetch(url, {
			method: "GET",
			headers: {
				"Authorization": `JWT ${token}`,
				"Accept": "application/json",
			},
		});

		if (!response.ok) {
			throw new Error(`Error: ${response.status}`);
		}

		// Parse the response
		const data = await response.text();
		
		try {
			// Try to parse as JSON first
			const jsonData = JSON.parse(data);
			// Return the trimmed response field if it exists, otherwise use the whole response
			const responseText = (jsonData.response || jsonData || data).toString();
			return responseText.trim();
		} catch (e) {
			// If not JSON, return the trimmed raw text
			return data.trim();
		}
	} catch (error) {
		console.error("Error getting AI response:", error);
		throw error;
	}
};

const MessageBubble = ({ text, isUser }: Message) => (
	<View className={`flex flex-row ${isUser ? "justify-end" : "justify-start"} mb-4`}>
		<View className={`px-4 py-3 rounded-2xl max-w-[80%] ${isUser ? "bg-gray-700" : "bg-blue-100"}`}>
			{isUser ? (
				<Text className="text-grey-200 font-righteous">{text}</Text>
			) : (
				<TypewriterText 
					text={text} 
					speed={15}
					style={{ fontFamily: "Righteous" }}
					className="text-grey-200"
				/>
			)}
		</View>
	</View>
);

const AIChat = () => {
	const { token } = useAuth();
	const [inputMessage, setInputMessage] = useState("");
	const [messages, setMessages] = useState<Message[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const scrollViewRef = useRef<ScrollView>(null);

	// Add initial welcome message
	useEffect(() => {
		setMessages([
			{
				text: "Hello! I'm your AI assistant. How can I help you today?",
				isUser: false
			}
		]);
	}, []);

	const handleSubmit = async () => {
		if (inputMessage.trim() === "" || isLoading) return;

		const userMessage: Message = {
			text: inputMessage.trim(),
			isUser: true,
		};

		// Add the user message immediately
		setMessages((prevMessages) => [...prevMessages, userMessage]);
		
		// Clear input field
		const messageToSend = inputMessage.trim();
		setInputMessage("");
		
		// Scroll to bottom
		setTimeout(() => {
			scrollViewRef.current?.scrollToEnd({ animated: true });
		}, 100);

		// Show loading state
		setIsLoading(true);

		try {
				// Add prompt engineering to limit responses to around 50 words
			const enhancedPrompt = `${messageToSend} 
Please keep your response concise, around 50 words maximum. Be direct and to the point. Don't display wordcount.`;
			
			// Get AI response from backend with enhanced prompt
			let aiResponseText = await getAIResponse(token, enhancedPrompt);
			
			// Additional trim to ensure no whitespace remains
			aiResponseText = aiResponseText.trim();
			
			const aiMessage: Message = {
				text: aiResponseText,
				isUser: false,
			};

			// Add the AI response
			setMessages((prevMessages) => [...prevMessages, aiMessage]);
			
			// Scroll to bottom again after AI response is added
			setTimeout(() => {
				scrollViewRef.current?.scrollToEnd({ animated: true });
			}, 100);
		} catch (error) {
			console.error("Failed to get AI response:", error);
			
			Alert.alert(
				"Error",
				"Failed to get a response from the AI. Please try again.",
				[{ text: "OK" }]
			);
			
			// Add error message
			const errorMessage: Message = {
				text: "Sorry, I couldn't process your request. Please try again.",
				isUser: false,
			};
			
			setMessages((prevMessages) => [...prevMessages, errorMessage]);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<View className="flex-1">
			<ImageBackground source={images.subBackground} className="w-full h-full" resizeMode="cover">
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
						
						{/* Loading indicator */}
						{isLoading && (
							<View className="flex flex-row justify-start mb-4">
								<View className="px-4 py-3 rounded-2xl bg-blue-100">
									<ActivityIndicator color="#fff" size="small" />
								</View>
							</View>
						)}
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
								editable={!isLoading}
							/>
							<TouchableOpacity 
								onPress={handleSubmit} 
								className="p-2"
								disabled={isLoading || inputMessage.trim() === ""}
								style={{ opacity: (isLoading || inputMessage.trim() === "") ? 0.5 : 1 }}
							>
								<Image source={icons.aiSubmit} className="size-12" />
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</ImageBackground>
		</View>
	);
};

export default AIChat;
