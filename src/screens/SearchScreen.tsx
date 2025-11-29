import { useEffect, useState, useMemo } from "react";
import { Alert, FlatList, Image, Text, TouchableOpacity, View, useWindowDimensions } from "react-native";
import { X } from 'lucide-react-native';

import { icons } from "@/constants/icons";
import { images } from "@/constants/images";

import { fetchMovies } from "@/services/api";
import { updateSearchCount } from "@/services/appwrite";
import useFetch from "@/services/useFetch";
import { addToSearchHistory, clearSearchHistory, getSearchHistory, removeFromSearchHistory, SearchHistoryItem } from "@/services/searchHistoryService";

import MovieCard from "@/components/MovieCard";
import SearchBar from "@/components/SearchBar";
import SearchScreenSkeleton from "@/components/SearchScreenSkeleton";

const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(true);
  const { width } = useWindowDimensions();

  const {
    data: movies = [],
    loading,
    error,
    refetch: loadMovies,
    reset,
  } = useFetch(() => fetchMovies({ query: searchQuery }), false);

  // Calculate dynamic number of columns based on screen width
  const numColumns = useMemo(() => {
    if (width < 360) return 2;        // Small phones: 2 columns
    if (width < 600) return 3;        // Standard phones: 3 columns
    if (width < 900) return 4;        // Large phones/small tablets: 4 columns
    if (width < 1200) return 5;       // Tablets: 5 columns
    return 6;                         // Large tablets: 6 columns
  }, [width]);

  // Calculate dynamic icon size for X button
  const iconSize = useMemo(() => {
    if (width < 360) return 16;
    if (width < 600) return 18;
    if (width < 900) return 20;
    return 22;
  }, [width]);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    setShowHistory(text.length === 0);
  };

  const loadSearchHistory = async () => {
    const history = await getSearchHistory();
    setSearchHistory(history);
  };

  const handleSelectHistory = (query: string) => {
    setSearchQuery(query);
    setShowHistory(false);
  };

  const handleRemoveHistory = async (query: string) => {
    await removeFromSearchHistory(query);
    await loadSearchHistory();
  };

  const handleClearAllHistory = () => {
    Alert.alert(
      'Clear Search History',
      'Are you sure you want to clear all search history?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            await clearSearchHistory();
            await loadSearchHistory();
          }
        }
      ]
    );
  };

  // Load search history on mount
  useEffect(() => {
    loadSearchHistory();
  }, []);

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (searchQuery.trim()) {
        await loadMovies();

        // Add to search history
        await addToSearchHistory(searchQuery);
        await loadSearchHistory();

        // Call updateSearchCount only if there are results
        if (movies?.length! > 0 && movies?.[0]) {
          await updateSearchCount(searchQuery, movies[0]);
        }
      } else {
        reset();
        setShowHistory(true);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  return (
    <View className="flex-1 bg-primary">
      <Image
        source={images.bg}
        className="absolute w-full h-full z-0"
        resizeMode="cover"
      />

      <FlatList
        className="px-3 sm:px-4 md:px-6 lg:px-8"
        data={movies as Movie[]}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <MovieCard movie={item} numColumns={numColumns} />}
        key={numColumns} // Force re-render when columns change
        numColumns={numColumns}
        contentContainerClassName="pb-20 sm:pb-24 md:pb-28 lg:pb-32"
        columnWrapperClassName="gap-2 sm:gap-3 md:gap-4 lg:gap-5 mb-3 sm:mb-4 md:mb-5 lg:mb-6"
        ListHeaderComponent={
          <>
            {/* Logo Header */}
            <View className="w-full flex-row justify-center mt-12 sm:mt-14 md:mt-16 lg:mt-20 items-center mb-4 sm:mb-5 md:mb-6">
              <Image 
                source={icons.logo} 
                className="w-10 h-8 sm:w-12 sm:h-10 md:w-14 md:h-12 lg:w-16 lg:h-14" 
                resizeMode="contain"
              />
            </View>

            {/* Search Bar */}
            <View className="mb-4 sm:mb-5 md:mb-6 lg:mb-8">
              <SearchBar
                placeholder="Search for a movie"
                value={searchQuery}
                onChangeText={handleSearch}
              />
            </View>

            {/* Loading Indicator */}
            {loading && searchQuery.trim() && (!movies || movies.length === 0) && (
              <SearchScreenSkeleton numColumns={numColumns} />
            )}

            {/* Error Message */}
            {error && (
              <Text className="text-red-500 text-sm sm:text-base md:text-lg my-3 sm:my-4 md:my-5 text-center">
                Error: {error.message}
              </Text>
            )}

            {/* Search Results Header */}
            {!loading &&
              !error &&
              searchQuery.trim() &&
              movies?.length! > 0 && (
                <Text className="text-base sm:text-lg md:text-xl lg:text-2xl text-white font-bold mb-3 sm:mb-4 md:mb-5">
                  Search Results for{" "}
                  <Text className="text-accent">{searchQuery}</Text>
                </Text>
              )}

            {/* Search History */}
            {showHistory && searchHistory.length > 0 && !searchQuery.trim() && (
              <View className="mb-4 sm:mb-5 md:mb-6">
                {/* History Header */}
                <View className="flex-row justify-between items-center mb-3 sm:mb-4 md:mb-5">
                  <Text className="text-white text-base sm:text-lg md:text-xl lg:text-2xl font-bold">
                    Recent Searches
                  </Text>
                  <TouchableOpacity 
                    onPress={handleClearAllHistory}
                    className="px-2 sm:px-3 py-1 sm:py-1.5"
                  >
                    <Text className="text-accent text-xs sm:text-sm md:text-base font-semibold">
                      Clear All
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* History Items */}
                {searchHistory.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleSelectHistory(item.query)}
                    className="flex-row items-center justify-between py-2.5 sm:py-3 md:py-3.5 lg:py-4 border-b border-dark-100"
                    activeOpacity={0.7}
                  >
                    <View className="flex-row items-center flex-1">
                      <Image
                        source={icons.search}
                        className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 mr-2 sm:mr-2.5 md:mr-3"
                        tintColor="#9CA4AB"
                        resizeMode="contain"
                      />
                      <Text 
                        className="text-white text-sm sm:text-base md:text-lg flex-1" 
                        numberOfLines={1}
                      >
                        {item.query}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => handleRemoveHistory(item.query)}
                      className="p-1.5 sm:p-2 md:p-2.5 ml-2"
                      activeOpacity={0.7}
                    >
                      <X size={iconSize} color="#9CA4AB" />
                    </TouchableOpacity>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </>
        }
        ListEmptyComponent={
          !loading && !error ? (
            <View className="mt-8 sm:mt-10 md:mt-12 lg:mt-16 px-4 sm:px-6 md:px-8">
              <Text className="text-center text-gray-400 text-sm sm:text-base md:text-lg">
                {searchQuery.trim()
                  ? "No movies found"
                  : "Start typing to search for movies"}
              </Text>
            </View>
          ) : null
        }
      />
    </View>
  );
};

export default SearchScreen;
