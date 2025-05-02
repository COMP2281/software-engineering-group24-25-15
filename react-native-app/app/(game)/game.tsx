
import React, { useState, useRef, useEffect } from "react";
import { View, Animated, ImageBackground, Image, Text, TouchableOpacity, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "@/lib/auth/authContext";
import { getQuestions } from "@/lib/api/gameService";
import { getMockQuestions, MOCK_QUESTIONS } from "@/lib/api/mockQuestions";
import images from "@/constants/images";

interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
}

// Constants

const TOTAL_FLOORS   = 10;  // size of the tower (change as you like)
const TIME_PER_Q     = 30;  // seconds for each question
const topics         = Object.keys(MOCK_QUESTIONS);
const randomTopic    = () => topics[Math.floor(Math.random() * topics.length)];

// Timer

const Timer = ({ timeLeft }: { timeLeft: number }) => (
  <View className="absolute top-1/2 right-1/2 translate-x-[50%] z-10 -translate-y-[75%] bg-gray-800/70 px-4 py-2 rounded-full">
    <Text className="text-white font-righteous text-lg">{timeLeft}</Text>
  </View>
);

// Floor grid

const FloorGrid = ({
  currentFloor,
  totalFloors,
}: {
  currentFloor: number;
  totalFloors: number;
}) => {
  const translateY = useRef(new Animated.Value(0)).current;
  const [containerHeight, setContainerHeight] = useState(0);

  useEffect(() => {
    if (containerHeight > 0) {
		// Calculate percentage-based translation
		const percentageTranslation = -((totalFloors - 3 - currentFloor) * containerHeight) / 3;

		// Animate the floor position when the current floor changes
      Animated.timing(translateY, {
			toValue: percentageTranslation,
        	duration: 500,
        	useNativeDriver: true,
      }).start();
    }
  }, [currentFloor, totalFloors, containerHeight]);

  return (
    <View className="relative flex-1 flex-col">
      {/* Floors */}
		<View id="floors" className="absolute h-3/4 w-full bottom-2 flex flex-col justify-end overflow-hidden">
        	<Animated.View
          		className="flex-1"
          		style={{ transform: [{ translateY }] }}
          		onLayout={(e) => setContainerHeight(e.nativeEvent.layout.height)}
        		>
          {Array.from({ length: totalFloors }, (_, i) => (
            <View
              key={i}
              className="flex flex-row justify-between items-center border-t-4 border-floor h-1/3"
            >
              <View className="w-20 h-full bg-gray-200/10 justify-center items-center">
                <Text className="text-white text-center font-righteous">
                  {totalFloors - i - 1}
                </Text>
              </View>
              <View className="flex-1 h-full bg-gray-300/10" />
              <View className="flex-1 h-full bg-gray-400/10" />
              <View className="w-20 h-full bg-gray-500/10" />
            </View>
          ))}
        </Animated.View>
      </View>

			{/* Gradient lines for the top of the floor */}
      <View className="absolute w-full h-full bg-transparent inset-0">
        <View className="absolute left-20 h-full">
          <LinearGradient
            colors={["transparent", "#2C2E39"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 0.2 }}
            className="w-1 h-full"
          />
        </View>
        <View className="absolute left-1/2 -ml-px h-full">
          <LinearGradient
            colors={["transparent", "#2C2E39"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 0.2 }}
            className="w-1 h-full"
          />
        </View>
        <View className="absolute right-20 h-full">
          <LinearGradient
            colors={["transparent", "#2C2E39"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 0.2 }}
            className="w-1 h-full"
          />
        </View>
      </View>

			{/* Thick floor line */}
			<View className="absolute bg-gray-400 h-2 w-full bottom-0"></View>
    </View>
  );
};

// Main

export default function Game() {
  const { token, isAuthenticated } = useAuth();

  // State variables
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [currentFloor, setCurrentFloor]     = useState(0);
  const [timeLeft, setTimeLeft]             = useState(TIME_PER_Q);
  const [gameWon, setGameWon]               = useState(false);

  // Fetch question from API or mock data

  const fetchQuestion = async (): Promise<Question> => {
    let attempt = 0;
    while (attempt < 5) {               // try a few topics before giving up
      attempt += 1;
      const topic = randomTopic();
      try {
        // Try API first, then fallback to mock data
        let raw: any[] = [];
        if (isAuthenticated && token) {
          raw = await getQuestions(token, topic, 1, false);
        }
        if (!Array.isArray(raw) || raw.length === 0) {
          raw = getMockQuestions(topic, 1);
        }
        const q = raw[0];
        if (
          q &&
          q.question &&
          Array.isArray(q.options) &&
          q.options.length > 0
        ) {
          return {
            question:      q.question,
            options:       q.options,
            correctAnswer: q.correct_answer,
          };
        }
      } catch (e) {
        // Ignore and try a different topic
      }
    }
    // If everything fails, return a hardcoded placeholder
    return {
      question:
        "Sorry, we couldn't load a question right now. Try again later!",
      options: ["OK"],
      correctAnswer: "OK",
    };
  };

  // first question on mount
  useEffect(() => {
    fetchQuestion().then(setCurrentQuestion);
  }, []);

  // timer
  useEffect(() => {
    if (!currentQuestion || gameWon) return;

    if (timeLeft > 0) {
      const id = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
      return () => clearTimeout(id);
    }

    Alert.alert("Time's up!", "Moving to the next question.");
    advanceFloor();
  }, [timeLeft, currentQuestion, gameWon]);

  // helpers
  const advanceFloor = async () => {
    const next = currentFloor + 1;

    if (next >= TOTAL_FLOORS) {
      setGameWon(true);
      return;
    }

    setCurrentFloor(next);
    setTimeLeft(TIME_PER_Q);
    const nextQ = await fetchQuestion();
    setCurrentQuestion(nextQ);
  };

  const handleAnswer = (answer: string) => {
    if (!currentQuestion || gameWon) return;

    if (answer === currentQuestion.correctAnswer) {
      advanceFloor();
    } else {
      Alert.alert("Incorrect!", "Try again.");
    }
  };

  // render
  return (
    <View className="flex-1">
      <ImageBackground
        source={images.profileBackground}
        className="w-full h-full"
        resizeMode="cover"
      >
        <View className="mx-6 flex flex-col justify-start items-center">
          {/* Question bubble */}
          <View className="flex flex-row justify-center items-center w-full">
            <Image source={images.aiHostSmall} className="pr-4" />
            <View className="flex-1 justify-center items-center bg-grey-200/30 py-4 px-6 rounded-3xl border border-blue-200">
              <Text className="text-white font-righteous">
                {gameWon
                  ? "Congratulations! You reached the top!"
                  : currentQuestion?.question ?? "Loading…"}
              </Text>
            </View>
          </View>

          {/* Options */}
          <View className="w-full flex flex-row flex-wrap justify-between">
            {!gameWon &&
              currentQuestion?.options.map((opt, idx) => (
                <TouchableOpacity
                  key={idx}
                  onPress={() => handleAnswer(opt)}
                  activeOpacity={0.8}
                  className="bg-grey-200/10 border border-blue-200 rounded-3xl py-3 w-[48%] flex justify-center items-center mt-4"
                >
                  <Text
                    className="text-xl font-righteous text-grey-200 uppercase"
                    style={{ lineHeight: 60 }}
                  >
                    {opt}
                  </Text>
                </TouchableOpacity>
              ))}
          </View>
        </View>

        {!gameWon && <Timer timeLeft={timeLeft} />}
        <FloorGrid currentFloor={currentFloor} totalFloors={TOTAL_FLOORS} />
      </ImageBackground>
    </View>
  );
}
