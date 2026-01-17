import {create} from "zustand";
import { axiosInstance } from "@/lib/axios";
import { toast } from "sonner";

export const useStore = create((set, get) => ({
    user: null,
    loading: false,


    signup: async ({ fullName, email, password, confirmPassword }) => {
        set({ loading: true });

        try {
            // convert fullName to lowercase 'fullname' to match backend
            const res = await axiosInstance.post("/auth/signup", {
                fullname: fullName,
                email,
                password,
                confirmPassword
            });

            set({ user: res.data, loading: false });
            toast.success(`Welcome ${res.data["profile.name"].split(" ")[0]}`);
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

            // use profile name if it exists, fallback to email
            const name = res.data?.profile?.name?.split(" ")[0] || res.data.email.split("@")[0];
            toast.success(`Welcome back ${name}`);
        } catch (error) {
            set({ loading: false });
            console.error("Login failed:", error.response?.data || error.message);
            toast.error(error.response?.data?.message || "An error occurred");
            set({ user: null });
        }
    },

    logout: async ({}) => {
        try{
            await axiosInstance.post("/auth/logout");
            set({user: null});
        }
        catch(error){
            toast.error(error.response?.data?.message || "An error occured during logout");
        }
    }

}))

