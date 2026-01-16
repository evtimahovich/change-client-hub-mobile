import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { useApp } from '../../contexts/AppContext';
import CandidateDetailView from '../../components/CandidateDetailView';

export default function CandidateDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { candidates } = useApp();

  const candidate = candidates.find(c => c.id === id);

  if (!candidate) {
    return (
      <View className="flex-1 bg-white items-center justify-center p-6">
        <Text className="text-lg text-gray-500">Кандидат не найден</Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="mt-4 bg-black px-6 py-3 rounded-lg"
        >
          <Text className="text-white font-medium">Назад</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white border-b border-gray-200 pt-12 pb-4 px-4">
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => router.back()}
            className="mr-3 p-2"
          >
            <ArrowLeft size={24} color="#000" />
          </TouchableOpacity>
          <View className="flex-1">
            <Text className="text-xl font-semibold">{candidate.name}</Text>
            <Text className="text-sm text-gray-500">{candidate.position}</Text>
          </View>
        </View>
      </View>

      {/* Content */}
      <ScrollView className="flex-1">
        <CandidateDetailView candidate={candidate} />
      </ScrollView>
    </View>
  );
}
