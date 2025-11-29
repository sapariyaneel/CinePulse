import React, { useEffect, useRef } from 'react';
import { View, Animated, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { images } from '@/constants/images';

const ReviewsSkeleton = () => {
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

  // Skeleton for a single review item
  const ReviewItemSkeleton = () => (
    <View className='bg-dark-200/80 rounded-2xl p-4 mb-4 border border-dark-100'>
      <View className='flex-row gap-4'>
        {/* Poster Skeleton */}
        <Animated.View 
          style={{ opacity }}
          className='w-20 h-28 rounded-lg bg-light-100/10'
        />

        {/* Content Skeleton */}
        <View className='flex-1'>
          {/* Title Skeleton */}
          <Animated.View 
            style={{ opacity }}
            className='h-5 w-3/4 bg-light-100/10 rounded-lg mb-2'
          />
          
          {/* Rating Stars and Date Skeleton */}
          <View className='flex-row items-center mb-2'>
            <Animated.View 
              style={{ opacity }}
              className='h-3 w-20 bg-light-100/10 rounded-lg mr-2'
            />
            <Animated.View 
              style={{ opacity }}
              className='h-3 w-16 bg-light-100/10 rounded-lg'
            />
          </View>

          {/* Review Text Skeleton */}
          <Animated.View 
            style={{ opacity }}
            className='h-3 w-full bg-light-100/10 rounded-lg mb-1.5'
          />
          <Animated.View 
            style={{ opacity }}
            className='h-3 w-5/6 bg-light-100/10 rounded-lg mb-1.5'
          />
          <Animated.View 
            style={{ opacity }}
            className='h-3 w-4/5 bg-light-100/10 rounded-lg mb-3'
          />

          {/* Action Buttons Skeleton */}
          <View className='flex-row gap-2'>
            <Animated.View 
              style={{ opacity }}
              className='h-7 w-16 bg-light-100/10 rounded-lg'
            />
            <Animated.View 
              style={{ opacity }}
              className='h-7 w-16 bg-light-100/10 rounded-lg'
            />
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView className='bg-primary flex-1'>
      <Image
        source={images.bg}
        className='absolute w-full h-full z-0'
        resizeMode='cover'
      />
      
      <View className='flex-1'>
        {/* Header Skeleton */}
        <View className='flex-row items-center justify-between px-5 pt-5 pb-6'>
          <View className='flex-row items-center flex-1'>
            <Animated.View 
              style={{ opacity }}
              className='w-6 h-6 rounded-lg bg-light-100/10 mr-4'
            />
            <Animated.View 
              style={{ opacity }}
              className='h-7 w-32 bg-light-100/10 rounded-lg'
            />
          </View>
          <Animated.View 
            style={{ opacity }}
            className='w-10 h-10 rounded-full bg-light-100/10'
          />
        </View>

        {/* Reviews List Skeleton */}
        <View className='px-5 pb-24'>
          {[1, 2, 3, 4].map((item) => (
            <ReviewItemSkeleton key={item} />
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ReviewsSkeleton;
