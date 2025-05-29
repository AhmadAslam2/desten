import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MMKV } from 'react-native-mmkv';
import { AuthState } from '../types/auth';

const authStorage = new MMKV({
  id: 'auth-storage',
  encryptionKey: 'your-auth-encryption-key', // Use a secure key in production
});

interface AuthStore extends AuthState {
  loading: boolean;
  error: string | null;
  authState: AuthState;
  login: (
    email: string,
    password: string,
    loginMutation: any,
    getCustomerQuery: any
  ) => Promise<void>;
  signup: (
    input: {
      email: string;
      password: string;
      firstName?: string;
      lastName?: string;
    },
    signupMutation: any
  ) => Promise<void>;
  logout: () => Promise<void>;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
}

const initialState: Omit<AuthStore, 'login' | 'signup' | 'logout' | 'setError' | 'setLoading'> = {
  customer: null,
  accessToken: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  authState: {
    customer: null,
    accessToken: null,
    isAuthenticated: false,
  },
};

export const useAuth = create<AuthStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      login: async (email: string, password: string, loginMutation: any, getCustomerQuery: any) => {
        try {
          set({ loading: true, error: null });

          const { data } = await loginMutation({
            variables: {
              input: {
                email,
                password,
              },
            },
          });
          if (data.customerAccessTokenCreate.customerUserErrors.length > 0) {
            throw new Error(data.customerAccessTokenCreate.customerUserErrors[0].message);
          }

          const { accessToken } = data.customerAccessTokenCreate.customerAccessToken;

          // Fetch customer data
          const { data: customerData } = await getCustomerQuery({
            variables: { customerAccessToken: accessToken },
          });

          const newAuthState = {
            customer: customerData.customer,
            accessToken,
            isAuthenticated: true,
          };

          set({
            ...newAuthState,
            authState: newAuthState,
            loading: false,
            error: null,
          });
        } catch (err) {
          set({
            error: err instanceof Error ? err.message : 'Login failed',
            loading: false,
          });
          throw err;
        }
      },

      signup: async (input, signupMutation) => {
        try {
          set({ loading: true, error: null });

          const { data } = await signupMutation({
            variables: { input },
          });
          if (data.customerCreate.customerUserErrors.length > 0) {
            throw new Error(data.customerCreate.customerUserErrors[0].message);
          }
          set({ loading: false, error: null });
        } catch (err) {
          set({
            error: err instanceof Error ? err.message : 'Signup failed',
            loading: false,
          });
          throw err;
        }
      },
      logout: async () => {
        const newAuthState = {
          customer: null,
          accessToken: null,
          isAuthenticated: false,
        };
        set({
          ...newAuthState,
          authState: newAuthState,
          loading: false,
          error: null,
        });
      },

      setError: error => set({ error }),
      setLoading: loading => set({ loading }),
    }),
    {
      name: 'auth-storage',
      storage: {
        getItem: name => {
          const value = authStorage.getString(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: (name, value) => {
          authStorage.set(name, JSON.stringify(value));
        },
        removeItem: name => {
          authStorage.delete(name);
        },
      },
      // Only persist these fields
      partialize: (state: AuthStore) => ({
        customer: state.customer,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
        authState: state.authState,
        loading: false,
        error: null,
      }),
    }
  )
);
