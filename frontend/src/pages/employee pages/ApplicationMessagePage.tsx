import { useEffect, useState, Fragment } from "react";
import { useParams, useNavigate } from "react-router";
import { applicationStore } from "@/store/useApplicationStore";
import { Dialog, Transition } from "@headlessui/react";
import { Navbar } from "@/components/navbar";
import { ArrowLeftIcon, Loader2Icon } from "lucide-react";
import ApplicationMessageSkeleton from "./ApplicationMessageSkeleton";
import { toast } from "sonner";

const ApplicationMessagePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { currentApplication, readApplication, isLoading, updateApplicationStatus, submitting } = applicationStore();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [status, setStatus] = useState("SHORTLISTED");
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (id) {
            readApplication(id);
        }
    }, [id, readApplication]);

    const handleStatusUpdate = async () => {
        await updateApplicationStatus(
            currentApplication._id,
            status,
            message
        );

        setIsModalOpen(false);
        setStatus("");
        setMessage("");
    };

    const handleGoBack = () => {
        navigate(`/ejob/${currentApplication?.jobId?._id}`);
    };

    const goToApplicantProfile = () => {
        if (currentApplication?.applicantId) {
            navigate(`/user/${currentApplication.applicantId._id}`);
        }
    };

    return (
        <div className="bg-white dark:bg-black min-h-screen">
            <Navbar />

            <div className="p-6 max-w-3xl mx-auto">
                {/* Back Button */}
                <div
                    className="flex items-center gap-2 cursor-pointer mt-10 mb-10"
                    onClick={handleGoBack}
                >
                    <ArrowLeftIcon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                    <span className="text-gray-700 dark:text-gray-300 hover:underline">
                        Back to Jobs
                    </span>
                </div>

                {isLoading ? (
                    <ApplicationMessageSkeleton />
                ) : currentApplication ? (
                    <>
                        {/* Applicant Info + Status Button */}
                        <div className="flex items-center justify-between mb-6">
                            <div
                                className="flex items-center cursor-pointer"
                                onClick={goToApplicantProfile}
                            >
                                <img
                                    src={currentApplication.applicantId?.profile?.avatar?.url || "/avatar.png"}
                                    alt={currentApplication.applicantId?.profile?.name || "Applicant Avatar"}
                                    className="w-10 h-10 rounded-full mr-3 border border-gray-300 dark:border-gray-600"
                                />
                                <div className="flex flex-col">
                                    <span className="text-lg font-medium text-gray-800 dark:text-gray-200 hover:underline">
                                        {currentApplication.applicantId?.profile?.name || "Unknown Applicant"}
                                    </span>
                                    {currentApplication.status === "WITHDRAWN" && (
                                        <span className="text-sm text-red-600 dark:text-red-400 font-medium">
                                            Withdrawn
                                        </span>
                                    )}
                                </div>
                            </div>

                            {(currentApplication.status === "PENDING" || currentApplication.status === "VIEWED") && (
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                                >
                                    Respond
                                </button>
                            )}
                        </div>

                        {/* Application Subject & Message */}
                        <h1 className="text-2xl font-bold mb-4">{currentApplication.subject}</h1>
                        <p className="mb-6 whitespace-pre-line">{currentApplication.message}</p>

                        {/* Update Status Modal */}
                        <Transition appear show={isModalOpen} as={Fragment}>
                            <Dialog as="div" className="relative z-50" onClose={() => setIsModalOpen(false)}>
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
                                                    Update Application Status
                                                </Dialog.Title>

                                                <div className="mt-4">
                                                    <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
                                                        Select Status:
                                                    </label>
                                                    <select
                                                        value={status}
                                                        onChange={(e) => setStatus(e.target.value)}
                                                        className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded px-3 py-2"
                                                    >
                                                        <option value="SHORTLISTED">Shortlist</option>
                                                        <option value="REJECTED">Reject</option>
                                                    </select>
                                                </div>

                                                <div className="mt-4">
                                                    <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
                                                        Optional Message:
                                                    </label>
                                                    <textarea
                                                        value={message}
                                                        onChange={(e) => setMessage(e.target.value)}
                                                        className="w-full border border-gray-300 dark:border-gray-700 rounded px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                                                        rows={3}
                                                    />
                                                </div>

                                                <div className="mt-6 flex justify-end gap-2">
                                                    <button
                                                        type="button"
                                                        className="bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 px-4 py-2 rounded"
                                                        onClick={() => setIsModalOpen(false)}
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                                                        onClick={() => {
                                                            if (status === "SHORTLISTED" && !message.trim()) {
                                                                toast.error("Message is required when shortlisting");
                                                                return;
                                                            }
                                                            handleStatusUpdate();
                                                        }}
                                                    >
                                                        {submitting ? <Loader2Icon className="animate-spin size-4" /> : "Submit"}
                                                    </button>
                                                </div>
                                            </Dialog.Panel>
                                        </Transition.Child>
                                    </div>
                                </div>
                            </Dialog>
                        </Transition>
                    </>
                ) : (
                    <p>No application found.</p>
                )}
            </div>
        </div>
    );
};

export default ApplicationMessagePage;
