import React from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  DimensionValue,
  ImageSourcePropType,
} from 'react-native';

import { Image as ExpoImage, ImageContentFit } from 'expo-image';
interface ImageProps {
  source: string | ImageSourcePropType;
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  width?: DimensionValue;
  height?: DimensionValue;
  resizeMode?: 'contain' | 'cover' | 'stretch' | 'center';
  borderRadius?: number;
  style?: any;
}

const sizeDimensions = {
  small: { width: 80, height: 80 },
  medium: { width: 120, height: 120 },
  large: { width: 160, height: 160 },
  xlarge: { width: 240, height: 240 },
};

export const Image: React.FC<ImageProps> = ({
  source,
  size = 'medium',
  width,
  height,
  resizeMode = 'contain',
  borderRadius = 8,
  style,
}) => {
  const dimensions = width && height ? { width, height } : sizeDimensions[size];

  if (!source) {
    return (
      <View style={[styles.container, dimensions, { borderRadius }, style]}>
        <View style={[styles.placeholder, dimensions]} />
      </View>
    );
  }

  // Check if source is a local image (ImageSourcePropType)
  if (typeof source === 'number' || (typeof source === 'object' && 'uri' in source)) {
    return (
      <View style={[styles.container, dimensions, { borderRadius }, style]}>
        <ExpoImage
          style={[styles.image, dimensions, { borderRadius }]}
          source={source as any}
          contentFit={resizeMode as ImageContentFit}
        />
      </View>
    );
  }

  // Handle string URLs
  return (
    <View style={[styles.container, dimensions, { borderRadius }, style]}>
      <ExpoImage
        style={[styles.image, dimensions, { borderRadius }]}
        source={{
          uri: source as string,
        }}
        contentFit={resizeMode as ImageContentFit}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    width: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    backgroundColor: '#e0e0e0',
  },
});
