import 'react-native-url-polyfill/auto';
import { SUPABASE_PROJECT_URL, SUPABASE_API_KEY } from '@env';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = SUPABASE_PROJECT_URL!;
const supabaseAnonKey = SUPABASE_API_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

