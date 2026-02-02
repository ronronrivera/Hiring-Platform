import { useEffect, useState, Fragment } from "react";
import { useParams, useNavigate } from "react-router";
import { applicationStore } from "@/store/useApplicationStore";
import { Navbar } from "@/components/navbar";
import { ArrowLeftIcon, Loader2Icon, Trash2 } from "lucide-react";
import { Dialog, Transition } from "@headlessui/react";
import ApplicationMessageSkeleton from "../employee pages/ApplicationMessageSkeleton";
import { toast } from "sonner";

const MyApplicationPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const {
        currentApplication,
        readApplication,
        isLoading,
        updateApplicationStatus,
        checkingStatus,
        submitting,
    } = applicationStore();

    const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
    const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);

    useEffect(() => {
        if (id) readApplication(id);
    }, [id, readApplication]);

    const handleWithdrawApplication = async () => {
        if (!currentApplication?._id) return;

        try {
            await updateApplicationStatus(
                currentApplication._id,
                "WITHDRAWN",
                ""
            );
            navigate("/applications");
        } catch (error) {
            console.error(error);
            toast.error("Failed to withdraw application");
        }
    };

    const handleOpenConversation = () => {
        if (!currentApplication?.jobId?.employee) return;
        setIsMessageModalOpen(false);
        navigate(`/message/${currentApplication._id}`);
    };

    return (
        <div className="bg-white dark:bg-black min-h-screen">
            <Navbar />

            <div className="p-6 max-w-3xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between gap-2 mt-10 mb-6">
                    <div
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => navigate("/applications")}
                    >
                        <ArrowLeftIcon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                        <span className="text-gray-700 dark:text-gray-300 hover:underline">
                            Back to Applications
                        </span>
                    </div>

                    {currentApplication && (
                        <div className="flex gap-2">
                            {currentApplication.status === "SHORTLISTED" && (
                                <button
                                    disabled={checkingStatus}
                                    onClick={() => setIsMessageModalOpen(true)}
                                    className="    bg-emerald-600 hover:bg-emerald-700
                                    text-white
                                    px-3 py-1 rounded
                                    flex items-center gap-1"
                                >
                                    {checkingStatus ? (
                                        <Loader2Icon className="animate-spin w-4 h-4" />
                                    ) : (
                                        `Message from ${currentApplication.jobId?.employee?.profile?.name.split(" ")[0] || "Employee"}`
                                    )}
                                </button>
                            )}

                            {currentApplication.status !== "WITHDRAWN" && (
                                <button
                                    onClick={() => setIsWithdrawOpen(true)}
                                    className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Withdraw
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* Content */}
                {isLoading ? (
                    <ApplicationMessageSkeleton />
                ) : currentApplication ? (
                    <>
                        <h1 className="text-2xl font-bold mb-4">
                            {currentApplication.subject}
                        </h1>
                        <p className="mb-6 whitespace-pre-line">
                            {currentApplication.message}
                        </p>
                    </>
                ) : (
                    <p>No application found.</p>
                )}

                {/* MESSAGE MODAL */}
                <Transition appear show={isMessageModalOpen} as={Fragment}>
                    <Dialog
                        as="div"
                        className="relative z-50"
                        onClose={() => setIsMessageModalOpen(false)}
                    >
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div className="fixed inset-0 bg-black/40 dark:bg-white/10" />
                        </Transition.Child>

                        <div className="fixed inset-0 flex items-center justify-center p-4">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-900 p-6 shadow-xl">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={currentApplication?.jobId?.employee?.profile?.avatar?.url || "/avatar.png"}
                                            alt={currentApplication?.jobId?.employee?.profile?.name || "Employee"}
                                            className="w-10 h-10 rounded-full object-cover border border-gray-300 dark:border-gray-600"
                                        />
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                                {currentApplication?.jobId?.employee?.profile?.name || "Employee Name"}
                                            </h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                sent you a message
                                            </p>
                                        </div>
                                    </div>

                                    {/* Message Body */}
                                    <div className="mt-4">
                                        <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">
                                            {currentApplication?.statusMessage || "No message provided."}
                                        </p>
                                    </div>

                                    {/* Buttons */}
                                    <div className="mt-6 flex justify-end gap-2">
                                        <button
                                            onClick={() => setIsMessageModalOpen(false)}
                                            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200"
                                        >
                                            Close
                                        </button>
                                        <button
                                            onClick={handleOpenConversation}
                                            className="px-4 py-2 rounded bg-emerald-600 hover:bg-emerald-700 text-white"
                                        >
                                            Open Conversation
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </Dialog>
                </Transition>

                {/* WITHDRAW MODAL */}
                <Transition appear show={isWithdrawOpen} as={Fragment}>
                    <Dialog
                        as="div"
                        className="relative z-50"
                        onClose={() => setIsWithdrawOpen(false)}
                    >
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div className="fixed inset-0 bg-black/40 dark:bg-white/10" />
                        </Transition.Child>

                        <div className="fixed inset-0 flex items-center justify-center p-4">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-900 p-6 shadow-xl">
                                    <Dialog.Title className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                        Confirm Withdraw
                                    </Dialog.Title>

                                    <p className="mt-4 text-sm text-gray-700 dark:text-gray-300">
                                        Are you sure you want to withdraw this
                                        application? The employer will be
                                        notified.
                                    </p>

                                    <div className="mt-6 flex justify-end gap-2">
                                        <button
                                            onClick={() =>
                                                setIsWithdrawOpen(false)
                                            }
                                            className="px-4 py-2 rounded bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleWithdrawApplication}
                                            className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white"
                                        >
                                            {submitting ? (
                                                <Loader2Icon className="animate-spin size-4" />
                                            ) : (
                                                    "Withdraw"
                                                )}
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </Dialog>
                </Transition>
            </div>
        </div>
    );
};

export default MyApplicationPage;
