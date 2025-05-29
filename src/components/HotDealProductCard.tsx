import React from 'react';
import { StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Product } from '../types/shopify';
import { Image } from './Image';
import { Typography } from './typography/Typography';
import { colors } from '../theme/colors';
import { getCurrencySymbol, capitalizeFirstLetter } from '../utils/helperFunctions';

interface HotDealProductCardProps {
  product: Product;
}

export const HotDealProductCard: React.FC<HotDealProductCardProps> = ({ product }) => {
  const navigation = useNavigation<any>();
  const imageUrl = product?.images?.edges[0]?.node?.url;
  const price = product?.priceRange?.minVariantPrice?.amount;
  const currency = product?.priceRange?.minVariantPrice?.currencyCode;
  const currencySymbol = getCurrencySymbol(currency);
  const vendor = product?.vendor;
  const imageWidth = Dimensions.get('window').width - 64;
  const imageHeight = imageWidth * 0.67;
  const handlePress = () => {
    navigation.navigate('ProductDetail', { product });
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <Typography variant="h2" style={styles.hotDealTitle}>
        Hot Deal!
      </Typography>
      <Image
        resizeMode="cover"
        source={{ uri: imageUrl }}
        style={styles.image}
        height={imageHeight}
        width={imageWidth}
      />
      <Typography variant="pxs" style={styles.vendorText}>
        {capitalizeFirstLetter(vendor)}
      </Typography>
      <Typography variant="p" style={styles.priceText}>
        {currencySymbol}
        {price}
      </Typography>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.ui.background,
    borderRadius: 16,
    padding: 16,
    width: '100%',
    alignSelf: 'center',
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  hotDealTitle: {
    fontWeight: '500',
    marginBottom: 16,
    color: colors.black[100],
  },
  cardWrapper: {
    backgroundColor: '#0033B7', // PaysafeCard blue
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    position: 'relative',
  },
  pricePill: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: colors.primary[0],
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 4,
    zIndex: 2,
    minWidth: 48,
    alignItems: 'center',
  },
  pricePillText: {
    fontWeight: '700',
    color: colors.black[100],
    fontSize: 16,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 28,
    letterSpacing: 1,
  },
  vendorText: {
    color: colors.grey[800],
    marginTop: 12,
    marginBottom: 2,
  },
  priceText: {
    fontWeight: '700',
    fontSize: 18,
    color: colors.black[100],
  },
  image: {
    width: '100%',

    borderRadius: 16,
  },
});
