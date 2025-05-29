import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Typography } from '../components/typography/Typography';
import CustomTextInput from '../components/common/TextInput';
import { ProductSlider } from '../components/ProductSlider';
import { ProductCard } from '../components/ProductCard';
import { useProducts } from '../hooks/useProducts';
import { useCollections } from '../hooks/useCollections';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { SearchIcon } from '../assets/icons';
import { colors } from '../theme/colors';
import { fs, horizontalScale, moderateScale, verticalScale } from '../utils/responsive';
import { debounce } from 'lodash';
import { Ionicons } from '@expo/vector-icons';
import { TOP_CATEGORIES } from '../utils/constants';
import { SearchResultsDropdown } from '../components/SearchResultsDropdown';

type CategoriesScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

type Collection = {
  id: string;
  title: string;
  handle: string;
};

export const CategoriesScreen = () => {
  const navigation = useNavigation<CategoriesScreenNavigationProp>();
  const { products, loading } = useProducts();
  const [inputValue, setInputValue] = useState('');
  const [showResults, setShowResults] = useState(false);
  const { collections, loading: collectionsLoading, refetch } = useCollections(inputValue);
  const bestsellerProducts = products.slice(0, 10);
  const debouncedSearch = useMemo(
    () =>
      debounce((text: string) => {
        setShowResults(true);
        refetch();
      }, 500),
    [refetch]
  );

  const handleSearch = useCallback(
    (text: string) => {
      setInputValue(text);
      if (text) {
        debouncedSearch(text);
      } else {
        setShowResults(false);
      }
    },
    [debouncedSearch]
  );

  const handleInputFocus = useCallback(() => {
    if (inputValue) {
      setShowResults(true);
    }
  }, [inputValue]);

  const handleBackgroundPress = useCallback(() => {
    console.log('>>>');
    // Keyboard.dismiss();
    // setShowResults(false);
  }, []);

  const handleInputBlur = useCallback(() => {
    setShowResults(false);
  }, []);

  const handleClearSearch = useCallback(() => {
    setInputValue('');
    setShowResults(false);
  }, []);

  const handleCollectionSelect = useCallback(
    (collection: { id: string; title: string; handle: string }) => {
      setShowResults(false);
      Keyboard.dismiss();
      navigation.navigate('MainTabs', {
        screen: 'Shop',
        params: {
          collectionHandle: collection.handle,
          collectionTitle: collection.title,
        },
      });
    },
    [navigation]
  );

  const renderItem = ({ item }: { item: any }) => {
    return (
      <View style={styles.productCardContainer}>
        <ProductCard product={item} />
      </View>
    );
  };

  const renderLoadingSkeleton = () => {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.loadingCard}>
          <View style={styles.loadingImage} />
          <View style={styles.loadingTextContainer}>
            <View style={styles.loadingTitle} />
            <View style={styles.loadingPrice} />
          </View>
        </View>
        <View style={styles.loadingCard}>
          <View style={styles.loadingImage} />
          <View style={styles.loadingTextContainer}>
            <View style={styles.loadingTitle} />
            <View style={styles.loadingPrice} />
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* <TouchableWithoutFeedback onPress={handleBackgroundPress} accessible={false}> */}
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
        scrollEnabled={!showResults}
      >
        <View style={styles.header}>
          <Typography variant="h1" style={styles.title}>
            Search categories
          </Typography>
          <Typography variant="p" style={styles.subtitle}>
            Wenn du mehr als 150€ in den letzten 30 Tagen bestellt hast, musst du dich zwingend wie
            folgt verifizieren, um deinen Code zu erhalten:
          </Typography>
          <View style={styles.searchBarContainer}>
            <CustomTextInput
              onBlur={handleInputBlur}
              placeholder="Search categories"
              value={inputValue}
              onChangeText={handleSearch}
              onFocus={handleInputFocus}
              leftIcon={<SearchIcon width={moderateScale(20)} height={moderateScale(20)} />}
              rightIcon={
                inputValue ? (
                  <TouchableOpacity onPress={handleClearSearch} style={styles.clearButton}>
                    <Ionicons name="close-circle" size={20} color={colors.primary[500]} />
                  </TouchableOpacity>
                ) : null
              }
              style={styles.searchInput}
              containerStyle={styles.searchContainer}
            />
            {showResults && inputValue && (
              <SearchResultsDropdown<Collection>
                scrollViewStyle={{
                  maxHeight: verticalScale(210),
                }}
                onItemPress={handleCollectionSelect}
                results={collections}
                visible={showResults && inputValue.length > 0}
                containerStyle={styles.searchResultsContainer}
                itemStyle={styles.searchResultItem}
                renderItem={collection => (
                  <TouchableOpacity onPress={() => handleCollectionSelect(collection)}>
                    <Typography variant="p" style={styles.searchResultLabel}>
                      {collection.title}
                    </Typography>
                  </TouchableOpacity>
                )}
              />
            )}
          </View>
        </View>
        <View style={styles.categoriesBox}>
          <View
            style={{
              flexWrap: 'wrap',
              flexDirection: 'row',
              gap: moderateScale(16),
              alignItems: 'center',
              alignContent: 'center',
              justifyContent: 'center',
            }}
          >
            {TOP_CATEGORIES.map(({ key, label, Icon, collectionHandle }) => (
              <TouchableOpacity
                activeOpacity={0.8}
                key={key}
                style={styles.categoryItem}
                onPress={() => {
                  navigation.navigate('Products', {
                    collectionHandle,
                    collectionTitle: label,
                  });
                }}
              >
                <View style={styles.categoryIconWrapper}>
                  <Icon
                    width={moderateScale(40)}
                    height={moderateScale(40)}
                    stroke="#FFFFFF"
                    fill="none"
                  />
                </View>
                <Typography variant="pxs" style={styles.categoryLabel}>
                  {label}
                </Typography>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <Typography variant="h1" style={styles.bestsellersTitle}>
          Bestsellers
        </Typography>
        <View style={styles.sliderContainer}>
          {loading
            ? renderLoadingSkeleton()
            : bestsellerProducts.length > 0 && (
                <ProductSlider data={bestsellerProducts} renderItem={renderItem} />
              )}
        </View>
      </ScrollView>
      {/* </TouchableWithoutFeedback> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.ui.background,
    paddingBottom: moderateScale(60),
  },
  scrollContent: {
    backgroundColor: colors.primary[0],
  },
  header: {
    backgroundColor: colors.primary[100],
    paddingHorizontal: moderateScale(16),
    paddingTop: moderateScale(40),
    borderBottomLeftRadius: moderateScale(16),
    borderBottomRightRadius: moderateScale(16),
  },
  title: {
    color: colors.primary[500],
    fontWeight: '400',
    fontFamily: 'Manrope-Regular',
  },
  subtitle: {
    color: colors.black[100],
    lineHeight: moderateScale(22.4),
  },
  searchBarContainer: {
    marginVertical: moderateScale(24),
  },
  searchContainer: {
    borderRadius: moderateScale(8),
    height: verticalScale(50),
    borderColor: colors.ui.background,
  },
  searchInput: {
    backgroundColor: '#fff',
    borderRadius: moderateScale(8),
    fontSize: fs(16),
  },
  categoriesBox: {
    backgroundColor: '#fff',
    borderRadius: moderateScale(16),
    margin: moderateScale(16),
    paddingVertical: moderateScale(24),
    paddingHorizontal: moderateScale(16),
  },
  categoryItem: {
    alignItems: 'center',
    paddingHorizontal: moderateScale(8),
  },
  categoryIconWrapper: {
    backgroundColor: colors.primary[500],
    borderRadius: moderateScale(12),
    padding: moderateScale(18),
  },
  categoryLabel: {
    color: colors.black[100],
    textAlign: 'center',
    fontWeight: '400',
    fontFamily: 'Manrope-Regular',
    marginTop: moderateScale(7),
  },
  bestsellersTitle: {
    color: colors.black[100],
    fontWeight: '400',
    fontFamily: 'Manrope-Regular',
    marginLeft: moderateScale(16),
    marginTop: moderateScale(6),
    marginBottom: moderateScale(24),
  },
  sliderContainer: {
    width: '100%',
  },
  productCardContainer: {
    padding: moderateScale(4),
    width: horizontalScale(255),
  },
  loadingContainer: {
    flexDirection: 'row',
    gap: moderateScale(16),
    paddingHorizontal: moderateScale(16),
  },
  loadingCard: {
    width: horizontalScale(255),
    backgroundColor: colors.ui.background,
    borderRadius: moderateScale(12),
    overflow: 'hidden',
  },
  loadingImage: {
    width: '100%',
    height: verticalScale(200),
    backgroundColor: colors.grey[200],
  },
  loadingTextContainer: {
    padding: moderateScale(12),
    gap: moderateScale(8),
  },
  loadingTitle: {
    width: '80%',
    height: verticalScale(20),
    backgroundColor: colors.grey[200],
    borderRadius: moderateScale(4),
  },
  loadingPrice: {
    width: '40%',
    height: verticalScale(16),
    backgroundColor: colors.grey[200],
    borderRadius: moderateScale(4),
  },
  searchResultsContainer: {
    borderRadius: moderateScale(8),
    borderWidth: 1,
    borderColor: colors.grey[200],
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchResultItem: {
    padding: moderateScale(12),
  },
  searchResultLabel: {
    fontSize: fs(14),
    color: colors.ui.text.primary,
  },
  clearButton: {
    padding: 4,
  },
});
export default CategoriesScreen;
