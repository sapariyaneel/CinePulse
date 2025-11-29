import React, { useEffect, useRef } from 'react';
import { View, Animated, useWindowDimensions } from 'react-native';

interface SearchScreenSkeletonProps {
  numColumns?: number;
}

const SearchScreenSkeleton: React.FC<SearchScreenSkeletonProps> = ({ numColumns = 3 }) => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [shimmerAnim]);

  const opacity = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  // Skeleton for search results grid
  const SearchResultsSkeleton = () => {
    const skeletonItems = Array(numColumns * 3).fill(0); // Show 3 rows

    return (
      <View className="w-full">
        {/* Search Results Header Skeleton */}
        <Animated.View 
          style={{ opacity }}
          className="h-6 sm:h-7 md:h-8 lg:h-9 w-48 sm:w-56 md:w-64 bg-light-100/10 rounded-lg mb-3 sm:mb-4 md:mb-5"
        />
        
        {/* Grid Skeleton */}
        <View className="flex-row flex-wrap gap-y-3 sm:gap-y-4 md:gap-y-5 lg:gap-y-6 gap-x-2 sm:gap-x-3 md:gap-x-4 lg:gap-x-5">
          {skeletonItems.map((_, index) => (
            <Animated.View
              key={index}
              style={{ opacity }}
              className="w-28 sm:w-32 md:w-36 lg:w-40 h-40 sm:h-44 md:h-48 lg:h-52 bg-light-100/10 rounded-xl"
            />
          ))}
        </View>
      </View>
    );
  };

  return <SearchResultsSkeleton />;
};

export default SearchScreenSkeleton;
