import { supabase } from './supabase';

export interface RatingStats {
  totalReviews: number;
  averageRating: number;
  highestRating: number;
  lowestRating: number;
  ratingDistribution: {
    rating: number;
    count: number;
  }[];
  recentRatings: {
    movieTitle: string;
    rating: number;
    createdAt: string;
  }[];
  genrePreferences: {
    genre: string;
    averageRating: number;
    count: number;
  }[];
}

export interface RatingTrend {
  month: string;
  averageRating: number;
  count: number;
}

// Get comprehensive rating statistics for a user
export const getUserRatingStats = async (userId: string): Promise<RatingStats | null> => {
  try {
    // Get all user reviews
    const { data: reviews, error } = await supabase
      .from('reviews')
      .select('rating, movie_title, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error || !reviews || reviews.length === 0) {
      return null;
    }

    // Calculate basic stats
    const totalReviews = reviews.length;
    const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews;
    const highestRating = Math.max(...reviews.map(r => r.rating));
    const lowestRating = Math.min(...reviews.map(r => r.rating));

    // Calculate rating distribution
    const distribution = [1, 2, 3, 4, 5].map(rating => ({
      rating,
      count: reviews.filter(r => r.rating === rating).length,
    }));

    // Get recent ratings (last 10)
    const recentRatings = reviews.slice(0, 10).map(r => ({
      movieTitle: r.movie_title,
      rating: r.rating,
      createdAt: r.created_at,
    }));

    return {
      totalReviews,
      averageRating: Math.round(averageRating * 10) / 10,
      highestRating,
      lowestRating,
      ratingDistribution: distribution,
      recentRatings,
      genrePreferences: [], // Will be populated if we track genres
    };
  } catch (error) {
    console.error('Error getting rating stats:', error);
    return null;
  }
};

// Get rating trends over time (monthly)
export const getRatingTrends = async (userId: string): Promise<RatingTrend[]> => {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('rating, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    if (error || !data) {
      return [];
    }

    // Group by month
    const monthlyData: { [key: string]: { total: number; count: number } } = {};

    data.forEach(review => {
      const date = new Date(review.created_at);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { total: 0, count: 0 };
      }
      
      monthlyData[monthKey].total += review.rating;
      monthlyData[monthKey].count += 1;
    });

    // Convert to array and calculate averages
    return Object.entries(monthlyData).map(([month, data]) => ({
      month,
      averageRating: Math.round((data.total / data.count) * 10) / 10,
      count: data.count,
    }));
  } catch (error) {
    console.error('Error getting rating trends:', error);
    return [];
  }
};

// Compare user's average rating with global average for a specific movie
export const compareRatingWithAverage = async (
  userId: string,
  movieId: number
): Promise<{ userRating: number; globalAverage: number; difference: number } | null> => {
  try {
    // Get user's rating
    const { data: userReview } = await supabase
      .from('reviews')
      .select('rating')
      .eq('user_id', userId)
      .eq('movie_id', movieId)
      .single();

    if (!userReview) {
      return null;
    }

    // Get global average for this movie
    const { data: allReviews } = await supabase
      .from('reviews')
      .select('rating')
      .eq('movie_id', movieId);

    if (!allReviews || allReviews.length === 0) {
      return null;
    }

    const globalAverage = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    const difference = userReview.rating - globalAverage;

    return {
      userRating: userReview.rating,
      globalAverage: Math.round(globalAverage * 10) / 10,
      difference: Math.round(difference * 10) / 10,
    };
  } catch (error) {
    console.error('Error comparing ratings:', error);
    return null;
  }
};

// Get rating statistics for all users (for comparison)
export const getGlobalRatingStats = async (): Promise<{
  totalReviews: number;
  averageRating: number;
  totalUsers: number;
} | null> => {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('rating, user_id');

    if (error || !data) {
      return null;
    }

    const totalReviews = data.length;
    const averageRating = data.reduce((sum, r) => sum + r.rating, 0) / totalReviews;
    const uniqueUsers = new Set(data.map(r => r.user_id)).size;

    return {
      totalReviews,
      averageRating: Math.round(averageRating * 10) / 10,
      totalUsers: uniqueUsers,
    };
  } catch (error) {
    console.error('Error getting global stats:', error);
    return null;
  }
};
