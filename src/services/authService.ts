import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from './supabase';

const AUTH_KEY = '@cinepulse_auth';
const ONBOARDING_KEY = '@cinepulse_onboarding_complete';

export interface AuthUser {
  isGuest: boolean;
  isAuthenticated: boolean;
  userId?: string;
}

// Check if user has completed onboarding
export const hasCompletedOnboarding = async (): Promise<boolean> => {
  try {
    const value = await AsyncStorage.getItem(ONBOARDING_KEY);
    return value === 'true';
  } catch (error) {
    console.error('Error checking onboarding:', error);
    return false;
  }
};

// Mark onboarding as complete
export const completeOnboarding = async (): Promise<void> => {
  try {
    await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
  } catch (error) {
    console.error('Error completing onboarding:', error);
  }
};

// Get current auth state
export const getAuthState = async (): Promise<AuthUser> => {
  try {
    const authJson = await AsyncStorage.getItem(AUTH_KEY);
    if (authJson) {
      return JSON.parse(authJson);
    }
    return { isGuest: false, isAuthenticated: false };
  } catch (error) {
    console.error('Error getting auth state:', error);
    return { isGuest: false, isAuthenticated: false };
  }
};

// Get current user ID
export const getCurrentUserId = async (): Promise<string | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    return user?.id || null;
  } catch (error) {
    console.error('Error getting current user ID:', error);
    return null;
  }
};

// Set guest mode
export const setGuestMode = async (): Promise<void> => {
  try {
    const authState: AuthUser = {
      isGuest: true,
      isAuthenticated: false,
    };
    await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(authState));
    await completeOnboarding();
  } catch (error) {
    console.error('Error setting guest mode:', error);
  }
};

// Login user
export const loginUser = async (email: string, password: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Login error:', error.message);
      return false;
    }

    if (data.user) {
      const authState: AuthUser = {
        isGuest: false,
        isAuthenticated: true,
        userId: data.user.id,
      };
      await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(authState));
      await completeOnboarding();
      return true;
    }

    return false;
  } catch (error) {
    console.error('Error logging in:', error);
    return false;
  }
};

// Sign up user
export const signupUser = async (name: string, username: string, email: string, password: string): Promise<{ success: boolean; userId?: string; error?: string }> => {
  try {
    // Create auth user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: undefined,
        data: {
          username,
          name,
        },
      },
    });

    if (error) {
      console.error('Signup error:', error.message);
      return { success: false, error: error.message };
    }

    if (data.user) {
      const authState: AuthUser = {
        isGuest: false,
        isAuthenticated: true,
        userId: data.user.id,
      };
      await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(authState));
      await completeOnboarding();
      return { success: true, userId: data.user.id };
    }

    return { success: false, error: 'Failed to create user' };
  } catch (error: any) {
    console.error('Error signing up:', error);
    return { success: false, error: error.message || 'An error occurred' };
  }
};

// Logout user
export const logoutUser = async (): Promise<void> => {
  try {
    await supabase.auth.signOut();
    await AsyncStorage.removeItem(AUTH_KEY);
  } catch (error) {
    console.error('Error logging out:', error);
  }
};

// Check if user can save movies (must be authenticated, not guest)
export const canSaveMovies = async (): Promise<boolean> => {
  const authState = await getAuthState();
  return authState.isAuthenticated && !authState.isGuest;
};

// Restore session from Supabase
export const restoreSession = async (): Promise<void> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      // Ensure AUTH_KEY is set correctly
      const authState: AuthUser = {
        isGuest: false,
        isAuthenticated: true,
        userId: session.user.id,
      };
      await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(authState));
      await completeOnboarding();
    }
  } catch (error) {
    console.error('Error restoring session:', error);
  }
};
