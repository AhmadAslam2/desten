import React, { useEffect } from 'react';
import {
  FlatList,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
  View,
  RefreshControl,
  Platform,
} from 'react-native';
import { useProducts } from '../hooks/useProducts';
import { SmallProductCard } from '../components/ProductCard';
import { Typography } from '../components/typography/Typography';
import { useTranslation } from '../store/useTranslation';
import { colors } from '../theme/colors';
import { fs, verticalScale, horizontalScale, moderateScale } from '../utils/responsive';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import { Image } from '../components/Image';
import { useImageColors } from '../hooks/useImageColors';
import { BackButton } from '../components/common/BackButton';

type ProductsScreenRouteProp = RouteProp<RootStackParamList, 'Products'>;

export const ProductsScreen = () => {
  const route = useRoute<ProductsScreenRouteProp>();
  const collectionHandle = route.params?.collectionHandle;
  const collectionTitle = route.params?.collectionTitle;
  const navigation = useNavigation();

  const { loading, error, products, hasNextPage, loadMore, refetch } = useProducts(
    '',
    collectionHandle,
    'BEST_SELLING'
  );
  const { t } = useTranslation();

  useEffect(() => {
    if (collectionHandle) {
      refetch();
    }
  }, [collectionHandle, refetch]);

  const handleLoadMore = () => {
    if (!loading && hasNextPage) {
      loadMore();
    }
  };

  const renderProductRow = ({ item, index }: { item: any; index: number }) => {
    const startIndex = index * 2;
    const items = products.slice(startIndex, startIndex + 2);

    // Don't render if we've reached the end of the section
    if (startIndex >= products.length) {
      return null;
    }

    return (
      <View style={styles.productRow}>
        {items.map((product: any) => (
          <SmallProductCard key={product.id} product={product} />
        ))}
      </View>
    );
  };

  const firstProductImage = products[0]?.images?.edges[0]?.node?.url;
  const imageColors = useImageColors(firstProductImage);
  const backgroundColor =
    Platform.OS === 'ios'
      ? `${imageColors?.background || colors.primary[0]}1A`
      : `${imageColors?.dominant || colors.primary[0]}1A`;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View
          style={[
            styles.imageGallery,
            { backgroundColor: loading ? colors.grey[100] : backgroundColor },
          ]}
        >
          <BackButton />
          <View style={styles.imageContainer}>
            {loading ? (
              <View style={[styles.mainImage, { backgroundColor: colors.grey[200] }]} />
            ) : firstProductImage ? (
              <Image
                source={firstProductImage}
                resizeMode="cover"
                width={horizontalScale(247)}
                height={verticalScale(170)}
                style={styles.mainImage}
              />
            ) : (
              <View style={[styles.mainImage, styles.placeholder]}>
                <ActivityIndicator size="small" />
              </View>
            )}
          </View>
        </View>
        {collectionTitle && (
          <Typography variant="h1" style={styles.title}>
            {collectionTitle}
          </Typography>
        )}
        <FlatList
          showsVerticalScrollIndicator={false}
          data={products}
          renderItem={renderProductRow}
          keyExtractor={item => item.id}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={refetch} />}
          ListFooterComponent={() => (loading ? <ActivityIndicator style={styles.loader} /> : null)}
          ListEmptyComponent={() =>
            !loading && (
              <View style={styles.emptyContainer}>
                <Typography variant="p" style={styles.emptyText}>
                  {t('screens.products.noProducts')}
                </Typography>
              </View>
            )
          }
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.ui.background,
  },
  content: {
    flex: 1,
    backgroundColor: colors.primary[0],
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
  placeholder: {
    backgroundColor: colors.primary[100],
  },
  title: {
    fontSize: fs(24),
    fontWeight: '500',
    paddingHorizontal: 16,
    paddingTop: 16,
    color: colors.black[100],
  },
  productRow: {
    flexDirection: 'row',
    gap: 16,
  },
  listContent: {
    padding: 16,
    gap: 16,
  },
  loader: {
    marginVertical: 20,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyText: {
    textAlign: 'center',
    color: colors.primary[700],
  },
});
