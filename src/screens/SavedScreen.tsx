import { icons } from '@/constants/icons'
import { images } from '@/constants/images'
import { canSaveMovies } from '@/services/authService'
import { getWatchlistCategories, getWatchlistItems } from '@/services/watchlistService'
import { useFocusEffect } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import type { TabNavigationProp } from '@/navigation/types';
import React, { useCallback, useState } from 'react'
import { ActivityIndicator, FlatList, Image, Text, TouchableOpacity, View, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import WatchlistCard from '@/components/WatchlistCard'

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
      className={`px-5 py-2.5 rounded-full mr-3 border ${
        active 
          ? 'border-accent' 
          : 'bg-dark-100 border-light-300/20'
      }`}
      style={active ? { backgroundColor: category.color + '30' } : {}}
    >
      <View className="flex-row items-center">
        <Image 
          source={getCategoryIcon(category.icon)} 
          className="size-4 mr-2" 
          tintColor={active ? category.color : '#A8B5DB'} 
        />
        <Text 
          className={`text-sm font-semibold`}
          style={{ color: active ? category.color : '#E8ECF4' }}
        >
          {category.name}
        </Text>
        <View 
          className="ml-2 px-2 py-0.5 rounded-full"
          style={{ backgroundColor: active ? category.color + '40' : '#1F2937' }}
        >
          <Text 
            className="text-xs font-bold"
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
  const [categories, setCategories] = useState<WatchlistCategory[]>([])
  const [watchlistItems, setWatchlistItems] = useState<WatchlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

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
        <View className='px-5 pt-5 pb-4'>
          <View className='flex-row items-center justify-between mb-6'>
            <View>
              <Text className='text-white text-3xl font-bold'>My Watchlist</Text>
              <Text className='text-light-300 text-sm mt-1'>
                {totalItems} {totalItems === 1 ? 'movie' : 'movies'} • {categories.length} {categories.length === 1 ? 'list' : 'lists'}
              </Text>
            </View>
            <TouchableOpacity 
              onPress={() => navigation.navigate('Home')}
              className='w-10 h-10 rounded-full bg-dark-100 items-center justify-center border border-light-300/20'
            >
              <Image source={icons.search} className='size-5' tintColor='#A8B5DB' />
            </TouchableOpacity>
          </View>

          {/* Category Chips */}
          {categories.length > 0 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 8 }}
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
        {loading ? (
          <View className='flex-1 items-center justify-center'>
            <ActivityIndicator size='large' color='#AB8BFF' />
          </View>
        ) : !isAuthenticated ? (
          <View className='flex-1 items-center justify-center px-10'>
            <View className='w-24 h-24 rounded-full bg-dark-100 items-center justify-center mb-6 border border-light-300/20'>
              <Image source={icons.save} className='size-12' tintColor='#A8B5DB' />
            </View>
            <Text className='text-white text-xl font-bold text-center mb-2'>Login Required</Text>
            <Text className='text-light-300 text-sm text-center mb-8'>
              Please login or sign up to organize your favorite movies
            </Text>
            <TouchableOpacity 
              onPress={() => navigation.navigate('Auth')}
              className='bg-accent px-8 py-3 rounded-full'
            >
              <Text className='text-secondary text-base font-semibold'>Login / Sign Up</Text>
            </TouchableOpacity>
          </View>
        ) : categories.length === 0 ? (
          <View className='flex-1 items-center justify-center px-10'>
            <View className='w-24 h-24 rounded-full bg-dark-100 items-center justify-center mb-6 border border-light-300/20'>
              <Image source={icons.save} className='size-12' tintColor='#A8B5DB' />
            </View>
            <Text className='text-white text-xl font-bold text-center mb-2'>Setup Required</Text>
            <Text className='text-light-300 text-sm text-center mb-8'>
              Please run the database migration to enable watchlist categories
            </Text>
          </View>
        ) : watchlistItems.length > 0 ? (
          <FlatList
            className='px-5'
            data={watchlistItems}
            renderItem={({ item }) => (
              <WatchlistCard 
                item={item} 
                onLongPress={() => loadWatchlist()}
              />
            )}
            keyExtractor={(item) => item.id}
            numColumns={3}
            columnWrapperStyle={{
              justifyContent: 'flex-start',
              gap: 10,
            }}
            contentContainerStyle={{ paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View className='flex-1 items-center justify-center px-10'>
            <View className='w-24 h-24 rounded-full bg-dark-100 items-center justify-center mb-6 border border-light-300/20'>
              <Image source={icons.save} className='size-12' tintColor='#A8B5DB' />
            </View>
            <Text className='text-white text-xl font-bold text-center mb-2'>
              {activeCategory ? 'No Movies in This List' : 'No Movies Yet'}
            </Text>
            <Text className='text-light-300 text-sm text-center mb-8'>
              {activeCategory 
                ? 'Start adding movies to this category' 
                : 'Start building your collection by adding movies to your watchlist'}
            </Text>
            <TouchableOpacity 
              onPress={() => navigation.navigate('Home')}
              className='bg-accent px-8 py-3 rounded-full'
            >
              <Text className='text-secondary text-base font-semibold'>Browse Movies</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  )
}

export default SavedScreen

