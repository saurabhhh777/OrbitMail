import { create } from "zustand";
import { persist } from "zustand/middleware";
import { axiosInstance } from "../lib/axios";
import { AxiosError } from "axios";

// -------------------- Types --------------------

interface User {
  _id: string;
  name: string;
  email: string;
  // Add other user fields as needed
}

interface AuthData {
  email: string;
  password: string;
}

interface DomainData {
  domain: string;
  // Add other fields if required for the domain
}

interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

interface AuthStore {
  Authuser: User | null;
  isLogined: boolean;
  isSignedUp: boolean;
  isUpdateProfile: boolean;
  isCheckingAuth: boolean;

  isDarkMode: boolean;
  temp: boolean;

  toggleDarkMode: () => void;

  checkAuth: () => Promise<void>;
  signup: (data: AuthData) => Promise<User>;
  signin: (data: AuthData) => Promise<User>;
  logout: () => Promise<void>;
  addDomain: (data: DomainData) => Promise<void>;
}

// -------------------- Store --------------------

export const userAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      Authuser: null,
      isLogined: false,
      isSignedUp: false,
      isUpdateProfile: false,
      isCheckingAuth: true,

      isDarkMode: true,
      temp: true,

      toggleDarkMode: () => {
        set((state) => ({ isDarkMode: !state.isDarkMode }));
        console.log("Dark mode toggled");
      },

      checkAuth: async () => {
        try {
          const res = await axiosInstance.get<ApiResponse<User>>("/api/v1/user/check");
          set({ Authuser: res.data.data });
        } catch (error) {
          const axiosError = error as AxiosError;
          console.error(axiosError.response?.data || axiosError.message);
          set({ Authuser: null });
        } finally {
          set({ isCheckingAuth: false });
        }
      },

      signup: async (data: AuthData) => {
        try {

          console.log("from the signup state:")

          set({ isSignedUp: true });
          const res = await axiosInstance.post<ApiResponse<User>>("/api/v1/user/signup", data);
          set({ Authuser: res.data.data });
          return res.data.data;
        } catch (error) {
          const axiosError = error as AxiosError;
          console.error(axiosError.response?.data || axiosError.message);
          throw error;
        } finally {
          set({ isSignedUp: false });
        }
      },

      signin: async (data: AuthData) => {
        try {
          set({ isLogined: true });
          const res = await axiosInstance.post<ApiResponse<User>>("/api/v1/user/signin", data);
          set({ Authuser: res.data.data });
          return res.data.data;
        } catch (error) {
          const axiosError = error as AxiosError;
          console.error(axiosError.response?.data || axiosError.message);
          throw error;
        } finally {
          set({ isLogined: false });
        }
      },

      logout: async () => {
        try {
          await axiosInstance.post("/api/v1/user/logout");
          set({ Authuser: null });
        } catch (error) {
          const axiosError = error as AxiosError;
          console.error(axiosError.response?.data || axiosError.message);
        }
      },

      addDomain: async (data: DomainData) => {
        try {
          await axiosInstance.post("/api/v1/userdomain/", data);
          console.log("Domain added successfully");
        } catch (error) {
          const axiosError = error as AxiosError;
          console.error(axiosError.response?.data || "Failed to add domain");
          throw error;
        }
      },
    }),
    {
      name: "user-auth-store",
    }
  )
);
