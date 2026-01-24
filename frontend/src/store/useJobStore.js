import { create } from "zustand";
import { toast } from "sonner";
import { axiosInstance } from "@/lib/axios";

export const jobStore = create((set, get) => ({

    employeeJobs: [],
    currentJobs: [],
    applications: [],

    currentApplicantJobs: [],
    jobs: [],    
    isLoading: false,


    postJob: async (jobData) =>{
        set({isLoading: true});

        try {

            const res = await axiosInstance.post("/jobs/post-job", jobData);
            toast.success("Job posted successfully");
            set((state) =>({
                employeeJobs: [res.data, ...state.employeeJobs], 
            }))
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to post job");
        }
        finally{
            set({isLoading: false});
        }
    },

    deleteJob: async (jobId) =>{
        set({isLoading: true});
        try {
            await axiosInstance.delete(`/jobs/delete-job/${jobId}`);
            toast.success("Job deleted successfully");
            set((state) =>({
                employeeJobs: state.employeeJobs.filter((j) => j._id !== jobId),
            }))
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete job");
        }
        finally{
            set({isLoading: false});
        }
    },

    fetchEmployeeJobs: async() =>{
        set({isLoading: true});

        try {
            const res = await axiosInstance.get("/jobs/get-my-jobs");
            set({employeeJobs: res.data});

        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to get you jobs");
        }
        finally{
            set({isLoading: false});
        }
    },

    fetchEmployeeJobById: async (jobId) => {
        set({ isLoading: true });
        try {
            const res = await axiosInstance.get(`/jobs/get-my-job/${jobId}`);
            set({
                currentJob: res.data.job,
                applications: res.data.applications,
            });
            console.log(res.data);
        } catch {
            toast.error("Failed to load job details");
        } finally {
            set({ isLoading: false });
        }
    },

    updateJobState: async (jobId, status) => {
        set({ isLoading: true });
        try {
            await axiosInstance.patch(`/jobs/patch-job/${jobId}`, {status});
            toast.success("Job status updated");
            get().fetchEmployeeJobs();
            get().fetchEmployeeJobById(jobId);
        } catch(error) {
            toast.error("Failed to update job status");
            console.error(error);
        } finally {
            set({ isLoading: false });
        }
    }, 
    
    getAllJobs: async () => {
        set({isLoading: true});

        try {
            const res = await axiosInstance.get("/jobs/get-jobs");
            set({jobs: res.data});


        } catch (error) {
            toast.error(error.response?.data?.message || "An Error Occured");                       
        }
        finally{
            set({isLoading: false});
        }
    },
    fetchJobById: async (jobId) => {
        set({ isLoading: true });
        try {
            const res = await axiosInstance.get(`/jobs/get-job/${jobId}`);
            set({
                currentApplicantJobs: res.data,
            });
            console.log(res);
        } catch {
            toast.error("Failed to load job details");
        } finally {
            set({ isLoading: false });
        }
    },


})); 
