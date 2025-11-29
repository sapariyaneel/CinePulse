import React, { useEffect, useRef } from 'react';
import { View, Animated, ScrollView, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const MovieDetailsSkeleton = () => {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
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

  return (
    <View className='bg-primary flex-1'>
      <ScrollView contentContainerStyle={{
        paddingBottom: isLandscape ? 80 : 100
      }}>
        {/* Backdrop Skeleton */}
        <Animated.View 
          style={{ opacity }}
          className={`w-full ${isLandscape ? 'h-40 sm:h-48 md:h-56' : 'h-48 sm:h-56 md:h-64 lg:h-72'} bg-light-100/10`}
        />

        {/* Movie Info Section */}
        <View className='px-4 sm:px-5 md:px-6 lg:px-8 pt-4 sm:pt-5 md:pt-6'>
          {/* Poster and Title Row */}
          <View className='flex-row gap-3 sm:gap-4 md:gap-5 mb-4 sm:mb-5 md:mb-6'>
            {/* Poster Skeleton */}
            <Animated.View 
              style={{ opacity }}
              className={`${isLandscape ? 'w-28 h-40 sm:w-32 sm:h-44 md:w-36 md:h-48' : 'w-32 h-48 sm:w-36 sm:h-52 md:w-40 md:h-56 lg:w-44 lg:h-60'} rounded-lg sm:rounded-xl bg-light-100/10`}
            />
            
            {/* Title and Meta Skeleton */}
            <View className='flex-1 justify-start'>
              <Animated.View 
                style={{ opacity }}
                className='h-7 sm:h-8 md:h-9 w-full bg-light-100/10 rounded-lg mb-2 sm:mb-3'
              />
              <Animated.View 
                style={{ opacity }}
                className='h-6 sm:h-7 md:h-8 w-3/4 bg-light-100/10 rounded-lg mb-2 sm:mb-3'
              />
              <Animated.View 
                style={{ opacity }}
                className='h-5 sm:h-6 md:h-7 w-24 sm:w-28 md:w-32 bg-light-100/10 rounded-lg mb-2 sm:mb-3'
              />
              <Animated.View 
                style={{ opacity }}
                className='h-8 sm:h-9 md:h-10 w-32 sm:w-36 md:w-40 bg-light-100/10 rounded-lg mb-2 sm:mb-3'
              />
              {/* Genres Skeleton */}
              <View className='flex-row flex-wrap gap-1.5 sm:gap-2 md:gap-2.5'>
                {[1, 2, 3].map((item) => (
                  <Animated.View 
                    key={item}
                    style={{ opacity }}
                    className='h-6 sm:h-7 md:h-8 w-16 sm:w-20 md:w-24 bg-light-100/10 rounded-full'
                  />
                ))}
              </View>
            </View>
          </View>

          {/* Overview Skeleton */}
          <View className='mb-4 sm:mb-5 md:mb-6'>
            <Animated.View 
              style={{ opacity }}
              className='h-6 sm:h-7 md:h-8 w-24 sm:w-28 md:w-32 bg-light-100/10 rounded-lg mb-2 sm:mb-3'
            />
            <Animated.View 
              style={{ opacity }}
              className='h-3 sm:h-4 md:h-5 w-full bg-light-100/10 rounded-lg mb-1.5'
            />
            <Animated.View 
              style={{ opacity }}
              className='h-3 sm:h-4 md:h-5 w-full bg-light-100/10 rounded-lg mb-1.5'
            />
            <Animated.View 
              style={{ opacity }}
              className='h-3 sm:h-4 md:h-5 w-5/6 bg-light-100/10 rounded-lg'
            />
          </View>

          {/* Stats Grid Skeleton */}
          <View className='bg-dark-200/50 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 mb-4 sm:mb-5 md:mb-6 border border-dark-100'>
            <View className='flex-row justify-around'>
              {[1, 2, 3].map((item) => (
                <View key={item} className='items-center'>
                  <Animated.View 
                    style={{ opacity }}
                    className='h-3 sm:h-4 md:h-5 w-12 sm:w-16 md:w-20 bg-light-100/10 rounded-lg mb-1'
                  />
                  <Animated.View 
                    style={{ opacity }}
                    className='h-4 sm:h-5 md:h-6 w-16 sm:w-20 md:w-24 bg-light-100/10 rounded-lg'
                  />
                </View>
              ))}
            </View>
          </View>

          {/* Production Companies Skeleton */}
          <View className='mb-4 sm:mb-5 md:mb-6'>
            <Animated.View 
              style={{ opacity }}
              className='h-6 sm:h-7 md:h-8 w-28 sm:w-32 md:w-36 bg-light-100/10 rounded-lg mb-2 sm:mb-3'
            />
            <View className='flex-row flex-wrap gap-1.5 sm:gap-2 md:gap-2.5'>
              {[1, 2, 3].map((item) => (
                <Animated.View 
                  key={item}
                  style={{ opacity }}
                  className='h-7 sm:h-8 md:h-9 w-24 sm:w-28 md:w-32 bg-light-100/10 rounded-lg'
                />
              ))}
            </View>
          </View>

          {/* Cast Skeleton */}
          <View className='mb-4 sm:mb-5 md:mb-6'>
            <Animated.View 
              style={{ opacity }}
              className='h-6 sm:h-7 md:h-8 w-24 sm:w-28 md:w-32 bg-light-100/10 rounded-lg mb-2 sm:mb-3'
            />
            <View className='flex-row gap-2 sm:gap-3 md:gap-4'>
              {[1, 2, 3, 4, 5].map((item) => (
                <View key={item} className='items-center w-20 sm:w-24 md:w-28'>
                  <Animated.View 
                    style={{ opacity }}
                    className='w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-light-100/10 mb-1.5 sm:mb-2'
                  />
                  <Animated.View 
                    style={{ opacity }}
                    className='h-3 sm:h-4 md:h-5 w-16 sm:w-20 md:w-24 bg-light-100/10 rounded-lg mb-1'
                  />
                  <Animated.View 
                    style={{ opacity }}
                    className='h-2 sm:h-3 md:h-4 w-12 sm:w-16 md:w-20 bg-light-100/10 rounded-lg'
                  />
                </View>
              ))}
            </View>
          </View>

          {/* Reviews Section Skeleton */}
          <View className='mb-4 sm:mb-5 md:mb-6'>
            <View className='flex-row justify-between items-center mb-2 sm:mb-3'>
              <Animated.View 
                style={{ opacity }}
                className='h-6 sm:h-7 md:h-8 w-28 sm:w-32 md:w-36 bg-light-100/10 rounded-lg'
              />
              <Animated.View 
                style={{ opacity }}
                className='h-7 sm:h-8 md:h-9 w-24 sm:w-28 md:w-32 bg-light-100/10 rounded-lg'
              />
            </View>
            
            {/* Review Items Skeleton */}
            {[1, 2].map((item) => (
              <View key={item} className='bg-dark-100 rounded-xl p-3 sm:p-4 md:p-5 border border-light-300/20 mb-2 sm:mb-3'>
                <View className='flex-row justify-between items-start mb-2'>
                  <View className='flex-1'>
                    <Animated.View 
                      style={{ opacity }}
                      className='h-4 sm:h-5 md:h-6 w-24 sm:w-28 md:w-32 bg-light-100/10 rounded-lg mb-1'
                    />
                    <Animated.View 
                      style={{ opacity }}
                      className='h-3 sm:h-4 md:h-5 w-32 sm:w-36 md:w-40 bg-light-100/10 rounded-lg'
                    />
                  </View>
                </View>
                <Animated.View 
                  style={{ opacity }}
                  className='h-3 sm:h-4 md:h-5 w-full bg-light-100/10 rounded-lg mb-1'
                />
                <Animated.View 
                  style={{ opacity }}
                  className='h-3 sm:h-4 md:h-5 w-5/6 bg-light-100/10 rounded-lg'
                />
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Buttons Skeleton */}
      <View className={`absolute ${isLandscape ? 'bottom-3 sm:bottom-4' : 'bottom-4 sm:bottom-5'} left-0 right-0 mx-4 sm:mx-5 md:mx-6 flex-row gap-2 sm:gap-3 z-50`}>
        <Animated.View 
          style={{ opacity }}
          className='flex-1 h-10 sm:h-11 md:h-12 bg-light-100/10 rounded-lg'
        />
        <Animated.View 
          style={{ opacity }}
          className='flex-1 h-10 sm:h-11 md:h-12 bg-light-100/10 rounded-lg'
        />
      </View>
    </View>
  );
};

export default MovieDetailsSkeleton;
