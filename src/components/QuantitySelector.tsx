import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Typography } from './typography/Typography';
import { colors } from '../theme/colors';
import { horizontalScale, verticalScale } from '../utils/responsive';

interface QuantitySelectorProps {
  initialQuantity?: number;
  minQuantity?: number;
  maxQuantity?: number;
  onQuantityChange?: (quantity: number) => void;
}

export const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  initialQuantity = 1,
  minQuantity = 1,
  maxQuantity = 99,
  onQuantityChange,
}) => {
  const [quantity, setQuantity] = useState(initialQuantity);

  const handleIncrement = () => {
    if (quantity < maxQuantity) {
      const newQuantity = quantity + 1;
      setQuantity(newQuantity);
      onQuantityChange?.(newQuantity);
    }
  };

  const handleDecrement = () => {
    if (quantity > minQuantity) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      onQuantityChange?.(newQuantity);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity activeOpacity={0.8} style={styles.button} onPress={handleDecrement}>
        <Ionicons name="remove" size={20} color={colors.black[100]} />
      </TouchableOpacity>

      <View style={styles.quantityContainer}>
        <Typography variant="button" style={styles.quantityText}>
          {quantity}
        </Typography>
      </View>

      <TouchableOpacity activeOpacity={0.8} style={styles.button} onPress={handleIncrement}>
        <Ionicons name="add" size={20} color={colors.black[100]} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.ui.background,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.black[100],
    height: verticalScale(48),
  },
  button: {
    width: horizontalScale(36),
    height: horizontalScale(36),
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#f5f5f5',
    borderColor: '#e0e0e0',
  },
  quantityContainer: {
    minWidth: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
  },
  quantityText: {
    textAlign: 'center',
  },
});
