import MaskedView from "@react-native-masked-view/masked-view";
import { useNavigation } from '@react-navigation/native';
import type { RootStackNavigationProp } from '@/navigation/types';
import { Image, Text, TouchableOpacity, View, useWindowDimensions } from "react-native";
import { useMemo } from "react";

import { images } from "@/constants/images";

const TrendingCard = ({
  movie: { movie_id, movie_title, poster_path },
  index,
}: TrendingCardProps) => {
  const navigation = useNavigation<RootStackNavigationProp>();
  const { width } = useWindowDimensions();
  
  const posterUrl = poster_path 
    ? `https://image.tmdb.org/t/p/w500${poster_path}`
    : 'https://via.placeholder.com/500x750?text=No+Image';

  // Calculate responsive dimensions
  const cardDimensions = useMemo(() => {
    if (width < 360) {
      return { width: 100, height: 150 }; // Small phones
    } else if (width < 600) {
      return { width: 128, height: 192 }; // Standard phones
    } else if (width < 900) {
      return { width: 160, height: 240 }; // Large phones/small tablets
    } else {
      return { width: 200, height: 300 }; // Tablets and larger
    }
  }, [width]);

  // Calculate responsive ranking badge size
  const rankingSize = useMemo(() => {
    if (width < 360) return 'text-4xl';
    if (width < 600) return 'text-5xl';
    if (width < 900) return 'text-6xl';
    return 'text-7xl';
  }, [width]);
    
  return (
    <TouchableOpacity 
      className="relative"
      style={{ width: cardDimensions.width, paddingLeft: width < 360 ? 12 : 20 }}
      onPress={() => navigation.navigate('MovieDetails', { id: String(movie_id) })}
    >
      <Image
        source={{ uri: posterUrl }}
        style={{ width: cardDimensions.width, height: cardDimensions.height }}
        className="rounded-lg sm:rounded-xl md:rounded-2xl"
        resizeMode="cover"
      />

      <View className="absolute bottom-7 sm:bottom-9 md:bottom-12 -left-2 sm:-left-3.5 md:-left-4 px-1 sm:px-2 py-0.5 sm:py-1 rounded-full">
        <MaskedView
          maskElement={
            <Text className={`font-bold text-white ${rankingSize}`}>{index + 1}</Text>
          }
        >
          <Image
            source={images.rankingGradient}
            className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 lg:w-20 lg:h-20"
            resizeMode="cover"
          />
        </MaskedView>
      </View>

      <Text
        className="text-xs sm:text-sm md:text-base lg:text-lg font-bold mt-1.5 sm:mt-2 md:mt-3 text-light-200"
        numberOfLines={1}
        style={{ width: cardDimensions.width }}
      >
        {movie_title}
      </Text>
    </TouchableOpacity>
  );
};

export default TrendingCard;