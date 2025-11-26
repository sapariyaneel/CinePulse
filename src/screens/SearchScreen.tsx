import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, Image, Text, TouchableOpacity, View } from "react-native";

import { icons } from "@/constants/icons";
import { images } from "@/constants/images";

import { fetchMovies } from "@/services/api";
import { updateSearchCount } from "@/services/appwrite";
import useFetch from "@/services/useFetch";
import { addToSearchHistory, clearSearchHistory, getSearchHistory, removeFromSearchHistory, SearchHistoryItem } from "@/services/searchHistoryService";

import MovieCard from "@/components/MovieCard";
import SearchBar from "@/components/SearchBar";

const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(true);

  const {
    data: movies = [],
    loading,
    error,
    refetch: loadMovies,
    reset,
  } = useFetch(() => fetchMovies({ query: searchQuery }), false);

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
        className="px-5"
        data={movies as Movie[]}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <MovieCard movie={item} />}
        numColumns={3}
        columnWrapperStyle={{
          justifyContent: "flex-start",
          gap: 16,
          marginVertical: 16,
        }}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListHeaderComponent={
          <>
            <View className="w-full flex-row justify-center mt-20 items-center">
              <Image source={icons.logo} className="w-12 h-10" />
            </View>

            <View className="my-5">
              <SearchBar
                placeholder="Search for a movie"
                value={searchQuery}
                onChangeText={handleSearch}
              />
            </View>

            {loading && (
              <ActivityIndicator
                size="large"
                color="#0000ff"
                className="my-3"
              />
            )}

            {error && (
              <Text className="text-red-500 px-5 my-3">
                Error: {error.message}
              </Text>
            )}

            {!loading &&
              !error &&
              searchQuery.trim() &&
              movies?.length! > 0 && (
                <Text className="text-xl text-white font-bold">
                  Search Results for{" "}
                  <Text className="text-accent">{searchQuery}</Text>
                </Text>
              )}

            {/* Search History */}
            {showHistory && searchHistory.length > 0 && !searchQuery.trim() && (
              <View className="mb-4">
                <View className="flex-row justify-between items-center mb-3">
                  <Text className="text-white text-lg font-bold">Recent Searches</Text>
                  <TouchableOpacity onPress={handleClearAllHistory}>
                    <Text className="text-accent text-sm font-semibold">Clear All</Text>
                  </TouchableOpacity>
                </View>
                {searchHistory.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleSelectHistory(item.query)}
                    className="flex-row items-center justify-between py-3 border-b border-dark-100"
                  >
                    <View className="flex-row items-center flex-1">
                      <Image
                        source={icons.search}
                        className="w-4 h-4 mr-3"
                        tintColor="#9CA4AB"
                      />
                      <Text className="text-white text-base flex-1">{item.query}</Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => handleRemoveHistory(item.query)}
                      className="p-2"
                    >
                      <Text className="text-light-300 text-lg">×</Text>
                    </TouchableOpacity>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </>
        }
        ListEmptyComponent={
          !loading && !error ? (
            <View className="mt-10 px-5">
              <Text className="text-center text-gray-500">
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
