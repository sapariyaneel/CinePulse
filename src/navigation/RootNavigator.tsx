import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { hasCompletedOnboarding } from '@/services/authService';
import type { RootStackParamList } from './types';

// Import navigators and screens
import TabNavigator from './TabNavigator';
import AuthScreen from '@/screens/AuthScreen';
import MovieDetailsScreen from '@/screens/MovieDetailsScreen';
import ReviewsScreen from '@/screens/ReviewsScreen';
import AboutScreen from '@/screens/AboutScreen';

const Stack = createStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  const [initialRoute, setInitialRoute] = useState<'Auth' | 'Tabs'>('Tabs');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    checkOnboarding();
  }, []);

  const checkOnboarding = async () => {
    try {
      const completed = await hasCompletedOnboarding();
      setInitialRoute(completed ? 'Tabs' : 'Auth');
    } catch (error) {
      console.error('Error checking onboarding:', error);
      setInitialRoute('Auth');
    } finally {
      setIsReady(true);
    }
  };

  if (!isReady) {
    return null;
  }

  return (
    <Stack.Navigator
      initialRouteName={initialRoute}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Auth" component={AuthScreen} />
      <Stack.Screen name="Tabs" component={TabNavigator} />
      <Stack.Screen name="MovieDetails" component={MovieDetailsScreen} />
      <Stack.Screen name="Reviews" component={ReviewsScreen} />
      <Stack.Screen name="About" component={AboutScreen} />
    </Stack.Navigator>
  );
};

export default RootNavigator;
