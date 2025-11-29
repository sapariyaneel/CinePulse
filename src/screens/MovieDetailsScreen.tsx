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
import { ActivityIndicator, Alert, FlatList, Image, Modal, ScrollView, Text, TextInput, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CategoryModal from '@/components/CategoryModal'
import ReviewReactions from '@/components/ReviewReactions';
import MovieDetailsSkeleton from '@/components/MovieDetailsSkeleton';

interface MovieInfoProps {
  label: string;
  value?: string | number | null;
}

const MovieInfo = ({ label, value }: MovieInfoProps) => (
  <View className='flex-col items-start justify-center mt-3 sm:mt-4 md:mt-5'>
    <Text className='text-light-200 font-normal text-xs sm:text-sm md:text-base'>{label}</Text>
    <Text className='text-light-100 font-bold text-xs sm:text-sm md:text-base mt-1 sm:mt-1.5 md:mt-2'>{value || 'N/A'}</Text>
  </View>
)

const MovieDetailsScreen = () => {
  const route = useRoute<MovieDetailsRouteProp>();
  const navigation = useNavigation<RootStackNavigationProp>();
  const { id } = route.params;
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
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
    return <MovieDetailsSkeleton />
  }

  if (!movie) {
    return (
      <SafeAreaView className='bg-primary flex-1'>
        <View className='flex-1 justify-center items-center px-4 sm:px-6 md:px-8'>
          <Text className='text-white text-sm sm:text-base md:text-lg'>Movie not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View className='bg-primary flex-1'>
        <ScrollView contentContainerStyle={{
          paddingBottom: isLandscape ? 80 : 100
        }}>
          {/* Backdrop Image */}
          <View className='relative'>
            <Image 
              source={{uri: `https://image.tmdb.org/t/p/w780${movie?.backdrop_path || movie?.poster_path}`}} 
              className={`w-full ${isLandscape ? 'h-40 sm:h-48 md:h-56' : 'h-48 sm:h-56 md:h-64 lg:h-72'}`}
              resizeMode="cover" 
            />
          </View>

          {/* Movie Info Section */}
          <View className='px-4 sm:px-5 md:px-6 lg:px-8 pt-4 sm:pt-5 md:pt-6'>
            {/* Poster and Title Row */}
            <View className='flex-row gap-3 sm:gap-4 md:gap-5 mb-4 sm:mb-5 md:mb-6'>
              {/* Poster */}
              <View className={`${isLandscape ? 'w-28 h-40 sm:w-32 sm:h-44 md:w-36 md:h-48' : 'w-32 h-48 sm:w-36 sm:h-52 md:w-40 md:h-56 lg:w-44 lg:h-60'} rounded-lg sm:rounded-xl overflow-hidden border-2 border-dark-100 shadow-lg`}>
                <Image 
                  source={{uri: `https://image.tmdb.org/t/p/w342${movie?.poster_path}`}} 
                  className='w-full h-full' 
                  resizeMode="cover" 
                />
              </View>
              
              {/* Title and Meta */}
              <View className='flex-1 justify-start'>
                <Text className='text-white font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl mb-2 sm:mb-3' numberOfLines={3}>{movie?.title}</Text>
                <View className='flex-row items-center gap-x-1.5 sm:gap-x-2 mb-2 sm:mb-3'>
                  <Text className='text-light-300 text-sm sm:text-base md:text-lg'>{movie?.release_date?.split('-')[0]}</Text>
                  <View className='w-1 h-1 rounded-full bg-light-300' />
                  <Text className='text-light-300 text-sm sm:text-base md:text-lg'>{movie?.runtime}m</Text>
                </View>
                <View className='flex-row items-center bg-dark-100 px-3 sm:px-4 py-1.5 sm:py-2 rounded-md sm:rounded-lg self-start mb-2 sm:mb-3'>
                  <Image source={icons.star} className='w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 mr-1 sm:mr-1.5' />
                  <Text className='text-white font-bold text-sm sm:text-base md:text-lg'>{(movie?.vote_average ?? 0).toFixed(1)}/10</Text>
                  <Text className='text-light-300 text-xs sm:text-sm md:text-base ml-1 sm:ml-1.5'>({movie?.vote_count})</Text>
                </View>
                {/* Genres */}
                {movie?.genres && movie.genres.length > 0 && (
                  <View className='flex-row flex-wrap gap-1.5 sm:gap-2 md:gap-2.5'>
                    {movie.genres.map((genre) => (
                      <View key={genre.id} className='bg-dark-100 px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 rounded-full border border-light-300/20'>
                        <Text className='text-light-200 text-[10px] sm:text-xs md:text-sm font-medium'>{genre.name}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            </View>

            {/* Overview */}
            {movie?.overview && (
              <View className='mb-4 sm:mb-5 md:mb-6'>
                <Text className='text-white text-base sm:text-lg md:text-xl font-bold mb-1.5 sm:mb-2 md:mb-3'>Overview</Text>
                <Text className='text-light-300 text-xs sm:text-sm md:text-base leading-5 sm:leading-6 md:leading-7 text-justify'>{movie.overview}</Text>
              </View>
            )}

            {/* Stats Grid */}
            <View className='bg-dark-200/50 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 mb-4 sm:mb-5 md:mb-6 border border-dark-100'>
              <View className={`flex-row ${isLandscape ? 'justify-around' : 'justify-around'}`}>
                <View className='items-center'>
                  <Text className='text-light-300 text-[10px] sm:text-xs md:text-sm mb-0.5 sm:mb-1'>Budget</Text>
                  <Text className='text-white font-bold text-xs sm:text-sm md:text-base'>
                    {movie?.budget ? `$${(movie.budget / 1_000_000).toFixed(0)}M` : 'N/A'}
                  </Text>
                </View>
                <View className='w-px bg-dark-100' />
                <View className='items-center'>
                  <Text className='text-light-300 text-[10px] sm:text-xs md:text-sm mb-0.5 sm:mb-1'>Revenue</Text>
                  <Text className='text-white font-bold text-xs sm:text-sm md:text-base'>
                    {movie?.revenue ? `$${(movie.revenue / 1_000_000).toFixed(0)}M` : 'N/A'}
                  </Text>
                </View>
                <View className='w-px bg-dark-100' />
                <View className='items-center'>
                  <Text className='text-light-300 text-[10px] sm:text-xs md:text-sm mb-0.5 sm:mb-1'>Language</Text>
                  <Text className='text-white font-bold text-xs sm:text-sm md:text-base uppercase'>{movie?.original_language}</Text>
                </View>
              </View>
            </View>

            {/* Production Companies */}
            {movie?.production_companies && movie.production_companies.length > 0 && (
              <View className='mb-4 sm:mb-5 md:mb-6'>
                <Text className='text-white text-base sm:text-lg md:text-xl font-bold mb-2 sm:mb-3'>Production</Text>
                <View className='flex-row flex-wrap gap-1.5 sm:gap-2 md:gap-2.5'>
                  {movie.production_companies.map((company) => (
                    <View key={company.id} className='bg-dark-100 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-md sm:rounded-lg border border-light-300/20'>
                      <Text className='text-light-200 text-[10px] sm:text-xs md:text-sm'>{company.name}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Cast */}
            {credits?.cast && credits.cast.length > 0 && (
              <View className='mb-4 sm:mb-5 md:mb-6'>
                <Text className='text-white text-base sm:text-lg md:text-xl font-bold mb-2 sm:mb-3'>Top Cast</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View className='flex-row gap-2 sm:gap-3 md:gap-4'>
                    {credits.cast.slice(0, 10).map((actor) => (
                      <View key={actor.id} className='items-center w-20 sm:w-24 md:w-28'>
                        <View className='w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full overflow-hidden bg-dark-100 border border-light-300/20 mb-1.5 sm:mb-2'>
                          {actor.profile_path ? (
                            <Image 
                              source={{uri: `https://image.tmdb.org/t/p/w92${actor.profile_path}`}} 
                              className='w-full h-full' 
                              resizeMode="cover"
                            />
                          ) : (
                            <View className='w-full h-full items-center justify-center'>
                              <Image source={icons.person} className='w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10' tintColor='#A8B5DB' />
                            </View>
                          )}
                        </View>
                        <Text className='text-white text-[10px] sm:text-xs md:text-sm font-medium text-center' numberOfLines={1}>
                          {actor.name}
                        </Text>
                        <Text className='text-light-300 text-[9px] sm:text-[10px] md:text-xs text-center' numberOfLines={1}>
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
              <View className='mb-4 sm:mb-5 md:mb-6'>
                <Text className='text-white text-base sm:text-lg md:text-xl font-bold mb-2 sm:mb-3'>Key Crew</Text>
                <View className='flex-row flex-wrap gap-1.5 sm:gap-2 md:gap-2.5'>
                  {credits.crew
                    .filter(c => ['Director', 'Producer', 'Screenplay', 'Writer'].includes(c.job))
                    .slice(0, 6)
                    .map((crew, index) => (
                      <View key={`${crew.id}-${index}`} className='bg-dark-100 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-md sm:rounded-lg border border-light-300/20'>
                        <Text className='text-white text-[10px] sm:text-xs md:text-sm font-medium'>{crew.name}</Text>
                        <Text className='text-light-300 text-[9px] sm:text-[10px] md:text-xs'>{crew.job}</Text>
                      </View>
                    ))}
                </View>
              </View>
            )}

            {/* Reviews Section */}
            <View className='mb-4 sm:mb-5 md:mb-6'>
              <View className='flex-row justify-between items-center mb-2 sm:mb-3'>
                <Text className='text-white text-base sm:text-lg md:text-xl font-bold'>
                  Reviews ({reviews.length})
                </Text>
                <TouchableOpacity 
                  onPress={handleOpenReviewModal}
                  className='bg-accent px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 rounded-md sm:rounded-lg'
                >
                  <Text className='text-secondary text-xs sm:text-sm md:text-base font-semibold'>
                    {userReview ? 'Edit Review' : 'Write Review'}
                  </Text>
                </TouchableOpacity>
              </View>

              {reviews.length === 0 ? (
                <View className='bg-dark-100 rounded-xl p-5 sm:p-6 md:p-7 items-center border border-light-300/20'>
                  <Image source={icons.star} className='w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 mb-1.5 sm:mb-2' tintColor='#A8B5DB' />
                  <Text className='text-light-300 text-xs sm:text-sm md:text-base text-center'>
                    No reviews yet. Be the first to review!
                  </Text>
                </View>
              ) : (
                <View className='gap-2 sm:gap-3'>
                  {reviews.map((review) => (
                    <View key={review.id} className='bg-dark-100 rounded-xl p-3 sm:p-4 md:p-5 border border-light-300/20'>
                      <View className='flex-row justify-between items-start mb-1.5 sm:mb-2'>
                        <View className='flex-1'>
                          <Text className='text-white font-semibold text-xs sm:text-sm md:text-base'>@{review.username}</Text>
                          <View className='flex-row items-center mt-0.5 sm:mt-1'>
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Image 
                                key={star}
                                source={icons.star} 
                                className='w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5 mr-0.5 sm:mr-1' 
                                tintColor={star <= review.rating ? '#FFD700' : '#4A5568'}
                              />
                            ))}
                            <Text className='text-light-300 text-[9px] sm:text-[10px] md:text-xs ml-0.5 sm:ml-1'>
                              {new Date(review.createdAt).toLocaleDateString()}
                            </Text>
                          </View>
                        </View>
                        {review.userId === userReview?.userId && (
                          <TouchableOpacity onPress={handleDeleteReview}>
                            <Text className='text-red-500 text-[10px] sm:text-xs md:text-sm'>Delete</Text>
                          </TouchableOpacity>
                        )}
                      </View>
                      <Text className='text-light-200 text-xs sm:text-sm md:text-base leading-4 sm:leading-5 mb-1.5 sm:mb-2'>{review.review}</Text>
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

        <View className={`absolute ${isLandscape ? 'bottom-3 sm:bottom-4' : 'bottom-4 sm:bottom-5'} left-0 right-0 mx-4 sm:mx-5 md:mx-6 flex-row gap-2 sm:gap-3 z-50`}>
          <TouchableOpacity 
            className='flex-1 bg-dark-100 rounded-lg py-2.5 sm:py-3 md:py-3.5 flex flex-row items-center justify-center border border-light-300/20' 
            onPress={() => navigation.goBack()}
          >
            <Image source={icons.arrow} className='w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 mr-1 mt-0.5 rotate-180' tintColor="#fff" />
            <Text className='text-white font-semibold text-sm sm:text-base md:text-lg'>Back</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            className={`flex-1 rounded-lg py-2.5 sm:py-3 md:py-3.5 flex flex-row items-center justify-center ${
              isSaved ? 'bg-dark-100 border border-accent' : 'bg-accent'
            }`}
            onPress={handleSaveToggle}
          >
            <Image 
              source={icons.save} 
              className='w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 mr-1.5 sm:mr-2' 
              tintColor={isSaved ? '#AB8BFF' : '#151312'} 
            />
            <Text className={`font-semibold text-sm sm:text-base md:text-lg ${
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
            <View className='bg-dark-200 rounded-t-2xl sm:rounded-t-3xl p-4 sm:p-5 md:p-6 border-t border-dark-100'>
              <View className='flex-row justify-between items-center mb-4 sm:mb-5 md:mb-6'>
                <Text className='text-white text-lg sm:text-xl md:text-2xl font-bold'>
                  {userReview ? 'Edit Review' : 'Write a Review'}
                </Text>
                <TouchableOpacity onPress={() => setShowReviewModal(false)}>
                  <Text className='text-light-300 text-sm sm:text-base md:text-lg'>Cancel</Text>
                </TouchableOpacity>
              </View>

              {/* Rating */}
              <View className='mb-4 sm:mb-5 md:mb-6'>
                <Text className='text-light-300 text-xs sm:text-sm md:text-base mb-2 sm:mb-3'>Your Rating</Text>
                <View className='flex-row justify-center gap-2 sm:gap-3 md:gap-4'>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity
                      key={star}
                      onPress={() => setRating(star)}
                      className='p-1 sm:p-1.5 md:p-2'
                    >
                      <Image 
                        source={icons.star} 
                        className='w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12' 
                        tintColor={star <= rating ? '#FFD700' : '#4A5568'}
                        resizeMode='contain'
                      />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Review Text */}
              <View className='mb-4 sm:mb-5 md:mb-6'>
                <Text className='text-light-300 text-xs sm:text-sm md:text-base mb-1.5 sm:mb-2'>Your Review</Text>
                <TextInput
                  value={reviewText}
                  onChangeText={setReviewText}
                  placeholder='Share your thoughts about this movie...'
                  placeholderTextColor='#9CA4AB'
                  multiline
                  numberOfLines={6}
                  textAlignVertical='top'
                  className='bg-dark-100 text-white text-xs sm:text-sm md:text-base px-3 sm:px-4 py-2 sm:py-3 rounded-xl border border-light-300/20 min-h-28 sm:min-h-32 md:min-h-36'
                />
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                onPress={handleSubmitReview}
                disabled={submittingReview}
                className={`rounded-xl py-3 sm:py-3.5 md:py-4 items-center ${
                  submittingReview ? 'bg-dark-100' : 'bg-accent'
                }`}
              >
                {submittingReview ? (
                  <ActivityIndicator color='#fff' />
                ) : (
                  <Text className='text-secondary text-sm sm:text-base md:text-lg font-semibold'>
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
