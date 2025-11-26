import { supabase } from './supabase';

export interface TrendingMovie {
  movie_id: number;
  movie_title: string;
  poster_path: string | null;
  vote_average: number;
  release_date: string;
  search_count: number;
  last_searched: string;
}

// Track a movie search
export const trackMovieSearch = async (
  movieId: number,
  movieTitle: string,
  posterPath: string | null,
  voteAverage: number,
  releaseDate: string,
  userId?: string
): Promise<void> => {
  try {
    const { error } = await supabase
      .from('movie_searches')
      .insert({
        movie_id: movieId,
        movie_title: movieTitle,
        poster_path: posterPath,
        vote_average: voteAverage,
        release_date: releaseDate,
        user_id: userId || null,
      });

    if (error) {
      console.error('Error tracking movie search:', error);
    }
  } catch (error) {
    console.error('Error tracking movie search:', error);
  }
};

// Get trending movies
export const getTrendingMovies = async (): Promise<TrendingMovie[]> => {
  try {
    const { data, error } = await supabase
      .from('trending_movies')
      .select('*')
      .limit(20);

    if (error) {
      console.error('Error fetching trending movies:', error);
      return [];
    }

    // Remove duplicates based on movie_id
    const uniqueMovies = data?.reduce((acc: TrendingMovie[], current) => {
      const exists = acc.find(movie => movie.movie_id === current.movie_id);
      if (!exists) {
        acc.push(current);
      }
      return acc;
    }, []) || [];

    // Return top 9 unique movies
    return uniqueMovies.slice(0, 9);
  } catch (error) {
    console.error('Error fetching trending movies:', error);
    return [];
  }
};

// Get search count for a specific movie
export const getMovieSearchCount = async (movieId: number): Promise<number> => {
  try {
    const { count, error } = await supabase
      .from('movie_searches')
      .select('*', { count: 'exact', head: true })
      .eq('movie_id', movieId)
      .gte('searched_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

    if (error) {
      console.error('Error getting movie search count:', error);
      return 0;
    }

    return count || 0;
  } catch (error) {
    console.error('Error getting movie search count:', error);
    return 0;
  }
};
