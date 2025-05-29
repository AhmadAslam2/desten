import { useQuery } from '@apollo/client';
import { GET_PRODUCTS, GET_COLLECTION_PRODUCTS } from '../api/queries';
import { useStore } from '../store/useStore';

const ITEMS_PER_PAGE = 10;

export const useProducts = (
  searchQuery: string = '',
  collectionHandle?: string,
  sortKey: string = 'BEST_SELLING'
) => {
  const { currentStore } = useStore();

  const {
    data: productsData,
    loading: productsLoading,
    error: productsError,
    fetchMore: productsFetchMore,
    refetch: productsRefetch,
  } = useQuery(GET_PRODUCTS, {
    variables: {
      first: ITEMS_PER_PAGE,
      query: searchQuery,
      sortKey,
    },
    skip: !currentStore || !!collectionHandle,
  });

  const {
    data: collectionData,
    loading: collectionLoading,
    error: collectionError,
    fetchMore: collectionFetchMore,
    refetch: collectionRefetch,
  } = useQuery(GET_COLLECTION_PRODUCTS, {
    variables: {
      handle: collectionHandle || '',
      first: ITEMS_PER_PAGE,
      sortKey,
    },
    skip: !currentStore || !collectionHandle,
  });

  const products = collectionHandle
    ? collectionData?.collection?.products?.edges.map((edge: any) => edge.node) || []
    : productsData?.products?.edges.map((edge: any) => edge.node) || [];

  const hasNextPage = collectionHandle
    ? collectionData?.collection?.products?.pageInfo.hasNextPage || false
    : productsData?.products?.pageInfo.hasNextPage || false;

  const endCursor = collectionHandle
    ? collectionData?.collection?.products?.pageInfo.endCursor
    : productsData?.products?.pageInfo.endCursor;

  const loadMore = () => {
    if (!hasNextPage || (productsLoading && collectionLoading)) return;

    if (collectionHandle) {
      collectionFetchMore({
        variables: {
          handle: collectionHandle,
          first: ITEMS_PER_PAGE,
          after: endCursor,
          sortKey,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;

          return {
            collection: {
              ...prev.collection,
              products: {
                ...fetchMoreResult.collection.products,
                edges: [
                  ...prev.collection.products.edges,
                  ...fetchMoreResult.collection.products.edges,
                ],
              },
            },
          };
        },
      });
    } else {
      productsFetchMore({
        variables: {
          first: ITEMS_PER_PAGE,
          after: endCursor,
          query: searchQuery,
          sortKey,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;

          return {
            products: {
              ...fetchMoreResult.products,
              edges: [...prev.products.edges, ...fetchMoreResult.products.edges],
            },
          };
        },
      });
    }
  };

  return {
    products,
    loading: productsLoading || collectionLoading,
    error: productsError || collectionError,
    hasNextPage,
    loadMore,
    refetch: collectionHandle ? collectionRefetch : productsRefetch,
  };
};
