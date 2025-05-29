import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MMKV } from 'react-native-mmkv';
import { StoreState } from '../types/store';
import { stores } from '../config/stores';
import { useTranslation } from './useTranslation';
import { findNearestStore } from '../utils/location';
import * as Location from 'expo-location';

const storeStorage = new MMKV({
  id: 'store-storage',
  encryptionKey: 'your-store-encryption-key',
});

interface StoreActions {
  switchStore: (storeUrl: string) => void;
  setError: (error: string | null) => void;
  setStoreLanguage: (language: string) => void;
  initializeStore: () => Promise<void>;
}

// Find the default store (terdcom.myshopify.com)
const defaultStore = stores[0];
const initialState: StoreState = {
  stores: stores.map(store => ({
    id: store.id,
    name: store.name,
    url: store.url,
    accessToken: store.accessToken,
    language: store.language,
    currency: 'EUR',
    isActive: true,
    location: store.location,
  })),
  currentStore: null,
  isLoading: false,
  error: null,
};

export const useStore = create<StoreState & StoreActions>()(
  persist(
    set => ({
      ...initialState,

      initializeStore: async () => {
        try {
          set({ isLoading: true, error: null });

          // Request location permissions
          const { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            // Set default store if permission denied

            useTranslation.getState().setLanguage(defaultStore.language);
            set({
              currentStore: defaultStore,
              isLoading: false,
              error: null,
            });
            return;
          }

          // Get current location
          const location = await Location.getCurrentPositionAsync({});
          const { latitude, longitude } = location.coords;

          // Find nearest store
          const nearestStore = findNearestStore(initialState.stores, latitude, longitude);

          if (nearestStore) {
            useTranslation.getState().setLanguage(defaultStore.language);
            set({
              currentStore: defaultStore,
              isLoading: false,
              error: null,
            });
          } else {
            // Set default store if no nearest store found
            useTranslation.getState().setLanguage(defaultStore.language);
            set({
              currentStore: defaultStore,
              isLoading: false,
              error: null,
            });
          }
        } catch (error) {
          // Set default store if any error occurs
          useTranslation.getState().setLanguage(defaultStore.language);
          set({
            currentStore: defaultStore,
            isLoading: false,
            error: null,
          });
        }
      },

      switchStore: storeId => {
        set(state => {
          const store = state.stores.find(s => s.id === storeId);
          if (!store) {
            return { error: 'Store not found' };
          }
          useTranslation.getState().setLanguage(store.language);

          return {
            currentStore: store,
            error: null,
          };
        });
      },

      setStoreLanguage: (language: string) => {
        set(state => {
          if (!state.currentStore) return state;

          const updatedStore = {
            ...state.currentStore,
            language,
          };

          // Update the store in the stores array
          const updatedStores = state.stores.map(store =>
            store.url === state.currentStore?.url ? updatedStore : store
          );

          // Update the translation language
          useTranslation.getState().setLanguage(language);

          return {
            stores: updatedStores,
            currentStore: updatedStore,
          };
        });
      },

      setError: error => set({ error }),
    }),
    {
      name: 'store-storage',
      storage: {
        getItem: name => {
          const value = storeStorage.getString(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: (name, value) => {
          storeStorage.set(name, JSON.stringify(value));
        },
        removeItem: name => {
          storeStorage.delete(name);
        },
      },
    }
  )
);
