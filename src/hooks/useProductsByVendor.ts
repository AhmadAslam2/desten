import { useQuery } from '@apollo/client';
import { GET_PRODUCTS_BY_VENDOR } from '../api/queries';
import { Product } from '../types/shopify';

interface ProductsByVendor {
  [vendor: string]: Product[];
}

export const useProductsByVendor = () => {
  const { data, loading, error } = useQuery(GET_PRODUCTS_BY_VENDOR, {
    variables: {
      first: 50, // Adjust this number based on your needs
      query: '', // Empty query to get all products
    },
  });

  const productsByVendor: ProductsByVendor = {};

  if (data?.products?.edges) {
    data.products.edges.forEach(({ node }: { node: Product }) => {
      if (!productsByVendor[node.vendor]) {
        productsByVendor[node.vendor] = [];
      }
      productsByVendor[node.vendor].push(node);
    });
  }

  return {
    productsByVendor,
    loading,
    error,
  };
};
