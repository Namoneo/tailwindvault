export interface User {
  id: number;
  email: string;
  name: string;
  role: 'admin' | 'customer';
  createdAt?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}
