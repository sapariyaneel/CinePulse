import React from 'react';
import { View, Text, Image, useWindowDimensions } from 'react-native';
import { icons } from '@/constants/icons';

interface WatchlistBreakdownProps {
  categories: {
    categoryName: string;
    count: number;
    percentage: number;
  }[];
}

const WatchlistBreakdown: React.FC<WatchlistBreakdownProps> = ({ categories }) => {
  const { width } = useWindowDimensions();
  
  if (categories.length === 0) {
    return null;
  }

  const getCategoryColor = (categoryName: string) => {
    const colorMap: { [key: string]: string } = {
      'Want to Watch': '#AB8BFF',
      'Watching': '#4ECDC4',
      'Completed': '#95E1D3',
    };
    return colorMap[categoryName] || '#FFD93D';
  };

  return (
    <View className="bg-dark-200/80 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 border border-dark-100">
      <View className="flex-row items-center mb-3 sm:mb-4">
        <View className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-accent/20 items-center justify-center mr-2.5 sm:mr-3">
          <Image source={icons.save} className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" tintColor="#AB8BFF" />
        </View>
        <Text className="text-white text-lg sm:text-xl md:text-2xl font-bold">Watchlist Breakdown</Text>
      </View>

      <View className="gap-2.5 sm:gap-3 md:gap-3.5">
        {categories.map((category) => (
          <View key={category.categoryName}>
            {/* Category Header */}
            <View className="flex-row items-center justify-between mb-1.5 sm:mb-2">
              <View className="flex-row items-center flex-1">
                <View
                  className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5 rounded-full mr-2 sm:mr-2.5 md:mr-3"
                  style={{ backgroundColor: getCategoryColor(category.categoryName) }}
                />
                <Text className="text-white text-xs sm:text-sm md:text-base font-semibold">
                  {category.categoryName}
                </Text>
              </View>
              <View className="items-end">
                <Text className="text-white text-base sm:text-lg md:text-xl font-bold">
                  {category.count}
                </Text>
                <Text className="text-light-300 text-[10px] sm:text-xs md:text-sm">
                  {category.percentage}%
                </Text>
              </View>
            </View>

            {/* Progress Bar */}
            <View className="h-1.5 sm:h-2 bg-dark-100 rounded-full overflow-hidden">
              <View
                className="h-full rounded-full"
                style={{
                  width: `${category.percentage}%`,
                  backgroundColor: getCategoryColor(category.categoryName),
                }}
              />
            </View>
          </View>
        ))}
      </View>

      {/* Total */}
      <View className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-dark-100">
        <Text className="text-light-300 text-[10px] sm:text-xs md:text-sm text-center">
          Total: {categories.reduce((sum, c) => sum + c.count, 0)} movies in watchlist
        </Text>
      </View>
    </View>
  );
};

export default WatchlistBreakdown;
