import React from 'react';
import { Text, View, Pressable } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { BottomTabBarProps, BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import type { TabParamList } from './types';

// Screens
import HomeScreen from '@/screens/HomeScreen';
import SearchScreen from '@/screens/SearchScreen';
import SavedScreen from '@/screens/SavedScreen';
import ProfileScreen from '@/screens/ProfileScreen';

// Lucide icons (vector)
import {
  Home as HomeIcon,
  Search as SearchIcon,
  Bookmark as BookmarkIcon,
  User as UserIcon,
} from 'lucide-react-native';

const Tab = createBottomTabNavigator<TabParamList>();

/**
 * Custom tab bar implemented using nativewind (Tailwind) classes only for styling.
 * Minimal inline style only for safe-area bottom offset (required at runtime).
 *
 * Behaviour:
 * - Focused tab shows a rounded pill with icon on left and label on right
 * - Unfocused tabs show icon-only
 * - Flex-based sizing (focused tab grows) so layout is responsive without manual width math
 */

const CustomTabBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
  const insets = useSafeAreaInsets();

  // Map route names to lucide icon components
  const iconMap: Record<string, any> = {
    Home: HomeIcon,
    Search: SearchIcon,
    Saved: BookmarkIcon,
    Profile: UserIcon,
  };

  return (
    <View
      pointerEvents="box-none"
      className="absolute left-0 right-0 z-50 items-center"
      style={{
        // tiny inline style only for bottom safe area offset (no Tailwind alternative)
        bottom: Math.max(8, (insets?.bottom ?? 0) - 2),
      }}
    >
      {/* outer container: rounded big bar */}
      <View className="mx-4 w-[calc(100%-32px)] flex-row items-center justify-between bg-[#0f0d23] border border-[#0f0d23] shadow-lg rounded-full overflow-hidden h-14 px-2">
        {state.routes.map((route, index) => {
          const focused = state.index === index;
          const { options } = descriptors[route.key] as {
            options: BottomTabNavigationOptions & { tabBarLabel?: string; title?: string };
          };

          const title =
            (options.tabBarLabel as string) ??
            (options.title as string) ??
            (route.name as string);

          const IconComponent = iconMap[route.name] ?? HomeIcon;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!focused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          // Use flex grow to make focused tab visually larger without pixel math.
          // focused => flex-[2] (grows), unfocused => flex-1
          const growClass = focused ? 'flex-[2]' : 'flex-1';

          return (
            <Pressable
              key={route.key}
              accessibilityRole="button"
              accessibilityState={focused ? { selected: true } : {}}
              onPress={onPress}
              onLongPress={onLongPress}
              className={`${growClass} px-1 py-1 flex-row items-center justify-center`}
            >
              {focused ? (
                /* Focused pill: nativewind-only styling (no image).
                   bg-purple-ish approximates your highlight; rounded-full keeps ends perfect.
                   Icon on left, label on right. */
                <View className="w-full rounded-full bg-[#d8b6ff] bg-opacity-90 px-3 py-2 flex-row items-center justify-center">
                  <IconComponent
                    size={20}
                    color="#151312"
                    strokeWidth={2}
                    // margin-right via nativewind: mr-2
                    // lucide icon receives style prop for spacing, but we can wrap in a View as well.
                  />
                  <Text className="ml-2 text-[#151312] text-base font-semibold" numberOfLines={1}>
                    {title}
                  </Text>
                </View>
              ) : (
                /* Unfocused icon-only */
                <View className="w-full items-center justify-center">
                  <IconComponent size={20} color="#A8B5DB" strokeWidth={2} />
                </View>
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const TabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: { display: 'none' }, // hide default, we render custom
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Home' }} />
      <Tab.Screen name="Search" component={SearchScreen} options={{ title: 'Search' }} />
      <Tab.Screen name="Saved" component={SavedScreen} options={{ title: 'Saved' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
