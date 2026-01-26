import { create } from "zustand";
import { axiosInstance } from "@/lib/axios";
import { toast } from "sonner";

const setupAxiosInterceptors = (store) => {
  axiosInstance.interceptors.response.use(
    res => res,
    async error => {
      const originalRequest = error.config;

      if (
        error.response?.status === 401 &&
        !originalRequest._retry &&
        !originalRequest.url.includes("/auth/refresh-token")
      ) {
        originalRequest._retry = true;

        try {
          // Use the store's refreshToken method
          await store.getState().refreshToken();
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          // Only logout if refresh truly failed
          store.getState().logout();
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );
};

export const useStore = create((set, get) => ({
    user: null,
    loading: false,
    profile: null,
    
    CheckingAuth: true,

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/profile");
            set({user: res.data, profile: res.data.profile});
            return true; // Success
        } catch (error) {
            // Don't set user to null immediately on 401
            // Let the interceptor handle token refresh
            if (error.response?.status !== 401) {
                set({user: null});
            }
            return false; // Failed
        }
        finally{
            set({CheckingAuth: false});
        }
    },


    signup: async ({ fullName, email, password, confirmPassword }) => {
        set({ loading: true });
        try {
            const res = await axiosInstance.post("/auth/signup", {
                fullname: fullName,
                email,
                password,
                confirmPassword,
            });
            set({ user: res.data, loading: false });
        } catch (error) {
            set({ loading: false });
            toast.error(error.response?.data?.message || "An Error occurred");
            set({ user: null });
        }
    },

    login: async ({ email, password }) => {
        set({ loading: true });
        try {
            const res = await axiosInstance.post("/auth/login", { email, password });
            set({ user: res.data, loading: false });
            
            await get().checkAuth();

            const name = res.data.profile?.name?.split(" ")[0];
            toast.success(`Welcome back ${name || res.data.email}`);

        } catch (error) {
            set({ loading: false });
            console.log("Login failed: ", error.message);
            toast.error(error.response?.data?.message || "An error occurred");
            set({ user: null });
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout");
            set({ user: null, profile: null });
        } catch (error) {
            toast.error(error.response?.data?.message || "An error occurred during logout");
        }
    },

    setupProfile: async (form) => {
        set({ loading: true });
        try { 

            const formData = new FormData();
            formData.append("role", form.role);
            formData.append("bio", form.bio);
            formData.append("preferredSalary", form.preferredSalary);
            formData.append("website", form.website);
            formData.append("address", form.address);
            formData.append("month", form.month);
            formData.append("day", form.day);
            formData.append("year", form.year);
            formData.append("mobileNumber", form.mobileNumber);

            if (form.image) {
                formData.append("avatars", form.image);
            }

            const res = await axiosInstance.post("/auth/setup-profile", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            set({user: res.data.user ,profile: res.data.user?.profile, loading: false });
            
    
            toast.success(`Welcome ${res.data.user?.profile?.name?.split(" ")[0]}`);
        } catch (error) {
            console.error("Profile setup failed:", error.response?.data || error.message);
            toast.error(error.response?.data?.message || "An error occurred");
            set({ profile: null, loading: false });
        }
    },

    refreshToken: async () => {
        // More robust check for concurrent refresh attempts
        if (get().refreshingToken) {
            // Wait for existing refresh to complete
            while (get().refreshingToken) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            return;
        }

        set({ refreshingToken: true, CheckingAuth: true });

        try {
            const response = await axiosInstance.post("/auth/refresh-token", {}, {
                // Don't retry refresh token calls
                _retry: true
            });
            return response.data;
        } catch (error) {
            // If refresh token is invalid/expired, logout
            if (error.response?.status === 401) {
                set({ user: null, profile: null });
            }
            throw error;
        } finally {
            set({ refreshingToken: false, CheckingAuth: false });
        }
    },

}));

const store = useStore;
setupAxiosInterceptors(store);

