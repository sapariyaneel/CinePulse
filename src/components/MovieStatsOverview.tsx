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
    <View className="bg-dark-200/80 rounded-2xl p-5 border border-dark-100">
      <View className="flex-row items-center mb-4">
        <View className="w-12 h-12 rounded-full bg-accent/20 items-center justify-center mr-3">
          <Image source={icons.play} className="size-6" tintColor="#AB8BFF" />
        </View>
        <Text className="text-white text-xl font-bold">Your Movie Stats</Text>
      </View>

      <View className="flex-row flex-wrap gap-3">
        {/* Total Movies Watched */}
        <View className="flex-1 min-w-[45%] bg-dark-100 rounded-xl p-4 border border-accent/30">
          <Text className="text-light-300 text-xs mb-1">Movies Watched</Text>
          <Text className="text-accent text-3xl font-bold">{totalMoviesWatched}</Text>
        </View>

        {/* Watchlist Count */}
        <View className="flex-1 min-w-[45%] bg-dark-100 rounded-xl p-4 border border-light-300/20">
          <Text className="text-light-300 text-xs mb-1">In Watchlist</Text>
          <Text className="text-white text-3xl font-bold">{totalMoviesInWatchlist}</Text>
        </View>

        {/* Total Reviews */}
        <View className="flex-1 min-w-[45%] bg-dark-100 rounded-xl p-4 border border-light-300/20">
          <Text className="text-light-300 text-xs mb-1">Total Reviews</Text>
          <Text className="text-white text-3xl font-bold">{totalReviews}</Text>
        </View>

        {/* Average Rating */}
        <View className="flex-1 min-w-[45%] bg-dark-100 rounded-xl p-4 border border-light-300/20">
          <Text className="text-light-300 text-xs mb-1">Avg Rating</Text>
          <View className="flex-row items-center">
            <Text className="text-white text-3xl font-bold mr-2">{averageRating}</Text>
            <Image source={icons.star} className="size-5" tintColor="#FFD700" />
          </View>
        </View>

        {/* Watch Time */}
        <View className="flex-1 min-w-[45%] bg-gradient-to-br from-accent/20 to-accent/10 rounded-xl p-4 border border-accent/30">
          <Text className="text-light-300 text-xs mb-1">Total Watch Time</Text>
          <Text className="text-accent text-2xl font-bold">{watchTimeFormatted}</Text>
        </View>

        {/* Reviews This Month */}
        <View className="flex-1 min-w-[45%] bg-dark-100 rounded-xl p-4 border border-light-300/20">
          <Text className="text-light-300 text-xs mb-1">This Month</Text>
          <Text className="text-white text-3xl font-bold">{reviewsThisMonth}</Text>
          <Text className="text-light-300 text-xs mt-1">reviews</Text>
        </View>
      </View>
    </View>
  );
};

export default MovieStatsOverview;
