import { icons } from '@/constants/icons';
import { images } from '@/constants/images';
import { deleteReview, getUserReviews } from '@/services/reviewService';
import { useFocusEffect } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import type { RootStackNavigationProp } from '@/navigation/types';;
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ReviewsScreen = () => {
  const navigation = useNavigation<RootStackNavigationProp>(); 
  const [reviews, setReviews] = useState<MovieReview[]>([]);
  const [loading, setLoading] = useState(true);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const userReviews = await getUserReviews();
      setReviews(userReviews);
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadReviews();
    }, [])
  );

  const handleDeleteReview = (review: MovieReview) => {
    Alert.alert(
      'Delete Review',
      `Are you sure you want to delete your review for "${review.movieTitle}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteReview(review.id);
              Alert.alert('Success', 'Review deleted');
              loadReviews();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete review');
            }
          }
        }
      ]
    );
  };

  const handleMoviePress = (movieId: number) => {
    navigation.navigate('MovieDetails', { id: movieId.toString() });
  };

  const renderReviewItem = ({ item }: { item: MovieReview }) => (
    <TouchableOpacity 
      onPress={() => handleMoviePress(item.movieId)}
      className='bg-dark-200/80 rounded-2xl p-4 mb-4 border border-dark-100'
    >
      <View className='flex-row gap-4'>
        {/* Movie Poster */}
        <TouchableOpacity 
          onPress={() => handleMoviePress(item.movieId)}
          className='w-20 h-28 rounded-lg overflow-hidden border border-dark-100 bg-dark-100'
        >
          {item.moviePoster ? (
            <Image 
              source={{uri: `https://image.tmdb.org/t/p/w200${item.moviePoster}`}} 
              className='w-full h-full' 
              resizeMode="cover"
            />
          ) : (
            <View className='w-full h-full items-center justify-center'>
              <Image source={icons.star} className='size-8' tintColor='#A8B5DB' />
            </View>
          )}
        </TouchableOpacity>

        {/* Review Content */}
        <View className='flex-1'>
          <Text className='text-white font-bold text-base mb-1' numberOfLines={1}>
            {item.movieTitle}
          </Text>
          
          {/* Rating Stars */}
          <View className='flex-row items-center mb-2'>
            {[1, 2, 3, 4, 5].map((star) => (
              <Image 
                key={star}
                source={icons.star} 
                className='size-3 mr-1' 
                tintColor={star <= item.rating ? '#FFD700' : '#4A5568'}
              />
            ))}
            <Text className='text-light-300 text-xs ml-2'>
              {new Date(item.createdAt).toLocaleDateString()}
            </Text>
          </View>

          {/* Review Text */}
          <Text className='text-light-200 text-sm leading-5 mb-3' numberOfLines={3}>
            {item.review}
          </Text>

          {/* Actions */}
          <View className='flex-row gap-2'>
            <TouchableOpacity 
              onPress={() => handleMoviePress(item.movieId)}
              className='bg-accent px-3 py-1.5 rounded-lg'
            >
              <Text className='text-secondary text-xs font-semibold'>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => handleDeleteReview(item)}
              className='bg-dark-100 px-3 py-1.5 rounded-lg border border-red-500/30'
            >
              <Text className='text-red-500 text-xs font-semibold'>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView className='bg-primary flex-1'>
        <Image
          source={images.bg}
          className='absolute w-full h-full z-0'
          resizeMode='cover'
        />
        <View className='flex-1 justify-center items-center'>
          <ActivityIndicator size="large" color="#AB8BFF" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className='bg-primary flex-1'>
      <Image
        source={images.bg}
        className='absolute w-full h-full z-0'
        resizeMode='cover'
      />
      
      <View className='flex-1'>
        {/* Header */}
        <View className='flex-row items-center justify-between px-5 pt-5 pb-6'>
          <View className='flex-row items-center flex-1'>
            <TouchableOpacity 
              onPress={() => navigation.goBack()}
              className='mr-4'
            >
              <Image source={icons.arrow} className='size-6' tintColor='#fff' style={{ transform: [{ rotate: '180deg' }] }} />
            </TouchableOpacity>
            <Text className='text-white text-2xl font-bold'>My Reviews</Text>
          </View>
          <View className='bg-accent w-10 h-10 rounded-full items-center justify-center'>
            <Text className='text-secondary text-base font-bold'>{reviews.length}</Text>
          </View>
        </View>

        {/* Reviews List */}
        {reviews.length === 0 ? (
          <View className='flex-1 justify-center items-center px-6 pb-32'>
            <View className='bg-dark-200/90 rounded-3xl p-10 items-center border border-dark-100 w-full max-w-sm'>
              <Image source={icons.star} className='size-14 mb-5' tintColor='#A8B5DB' resizeMode='contain' />
              <Text className='text-white text-xl font-bold mb-3 text-center'>
                No Reviews Yet
              </Text>
              <Text className='text-light-300 text-sm text-center mb-8 leading-5'>
                Start reviewing movies to see them here!
              </Text>
              <TouchableOpacity 
                onPress={() => navigation.navigate('Tabs')}
                className='bg-accent px-8 py-3.5 rounded-xl'
              >
                <Text className='text-secondary text-base font-semibold'>Explore Movies</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <FlatList
            data={reviews}
            renderItem={renderReviewItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default ReviewsScreen;


