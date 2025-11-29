import { icons } from '@/constants/icons'
import { images } from '@/constants/images'
import { canSaveMovies } from '@/services/authService'
import { getWatchlistCategories, getWatchlistItems } from '@/services/watchlistService'
import { useFocusEffect } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import type { TabNavigationProp } from '@/navigation/types';
import React, { useCallback, useState } from 'react'
import { FlatList, Image, Text, TouchableOpacity, View, ScrollView, useWindowDimensions } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import WatchlistCard from '@/components/WatchlistCard'
import WatchlistSkeleton from '@/components/WatchlistSkeleton'

interface CategoryChipProps {
  category: WatchlistCategory;
  active: boolean;
  onPress: () => void;
}

const CategoryChip: React.FC<CategoryChipProps> = ({ category, active, onPress }) => {
  const getCategoryIcon = (icon: string) => {
    switch (icon) {
      case 'play':
        return icons.play;
      case 'star':
        return icons.star;
      default:
        return icons.save;
    }
  };

  return (
    <TouchableOpacity 
      onPress={onPress}
      className={`px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 rounded-full mr-2 sm:mr-3 border ${
        active 
          ? 'border-accent' 
          : 'bg-dark-100 border-light-300/20'
      }`}
      style={active ? { backgroundColor: category.color + '30' } : {}}
    >
      <View className="flex-row items-center">
        <Image 
          source={getCategoryIcon(category.icon)} 
          className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 mr-1.5 sm:mr-2" 
          tintColor={active ? category.color : '#A8B5DB'} 
        />
        <Text 
          className="text-xs sm:text-sm md:text-base font-semibold"
          style={{ color: active ? category.color : '#E8ECF4' }}
        >
          {category.name}
        </Text>
        <View 
          className="ml-1.5 sm:ml-2 px-1.5 sm:px-2 py-0.5 rounded-full"
          style={{ backgroundColor: active ? category.color + '40' : '#1F2937' }}
        >
          <Text 
            className="text-[10px] sm:text-xs md:text-sm font-bold"
            style={{ color: active ? category.color : '#A8B5DB' }}
          >
            {category.itemCount || 0}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const SavedScreen = () => {
  const navigation = useNavigation<TabNavigationProp>()
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const [categories, setCategories] = useState<WatchlistCategory[]>([])
  const [watchlistItems, setWatchlistItems] = useState<WatchlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const [initialLoad, setInitialLoad] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  
  // Calculate responsive column count
  const getColumnCount = () => {
    if (width >= 900) return isLandscape ? 6 : 5; // Large tablets
    if (width >= 600) return isLandscape ? 5 : 4; // Tablets
    if (width >= 400) return isLandscape ? 4 : 3; // Large phones
    return isLandscape ? 3 : 3; // Standard/small phones
  };
  
  const numColumns = getColumnCount();

  const loadWatchlist = async () => {
    try {
      setLoading(true)
      
      // Check if user can save movies (authenticated, not guest)
      const canSave = await canSaveMovies()
      setIsAuthenticated(canSave)
      
      if (canSave) {
        const userCategories = await getWatchlistCategories()
        setCategories(userCategories)
        
        // Load all items initially
        const items = await getWatchlistItems()
        setWatchlistItems(items)
      }
    } catch (error) {
      console.error('Error loading watchlist:', error)
    } finally {
      setLoading(false)
      setInitialLoad(false)
    }
  }

  const loadCategoryItems = async (categoryId: string | null) => {
    try {
      setLoading(true)
      const items = categoryId 
        ? await getWatchlistItems(categoryId)
        : await getWatchlistItems()
      setWatchlistItems(items)
    } catch (error) {
      console.error('Error loading category items:', error)
    } finally {
      setLoading(false)
    }
  }

  useFocusEffect(
    useCallback(() => {
      loadWatchlist()
    }, [])
  )

  const handleCategoryPress = (categoryId: string) => {
    if (activeCategory === categoryId) {
      setActiveCategory(null)
      loadCategoryItems(null)
    } else {
      setActiveCategory(categoryId)
      loadCategoryItems(categoryId)
    }
  }

  const totalItems = categories.reduce((sum, cat) => sum + (cat.itemCount || 0), 0)

  return (
    <SafeAreaView className='bg-primary flex-1'>
      <Image
        source={images.bg}
        className='absolute w-full h-full z-0'
        resizeMode='cover'
      />
      
      <View className='flex-1'>
        {/* Header */}
        <View className='px-4 sm:px-5 md:px-6 lg:px-8 pt-4 sm:pt-5 md:pt-6 pb-3 sm:pb-4'>
          <View className='flex-row items-center justify-between mb-4 sm:mb-5 md:mb-6'>
            <View className='flex-1 mr-3'>
              <Text className='text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold'>My Watchlist</Text>
              <Text className='text-light-300 text-xs sm:text-sm md:text-base mt-1 sm:mt-1.5'>
                {totalItems} {totalItems === 1 ? 'movie' : 'movies'} • {categories.length} {categories.length === 1 ? 'list' : 'lists'}
              </Text>
            </View>
            <TouchableOpacity 
              onPress={() => navigation.navigate('Home')}
              className='w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-dark-100 items-center justify-center border border-light-300/20'
            >
              <Image source={icons.search} className='w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6' tintColor='#A8B5DB' />
            </TouchableOpacity>
          </View>

          {/* Category Chips */}
          {categories.length > 0 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: isLandscape ? 6 : 8 }}
            >
              {categories.map((category) => (
                <CategoryChip
                  key={category.id}
                  category={category}
                  active={activeCategory === category.id}
                  onPress={() => handleCategoryPress(category.id)}
                />
              ))}
            </ScrollView>
          )}
        </View>

        {/* Watchlist Items Grid */}
        {loading && initialLoad ? (
          <WatchlistSkeleton numColumns={numColumns} />
        ) : !isAuthenticated ? (
          <View className='flex-1 items-center justify-center px-6 sm:px-8 md:px-10'>
            <View className='w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full bg-dark-100 items-center justify-center mb-4 sm:mb-5 md:mb-6 border border-light-300/20'>
              <Image source={icons.save} className='w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14' tintColor='#A8B5DB' />
            </View>
            <Text className='text-white text-lg sm:text-xl md:text-2xl font-bold text-center mb-2 sm:mb-2.5'>Login Required</Text>
            <Text className='text-light-300 text-xs sm:text-sm md:text-base text-center mb-6 sm:mb-7 md:mb-8'>
              Please login or sign up to organize your favorite movies
            </Text>
            <TouchableOpacity 
              onPress={() => navigation.navigate('Auth')}
              className='bg-accent px-6 sm:px-8 md:px-10 py-2.5 sm:py-3 md:py-3.5 rounded-full'
            >
              <Text className='text-secondary text-sm sm:text-base md:text-lg font-semibold'>Login / Sign Up</Text>
            </TouchableOpacity>
          </View>
        ) : categories.length === 0 ? (
          <View className='flex-1 items-center justify-center px-6 sm:px-8 md:px-10'>
            <View className='w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full bg-dark-100 items-center justify-center mb-4 sm:mb-5 md:mb-6 border border-light-300/20'>
              <Image source={icons.save} className='w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14' tintColor='#A8B5DB' />
            </View>
            <Text className='text-white text-lg sm:text-xl md:text-2xl font-bold text-center mb-2 sm:mb-2.5'>Setup Required</Text>
            <Text className='text-light-300 text-xs sm:text-sm md:text-base text-center mb-6 sm:mb-7 md:mb-8'>
              Please run the database migration to enable watchlist categories
            </Text>
          </View>
        ) : watchlistItems.length > 0 ? (
          <FlatList
            key={`grid-${numColumns}`}
            className='px-3 sm:px-4 md:px-5 lg:px-6'
            data={watchlistItems}
            renderItem={({ item }) => (
              <WatchlistCard 
                item={item} 
                onLongPress={() => loadWatchlist()}
                numColumns={numColumns}
              />
            )}
            keyExtractor={(item) => item.id}
            numColumns={numColumns}
            columnWrapperStyle={{
              justifyContent: 'flex-start',
              gap: width >= 600 ? 12 : 8,
            }}
            contentContainerStyle={{ paddingBottom: isLandscape ? 80 : 100 }}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View className='flex-1 items-center justify-center px-6 sm:px-8 md:px-10'>
            <View className='w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full bg-dark-100 items-center justify-center mb-4 sm:mb-5 md:mb-6 border border-light-300/20'>
              <Image source={icons.save} className='w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14' tintColor='#A8B5DB' />
            </View>
            <Text className='text-white text-lg sm:text-xl md:text-2xl font-bold text-center mb-2 sm:mb-2.5'>
              {activeCategory ? 'No Movies in This List' : 'No Movies Yet'}
            </Text>
            <Text className='text-light-300 text-xs sm:text-sm md:text-base text-center mb-6 sm:mb-7 md:mb-8'>
              {activeCategory 
                ? 'Start adding movies to this category' 
                : 'Start building your collection by adding movies to your watchlist'}
            </Text>
            <TouchableOpacity 
              onPress={() => navigation.navigate('Home')}
              className='bg-accent px-6 sm:px-8 md:px-10 py-2.5 sm:py-3 md:py-3.5 rounded-full'
            >
              <Text className='text-secondary text-sm sm:text-base md:text-lg font-semibold'>Browse Movies</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  )
}

export default SavedScreen

