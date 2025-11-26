import { supabase } from './supabase';

// =====================================================
// WATCHLIST CATEGORIES
// =====================================================

/**
 * Get all categories for the current user
 */
export const getWatchlistCategories = async (): Promise<WatchlistCategory[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return [];
    }

    const { data, error } = await supabase
      .from('watchlist_categories')
      .select('*')
      .eq('user_id', user.id)
      .order('is_default', { ascending: false })
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error getting watchlist categories:', error);
      return [];
    }

    // Get item counts for each category
    const categoriesWithCounts = await Promise.all(
      data.map(async (category) => {
        const { count } = await supabase
          .from('watchlist_items')
          .select('*', { count: 'exact', head: true })
          .eq('category_id', category.id);

        return {
          id: category.id,
          userId: category.user_id,
          name: category.name,
          description: category.description,
          icon: category.icon,
          color: category.color,
          isDefault: category.is_default,
          createdAt: category.created_at,
          updatedAt: category.updated_at,
          itemCount: count || 0,
        };
      })
    );

    return categoriesWithCounts;
  } catch (error) {
    console.error('Error getting watchlist categories:', error);
    return [];
  }
};

/**
 * Create a new watchlist category
 */
export const createWatchlistCategory = async (
  name: string,
  description?: string,
  icon: string = 'bookmark',
  color: string = '#AB8BFF'
): Promise<WatchlistCategory | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('watchlist_categories')
      .insert({
        user_id: user.id,
        name,
        description,
        icon,
        color,
        is_default: false,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating watchlist category:', error);
      throw error;
    }

    return {
      id: data.id,
      userId: data.user_id,
      name: data.name,
      description: data.description,
      icon: data.icon,
      color: data.color,
      isDefault: data.is_default,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      itemCount: 0,
    };
  } catch (error) {
    console.error('Error creating watchlist category:', error);
    return null;
  }
};

/**
 * Update a watchlist category
 */
export const updateWatchlistCategory = async (
  categoryId: string,
  updates: Partial<Pick<WatchlistCategory, 'name' | 'description' | 'icon' | 'color'>>
): Promise<WatchlistCategory | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const updateData: any = { updated_at: new Date().toISOString() };
    if (updates.name) updateData.name = updates.name;
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.icon) updateData.icon = updates.icon;
    if (updates.color) updateData.color = updates.color;

    const { data, error } = await supabase
      .from('watchlist_categories')
      .update(updateData)
      .eq('id', categoryId)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating watchlist category:', error);
      throw error;
    }

    return {
      id: data.id,
      userId: data.user_id,
      name: data.name,
      description: data.description,
      icon: data.icon,
      color: data.color,
      isDefault: data.is_default,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  } catch (error) {
    console.error('Error updating watchlist category:', error);
    return null;
  }
};

/**
 * Delete a watchlist category (and all its items)
 */
export const deleteWatchlistCategory = async (categoryId: string): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { error } = await supabase
      .from('watchlist_categories')
      .delete()
      .eq('id', categoryId)
      .eq('user_id', user.id)
      .eq('is_default', false); // Prevent deletion of default categories

    if (error) {
      console.error('Error deleting watchlist category:', error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Error deleting watchlist category:', error);
    return false;
  }
};

// =====================================================
// WATCHLIST ITEMS
// =====================================================

/**
 * Get all watchlist items for the current user
 */
export const getWatchlistItems = async (categoryId?: string): Promise<WatchlistItem[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return [];
    }

    let query = supabase
      .from('watchlist_items')
      .select(`
        *,
        category:watchlist_categories(*)
      `)
      .eq('user_id', user.id)
      .order('added_at', { ascending: false });

    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error getting watchlist items:', error);
      return [];
    }

    return data.map((item) => ({
      id: item.id,
      userId: item.user_id,
      categoryId: item.category_id,
      movieId: item.movie_id,
      title: item.title,
      posterPath: item.poster_path,
      voteAverage: item.vote_average,
      releaseDate: item.release_date,
      watchStatus: item.watch_status,
      watchProgress: item.watch_progress,
      notes: item.notes,
      addedAt: item.added_at,
      watchedAt: item.watched_at,
      category: item.category ? {
        id: item.category.id,
        userId: item.category.user_id,
        name: item.category.name,
        description: item.category.description,
        icon: item.category.icon,
        color: item.category.color,
        isDefault: item.category.is_default,
        createdAt: item.category.created_at,
        updatedAt: item.category.updated_at,
      } : undefined,
    }));
  } catch (error) {
    console.error('Error getting watchlist items:', error);
    return [];
  }
};

/**
 * Add a movie to watchlist
 */
export const addToWatchlist = async (
  movie: Movie | MovieDetails,
  categoryId: string,
  watchStatus: WatchStatus = 'want_to_watch'
): Promise<WatchlistItem | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('watchlist_items')
      .insert({
        user_id: user.id,
        category_id: categoryId,
        movie_id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        vote_average: movie.vote_average,
        release_date: movie.release_date,
        watch_status: watchStatus,
        watch_progress: 0,
      })
      .select()
      .single();

    if (error) {
      // If it's a duplicate key error, ignore it
      if (error.message.includes('duplicate')) {
        console.log('Movie already in this category');
        return null;
      }
      console.error('Error adding to watchlist:', error);
      throw error;
    }

    return {
      id: data.id,
      userId: data.user_id,
      categoryId: data.category_id,
      movieId: data.movie_id,
      title: data.title,
      posterPath: data.poster_path,
      voteAverage: data.vote_average,
      releaseDate: data.release_date,
      watchStatus: data.watch_status,
      watchProgress: data.watch_progress,
      notes: data.notes,
      addedAt: data.added_at,
      watchedAt: data.watched_at,
    };
  } catch (error) {
    console.error('Error adding to watchlist:', error);
    return null;
  }
};

/**
 * Update watchlist item
 */
export const updateWatchlistItem = async (
  itemId: string,
  updates: Partial<Pick<WatchlistItem, 'watchStatus' | 'watchProgress' | 'notes' | 'categoryId'>>
): Promise<WatchlistItem | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const updateData: any = {};
    if (updates.watchStatus) updateData.watch_status = updates.watchStatus;
    if (updates.watchProgress !== undefined) updateData.watch_progress = updates.watchProgress;
    if (updates.notes !== undefined) updateData.notes = updates.notes;
    if (updates.categoryId) updateData.category_id = updates.categoryId;
    
    // If marking as completed, set watched_at
    if (updates.watchStatus === 'completed') {
      updateData.watched_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('watchlist_items')
      .update(updateData)
      .eq('id', itemId)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating watchlist item:', error);
      throw error;
    }

    return {
      id: data.id,
      userId: data.user_id,
      categoryId: data.category_id,
      movieId: data.movie_id,
      title: data.title,
      posterPath: data.poster_path,
      voteAverage: data.vote_average,
      releaseDate: data.release_date,
      watchStatus: data.watch_status,
      watchProgress: data.watch_progress,
      notes: data.notes,
      addedAt: data.added_at,
      watchedAt: data.watched_at,
    };
  } catch (error) {
    console.error('Error updating watchlist item:', error);
    return null;
  }
};

/**
 * Remove movie from watchlist
 */
export const removeFromWatchlist = async (itemId: string): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { error } = await supabase
      .from('watchlist_items')
      .delete()
      .eq('id', itemId)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error removing from watchlist:', error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Error removing from watchlist:', error);
    return false;
  }
};

/**
 * Check if movie is in any watchlist category
 */
export const isMovieInWatchlist = async (movieId: number): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return false;
    }

    const { data, error } = await supabase
      .from('watchlist_items')
      .select('id')
      .eq('user_id', user.id)
      .eq('movie_id', movieId)
      .limit(1);

    if (error) {
      console.error('Error checking if movie is in watchlist:', error);
      return false;
    }

    return data && data.length > 0;
  } catch (error) {
    console.error('Error checking if movie is in watchlist:', error);
    return false;
  }
};

/**
 * Get watchlist categories for a specific movie
 */
export const getMovieWatchlistCategories = async (movieId: number): Promise<WatchlistCategory[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return [];
    }

    const { data, error } = await supabase
      .from('watchlist_items')
      .select(`
        category:watchlist_categories(*)
      `)
      .eq('user_id', user.id)
      .eq('movie_id', movieId);

    if (error) {
      console.error('Error getting movie watchlist categories:', error);
      return [];
    }

    return data
      .filter((item: any) => item.category)
      .map((item: any) => ({
        id: item.category.id,
        userId: item.category.user_id,
        name: item.category.name,
        description: item.category.description,
        icon: item.category.icon,
        color: item.category.color,
        isDefault: item.category.is_default,
        createdAt: item.category.created_at,
        updatedAt: item.category.updated_at,
      }));
  } catch (error) {
    console.error('Error getting movie watchlist categories:', error);
    return [];
  }
};

/**
 * Get watchlist statistics
 */
export const getWatchlistStats = async (): Promise<{
  totalItems: number;
  wantToWatch: number;
  watching: number;
  completed: number;
  categoryCount: number;
}> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return {
        totalItems: 0,
        wantToWatch: 0,
        watching: 0,
        completed: 0,
        categoryCount: 0,
      };
    }

    const { data, error } = await supabase
      .from('watchlist_stats')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error || !data) {
      return {
        totalItems: 0,
        wantToWatch: 0,
        watching: 0,
        completed: 0,
        categoryCount: 0,
      };
    }

    return {
      totalItems: data.total_items || 0,
      wantToWatch: data.want_to_watch_count || 0,
      watching: data.watching_count || 0,
      completed: data.completed_count || 0,
      categoryCount: data.category_count || 0,
    };
  } catch (error) {
    console.error('Error getting watchlist stats:', error);
    return {
      totalItems: 0,
      wantToWatch: 0,
      watching: 0,
      completed: 0,
      categoryCount: 0,
    };
  }
};
