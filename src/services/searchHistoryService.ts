import AsyncStorage from '@react-native-async-storage/async-storage';

const SEARCH_HISTORY_KEY = '@cinepulse_search_history';
const MAX_HISTORY_ITEMS = 20;

export interface SearchHistoryItem {
  query: string;
  timestamp: string;
}

// Get search history
export const getSearchHistory = async (): Promise<SearchHistoryItem[]> => {
  try {
    const historyJson = await AsyncStorage.getItem(SEARCH_HISTORY_KEY);
    return historyJson ? JSON.parse(historyJson) : [];
  } catch (error) {
    console.error('Error getting search history:', error);
    return [];
  }
};

// Add search query to history
export const addToSearchHistory = async (query: string): Promise<void> => {
  try {
    if (!query.trim()) return;

    const history = await getSearchHistory();
    
    // Remove duplicate if exists
    const filtered = history.filter(item => item.query.toLowerCase() !== query.toLowerCase());
    
    // Add new query at the beginning
    const newHistory: SearchHistoryItem[] = [
      { query: query.trim(), timestamp: new Date().toISOString() },
      ...filtered
    ];
    
    // Keep only the latest MAX_HISTORY_ITEMS
    const trimmed = newHistory.slice(0, MAX_HISTORY_ITEMS);
    
    await AsyncStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(trimmed));
  } catch (error) {
    console.error('Error adding to search history:', error);
  }
};

// Remove a specific search query from history
export const removeFromSearchHistory = async (query: string): Promise<void> => {
  try {
    const history = await getSearchHistory();
    const filtered = history.filter(item => item.query !== query);
    await AsyncStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error removing from search history:', error);
  }
};

// Clear all search history
export const clearSearchHistory = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(SEARCH_HISTORY_KEY);
  } catch (error) {
    console.error('Error clearing search history:', error);
  }
};
