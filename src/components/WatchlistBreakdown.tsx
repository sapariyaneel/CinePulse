import React from 'react';
import { View, Text, Image } from 'react-native';
import { icons } from '@/constants/icons';

interface WatchlistBreakdownProps {
  categories: {
    categoryName: string;
    count: number;
    percentage: number;
  }[];
}

const WatchlistBreakdown: React.FC<WatchlistBreakdownProps> = ({ categories }) => {
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
    <View className="bg-dark-200/80 rounded-2xl p-5 border border-dark-100">
      <View className="flex-row items-center mb-4">
        <View className="w-12 h-12 rounded-full bg-accent/20 items-center justify-center mr-3">
          <Image source={icons.save} className="size-6" tintColor="#AB8BFF" />
        </View>
        <Text className="text-white text-xl font-bold">Watchlist Breakdown</Text>
      </View>

      <View className="gap-3">
        {categories.map((category) => (
          <View key={category.categoryName}>
            {/* Category Header */}
            <View className="flex-row items-center justify-between mb-2">
              <View className="flex-row items-center flex-1">
                <View
                  className="w-3 h-3 rounded-full mr-3"
                  style={{ backgroundColor: getCategoryColor(category.categoryName) }}
                />
                <Text className="text-white text-sm font-semibold">
                  {category.categoryName}
                </Text>
              </View>
              <View className="items-end">
                <Text className="text-white text-lg font-bold">
                  {category.count}
                </Text>
                <Text className="text-light-300 text-xs">
                  {category.percentage}%
                </Text>
              </View>
            </View>

            {/* Progress Bar */}
            <View className="h-2 bg-dark-100 rounded-full overflow-hidden">
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
      <View className="mt-4 pt-4 border-t border-dark-100">
        <Text className="text-light-300 text-xs text-center">
          Total: {categories.reduce((sum, c) => sum + c.count, 0)} movies in watchlist
        </Text>
      </View>
    </View>
  );
};

export default WatchlistBreakdown;
