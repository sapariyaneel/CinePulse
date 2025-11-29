import { useNavigation } from "@react-navigation/native";
import type { TabNavigationProp } from "@/navigation/types";
import React, { useState, useEffect, useMemo } from "react";
import {
  FlatList,
  Image,
  RefreshControl,
  ScrollView,
  StatusBar,
  Text,
  View,
  useWindowDimensions,
} from "react-native";

import { fetchMovies } from "@/services/api";
import { getTrendingMovies } from "@/services/trendingService";
import { getHomeRecommendations } from "@/services/recommendationService";
import { getCurrentUserId } from "@/services/authService";
import useFetch from "@/services/useFetch";

import { icons } from "@/constants/icons";
import { images } from "@/constants/images";

import MovieCard from "@/components/MovieCard";
import SearchBar from "@/components/SearchBar";
import TrendingCard from "@/components/TrendingCard";
import RecommendationCard from "@/components/RecommendationCard";
import SkeletonLoader from "@/components/SkeletonLoader";

const HomeScreen = () => {
  const navigation = useNavigation<TabNavigationProp>();
  const { width, height } = useWindowDimensions();
  const [refreshing, setRefreshing] = useState(false);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);
  const [showStatusBar, setShowStatusBar] = useState(false);

  // Calculate number of columns based on screen width
  const numColumns = useMemo(() => {
    if (width < 360) return 2; // Small phones
    if (width < 600) return 3; // Standard phones
    if (width < 900) return 4; // Large phones/small tablets
    return 5; // Tablets and larger
  }, [width]);

  // Check if landscape mode
  const isLandscape = width > height;

  const {
    data: trendingMovies,
    loading: trendingLoading,
    error: trendingError,
    refetch: refetchTrending,
  } = useFetch(getTrendingMovies);

  const {
    data: movies,
    loading: moviesLoading,
    error: moviesError,
    refetch: refetchMovies,
  } = useFetch(() => fetchMovies({ query: "" }));

  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    try {
      setLoadingRecommendations(true);
      const userId = await getCurrentUserId();
      const recs = await getHomeRecommendations(userId || undefined);
      setRecommendations(recs);
    } catch (error) {
      console.error('Error loading recommendations:', error);
    } finally {
      setLoadingRecommendations(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refetchTrending(), refetchMovies(), loadRecommendations()]);
    setRefreshing(false);
  };

  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setShowStatusBar(offsetY > 50);
  };

  return (
    <View className="flex-1 bg-primary">
      <StatusBar translucent backgroundColor="transparent" hidden={!showStatusBar} barStyle="light-content" />
      <Image
        source={images.bg}
        className="absolute w-full h-full z-0"
        resizeMode="cover"
      />

      <ScrollView
        className="flex-1 px-3 sm:px-4 md:px-6 lg:px-8"
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-4 sm:pb-6 md:pb-8"
        onScroll={handleScroll}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#AB8BFF"
            colors={["#AB8BFF"]}
          />
        }
      >
        <Image 
          source={icons.logo} 
          className="w-10 h-8 sm:w-12 sm:h-10 md:w-14 md:h-12 lg:w-16 lg:h-14 mt-12 sm:mt-16 md:mt-20 mb-4 sm:mb-5 md:mb-6 mx-auto" 
        />

        {(moviesLoading || trendingLoading) && !movies && !trendingMovies ? (
          <SkeletonLoader numColumns={numColumns} />
        ) : moviesError || trendingError ? (
          <Text className="text-light-200 text-sm sm:text-base md:text-lg text-center mt-8 px-4">
            Error: {moviesError?.message || trendingError?.message}
          </Text>
        ) : (
          <View className="flex-1 mt-3 sm:mt-4 md:mt-5">
            <SearchBar
              onPress={() => {
                navigation.navigate("Search");
              }}
              placeholder="Search for a movie"
            />

            {trendingMovies && trendingMovies.length > 0 ? (
              <View className="mt-6 sm:mt-8 md:mt-10">
                <Text className="text-base sm:text-lg md:text-xl lg:text-2xl text-white font-bold mb-2 sm:mb-3 md:mb-4">
                  Trending Movies
                </Text>
                <FlatList
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  className="mt-2 sm:mt-3 md:mt-4"
                  data={trendingMovies}
                  contentContainerClassName="gap-4 sm:gap-5 md:gap-6 lg:gap-8"
                  renderItem={({ item, index }) => (
                    <TrendingCard movie={item} index={index} />
                  )}
                  keyExtractor={(item, index) => `${item.movie_id}-${index}`}
                />
              </View>
            ) : (
              <View className="mt-6 sm:mt-8 md:mt-10 px-4">
                <Text className="text-light-300 text-xs sm:text-sm md:text-base text-center">
                  No trending movies yet. Browse and view movies to see trending!
                </Text>
              </View>
            )}

            {/* Personalized Recommendations */}
            {recommendations && recommendations.length > 0 && (
              <View className="mt-6 sm:mt-8 md:mt-10">
                <Text className="text-base sm:text-lg md:text-xl lg:text-2xl text-white font-bold mb-2 sm:mb-3 md:mb-4">
                  Recommended For You
                </Text>
                <FlatList
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  className="mt-2 sm:mt-3 md:mt-4"
                  data={recommendations}
                  contentContainerClassName="gap-3 sm:gap-4 md:gap-5"
                  renderItem={({ item }) => <RecommendationCard movie={item} />}
                  keyExtractor={(item) => item.id.toString()}
                />
              </View>
            )}

            <View className="items-center">
              <Text className="text-base sm:text-lg md:text-xl lg:text-2xl text-white font-bold mt-4 sm:mt-5 md:mt-6 mb-2 sm:mb-3 md:mb-4 self-start">
                Latest Movies
              </Text>

              <View className="w-full items-center">
                <FlatList
                  data={movies}
                  renderItem={({ item }) => <MovieCard movie={item} numColumns={numColumns} />}
                  keyExtractor={(item) => item.id.toString()}
                  key={numColumns}
                  numColumns={numColumns}
                  contentContainerClassName="gap-y-3 sm:gap-y-4 md:gap-y-5 pb-24 sm:pb-28 md:pb-32"
                  columnWrapperClassName="gap-x-2 sm:gap-x-3 md:gap-x-4 lg:gap-x-5 justify-center"
                  className="mt-2"
                  scrollEnabled={false}
                />
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default HomeScreen;
