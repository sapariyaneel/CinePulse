import React from 'react';
import { View, Text, Image } from 'react-native';
import { icons } from '@/constants/icons';

interface RatingDistributionChartProps {
  distribution: {
    rating: number;
    count: number;
  }[];
}

const RatingDistributionChart: React.FC<RatingDistributionChartProps> = ({ distribution }) => {
  const maxCount = Math.max(...distribution.map(d => d.count), 1);

  return (
    <View className="bg-dark-200/80 rounded-xl sm:rounded-2xl md:rounded-3xl p-4 sm:p-5 md:p-6 lg:p-8 border border-dark-100">
      <View className="flex-row items-center mb-3 sm:mb-4 md:mb-5">
        <View className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-accent/20 items-center justify-center mr-2 sm:mr-3 md:mr-4">
          <Image source={icons.star} className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" tintColor="#AB8BFF" />
        </View>
        <Text className="text-white text-lg sm:text-xl md:text-2xl font-bold">Rating Distribution</Text>
      </View>

      <View className="gap-2 sm:gap-3 md:gap-4">
        {distribution.reverse().map(({ rating, count }) => {
          const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;
          
          return (
            <View key={rating} className="flex-row items-center">
              {/* Star Rating */}
              <View className="flex-row items-center w-12 sm:w-16 md:w-20">
                <Text className="text-white text-xs sm:text-sm md:text-base font-semibold mr-0.5 sm:mr-1">{rating}</Text>
                <Image source={icons.star} className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" tintColor="#AB8BFF" />
              </View>

              {/* Progress Bar */}
              <View className="flex-1 h-6 sm:h-8 md:h-10 bg-dark-100 rounded-md sm:rounded-lg md:rounded-xl overflow-hidden border border-light-300/20">
                <View 
                  className="h-full bg-accent/80 rounded-md sm:rounded-lg md:rounded-xl"
                  style={{ width: `${percentage}%` }}
                />
              </View>

              {/* Count */}
              <Text className="text-light-300 text-xs sm:text-sm md:text-base font-medium ml-2 sm:ml-3 md:ml-4 w-6 sm:w-8 md:w-10 text-right">
                {count}
              </Text>
            </View>
          );
        })}
      </View>

      {/* Legend */}
      <View className="mt-3 sm:mt-4 md:mt-5 pt-3 sm:pt-4 md:pt-5 border-t border-dark-100">
        <Text className="text-light-300 text-[10px] sm:text-xs md:text-sm text-center">
          Total ratings: {distribution.reduce((sum, d) => sum + d.count, 0)}
        </Text>
      </View>
    </View>
  );
};

export default RatingDistributionChart;
