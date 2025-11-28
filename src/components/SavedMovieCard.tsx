import { icons } from '@/constants/icons'
import { useNavigation } from '@react-navigation/native';
import type { RootStackNavigationProp } from '@/navigation/types';
import React from 'react'
import { Image, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native'

interface SavedMovieCardProps extends SavedMovie {
  numColumns?: number;
}

const SavedMovieCard = ({ id, poster_path, title, vote_average, release_date, numColumns = 3 }: SavedMovieCardProps) => {
  const navigation = useNavigation<RootStackNavigationProp>();
  const { width } = useWindowDimensions();
  
  // Calculate card width based on screen size and number of columns
  const getCardWidth = () => {
    const horizontalPadding = width >= 900 ? 48 : width >= 600 ? 40 : width >= 400 ? 32 : 24;
    const gap = width >= 600 ? 12 : 8;
    const totalGaps = (numColumns - 1) * gap;
    return (width - horizontalPadding - totalGaps) / numColumns;
  };

  const cardWidth = getCardWidth();
  
  return (
    <TouchableOpacity 
      className="mb-3 sm:mb-4"
      style={{ width: cardWidth }}
      onPress={() => navigation.navigate('MovieDetails', { id: id.toString() })}
    >
      <Image 
        source={{
          uri: poster_path
            ? `https://image.tmdb.org/t/p/w500${poster_path}`
            : 'https://placehold.co/600x400/1a1a1a/ffffff.png'
        }}
        className="w-full rounded-lg sm:rounded-xl"
        style={{ height: cardWidth * 1.5 }}
        resizeMode="cover"
      />
      <Text className='text-xs sm:text-sm md:text-base font-bold text-white mt-1.5 sm:mt-2' numberOfLines={1}>{title}</Text>
      <View className="flex-row items-center justify-start gap-x-1">
        <Image source={icons.star} className="w-3 h-3 sm:w-4 sm:h-4" />
        <Text className="text-[10px] sm:text-xs md:text-sm text-white font-bold uppercase">{Math.round(vote_average / 2)}</Text>
      </View>
      <View className="flex-row items-center justify-between">
        <Text className="text-[10px] sm:text-xs md:text-sm text-light-300 font-medium mt-0.5 sm:mt-1">{release_date?.split('-')[0]}</Text>
      </View>
    </TouchableOpacity>
  )
}

export default SavedMovieCard
