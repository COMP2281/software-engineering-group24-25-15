import { useState, useEffect, useMemo } from "react";
import { View, Text, ImageBackground, TouchableOpacity, Alert, Image, ActivityIndicator } from "react-native";
import { router, useLocalSearchParams, Redirect } from "expo-router";
import { useAuth } from "@/lib/auth/authContext";
import images from "@/constants/images";
import { getQuestions, getAIResponse, updateStatistics, Question } from "@/lib/api/gameService";
import { Difficulty } from "./difficulty-selection";
import { getMockQuestions, getMockIntroduction } from "./mock-data";

// Define bot opponents with appropriate scoring ranges for each difficulty
const BOT_PLAYERS = [
  { name: "Bot 1", image: images.profile1 },
  { name: "Bot 2", image: images.profile2 },
  { name: "Bot 3", image: images.profile3 },
];

export default function Game() {
  const { token, isAuthenticated } = useAuth();
  const params = useLocalSearchParams<{ topics: string; difficulty: string }>();
  
  // If not logged in, redirect to sign-in
  if (!isAuthenticated) {
    return <Redirect href="/(auth)/sign-in" />;
  }
  
  // Memoize the parsed topics to prevent re-parsing on every render
  const topics = useMemo(() => {
    try {
      return params.topics ? JSON.parse(params.topics as string) : [];
    } catch (e) {
      console.error("Error parsing topics:", e);
      return [];
    }
  }, [params.topics]);
  
  const difficulty = params.difficulty as Difficulty || 'Medium';
  
  // State variables with safe defaults
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<Question[][]>([]);
  const [hostIntroductions, setHostIntroductions] = useState<string[]>([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [gameStage, setGameStage] = useState<'introduction' | 'question' | 'roundSummary' | 'gameSummary'>('introduction');
  
  const [hintUsed, setHintUsed] = useState(false);
  const [eliminationUsed, setEliminationUsed] = useState(false);
  const [eliminatedOptions, setEliminatedOptions] = useState<boolean[]>([]);
  const [timeLeft, setTimeLeft] = useState(20);
  const [totalScore, setTotalScore] = useState(0);
  const [roundScore, setRoundScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [botScores, setBotScores] = useState<number[]>([0, 0, 0]);

  // Load questions and introductions from API
  useEffect(() => {
    // Skip if there are no topics or no token
    if (!Array.isArray(topics) || topics.length === 0 || !token) return;
    
    console.log("Loading game data with topics:", topics);
    
    let mounted = true; // To handle component unmount
    
    const loadGameData = async () => {
      // Check authentication
      if (!token) {
        Alert.alert(
          "Authentication Required", 
          "You need to be logged in to play the game.", 
          [{
            text: "Go to Login",
            onPress: () => router.replace("/(auth)/sign-in")
          }]
        );
        return;
      }
      
      try {
        setLoading(true);
        const fetchedQuestions: Question[][] = [];
        const introductions: string[] = [];
        
        // Fetch questions for each selected topic
        for (const topic of topics) {
          console.log(`Loading questions for topic: ${topic}`);
          try {
            const topicQuestions = await getQuestions(token, topic, 3, true);
            
            // Only update state if component is still mounted
            if (!mounted) return;
            
            if (Array.isArray(topicQuestions) && topicQuestions.length > 0) {
              fetchedQuestions.push(topicQuestions);
              
              // Get AI host introduction for each topic
              const promptText = `Write a brief one-sentence introduction for a quiz about ${topic}. Do not ask how you can help. Start with "Welcome to" or "Get ready for".`;
              try {
                const intro = await getAIResponse(token, promptText);
                if (!mounted) return;
                introductions.push(intro);
              } catch (introError) {
                console.error(`Error fetching introduction for ${topic}:`, introError);
                introductions.push(getMockIntroduction(topic));
              }
            } else {
              console.warn(`No questions returned for topic: ${topic}, using mock data`);
              fetchedQuestions.push(getMockQuestions(topic));
              introductions.push(getMockIntroduction(topic));
            }
          } catch (topicError) {
            console.error(`Error loading data for topic ${topic}:`, topicError);
            fetchedQuestions.push(getMockQuestions(topic));
            introductions.push(getMockIntroduction(topic));
          }
        }
        
        if (!mounted) return;
        
        if (fetchedQuestions.length === 0) {
          throw new Error("No questions could be loaded for any topic");
        }
        
        setQuestions(fetchedQuestions);
        setHostIntroductions(introductions);
        console.log('Game data loaded successfully with', fetchedQuestions.length, 'topics');
      } catch (error) {
        if (!mounted) return;
        
        console.error("Failed to load game data:", error);
        Alert.alert(
          "Error", 
          "Failed to load game data. Would you like to try again?",
          [
            {
              text: "Try Again", 
              onPress: () => loadGameData()
            },
            {
              text: "Go Back", 
              onPress: () => router.back(), 
              style: "cancel"
            },
          ]
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };
    
    loadGameData();
    
    // Cleanup function to handle component unmount
    return () => {
      mounted = false;
    };
  }, [token, topics]); // Use params.topics instead of the derived topics variable

  // Get current question based on round and question index - with safer access
  const currentQuestion = useMemo(() => {
    if (
      Array.isArray(questions) &&
      questions.length > 0 &&
      questions[currentRound] &&
      questions[currentRound].length > 0
    ) {
      // fallback to first question if currentQuestionIndex is out of bounds
      return questions[currentRound][currentQuestionIndex] || questions[currentRound][0];
    }
    return null;
  }, [questions, currentRound, currentQuestionIndex]);
  
  // Timer effect: resets on question/round changes
  useEffect(() => {
    if (gameStage !== 'question' || !currentQuestion) return;
    
    setTimeLeft(20);
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleTimeOut();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [currentRound, currentQuestionIndex, gameStage, currentQuestion]);

  // Handle timer expiration
  const handleTimeOut = () => {
    advanceQuestion(false);
  };

  // Handle answer selection
  const handleAnswer = (selectedOption: string) => {
    if (!currentQuestion) return;
    
    const isCorrect = selectedOption === currentQuestion.correct_answer;
    
    if (isCorrect) {
      // Calculate score based on time left and difficulty
      const difficultyMultiplier = difficulty === 'Easy' ? 1 : difficulty === 'Medium' ? 1.5 : 2;
      const scoreForQuestion = Math.floor((timeLeft / 20) * 50 * difficultyMultiplier);
      
      setTotalScore(prev => prev + scoreForQuestion);
      setRoundScore(prev => prev + scoreForQuestion);
      setCorrectCount(prev => prev + 1);
    }
    
    advanceQuestion(isCorrect);
  };

  // Advance to the next question, round, or end game
  const advanceQuestion = (wasCorrect: boolean) => {
    // Make sure questions and the current round questions are defined
    if (!Array.isArray(questions) || !Array.isArray(questions[currentRound])) {
      console.error("No questions available for the current round");
      return;
    }
    
    // If we have more questions in the current round
    if (currentQuestionIndex < questions[currentRound].length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      resetQuestionState();
    } 
    // If we have more rounds
    else if (currentRound < topics.length - 1) {
      // Generate bot scores for the round
      updateBotScores();
      // Show round summary
      setGameStage('roundSummary');
    } 
    // Game is over
    else {
      // Final bot scores update
      updateBotScores();
      // Submit player score to server
      if (token) {
        updateStatistics(token, totalScore).catch(console.error);
      }
      setGameStage('gameSummary');
    }
  };

  // Reset per-question state
  const resetQuestionState = () => {
    setHintUsed(false);
    setEliminationUsed(false);
    // Initialize eliminatedOptions safely
    if (currentQuestion && Array.isArray(currentQuestion.options)) {
      setEliminatedOptions(new Array(currentQuestion.options.length).fill(false));
    } else {
      setEliminatedOptions([]); 
    }
  };

  // Start the next round
  const startNextRound = () => {
    setCurrentRound(prev => prev + 1);
    setCurrentQuestionIndex(0);
    setRoundScore(0);
    setGameStage('introduction');
    resetQuestionState();
  };

  // Update bot scores based on difficulty
  const updateBotScores = () => {
    const newBotScores = [...botScores];
    
    const minScore = difficulty === 'Easy' ? 30 : difficulty === 'Medium' ? 50 : 80;
    const maxScore = difficulty === 'Easy' ? 80 : difficulty === 'Medium' ? 120 : 150;
    
    for (let i = 0; i < BOT_PLAYERS.length; i++) {
      const randomScore = Math.floor(Math.random() * (maxScore - minScore + 1)) + minScore;
      newBotScores[i] += randomScore;
    }
    
    setBotScores(newBotScores);
  };

  // Handler for the hint button
  const handleHint = () => {
    if (!hintUsed && currentQuestion?.hint) {
      Alert.alert("Hint", currentQuestion.hint);
      setHintUsed(true);
    } else if (!currentQuestion?.hint) {
      Alert.alert("No Hint", "Sorry, no hint is available for this question.");
    }
  };

  // Handler for the 50/50 elimination button
  const handleElimination = () => {
    if (!eliminationUsed && currentQuestion && Array.isArray(currentQuestion.options)) {
      const correctAnswer = currentQuestion.correct_answer;
      const wrongOptions = currentQuestion.options.filter(option => option !== correctAnswer);
      
      // Pick 2 random wrong options to eliminate (or fewer if not enough wrong options)
      const eliminateCount = Math.min(2, wrongOptions.length);
      const shuffledWrongOptions = [...wrongOptions].sort(() => 0.5 - Math.random());
      const optionsToEliminate = shuffledWrongOptions.slice(0, eliminateCount);
      
      // Safely map over the options array
      const newEliminated = currentQuestion.options.map(option => 
        optionsToEliminate.includes(option)
      );
      
      setEliminatedOptions(newEliminated);
      setEliminationUsed(true);
      Alert.alert("50/50", `${eliminateCount} incorrect options have been removed.`);
    }
  };

  // Start the round after the introduction
  const startRoundAfterIntro = () => {
    setGameStage('question');
  };

  // Return to Home screen
  const returnHome = () => {
    router.push("/");
  };

  // Initialize eliminatedOptions when the current question changes
  useEffect(() => {
    if (currentQuestion && gameStage === 'question' && Array.isArray(currentQuestion.options)) {
      setEliminatedOptions(new Array(currentQuestion.options.length).fill(false));
    } else {
      setEliminatedOptions([]);
    }
  }, [currentQuestion, gameStage]);

  // Show loading screen while fetching data
  if (loading) {
    return (
      <ImageBackground source={images.subBackground} className="w-full h-full" resizeMode="cover">
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#ffffff" />
          <Text className="text-white text-xl font-righteous mt-4">Loading game...</Text>
        </View>
      </ImageBackground>
    );
  }

  // Round Introduction Screen - with extra safety checks
  if (gameStage === 'introduction') {
    const safeCurrentRound = Math.min(currentRound, Array.isArray(topics) ? topics.length - 1 : 0);
    const currentTopic = Array.isArray(topics) && topics.length > safeCurrentRound ? topics[safeCurrentRound] : 'Unknown Topic';
    const introduction = Array.isArray(hostIntroductions) && hostIntroductions.length > safeCurrentRound 
      ? hostIntroductions[safeCurrentRound] 
      : `Welcome to the ${currentTopic} round! Let's test your knowledge.`;

    return (
      <ImageBackground source={images.subBackground} className="w-full h-full" resizeMode="cover">
        <View className="flex-1 justify-center p-6">
          <Text className="text-white text-3xl font-righteous text-center mb-6">
            Round {safeCurrentRound + 1}: {currentTopic}
          </Text>
          
          <View className="bg-black-200 p-6 rounded-2xl border-2 border-blue-200 mb-8">
            <Text className="text-white text-xl font-righteous text-center">
              {introduction}
            </Text>
          </View>
          
          <View className="flex-row justify-center my-6">
            <Image source={images.profile3} className="w-28 h-28 rounded-full border-2 border-blue-100" />
          </View>
          
          <TouchableOpacity
            onPress={startRoundAfterIntro}
            className="bg-black-100 border-2 border-blue-100 rounded-3xl p-4 mt-6"
          >
            <Text className="text-grey-200 text-center text-xl font-righteous">
              Start Round
            </Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    );
  }

  // Round Summary Screen - with extra safety checks
  if (gameStage === 'roundSummary') {
    const safeBotPlayers = Array.isArray(BOT_PLAYERS) ? BOT_PLAYERS : [];
    const safeBotScores = Array.isArray(botScores) ? botScores : [];

    return (
      <ImageBackground source={images.subBackground} className="w-full h-full" resizeMode="cover">
        <View className="flex-1 justify-center p-6">
          <Text className="text-white text-3xl font-righteous text-center mb-6">
            Round {currentRound + 1} Complete
          </Text>
          
          <View className="bg-black-200 p-6 rounded-2xl border-2 border-blue-200 mb-8">
            <Text className="text-white text-xl font-righteous mb-4">Scores this round:</Text>
            
            <Text className="text-white text-lg font-righteous">
              You: {roundScore} points
            </Text>
            
            {safeBotPlayers.map((bot, index) => {
              let botRoundScore = 0;
              if (index < safeBotScores.length) {
                if (currentRound > 0) {
                  const previousTotal = Math.floor(safeBotScores[index] / (currentRound + 1));
                  botRoundScore = safeBotScores[index] - previousTotal;
                } else {
                  botRoundScore = safeBotScores[index];
                }
              }
              return (
                <Text key={index} className="text-white text-lg font-righteous">
                  {bot.name || `Bot ${index + 1}`}: {botRoundScore} points
                </Text>
              );
            })}
          </View>
          
          <Text className="text-white text-xl font-righteous text-center mb-6">
            Total Score: {totalScore}
          </Text>
          
          <TouchableOpacity
            onPress={startNextRound}
            className="bg-black-100 border-2 border-blue-100 rounded-3xl p-4 mt-4"
          >
            <Text className="text-grey-200 text-center text-xl font-righteous">
              Next Round
            </Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    );
  }

  // Game Summary (Final Results) Screen - with extra safety checks
  if (gameStage === 'gameSummary') {
    const safeBotPlayers = Array.isArray(BOT_PLAYERS) ? BOT_PLAYERS : [];
    const safeBotScores = Array.isArray(botScores) ? botScores : [];
    
    const allPlayers = [
      { name: 'You', score: totalScore },
      ...safeBotPlayers.map((bot, index) => ({ 
        name: bot.name || `Bot ${index + 1}`, 
        score: index < safeBotScores.length ? safeBotScores[index] : 0 
      }))
    ].sort((a, b) => b.score - a.score);
    
    const userRank = allPlayers.findIndex(player => player.name === 'You') + 1;
    const safeTopicsLength = Array.isArray(topics) ? topics.length : 0;
    const totalQuestions = safeTopicsLength * 3;
    
    return (
      <ImageBackground source={images.subBackground} className="w-full h-full" resizeMode="cover">
        <View className="flex-1 justify-center p-6">
          <Text className="text-white text-3xl font-righteous text-center mb-6">
            Game Complete
          </Text>
          
          <View className="bg-black-200 p-6 rounded-2xl border-2 border-blue-200 mb-8">
            <Text className="text-white text-xl font-righteous mb-4">Final Scores:</Text>
            
            {allPlayers.map((player, index) => (
              <Text 
                key={index} 
                className={`text-white text-lg font-righteous ${player.name === 'You' ? 'text-blue-300' : ''}`}
              >
                {index + 1}. {player.name}: {player.score} points
              </Text>
            ))}
          </View>
          
          <Text className="text-white text-xl font-righteous text-center mb-2">
            You answered {correctCount} out of {totalQuestions} questions correctly
          </Text>
          
          <Text className="text-white text-xl font-righteous text-center mb-6">
            {userRank === 1 
              ? "Congratulations! You won!" 
              : `You placed ${userRank}${userRank === 2 ? 'nd' : userRank === 3 ? 'rd' : 'th'}`}
          </Text>
          
          <TouchableOpacity
            onPress={returnHome}
            className="bg-black-100 border-2 border-blue-100 rounded-3xl p-4 mt-4"
          >
            <Text className="text-grey-200 text-center text-xl font-righteous">
              Return to Home
            </Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    );
  }

  // Question Screen (Main Game) - with extra safety checks
  return (
    <ImageBackground source={images.subBackground} className="w-full h-full" resizeMode="cover">
      <View className="flex-1 justify-between p-6">
        {/* Top Section: Header, timer, score and the question */}
        <View>
          {/* Header and Timer */}
          <View className="flex-row items-center mt-10 justify-between">
            <TouchableOpacity onPress={() => router.back()}>
              <Text className="text-white text-xl font-righteous">Exit</Text>
            </TouchableOpacity>
            <Text className="text-white text-xl font-righteous">Time: {timeLeft}s</Text>
          </View>
          
          {/* Round and Score Display */}
          <View className="mt-2 flex-row justify-between">
            <Text className="text-white text-xl font-righteous">Round {currentRound + 1}/{Array.isArray(topics) ? topics.length : 0}</Text>
            <Text className="text-white text-xl font-righteous">Score: {totalScore}</Text>
          </View>
          
          {/* Progress indicator - with safe values */}
          <View className="mt-2 flex-row justify-center">
            <Text className="text-white text-lg font-righteous">
              Question {currentQuestionIndex + 1}/
              {currentQuestion && Array.isArray(questions[currentRound])
                ? questions[currentRound].length
                : 3}
            </Text>
          </View>
          
          {/* Question display - with safety check */}
          {currentQuestion && (
            <View className="mt-6 bg-black-200 p-4 rounded-2xl border-2 border-blue-200">
              <Text className="text-white text-lg font-righteous">{currentQuestion.question}</Text>
            </View>
          )}
        </View>
        
        {/* Graphics Section: Players and host */}
        <View className="mt-6">
          {/* Player images row - with safe array handling */}
          <View className="flex-row justify-around">
            {Array.isArray(BOT_PLAYERS) && BOT_PLAYERS.map((bot, index) => (
              <Image 
                key={index}
                source={bot?.image || images.profile1}  // Provide default image as fallback
                className={`w-16 h-16 rounded-full border-2 border-blue-100 ${index === 1 || index === 2 ? '-mt-10' : ''}`}
              />
            ))}
            <Image 
              source={images.profile1} 
              className="w-16 h-16 rounded-full border-2 border-blue-300" 
            />
          </View>
          
          {/* Host image */}
          <View className="flex-row justify-center my-4">
            <Image 
              source={images.profile3} 
              className="w-28 h-28 rounded-full border-2 border-blue-100 -mt-5" 
            />
          </View>
          
          {/* Host message */}
          <View className="mt-4 bg-black-200 p-4 rounded-2xl border-2 border-blue-200 mx-12">
            <Text className="text-white text-xl font-righteous text-center">
              {timeLeft < 5 
                ? "Hurry up! Time's almost out!" 
                : currentQuestion 
                  ? "Choose the correct answer!"
                  : "Loading question..."}
            </Text>
          </View>
        </View>
        
        {/* Bottom Section: Answer options and help buttons */}
        <View className="mb-10">
          {/* Debug info to see if we have a question */}
          {!currentQuestion && (
            <Text className="text-white text-lg font-righteous text-center mb-4">
              Waiting for questions to load...
            </Text>
          )}
          
          {/* Fallback if no options array */}
          {currentQuestion && (!Array.isArray(currentQuestion.options) || currentQuestion.options.length === 0) && (
            <>
              {["Option A", "Option B", "Option C", "Option D"].map((option, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleAnswer(option)}
                  className="bg-black-100 border-2 border-blue-100 rounded-3xl p-3 mb-2"
                >
                  <Text className="text-grey-200 text-center text-xl font-righteous">
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </>
          )}
          
          {/* Answer options - with enhanced safety checks */}
          {currentQuestion && Array.isArray(currentQuestion.options) && currentQuestion.options.length > 0 && 
            currentQuestion.options.map((option, index) => {
              const isEliminated = Array.isArray(eliminatedOptions) && eliminatedOptions.length > index 
                ? eliminatedOptions[index] 
                : false;
              
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => !isEliminated && option && handleAnswer(option)}
                  disabled={isEliminated}
                  className={`bg-black-100 border-2 border-blue-100 rounded-3xl p-3 mb-2 ${isEliminated ? "opacity-50" : ""}`}
                >
                  <Text className="text-grey-200 text-center text-xl font-righteous">
                    {option || `Option ${index + 1}`}
                  </Text>
                </TouchableOpacity>
              );
            })
          }
          
          {/* Extra Buttons Row */}
          <View className="flex-row justify-between mt-2">
            <TouchableOpacity
              onPress={handleHint}
              disabled={hintUsed}
              className={`bg-black-100 border-2 border-blue-100 rounded-3xl p-3 flex-1 mr-2 ${hintUsed ? "opacity-50" : ""}`}
            >
              <Text className="text-grey-200 text-center text-xl font-righteous">Hint</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleElimination}
              disabled={eliminationUsed}
              className={`bg-black-100 border-2 border-blue-100 rounded-3xl p-3 flex-1 ml-2 ${eliminationUsed ? "opacity-50" : ""}`}
            >
              <Text className="text-grey-200 text-center text-xl font-righteous">50/50</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}
