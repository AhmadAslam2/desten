import { useQuery } from '@apollo/client';
import { GET_ALL_PRODUCTS_OF_A_VENDOR } from '../api/queries';

interface Product {
  id: string;
  title: string;
  description: string;
  handle: string;
  vendor: string;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  variants: {
    edges: Array<{
      node: {
        id: string;
        title: string;
        price: {
          amount: string;
          currencyCode: string;
        };
      };
    }>;
  };
  images: {
    edges: Array<{
      node: {
        url: string;
        altText: string;
      };
    }>;
  };
  metafields: Array<{
    namespace: string;
    key: string;
    value: string;
    type: string;
  }>;
}

interface ProductsByVendorData {
  products: {
    edges: Array<{
      node: Product;
    }>;
  };
}

export const useProductsByVendor = (vendor: string | null) => {
  const { data, loading, error } = useQuery<ProductsByVendorData>(GET_ALL_PRODUCTS_OF_A_VENDOR, {
    variables: {
      query: vendor ? `vendor:${vendor}` : '',
      first: 20, // You can adjust this number based on your needs
    },
    skip: !vendor,
  });

  return {
    products: data?.products.edges.map(edge => edge.node) || [],
    loading,
    error,
  };
};
