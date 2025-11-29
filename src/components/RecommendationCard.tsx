import React, { useMemo } from 'react';
import { View, Text, Image, TouchableOpacity, useWindowDimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { RootStackNavigationProp } from '@/navigation/types';
import { icons } from '@/constants/icons';
import OptimizedImage from './OptimizedImage';

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
  const { width } = useWindowDimensions();

  // Calculate responsive dimensions
  const cardDimensions = useMemo(() => {
    if (width < 360) {
      return { width: 120, height: 180 }; // Small phones
    } else if (width < 600) {
      return { width: 144, height: 208 }; // Standard phones
    } else if (width < 900) {
      return { width: 180, height: 260 }; // Large phones/small tablets
    } else {
      return { width: 220, height: 320 }; // Tablets and larger
    }
  }, [width]);

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('MovieDetails', { id: movie.id.toString() })}
      style={{ width: cardDimensions.width }}
      className="mr-3 sm:mr-4 md:mr-5"
    >
      {/* Movie Poster */}
      <View className="relative">
        <OptimizedImage
          uri={movie.poster_path
            ? `https://image.tmdb.org/t/p/w342${movie.poster_path}`
            : 'https://via.placeholder.com/342x513?text=No+Image'}
          style={{ width: cardDimensions.width, height: cardDimensions.height }}
          className="rounded-xl sm:rounded-2xl md:rounded-3xl"
          resizeMode="cover"
        />

        {/* Rating Badge */}
        <View className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 md:top-3 md:right-3 bg-black/80 rounded-md sm:rounded-lg px-1.5 py-0.5 sm:px-2 sm:py-1 md:px-2.5 md:py-1.5 flex-row items-center">
          <Image 
            source={icons.star} 
            className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5 mr-0.5 sm:mr-1" 
            tintColor="#FFD700" 
          />
          <Text className="text-white text-[10px] sm:text-xs md:text-sm font-semibold">
            {movie.vote_average.toFixed(1)}
          </Text>
        </View>

        {/* Recommendation Reason Badge */}
        <View className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-1.5 sm:p-2 md:p-3 rounded-b-xl sm:rounded-b-2xl md:rounded-b-3xl">
          <Text className="text-accent text-[10px] sm:text-xs md:text-sm font-medium" numberOfLines={2}>
            {movie.reason}
          </Text>
        </View>
      </View>

      {/* Movie Title */}
      <Text 
        className="text-white text-xs sm:text-sm md:text-base lg:text-lg font-semibold mt-1.5 sm:mt-2 md:mt-3" 
        numberOfLines={2}
        style={{ width: cardDimensions.width }}
      >
        {movie.title}
      </Text>
    </TouchableOpacity>
  );
};

export default RecommendationCard;

