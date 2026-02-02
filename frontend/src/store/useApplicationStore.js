import { create } from "zustand";
import { axiosInstance } from "@/lib/axios";
import { toast } from "sonner";
import { StreamChat } from "stream-chat";

export const applicationStore = create((set, get) => ({
    messages: [],
    applicantApplications: [],
    currentApplication: null,
    isLoading: false,
    hasApplied: false,
    submitting: false,
    checkingStatus: false,

    streamClient: null ,
    streamChannel: null ,
    chatLoading: false,

    sendApplication: async (subject, message, jobId) => {
        set({ isLoading: true });
        try {
            const res = await axiosInstance.post(`/jobs/${jobId}/apply`, { subject, message });
            set((state) => ({
                applicantApplications: [res.data.application, ...state.applicantApplications],
                hasApplied: res.data.applied,
            }));
            toast.success("Application sent successfully!");
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Failed to send application");
        } finally {
            set({ isLoading: false });
        }
    },

    checkExistingApplication: async (jobId) => {
        try {
            const res = await axiosInstance.get(`/jobs/check/${jobId}`);
            set({ hasApplied: res.data.applied });
        } catch (error) {
            set({ hasApplied: false });
        }
    },

    getApplications: async () => {
        set({ isLoading: true });
        try {
            const res = await axiosInstance.get("/jobs/applications");
            set({ applicantApplications: res.data });
        } catch (error) {
            toast.error("Failed to get applications");
        } finally {
            set({ isLoading: false });
        }
    },

    readApplication: async (applicationId) => {
        set({ isLoading: true, checkingStatus: true });
        try {
            const res = await axiosInstance.get(`/jobs/application/${applicationId}`);
            set({ currentApplication: res.data });
        } catch (error) {
            console.log(error);
            toast.error("Failed to read application");
        } finally {
            set({ isLoading: false, checkingStatus: false });
        }
    },

    updateApplicationStatus: async (applicationId, status, message) => {
        set({ submitting: true });
        try {
            const res = await axiosInstance.post(`/jobs/${applicationId}/send-message`, { status, message });
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
            toast.error(error.response?.data?.message || "Failed to update application");
        } finally {
            set({ submitting: false });
        }
    },

    getChatAccess: async (applicationId) => {
        set({ chatLoading: true });
        try {
            const res = await axiosInstance.get(`/jobs/applications/${applicationId}/chat`);
            return res.data; // { apiKey, token, channelId }
        } catch (error) {
            throw error;
        } finally {
            set({ chatLoading: false });
        }
    },

    connectToChat: async (applicationId, user) => {
        set({ chatLoading: true });
        try {
            const { apiKey, token, channelId } = await get().getChatAccess(applicationId);
            const client = StreamChat.getInstance(apiKey);

            await client.connectUser({ id: user._id, name: user.name }, token);

            const channel = client.channel("messaging", channelId);
            await channel.watch();

            set({ streamClient: client, streamChannel: channel });
        } catch (error) {
            console.log(error);
            toast.error("Failed to connect to chat");
            throw error;
        } finally {
            set({ chatLoading: false });
        }
    },

    sendMessage: async (content) => {
        const { streamChannel } = get();
        if (!streamChannel) return;

        try {
            await streamChannel.sendMessage({ text: content });
        } catch (error) {
            console.log(error);
            toast.error("Failed to send message");
        }
    },

    disconnectChat: () => {
        const { streamClient } = get();
        if (streamClient) streamClient.disconnectUser();
        set({ streamClient: null, streamChannel: null });
    },
}));
