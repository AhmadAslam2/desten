import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { ImageBackground } from 'expo-image';
import { useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import { Typography } from '../components/typography/Typography';
import { Image } from '../components/Image';
import { colors } from '../theme/colors';
import { useLocksmithCheck } from '../hooks/useLocksmithCheck';
import { CheckoutButton } from '../components/CheckoutButton';
import { fs, horizontalScale, moderateScale, verticalScale } from '../utils/responsive';
import {
  AuthorizedIcon,
  CheckCircleBrokenIcon,
  PaymentMethod1,
  PaymentMethod2,
  PaymentMethod3,
  PaymentMethod4,
  PaymentMethod5,
  PaymentMethod6,
  PaymentMethod7,
  PaymentMethod8,
  PaymentMethod9,
  PaymentMethod10,
  PaymentMethod11,
  ShieldIcon,
} from '../assets/icons';
import { Badge } from '../components/Badge';
import { VariantSelector } from '../components/VariantSelector';
import * as Progress from 'react-native-progress';
import { QuantitySelector } from '../components/QuantitySelector';
import { useMediaImage } from '../hooks/useMediaImage';
import { useProductsByVendor } from '../hooks/useProductsByGroup';
import { useImageColors } from '../hooks/useImageColors';
import { LockedProductOverlay } from '../components/LockedProductOverlay';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BackButton } from '../components/common/BackButton';

const { width } = Dimensions.get('window');

type ProductDetailScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'ProductDetail'
>;
type ProductDetailScreenRouteProp = RouteProp<RootStackParamList, 'ProductDetail'>;

const PaymentMethodIcon = ({
  Icon,
  width = horizontalScale(27),
  height = verticalScale(20),
}: {
  Icon: React.ComponentType<any>;
  width?: number;
  height?: number;
}) => (
  <View>
    <Icon width={width} height={height} />
  </View>
);

export const ProductDetailScreen = () => {
  const route = useRoute<ProductDetailScreenRouteProp>();
  const product = route.params?.product;
  const [selectedVariantId, setSelectedVariantId] = useState(product.variants.edges[0].node.id);
  const [quantity, setQuantity] = useState(1);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const productPath = product ? `/products/${product.handle}` : null;
  const images = product.images.edges.map((edge: { node: { url: string } }) => edge.node.url);
  const { imageUrl: backgroundImageUrl } = useMediaImage(product.id);
  const { products: relatedProducts } = useProductsByVendor(product.vendor);
  const isPaysafe = product.vendor === 'paysafecard';
  const imageColors = useImageColors(product?.images.edges[0]?.node.url || images[0]);
  const { isLocked, isLoading: isLocksmithLoading } = useLocksmithCheck(productPath);
  const backgroundColor =
    Platform.OS === 'ios'
      ? `${imageColors?.background || colors.primary[0]}1A`
      : `${imageColors?.dominant || colors.primary[0]}1A`;
  // Filter out the current product and transform related products into variants format
  const vendorVariants = relatedProducts
    .map(p => ({
      id: p.variants.edges[0].node.id,
      title: p.title,
      price: {
        amount: p.priceRange.minVariantPrice.amount,
        currencyCode: p.priceRange.minVariantPrice.currencyCode,
      },
    }))
    .sort((a, b) => parseFloat(a.price.amount) - parseFloat(b.price.amount));

  // Add the current product as the first variant
  const allVariants = [...vendorVariants];
  // Get the selected product's details
  const selectedProduct =
    selectedVariantId === product.variants.edges[0].node.id
      ? product
      : relatedProducts.find(p => p.variants.edges[0].node.id === selectedVariantId);

  if (!product || !selectedProduct) {
    return (
      <SafeAreaView style={styles.container}>
        <Typography variant="p">Product not found</Typography>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainContainer}>
        <BackButton />
        {isLocked && <LockedProductOverlay />}
        <ScrollView
          contentContainerStyle={{
            backgroundColor: colors.primary[0],
            paddingBottom: 160,
          }}
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.imageGallery, { backgroundColor: backgroundColor }]}>
            {backgroundImageUrl ? (
              <ImageBackground
                source={{ uri: backgroundImageUrl }}
                style={StyleSheet.absoluteFill}
                contentFit="cover"
                transition={1000}
                onLoadEnd={() => setIsImageLoading(false)}
              >
                <View style={styles.imageContainer}>
                  <Image
                    source={selectedProduct.images.edges[0]?.node.url || images[0]}
                    resizeMode="cover"
                    width={horizontalScale(247)}
                    height={verticalScale(170)}
                    style={[styles.mainImage, isImageLoading && styles.loadingImage]}
                  />
                </View>
              </ImageBackground>
            ) : (
              <View style={styles.imageContainer}>
                <Image
                  source={selectedProduct.images.edges[0]?.node.url || images[0]}
                  resizeMode="cover"
                  width={horizontalScale(247)}
                  height={verticalScale(170)}
                  style={styles.mainImage}
                />
              </View>
            )}
          </View>

          {/* Product Info */}
          <View style={styles.infoContainer}>
            <View style={styles.headerSection}>
              <View>
                <Badge
                  rightIcon={<AuthorizedIcon />}
                  text="Authorized Seller"
                  style={{ alignSelf: 'flex-start', marginBottom: moderateScale(12) }}
                />
                <Typography variant="h2" style={styles.title} numberOfLines={2}>
                  {selectedProduct.title}
                </Typography>
              </View>

              {isPaysafe && (
                <Image
                  height={70}
                  width={70}
                  style={{ alignSelf: 'flex-end' }}
                  source={require('../assets/images/PaysafeAuthorizeBadge.png')}
                  resizeMode="contain"
                />
              )}
            </View>
            <VariantSelector
              variants={allVariants}
              selectedVariantId={selectedVariantId}
              onSelectVariant={setSelectedVariantId}
            />
            <Badge
              customText={
                <Typography
                  variant="label"
                  style={{
                    paddingVertical: moderateScale(8),
                  }}
                >
                  Bezahle in bis zu 30 Tagen mit Käuferschutz*.
                  <Typography variant="label" style={{ textDecorationLine: 'underline' }}>
                    {' '}
                    Mehr erfahren
                  </Typography>
                </Typography>
              }
              style={{ alignSelf: 'flex-start', marginTop: 16 }}
            />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 }}>
              <PaymentMethodIcon Icon={PaymentMethod1} />
              <PaymentMethodIcon Icon={PaymentMethod2} />
              <PaymentMethodIcon Icon={PaymentMethod3} />
              <PaymentMethodIcon Icon={PaymentMethod4} />
              <PaymentMethodIcon Icon={PaymentMethod5} />
              <PaymentMethodIcon Icon={PaymentMethod6} />
              <PaymentMethodIcon Icon={PaymentMethod7} />
              <PaymentMethodIcon Icon={PaymentMethod8} />
              <PaymentMethodIcon Icon={PaymentMethod9} />
              <PaymentMethodIcon Icon={PaymentMethod10} width={horizontalScale(40)} />
              <PaymentMethodIcon Icon={PaymentMethod11} width={horizontalScale(40)} />
            </View>
            <View
              style={{
                flexDirection: 'row',
                gap: 8,
                flexWrap: 'wrap',
                justifyContent: 'center',
                marginTop: 16,
                marginBottom: 16,
              }}
            >
              <Badge
                leftIcon={<CheckCircleBrokenIcon />}
                text="5 second delivery"
                style={{ alignSelf: 'flex-start' }}
              />
              <Badge
                leftIcon={<CheckCircleBrokenIcon />}
                text="Certified reseller"
                style={{ alignSelf: 'flex-start' }}
              />
              <Badge
                leftIcon={<ShieldIcon />}
                text="Safe & Secure"
                style={{ alignSelf: 'flex-start' }}
              />
            </View>
          </View>
        </ScrollView>
        <View style={[styles.checkoutSection]}>
          <Progress.Bar
            style={{ marginVertical: 8 }}
            progress={0.5}
            width={width - 48}
            color={colors.primary[500]}
            borderColor={colors.primary[0]}
            borderRadius={16}
            unfilledColor={colors.primary[0]}
          />
          <Typography variant="label" style={styles.checkoutLabel}>
            Purchase 100 € credit, get a 5 PSN card for free.
          </Typography>
          <View style={styles.checkoutContent}>
            {isLocksmithLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={colors.primary[500]} />
              </View>
            ) : (
              <View style={styles.checkoutActions}>
                {!isPaysafe && (
                  <QuantitySelector
                    initialQuantity={1}
                    minQuantity={1}
                    maxQuantity={1000}
                    onQuantityChange={newQuantity => {
                      setQuantity(newQuantity);
                    }}
                  />
                )}
                <CheckoutButton
                  style={styles.checkoutButton}
                  variantId={selectedVariantId}
                  quantity={quantity}
                />
              </View>
            )}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.ui.background,
  },
  mainContainer: {
    flex: 1,
    position: 'relative',
  },
  scrollView: {
    flex: 1,
  },
  imageGallery: {
    width: '100%',
    height: verticalScale(240),
    backgroundColor: colors.primary[100],
    borderBottomLeftRadius: moderateScale(16),
    borderBottomRightRadius: moderateScale(16),
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainImage: {
    backgroundColor: colors.ui.background,
    borderRadius: 24,
  },
  loadingImage: {
    opacity: 0,
  },
  imageDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.ui.background,
    marginHorizontal: 4,
    opacity: 0.5,
  },
  activeDot: {
    opacity: 1,
  },
  infoContainer: {
    margin: 16,
    padding: 16,
    backgroundColor: colors.ui.background,
    borderRadius: 16,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  headerSection: {
    marginBottom: moderateScale(12),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    fontWeight: '500',
  },
  price: {
    fontSize: fs(20),
    color: colors.primary[500],
    fontWeight: '600',
  },
  descriptionSection: {
    marginTop: 24,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: colors.primary[100],
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: colors.primary[900],
  },
  description: {
    fontSize: fs(18),
    lineHeight: 20,
    color: colors.primary[700],
  },
  readMoreButton: {
    marginTop: 8,
  },
  readMoreText: {
    color: colors.primary[500],
    fontWeight: '500',
  },
  checkoutSection: {
    backgroundColor: colors.ui.background,
    paddingHorizontal: 24,
    paddingTop: 16,
    borderTopColor: colors.grey[100],
    borderTopWidth: 1,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  checkoutButton: {
    backgroundColor: '#000000',
    borderRadius: 16,
    marginVertical: 16,
    flex: 1,
    marginLeft: 16,
  },
  checkoutLabel: {
    alignSelf: 'center',
  },
  lockMessage: {
    backgroundColor: '#FFF0F0',
    padding: 12,
    borderRadius: 8,
    marginVertical: 12,
  },
  lockMessageText: {
    color: colors.semantic.error,
    fontSize: 14,
    textAlign: 'center',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  loadingText: {
    marginLeft: 8,
    color: colors.primary[500],
  },
  errorText: {
    color: colors.semantic.error,
    marginTop: 12,
  },
  smallText: {
    fontSize: fs(14),
  },
  checkoutContent: {
    height: verticalScale(70),
    justifyContent: 'center',
  },
  checkoutActions: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
});
