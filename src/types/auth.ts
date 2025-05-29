export interface Customer {
  id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
}

export interface AuthState {
  customer: Customer | null;
  accessToken: string | null;
  isAuthenticated: boolean;
} 