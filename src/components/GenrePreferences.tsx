import React from 'react';
import { View, Text, Image, ScrollView } from 'react-native';
import { icons } from '@/constants/icons';

interface GenrePreferencesProps {
  preferences: {
    genreId: number;
    genreName: string;
    count: number;
    averageRating: number;
  }[];
}

const GenrePreferences: React.FC<GenrePreferencesProps> = ({ preferences }) => {
  if (preferences.length === 0) {
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
        <Text className="text-white text-xl font-bold">Your Favorite Genres</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View className="flex-row gap-3">
          {preferences.slice(0, 5).map((genre, index) => (
            <View
              key={genre.genreId}
              className="bg-dark-100 rounded-xl p-4 border border-light-300/20 min-w-[140px]"
            >
              {/* Genre Name */}
              <View className="flex-row items-center mb-2">
                <View
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: getGenreColor(index) }}
                />
                <Text className="text-white text-sm font-bold flex-1" numberOfLines={1}>
                  {genre.genreName}
                </Text>
              </View>

              {/* Stats */}
              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="text-light-300 text-xs">Movies</Text>
                  <Text className="text-white text-lg font-bold">{genre.count}</Text>
                </View>

                {genre.averageRating > 0 && (
                  <View className="items-end">
                    <Text className="text-light-300 text-xs">Avg Rating</Text>
                    <View className="flex-row items-center">
                      <Text
                        className="text-lg font-bold mr-1"
                        style={{ color: getGenreColor(index) }}
                      >
                        {genre.averageRating.toFixed(1)}
                      </Text>
                      <Image
                        source={icons.star}
                        className="size-3"
                        tintColor={getGenreColor(index)}
                      />
                    </View>
                  </View>
                )}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Summary */}
      <View className="mt-4 pt-4 border-t border-dark-100">
        <Text className="text-light-300 text-xs text-center">
          Based on {preferences.reduce((sum, g) => sum + g.count, 0)} movies in your collection
        </Text>
      </View>
    </View>
  );
};

export default GenrePreferences;
