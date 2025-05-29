import { useEffect } from 'react';
import { useStore } from '../store/useStore';
import { stores } from '../config/stores';

export const useStoreInitialization = () => {
  const { initializeStore, currentStore, isLoading } = useStore();
  useEffect(() => {
    // Only initialize if there's no current store
    if (!currentStore) {
      initializeStore().catch(() => {
        // Silently fall back to the first store if initialization fails
        const defaultStore = stores[0];
        useStore.getState().switchStore(defaultStore.url);
      });
    }
  }, [currentStore, initializeStore]);

  return {
    isLoading,
    currentStore,
  };
};
