import { create } from "zustand";
import { persist } from "zustand/middleware";
import { axiosInstance } from "../lib/axios";
import { AxiosError } from "axios";

// -------------------- Types --------------------

interface User {
  _id: string;
  name: string;
  email: string;
  // Add any other user fields you use
}

interface AuthData {
  email: string;
  password: string;
  name?: string;
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
          console.log(axiosError.response?.data || axiosError.message);
          set({ Authuser: null });
        } finally {
          set({ isCheckingAuth: false });
        }
      },

      signup: async (data: AuthData) => {
        let res;
        set({ isSignedUp: true });

        try {
          res = await axiosInstance.post<ApiResponse<User>>("/api/v1/user/signup", data);
          set({ Authuser: res.data.data });
          return res.data.data;
        } catch (error) {
          const axiosError = error as AxiosError;
          console.log(axiosError.response?.data || axiosError.message);
          throw error;
        } finally {
          set({ isSignedUp: false });
        }
      },

      signin: async (data: AuthData) => {
        let res;
        set({ isLogined: true });

        try {
          console.log("Signin data:", data);
          res = await axiosInstance.post<ApiResponse<User>>("/api/v1/user/signin", data);
          console.log(res);
          set({ Authuser: res.data.data });
          return res.data.data;
        } catch (error) {
          const axiosError = error as AxiosError;
          console.log(axiosError.response?.data || axiosError.message);
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
          console.log(axiosError.response?.data || axiosError.message);
        }
      },
      verifyDomain: async ()=>{
        try {
          await axiosInstance.post("/api/")


        } catch (error) {
          console.log(error || "error occure");
        }

      }



    }),
    {
      name: "user-auth-store", // Key in localStorage
    }
  )
);
