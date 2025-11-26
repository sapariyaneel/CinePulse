import React from 'react';
import { View, Text, Image } from 'react-native';
import { icons } from '@/constants/icons';

interface RecentRatingsProps {
  ratings: {
    movieTitle: string;
    rating: number;
    createdAt: string;
  }[];
}

const RecentRatings: React.FC<RecentRatingsProps> = ({ ratings }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return '#95E1D3';
    if (rating >= 3) return '#AB8BFF';
    return '#FF6B6B';
  };

  return (
    <View className="bg-dark-200/80 rounded-2xl p-5 border border-dark-100">
      <View className="flex-row items-center mb-4">
        <View className="w-12 h-12 rounded-full bg-accent/20 items-center justify-center mr-3">
          <Image source={icons.play} className="size-6" tintColor="#AB8BFF" />
        </View>
        <Text className="text-white text-xl font-bold">Recent Ratings</Text>
      </View>

      {ratings.length === 0 ? (
        <View className="py-8 items-center">
          <Text className="text-light-300 text-sm">No ratings yet</Text>
        </View>
      ) : (
        <View className="gap-3">
          {ratings.map((item, index) => (
            <View 
              key={index} 
              className="bg-dark-100 rounded-xl p-4 border border-light-300/20"
            >
              <View className="flex-row items-start justify-between">
                <View className="flex-1 mr-3">
                  <Text className="text-white text-sm font-semibold" numberOfLines={1}>
                    {item.movieTitle}
                  </Text>
                  <Text className="text-light-300 text-xs mt-1">
                    {formatDate(item.createdAt)}
                  </Text>
                </View>

                {/* Rating Badge */}
                <View 
                  className="px-3 py-1.5 rounded-lg flex-row items-center"
                  style={{ backgroundColor: getRatingColor(item.rating) + '20' }}
                >
                  <Text 
                    className="text-sm font-bold mr-1"
                    style={{ color: getRatingColor(item.rating) }}
                  >
                    {item.rating}
                  </Text>
                  <Image 
                    source={icons.star} 
                    className="size-3" 
                    tintColor={getRatingColor(item.rating)} 
                  />
                </View>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

export default RecentRatings;
