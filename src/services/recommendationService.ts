import { supabase } from './supabase';
import { fetchMovieDetails } from './api';
import { MOVIE_API_KEY } from '@env';

const TMDB_API_KEY = MOVIE_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export interface GenrePreference {
  genreId: number;
  genreName: string;
  count: number;
  averageRating: number;
}

export interface RecommendedMovie {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
  genre_ids: number[];
  reason: string; // Why this movie is recommended
}

// Genre ID to name mapping (TMDB standard)
const GENRE_MAP: { [key: number]: string } = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Science Fiction',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western',
};

// Get user's genre preferences based on watchlist and reviews
export const getUserGenrePreferences = async (userId: string): Promise<GenrePreference[]> => {
  try {
    // Get all movies from watchlist
    const { data: watchlistItems, error: watchlistError } = await supabase
      .from('watchlist_items')
      .select('movie_id')
      .eq('user_id', userId);

    // Get all reviewed movies
    const { data: reviews, error: reviewsError } = await supabase
      .from('reviews')
      .select('movie_id, rating')
      .eq('user_id', userId);

    if ((!watchlistItems || watchlistItems.length === 0) && (!reviews || reviews.length === 0)) {
      return [];
    }

    // Combine movie IDs
    const movieIds = new Set([
      ...(watchlistItems?.map(item => item.movie_id) || []),
      ...(reviews?.map(review => review.movie_id) || []),
    ]);

    // Fetch genre data for each movie from TMDB
    const genreCount: { [key: number]: { count: number; totalRating: number; ratingCount: number } } = {};

    for (const movieId of Array.from(movieIds).slice(0, 20)) {
      try {
        const response = await fetch(
          `${TMDB_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}`
        );

        if (!response.ok) continue;

        const movie = await response.json();

        if (movie.genres && Array.isArray(movie.genres)) {
          movie.genres.forEach((genre: { id: number; name: string }) => {
            if (!genreCount[genre.id]) {
              genreCount[genre.id] = { count: 0, totalRating: 0, ratingCount: 0 };
            }
            genreCount[genre.id].count += 1;

            // Add rating if exists
            const review = reviews?.find(r => r.movie_id === movieId);
            if (review) {
              genreCount[genre.id].totalRating += review.rating;
              genreCount[genre.id].ratingCount += 1;
            }
          });
        }
      } catch (error) {
        // Silently continue on error
        continue;
      }
    }

    // Convert to array and sort by count
    const preferences: GenrePreference[] = Object.entries(genreCount)
      .map(([genreId, data]) => ({
        genreId: parseInt(genreId),
        genreName: GENRE_MAP[parseInt(genreId)] || 'Unknown',
        count: data.count,
        averageRating: data.ratingCount > 0 ? Math.round((data.totalRating / data.ratingCount) * 10) / 10 : 0,
      }))
      .sort((a, b) => b.count - a.count);

    return preferences;
  } catch (error) {
    console.error('Error getting genre preferences:', error);
    return [];
  }
};

// Get personalized recommendations based on user preferences
export const getPersonalizedRecommendations = async (
  userId: string,
  limit: number = 10
): Promise<RecommendedMovie[]> => {
  try {
    const preferences = await getUserGenrePreferences(userId);

    if (preferences.length === 0) {
      return getPopularMovies(limit);
    }

    // Get top 3 genres
    const topGenres = preferences.slice(0, 3);
    const recommendations: RecommendedMovie[] = [];

    // Fetch movies for each top genre
    for (const genre of topGenres) {
      try {
        const response = await fetch(
          `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=${genre.genreId}&sort_by=vote_average.desc&vote_count.gte=100&page=1`
        );
        const data = await response.json();

        if (data.results) {
          const genreMovies = data.results.slice(0, 4).map((movie: any) => ({
            ...movie,
            reason: `Because you like ${genre.genreName}`,
          }));
          recommendations.push(...genreMovies);
        }
      } catch (error) {
        // Silently continue
        continue;
      }
    }

    // Remove duplicates and limit
    const uniqueRecommendations = recommendations
      .filter((movie, index, self) =>
        index === self.findIndex(m => m.id === movie.id)
      )
      .slice(0, limit);

    return uniqueRecommendations;
  } catch (error) {
    console.error('Error getting personalized recommendations:', error);
    return [];
  }
};

// Get similar movies based on a specific movie
export const getSimilarMovies = async (movieId: number): Promise<Movie[]> => {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/${movieId}/similar?api_key=${TMDB_API_KEY}&page=1`
    );
    const data = await response.json();

    return data.results?.slice(0, 10) || [];
  } catch (error) {
    console.error('Error fetching similar movies:', error);
    return [];
  }
};

// Get recommendations based on a specific movie ("Because you watched X")
export const getRecommendationsBasedOnMovie = async (
  movieId: number,
  movieTitle: string
): Promise<RecommendedMovie[]> => {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/${movieId}/recommendations?api_key=${TMDB_API_KEY}&page=1`
    );
    const data = await response.json();

    if (data.results) {
      return data.results.slice(0, 10).map((movie: any) => ({
        ...movie,
        reason: `Because you watched ${movieTitle}`,
      }));
    }

    return [];
  } catch (error) {
    console.error('Error fetching movie recommendations:', error);
    return [];
  }
};

// Get popular movies as fallback
const getPopularMovies = async (limit: number = 10): Promise<RecommendedMovie[]> => {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&page=1`
    );
    const data = await response.json();

    if (data.results) {
      return data.results.slice(0, limit).map((movie: any) => ({
        ...movie,
        reason: 'Popular right now',
      }));
    }

    return [];
  } catch (error) {
    console.error('Error fetching popular movies:', error);
    return [];
  }
};

// Get recommendations for home page (mix of personalized and trending)
export const getHomeRecommendations = async (userId?: string): Promise<RecommendedMovie[]> => {
  try {
    if (userId) {
      // Get personalized recommendations for logged-in users
      return await getPersonalizedRecommendations(userId, 10);
    } else {
      // Get popular movies for guests
      return await getPopularMovies(10);
    }
  } catch (error) {
    console.error('Error getting home recommendations:', error);
    return [];
  }
};
