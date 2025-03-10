import { useState, useEffect } from "react";
import { View, Text, ImageBackground, TouchableOpacity, Alert, Image } from "react-native";
import { router } from "expo-router";
import images from "@/constants/images";

// Define questions with a correct option index (0-based)
const questions = [
    { question: "What is IBM SkillsBuild?", correct: 1 },
    { question: "What does SkillsBuild offer?", correct: 2 },
    { question: "How does SkillsBuild help professionals?", correct: 0 },
    { question: "What type of courses are available?", correct: 3 },
    { question: "Why use IBM SkillsBuild?", correct: 2 },
];

// Define hints array (one per question)
const hints = [
    "IBM SkillsBuild is IBM's platform for skill development.",
    "It offers interactive courses and practical projects.",
    "It helps professionals upskill with industry-relevant content.",
    "Courses span technology, business and more.",
    "It combines learning with engaging game elements.",
];

// Define dynamic AI host messages for each question
const hostMessages = [
    "Which answer is correct?",
    "Think carefully before you answer!",
    "Remember your lessons!",
    "Focus - choose wisely!",
    "This is the final question, good luck!",
];

export default function Game() {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [totalScore, setTotalScore] = useState(0);
    const [correctCount, setCorrectCount] = useState(0);
    const [gameFinished, setGameFinished] = useState(false);


    // Handler for answer selection
    const handleAnswer = (selectedIndex: number) => {
        if (selectedIndex === questions[currentQuestionIndex].correct) {
            setTotalScore((prev) => prev + 50);
            setCorrectCount((prev) => prev + 1);
        }
        advanceQuestion();
    };

    // Advance question or finish game and reset states
    const advanceQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex((prev) => prev + 1);
        } else {
            setCurrentQuestionIndex(() => 0)
        }
    };

    // Return Home button handler (assumes index screen is home)
    const returnHome = () => {
        router.push("/");
    };

    // If practise finished, display summary
    if (gameFinished) {
        return (
            <ImageBackground source={images.subBackground} className="w-full h-full" resizeMode="cover">
                <View className="flex-1 justify-center items-center p-6">
                    <Text className="text-white text-3xl font-righteous mb-4">Game Over</Text>
                    <Text className="text-white text-xl font-righteous mb-2">Total Score: {totalScore}</Text>
                    <TouchableOpacity onPress={returnHome} className="mt-5 bg-black-100 border-2 border-blue-100 rounded-3xl p-3">
                        <Text className="text-grey-200 text-center text-xl font-righteous">Return Home</Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        );
    }

    return (
        <ImageBackground source={images.subBackground} className="w-full h-full" resizeMode="cover">
            <View className="flex-1 justify-between p-6">
                {/* Top Section: Header, timer, score and the question (moved to top) */}
                <View>
                    {/* Header*/}
                    <View className="flex-row items-center mt-10 justify-between">
                        <TouchableOpacity onPress={() => router.back()}>
                            <Text className="text-white text-xl font-righteous">Back</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setGameFinished(true)}>
                            <Text className="text-white text-xl font-righteous">Finish</Text>
                        </TouchableOpacity>
                    </View>
                    {/* Score Display */}
                    <View className="mt-2">
                        <Text className="text-white text-xl font-righteous text-center">Score: {totalScore}</Text>
                    </View>
                    {/* Question at the top */}
                    <View className="mt-6 bg-black-200 p-4 rounded-2xl border-2 border-blue-200">
                        <Text className="text-white text-lg font-righteous">{questions[currentQuestionIndex].question}</Text>
                    </View>
                </View>
                <View className="mt-6">
                    <View className="flex-row justify-center my-4">
                        <Image source={images.profile3} className="w-28 h-28 rounded-full border-2 border-blue-100 -mt-5" />
                    </View>
                    {/* Host output text */}
                    <View className="mt-4 bg-black-200 p-4 rounded-2xl border-2 border-blue-200 mx-12">
                        <Text className="text-white text-xl font-righteous text-center">
                            {hostMessages[currentQuestionIndex % hostMessages.length]}
                        </Text>
                    </View>
                    {/* Bottom Section: Four Answer Buttons and Extra Buttons (Hint and 50/50) */}
				<View className="mb-10">
					{["Option 1", "Option 2", "Option 3", "Option 4"].map((option, index) => (
						<TouchableOpacity
							key={index}
							onPress={() => handleAnswer(index)}
							className={`bg-black-100 border-2 border-blue-100 rounded-3xl p-3 mb-2 "opacity-50" : ""}`}
						>
							<Text className="text-grey-200 text-center text-xl font-righteous">{option}</Text>
						</TouchableOpacity>
					))}
                </View>
                </View>
            </View>
        </ImageBackground>
    );
}
