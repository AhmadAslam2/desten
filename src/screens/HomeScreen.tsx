import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardEvent,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { ImageBackground, Image } from 'expo-image';
import { Typography } from '../components/typography/Typography';
import { colors } from '../theme/colors';
import { RatingStar, SearchIcon } from '../assets/icons';
import CustomTextInput from '../components/common/TextInput';
import { BlurView } from '@react-native-community/blur';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fs, horizontalScale, moderateScale } from '../utils/responsive';
import { debounce } from 'lodash';
import { useProducts } from '../hooks/useProducts';
import { SearchResultsDropdown } from '../components/SearchResultsDropdown';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { Product } from '../types/shopify';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
  FadeIn,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { fetchTrustpilotRating } from '../api/trustpilot';
import { HOME_CATEGORIES } from '../utils/constants';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

type TrustpilotRating = {
  score: {
    stars: number;
    trustScore: number;
  };
  numberOfReviews: {
    total: number;
    fiveStars: number;
    fourStars: number;
    threeStars: number;
    twoStars: number;
    oneStar: number;
    usedForTrustScoreCalculation: number;
  };
  status: string;
  name: {
    identifying: string;
    referring: string[];
  };
  websiteUrl: string;
  country: string;
  id: string;
  displayName: string;
  links: Array<{
    href: string;
    method: string;
    rel: string;
  }>;
};

export const HomeScreen = () => {
  const [inputValue, setInputValue] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [rating, setRating] = useState<TrustpilotRating | null>(null);
  const [isLoadingRating, setIsLoadingRating] = useState(true);
  const { loading, products, hasNextPage, loadMore, refetch } = useProducts(inputValue);
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const INITIAL_OFFSET = -75;
  const searchContainerTranslateY = useSharedValue(INITIAL_OFFSET);

  useEffect(() => {
    const keyboardWillShow = (e: KeyboardEvent) => {
      const height = e.endCoordinates.height;
      const duration = Platform.OS === 'ios' ? e.duration : 250;
      searchContainerTranslateY.value = withTiming(-height, {
        duration: duration,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
    };

    const keyboardWillHide = (e: KeyboardEvent) => {
      const duration = Platform.OS === 'ios' ? e.duration : 250;
      searchContainerTranslateY.value = withTiming(INITIAL_OFFSET, {
        duration: duration,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
    };

    const showSubscription = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      keyboardWillShow
    );
    const hideSubscription = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      keyboardWillHide
    );

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: searchContainerTranslateY.value }],
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
    };
  });

  const debouncedSearch = useMemo(
    () =>
      debounce((text: string) => {
        refetch();
      }, 500),
    [refetch]
  );

  const handleSearch = useCallback(
    (text: string) => {
      setInputValue(text);
      setShowResults(true);
      debouncedSearch(text);
    },
    [debouncedSearch]
  );

  const handleInputFocus = useCallback(() => {
    if (inputValue && products.length > 0) {
      setShowResults(true);
    }
  }, [inputValue, products]);

  const handleSelectProduct = useCallback(
    (product: Product) => {
      setShowResults(false);
      Keyboard.dismiss();
      navigation.navigate('ProductDetail', { product });
    },
    [navigation]
  );

  const handleBackgroundPress = useCallback(() => {
    Keyboard.dismiss();
    setShowResults(false);
  }, []);

  const handleClearSearch = useCallback(() => {
    setInputValue('');
    setShowResults(false);
  }, []);

  const getRating = async () => {
    try {
      setIsLoadingRating(true);
      const ratingData = await fetchTrustpilotRating();
      if (ratingData && typeof ratingData === 'object') {
        setRating(ratingData as unknown as TrustpilotRating);
      }
    } catch (error) {
      console.error('Error fetching rating:', error);
    } finally {
      setIsLoadingRating(false);
    }
  };

  useEffect(() => {
    getRating();
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <TouchableWithoutFeedback onPress={handleBackgroundPress}>
        <View style={styles.container}>
          <ImageBackground
            source={require('../assets/images/homePageHero.png')}
            style={styles.heroContainer}
            contentFit="cover"
          >
            {/* Hero Section */}
            <View style={styles.heroContent}>
              <View style={styles.heroTextContainer}>
                <Typography style={styles.heroTitle}>Dein Gutschein in</Typography>
                <Typography style={styles.heroSubtitle}>5 Sekunden.</Typography>
              </View>
              <View>
                {/* Search Bar */}
                <Animated.View style={[styles.searchContainer, animatedStyle]}>
                  <CustomTextInput
                    containerStyle={styles.searchContainerStyle}
                    placeholder="Search"
                    value={inputValue}
                    onChangeText={handleSearch}
                    onFocus={handleInputFocus}
                    leftIcon={<SearchIcon width={20} height={20} fill="none" />}
                    rightIcon={
                      inputValue ? (
                        <TouchableOpacity onPress={handleClearSearch} style={styles.clearButton}>
                          <Ionicons name="close-circle" size={20} color={colors.primary[500]} />
                        </TouchableOpacity>
                      ) : null
                    }
                  />
                  <SearchResultsDropdown<Product>
                    results={products}
                    visible={showResults && inputValue.length > 0}
                    renderItem={product => (
                      <TouchableOpacity
                        style={styles.resultItem}
                        onPress={() => handleSelectProduct(product)}
                      >
                        <Image
                          source={{ uri: product.images.edges[0]?.node.url }}
                          style={[styles.productImage, { width: 40, height: 40 }]}
                          contentFit="contain"
                        />
                        <View style={styles.productInfo}>
                          <Typography variant="p" style={styles.productTitle} numberOfLines={1}>
                            {product.title}
                          </Typography>
                          <Typography variant="pxs" style={styles.productPrice}>
                            {product.priceRange.minVariantPrice.amount}{' '}
                            {product.priceRange.minVariantPrice.currencyCode}
                          </Typography>
                        </View>
                      </TouchableOpacity>
                    )}
                  />
                </Animated.View>
                <Typography variant="h5" style={styles.categoriesTitle}>
                  Shop by category
                </Typography>
                {/* Categories */}
                <View style={styles.categoriesContainer}>
                  <BlurView
                    blurType="light"
                    blurAmount={1}
                    reducedTransparencyFallbackColor="white"
                    style={styles.categoriesOverlay}
                  />
                  <View style={styles.categoriesTint} />
                  <View style={styles.categoriesContent}>
                    {HOME_CATEGORIES.map(({ key, label, Icon, collectionHandle }) => (
                      <TouchableOpacity
                        key={key}
                        style={styles.categoryItem}
                        activeOpacity={0.8}
                        onPress={() => {
                          navigation.navigate('Products', {
                            collectionHandle,
                            collectionTitle: label,
                          });
                        }}
                      >
                        <View style={styles.categoryIconWrapper}>
                          <Icon width={20} height={20} />
                        </View>
                        <Typography variant="label" style={styles.categoryLabel}>
                          {label}
                        </Typography>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
                {/* Rating Section */}
                {!isLoadingRating && rating ? (
                  <Animated.View
                    entering={FadeIn.duration(500).easing(Easing.bezier(0.25, 0.1, 0.25, 1))}
                    style={styles.ratingContainer}
                  >
                    <Typography style={styles.ratingLabel}>Hervorragend</Typography>
                    <View style={styles.starsContainer}>
                      {[...Array(5)].map((_, index) => (
                        <RatingStar
                          key={index}
                          width={20}
                          height={20}
                          style={styles.starIcon}
                          fill={
                            index < Math.floor(rating.score.stars) ? colors.primary[500] : 'none'
                          }
                        />
                      ))}
                    </View>
                    <Typography style={styles.ratingText}>
                      {rating.score.stars.toFixed(1)}
                    </Typography>
                  </Animated.View>
                ) : (
                  <View style={[styles.ratingContainer, { opacity: 0 }]}>
                    <Typography style={styles.ratingLabel}>Hervorragend</Typography>
                    <View style={styles.starsContainer}>
                      {[...Array(5)].map((_, index) => (
                        <RatingStar
                          key={index}
                          width={20}
                          height={20}
                          style={styles.starIcon}
                          fill="none"
                        />
                      ))}
                    </View>
                    <Typography style={styles.ratingText}>0.0</Typography>
                  </View>
                )}
              </View>
            </View>
          </ImageBackground>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.ui.background,
  },
  searchContainerStyle: {
    backgroundColor: 'white',
    borderRadius: moderateScale(16),
    height: horizontalScale(50),
    borderColor: colors.ui.background,
  },
  heroContainer: {
    flex: 1,
    width: '100%',
  },
  heroTextContainer: {
    width: '100%',
    justifyContent: 'flex-start',
    marginTop: moderateScale(16),
  },
  heroContent: {
    paddingHorizontal: horizontalScale(16),
    flex: 1,
    justifyContent: 'space-between',
    marginBottom: moderateScale(80),
  },
  heroTitle: {
    color: '#fff',
    fontWeight: '400',
    fontSize: fs(32),
  },
  heroSubtitle: {
    color: '#fff',
    fontWeight: '700',
    marginBottom: moderateScale(24),
    fontSize: fs(32),
  },
  searchContainer: {
    width: '100%',
    marginBottom: moderateScale(24),
    backgroundColor: 'transparent',
  },
  categoriesTitle: {
    color: '#fff',
    textAlign: 'center',
    marginVertical: moderateScale(16),
    fontWeight: '700',
  },
  categoriesContainer: {
    flexDirection: 'row',
    width: '100%',
    borderRadius: moderateScale(16),
    justifyContent: 'space-evenly',
    paddingVertical: moderateScale(16),
    marginBottom: moderateScale(24),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.20)',
    position: 'relative',
    overflow: 'hidden',
  },
  categoriesOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  categoriesTint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    zIndex: 2,
  },
  categoriesContent: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    position: 'relative',
    zIndex: 3,
  },
  categoryItem: {
    alignItems: 'center',
  },
  categoryIconWrapper: {
    backgroundColor: '#fff',
    borderRadius: moderateScale(8),
    padding: moderateScale(10),
    marginBottom: moderateScale(4),
  },
  categoryLabel: {
    color: '#fff',
    fontWeight: '500',
  },
  ratingContainer: {
    backgroundColor: 'white',
    borderRadius: 200,
    paddingHorizontal: horizontalScale(12),
    paddingVertical: moderateScale(5),
    marginTop: moderateScale(24),
    marginBottom: moderateScale(17),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    alignSelf: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starIcon: {
    marginHorizontal: 1,
  },
  ratingText: {
    color: 'black',
    fontSize: fs(12),
    fontWeight: '700',
    fontFamily: 'Manrope-Bold',
  },
  ratingLabel: {
    color: 'black',
    fontSize: fs(12),
    fontWeight: '700',
    fontFamily: 'Manrope-Bold',
    marginRight: 8,
  },
  smallText: {
    fontSize: fs(12),
  },
  clearButton: {
    padding: moderateScale(5),
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: moderateScale(12),
  },
  productImage: {
    borderRadius: moderateScale(4),
  },
  productInfo: {
    marginLeft: moderateScale(12),
    flex: 1,
  },
  productTitle: {
    fontSize: fs(14),
    color: colors.ui.text.primary,
  },
  productPrice: {
    color: colors.ui.text.secondary,
    marginTop: moderateScale(2),
  },
});
