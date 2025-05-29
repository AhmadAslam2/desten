import React from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Product } from '../types/shopify';
import { Image } from './Image';
import { colors } from '../theme/colors';
import { CheckoutButton } from './CheckoutButton';
import { horizontalScale, moderateScale, verticalScale } from '../utils/responsive';
import { Typography } from './typography/Typography';

import { capitalizeFirstLetter, getCurrencySymbol } from '../utils/helperFunctions';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigation = useNavigation<any>();
  const imageUrl = product?.images?.edges[0]?.node?.url;
  const variantId = product?.variants?.edges[0]?.node?.id;

  const handlePress = () => {
    navigation.navigate('ProductDetail', { product });
  };

  const handleCheckoutPress = (e: any) => {
    e.stopPropagation();
  };
  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <View style={styles.imageContainer}>
        <Image
          source={imageUrl}
          resizeMode="cover"
          height={verticalScale(180)}
          width={horizontalScale(253)}
          style={styles.image}
        />
      </View>
      <View style={styles.buttonContainer} onTouchEnd={handleCheckoutPress}>
        <CheckoutButton variantId={variantId} quantity={1} />
      </View>
    </TouchableOpacity>
  );
};

interface SmallProductCardProps {
  product: Product;
}

const calculateSmallCardWidth = () => {
  const screenWidth = Dimensions.get('window').width;
  const horizontalPadding = 32;
  const gap = 16;
  const availableWidth = screenWidth - horizontalPadding - gap;
  return Math.floor(availableWidth / 2);
};

export const SmallProductCard: React.FC<SmallProductCardProps> = ({ product }) => {
  const navigation = useNavigation<any>();
  const imageUrl = product?.images?.edges[0]?.node?.url;
  const cardWidth = calculateSmallCardWidth();
  const imageWidth = cardWidth - 16;
  const imageHeight = imageWidth / 1.5;
  const currencySymbol = getCurrencySymbol(product.priceRange.minVariantPrice.currencyCode);
  const handlePress = () => {
    navigation.navigate('ProductDetail', { product });
  };

  return (
    <TouchableOpacity style={[smallStyles.container, { width: cardWidth }]} onPress={handlePress}>
      <View style={[smallStyles.imageContainer]}>
        <Image source={imageUrl} resizeMode="cover" height={imageHeight} width={imageWidth} />
      </View>
      <Typography variant="pxs">{capitalizeFirstLetter(product.vendor)}</Typography>
      <Typography variant="p" style={smallStyles.price}>
        {`${currencySymbol}${product.priceRange.minVariantPrice.amount}`}
      </Typography>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary[0],
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: horizontalScale(255),
    borderWidth: 1,
    borderColor: colors.primary[100],
    marginBottom: moderateScale(16),
    overflow: 'hidden',
  },
  image: {
    width: horizontalScale(255),
    height: verticalScale(181),

    borderRadius: 24,
  },
  buttonContainer: {
    margin: moderateScale(8),
  },
  imageContainer: {
    width: horizontalScale(255),
    height: verticalScale(181),
    borderRadius: 24,
    overflow: 'hidden',
  },
});

const smallStyles = StyleSheet.create({
  container: {
    backgroundColor: colors.ui.background,
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: colors.primary[100],

    overflow: 'hidden',
  },
  image: {
    borderRadius: 16,
  },
  buttonContainer: {
    margin: moderateScale(6),
  },
  imageContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: moderateScale(8),
  },
  price: {
    fontWeight: '700',
    marginTop: moderateScale(8),
  },
});
