import { icons } from '@/constants/icons'
import { avatars, images } from '@/constants/images'
import { logoutUser } from '@/services/authService'
import { getCurrentUser, isUsernameAvailable, updateAvatar, updateUserProfile } from '@/services/userService'
import { getUserRatingStats } from '@/services/ratingAnalyticsService'
import { getUserGenrePreferences } from '@/services/recommendationService'
import { getUserMovieStatistics } from '@/services/movieStatsService'
import { useFocusEffect } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import type { RootStackNavigationProp } from '@/navigation/types';
import React, { useCallback, useState } from 'react'
import { ActivityIndicator, Alert, Image, Linking, Modal, ScrollView, Text, TextInput, TouchableOpacity, View, useWindowDimensions } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import RatingStatsCard from '@/components/RatingStatsCard'
import RatingDistributionChart from '@/components/RatingDistributionChart'
import RecentRatings from '@/components/RecentRatings' 
import GenrePreferences from '@/components/GenrePreferences'
import MovieStatsOverview from '@/components/MovieStatsOverview'
import GenreBreakdown from '@/components/GenreBreakdown'
import WatchlistBreakdown from '@/components/WatchlistBreakdown'
import MovieRecords from '@/components/MovieRecords'

const ProfileOption = ({ icon, title, subtitle, onPress }: { icon: any, title: string, subtitle?: string, onPress?: () => void }) => (
  <TouchableOpacity onPress={onPress} className='flex-row items-center py-3 sm:py-4 md:py-5 border-b border-dark-100'>
    <View className='w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-dark-100 items-center justify-center mr-3 sm:mr-4 md:mr-5'>
      <Image source={icon} className='w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6' tintColor='#A8B5DB' />
    </View>
    <View className='flex-1'>
      <Text className='text-white text-sm sm:text-base md:text-lg font-semibold'>{title}</Text>
      {subtitle && <Text className='text-light-300 text-xs sm:text-sm md:text-base mt-0.5 sm:mt-1'>{subtitle}</Text>}
    </View>
    <Image source={icons.arrow} className='w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 rotate-180' tintColor='#A8B5DB' />
  </TouchableOpacity>
)

const StatCard = ({ value, label }: { value: string, label: string }) => (
  <View className='flex-1 items-center py-3 sm:py-4 md:py-5'>
    <Text className='text-white text-xl sm:text-2xl md:text-3xl font-bold'>{value}</Text>
    <Text className='text-light-300 text-xs sm:text-sm md:text-base mt-0.5 sm:mt-1'>{label}</Text>
  </View>
)

const ProfileScreen = () => {
  const navigation = useNavigation<RootStackNavigationProp>()
  const { width, height } = useWindowDimensions()
  const isLandscape = width > height
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [showAvatarModal, setShowAvatarModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editName, setEditName] = useState('')
  const [editUsername, setEditUsername] = useState('')
  const [editEmail, setEditEmail] = useState('')
  const [usernameError, setUsernameError] = useState('')
  const [saving, setSaving] = useState(false)
  const [ratingStats, setRatingStats] = useState<any>(null)
  const [loadingStats, setLoadingStats] = useState(false)
  const [genrePreferences, setGenrePreferences] = useState<any[]>([])
  const [movieStats, setMovieStats] = useState<any>(null)

  const loadUser = async () => {
    try {
      setLoading(true)
      const userData = await getCurrentUser()
      setUser(userData)
      
      // Load all stats
      if (userData?.id) {
        setLoadingStats(true)
        const [stats, genres, movieStatistics] = await Promise.all([
          getUserRatingStats(userData.id),
          getUserGenrePreferences(userData.id),
          getUserMovieStatistics(userData.id)
        ])
        setRatingStats(stats)
        setGenrePreferences(genres)
        setMovieStats(movieStatistics)
        setLoadingStats(false)
      }
    } catch (error) {
      console.error('Error loading user:', error)
    } finally {
      setLoading(false)
    }
  }

  useFocusEffect(
    useCallback(() => {
      loadUser()
    }, [])
  )

  const handleAvatarChange = async (avatar: typeof avatars[0]) => {
    try {
      const updatedUser = await updateAvatar(avatar.id)
      setUser(updatedUser)
      setShowAvatarModal(false)
    } catch (error) {
      console.error('Error updating avatar:', error)
      Alert.alert('Error', 'Failed to update avatar')
    }
  }

  const openEditModal = () => {
    if (user) {
      setEditName(user.name)
      setEditUsername(user.username)
      setEditEmail(user.email)
      setUsernameError('')
      setShowEditModal(true)
    }
  }

  const validateUsername = async (username: string) => {
    if (!username || username.length < 3) {
      setUsernameError('Username must be at least 3 characters')
      return false
    }
    if (username.length > 30) {
      setUsernameError('Username must be less than 30 characters')
      return false
    }
    if (!/^[a-zA-Z0-9._]+$/.test(username)) {
      setUsernameError('Username can only contain letters, numbers, dots and underscores')
      return false
    }
    
    const available = await isUsernameAvailable(username, user?.username)
    if (!available) {
      setUsernameError('Username is already taken')
      return false
    }
    
    setUsernameError('')
    return true
  }

  const handleSaveProfile = async () => {
    try {
      setSaving(true)
      
      // Validate username
      const isValid = await validateUsername(editUsername)
      if (!isValid) {
        setSaving(false)
        return
      }

      // Validate email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(editEmail)) {
        Alert.alert('Error', 'Please enter a valid email address')
        setSaving(false)
        return
      }

      const updatedUser = await updateUserProfile({
        name: editName,
        username: editUsername,
        email: editEmail,
      })
      
      setUser(updatedUser)
      setShowEditModal(false)
      Alert.alert('Success', 'Profile updated successfully')
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const selectedAvatar = avatars.find(a => a.id === user?.avatarId) || avatars[0]

  if (loading) {
    return (
      <SafeAreaView className='bg-primary flex-1 justify-center items-center'>
        <ActivityIndicator size="large" color="#AB8BFF" />
      </SafeAreaView>
    )
  }

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
        contentContainerStyle={{ paddingBottom: isLandscape ? 80 : 100 }}
      >
        {/* Header */}
        <View className='px-4 sm:px-5 md:px-6 lg:px-8 pt-4 sm:pt-5 md:pt-6 pb-6 sm:pb-8 md:pb-10'>
          <Text className='text-white text-2xl sm:text-3xl md:text-4xl font-bold'>Profile</Text>
        </View>

        {/* Profile Card */}
        <View className='mx-4 sm:mx-5 md:mx-6 lg:mx-8 bg-dark-200/80 rounded-xl sm:rounded-2xl md:rounded-3xl p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 md:mb-8 border border-dark-100'>
          <View className='items-center mb-4 sm:mb-6 md:mb-8'>
            {/* Avatar */}
            <TouchableOpacity 
              onPress={() => setShowAvatarModal(true)}
              className='relative mb-3 sm:mb-4 md:mb-5'
            >
              <Image 
                source={selectedAvatar.image} 
                className='w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full border-2 border-accent'
              />
              <View className='absolute bottom-0 right-0 w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full bg-accent items-center justify-center border-2 border-primary'>
                <Image source={icons.person} className='w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5' tintColor='#030014' />
              </View>
            </TouchableOpacity>
            
            {/* User Info */}
            <Text className='text-white text-xl sm:text-2xl md:text-3xl font-bold'>{user?.name}</Text>
            <Text className='text-accent text-xs sm:text-sm md:text-base mt-0.5 sm:mt-1'>@{user?.username}</Text>
            <Text className='text-light-300 text-[10px] sm:text-xs md:text-sm mt-0.5 sm:mt-1'>{user?.email}</Text>
          </View>

          {/* Stats */}
          <View className='flex-row border-t border-dark-100 pt-3 sm:pt-4 md:pt-5'>
            <StatCard value={user?.savedMovies.length.toString() || '0'} label='Saved' />
            <View className='w-px bg-dark-100' />
            <StatCard value={user?.reviewCount.toString() || '0'} label='Reviews' />
          </View>
        </View>

        {/* Movie Statistics Dashboard */}
        {movieStats && (
          <>
            <View className='mx-4 sm:mx-5 md:mx-6 lg:mx-8 mb-3 sm:mb-4 md:mb-5'>
              <Text className='text-white text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 md:mb-5'>Statistics Dashboard</Text>
            </View>

            <View className='mx-4 sm:mx-5 md:mx-6 lg:mx-8 mb-4 sm:mb-6 md:mb-8'>
              <MovieStatsOverview
                totalMoviesWatched={movieStats.totalMoviesWatched}
                totalMoviesInWatchlist={movieStats.totalMoviesInWatchlist}
                totalReviews={movieStats.totalReviews}
                averageRating={movieStats.averageRating}
                watchTimeFormatted={movieStats.watchTimeFormatted}
                reviewsThisMonth={movieStats.reviewsThisMonth}
              />
            </View>

            {movieStats.favoriteGenres && movieStats.favoriteGenres.length > 0 && (
              <View className='mx-4 sm:mx-5 md:mx-6 lg:mx-8 mb-4 sm:mb-6 md:mb-8'>
                <GenreBreakdown genres={movieStats.favoriteGenres} />
              </View>
            )}

            {movieStats.watchlistByCategory && movieStats.watchlistByCategory.length > 0 && (
              <View className='mx-4 sm:mx-5 md:mx-6 lg:mx-8 mb-4 sm:mb-6 md:mb-8'>
                <WatchlistBreakdown categories={movieStats.watchlistByCategory} />
              </View>
            )}

            {(movieStats.longestMovie || movieStats.shortestMovie) && (
              <View className='mx-4 sm:mx-5 md:mx-6 lg:mx-8 mb-4 sm:mb-6 md:mb-8'>
                <MovieRecords
                  longestMovie={movieStats.longestMovie}
                  shortestMovie={movieStats.shortestMovie}
                />
              </View>
            )}
          </>
        )}

        {/* Genre Preferences Section */}
        {genrePreferences && genrePreferences.length > 0 && (
          <View className='mx-4 sm:mx-5 md:mx-6 lg:mx-8 mb-4 sm:mb-6 md:mb-8'>
            <GenrePreferences preferences={genrePreferences} />
          </View>
        )}

        {/* Rating Statistics Section */}
        {ratingStats && ratingStats.totalReviews > 0 && (
          <>
            <View className='mx-4 sm:mx-5 md:mx-6 lg:mx-8 mb-3 sm:mb-4 md:mb-5'>
              <Text className='text-white text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 md:mb-5'>Your Rating Analytics</Text>
            </View>

            <View className='mx-4 sm:mx-5 md:mx-6 lg:mx-8 mb-4 sm:mb-6 md:mb-8'>
              <RatingStatsCard
                totalReviews={ratingStats.totalReviews}
                averageRating={ratingStats.averageRating}
                highestRating={ratingStats.highestRating}
                lowestRating={ratingStats.lowestRating}
              />
            </View>

            <View className='mx-4 sm:mx-5 md:mx-6 lg:mx-8 mb-4 sm:mb-6 md:mb-8'>
              <RatingDistributionChart distribution={ratingStats.ratingDistribution} />
            </View>

            <View className='mx-4 sm:mx-5 md:mx-6 lg:mx-8 mb-4 sm:mb-6 md:mb-8'>
              <RecentRatings ratings={ratingStats.recentRatings} />
            </View>
          </>
        )}

        {/* Settings Section */}
        <View className='mx-4 sm:mx-5 md:mx-6 lg:mx-8 bg-dark-200/80 rounded-xl sm:rounded-2xl md:rounded-3xl p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 md:mb-8 border border-dark-100'>
          <Text className='text-white text-base sm:text-lg md:text-xl font-bold mb-3 sm:mb-4 md:mb-5'>Account Settings</Text>
          
          <ProfileOption 
            icon={icons.person}
            title='Edit Profile'
            subtitle='Update your personal information'
            onPress={openEditModal}
          />
          
          <ProfileOption 
            icon={icons.save}
            title='Saved Movies'
            subtitle='View your saved collection'
            onPress={() => navigation.navigate('Tabs')}
          />
          
          <ProfileOption 
            icon={icons.star}
            title='My Reviews'
            subtitle='See all your movie reviews'
            onPress={() => navigation.navigate('Reviews', { movieId: 0, movieTitle: '' })}
          />
        </View>

        {/* Support Section */}
        <View className='mx-4 sm:mx-5 md:mx-6 lg:mx-8 bg-dark-200/80 rounded-xl sm:rounded-2xl md:rounded-3xl p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 md:mb-8 border border-dark-100'>
          <Text className='text-white text-base sm:text-lg md:text-xl font-bold mb-3 sm:mb-4 md:mb-5'>Support</Text>
          
          <ProfileOption 
            icon={icons.search}
            title='Help Center'
            subtitle='Get help and support'
            onPress={() => Linking.openURL('https://github.com/sapariyaneel/CinePulse')}
          />
          
          <ProfileOption 
            icon={icons.star}
            title='About'
            subtitle='CinePulse v1.0.0 by Neel Sapariya'
            onPress={() => navigation.navigate('About')}
          />
        </View>

        {/* Sign Out Button */}
        <TouchableOpacity 
          onPress={async () => {
            Alert.alert(
              'Sign Out',
              'Are you sure you want to sign out?',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Sign Out',
                  style: 'destructive',
                  onPress: async () => {
                    await logoutUser()
                    navigation.reset({
                      index: 0,
                      routes: [{ name: 'Auth' }],
                    })
                  }
                }
              ]
            )
          }}
          className='mx-4 sm:mx-5 md:mx-6 lg:mx-8 bg-dark-100 rounded-lg sm:rounded-xl md:rounded-2xl py-3 sm:py-4 md:py-5 items-center mb-4 sm:mb-6 md:mb-8 border border-light-300/20'
        >
          <Text className='text-light-200 text-sm sm:text-base md:text-lg font-semibold'>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Avatar Selection Modal */}
      <Modal
        visible={showAvatarModal}
        transparent
        animationType='fade'
        onRequestClose={() => setShowAvatarModal(false)}
      >
        <TouchableOpacity 
          activeOpacity={1}
          onPress={() => setShowAvatarModal(false)}
          className='flex-1 bg-black/80 justify-center items-center'
        >
          <TouchableOpacity 
            activeOpacity={1}
            className='bg-dark-200 rounded-xl sm:rounded-2xl md:rounded-3xl p-4 sm:p-6 md:p-8 mx-4 sm:mx-5 md:mx-6 max-w-md w-full border border-dark-100'
          >
            <Text className='text-white text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-6 md:mb-8 text-center'>Choose Avatar</Text>
            
            <View className='flex-row justify-center gap-4 sm:gap-6 md:gap-8 mb-4 sm:mb-6 md:mb-8'>
              {avatars.map((avatar) => (
                <TouchableOpacity
                  key={avatar.id}
                  onPress={() => handleAvatarChange(avatar)}
                  className={`items-center ${
                    selectedAvatar.id === avatar.id ? 'opacity-100' : 'opacity-50'
                  }`}
                >
                  <Image 
                    source={avatar.image} 
                    className={`w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full ${
                      selectedAvatar.id === avatar.id 
                        ? 'border-4 border-accent' 
                        : 'border-2 border-light-300/20'
                    }`}
                  />
                  <Text className='text-light-300 text-[10px] sm:text-xs md:text-sm mt-1 sm:mt-2'>{ avatar.name}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity 
              onPress={() => setShowAvatarModal(false)}
              className='bg-accent rounded-lg sm:rounded-xl md:rounded-2xl py-2.5 sm:py-3 md:py-4 items-center'
            >
              <Text className='text-secondary text-sm sm:text-base md:text-lg font-semibold'>Done</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* Edit Profile Modal */}
      <Modal
        visible={showEditModal}
        transparent
        animationType='slide'
        onRequestClose={() => setShowEditModal(false)}
      >
        <View className='flex-1 bg-black/80 justify-end'>
          <View className='bg-dark-200 rounded-t-2xl sm:rounded-t-3xl p-4 sm:p-6 md:p-8 border-t border-dark-100'>
            <View className='flex-row justify-between items-center mb-4 sm:mb-6 md:mb-8'>
              <Text className='text-white text-lg sm:text-xl md:text-2xl font-bold'>Edit Profile</Text>
              <TouchableOpacity onPress={() => setShowEditModal(false)}>
                <Text className='text-light-300 text-sm sm:text-base md:text-lg'>Cancel</Text>
              </TouchableOpacity>
            </View>

            <View className='mb-3 sm:mb-4 md:mb-5'>
              <Text className='text-light-300 text-xs sm:text-sm md:text-base mb-1.5 sm:mb-2'>Name</Text>
              <TextInput
                value={editName}
                onChangeText={setEditName}
                placeholder='Enter your name'
                placeholderTextColor='#9CA4AB'
                className='bg-dark-100 text-white text-sm sm:text-base md:text-lg px-3 sm:px-4 md:px-5 py-2.5 sm:py-3 md:py-3.5 rounded-lg sm:rounded-xl md:rounded-2xl border border-light-300/20'
              />
            </View>

            <View className='mb-3 sm:mb-4 md:mb-5'>
              <Text className='text-light-300 text-xs sm:text-sm md:text-base mb-1.5 sm:mb-2'>Username</Text>
              <TextInput
                value={editUsername}
                onChangeText={(text) => {
                  setEditUsername(text.toLowerCase().replace(/[^a-z0-9._]/g, ''))
                  setUsernameError('')
                }}
                onBlur={() => validateUsername(editUsername)}
                placeholder='Enter username'
                placeholderTextColor='#9CA4AB'
                autoCapitalize='none'
                className='bg-dark-100 text-white text-sm sm:text-base md:text-lg px-3 sm:px-4 md:px-5 py-2.5 sm:py-3 md:py-3.5 rounded-lg sm:rounded-xl md:rounded-2xl border border-light-300/20'
              />
              {usernameError ? (
                <Text className='text-red-500 text-[10px] sm:text-xs md:text-sm mt-1'>{usernameError}</Text>
              ) : (
                <Text className='text-light-300 text-[10px] sm:text-xs md:text-sm mt-1'>
                  Only letters, numbers, dots and underscores allowed
                </Text>
              )}
            </View>

            <View className='mb-4 sm:mb-6 md:mb-8'>
              <Text className='text-light-300 text-xs sm:text-sm md:text-base mb-1.5 sm:mb-2'>Email</Text>
              <TextInput
                value={editEmail}
                onChangeText={setEditEmail}
                placeholder='Enter your email'
                placeholderTextColor='#9CA4AB'
                keyboardType='email-address'
                autoCapitalize='none'
                className='bg-dark-100 text-white text-sm sm:text-base md:text-lg px-3 sm:px-4 md:px-5 py-2.5 sm:py-3 md:py-3.5 rounded-lg sm:rounded-xl md:rounded-2xl border border-light-300/20'
              />
            </View>

            <TouchableOpacity
              onPress={handleSaveProfile}
              disabled={saving || !!usernameError}
              className={`rounded-lg sm:rounded-xl md:rounded-2xl py-3 sm:py-4 md:py-5 items-center ${
                saving || usernameError ? 'bg-dark-100' : 'bg-accent'
              }`}
            >
              {saving ? (
                <ActivityIndicator color='#fff' />
              ) : (
                <Text className='text-secondary text-sm sm:text-base md:text-lg font-semibold'>Save Changes</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

export default ProfileScreen

