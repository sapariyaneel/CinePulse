import React from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { RootStackNavigationProp } from '@/navigation/types';
import { icons } from '@/constants/icons';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 60) / 3;

interface WatchlistCardProps {
  item: WatchlistItem;
  onLongPress?: () => void;
}

const WatchlistCard: React.FC<WatchlistCardProps> = ({ item, onLongPress }) => {
  const navigation = useNavigation<RootStackNavigationProp>();

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
      onPress={() => router.push(`/movies/${item.movieId}`)}
      onLongPress={onLongPress}
      activeOpacity={0.8}
      className="mb-4"
      style={{ width: CARD_WIDTH }}
    >
      <View className="relative">
        {/* Movie Poster */}
        <Image
          source={{ 
            uri: item.posterPath 
              ? `https://image.tmdb.org/t/p/w500${item.posterPath}` 
              : 'https://via.placeholder.com/500x750?text=No+Image' 
          }}
          className="w-full rounded-xl border border-light-300/20"
          style={{ height: CARD_WIDTH * 1.5 }}
          resizeMode="cover"
        />
        
        {/* Status Badge */}
        <View 
          className="absolute top-2 right-2 rounded-full p-1.5"
          style={{ backgroundColor: getStatusColor() }}
        >
          <Image 
            source={getStatusIcon()} 
            className="size-3" 
            tintColor="#0F1419" 
          />
        </View>

        {/* Progress Bar (if watching) */}
        {item.watchStatus === 'watching' && item.watchProgress > 0 && (
          <View className="absolute bottom-0 left-0 right-0 h-1 bg-dark-100/80 rounded-b-xl overflow-hidden">
            <View 
              className="h-full bg-accent"
              style={{ width: `${item.watchProgress}%` }}
            />
          </View>
        )}

        {/* Category Badge */}
        {item.category && (
          <View 
            className="absolute bottom-2 left-2 px-2 py-1 rounded-full"
            style={{ backgroundColor: item.category.color + '40' }}
          >
            <Text 
              className="text-xs font-semibold"
              style={{ color: item.category.color }}
            >
              {item.category.name}
            </Text>
          </View>
        )}
      </View>

      {/* Movie Info */}
      <View className="mt-2">
        <Text className="text-white text-xs font-semibold" numberOfLines={2}>
          {item.title}
        </Text>
        <View className="flex-row items-center mt-1">
          <Image source={icons.star} className="size-3 mr-1" tintColor="#FFD700" />
          <Text className="text-light-300 text-xs">
            {item.voteAverage.toFixed(1)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default WatchlistCard;

