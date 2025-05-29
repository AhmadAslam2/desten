import React, { useState } from 'react';
import { TouchableOpacity, ActivityIndicator, Alert, StyleSheet, ViewStyle } from 'react-native';
import { useMutation } from '@apollo/client';
import { CREATE_CART } from '../api/queries';
import { Typography } from './typography/Typography';
import { colors } from '../theme/colors';
import { useTranslation } from '../store/useTranslation';
import { useShopifyCheckoutSheet } from '@shopify/checkout-sheet-kit';
import { fs, moderateScale, verticalScale } from '../utils/responsive';
import { useAuth } from '../store/useAuth';

interface CheckoutButtonProps {
  variantId: string;
  email?: string;
  style?: ViewStyle;
  quantity: number;
}

export const CheckoutButton: React.FC<CheckoutButtonProps> = ({
  variantId,
  email,
  style,
  quantity,
}) => {
  const { t } = useTranslation();
  const shopifyCheckout = useShopifyCheckoutSheet();
  const [isLoading, setIsLoading] = useState(false);
  const { accessToken, isAuthenticated } = useAuth();

  const [createCart] = useMutation(CREATE_CART);

  const handleCheckout = async () => {
    setIsLoading(true);
    try {
      const { data } = await createCart({
        variables: {
          input: {
            lines: [
              {
                merchandiseId: variantId,
                quantity: quantity,
              },
            ],
            buyerIdentity:
              isAuthenticated && accessToken
                ? {
                    customerAccessToken: accessToken,
                  }
                : email
                ? {
                    email,
                  }
                : undefined,
          },
        },
      });
      if (!data?.cartCreate?.cart) {
        throw new Error('Failed to create cart');
      }
      if (data.cartCreate.userErrors?.length > 0) {
        throw new Error(data.cartCreate.userErrors[0].message);
      }
      const checkoutUrl = data.cartCreate.cart.checkoutUrl;
      shopifyCheckout.present(checkoutUrl);
    } catch (error) {
      console.error('Checkout error:', error);
      Alert.alert(
        t('checkout.error'),
        error instanceof Error ? error.message : t('checkout.genericError')
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TouchableOpacity style={[styles.button, style]} onPress={handleCheckout} disabled={isLoading}>
      {isLoading ? (
        <ActivityIndicator color={colors.ui.background} />
      ) : (
        <Typography variant="button" style={styles.buttonText}>
          {t('product.checkout')}
        </Typography>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: moderateScale(16),
    height: verticalScale(48),
    borderRadius: moderateScale(16),
    backgroundColor: colors.black[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: colors.ui.background,
    fontSize: fs(14),
    fontFamily: 'Manrope-Medium',
  },
});
