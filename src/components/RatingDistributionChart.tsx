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
    <View className="bg-dark-200/80 rounded-2xl p-5 border border-dark-100">
      <View className="flex-row items-center mb-4">
        <View className="w-12 h-12 rounded-full bg-accent/20 items-center justify-center mr-3">
          <Image source={icons.star} className="size-6" tintColor="#AB8BFF" />
        </View>
        <Text className="text-white text-xl font-bold">Rating Distribution</Text>
      </View>

      <View className="gap-3">
        {distribution.reverse().map(({ rating, count }) => {
          const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;
          
          return (
            <View key={rating} className="flex-row items-center">
              {/* Star Rating */}
              <View className="flex-row items-center w-16">
                <Text className="text-white text-sm font-semibold mr-1">{rating}</Text>
                <Image source={icons.star} className="size-4" tintColor="#AB8BFF" />
              </View>

              {/* Progress Bar */}
              <View className="flex-1 h-8 bg-dark-100 rounded-lg overflow-hidden border border-light-300/20">
                <View 
                  className="h-full bg-accent/80 rounded-lg"
                  style={{ width: `${percentage}%` }}
                />
              </View>

              {/* Count */}
              <Text className="text-light-300 text-sm font-medium ml-3 w-8 text-right">
                {count}
              </Text>
            </View>
          );
        })}
      </View>

      {/* Legend */}
      <View className="mt-4 pt-4 border-t border-dark-100">
        <Text className="text-light-300 text-xs text-center">
          Total ratings: {distribution.reduce((sum, d) => sum + d.count, 0)}
        </Text>
      </View>
    </View>
  );
};

export default RatingDistributionChart;
