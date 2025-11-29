import React, { useEffect, useRef } from 'react';
import { View, Animated, useWindowDimensions } from 'react-native';

interface WatchlistSkeletonProps {
  numColumns?: number;
}

const WatchlistSkeleton: React.FC<WatchlistSkeletonProps> = ({ numColumns = 3 }) => {
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

  // Skeleton for watchlist grid
  const WatchlistGridSkeleton = () => {
    const skeletonItems = Array(numColumns * 3).fill(0); // Show 3 rows

    return (
      <View className="flex-1 px-3 sm:px-4 md:px-5 lg:px-6">
        {/* Grid Skeleton */}
        <View className="flex-row flex-wrap gap-y-3 sm:gap-y-4 md:gap-y-5 gap-x-2 sm:gap-x-3 md:gap-x-4 lg:gap-x-5">
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

  return <WatchlistGridSkeleton />;
};

export default WatchlistSkeleton;
