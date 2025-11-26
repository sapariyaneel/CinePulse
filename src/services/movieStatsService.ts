import { supabase } from './supabase';
import { MOVIE_API_KEY } from '@env';

const TMDB_API_KEY = MOVIE_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export interface MovieStatistics {
  totalMoviesWatched: number;
  totalMoviesInWatchlist: number;
  totalReviews: number;
  averageRating: number;
  totalWatchTime: number; // in minutes
  watchTimeFormatted: string;
  favoriteGenres: {
    name: string;
    count: number;
    percentage: number;
  }[];
  watchlistByCategory: {
    categoryName: string;
    count: number;
    percentage: number;
  }[];
  reviewsThisMonth: number;
  reviewsThisYear: number;
  longestMovie: {
    title: string;
    runtime: number;
  } | null;
  shortestMovie: {
    title: string;
    runtime: number;
  } | null;
}

// Get comprehensive movie statistics for a user
export const getUserMovieStatistics = async (userId: string): Promise<MovieStatistics | null> => {
  try {
    // Get watchlist items
    const { data: watchlistItems } = await supabase
      .from('watchlist_items')
      .select('movie_id, category_id, watchlist_categories(name)')
      .eq('user_id', userId);

    // Get reviews
    const { data: reviews } = await supabase
      .from('reviews')
      .select('movie_id, rating, created_at')
      .eq('user_id', userId);

    const totalMoviesInWatchlist = watchlistItems?.length || 0;
    const totalReviews = reviews?.length || 0;

    // Calculate average rating
    const averageRating = reviews && reviews.length > 0
      ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) * 10) / 10
      : 0;

    // Get unique movie IDs
    const movieIds = new Set([
      ...(watchlistItems?.map(item => item.movie_id) || []),
      ...(reviews?.map(review => review.movie_id) || []),
    ]);

    const totalMoviesWatched = movieIds.size;

    // Calculate reviews this month and year
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    const reviewsThisMonth = reviews?.filter(r => new Date(r.created_at) >= startOfMonth).length || 0;
    const reviewsThisYear = reviews?.filter(r => new Date(r.created_at) >= startOfYear).length || 0;

    // Fetch movie details for runtime and genres
    let totalWatchTime = 0;
    const genreCount: { [key: string]: number } = {};
    let longestMovie: { title: string; runtime: number } | null = null;
    let shortestMovie: { title: string; runtime: number } | null = null;

    for (const movieId of Array.from(movieIds).slice(0, 50)) {
      try {
        const response = await fetch(
          `${TMDB_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}`
        );

        if (!response.ok) continue;

        const movie = await response.json();

        // Add runtime
        if (movie.runtime) {
          totalWatchTime += movie.runtime;

          // Track longest and shortest
          if (!longestMovie || movie.runtime > longestMovie.runtime) {
            longestMovie = { title: movie.title, runtime: movie.runtime };
          }
          if (!shortestMovie || movie.runtime < shortestMovie.runtime) {
            shortestMovie = { title: movie.title, runtime: movie.runtime };
          }
        }

        // Count genres
        if (movie.genres && Array.isArray(movie.genres)) {
          movie.genres.forEach((genre: { name: string }) => {
            genreCount[genre.name] = (genreCount[genre.name] || 0) + 1;
          });
        }
      } catch (error) {
        continue;
      }
    }

    // Format watch time
    const hours = Math.floor(totalWatchTime / 60);
    const minutes = totalWatchTime % 60;
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;

    let watchTimeFormatted = '';
    if (days > 0) {
      watchTimeFormatted = `${days}d ${remainingHours}h`;
    } else if (hours > 0) {
      watchTimeFormatted = `${hours}h ${minutes}m`;
    } else {
      watchTimeFormatted = `${minutes}m`;
    }

    // Calculate genre percentages
    const totalGenreCount = Object.values(genreCount).reduce((sum, count) => sum + count, 0);
    const favoriteGenres = Object.entries(genreCount)
      .map(([name, count]) => ({
        name,
        count,
        percentage: totalGenreCount > 0 ? Math.round((count / totalGenreCount) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Calculate watchlist by category
    const categoryCount: { [key: string]: number } = {};
    watchlistItems?.forEach(item => {
      const categoryName = (item.watchlist_categories as any)?.name || 'Uncategorized';
      categoryCount[categoryName] = (categoryCount[categoryName] || 0) + 1;
    });

    const totalCategoryCount = Object.values(categoryCount).reduce((sum, count) => sum + count, 0);
    const watchlistByCategory = Object.entries(categoryCount)
      .map(([categoryName, count]) => ({
        categoryName,
        count,
        percentage: totalCategoryCount > 0 ? Math.round((count / totalCategoryCount) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count);

    return {
      totalMoviesWatched,
      totalMoviesInWatchlist,
      totalReviews,
      averageRating,
      totalWatchTime,
      watchTimeFormatted,
      favoriteGenres,
      watchlistByCategory,
      reviewsThisMonth,
      reviewsThisYear,
      longestMovie,
      shortestMovie,
    };
  } catch (error) {
    console.error('Error getting movie statistics:', error);
    return null;
  }
};

// Get monthly review activity (for charts)
export const getMonthlyReviewActivity = async (userId: string): Promise<{ month: string; count: number }[]> => {
  try {
    const { data: reviews } = await supabase
      .from('reviews')
      .select('created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    if (!reviews || reviews.length === 0) {
      return [];
    }

    // Group by month
    const monthlyData: { [key: string]: number } = {};

    reviews.forEach(review => {
      const date = new Date(review.created_at);
      const monthKey = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
      monthlyData[monthKey] = (monthlyData[monthKey] || 0) + 1;
    });

    // Convert to array
    return Object.entries(monthlyData).map(([month, count]) => ({
      month,
      count,
    }));
  } catch (error) {
    console.error('Error getting monthly review activity:', error);
    return [];
  }
};
