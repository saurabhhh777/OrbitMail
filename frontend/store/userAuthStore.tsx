import { create } from "zustand";
import { persist } from "zustand/middleware";
import { axiosInstance } from "../lib/axios";


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

// interface DomainData {
//   domain: string;
//   // Add other fields if required for the domain
// }

interface ApiResponse<T> {
  data?: T;
  user?: T;
  status?: number;
  message?: string;
  success?: boolean;
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

  // Authentication methods
  checkAuth: () => Promise<void>;
  signup: (data: AuthData) => Promise<any>;
  signin: (data: AuthData) => Promise<any>;
  logout: () => Promise<void>;
  
  // OAuth methods
  googleAuth: (code: string) => Promise<any>;
  githubAuth: (code: string) => Promise<any>;
  appleAuth: (data: any) => Promise<any>;
  
  // Domain methods
  addDomain: (domain: string) => Promise<any>;
  getAllDomain:()=> Promise<any>;
  verifyDomain:(domain:string)=>Promise<any>;
  getMxRecords: (domainId: string) => Promise<any>;
  
  // Email prefix methods
  addEmailPrefix: (domainId: string, prefix: string, password: string) => Promise<any>;
  removeEmailPrefix: (domainId: string, prefix: string) => Promise<any>;
  getEmailPrefixes: (domainId: string) => Promise<any>;
  
  // Email methods
  sendEmail: (emailData: any) => Promise<any>;
  getEmails: (userEmail: string) => Promise<any>;
  
  // Analytics methods
  getEmailAnalytics: (email: string, period: string, customDates?: { start: string; end: string }) => Promise<any>;
  
  // Payment methods
  getSubscriptionPlans: () => Promise<any>;
  getUserSubscription: () => Promise<any>;
  createPaymentOrder: (plan: string) => Promise<any>;
  verifyPayment: (paymentData: any) => Promise<any>;
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
          const res = await axiosInstance.get<ApiResponse<User>>("/api/v1/user/check-status", {
            withCredentials: true
          });
          if (res.data.data) {
            set({ Authuser: res.data.data });
          } else {
            set({ Authuser: null });
          }
        } catch (error) {
          console.log("Check auth error:", error);
          set({ Authuser: null });
        } finally {
          set({ isCheckingAuth: false });
        }
      },

      signup: async (data: AuthData) => {
        try {
          console.log("Signup data being sent:", data);

          set({ isSignedUp: true });
          const res = await axiosInstance.post<ApiResponse<User>>("/api/v1/user/signup", data , {
            withCredentials:true
          });
          if (res.data.user) {
            set({ Authuser: res.data.user });
          }
          return res
        } catch (error: any) {
          console.log("Signup error:", error);
          if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
          } else {
            throw new Error("Signup failed. Please try again.");
          }
        } finally {
          set({ isSignedUp: false });
        }
      },

      signin: async (data: AuthData) => {
        try {
          console.log("Signin Data from userAuthStore:", data);
          
          set({ isLogined: true });
          const res = await axiosInstance.post<ApiResponse<User>>("/api/v1/user/signin", data, {
            withCredentials: true
          });
          
          console.log("Signin response from State:", res);
          console.log("Response data structure:", res.data);

          if (res.data.user) {
            set({ Authuser: res.data.user, isLogined: true });
          }
          
          return res;
        } catch (error: any) {
          console.log("Signin error:", error);
          if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
          } else {
            throw new Error("Sign in failed. Please try again.");
          }
        } finally {
          set({ isLogined: false });
        }
      },

      logout: async () => {
        try {
          await axiosInstance.post("/api/v1/user/logout");
          set({ Authuser: null, isLogined: false });
        } catch (error) {
          console.log("Logout error:", error);
          // Even if the API call fails, clear the local state
          set({ Authuser: null, isLogined: false });
        }
      },

      addDomain: async (domain: string) => {
        try {
          const res = await axiosInstance.post("/api/v1/userdomain/", {
            domain: domain.trim()
          }, {
            withCredentials: true
          });
          console.log("Domain added successfully from state");
          return res;
        } catch (error: any) {
          console.log(error);
          throw new Error(error.response?.data?.message || "Failed to add domain");
        }
      },
      getAllDomain: async () => {
        try {
          const res = await axiosInstance.get("/api/v1/userdomain/", {
            withCredentials: true
          });

          console.log("Get all Domain of User:");
          console.log(res);

          return res.data; 
        } catch (error: any) {
          console.log(error);
          throw new Error(error.response?.data?.message || "Failed to fetch domains");
        }
      },
      verifyDomain: async (domain: string) => {
        try {
          const res = await axiosInstance.post("/api/v1/userdomain/verifymxrec", { domainId: domain }, {
            withCredentials: true
          });

          console.log("VerifyDomain from the State :");
          console.log(res);

          return res;
        } catch (error: any) {
          console.log(error);
          throw new Error(error.response?.data?.message || "Failed to verify domain");
        }
      },

      // OAuth methods
      googleAuth: async (code: string) => {
        try {
          const res = await axiosInstance.post("/api/v1/auth/google", { code }, {
            withCredentials: true
          });
          return res;
        } catch (error: any) {
          console.log(error);
          throw new Error(error.response?.data?.message || "Google authentication failed");
        }
      },

      githubAuth: async (code: string) => {
        try {
          const res = await axiosInstance.post("/api/v1/auth/github", { code }, {
            withCredentials: true
          });
          return res;
        } catch (error: any) {
          console.log(error);
          throw new Error(error.response?.data?.message || "GitHub authentication failed");
        }
      },

      appleAuth: async (data: any) => {
        try {
          const res = await axiosInstance.post("/api/v1/auth/apple", data, {
            withCredentials: true
          });
          return res;
        } catch (error: any) {
          console.log(error);
          throw new Error(error.response?.data?.message || "Apple authentication failed");
        }
      },

      // Domain methods
      getMxRecords: async (domainId: string) => {
        try {
          const res = await axiosInstance.get(`/api/v1/userdomain/${domainId}/mx-records`, {
            withCredentials: true
          });
          return res.data;
        } catch (error: any) {
          console.log(error);
          throw new Error(error.response?.data?.message || "Failed to get MX records");
        }
      },

      // Email prefix methods
      addEmailPrefix: async (domainId: string, prefix: string, password: string) => {
        try {
          const res = await axiosInstance.post(`/api/v1/userdomain/${domainId}/emails`, {
            prefix,
            password
          }, {
            withCredentials: true
          });
          return res.data;
        } catch (error: any) {
          console.log(error);
          throw new Error(error.response?.data?.message || "Failed to add email prefix");
        }
      },

      removeEmailPrefix: async (domainId: string, prefix: string) => {
        try {
          const res = await axiosInstance.delete(`/api/v1/userdomain/${domainId}/emails/${prefix}`, {
            withCredentials: true
          });
          return res.data;
        } catch (error: any) {
          console.log(error);
          throw new Error(error.response?.data?.message || "Failed to remove email prefix");
        }
      },

      getEmailPrefixes: async (domainId: string) => {
        try {
          const res = await axiosInstance.get(`/api/v1/userdomain/${domainId}/emails`, {
            withCredentials: true
          });
          return res.data;
        } catch (error: any) {
          console.log(error);
          throw new Error(error.response?.data?.message || "Failed to get email prefixes");
        }
      },

      // Payment methods
      getSubscriptionPlans: async () => {
        try {
          const res = await axiosInstance.get("/api/v1/payment/plans");
          return res.data;
        } catch (error: any) {
          console.log(error);
          throw new Error(error.response?.data?.message || "Failed to get subscription plans");
        }
      },

      getUserSubscription: async () => {
        try {
          const res = await axiosInstance.get("/api/v1/payment/subscription", {
            withCredentials: true
          });
          return res.data;
        } catch (error: any) {
          console.log(error);
          throw new Error(error.response?.data?.message || "Failed to get user subscription");
        }
      },

      createPaymentOrder: async (plan: string) => {
        try {
          const res = await axiosInstance.post("/api/v1/payment/create-order", { plan }, {
            withCredentials: true
          });
          return res.data;
        } catch (error: any) {
          console.log(error);
          throw new Error(error.response?.data?.message || "Failed to create payment order");
        }
      },

      verifyPayment: async (paymentData: any) => {
        try {
          const res = await axiosInstance.post("/api/v1/payment/verify", paymentData, {
            withCredentials: true
          });
          return res.data;
        } catch (error: any) {
          console.log(error);
          throw new Error(error.response?.data?.message || "Failed to verify payment");
        }
      },

      // Email methods
      sendEmail: async (emailData: any) => {
        try {
          const res = await axiosInstance.post("/api/v1/email/sendEmail", emailData, {
            withCredentials: true
          });
          return res.data;
        } catch (error: any) {
          console.log(error);
          throw new Error(error.response?.data?.message || "Failed to send email");
        }
      },

      getEmails: async (userEmail: string) => {
        try {
          const res = await axiosInstance.get("/api/v1/email/getMail", {
            params: { email: userEmail },
            withCredentials: true
          });
          return res.data;
        } catch (error: any) {
          console.log(error);
          throw new Error(error.response?.data?.message || "Failed to get emails");
        }
      },

      // Analytics methods
      getEmailAnalytics: async (email: string, period: string, customDates?: { start: string; end: string }) => {
        try {
          const params: any = { email, period };
          if (customDates) {
            params.startDate = customDates.start;
            params.endDate = customDates.end;
          }
          
          const res = await axiosInstance.get("/api/v1/email/analytics", {
            params,
            withCredentials: true
          });
          return res.data;
        } catch (error: any) {
          console.log(error);
          throw new Error(error.response?.data?.message || "Failed to get email analytics");
        }
      }
    }),
    {
      name: "user-auth-store",
    }
  )
);
