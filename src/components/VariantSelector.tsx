import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Typography } from './typography/Typography';
import { colors } from '../theme/colors';
import { horizontalScale, verticalScale } from '../utils/responsive';
import { getCurrencySymbol } from '../utils/helperFunctions';

interface Variant {
  id: string;
  title: string;
  price: {
    amount: string;
    currencyCode: string;
  };
}

interface VariantSelectorProps {
  variants: Variant[];
  selectedVariantId: string;
  onSelectVariant: (variantId: string) => void;
}

export const VariantSelector: React.FC<VariantSelectorProps> = ({
  variants,
  selectedVariantId,
  onSelectVariant,
}) => {
  const formatPrice = (price: string) => {
    // Convert to number and back to string to remove trailing zeros
    return Number(price).toString();
  };

  return (
    <View>
      <Typography variant="label" style={styles.title}>
        Choose amount
      </Typography>
      <View style={styles.variantsContainer}>
        {variants.map(variant => (
          <TouchableOpacity
            activeOpacity={0.8}
            key={variant.id}
            style={[
              styles.variantButton,
              selectedVariantId === variant.id && styles.selectedVariant,
            ]}
            onPress={() => onSelectVariant(variant.id)}
          >
            <Typography
              variant="button"
              style={[
                styles.variantText,
                selectedVariantId === variant.id && styles.selectedVariantText,
              ]}
            >
              {formatPrice(variant.price.amount)}
              {getCurrencySymbol(variant.price.currencyCode)}
            </Typography>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    marginBottom: 8,
    color: colors.grey[400],
  },
  variantsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  variantButton: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.black[100],
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    height: verticalScale(46),
    width: horizontalScale(71),
  },
  selectedVariant: {
    backgroundColor: colors.black[100],
    borderColor: colors.black[100],
  },
  variantText: {
    color: colors.grey[500],
  },
  selectedVariantText: {
    color: '#FFFFFF',
  },
});
