import { create } from 'zustand';

interface AuthState {
  user: any | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  signIn: async (email: string, password: string) => {
    // Simulating authentication
    if (email === 'user@example.com' && password === 'password') {
      set({ user: { email, name: 'John Doe' } });
    } else {
      throw new Error('Invalid credentials');
    }
  },
  signOut: async () => {
    set({ user: null });
  },
}));