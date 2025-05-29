import { useQuery } from '@apollo/client';
import { GET_MEDIA_IMAGE } from '../api/queries';

interface MediaImageData {
  product: {
    metafield: {
      reference: {
        image: {
          url: string;
          altText: string;
          width: number;
          height: number;
        };
      };
    };
  };
}

export const useMediaImage = (productId: string | null) => {
  const { data, loading, error } = useQuery<MediaImageData>(GET_MEDIA_IMAGE, {
    variables: { productId },
    skip: !productId,
  });

  return {
    imageUrl: data?.product?.metafield?.reference?.image?.url,
    altText: data?.product?.metafield?.reference?.image?.altText,
    width: data?.product?.metafield?.reference?.image?.width,
    height: data?.product?.metafield?.reference?.image?.height,
    loading,
    error,
  };
};
