import zustand from 'zustand';
import { persist } from 'zustand/middleware';


interface UserAuthState {
  isAuthenticated: boolean;
  userId: string | null;
  setAuthentication: (isAuthenticated: boolean, userId?: string) => void;
}

export const useUserAuthStore = zustand<UserAuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      userId: null,
      setAuthentication: (isAuthenticated, userId) =>
        set({ isAuthenticated, userId }),
    }),
    {
      name: 'user-auth-storage', // unique name for the storage
      getStorage: () => localStorage, // use localStorage as the storage
    }
  )
);