import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, SectionList, FlatList, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Typography } from '../components/typography/Typography';
import { colors } from '../theme/colors';
import {
  ArrowRight,
  SearchIcon,
  PlaystationIcon,
  GooglePlayIcon,
  AmazonIcon,
} from '../assets/icons';
import { verticalScale } from '../utils/responsive';
import CustomTextInput from '../components/common/TextInput';
import { SmallProductCard } from '../components/ProductCard';
import { TOP_CATEGORIES } from '../utils/constants';
import { useCollectionProducts } from '../hooks/useCollectionProducts';
import FavouriteCard from '../components/FavouriteCard';
import { useProducts } from '../hooks/useProducts';
import { HotDealProductCard } from '../components/HotDealProductCard';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

const FAVOURITES_DATA = [
  {
    id: '1',
    text: 'Google Play',
    icon: <GooglePlayIcon />,
    collectionHandle: 'google-play-guthaben-kaufen',
    collectionTitle: 'Google Play Gutschein',
  },
  {
    id: '2',
    text: 'Playstation',
    icon: <PlaystationIcon width={40} height={24} />,
    collectionHandle: 'psn-guthaben-kaufen',
    collectionTitle: 'PSN Guthaben',
  },
  {
    id: '3',
    text: 'Amazon',
    icon: <AmazonIcon />,
    collectionHandle: 'amazon-gutschein-kaufen',
    collectionTitle: 'Amazon Gutschein',
  },
];

const ShopScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { products: searchResults, loading: searchLoading } = useProducts(searchQuery);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  // Create hooks for each category at the top level
  const categoryProducts = TOP_CATEGORIES.map(category => {
    const result = useCollectionProducts(category.collectionHandle);
    return {
      category,
      ...result,
    };
  });

  // Create sections data using the category products
  const sections = React.useMemo(() => {
    return categoryProducts.map(({ category, products, loading }) => ({
      title: category.label,
      data: products,
      Icon: category.Icon,
      loading,
    }));
  }, [categoryProducts]);

  // Get the first product for the hot deal (customize as needed)
  const hotDealProduct = sections[0]?.data?.[0];

  // Split sections
  const firstSection = sections[0];
  const restSections = sections.slice(1);

  const renderCategoryHeader = ({
    section: { title, Icon },
  }: {
    section: { title: string; Icon: any };
  }) => {
    const category = TOP_CATEGORIES.find(cat => cat.label === title);
    return (
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Typography variant="h2" style={styles.vendorTitle}>
            {title}
          </Typography>
        </View>
        <TouchableOpacity
          style={{ flexDirection: 'row', alignItems: 'center', marginRight: 16 }}
          onPress={() => {
            if (category) {
              navigation.navigate('Products', {
                collectionHandle: category.collectionHandle,
                collectionTitle: category.label,
              });
            }
          }}
        >
          <Typography
            variant="p"
            style={{ marginRight: 4, color: colors.primary[500], fontWeight: '500' }}
          >
            View All
          </Typography>
          <ArrowRight height={20} width={20} />
        </TouchableOpacity>
      </View>
    );
  };

  const renderProductRow = ({
    item,
    index,
    section,
  }: {
    item: any;
    index: number;
    section: any;
  }) => {
    const startIndex = index * 2;
    const items = section.data.slice(startIndex, startIndex + 2);

    // Don't render if we've reached the end of the section
    if (startIndex >= section.data.length) {
      return null;
    }

    return (
      <View style={styles.productRow}>
        {items.map((product: any, idx: number) => (
          <View key={product.id} style={styles.productItemContainer}>
            <SmallProductCard product={product} />
          </View>
        ))}
      </View>
    );
  };

  const renderFavourites = () => (
    <View style={styles.favouritesContainer}>
      <Typography variant="h3" style={styles.favouritesTitle}>
        Favourites
      </Typography>
      <View style={{ position: 'relative', borderRadius: 0 }}>
        <FlatList
          data={FAVOURITES_DATA}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <FavouriteCard
              icon={item.icon}
              text={item.text}
              onPress={() => {
                navigation.navigate('Products', {
                  collectionHandle: item.collectionHandle,
                  collectionTitle: item.collectionTitle,
                });
              }}
            />
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
          snapToInterval={160}
          decelerationRate="fast"
          bounces={false}
        />
      </View>
    </View>
  );

  const renderHeader = () => {
    const totalProducts = searchQuery
      ? searchResults.length
      : sections.reduce((acc, section) => acc + section.data.length, 0);

    return (
      <View style={{ backgroundColor: colors.primary[0], paddingBottom: 16 }}>
        <View style={styles.headerSection}>
          {renderFavourites()}
          <View style={styles.filterSearchRow}>
            {/* <TouchableOpacity style={styles.filterButton}>
              <FilterIcon />
              <Typography variant="label" style={styles.filterButtonText}>
                Sort and Filter
              </Typography>
            </TouchableOpacity> */}
            <CustomTextInput
              placeholder="Search"
              value={searchQuery}
              onChangeText={setSearchQuery}
              leftIcon={<SearchIcon width={20} height={20} />}
              containerStyle={{
                borderColor: colors.primary[0],
                backgroundColor: colors.primary[0],
                borderRadius: 8,
                height: verticalScale(34),
                flex: 1,
              }}
            />
          </View>
          <Typography variant="label" style={styles.productCount}>
            {categoryProducts.some(cp => cp.loading) || searchLoading
              ? 'Loading...'
              : `Showing ${totalProducts} products`}
          </Typography>
        </View>
      </View>
    );
  };

  const renderContent = () => {
    if (searchQuery) {
      return (
        <View style={styles.searchResultsContainer}>
          <Typography variant="h2" style={styles.vendorTitle}>
            Search Results
          </Typography>
          <FlatList
            data={searchResults}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <View style={styles.productItemContainer}>
                <SmallProductCard product={item} />
              </View>
            )}
            numColumns={2}
            contentContainerStyle={styles.searchResultsContent}
            ListEmptyComponent={
              <Typography variant="p" style={styles.noResultsText}>
                {searchLoading ? 'Searching...' : 'No products found'}
              </Typography>
            }
            onScrollBeginDrag={() => Keyboard.dismiss()}
          />
        </View>
      );
    }

    if (categoryProducts.some(cp => cp.loading)) {
      return (
        <View style={styles.loadingContainer}>
          <Typography variant="p" style={styles.loadingText}>
            Loading...
          </Typography>
        </View>
      );
    }

    return (
      <>
        <SectionList
          sections={[firstSection]}
          renderItem={renderProductRow}
          renderSectionHeader={renderCategoryHeader}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          stickySectionHeadersEnabled={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.sectionListContent}
          getItemLayout={(data, index) => ({
            length: 200,
            offset: 200 * index,
            index,
          })}
          onScrollBeginDrag={() => Keyboard.dismiss()}
          ListFooterComponent={
            hotDealProduct ? (
              <>
                <View style={{ paddingHorizontal: 16 }}>
                  <HotDealProductCard product={hotDealProduct} />
                </View>
                <SectionList
                  sections={restSections}
                  renderItem={renderProductRow}
                  renderSectionHeader={renderCategoryHeader}
                  keyExtractor={(item, index) => `${item.id}-${index}`}
                  stickySectionHeadersEnabled={false}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.sectionListContent}
                  getItemLayout={(data, index) => ({
                    length: 200,
                    offset: 200 * index,
                    index,
                  })}
                  onScrollBeginDrag={() => Keyboard.dismiss()}
                />
              </>
            ) : null
          }
        />
      </>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      {renderContent()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.ui.background,
    borderBottomRightRadius: 16,
    borderBottomLeftRadius: 16,
    overflow: 'hidden',
  },
  headerSection: {
    backgroundColor: colors.ui.background,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomRightRadius: 16,
    borderBottomLeftRadius: 16,
    overflow: 'hidden',
  },
  favouritesContainer: {
    backgroundColor: colors.primary[0],
    borderRadius: 16,
    paddingVertical: 16,
  },
  favouritesTitle: {
    color: colors.primary[500],
    marginBottom: 16,
    marginLeft: 16,
  },
  filterSearchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
    gap: 24,
  },
  filterButton: {
    flexDirection: 'row',
    backgroundColor: colors.primary[0],
    alignItems: 'center',
    paddingHorizontal: 8,
    height: verticalScale(34),
    borderRadius: 8,
  },
  filterButtonText: {
    marginLeft: 8,
  },
  productCount: {
    color: colors.grey[300],
  },
  productRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 16,
    marginBottom: 16,
  },
  productItemContainer: {
    flex: 1,
  },
  sectionListContent: {
    backgroundColor: colors.primary[0],
  },
  vendorTitle: {
    color: colors.black[100],
    paddingHorizontal: 16,
    fontWeight: '500',
    marginBottom: 16,
    marginTop: 8,
  },
  searchResultsContainer: {
    flex: 1,
    backgroundColor: colors.primary[0],
  },
  searchResultsContent: {
    padding: 16,
    gap: 16,
  },
  noResultsText: {
    textAlign: 'center',
    color: colors.grey[300],
    marginTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: verticalScale(32),
  },
  loadingText: {
    color: colors.grey[300],
  },
});

export default ShopScreen;
