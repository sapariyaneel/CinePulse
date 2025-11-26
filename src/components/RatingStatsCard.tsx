import React from 'react';
import { View, Text, Image } from 'react-native';
import { icons } from '@/constants/icons';

interface RatingStatsCardProps {
  totalReviews: number;
  averageRating: number;
  highestRating: number;
  lowestRating: number;
}

const RatingStatsCard: React.FC<RatingStatsCardProps> = ({
  totalReviews,
  averageRating,
  highestRating,
  lowestRating,
}) => {
  return (
    <View className="bg-dark-200/80 rounded-2xl p-5 border border-dark-100">
      <View className="flex-row items-center mb-4">
        <View className="w-12 h-12 rounded-full bg-accent/20 items-center justify-center mr-3">
          <Image source={icons.star} className="size-6" tintColor="#AB8BFF" />
        </View>
        <Text className="text-white text-xl font-bold">Your Rating Stats</Text>
      </View>

      <View className="flex-row flex-wrap gap-3">
        {/* Total Reviews */}
        <View className="flex-1 min-w-[45%] bg-dark-100 rounded-xl p-4 border border-light-300/20">
          <Text className="text-light-300 text-xs mb-1">Total Reviews</Text>
          <Text className="text-white text-2xl font-bold">{totalReviews}</Text>
        </View>

        {/* Average Rating */}
        <View className="flex-1 min-w-[45%] bg-dark-100 rounded-xl p-4 border border-accent/30">
          <Text className="text-light-300 text-xs mb-1">Average Rating</Text>
          <View className="flex-row items-center">
            <Text className="text-accent text-2xl font-bold">{averageRating}</Text>
            <Image source={icons.star} className="size-5 ml-1" tintColor="#AB8BFF" />
          </View>
        </View>

        {/* Highest Rating */}
        <View className="flex-1 min-w-[45%] bg-dark-100 rounded-xl p-4 border border-light-300/20">
          <Text className="text-light-300 text-xs mb-1">Highest Rating</Text>
          <View className="flex-row items-center">
            <Text className="text-white text-2xl font-bold">{highestRating}</Text>
            <Image source={icons.star} className="size-5 ml-1" tintColor="#95E1D3" />
          </View>
        </View>

        {/* Lowest Rating */}
        <View className="flex-1 min-w-[45%] bg-dark-100 rounded-xl p-4 border border-light-300/20">
          <Text className="text-light-300 text-xs mb-1">Lowest Rating</Text>
          <View className="flex-row items-center">
            <Text className="text-white text-2xl font-bold">{lowestRating}</Text>
            <Image source={icons.star} className="size-5 ml-1" tintColor="#FF6B6B" />
          </View>
        </View>
      </View>
    </View>
  );
};

export default RatingStatsCard;
