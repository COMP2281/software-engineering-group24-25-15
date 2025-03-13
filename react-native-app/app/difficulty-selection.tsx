import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ImageBackground } from 'react-native';
import { router, useLocalSearchParams, Redirect } from 'expo-router';
import { useAuth } from "@/lib/auth/authContext";
import images from '@/constants/images';

export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export default function DifficultySelection() {
  const { isAuthenticated } = useAuth();
  const params = useLocalSearchParams<{ topics: string }>();
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null);
  
  // If not logged in, redirect to sign-in
  if (!isAuthenticated) {
    return <Redirect href="/(auth)/sign-in" />;
  }
  
  const topics = params.topics ? JSON.parse(params.topics as string) : [];
  
  const handleSelectDifficulty = (difficulty: Difficulty) => {
    setSelectedDifficulty(difficulty);
  };
  
  const handleStartGame = () => {
    if (selectedDifficulty) {
      router.push({
        pathname: '/game',
        params: { 
          topics: params.topics,
          difficulty: selectedDifficulty 
        }
      });
    }
  };

  return (
    <ImageBackground source={images.subBackground} className="w-full h-full" resizeMode="cover">
      <View className="flex-1 p-6">
        <View className="flex-1 justify-center">
          <Text className="text-white text-3xl font-righteous text-center mb-8">
            Select Difficulty
          </Text>
          
          <Text className="text-white text-lg font-righteous text-center mb-6">
            You selected: {topics.join(', ')}
          </Text>
          
          <View className="space-y-4 mb-8">
            {(['Easy', 'Medium', 'Hard'] as Difficulty[]).map((difficulty) => (
              <TouchableOpacity
                key={difficulty}
                onPress={() => handleSelectDifficulty(difficulty)}
                className={`bg-black-100 border-2 rounded-3xl p-4 ${
                  selectedDifficulty === difficulty ? 'border-blue-300' : 'border-blue-100'
                }`}
              >
                <Text className="text-grey-200 text-center text-xl font-righteous">
                  {difficulty}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <TouchableOpacity
            onPress={handleStartGame}
            disabled={!selectedDifficulty}
            className={`bg-black-100 border-2 border-blue-100 rounded-3xl p-4 ${
              !selectedDifficulty ? 'opacity-50' : ''
            }`}
          >
            <Text className="text-grey-200 text-center text-xl font-righteous">
              Start Game
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() => router.back()}
            className="mt-4"
          >
            <Text className="text-white text-center text-lg font-righteous">
              Back
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}
