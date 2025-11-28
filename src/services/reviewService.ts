import { getCurrentUser } from './userService';
import { supabase } from './supabase';
import { MOVIE_API_KEY } from '@env';

// Get all reviews
export const getAllReviews = async (): Promise<MovieReview[]> => {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        users!inner(username)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error getting reviews:', error);
      return [];
    }

    return data.map(review => ({
      id: review.id,
      movieId: review.movie_id,
      movieTitle: review.movie_title,
      moviePoster: '',
      userId: review.user_id,
      username: review.users.username,
      rating: review.rating,
      review: review.review_text,
      createdAt: review.created_at,
      updatedAt: review.updated_at,
    }));
  } catch (error) {
    console.error('Error getting reviews:', error);
    return [];
  }
};

// Get reviews for a specific movie
export const getMovieReviews = async (movieId: number): Promise<MovieReview[]> => {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        users!inner(username)
      `)
      .eq('movie_id', movieId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error getting movie reviews:', error);
      return [];
    }

    return data.map(review => ({
      id: review.id,
      movieId: review.movie_id,
      movieTitle: review.movie_title,
      moviePoster: '',
      userId: review.user_id,
      username: review.users.username,
      rating: review.rating,
      review: review.review_text,
      createdAt: review.created_at,
      updatedAt: review.updated_at,
    }));
  } catch (error) {
    console.error('Error getting movie reviews:', error);
    return [];
  }
};

// Get reviews by current user
export const getUserReviews = async (): Promise<MovieReview[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return [];
    }

    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        users!inner(username)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error getting user reviews:', error);
      return [];
    }

    // Fetch poster paths from TMDB for each movie
    const reviewsWithPosters = await Promise.all(
      data.map(async (review) => {
        let posterPath = '';
        try {
          const url = `https://api.themoviedb.org/3/movie/${review.movie_id}`;
          console.log('Fetching poster for movie:', review.movie_id);

          const response = await fetch(url, {
            method: 'GET',
            headers: {
              accept: 'application/json',
              Authorization: `Bearer ${MOVIE_API_KEY}`,
            },
          });

          if (response.ok) {
            const movie = await response.json();
            posterPath = movie.poster_path || '';
            console.log('Poster path fetched:', posterPath);
          } else {
            console.error('Failed to fetch movie data:', response.status, response.statusText);
          }
        } catch (error) {
          console.error('Error fetching poster for movie', review.movie_id, ':', error);
        }

        return {
          id: review.id,
          movieId: review.movie_id,
          movieTitle: review.movie_title,
          moviePoster: posterPath,
          userId: review.user_id,
          username: review.users.username,
          rating: review.rating,
          review: review.review_text,
          createdAt: review.created_at,
          updatedAt: review.updated_at,
        };
      })
    );

    return reviewsWithPosters;
  } catch (error) {
    console.error('Error getting user reviews:', error);
    return [];
  }
};

// Add or update a review
export const addOrUpdateReview = async (
  movieId: number,
  movieTitle: string,
  moviePoster: string,
  rating: number,
  reviewText: string
): Promise<MovieReview> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('User not authenticated');
    }

    const currentUser = await getCurrentUser();

    // Check if user already reviewed this movie
    const { data: existingReview } = await supabase
      .from('reviews')
      .select('*')
      .eq('user_id', user.id)
      .eq('movie_id', movieId)
      .single();

    if (existingReview) {
      // Update existing review
      const { data, error } = await supabase
        .from('reviews')
        .update({
          rating,
          review_text: reviewText,
        })
        .eq('id', existingReview.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating review:', error);
        throw error;
      }

      return {
        id: data.id,
        movieId: data.movie_id,
        movieTitle: data.movie_title,
        moviePoster,
        userId: data.user_id,
        username: currentUser.username,
        rating: data.rating,
        review: data.review_text,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
    } else {
      // Create new review
      const { data, error } = await supabase
        .from('reviews')
        .insert({
          user_id: user.id,
          movie_id: movieId,
          movie_title: movieTitle,
          rating,
          review_text: reviewText,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating review:', error);
        throw error;
      }

      return {
        id: data.id,
        movieId: data.movie_id,
        movieTitle: data.movie_title,
        moviePoster,
        userId: data.user_id,
        username: currentUser.username,
        rating: data.rating,
        review: data.review_text,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
    }
  } catch (error) {
    console.error('Error adding/updating review:', error);
    throw error;
  }
};

// Delete a review
export const deleteReview = async (reviewId: string): Promise<void> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('User not authenticated');
    }

    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', reviewId)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error deleting review:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error deleting review:', error);
    throw error;
  }
};

// Check if user has reviewed a movie
export const hasUserReviewedMovie = async (movieId: number): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return false;
    }

    const { data, error } = await supabase
      .from('reviews')
      .select('id')
      .eq('user_id', user.id)
      .eq('movie_id', movieId)
      .limit(1);

    if (error) {
      console.error('Error checking user review:', error);
      return false;
    }

    return data && data.length > 0;
  } catch (error) {
    console.error('Error checking user review:', error);
    return false;
  }
};

// Get user's review for a specific movie
export const getUserReviewForMovie = async (movieId: number): Promise<MovieReview | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return null;
    }

    const currentUser = await getCurrentUser();

    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('user_id', user.id)
      .eq('movie_id', movieId)
      .single();

    if (error || !data) {
      return null;
    }

    return {
      id: data.id,
      movieId: data.movie_id,
      movieTitle: data.movie_title,
      moviePoster: '',
      userId: data.user_id,
      username: currentUser.username,
      rating: data.rating,
      review: data.review_text,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  } catch (error) {
    console.error('Error getting user review for movie:', error);
    return null;
  }
};
