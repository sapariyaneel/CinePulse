import React from 'react';
import { View, Text, Image, TouchableOpacity, useWindowDimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { RootStackNavigationProp } from '@/navigation/types';
import { icons } from '@/constants/icons';
import OptimizedImage from './OptimizedImage';

interface WatchlistCardProps {
  item: WatchlistItem;
  onLongPress?: () => void;
  numColumns?: number;
}

const WatchlistCard: React.FC<WatchlistCardProps> = ({ item, onLongPress, numColumns = 3 }) => {
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

  const getStatusColor = () => {
    switch (item.watchStatus) {
      case 'watching':
        return '#4ECDC4';
      case 'completed':
        return '#95E1D3';
      default:
        return '#AB8BFF';
    }
  };

  const getStatusIcon = () => {
    switch (item.watchStatus) {
      case 'watching':
        return icons.play;
      case 'completed':
        return icons.star;
      default:
        return icons.save;
    }
  };

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('MovieDetails', { id: item.movieId.toString() })}
      onLongPress={onLongPress}
      activeOpacity={0.8}
      className="mb-3 sm:mb-4"
      style={{ width: cardWidth }}
    >
      <View className="relative">
        {/* Movie Poster */}
        <OptimizedImage
          uri={item.posterPath 
            ? `https://image.tmdb.org/t/p/w500${item.posterPath}` 
            : 'https://via.placeholder.com/500x750?text=No+Image'}
          className="w-full rounded-lg sm:rounded-xl border border-light-300/20"
          style={{ height: cardWidth * 1.5 }}
          resizeMode="cover"
        />
        
        {/* Status Badge */}
        <View 
          className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 rounded-full p-1 sm:p-1.5"
          style={{ backgroundColor: getStatusColor() }}
        >
          <Image 
            source={getStatusIcon()} 
            className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5" 
            tintColor="#0F1419" 
          />
        </View>

        {/* Progress Bar (if watching) */}
        {item.watchStatus === 'watching' && item.watchProgress > 0 && (
          <View className="absolute bottom-0 left-0 right-0 h-1 bg-dark-100/80 rounded-b-lg sm:rounded-b-xl overflow-hidden">
            <View 
              className="h-full bg-accent"
              style={{ width: `${item.watchProgress}%` }}
            />
          </View>
        )}

        {/* Category Badge */}
        {item.category && (
          <View 
            className="absolute bottom-1.5 left-1.5 sm:bottom-2 sm:left-2 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full"
            style={{ backgroundColor: item.category.color + '40' }}
          >
            <Text 
              className="text-[9px] sm:text-xs md:text-sm font-semibold"
              style={{ color: item.category.color }}
            >
              {item.category.name}
            </Text>
          </View>
        )}
      </View>

      {/* Movie Info */}
      <View className="mt-1.5 sm:mt-2">
        <Text className="text-white text-[10px] sm:text-xs md:text-sm font-semibold" numberOfLines={2}>
          {item.title}
        </Text>
        <View className="flex-row items-center mt-0.5 sm:mt-1">
          <Image source={icons.star} className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-0.5 sm:mr-1" tintColor="#FFD700" />
          <Text className="text-light-300 text-[9px] sm:text-xs md:text-sm">
            {item.voteAverage.toFixed(1)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default WatchlistCard;
