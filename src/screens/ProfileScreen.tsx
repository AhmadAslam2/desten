import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../store/useAuth';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { colors } from '../theme/colors';
import { fs, moderateScale, verticalScale, horizontalScale } from '../utils/responsive';
import { Typography } from '../components/typography/Typography';
import {
  EditIcon,
  HelpIcon,
  LocationIcon,
  LogoutIcon,
  PackageIcon,
  SettingsIcon,
} from '../assets/icons';
import { ProductSlider } from '../components/ProductSlider';
import { ProductCard } from '../components/ProductCard';
import { useProducts } from '../hooks/useProducts';
import { useCustomerDetails } from '../hooks/useCustomerDetails';
import { useMutation } from '@apollo/client';
import { CREATE_CART } from '../api/queries';
import { useShopifyCheckoutSheet } from '@shopify/checkout-sheet-kit';

export const ProfileScreen = () => {
  const { customer, logout, accessToken } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const name = `${customer?.firstName || ''} ${customer?.lastName || ''}`.trim();
  const { products, loading } = useProducts();
  const { customer: customerDetails } = useCustomerDetails();
  const shopifyCheckout = useShopifyCheckoutSheet();
  const [createCart, { loading: createCartLoading }] = useMutation(CREATE_CART);
  const startShoppingProducts = products.slice(0, 10);
  const handleLogout = () => {
    logout();
  };
  const handleAccountDetails = () => {
    navigation.navigate('AccountDetails');
  };
  const lastOrder = customerDetails?.orders?.edges?.[0]?.node;
  const handleRepeatLastOrder = async () => {
    try {
      if (!customerDetails?.orders?.edges?.length) {
        Alert.alert('No Orders', 'You have no previous orders to repeat.');
        return;
      }
      // Create cart with the last order's items
      const { data } = await createCart({
        variables: {
          input: {
            lines:
              lastOrder.lineItems?.edges.map(({ node }: any) => ({
                merchandiseId: node.variant.id,
                quantity: node.quantity,
              })) || [],
            buyerIdentity: {
              customerAccessToken: accessToken,
            },
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
      console.error('Repeat order error:', error);
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to repeat last order');
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.productCardContainer}>
      <ProductCard product={item} />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.headerBg}>
          <Typography variant="h1" style={styles.hiText}>
            Hi, {name || '[name]'}
          </Typography>
          <View style={styles.headerButtonsRow}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.headerButton}
              onPress={handleAccountDetails}
            >
              <EditIcon />
              <Typography variant="button" style={styles.headerButtonText}>
                Account Details
              </Typography>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.headerButton}
              onPress={handleAccountDetails}
            >
              <LocationIcon />
              <Typography variant="button" style={styles.headerButtonText}>
                My Addresses
              </Typography>
            </TouchableOpacity>
          </View>
        </View>

        {/* Repeat Last Order Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.repeatOrderBtn}
          onPress={handleRepeatLastOrder}
        >
          {createCartLoading ? (
            <ActivityIndicator size="small" color={colors.ui.background} />
          ) : (
            <Typography variant="button" style={styles.repeatOrderBtnText}>
              Repeat Last Order
            </Typography>
          )}
        </TouchableOpacity>

        {/* Order History Card */}
        <TouchableOpacity
          onPress={handleAccountDetails}
          activeOpacity={0.8}
          style={styles.cardSection}
        >
          <View style={styles.cardRow}>
            <PackageIcon />
            <View>
              <Typography variant="h5" style={styles.cardTitle}>
                Order History
              </Typography>
              <Typography variant="p" style={styles.cardDesc}>
                Review your latest orders and repeat directly from this menu.
              </Typography>
            </View>
          </View>
        </TouchableOpacity>

        {/* Second Hi, [name] Section */}
        <Typography
          variant="h3"
          style={[styles.hiText, { marginHorizontal: verticalScale(16), marginBottom: 0 }]}
        >
          Hi, {name || '[name]'}
        </Typography>

        {/* Account Settings Card */}
        <TouchableOpacity
          onPress={handleAccountDetails}
          activeOpacity={0.8}
          style={[styles.cardSection, styles.lowerCardVerticalMargin]}
        >
          <View style={styles.cardRow}>
            <SettingsIcon />
            <View>
              <Typography variant="h5" style={styles.cardTitle}>
                Account Settings
              </Typography>
              <Typography variant="p" style={styles.cardDesc}>
                Control your app preferences.
              </Typography>
            </View>
          </View>
        </TouchableOpacity>

        {/* Help Card */}
        <TouchableOpacity
          activeOpacity={0.8}
          style={[styles.cardSection, styles.lowerCardVerticalMargin]}
          onPress={() => navigation.navigate('FaqModal')}
        >
          <View style={styles.cardRow}>
            <HelpIcon />
            <View>
              <Typography variant="h5" style={styles.cardTitle}>
                Help
              </Typography>
              <Typography variant="p" style={styles.cardDesc}>
                Report a problem here.
              </Typography>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.cardSection, styles.lowerCardVerticalMargin]}
          onPress={handleLogout}
        >
          <View style={styles.cardRow}>
            <LogoutIcon />
            <View>
              <Typography variant="h5" style={styles.cardTitle}>
                Logout
              </Typography>
              <Typography variant="p" style={styles.cardDesc}>
                Sign out of your account.
              </Typography>
            </View>
          </View>
        </TouchableOpacity>
        {/* Start shopping section */}
        <View style={styles.shoppingHeaderRow}>
          <Typography variant="h1" style={styles.bestsellersTitle}>
            Start shopping
          </Typography>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('Products', {
                collectionHandle: 'frontpage',
                collectionTitle: 'Home Page',
              })
            }
          >
            <Typography variant="button" style={styles.shoppingViewAll}>
              View all
            </Typography>
          </TouchableOpacity>
        </View>
        <View style={styles.sliderContainer}>
          {loading
            ? null
            : startShoppingProducts.length > 0 && (
                <ProductSlider data={startShoppingProducts} renderItem={renderItem} />
              )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.ui.background,
  },
  headerBg: {
    backgroundColor: colors.primary[100],
    paddingTop: 40,
    paddingHorizontal: 16,
    borderBottomLeftRadius: moderateScale(16),
    borderBottomRightRadius: moderateScale(16),
  },
  hiText: {
    color: colors.primary[500],
    fontWeight: '400',
    marginBottom: 32,
    fontFamily: 'Manrope-Regular',
  },
  nameText: {
    color: colors.primary[500],
    fontWeight: '500',
  },
  headerButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 16,
    marginBottom: verticalScale(57),
  },
  headerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    height: verticalScale(40),
    shadowColor: '#000',
    flex: 1,
    justifyContent: 'center',
  },
  headerButtonText: {
    fontSize: fs(16),
    color: colors.ui.text.primary,
    marginLeft: 16,
    fontWeight: '400',
  },
  repeatOrderBtn: {
    backgroundColor: colors.black[100],
    alignItems: 'center',
    height: verticalScale(48),
    borderRadius: moderateScale(16),
    justifyContent: 'center',
    marginHorizontal: 16,
    marginTop: -(verticalScale(48) / 2),
  },
  repeatOrderBtnText: {
    color: colors.ui.background,
  },
  cardSection: {
    backgroundColor: colors.primary[100],
    borderRadius: 16,
    marginHorizontal: 16,
    padding: 16,
    marginVertical: moderateScale(24),
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  cardTitle: {
    fontWeight: '700',
    color: colors.black[100],
  },
  cardDesc: {
    color: colors.black[100],
    maxWidth: 270,
  },
  shoppingHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: moderateScale(16),
    marginRight: moderateScale(16),
    marginTop: moderateScale(32),
    marginBottom: moderateScale(24),
  },
  shoppingHeader: {
    fontSize: fs(32),
    fontWeight: '400',
    color: colors.ui.text.primary,
  },
  shoppingViewAll: {
    color: colors.primary[500],
    fontWeight: '400',
  },
  lowerCardVerticalMargin: {
    marginTop: moderateScale(8),
    marginBottom: 0,
  },
  bestsellersTitle: {
    color: colors.black[100],
    fontWeight: '400',
    fontFamily: 'Manrope-Regular',
    marginLeft: moderateScale(16),
  },
  sliderContainer: {
    width: '100%',
  },
  productCardContainer: {
    padding: moderateScale(4),
    width: horizontalScale(255),
  },
});
