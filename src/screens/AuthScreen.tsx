import { icons } from '@/constants/icons';
import { images } from '@/constants/images';
import { Check, Eye, EyeOff, X } from 'lucide-react-native';
import { loginUser, setGuestMode, signupUser } from '@/services/authService';
import { createUserProfile, isUsernameAvailable } from '@/services/userService';
import { useNavigation } from '@react-navigation/native';
import type { RootStackNavigationProp } from '@/navigation/types';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const AuthScreen = () => {
  const navigation = useNavigation<RootStackNavigationProp>();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  // Form fields
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [usernameError, setUsernameError] = useState('');
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [usernameCheckTimeout, setUsernameCheckTimeout] = useState<any>(null);

  const handleSkip = async () => {
    try {
      await setGuestMode();
      navigation.replace('Tabs');
    } catch (error) {
      console.error('Error skipping:', error);
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    try {
      setLoading(true);
      const success = await loginUser(email, password);
      
      if (success) {
        navigation.replace('Tabs');
      } else {
        Alert.alert('Error', 'Login failed. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    if (!name || !username || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    // Validate name
    if (name.trim().length < 2) {
      Alert.alert('Error', 'Name must be at least 2 characters');
      return;
    }

    // Validate username
    if (username.length < 3) {
      Alert.alert('Error', 'Username must be at least 3 characters');
      return;
    }
    if (username.length > 30) {
      Alert.alert('Error', 'Username must be less than 30 characters');
      return;
    }
    if (!/^[a-zA-Z0-9._]+$/.test(username)) {
      Alert.alert('Error', 'Username can only contain letters, numbers, dots and underscores');
      return;
    }

    // Check username availability
    const available = await isUsernameAvailable(username);
    if (!available) {
      Alert.alert('Error', 'Username is already taken. Please choose another one.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    if (password.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters');
      return;
    }

    // Validate password confirmation
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      const result = await signupUser(name, username, email, password);
      
      if (result.success && result.userId) {
        // Create user profile with username
        await createUserProfile(result.userId, name, username, email);
        navigation.replace('Tabs');
      } else {
        Alert.alert('Error', result.error || 'Signup failed. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className='flex-1 bg-primary'>
      <Image
        source={images.bg}
        className='absolute w-full h-full'
        resizeMode='cover'
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className='flex-1'
      >
        <ScrollView
          className='flex-1'
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Skip Button */}
          <TouchableOpacity
            onPress={handleSkip}
            className='absolute top-5 right-5 z-10 px-4 py-2'
          >
            <Text className='text-light-300 text-base font-semibold'>Skip</Text>
          </TouchableOpacity>

          <View className='flex-1 justify-center px-6 py-10'>
            {/* Logo */}
            <View className='items-center mb-10'>
              <Image source={icons.logo} className='w-20 h-16 mb-4' />
              <Text className='text-white text-3xl font-bold'>CinePulse</Text>
              <Text className='text-light-300 text-sm mt-2 text-center'>
                Discover, review, and save your favorite movies
              </Text>
            </View>

            {/* Auth Card */}
            <View className='bg-dark-200/90 rounded-3xl p-6 border border-dark-100'>
              {/* Toggle Buttons */}
              <View className='flex-row bg-dark-100 rounded-xl p-1 mb-6'>
                <TouchableOpacity
                  onPress={() => setIsLogin(true)}
                  className={`flex-1 py-3 rounded-lg ${
                    isLogin ? 'bg-accent' : 'bg-transparent'
                  }`}
                >
                  <Text
                    className={`text-center font-semibold ${
                      isLogin ? 'text-secondary' : 'text-light-300'
                    }`}
                  >
                    Login
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setIsLogin(false)}
                  className={`flex-1 py-3 rounded-lg ${
                    !isLogin ? 'bg-accent' : 'bg-transparent'
                  }`}
                >
                  <Text
                    className={`text-center font-semibold ${
                      !isLogin ? 'text-secondary' : 'text-light-300'
                    }`}
                  >
                    Sign Up
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Form Fields */}
              {!isLogin && (
                <>
                  <View className='mb-4'>
                    <Text className='text-light-300 text-sm mb-2 ml-1'>Name</Text>
                    <TextInput
                      value={name}
                      onChangeText={setName}
                      placeholder='Enter your full name'
                      placeholderTextColor='#9CA4AB'
                      className='bg-dark-100 text-white px-4 py-3.5 rounded-xl border border-light-300/20'
                    />
                  </View>

                  <View className='mb-4'>
                  <Text className='text-light-300 text-sm mb-2 ml-1'>Username</Text>
                  <TextInput
                    onChangeText={(text) => {
                      // Clean username (lowercase, no spaces)
                      const cleaned = text.toLowerCase().replace(/\s/g, '');
                      setUsername(cleaned);
                      
                      // Clear previous timeout
                      if (usernameCheckTimeout) {
                        clearTimeout(usernameCheckTimeout);
                      }
                      
                      // Reset availability state if username is too short
                      if (cleaned.length < 3) {
                        setUsernameAvailable(null);
                        setCheckingUsername(false);
                        return;
                      }
                      
                      // Check username availability with debounce
                      setCheckingUsername(true);
                      const timeout = setTimeout(async () => {
                        const available = await isUsernameAvailable(cleaned);
                        setUsernameAvailable(available);
                        setCheckingUsername(false);
                      }, 500);
                      setUsernameCheckTimeout(timeout);
                    }}
                    placeholder='Choose a username'
                    placeholderTextColor='#9CA4AB'
                    autoCapitalize='none'
                    className='bg-dark-100 text-white px-4 py-3.5 rounded-xl border border-light-300/20'
                  />
                  {username.length >= 3 && (
                    <View className='flex-row items-center mt-2 ml-1'>
                      {checkingUsername ? (
                        <ActivityIndicator size='small' color='#AB8BFF' />
                      ) : usernameAvailable === true ? (
                        <>
                          <Check size={12} color="#22c55e" style={{ marginRight: 4 }} />
                          <Text className='text-green-500 text-xs'>Username is available</Text>
                        </>
                      ) : usernameAvailable === false ? (
                        <>
                          <X size={12} color="#ef4444" style={{ marginRight: 4 }} />
                          <Text className='text-red-500 text-xs'>Username is already taken</Text>
                        </>
                      ) : null}
                    </View>
                  )}
                  {username.length < 3 && username.length > 0 && (
                    <Text className='text-light-300 text-xs mt-1 ml-1'>
                      Username must be at least 3 characters
                    </Text>
                  )}
                  {username.length === 0 && (
                    <Text className='text-light-300 text-xs mt-1 ml-1'>
                      Only letters, numbers, dots and underscores
                    </Text>
                  )}
                </View>
              </>
            )}

              <View className='mb-4'>
                <Text className='text-light-300 text-sm mb-2 ml-1'>Email</Text>
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder='Enter your email'
                  placeholderTextColor='#9CA4AB'
                  keyboardType='email-address'
                  autoCapitalize='none'
                  className='bg-dark-100 text-white px-4 py-3.5 rounded-xl border border-light-300/20'
                />
              </View>

              <View className={isLogin ? 'mb-6' : 'mb-4'}>
                <Text className='text-light-300 text-sm mb-2 ml-1'>Password</Text>
                <View className='relative'>
                  <TextInput
                    value={password}
                    onChangeText={setPassword}
                    placeholder={isLogin ? 'Enter your password' : 'Create a password (min 8 characters)'}
                    placeholderTextColor='#9CA4AB'
                    secureTextEntry={!showPassword}
                    className='bg-dark-100 text-white px-4 py-3.5 pr-12 rounded-xl border border-light-300/20'
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    className='absolute right-4 top-3.5'
                  >
                    {showPassword ? <Eye size={20} color="#9ca3af" /> : <EyeOff size={20} color="#9ca3af" />}
                  </TouchableOpacity>
                </View>
              </View>

              {!isLogin && (
                <View className='mb-6'>
                  <Text className='text-light-300 text-sm mb-2 ml-1'>Confirm Password</Text>
                  <View className='relative'>
                    <TextInput
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      placeholder='Re-enter your password'
                      placeholderTextColor='#9CA4AB'
                      secureTextEntry={!showConfirmPassword}
                      className='bg-dark-100 text-white px-4 py-3.5 pr-12 rounded-xl border border-light-300/20'
                    />
                    <TouchableOpacity
                      onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                      className='absolute right-4 top-3.5'
                    >
                      {showConfirmPassword ? <Eye size={20} color="#9ca3af" /> : <EyeOff size={20} color="#9ca3af" />}
                    </TouchableOpacity>
                  </View>
                  {confirmPassword.length > 0 && password !== confirmPassword && (
                    <Text className='text-red-500 text-xs mt-1 ml-1'>
                      Passwords do not match
                    </Text>
                  )}
                  {confirmPassword.length > 0 && password === confirmPassword && (
                    <View className='flex-row items-center mt-1 ml-1'>
                      <Check size={12} color="#22c55e" style={{ marginRight: 4 }} />
                      <Text className='text-green-500 text-xs'>
                        Passwords match
                      </Text>
                    </View>
                  )}
                </View>
              )}

              {/* Submit Button */}
              <TouchableOpacity
                onPress={isLogin ? handleLogin : handleSignup}
                disabled={loading}
                className={`rounded-xl py-4 items-center ${
                  loading ? 'bg-dark-100' : 'bg-accent'
                }`}
              >
                {loading ? (
                  <ActivityIndicator color='#fff' />
                ) : (
                  <Text className='text-secondary text-base font-bold'>
                    {isLogin ? 'Login' : 'Create Account'}
                  </Text>
                )}
              </TouchableOpacity>

              {isLogin && (
                <TouchableOpacity className='mt-4'>
                  <Text className='text-light-300 text-sm text-center'>
                    Forgot Password?
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Guest Mode Info */}
            <View className='mt-8 bg-dark-100/50 rounded-2xl p-4 border border-dark-100'>
              <View className='flex-row items-start'>
                <Image source={icons.star} className='size-5 mt-0.5 mr-3' tintColor='#AB8BFF' />
                <View className='flex-1'>
                  <Text className='text-white text-sm font-semibold mb-1'>
                    Continue as Guest
                  </Text>
                  <Text className='text-light-300 text-xs'>
                    You can browse movies, but you'll need to sign up to save favorites
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AuthScreen;
