import React from 'react';
import { View, Text, Image } from 'react-native';
import { icons } from '@/constants/icons';

interface GenreBreakdownProps {
  genres: {
    name: string;
    count: number;
    percentage: number;
  }[];
}

const GenreBreakdown: React.FC<GenreBreakdownProps> = ({ genres }) => {
  if (genres.length === 0) {
    return null;
  }

  const getGenreColor = (index: number) => {
    const colors = ['#AB8BFF', '#4ECDC4', '#95E1D3', '#FFD93D', '#FF6B6B'];
    return colors[index % colors.length];
  };

  return (
    <View className="bg-dark-200/80 rounded-2xl p-5 border border-dark-100">
      <View className="flex-row items-center mb-4">
        <View className="w-12 h-12 rounded-full bg-accent/20 items-center justify-center mr-3">
          <Image source={icons.star} className="size-6" tintColor="#AB8BFF" />
        </View>
        <Text className="text-white text-xl font-bold">Genre Breakdown</Text>
      </View>

      <View className="gap-3">
        {genres.map((genre, index) => (
          <View key={genre.name} className="flex-row items-center">
            {/* Genre Name */}
            <View className="flex-row items-center flex-1">
              <View
                className="w-3 h-3 rounded-full mr-3"
                style={{ backgroundColor: getGenreColor(index) }}
              />
              <Text className="text-white text-sm font-semibold flex-1">
                {genre.name}
              </Text>
            </View>

            {/* Progress Bar */}
            <View className="flex-1 h-6 bg-dark-100 rounded-lg overflow-hidden border border-light-300/20 mx-3">
              <View
                className="h-full rounded-lg"
                style={{
                  width: `${genre.percentage}%`,
                  backgroundColor: getGenreColor(index),
                }}
              />
            </View>

            {/* Count and Percentage */}
            <View className="w-16 items-end">
              <Text className="text-white text-sm font-bold">
                {genre.count}
              </Text>
              <Text className="text-light-300 text-xs">
                {genre.percentage}%
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* Total */}
      <View className="mt-4 pt-4 border-t border-dark-100">
        <Text className="text-light-300 text-xs text-center">
          Based on {genres.reduce((sum, g) => sum + g.count, 0)} genre tags
        </Text>
      </View>
    </View>
  );
};

export default GenreBreakdown;
