import { useNavigation } from "@react-navigation/native";
import type { TabNavigationProp } from "@/navigation/types";
import React, { useState, useEffect } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  View,
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

const HomeScreen = () => {
  const navigation = useNavigation<TabNavigationProp>();
  const [refreshing, setRefreshing] = useState(false);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);

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

  return (
    <View className="flex-1 bg-primary">
      <Image
        source={images.bg}
        className="absolute w-full h-full z-0"
        resizeMode="cover"
      />

      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ minHeight: "100%", paddingBottom: 10 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#AB8BFF"
            colors={["#AB8BFF"]}
          />
        }
      >
        <Image source={icons.logo} className="w-12 h-10 mt-20 mb-5 mx-auto" />

        {moviesLoading || trendingLoading ? (
          <ActivityIndicator
            size="large"
            color="#0000ff"
            className="mt-10 self-center"
          />
        ) : moviesError || trendingError ? (
          <Text>Error: {moviesError?.message || trendingError?.message}</Text>
        ) : (
          <View className="flex-1 mt-5">
            <SearchBar
              onPress={() => {
                navigation.navigate("Search");
              }}
              placeholder="Search for a movie"
            />

            {trendingMovies && trendingMovies.length > 0 ? (
              <View className="mt-10">
                <Text className="text-lg text-white font-bold mb-3">
                  Trending Movies
                </Text>
                <FlatList
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  className="mb-4 mt-3"
                  data={trendingMovies}
                  contentContainerStyle={{
                    gap: 26,
                  }}
                  renderItem={({ item, index }) => (
                    <TrendingCard movie={item} index={index} />
                  )}
                  keyExtractor={(item, index) => `${item.movie_id}-${index}`}
                  ItemSeparatorComponent={() => <View className="w-4" />}
                />
              </View>
            ) : (
              <View className="mt-10">
                <Text className="text-light-300 text-sm text-center">
                  No trending movies yet. Browse and view movies to see trending!
                </Text>
              </View>
            )}

            {/* Personalized Recommendations */}
            {recommendations && recommendations.length > 0 && (
              <View className="mt-10">
                <Text className="text-lg text-white font-bold mb-3">
                  Recommended For You
                </Text>
                <FlatList
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  className="mb-4 mt-3"
                  data={recommendations}
                  renderItem={({ item }) => <RecommendationCard movie={item} />}
                  keyExtractor={(item) => item.id.toString()}
                />
              </View>
            )}

            <>
              <Text className="text-lg text-white font-bold mt-5 mb-3">
                Latest Movies
              </Text>

              <FlatList
                data={movies}
                renderItem={({ item }) => <MovieCard movie={item} />}
                keyExtractor={(item) => item.id.toString()}
                numColumns={3}
                columnWrapperStyle={{
                  justifyContent: "flex-start",
                  gap: 20,
                  paddingRight: 5,
                  marginBottom: 10,
                }}
                className="mt-2 pb-32"
                scrollEnabled={false}
              />
            </>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default HomeScreen;
