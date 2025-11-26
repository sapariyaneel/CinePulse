import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { RootStackNavigationProp } from '@/navigation/types';
import { icons } from '@/constants/icons';

interface RecommendationCardProps {
  movie: {
    id: number;
    title: string;
    poster_path: string; 
    vote_average: number;
    reason: string;
  };
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({ movie }) => {
  const navigation = useNavigation<RootStackNavigationProp>();

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('MovieDetails', { id: movie.id.toString() })}
      className="w-36 mr-4"
    >
      {/* Movie Poster */}
      <View className="relative">
        <Image
          source={{
            uri: movie.poster_path
              ? `https://image.tmdb.org/t/p/w342${movie.poster_path}`
              : 'https://via.placeholder.com/342x513?text=No+Image',
          }}
          className="w-full h-52 rounded-2xl"
          resizeMode="cover"
        />

        {/* Rating Badge */}
        <View className="absolute top-2 right-2 bg-black/80 rounded-lg px-2 py-1 flex-row items-center">
          <Image source={icons.star} className="size-3 mr-1" tintColor="#FFD700" />
          <Text className="text-white text-xs font-semibold">
            {movie.vote_average.toFixed(1)}
          </Text>
        </View>

        {/* Recommendation Reason Badge */}
        <View className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-2 rounded-b-2xl">
          <Text className="text-accent text-xs font-medium" numberOfLines={2}>
            {movie.reason}
          </Text>
        </View>
      </View>

      {/* Movie Title */}
      <Text className="text-white text-sm font-semibold mt-2" numberOfLines={2}>
        {movie.title}
      </Text>
    </TouchableOpacity>
  );
};

export default RecommendationCard;

