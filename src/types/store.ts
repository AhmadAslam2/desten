export interface Store {
  id: string;
  name: string;
  url: string;
  accessToken: string;
  language: string;
  currency: string;
  isActive: boolean;
  location?: {
    country: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
}

export interface StoreState {
  stores: Store[];
  currentStore: Store | null;
  isLoading: boolean;
  error: string | null;
}
