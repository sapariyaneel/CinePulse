import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Image,
} from 'react-native';
import { icons } from '@/constants/icons';
import {
  getWatchlistCategories,
  addToWatchlist,
  getMovieWatchlistCategories,
  removeFromWatchlist,
  getWatchlistItems,
} from '@/services/watchlistService';

interface CategoryModalProps {
  visible: boolean;
  onClose: () => void;
  movie: Movie | MovieDetails | null;
  onSuccess?: () => void;
}

const CategoryModal: React.FC<CategoryModalProps> = ({
  visible,
  onClose,
  movie,
  onSuccess,
}) => {
  const [categories, setCategories] = useState<WatchlistCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [initialCategory, setInitialCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (visible && movie) {
      loadCategories();
    }
  }, [visible, movie]);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const allCategories = await getWatchlistCategories();
      setCategories(allCategories);

      if (movie) {
        const movieCategories = await getMovieWatchlistCategories(movie.id);
        const currentCategory = movieCategories.length > 0 ? movieCategories[0].id : null;
        setSelectedCategory(currentCategory);
        setInitialCategory(currentCategory);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCategory = (categoryId: string) => {
    // Only allow selecting ONE category at a time
    if (selectedCategory === categoryId) {
      setSelectedCategory(null); // Deselect if clicking the same category
    } else {
      setSelectedCategory(categoryId);
    }
  };

  const handleDone = async () => {
    if (!movie) return;

    try {
      setSaving(true);

      // Remove from old category if it exists
      if (initialCategory) {
        const items = await getWatchlistItems(initialCategory);
        const item = items.find((i) => i.movieId === movie.id);
        if (item) {
          await removeFromWatchlist(item.id);
        }
      }

      // Add to new category if selected
      if (selectedCategory) {
        await addToWatchlist(movie, selectedCategory);
      }

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Error saving to watchlist:', error);
    } finally {
      setSaving(false);
    }
  };

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
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <TouchableOpacity 
        activeOpacity={1} 
        onPress={onClose}
        className="flex-1 bg-black/80 justify-end"
      >
        <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
          <View className="bg-dark-200 rounded-t-3xl">
            {/* Header */}
            <View className="flex-row items-center justify-between p-6 pb-4 border-b border-dark-100">
              <View className="flex-1">
                <Text className="text-white text-2xl font-bold">Add to List</Text>
                <Text className="text-light-300 text-sm mt-1" numberOfLines={1}>
                  {movie?.title}
                </Text>
              </View>
              <TouchableOpacity
                onPress={onClose}
                className="w-10 h-10 rounded-full bg-dark-100 items-center justify-center border border-light-300/20 ml-3"
              >
                <Text className="text-white text-xl">×</Text>
              </TouchableOpacity>
            </View>

          {/* Categories List */}
          {loading ? (
            <View className="py-20 items-center">
              <ActivityIndicator size="large" color="#AB8BFF" />
            </View>
          ) : (
            <ScrollView 
              showsVerticalScrollIndicator={false}
              className="px-6"
              style={{ maxHeight: 400 }}
              contentContainerStyle={{ paddingVertical: 16 }}
            >
              {categories.map((category) => {
                const isSelected = selectedCategory === category.id;
                return (
                  <TouchableOpacity
                    key={category.id}
                    onPress={() => handleSelectCategory(category.id)}
                    disabled={saving}
                    className={`flex-row items-center justify-between p-4 rounded-2xl mb-3 border ${
                      isSelected
                        ? 'bg-accent/20 border-accent'
                        : 'bg-dark-100 border-light-300/20'
                    }`}
                  >
                    <View className="flex-row items-center flex-1">
                      <View
                        className="w-12 h-12 rounded-full items-center justify-center mr-4"
                        style={{ backgroundColor: category.color + '30' }}
                      >
                        <Image
                          source={getCategoryIcon(category.icon)}
                          className="size-6"
                          tintColor={category.color}
                        />
                      </View>
                      <View className="flex-1">
                        <Text className="text-white text-base font-semibold">
                          {category.name}
                        </Text>
                        {category.description && (
                          <Text className="text-light-300 text-xs mt-0.5">
                            {category.description}
                          </Text>
                        )}
                        <Text className="text-light-300 text-xs mt-1">
                          {category.itemCount || 0} items
                        </Text>
                      </View>
                    </View>

                    {/* Checkmark */}
                    {isSelected && (
                      <View className="w-6 h-6 rounded-full bg-accent items-center justify-center">
                        <Text className="text-secondary text-sm font-bold">✓</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}

              {categories.length === 0 && (
                <View className="py-10 items-center">
                  <Text className="text-light-300 text-center">
                    No categories found. Please run the database migration first.
                  </Text>
                </View>
              )}
            </ScrollView>
          )}

          {/* Footer with Done Button */}
          <View className="p-6 pt-4 border-t border-dark-100">
            <TouchableOpacity
              onPress={handleDone}
              className="bg-accent rounded-xl py-4 items-center"
              disabled={saving || !selectedCategory}
              style={{ opacity: saving || !selectedCategory ? 0.5 : 1 }}
            >
              {saving ? (
                <ActivityIndicator color="#151312" />
              ) : (
                <Text className="text-secondary text-base font-semibold">
                  Done
                </Text>
              )}
            </TouchableOpacity>
          </View>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

export default CategoryModal;
