import { create } from "zustand";
import { axiosInstance } from "@/lib/axios";
import { toast } from "sonner";

export const useStore = create((set, get) => ({
  user: null,
  loading: false,
  profile: null,

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
      toast.success(`Welcome ${res.data.profile?.name?.split(" ")[0]}`);
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

      if (get().getProfile) {
        await get().getProfile();
      }

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
        formData.append("avatar", form.image);
      }

      const res = await axiosInstance.post("/auth/setup-profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      set({ profile: res.data.user, loading: false });
      toast.success("Profile created successfully");
    } catch (error) {
      console.error("Profile setup failed:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "An error occurred");
      set({ profile: null, loading: false });
    }
  },

  getProfile: async () => {
    try {
      const res = await axiosInstance.get("/auth/profile");
      set({ profile: res.data });  
    } catch (error) {
      console.error("Failed to get profile:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "An error occurred");
    }
  },
}));
