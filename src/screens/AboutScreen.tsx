import { icons } from '@/constants/icons';
import { images } from '@/constants/images';
import { Clapperboard, Cloud, Heart, Lock, Users, Github } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import type { RootStackNavigationProp } from '@/navigation/types';
import React from 'react';
import { Image, Linking, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const FeatureCard = ({ icon, title, description }: { icon: any; title: string; description: string }) => (
  <View className='bg-dark-200/80 rounded-2xl p-5 mb-4 border border-dark-100'>
    <View className='flex-row items-center mb-3'>
      <View className='w-12 h-12 rounded-full bg-accent/20 items-center justify-center mr-4'>
        <Image source={icon} className='size-6' tintColor='#AB8BFF' resizeMode='contain' />
      </View>
      <Text className='text-white text-lg font-bold flex-1'>{title}</Text>
    </View>
    <Text className='text-light-300 text-sm leading-6'>{description}</Text>
  </View>
);

const TechItem = ({ name }: { name: string }) => (
  <View className='bg-dark-100 px-4 py-2 rounded-full border border-accent/30 mr-2 mb-2'>
    <Text className='text-accent text-sm font-medium'>{name}</Text>
  </View>
);

const AboutScreen = () => {
  const navigation = useNavigation<RootStackNavigationProp>();

  const features = [
    {
      icon: icons.search,
      title: 'Discover Movies',
      description: 'Browse trending and popular movies from TMDB\'s extensive database with beautiful, intuitive interface.',
    },
    {
      icon: icons.save,
      title: 'Watchlist Categories',
      description: 'Organize movies into custom categories: Want to Watch, Watching, and Completed. Track your watch progress and manage your collection efficiently.',
    },
    {
      icon: icons.star,
      title: 'Write & Share Reviews',
      description: 'Share your thoughts and rate movies. Your reviews are visible to all users, creating a community-driven experience.',
    },
    {
      icon: icons.play,
      title: 'Trending Movies',
      description: 'See what\'s popular in the community based on real user views and interactions. Discover movies that others are watching.',
    },
    {
      icon: icons.person,
      title: 'User Authentication',
      description: 'Secure authentication with Supabase. Create your profile, customize avatars, and sync your data across devices.',
    },
  ];

  const techStack = [
    'React Native',
    'Expo SDK 54',
    'TypeScript',
    'NativeWind',
    'Expo Router',
    'Supabase',
    'PostgreSQL',
    'TMDB API',
  ];

  return (
    <SafeAreaView className='bg-primary flex-1'>
      <Image
        source={images.bg}
        className='absolute w-full h-full z-0'
        resizeMode='cover'
      />

      <ScrollView
        className='flex-1'
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Header */}
        <View className='px-5 pt-5 pb-6'>
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            className='mb-6'
          >
            <Image source={icons.arrow} className='size-6' tintColor='#fff' style={{ transform: [{ rotate: '180deg' }] }} />
          </TouchableOpacity>

          {/* Logo & Title */}
          <View className='items-center mb-8'>
            <Image source={icons.logo} className='w-24 h-20 mb-4' resizeMode='contain' />
            <Text className='text-white text-4xl font-bold mb-2'>CinePulse</Text>
            <Text className='text-accent text-base font-semibold mb-2'>Version 1.0.4</Text>
            <Text className='text-light-300 text-sm text-center px-8'>
              Your premium movie companion with watchlist categories, community reviews, and trending movies
            </Text>
          </View>
        </View>

        {/* Features Section */}
        <View className='px-5 mb-8'>
          <Text className='text-white text-2xl font-bold mb-4'>Features</Text>
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </View>

        {/* Tech Stack Section */}
        <View className='px-5 mb-8'>
          <Text className='text-white text-2xl font-bold mb-4'>Built With</Text>
          <View className='bg-dark-200/80 rounded-2xl p-5 border border-dark-100'>
            <Text className='text-light-300 text-sm mb-4 leading-6'>
              CinePulse is built with modern, cutting-edge technologies to deliver a smooth and responsive experience across all platforms.
            </Text>
            <View className='flex-row flex-wrap'>
              {techStack.map((tech, index) => (
                <TechItem key={index} name={tech} />
              ))}
            </View>
          </View>
        </View>

        {/* Developer Section */}
        <View className='px-5 mb-8'>
          <Text className='text-white text-2xl font-bold mb-4'>Developer</Text>
          <View className='bg-dark-200/80 rounded-2xl p-6 border border-dark-100'>
            <View className='items-center mb-6'>
              <View className='w-20 h-20 rounded-full bg-accent/20 items-center justify-center mb-4 border-2 border-accent'>
                <Text className='text-accent text-3xl font-bold'>NS</Text>
              </View>
              <Text className='text-white text-xl font-bold mb-1'>Neel Sapariya</Text>
              <Text className='text-light-300 text-sm'>Full Stack Developer</Text>
            </View>
            
            <Text className='text-light-300 text-sm text-center mb-6 leading-6'>
              Passionate about creating beautiful, functional mobile applications that enhance user experiences.
            </Text>

            <TouchableOpacity
              onPress={() => Linking.openURL('https://github.com/sapariyaneel/CinePulse')}
              className='bg-accent rounded-xl py-3.5 flex-row items-center justify-center'
            >
              <Github size={20} color="#151312" style={{ marginRight: 8 }} />
              <Text className='text-secondary text-base font-semibold'>View on GitHub</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Privacy & Data Section */}
        <View className='px-5 mb-8'>
          <Text className='text-white text-2xl font-bold mb-4'>Privacy & Data</Text>
          <View className='bg-dark-200/80 rounded-2xl p-5 border border-dark-100'>
            <View className='mb-4'>
              <View className='flex-row items-center mb-2'>
                <Lock size={18} color="#fff" style={{ marginRight: 8 }} />
                <Text className='text-white text-base font-semibold'>Secure Authentication</Text>
              </View>
              <Text className='text-light-300 text-sm leading-6'>
                Your account is secured with Supabase authentication. Your watchlist, reviews, and profile data are stored securely in the cloud and synced across devices.
              </Text>
            </View>
            <View className='mb-4'>
              <View className='flex-row items-center mb-2'>
                <Users size={18} color="#fff" style={{ marginRight: 8 }} />
                <Text className='text-white text-base font-semibold'>Community Reviews</Text>
              </View>
              <Text className='text-light-300 text-sm leading-6'>
                Reviews you write are visible to all users, creating a vibrant community. Your watchlist and personal data remain private to your account.
              </Text>
            </View>
            <View className='mb-4'>
              <View className='flex-row items-center mb-2'>
                <Clapperboard size={18} color="#fff" style={{ marginRight: 8 }} />
                <Text className='text-white text-base font-semibold'>Movie Data</Text>
              </View>
              <Text className='text-light-300 text-sm leading-6'>
                Movie information is fetched from The Movie Database (TMDB) API. Trending data is based on real user interactions within the app.
              </Text>
            </View>
            <View>
              <View className='flex-row items-center mb-2'>
                <Cloud size={18} color="#fff" style={{ marginRight: 8 }} />
                <Text className='text-white text-base font-semibold'>Cloud Sync</Text>
              </View>
              <Text className='text-light-300 text-sm leading-6'>
                Your watchlist categories and reviews are synced to the cloud. Access your data from any device by logging in with your account.
              </Text>
            </View>
          </View>
        </View>

        {/* Credits Section */}
        <View className='px-5 mb-4'>
          <Text className='text-white text-2xl font-bold mb-4'>Credits</Text>
          <View className='bg-dark-200/80 rounded-2xl p-5 border border-dark-100'>
            <Text className='text-light-300 text-sm leading-6 mb-3'>
              Movie data and images provided by:
            </Text>
            <TouchableOpacity
              onPress={() => Linking.openURL('https://www.themoviedb.org/')}
              className='bg-dark-100 rounded-xl p-4 border border-accent/30'
            >
              <Text className='text-accent text-base font-bold mb-1'>The Movie Database (TMDB)</Text>
              <Text className='text-light-300 text-xs'>
                This product uses the TMDB API but is not endorsed or certified by TMDB.
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer */}
        <View className='px-5 items-center'>
          <Text className='text-light-300 text-xs text-center'>
            Made with <Heart size={12} color="#ef4444" fill="#ef4444" /> by Neel Sapariya
          </Text>
          <Text className='text-light-300 text-xs text-center mt-1'>
            © 2025 CinePulse. All rights reserved.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AboutScreen;
