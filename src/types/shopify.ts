export interface Product {
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
  images: {
    edges: Array<{
      node: {
        url: string;
        altText: string | null;
      };
    }>;
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
  metafields: Array<{
    namespace: string;
    key: string;
    value: string;
    type: string;
  }>;
}

export interface ProductsResponse {
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
}

export interface MediaImage {
  id: string;
  url: string;
  altText?: string;
  width?: number;
  height?: number;
}

export interface Metafield {
  __typename: string;
  key: string;
  namespace: string;
  type: string;
  value: string;
}
