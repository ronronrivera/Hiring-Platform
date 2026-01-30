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
        submitting
    } = applicationStore();

    const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);

    useEffect(() => {
        if (id) {
            readApplication(id);
        }
    }, [id, readApplication]);

    const handleWithdrawApplication = async () => {
        if (!currentApplication?._id) return;

        try {
            await updateApplicationStatus(currentApplication._id, "WITHDRAWN", "Applicant withdrew the application");
            navigate("/applications");
        } catch (error) {
            console.error(error);
            toast.error("Failed to withdraw application");
        }
    };

    const handleGoBack = () => {
        navigate("/applications");
    };

    const handleSendMessage = () => {
        if (!currentApplication?.applicantId?._id) return;
        navigate(`/message/${currentApplication.applicantId._id}`);
    };

    return (
        <div className="bg-white dark:bg-black min-h-screen">
            <Navbar />

            <div className="p-6 max-w-3xl mx-auto">
                {/* Buttons at the top */}
                <div className="flex items-center justify-between gap-2 mt-10 mb-6">
                    <div
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={handleGoBack}
                    >
                        <ArrowLeftIcon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                        <span className="text-gray-700 dark:text-gray-300 hover:underline">
                            Back to Applications
                        </span>
                    </div>

                    {currentApplication && (
                        <div className="flex gap-2">
                            {/* Send Message only if SHORTLISTED */}
                            {currentApplication.status === "SHORTLISTED" && (
                                <button
                                    disabled={checkingStatus}
                                    onClick={handleSendMessage}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                                >
                                    {checkingStatus ? (
                                        <Loader2Icon className="animate-spin w-4 h-4" />
                                    ) : (
                                        "Send Message"
                                    )}
                                </button>
                            )}

                            {/* Withdraw Button */}
                            {currentApplication.status !== "WITHDRAWN" && (
                                <button
                                    onClick={() => setIsWithdrawOpen(true)}
                                    className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                                >
                                    <Trash2 className="w-4 h-4" /> Withdraw
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {isLoading ? (
                    <ApplicationMessageSkeleton />
                ) : currentApplication ? (
                    <>
                        {/* Subject & Message */}
                        <h1 className="text-2xl font-bold mb-4">{currentApplication.subject}</h1>
                        <p className="mb-6 whitespace-pre-line">{currentApplication.message}</p>
                    </>
                ) : (
                    <p>No application found.</p>
                )}

                {/* Withdraw Confirmation Dialog */}
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

                        <div className="fixed inset-0 overflow-y-auto">
                            <div className="flex min-h-full items-center justify-center p-4 text-center">
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-out duration-300"
                                    enterFrom="opacity-0 scale-95"
                                    enterTo="opacity-100 scale-100"
                                    leave="ease-in duration-200"
                                    leaveFrom="opacity-100 scale-100"
                                    leaveTo="opacity-0 scale-95"
                                >
                                    <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-900 p-6 text-left align-middle shadow-xl transition-all">
                                        <Dialog.Title
                                            as="h3"
                                            className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100"
                                        >
                                            Confirm Withdraw
                                        </Dialog.Title>
                                        <div className="mt-4">
                                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                                Are you sure you want to withdraw this application? 
                                                The employer will be notified.
                                            </p>
                                        </div>
                                        <div className="mt-6 flex justify-end gap-2">
                                            <button
                                                type="button"
                                                className="bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 px-4 py-2 rounded"
                                                onClick={() => setIsWithdrawOpen(false)}
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="button"
                                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                                                onClick={handleWithdrawApplication}
                                            >
                                                {submitting? <Loader2Icon className="animate-spin size-4"/> : "Withdraw"}
                                            </button>
                                        </div>
                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </div>
                    </Dialog>
                </Transition>
            </div>
        </div>
    );
};

export default MyApplicationPage;
