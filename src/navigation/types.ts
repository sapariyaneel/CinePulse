import type { StackNavigationProp } from '@react-navigation/stack';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { CompositeNavigationProp, RouteProp } from '@react-navigation/native';

// Root Stack Navigator Params
export type RootStackParamList = {
    Auth: undefined;
    Tabs: undefined;
    MovieDetails: { id: string };
    Reviews: { movieId: number; movieTitle: string };
    About: undefined;
};

// Tab Navigator Params
export type TabParamList = {
    Home: undefined;
    Search: undefined;
    Saved: undefined;
    Profile: undefined;
};

// Navigation Props
export type RootStackNavigationProp = StackNavigationProp<RootStackParamList>;
export type TabNavigationProp = CompositeNavigationProp<
    BottomTabNavigationProp<TabParamList>,
    StackNavigationProp<RootStackParamList>
>;

// Route Props
export type MovieDetailsRouteProp = RouteProp<RootStackParamList, 'MovieDetails'>;
export type ReviewsRouteProp = RouteProp<RootStackParamList, 'Reviews'>;
