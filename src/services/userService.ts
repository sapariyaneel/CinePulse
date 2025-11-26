import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAuthState } from './authService';
import { supabase } from './supabase';

const SAVED_MOVIES_KEY = '@cinepulse_saved_movies';

// Initialize default user for authenticated users
const DEFAULT_USER: User = {
  id: '1',
  name: 'Movie Enthusiast',
  username: 'moviefan',
  email: 'member@cinepulse.com',
  avatarId: 1,
  createdAt: new Date().toISOString(),
  savedMovies: [],
  reviewCount: 12,
};

// Guest user profile
const GUEST_USER: User = {
  id: 'guest',
  name: 'Guest User',
  username: 'guest',
  email: 'Sign up to save movies',
  avatarId: 1,
  createdAt: new Date().toISOString(),
  savedMovies: [],
  reviewCount: 0,
};

// Create new user profile
export const createUserProfile = async (userId: string, name: string, username: string, email: string): Promise<User> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .insert({
        id: userId,
        name,
        username: username.toLowerCase(),
        email,
        avatar_id: 1,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating user profile:', error);
      throw error;
    }

    const newUser: User = {
      id: data.id,
      name: data.name,
      username: data.username,
      email: data.email,
      avatarId: data.avatar_id,
      createdAt: data.created_at,
      savedMovies: [],
      reviewCount: 0,
    };

    return newUser;
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
};

// Get current user
export const getCurrentUser = async (): Promise<User> => {
  try {
    // Check if user is guest
    const authState = await getAuthState();
    if (authState.isGuest) {
      return GUEST_USER;
    }

    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return GUEST_USER;
    }

    // Get user profile from database
    const { data: profile, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error || !profile) {
      console.error('Error getting user profile:', error);
      return GUEST_USER;
    }

    // Get saved movies count
    const { count: savedCount } = await supabase
      .from('saved_movies')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);

    // Get reviews count
    const { count: reviewCount } = await supabase
      .from('reviews')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);

    // Get saved movie IDs
    const { data: savedMovies } = await supabase
      .from('saved_movies')
      .select('movie_id')
      .eq('user_id', user.id);

    const currentUser: User = {
      id: profile.id,
      name: profile.name,
      username: profile.username,
      email: profile.email,
      avatarId: profile.avatar_id,
      createdAt: profile.created_at,
      savedMovies: savedMovies?.map(m => m.movie_id) || [],
      reviewCount: reviewCount || 0,
    };

    return currentUser;
  } catch (error) {
    console.error('Error getting user:', error);
    return GUEST_USER;
  }
};

// Check if username is available
export const isUsernameAvailable = async (username: string, currentUsername?: string): Promise<boolean> => {
  try {
    // Username validation rules (like Instagram)
    const usernameRegex = /^[a-zA-Z0-9._]{3,30}$/;
    if (!usernameRegex.test(username)) {
      return false;
    }

    // If it's the current user's username, it's available
    if (currentUsername && username.toLowerCase() === currentUsername.toLowerCase()) {
      return true;
    }

    // Use database function to check username (bypasses RLS)
    const { data, error } = await supabase
      .rpc('check_username_available', { 
        username_to_check: username.toLowerCase() 
      });

    if (error) {
      console.error('Error checking username:', error);
      return false;
    }

    return data === true;
  } catch (error) {
    console.error('Error checking username:', error);
    return false;
  }
};


// Update user profile
export const updateUserProfile = async (updates: Partial<User>): Promise<User> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    // If username is being changed, validate it
    if (updates.username) {
      const currentUser = await getCurrentUser();
      if (updates.username !== currentUser.username) {
        const isAvailable = await isUsernameAvailable(updates.username, currentUser.username);
        if (!isAvailable) {
          throw new Error('Username is already taken or invalid');
        }
      }
    }

    // Prepare update data
    const updateData: any = {};
    if (updates.name) updateData.name = updates.name;
    if (updates.username) updateData.username = updates.username;
    if (updates.email) updateData.email = updates.email;
    if (updates.avatarId !== undefined) updateData.avatar_id = updates.avatarId;

    // Update in database
    const { data, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }

    return await getCurrentUser();
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

// Update avatar
export const updateAvatar = async (avatarId: number): Promise<User> => {
  return updateUserProfile({ avatarId });
};

// Get saved movies
export const getSavedMovies = async (): Promise<SavedMovie[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return [];
    }

    const { data, error } = await supabase
      .from('saved_movies')
      .select('*')
      .eq('user_id', user.id)
      .order('saved_at', { ascending: false });

    if (error) {
      console.error('Error getting saved movies:', error);
      return [];
    }

    return data.map(movie => ({
      id: movie.movie_id,
      title: movie.title,
      poster_path: movie.poster_path,
      vote_average: movie.vote_average,
      release_date: movie.release_date,
      savedAt: movie.saved_at,
    }));
  } catch (error) {
    console.error('Error getting saved movies:', error);
    return [];
  }
};

// Save a movie
export const saveMovie = async (movie: Movie): Promise<void> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { error } = await supabase
      .from('saved_movies')
      .insert({
        user_id: user.id,
        movie_id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        vote_average: movie.vote_average,
        release_date: movie.release_date,
      });

    if (error) {
      // If it's a duplicate key error, ignore it
      if (!error.message.includes('duplicate')) {
        console.error('Error saving movie:', error);
        throw error;
      }
    }
  } catch (error) {
    console.error('Error saving movie:', error);
    throw error;
  }
};

// Unsave a movie
export const unsaveMovie = async (movieId: number): Promise<void> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { error } = await supabase
      .from('saved_movies')
      .delete()
      .eq('user_id', user.id)
      .eq('movie_id', movieId);

    if (error) {
      console.error('Error unsaving movie:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error unsaving movie:', error);
    throw error;
  }
};

// Check if movie is saved
export const isMovieSaved = async (movieId: number): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return false;
    }

    const { data, error } = await supabase
      .from('saved_movies')
      .select('id')
      .eq('user_id', user.id)
      .eq('movie_id', movieId)
      .limit(1);

    if (error) {
      console.error('Error checking if movie is saved:', error);
      return false;
    }

    return data && data.length > 0;
  } catch (error) {
    console.error('Error checking if movie is saved:', error);
    return false;
  }
};
