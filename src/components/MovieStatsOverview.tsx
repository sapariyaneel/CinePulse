import React from 'react';
import { View, Text, Image } from 'react-native';
import { icons } from '@/constants/icons';

interface MovieStatsOverviewProps {
  totalMoviesWatched: number;
  totalMoviesInWatchlist: number;
  totalReviews: number;
  averageRating: number;
  watchTimeFormatted: string;
  reviewsThisMonth: number;
}

const MovieStatsOverview: React.FC<MovieStatsOverviewProps> = ({
  totalMoviesWatched,
  totalMoviesInWatchlist,
  totalReviews,
  averageRating,
  watchTimeFormatted,
  reviewsThisMonth,
}) => {
  return (
    <View className="bg-dark-200/80 rounded-xl sm:rounded-2xl md:rounded-3xl p-4 sm:p-5 md:p-6 lg:p-8 border border-dark-100">
      <View className="flex-row items-center mb-3 sm:mb-4 md:mb-5">
        <View className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-accent/20 items-center justify-center mr-2 sm:mr-3 md:mr-4">
          <Image source={icons.play} className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" tintColor="#AB8BFF" />
        </View>
        <Text className="text-white text-lg sm:text-xl md:text-2xl font-bold">Your Movie Stats</Text>
      </View>

      <View className="flex-row flex-wrap gap-2 sm:gap-3 md:gap-4">
        {/* Total Movies Watched */}
        <View className="flex-1 min-w-[45%] bg-dark-100 rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-5 border border-accent/30">
          <Text className="text-light-300 text-[10px] sm:text-xs md:text-sm mb-0.5 sm:mb-1">Movies Watched</Text>
          <Text className="text-accent text-2xl sm:text-3xl md:text-4xl font-bold">{totalMoviesWatched}</Text>
        </View>

        {/* Watchlist Count */}
        <View className="flex-1 min-w-[45%] bg-dark-100 rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-5 border border-light-300/20">
          <Text className="text-light-300 text-[10px] sm:text-xs md:text-sm mb-0.5 sm:mb-1">In Watchlist</Text>
          <Text className="text-white text-2xl sm:text-3xl md:text-4xl font-bold">{totalMoviesInWatchlist}</Text>
        </View>

        {/* Total Reviews */}
        <View className="flex-1 min-w-[45%] bg-dark-100 rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-5 border border-light-300/20">
          <Text className="text-light-300 text-[10px] sm:text-xs md:text-sm mb-0.5 sm:mb-1">Total Reviews</Text>
          <Text className="text-white text-2xl sm:text-3xl md:text-4xl font-bold">{totalReviews}</Text>
        </View>

        {/* Average Rating */}
        <View className="flex-1 min-w-[45%] bg-dark-100 rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-5 border border-light-300/20">
          <Text className="text-light-300 text-[10px] sm:text-xs md:text-sm mb-0.5 sm:mb-1">Avg Rating</Text>
          <View className="flex-row items-center">
            <Text className="text-white text-2xl sm:text-3xl md:text-4xl font-bold mr-1.5 sm:mr-2">{averageRating}</Text>
            <Image source={icons.star} className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" tintColor="#FFD700" />
          </View>
        </View>

        {/* Watch Time */}
        <View className="flex-1 min-w-[45%] bg-gradient-to-br from-accent/20 to-accent/10 rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-5 border border-accent/30">
          <Text className="text-light-300 text-[10px] sm:text-xs md:text-sm mb-0.5 sm:mb-1">Total Watch Time</Text>
          <Text className="text-accent text-xl sm:text-2xl md:text-3xl font-bold">{watchTimeFormatted}</Text>
        </View>

        {/* Reviews This Month */}
        <View className="flex-1 min-w-[45%] bg-dark-100 rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-5 border border-light-300/20">
          <Text className="text-light-300 text-[10px] sm:text-xs md:text-sm mb-0.5 sm:mb-1">This Month</Text>
          <Text className="text-white text-2xl sm:text-3xl md:text-4xl font-bold">{reviewsThisMonth}</Text>
          <Text className="text-light-300 text-[10px] sm:text-xs md:text-sm mt-0.5 sm:mt-1">reviews</Text>
        </View>
      </View>
    </View>
  );
};

export default MovieStatsOverview;
