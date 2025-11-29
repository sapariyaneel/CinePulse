import React, { useEffect, useRef } from 'react';
import { View, Animated, ScrollView, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ProfileSkeleton = () => {
  const { height } = useWindowDimensions();
  const isLandscape = useWindowDimensions().width > height;
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
    <SafeAreaView className='bg-primary flex-1'>
      <ScrollView 
        className='flex-1'
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: isLandscape ? 80 : 100 }}
      >
        {/* Header Skeleton */}
        <View className='px-4 sm:px-5 md:px-6 lg:px-8 pt-4 sm:pt-5 md:pt-6 pb-6 sm:pb-8 md:pb-10'>
          <Animated.View 
            style={{ opacity }}
            className='h-8 sm:h-9 md:h-10 w-32 sm:w-40 md:w-48 bg-light-100/10 rounded-lg'
          />
        </View>

        {/* Profile Card Skeleton */}
        <View className='mx-4 sm:mx-5 md:mx-6 lg:mx-8 bg-dark-200/80 rounded-xl sm:rounded-2xl md:rounded-3xl p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 md:mb-8 border border-dark-100'>
          <View className='items-center mb-4 sm:mb-6 md:mb-8'>
            {/* Avatar Skeleton */}
            <Animated.View 
              style={{ opacity }}
              className='w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full bg-light-100/10 mb-3 sm:mb-4 md:mb-5'
            />
            
            {/* User Info Skeleton */}
            <Animated.View 
              style={{ opacity }}
              className='h-7 sm:h-8 md:h-9 w-40 sm:w-48 md:w-56 bg-light-100/10 rounded-lg mb-2'
            />
            <Animated.View 
              style={{ opacity }}
              className='h-4 sm:h-5 md:h-6 w-24 sm:w-28 md:w-32 bg-light-100/10 rounded-lg mb-1'
            />
            <Animated.View 
              style={{ opacity }}
              className='h-3 sm:h-4 md:h-5 w-32 sm:w-40 md:w-48 bg-light-100/10 rounded-lg'
            />
          </View>

          {/* Stats Skeleton */}
          <View className='flex-row border-t border-dark-100 pt-3 sm:pt-4 md:pt-5'>
            <View className='flex-1 items-center py-3 sm:py-4 md:py-5'>
              <Animated.View 
                style={{ opacity }}
                className='h-7 sm:h-8 md:h-9 w-12 sm:w-16 md:w-20 bg-light-100/10 rounded-lg mb-1'
              />
              <Animated.View 
                style={{ opacity }}
                className='h-3 sm:h-4 md:h-5 w-16 sm:w-20 md:w-24 bg-light-100/10 rounded-lg'
              />
            </View>
            <View className='w-px bg-dark-100' />
            <View className='flex-1 items-center py-3 sm:py-4 md:py-5'>
              <Animated.View 
                style={{ opacity }}
                className='h-7 sm:h-8 md:h-9 w-12 sm:w-16 md:w-20 bg-light-100/10 rounded-lg mb-1'
              />
              <Animated.View 
                style={{ opacity }}
                className='h-3 sm:h-4 md:h-5 w-16 sm:w-20 md:w-24 bg-light-100/10 rounded-lg'
              />
            </View>
          </View>
        </View>

        {/* Statistics Dashboard Skeleton */}
        <View className='mx-4 sm:mx-5 md:mx-6 lg:mx-8 mb-3 sm:mb-4 md:mb-5'>
          <Animated.View 
            style={{ opacity }}
            className='h-7 sm:h-8 md:h-9 w-48 sm:w-56 md:w-64 bg-light-100/10 rounded-lg'
          />
        </View>

        <View className='mx-4 sm:mx-5 md:mx-6 lg:mx-8 bg-dark-200/80 rounded-xl sm:rounded-2xl md:rounded-3xl p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 md:mb-8 border border-dark-100'>
          <View className='flex-row flex-wrap gap-3 sm:gap-4 md:gap-5'>
            {[1, 2, 3, 4].map((item) => (
              <Animated.View
                key={item}
                style={{ opacity }}
                className='flex-1 min-w-[140px] bg-dark-100 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5'
              >
                <Animated.View 
                  style={{ opacity }}
                  className='h-8 sm:h-10 md:h-12 w-16 sm:w-20 md:w-24 bg-light-100/10 rounded-lg mb-2'
                />
                <Animated.View 
                  style={{ opacity }}
                  className='h-3 sm:h-4 md:h-5 w-20 sm:w-24 md:w-28 bg-light-100/10 rounded-lg'
                />
              </Animated.View>
            ))}
          </View>
        </View>

        {/* Settings Section Skeleton */}
        <View className='mx-4 sm:mx-5 md:mx-6 lg:mx-8 bg-dark-200/80 rounded-xl sm:rounded-2xl md:rounded-3xl p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 md:mb-8 border border-dark-100'>
          <Animated.View 
            style={{ opacity }}
            className='h-5 sm:h-6 md:h-7 w-36 sm:w-40 md:w-48 bg-light-100/10 rounded-lg mb-3 sm:mb-4 md:mb-5'
          />
          
          {[1, 2, 3].map((item) => (
            <View key={item} className='flex-row items-center py-3 sm:py-4 md:py-5 border-b border-dark-100'>
              <Animated.View 
                style={{ opacity }}
                className='w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-light-100/10 mr-3 sm:mr-4 md:mr-5'
              />
              <View className='flex-1'>
                <Animated.View 
                  style={{ opacity }}
                  className='h-4 sm:h-5 md:h-6 w-32 sm:w-40 md:w-48 bg-light-100/10 rounded-lg mb-1'
                />
                <Animated.View 
                  style={{ opacity }}
                  className='h-3 sm:h-4 md:h-5 w-40 sm:w-48 md:w-56 bg-light-100/10 rounded-lg'
                />
              </View>
            </View>
          ))}
        </View>

        {/* Support Section Skeleton */}
        <View className='mx-4 sm:mx-5 md:mx-6 lg:mx-8 bg-dark-200/80 rounded-xl sm:rounded-2xl md:rounded-3xl p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 md:mb-8 border border-dark-100'>
          <Animated.View 
            style={{ opacity }}
            className='h-5 sm:h-6 md:h-7 w-24 sm:w-28 md:w-32 bg-light-100/10 rounded-lg mb-3 sm:mb-4 md:mb-5'
          />
          
          {[1, 2].map((item) => (
            <View key={item} className='flex-row items-center py-3 sm:py-4 md:py-5 border-b border-dark-100'>
              <Animated.View 
                style={{ opacity }}
                className='w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-light-100/10 mr-3 sm:mr-4 md:mr-5'
              />
              <View className='flex-1'>
                <Animated.View 
                  style={{ opacity }}
                  className='h-4 sm:h-5 md:h-6 w-28 sm:w-32 md:w-40 bg-light-100/10 rounded-lg mb-1'
                />
                <Animated.View 
                  style={{ opacity }}
                  className='h-3 sm:h-4 md:h-5 w-36 sm:w-44 md:w-52 bg-light-100/10 rounded-lg'
                />
              </View>
            </View>
          ))}
        </View>

        {/* Sign Out Button Skeleton */}
        <Animated.View 
          style={{ opacity }}
          className='mx-4 sm:mx-5 md:mx-6 lg:mx-8 h-12 sm:h-14 md:h-16 bg-light-100/10 rounded-lg sm:rounded-xl md:rounded-2xl mb-4 sm:mb-6 md:mb-8'
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileSkeleton;
