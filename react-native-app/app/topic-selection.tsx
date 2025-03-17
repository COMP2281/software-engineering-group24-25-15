import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ImageBackground } from 'react-native';
import { router, Redirect } from 'expo-router';
import images from '@/constants/images';
import { useAuth } from "@/lib/auth/authContext";

const AVAILABLE_TOPICS = [
  'Cyber Security',
  'AI',
  'Data',
  'Cloud Computing'
];

export default function TopicSelection() {
  const { isAuthenticated } = useAuth();
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  
  // If not logged in, redirect to sign-in
  if (!isAuthenticated) {
    return <Redirect href="/(auth)/sign-in" />;
  }
  
  const toggleTopic = (topic: string) => {
    if (selectedTopics.includes(topic)) {
      setSelectedTopics(selectedTopics.filter((t) => t !== topic));
    } else {
      // Only allow selecting up to 3 topics
      if (selectedTopics.length < 3) {
        setSelectedTopics([...selectedTopics, topic]);
      }
    }
  };
  
  const handleNext = () => {
    if (selectedTopics.length > 0) {
      // Navigate to difficulty selection with selected topics
      router.push({
        pathname: '/difficulty-selection',
        params: { topics: JSON.stringify(selectedTopics) }
      });
    }
  };

  return (
    <ImageBackground source={images.subBackground} className="w-full h-full" resizeMode="cover">
      <View className="flex-1 p-6">
        <View className="flex-1 justify-center">
          <Text className="text-white text-3xl font-righteous text-center mb-8">
            Select Topics
          </Text>
          <Text className="text-white text-lg font-righteous text-center mb-6">
            Choose up to 3 topics for your game
          </Text>
          
          <View className="space-y-4 mb-8">
            {AVAILABLE_TOPICS.map((topic) => (
              <TouchableOpacity
                key={topic}
                onPress={() => toggleTopic(topic)}
                className={`bg-black-100 border-2 rounded-3xl p-4 ${
                  selectedTopics.includes(topic) ? 'border-blue-300' : 'border-blue-100'
                }`}
              >
                <Text className="text-grey-200 text-center text-xl font-righteous">
                  {topic}
                  {selectedTopics.includes(topic) && ' ✓'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <TouchableOpacity
            onPress={handleNext}
            disabled={selectedTopics.length === 0}
            className={`bg-black-100 border-2 border-blue-100 rounded-3xl p-4 ${
              selectedTopics.length === 0 ? 'opacity-50' : ''
            }`}
          >
            <Text className="text-grey-200 text-center text-xl font-righteous">
              Next
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
