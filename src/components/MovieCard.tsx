import { icons } from '@/constants/icons';
import { useNavigation } from '@react-navigation/native';
import type { RootStackNavigationProp } from '@/navigation/types';
import React, { useMemo } from 'react';
import { Image, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import OptimizedImage from './OptimizedImage';

interface MovieCardProps {
  movie: Movie;
  numColumns?: number;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, numColumns = 3 }) => {
  const navigation = useNavigation<RootStackNavigationProp>();
  const { width } = useWindowDimensions();
  
  // Safety check for undefined movie
  if (!movie) {
    return null;
  }

  // Calculate dynamic width based on screen size and number of columns
  const cardWidth = useMemo(() => {
    // Account for padding and gaps
    const horizontalPadding = width < 360 ? 24 : width < 600 ? 32 : width < 900 ? 48 : 64;
    const gapSize = width < 360 ? 8 : width < 600 ? 12 : width < 900 ? 16 : 20;
    const totalGaps = (numColumns - 1) * gapSize;
    const availableWidth = width - horizontalPadding - totalGaps;
    return availableWidth / numColumns;
  }, [width, numColumns]);

  // Calculate responsive height based on width (maintain aspect ratio)
  const cardHeight = useMemo(() => {
    return cardWidth * 1.5; // 2:3 aspect ratio for movie posters
  }, [cardWidth]);
  
  return (
    <TouchableOpacity 
      onPress={() => navigation.navigate('MovieDetails', { id: movie.id.toString() })} 
      style={{ width: cardWidth }}
      className="mb-2 sm:mb-3 md:mb-4"
    >
      <OptimizedImage 
        uri={movie.poster_path
          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
          : 'https://placehold.co/600x400/1a1a1a/ffffff.png'}
        style={{ width: cardWidth, height: cardHeight }}
        className="rounded-lg sm:rounded-xl"
        resizeMode="cover"
      />
      <Text 
        className='text-xs sm:text-sm md:text-base font-bold text-white mt-1 sm:mt-1.5 md:mt-2' 
        numberOfLines={1}
      >
        {movie.title}
      </Text>
      <View className="flex-row items-center justify-start gap-x-0.5 sm:gap-x-1">
        <Image 
          source={icons.star} 
          className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" 
        />
        <Text className="text-[10px] sm:text-xs md:text-sm text-white font-bold uppercase">
          {Math.round(movie.vote_average / 2)}
        </Text>
      </View>
      <View className="flex-row items-center justify-between">
        <Text className="text-[10px] sm:text-xs md:text-sm text-light-300 font-medium mt-0.5 sm:mt-1">
          {movie.release_date?.split('-')[0]}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default MovieCard;
