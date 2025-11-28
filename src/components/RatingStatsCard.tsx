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
    <View className="bg-dark-200/80 rounded-xl sm:rounded-2xl md:rounded-3xl p-4 sm:p-5 md:p-6 lg:p-8 border border-dark-100">
      <View className="flex-row items-center mb-3 sm:mb-4 md:mb-5">
        <View className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-accent/20 items-center justify-center mr-2 sm:mr-3 md:mr-4">
          <Image source={icons.star} className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" tintColor="#AB8BFF" />
        </View>
        <Text className="text-white text-lg sm:text-xl md:text-2xl font-bold">Your Rating Stats</Text>
      </View>

      <View className="flex-row flex-wrap gap-2 sm:gap-3 md:gap-4">
        {/* Total Reviews */}
        <View className="flex-1 min-w-[45%] bg-dark-100 rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-5 border border-light-300/20">
          <Text className="text-light-300 text-[10px] sm:text-xs md:text-sm mb-0.5 sm:mb-1">Total Reviews</Text>
          <Text className="text-white text-xl sm:text-2xl md:text-3xl font-bold">{totalReviews}</Text>
        </View>

        {/* Average Rating */}
        <View className="flex-1 min-w-[45%] bg-dark-100 rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-5 border border-accent/30">
          <Text className="text-light-300 text-[10px] sm:text-xs md:text-sm mb-0.5 sm:mb-1">Average Rating</Text>
          <View className="flex-row items-center">
            <Text className="text-accent text-xl sm:text-2xl md:text-3xl font-bold">{averageRating}</Text>
            <Image source={icons.star} className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 ml-1 sm:ml-1.5" tintColor="#AB8BFF" />
          </View>
        </View>

        {/* Highest Rating */}
        <View className="flex-1 min-w-[45%] bg-dark-100 rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-5 border border-light-300/20">
          <Text className="text-light-300 text-[10px] sm:text-xs md:text-sm mb-0.5 sm:mb-1">Highest Rating</Text>
          <View className="flex-row items-center">
            <Text className="text-white text-xl sm:text-2xl md:text-3xl font-bold">{highestRating}</Text>
            <Image source={icons.star} className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 ml-1 sm:ml-1.5" tintColor="#95E1D3" />
          </View>
        </View>

        {/* Lowest Rating */}
        <View className="flex-1 min-w-[45%] bg-dark-100 rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-5 border border-light-300/20">
          <Text className="text-light-300 text-[10px] sm:text-xs md:text-sm mb-0.5 sm:mb-1">Lowest Rating</Text>
          <View className="flex-row items-center">
            <Text className="text-white text-xl sm:text-2xl md:text-3xl font-bold">{lowestRating}</Text>
            <Image source={icons.star} className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 ml-1 sm:ml-1.5" tintColor="#FF6B6B" />
          </View>
        </View>
      </View>
    </View>
  );
};

export default RatingStatsCard;
