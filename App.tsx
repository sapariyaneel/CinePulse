import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootNavigator from '@/navigation/RootNavigator';
import BootSplash from 'react-native-bootsplash';
import './global.css';

const App = () => {
  useEffect(() => {
    // Hide splash screen after app is ready
    const init = async () => {
      // You can add any initialization logic here
      // For example, loading fonts, checking auth state, etc.
    };

    init().finally(async () => {
      await BootSplash.hide({ fade: true });
    });
  }, []);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;