import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import RootNavigator from '@/navigation/RootNavigator';
import './global.css';

const App = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar barStyle="light-content" backgroundColor="#151312" />
        <RootNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;