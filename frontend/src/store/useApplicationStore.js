import {create} from "zustand"
import { axiosInstance } from "@/lib/axios"
import { toast } from "sonner"

export const applicationStore = create((set, get) => ({
    
    messages: [],
    applicantApplications: [],
    currentApplication: null,
    isLoading: false,
    hasApplied: false,
    submitting: false,
    checkingStatus: false,

    sendApplication: async (subject, message, jobId) => {
        set({isLoading: true})

        try {

            const res = await axiosInstance.post(`/jobs/${jobId}/apply`, {subject, message});
            set((state) =>({
                applicantApplications: [res.data.application, ...state.applicantApplications], 
            }))
            toast.success("Application sent successfully!");
            set({hasApplied: res.data.applied});
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
            set({ hasApplied: false });
        }
    },

    getApplications: async () =>{
        set({isLoading: true});
        try {
            
            const res = await axiosInstance.get("/jobs/applications");

            set({applicantApplications: res.data});

        } catch (error) {
            toast.error("Failed to get applications");
        }
        finally{
            set({isLoading: false});
        }
    },

    readApplication: async (applicationId) =>{
        set({isLoading: true, checkingStatus: true});
        try{
            const res = await axiosInstance.get(`/jobs/application/${applicationId}`);
            set({currentApplication: res.data});
        }
        catch(error){
            toast.error("Failed to read application");
        }
        finally{
            set({isLoading: false, checkingStatus: false});
        }
    },
    

    updateApplicationStatus: async (
        applicationId,
        status,
        message
    ) => {
        set({ submitting: true });

        try {
            const res = await axiosInstance.post(
                `/jobs/${applicationId}/send-message`,
                { status, message }
            );

            set((state) => {
                if (!state.currentApplication) return {};

                return {
                    currentApplication: {
                        ...state.currentApplication,
                        status: res.data.status,
                        statusMessage: res.data.statusMessage,
                    },
                };
            });

            toast.success("Application updated");
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to update application"
            );
        } finally {
            set({ submitting: false });
        }
    },

}))
