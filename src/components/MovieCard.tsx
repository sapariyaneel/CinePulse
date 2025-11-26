import { icons } from '@/constants/icons';
import { useNavigation } from '@react-navigation/native';
import type { RootStackNavigationProp } from '@/navigation/types';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

const MovieCard: React.FC<{ movie: Movie }> = ({ movie }) => {
  const navigation = useNavigation<RootStackNavigationProp>();
  
  // Safety check for undefined movie
  if (!movie) {
    return null;
  }
  
  return (
    <TouchableOpacity 
      onPress={() => navigation.navigate('MovieDetails', { id: movie.id.toString() })} 
      className="w-[30%]"
    >
      <Image 
        source={{
          uri: movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : 'https://placehold.co/600x400/1a1a1a/ffffff.png'
        }}
        className="w-full h-52 rounded-lg"
        resizeMode="cover"
      />
      <Text className='text-sm font-bold text-white mt-2' numberOfLines={1}>
        {movie.title}
      </Text>
      <View className="flex-row items-center justify-start gap-x-1">
        <Image source={icons.star} className="size-4" />
        <Text className="text-xs text-white font-bold uppercase">
          {Math.round(movie.vote_average / 2)}
        </Text>
      </View>
      <View className="flex-row items-center justify-between">
        <Text className="text-xs text-light-300 font-medium mt-1">
          {movie.release_date?.split('-')[0]}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default MovieCard;
