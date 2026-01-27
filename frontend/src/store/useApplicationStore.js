import {create} from "zustand"
import { axiosInstance } from "@/lib/axios"
import { toast } from "sonner"

export const applicationStore = create((set, get) => ({
    
    applicantApplications: [],
    isLoading: false,

    sendApplication: async (subject, message, jobId) => {
        set({isLoading: true})

        try {
           
            const res = await axiosInstance.post(`/jobs/${jobId}/apply`, {subject, message});
            set((state) =>({
                applicantApplications: [res.data, ...state.applicantApplications], 
            }))
            toast.success("Application sent successfully!");

        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Failed to send application");
        }
        finally{
            set({isLoading: false});
        }
    },

}))
