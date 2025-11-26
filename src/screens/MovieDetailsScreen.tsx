import { icons } from '@/constants/icons';
import { images } from '@/constants/images';
import { fetchMovieCredits, fetchMovieDetails } from '@/services/api';
import { canSaveMovies, getCurrentUserId } from '@/services/authService';
import { addOrUpdateReview, deleteReview, getMovieReviews, getUserReviewForMovie } from '@/services/reviewService';
import { trackMovieSearch } from '@/services/trendingService';
import { isMovieInWatchlist } from '@/services/watchlistService';
import useFetch from '@/services/useFetch';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { MovieDetailsRouteProp, RootStackNavigationProp } from '@/navigation/types';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Image, Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CategoryModal from '@/components/CategoryModal'
import ReviewReactions from '@/components/ReviewReactions';

interface MovieInfoProps {
  label: string;
  value?: string | number | null;
}

const MovieInfo = ({ label, value }: MovieInfoProps) => (
  <View className='flex-col items-start justify-center mt-5'>
    <Text className='text-light-200 font-normal text-sm'>{label}</Text>
    <Text className='text-light-100 font-bold text-sm mt-2'>{value || 'N?A'}</Text>
  </View>
)

const MovieDetailsScreen = () => {
  const route = useRoute<MovieDetailsRouteProp>();
  const navigation = useNavigation<RootStackNavigationProp>();
  const { id } = route.params;
  const [isSaved, setIsSaved] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviews, setReviews] = useState<MovieReview[]>([]);
  const [userReview, setUserReview] = useState<MovieReview | null>(null);

  const { data: movie, loading } = useFetch(() => fetchMovieDetails(String(id)));
  const { data: credits, loading: creditsLoading } = useFetch(() => fetchMovieCredits(String(id)));

  useEffect(() => {
    checkIfSaved();
    loadReviews();
  }, [id]);

  useEffect(() => {
    if (movie) {
      trackMovieView();
    }
  }, [movie]);

  const trackMovieView = async () => {
    if (!movie) return;
    const userId = await getCurrentUserId();
    await trackMovieSearch(
      movie.id,
      movie.title,
      movie.poster_path,
      movie.vote_average,
      movie.release_date,
      userId || undefined
    );
  };

  const loadReviews = async () => {
    const movieReviews = await getMovieReviews(Number(id));
    setReviews(movieReviews);
    const userRev = await getUserReviewForMovie(Number(id));
    setUserReview(userRev);
    if (userRev) {
      setRating(userRev.rating);
      setReviewText(userRev.review);
    }
  };

  const checkIfSaved = async () => {
    const saved = await isMovieInWatchlist(Number(id));
    setIsSaved(saved);
  };

  const handleOpenReviewModal = async () => {
    const canSave = await canSaveMovies();
    if (!canSave) {
      Alert.alert(
        'Login Required',
        'Please login or sign up to write a review',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Login', 
            onPress: () => navigation.navigate('Auth')
          }
        ]
      );
      return;
    }
    setShowReviewModal(true);
  };

  const handleSubmitReview = async () => {
    if (!movie) return;
    if (rating === 0) {
      Alert.alert('Error', 'Please select a rating');
      return;
    }
    if (!reviewText.trim()) {
      Alert.alert('Error', 'Please write a review');
      return;
    }

    try {
      setSubmittingReview(true);
      await addOrUpdateReview(
        movie.id,
        movie.title,
        movie.poster_path || '',
        rating,
        reviewText
      );
      setShowReviewModal(false);
      Alert.alert('Success', userReview ? 'Review updated!' : 'Review submitted!');
      await loadReviews();
    } catch (error) {
      Alert.alert('Error', 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleDeleteReview = async () => {
    if (!userReview) return;
    
    Alert.alert(
      'Delete Review',
      'Are you sure you want to delete your review?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteReview(userReview.id);
              setRating(0);
              setReviewText('');
              Alert.alert('Success', 'Review deleted');
              await loadReviews();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete review');
            }
          }
        }
      ]
    );
  };

  const handleSaveToggle = async () => {
    if (!movie) return;
    
    // Check if user is authenticated
    const canSave = await canSaveMovies();
    if (!canSave) {
      Alert.alert(
        'Login Required',
        'Please login or sign up to organize your watchlist',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Login', 
            onPress: () => navigation.navigate('Auth')
          }
        ]
      );
      return;
    }
    
    // Open category modal to add movie to watchlist
    setShowCategoryModal(true);
  };

  const handleCategoryModalSuccess = () => {
    checkIfSaved();
  };

  if (loading) {
    return (
      <SafeAreaView className='bg-primary flex-1'>
        <Image
          source={images.bg}
          className='absolute w-full h-full'
          resizeMode='cover'
        />
        <View className='flex-1 justify-center items-center'>
          <View className='bg-dark-200/90 rounded-3xl p-8 items-center border border-dark-100'>
            <ActivityIndicator size='large' color='#AB8BFF' />
            <Text className='text-white text-base font-semibold mt-4'>Loading movie details...</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  if (!movie) {
    return (
      <SafeAreaView className='bg-primary flex-1'>
        <View className='flex-1 justify-center items-center'>
          <Text className='text-white text-base'>Movie not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View className='bg-primary flex-1'>
        <ScrollView contentContainerStyle={{
          paddingBottom: 100
        }}>
          {/* Backdrop Image with Gradient Overlay */}
          <View className='relative'>
            <Image 
              source={{uri: `https://image.tmdb.org/t/p/original${movie?.backdrop_path || movie?.poster_path}`}} 
              className='w-full h-64' 
              resizeMode="cover" 
            />
            <View className='absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-primary to-transparent' />
          </View>

          {/* Movie Info Section */}
          <View className='px-5 -mt-20'>
            {/* Poster and Title Row */}
            <View className='flex-row gap-4 mb-5'>
              {/* Poster */}
              <View className='w-28 h-40 rounded-xl overflow-hidden border-2 border-dark-100 shadow-lg'>
                <Image 
                  source={{uri: `https://image.tmdb.org/t/p/w500${movie?.poster_path}`}} 
                  className='w-full h-full' 
                  resizeMode="cover" 
                />
              </View>
              
              {/* Title and Meta */}
              <View className='flex-1 justify-end pb-2'>
                <Text className='text-white font-bold text-2xl mb-2' numberOfLines={2}>{movie?.title}</Text>
                <View className='flex-row items-center gap-x-2 mb-2'>
                  <Text className='text-light-300 text-sm'>{movie?.release_date?.split('-')[0]}</Text>
                  <View className='w-1 h-1 rounded-full bg-light-300' />
                  <Text className='text-light-300 text-sm'>{movie?.runtime}m</Text>
                </View>
                <View className='flex-row items-center bg-dark-100 px-3 py-1.5 rounded-lg self-start'>
                  <Image source={icons.star} className='size-4 mr-1' />
                  <Text className='text-white font-bold text-sm'>{(movie?.vote_average ?? 0).toFixed(1)}/10</Text>
                  <Text className='text-light-300 text-xs ml-1'>({movie?.vote_count})</Text>
                </View>
              </View>
            </View>

            {/* Genres */}
            {movie?.genres && movie.genres.length > 0 && (
              <View className='flex-row flex-wrap gap-2 mb-5'>
                {movie.genres.map((genre) => (
                  <View key={genre.id} className='bg-dark-100 px-3 py-1.5 rounded-full border border-light-300/20'>
                    <Text className='text-light-200 text-xs font-medium'>{genre.name}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Overview */}
            {movie?.overview && (
              <View className='mb-5'>
                <Text className='text-white text-lg font-bold mb-2'>Overview</Text>
                <Text className='text-light-300 text-sm leading-6'>{movie.overview}</Text>
              </View>
            )}

            {/* Stats Grid */}
            <View className='bg-dark-200/50 rounded-2xl p-4 mb-5 border border-dark-100'>
              <View className='flex-row justify-around'>
                <View className='items-center'>
                  <Text className='text-light-300 text-xs mb-1'>Budget</Text>
                  <Text className='text-white font-bold text-sm'>
                    {movie?.budget ? `$${(movie.budget / 1_000_000).toFixed(0)}M` : 'N/A'}
                  </Text>
                </View>
                <View className='w-px bg-dark-100' />
                <View className='items-center'>
                  <Text className='text-light-300 text-xs mb-1'>Revenue</Text>
                  <Text className='text-white font-bold text-sm'>
                    {movie?.revenue ? `$${(movie.revenue / 1_000_000).toFixed(0)}M` : 'N/A'}
                  </Text>
                </View>
                <View className='w-px bg-dark-100' />
                <View className='items-center'>
                  <Text className='text-light-300 text-xs mb-1'>Language</Text>
                  <Text className='text-white font-bold text-sm uppercase'>{movie?.original_language}</Text>
                </View>
              </View>
            </View>

            {/* Production Companies */}
            {movie?.production_companies && movie.production_companies.length > 0 && (
              <View className='mb-5'>
                <Text className='text-white text-lg font-bold mb-3'>Production</Text>
                <View className='flex-row flex-wrap gap-2'>
                  {movie.production_companies.map((company) => (
                    <View key={company.id} className='bg-dark-100 px-3 py-2 rounded-lg border border-light-300/20'>
                      <Text className='text-light-200 text-xs'>{company.name}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Cast */}
            {credits?.cast && credits.cast.length > 0 && (
              <View className='mb-5'>
                <Text className='text-white text-lg font-bold mb-3'>Top Cast</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View className='flex-row gap-3'>
                    {credits.cast.slice(0, 10).map((actor) => (
                      <View key={actor.id} className='items-center w-24'>
                        <View className='w-20 h-20 rounded-full overflow-hidden bg-dark-100 border border-light-300/20 mb-2'>
                          {actor.profile_path ? (
                            <Image 
                              source={{uri: `https://image.tmdb.org/t/p/w185${actor.profile_path}`}} 
                              className='w-full h-full' 
                              resizeMode="cover"
                            />
                          ) : (
                            <View className='w-full h-full items-center justify-center'>
                              <Image source={icons.person} className='size-8' tintColor='#A8B5DB' />
                            </View>
                          )}
                        </View>
                        <Text className='text-white text-xs font-medium text-center' numberOfLines={1}>
                          {actor.name}
                        </Text>
                        <Text className='text-light-300 text-xs text-center' numberOfLines={1}>
                          {actor.character}
                        </Text>
                      </View>
                    ))}
                  </View>
                </ScrollView>
              </View>
            )}

            {/* Director & Key Crew */}
            {credits?.crew && credits.crew.length > 0 && (
              <View className='mb-5'>
                <Text className='text-white text-lg font-bold mb-3'>Key Crew</Text>
                <View className='flex-row flex-wrap gap-2'>
                  {credits.crew
                    .filter(c => ['Director', 'Producer', 'Screenplay', 'Writer'].includes(c.job))
                    .slice(0, 6)
                    .map((crew, index) => (
                      <View key={`${crew.id}-${index}`} className='bg-dark-100 px-3 py-2 rounded-lg border border-light-300/20'>
                        <Text className='text-white text-xs font-medium'>{crew.name}</Text>
                        <Text className='text-light-300 text-xs'>{crew.job}</Text>
                      </View>
                    ))}
                </View>
              </View>
            )}

            {/* Reviews Section */}
            <View className='mb-5'>
              <View className='flex-row justify-between items-center mb-3'>
                <Text className='text-white text-lg font-bold'>
                  Reviews ({reviews.length})
                </Text>
                <TouchableOpacity 
                  onPress={handleOpenReviewModal}
                  className='bg-accent px-4 py-2 rounded-lg'
                >
                  <Text className='text-secondary text-sm font-semibold'>
                    {userReview ? 'Edit Review' : 'Write Review'}
                  </Text>
                </TouchableOpacity>
              </View>

              {reviews.length === 0 ? (
                <View className='bg-dark-100 rounded-xl p-6 items-center border border-light-300/20'>
                  <Image source={icons.star} className='size-12 mb-2' tintColor='#A8B5DB' />
                  <Text className='text-light-300 text-sm text-center'>
                    No reviews yet. Be the first to review!
                  </Text>
                </View>
              ) : (
                <View className='gap-3'>
                  {reviews.map((review) => (
                    <View key={review.id} className='bg-dark-100 rounded-xl p-4 border border-light-300/20'>
                      <View className='flex-row justify-between items-start mb-2'>
                        <View className='flex-1'>
                          <Text className='text-white font-semibold'>@{review.username}</Text>
                          <View className='flex-row items-center mt-1'>
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Image 
                                key={star}
                                source={icons.star} 
                                className='size-3 mr-1' 
                                tintColor={star <= review.rating ? '#FFD700' : '#4A5568'}
                              />
                            ))}
                            <Text className='text-light-300 text-xs ml-1'>
                              {new Date(review.createdAt).toLocaleDateString()}
                            </Text>
                          </View>
                        </View>
                        {review.userId === userReview?.userId && (
                          <TouchableOpacity onPress={handleDeleteReview}>
                            <Text className='text-red-500 text-xs'>Delete</Text>
                          </TouchableOpacity>
                        )}
                      </View>
                      <Text className='text-light-200 text-sm leading-5 mb-2'>{review.review}</Text>
                      <ReviewReactions 
                        reviewId={review.id} 
                        isOwnReview={review.userId === userReview?.userId}
                      />
                    </View>
                  ))}
                </View>
              )}
            </View>
          </View>
        </ScrollView>

        <View className='absolute bottom-5 left-0 right-0 mx-5 flex-row gap-3 z-50'>
          <TouchableOpacity 
            className='flex-1 bg-dark-100 rounded-lg py-3.5 flex flex-row items-center justify-center border border-light-300/20' 
            onPress={() => navigation.goBack()}
          >
            <Image source={icons.arrow} className='size-5 mr-1 mt-0.5 rotate-180' tintColor="#fff" />
            <Text className='text-white font-semibold text-base'>Back</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            className={`flex-1 rounded-lg py-3.5 flex flex-row items-center justify-center ${
              isSaved ? 'bg-dark-100 border border-accent' : 'bg-accent'
            }`}
            onPress={handleSaveToggle}
          >
            <Image 
              source={icons.save} 
              className='size-5 mr-2' 
              tintColor={isSaved ? '#AB8BFF' : '#151312'} 
            />
            <Text className={`font-semibold text-base ${
              isSaved ? 'text-accent' : 'text-secondary'
            }`}>
              {isSaved ? 'In Watchlist' : 'Add to Watchlist'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Category Modal */}
        <CategoryModal
          visible={showCategoryModal}
          onClose={() => setShowCategoryModal(false)}
          movie={movie}
          onSuccess={handleCategoryModalSuccess}
        />

        {/* Review Modal */}
        <Modal
          visible={showReviewModal}
          transparent
          animationType='slide'
          onRequestClose={() => setShowReviewModal(false)}
        >
          <View className='flex-1 bg-black/80 justify-end'>
            <View className='bg-dark-200 rounded-t-3xl p-6 border-t border-dark-100'>
              <View className='flex-row justify-between items-center mb-6'>
                <Text className='text-white text-xl font-bold'>
                  {userReview ? 'Edit Review' : 'Write a Review'}
                </Text>
                <TouchableOpacity onPress={() => setShowReviewModal(false)}>
                  <Text className='text-light-300 text-base'>Cancel</Text>
                </TouchableOpacity>
              </View>

              {/* Rating */}
              <View className='mb-6'>
                <Text className='text-light-300 text-sm mb-3'>Your Rating</Text>
                <View className='flex-row justify-center gap-3'>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity
                      key={star}
                      onPress={() => setRating(star)}
                      className='p-2'
                    >
                      <Image 
                        source={icons.star} 
                        className='size-10' 
                        tintColor={star <= rating ? '#FFD700' : '#4A5568'}
                        resizeMode='contain'
                      />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Review Text */}
              <View className='mb-6'>
                <Text className='text-light-300 text-sm mb-2'>Your Review</Text>
                <TextInput
                  value={reviewText}
                  onChangeText={setReviewText}
                  placeholder='Share your thoughts about this movie...'
                  placeholderTextColor='#9CA4AB'
                  multiline
                  numberOfLines={6}
                  textAlignVertical='top'
                  className='bg-dark-100 text-white px-4 py-3 rounded-xl border border-light-300/20 min-h-32'
                />
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                onPress={handleSubmitReview}
                disabled={submittingReview}
                className={`rounded-xl py-4 items-center ${
                  submittingReview ? 'bg-dark-100' : 'bg-accent'
                }`}
              >
                {submittingReview ? (
                  <ActivityIndicator color='#fff' />
                ) : (
                  <Text className='text-secondary text-base font-semibold'>
                    {userReview ? 'Update Review' : 'Submit Review'}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
    </View>
  )
}

export default MovieDetailsScreen
