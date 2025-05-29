import { useQuery } from '@apollo/client';
import { GET_COLLECTION_PRODUCTS } from '../api/queries';
import { Product } from '../types/shopify';

interface CollectionProductsData {
  collection: {
    id: string;
    title: string;
    products: {
      pageInfo: {
        hasNextPage: boolean;
        hasPreviousPage: boolean;
        startCursor: string;
        endCursor: string;
      };
      edges: Array<{
        cursor: string;
        node: Product;
      }>;
    };
  };
}

export const useCollectionProducts = (
  collectionHandle: string | null,
  first: number = 6,
  sortKey: string = 'BEST_SELLING'
) => {
  const { data, loading, error, fetchMore, refetch } = useQuery<CollectionProductsData>(
    GET_COLLECTION_PRODUCTS,
    {
      variables: {
        handle: collectionHandle || '',
        first,
        sortKey,
      },
      skip: !collectionHandle,
    }
  );

  const products = data?.collection?.products?.edges.map(edge => edge.node) || [];
  const hasNextPage = data?.collection?.products?.pageInfo.hasNextPage || false;
  const endCursor = data?.collection?.products?.pageInfo.endCursor;

  const loadMore = () => {
    if (!hasNextPage || loading) return;

    fetchMore({
      variables: {
        handle: collectionHandle,
        first,
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
  };

  return {
    products,
    loading,
    error,
    hasNextPage,
    loadMore,
    refetch,
  };
};
