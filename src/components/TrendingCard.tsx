import MaskedView from "@react-native-masked-view/masked-view";
import { useNavigation } from '@react-navigation/native';
import type { RootStackNavigationProp } from '@/navigation/types';
import { Image, Text, TouchableOpacity, View } from "react-native";

import { images } from "@/constants/images";

const TrendingCard = ({
  movie: { movie_id, movie_title, poster_path },
  index,
}: TrendingCardProps) => {
  const navigation = useNavigation<RootStackNavigationProp>();
  const posterUrl = poster_path 
    ? `https://image.tmdb.org/t/p/w500${poster_path}`
    : 'https://via.placeholder.com/500x750?text=No+Image';
    
  return (
    <TouchableOpacity 
      className="w-32 relative pl-5"
      onPress={() => navigation.navigate('MovieDetails', { id: String(movie_id) })}
    >
      <Image
        source={{ uri: posterUrl }}
        className="w-32 h-48 rounded-lg"
        resizeMode="cover"
      />

      <View className="absolute bottom-9 -left-3.5 px-2 py-1 rounded-full">
        <MaskedView
          maskElement={
            <Text className="font-bold text-white text-6xl">{index + 1}</Text>
          }
        >
          <Image
            source={images.rankingGradient}
            className="size-14"
            resizeMode="cover"
          />
        </MaskedView>
      </View>

      <Text
        className="text-sm font-bold mt-2 text-light-200"
        numberOfLines={1}
      >
        {movie_title}
      </Text>
    </TouchableOpacity>
  );
};

export default TrendingCard;