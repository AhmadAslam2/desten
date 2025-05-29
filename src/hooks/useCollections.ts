import { useQuery } from '@apollo/client';
import { GET_COLLECTIONS } from '../api/queries';

export const useCollections = (searchQuery: string) => {
  const { data, loading, error, fetchMore, refetch } = useQuery(GET_COLLECTIONS, {
    variables: {
      first: 10,
      after: null,
    },
  });

  const allCollections =
    data?.collections?.edges?.map((edge: any) => ({
      ...edge.node,
      handle: edge.node.handle,
    })) || [];

  const collections = searchQuery
    ? allCollections.filter((collection: any) =>
        collection.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allCollections;
  const hasNextPage = data?.collections?.pageInfo?.hasNextPage || false;
  const endCursor = data?.collections?.pageInfo?.endCursor;

  const loadMore = () => {
    if (hasNextPage) {
      fetchMore({
        variables: {
          after: endCursor,
        },
      });
    }
  };

  return {
    collections,
    loading,
    error,
    hasNextPage,
    loadMore,
    refetch,
  };
};
