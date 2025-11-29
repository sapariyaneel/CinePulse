import React, { useEffect, useRef } from 'react';
import { View, Animated, useWindowDimensions } from 'react-native';

interface SkeletonLoaderProps {
  numColumns?: number;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ numColumns = 3 }) => {
  const { width } = useWindowDimensions();
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

  // Skeleton for search bar
  const SearchBarSkeleton = () => (
    <Animated.View 
      style={{ opacity }}
      className="h-12 sm:h-14 md:h-16 bg-light-100/10 rounded-xl mb-6 sm:mb-8 md:mb-10"
    />
  );

  // Skeleton for trending section
  const TrendingSkeleton = () => (
    <View className="mt-6 sm:mt-8 md:mt-10">
      <Animated.View 
        style={{ opacity }}
        className="h-6 sm:h-7 md:h-8 lg:h-9 w-40 sm:w-48 md:w-56 bg-light-100/10 rounded-lg mb-2 sm:mb-3 md:mb-4"
      />
      <View className="flex-row gap-4 sm:gap-5 md:gap-6 lg:gap-8 mt-2 sm:mt-3 md:mt-4">
        {[1, 2, 3].map((item) => (
          <Animated.View
            key={item}
            style={{ opacity }}
            className="w-32 sm:w-40 md:w-48 lg:w-56 h-48 sm:h-56 md:h-64 lg:h-72 bg-light-100/10 rounded-2xl"
          />
        ))}
      </View>
    </View>
  );

  // Skeleton for recommendations section
  const RecommendationsSkeleton = () => (
    <View className="mt-6 sm:mt-8 md:mt-10">
      <Animated.View 
        style={{ opacity }}
        className="h-6 sm:h-7 md:h-8 lg:h-9 w-48 sm:w-56 md:w-64 bg-light-100/10 rounded-lg mb-2 sm:mb-3 md:mb-4"
      />
      <View className="flex-row gap-3 sm:gap-4 md:gap-5 mt-2 sm:mt-3 md:mt-4">
        {[1, 2, 3].map((item) => (
          <Animated.View
            key={item}
            style={{ opacity }}
            className="w-28 sm:w-32 md:w-36 h-40 sm:h-44 md:h-48 bg-light-100/10 rounded-xl"
          />
        ))}
      </View>
    </View>
  );

  // Skeleton for latest movies grid
  const LatestMoviesSkeleton = () => {
    const skeletonItems = Array(numColumns * 2).fill(0); // Show 2 rows

    return (
      <View className="items-center mt-4 sm:mt-5 md:mt-6">
        <Animated.View 
          style={{ opacity }}
          className="h-6 sm:h-7 md:h-8 lg:h-9 w-36 sm:w-40 md:w-48 bg-light-100/10 rounded-lg mb-2 sm:mb-3 md:mb-4 self-start"
        />
        <View className="w-full items-center">
          <View className="flex-row flex-wrap gap-y-3 sm:gap-y-4 md:gap-y-5 gap-x-2 sm:gap-x-3 md:gap-x-4 lg:gap-x-5 justify-center mt-2">
            {skeletonItems.map((_, index) => (
              <Animated.View
                key={index}
                style={{ opacity }}
                className="w-28 sm:w-32 md:w-36 lg:w-40 h-40 sm:h-44 md:h-48 lg:h-52 bg-light-100/10 rounded-xl"
              />
            ))}
          </View>
        </View>
      </View>
    );
  };

  return (
    <View className="flex-1 mt-3 sm:mt-4 md:mt-5">
      <SearchBarSkeleton />
      <TrendingSkeleton />
      <RecommendationsSkeleton />
      <LatestMoviesSkeleton />
    </View>
  );
};

export default SkeletonLoader;
