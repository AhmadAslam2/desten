import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { stores } from '../config/stores';

// Create a function to create a new Apollo client with the current store's configuration
export const createApolloClient = (storeUrl: string, accessToken: string) => {
  const httpLink = createHttpLink({
    uri: `https://${storeUrl}/api/2024-01/graphql.json`,
  });

  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        'X-Shopify-Storefront-Access-Token': accessToken,
      },
    };
  });

  return new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });
};

export { stores };
