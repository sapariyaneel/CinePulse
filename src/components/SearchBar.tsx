import { Image, TextInput, View } from "react-native";

import { icons } from "@/constants/icons";

interface Props {
  placeholder: string;
  value?: string;
  onChangeText?: (text: string) => void;
  onPress?: () => void;
}

const SearchBar = ({ placeholder, value, onChangeText, onPress }: Props) => {
  return (
    <View className="flex-row items-center bg-dark-200 rounded-full px-3 py-2.5 sm:px-4 sm:py-3 md:px-5 md:py-4 lg:px-6 lg:py-5">
      <Image
        source={icons.search}
        className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6"
        resizeMode="contain"
        tintColor="#AB8BFF"
      />
      <TextInput
        onPress={onPress}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        className="flex-1 ml-2 sm:ml-2.5 md:ml-3 text-white text-sm sm:text-base md:text-lg"
        placeholderTextColor="#A8B5DB"
      />
    </View>
  );
};

export default SearchBar;