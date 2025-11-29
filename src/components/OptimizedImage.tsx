import React, { useState } from 'react';
import { Image, View, ActivityIndicator, ImageProps, StyleProp, ImageStyle } from 'react-native';

interface OptimizedImageProps extends Omit<ImageProps, 'source'> {
  uri: string;
  style?: StyleProp<ImageStyle>;
  className?: string;
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'center';
  placeholder?: boolean;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  uri,
  style,
  className,
  resizeMode = 'cover',
  placeholder = true,
  ...props
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Optimize TMDB image URLs to use smaller sizes
  const optimizedUri = uri.includes('image.tmdb.org')
    ? uri.replace('/w500/', '/w185/').replace('/w342/', '/w185/')
    : uri;

  return (
    <View style={style} className={className}>
      <Image
        source={{ uri: optimizedUri }}
        style={style}
        className={className}
        resizeMode={resizeMode}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
        onError={() => {
          setLoading(false);
          setError(true);
        }}
        {...props}
      />
      {loading && placeholder && (
        <View 
          style={[
            style,
            {
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: '#1a1a1a',
              justifyContent: 'center',
              alignItems: 'center',
            }
          ]}
          className={className}
        >
          <ActivityIndicator size="small" color="#AB8BFF" />
        </View>
      )}
      {error && (
        <View 
          style={[
            style,
            {
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: '#1a1a1a',
            }
          ]}
          className={className}
        />
      )}
    </View>
  );
};

export default OptimizedImage;
