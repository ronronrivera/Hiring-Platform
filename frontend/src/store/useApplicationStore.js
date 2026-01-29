import {create} from "zustand"
import { axiosInstance } from "@/lib/axios"
import { toast } from "sonner"

export const applicationStore = create((set, get) => ({
    
    applicantApplications: [],
    isLoading: false,
    hasApplied: false,

    sendApplication: async (subject, message, jobId) => {
        set({isLoading: true})

        try {
           
            const res = await axiosInstance.post(`/jobs/${jobId}/apply`, {subject, message});
            set((state) =>({
                applicantApplications: [res.data.application, ...state.applicantApplications], 
            }))
            toast.success("Application sent successfully!");
            set({hasApplied: res.data.applied});
            console.log(res);
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Failed to send application");
        }
        finally{
            set({isLoading: false});
        }
    },

    checkExistingApplication: async (jobId) =>{

        try {
            const res = await axiosInstance.get(`/jobs/check/${jobId}`);
            set({hasApplied: res.data.applied});

        } catch (error) {
            console.error(error);
            set({ hasApplied: false });
        }
    }

}))
