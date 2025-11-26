import React from 'react';
import { View, Text, Image } from 'react-native';
import { icons } from '@/constants/icons';

interface MovieRecordsProps {
  longestMovie: {
    title: string;
    runtime: number;
  } | null;
  shortestMovie: {
    title: string;
    runtime: number;
  } | null;
}

const MovieRecords: React.FC<MovieRecordsProps> = ({ longestMovie, shortestMovie }) => {
  if (!longestMovie && !shortestMovie) {
    return null;
  }

  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <View className="bg-dark-200/80 rounded-2xl p-5 border border-dark-100">
      <View className="flex-row items-center mb-4">
        <View className="w-12 h-12 rounded-full bg-accent/20 items-center justify-center mr-3">
          <Image source={icons.play} className="size-6" tintColor="#AB8BFF" />
        </View>
        <Text className="text-white text-xl font-bold">Movie Records</Text>
      </View>

      <View className="gap-4">
        {/* Longest Movie */}
        {longestMovie && (
          <View className="bg-dark-100 rounded-xl p-4 border border-light-300/20">
            <View className="flex-row items-center mb-2">
              <View className="w-8 h-8 rounded-full bg-accent/20 items-center justify-center mr-3">
                <Text className="text-accent text-lg">🏆</Text>
              </View>
              <Text className="text-light-300 text-xs uppercase tracking-wider">
                Longest Movie
              </Text>
            </View>
            <Text className="text-white text-base font-bold mb-1" numberOfLines={2}>
              {longestMovie.title}
            </Text>
            <Text className="text-accent text-sm font-semibold">
              {formatRuntime(longestMovie.runtime)}
            </Text>
          </View>
        )}

        {/* Shortest Movie */}
        {shortestMovie && (
          <View className="bg-dark-100 rounded-xl p-4 border border-light-300/20">
            <View className="flex-row items-center mb-2">
              <View className="w-8 h-8 rounded-full bg-accent/20 items-center justify-center mr-3">
                <Text className="text-accent text-lg">⚡</Text>
              </View>
              <Text className="text-light-300 text-xs uppercase tracking-wider">
                Shortest Movie
              </Text>
            </View>
            <Text className="text-white text-base font-bold mb-1" numberOfLines={2}>
              {shortestMovie.title}
            </Text>
            <Text className="text-accent text-sm font-semibold">
              {formatRuntime(shortestMovie.runtime)}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default MovieRecords;
