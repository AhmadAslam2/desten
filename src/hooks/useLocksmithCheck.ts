import { useState, useEffect } from 'react';
import axios from 'axios';
import { useStore } from '../store/useStore';

// Get the current store URL from the store state
const getCurrentStoreUrl = () => {
  const currentStore = useStore.getState().currentStore;
  return currentStore ? `https://${currentStore.url}` : 'https://example-store.myshopify.com';
};

const SHOPIFY_STORE_URL = getCurrentStoreUrl();

interface LocksmithResponse {
  [key: string]: {
    locked: boolean;
    access_granted: boolean;
    access_denied: boolean;
    hide_resource: boolean;
  };
}

export const useLocksmithCheck = (productPath: string | null) => {
  const [isLocked, setIsLocked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const currentStore = useStore(state => state.currentStore);

  useEffect(() => {
    if (!productPath) {
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    const controller = new AbortController();

    const checkLocksmith = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Using object format for URLs as mentioned in the documentation
        const params = {
          urls: {
            0: productPath,
          },
        };
        const apiUrl = `${SHOPIFY_STORE_URL}/apps/locksmith/api/resources`;
        const response = await axios.get(apiUrl, {
          params,
          signal: controller.signal,
          timeout: 5000, // 5 second timeout
          paramsSerializer: params => {
            // Custom serializer to handle the object format correctly
            const result = new URLSearchParams();
            for (const key in params.urls) {
              result.append(`urls[${key}]`, params.urls[key]);
            }
            return result.toString();
          },
        });

        // Only update state if component is still mounted
        if (!isMounted) return;

        try {
          // The response data is already an object
          const data = response.data as LocksmithResponse;

          // Check if product is locked and access is denied
          if (data[productPath]) {
            const resourceStatus = data[productPath];
            setIsLocked(resourceStatus.locked && resourceStatus.access_denied);
          } else {
            // If we get a response but the product path is not in the result, assume not locked
            setIsLocked(false);
          }
        } catch (parseError) {
          console.error('Failed to parse Locksmith API response:', parseError);
          setError('Failed to parse access data');
        }
      } catch (err) {
        if (!isMounted) return;

        console.error('Locksmith check failed:', err);

        // Handle different error types
        if (axios.isAxiosError(err)) {
          if (err.code === 'ECONNABORTED') {
            setError('Connection timed out');
          } else if (!navigator.onLine) {
            setError('No internet connection');
          } else {
            setError('Failed to check product access');
          }
        } else {
          setError('An unexpected error occurred');
        }

        // In case of error, don't block the user from seeing the product
        setIsLocked(false);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    checkLocksmith();

    // Cleanup function
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [productPath, currentStore]); // Added currentStore to dependencies

  return { isLocked, isLoading, error };
};
