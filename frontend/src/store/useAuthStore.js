import { create } from "zustand";
import { axiosInstance } from "@/lib/axios";
import { toast } from "sonner";

export const useStore = create((set, get) => ({
    user: null,
    loading: false,
    profile: null,
    
    CheckingAuth: true,

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/profile");
            set({user: res.data, profile: res.data.profile});
        } catch (error) {
            set({user: null});
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
        // Prevent multiple simultaneous refresh attempts
        if (get().CheckingAuth) return;

        set({ CheckingAuth: true });
        try {
            const response = await axiosInstance.post("/auth/refresh-token");
            set({ CheckingAuth: false });
            return response.data;
        } catch (error) {
            set({ user: null, CheckingAuth: false });
            throw error;
        }
    },

}));

let refreshPromise = null;

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) =>{
    const originalRequest = error.config;
    if(error.response?.status === 401 && !originalRequest._retry){
      originalRequest._retry = true;

      try{
        //if refresh is already in progress, wait for it
        if(refreshPromise){
          await refreshPromise;
          return axiosInstance(originalRequest);
        }

        //start a new refresh token
        refreshPromise = useStore.getState().refreshToken();
        await refreshPromise;

        refreshPromise = null;

        return axiosInstance(originalRequest)
        
      }
      catch(error){
        //if refresh fails to redirect to Login or handle as needed
        useStore.getState().logout();
       
      }
    }
    return Promise.reject(error);
  }
)
