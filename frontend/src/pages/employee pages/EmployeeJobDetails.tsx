import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import {
    CalendarDaysIcon,
    BriefcaseIcon,
    DollarSign,
    Loader2Icon,
    ArrowLeftIcon,
} from "lucide-react";

import { jobStore } from "@/store/useJobStore";
import { Navbar } from "@/components/navbar";
import JobDetailsSkeleton from "@/components/JobDetailsSkeleton";

const EmployeeJobDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const {
        currentJob,
        applications,
        fetchEmployeeJobById,
        updateJobState,
        deleteJob,
        isLoading,
    } = jobStore();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState("delete");
    const [selectedStatus, setSelectedStatus] = useState("draft");
    const [openAppId, setOpenAppId] = useState(null);

    useEffect(() => {
        if (id) fetchEmployeeJobById(id);
    }, [id]);

    if (!currentJob) return <JobDetailsSkeleton />;

    return (
        <div className="bg-white dark:bg-black min-h-screen">
            <Navbar />

            <div className="max-w-5xl mx-auto p-6 space-y-6">
                {/* Back */}
                <div
                    className="flex items-center gap-2 cursor-pointer mt-10"
                    onClick={() => navigate("/jobs")}
                >
                    <ArrowLeftIcon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                    <span className="text-gray-700 dark:text-gray-300 hover:underline">
                        Back to Jobs
                    </span>
                </div>

                {/* Job Info */}
                <div className="border rounded-xl p-6 bg-white dark:bg-gray-900 shadow-sm space-y-4">
                    <div className="flex justify-between items-start gap-4">
                        {/* Left */}
                        <div className="min-w-0">
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white line-clamp-2">
                                {currentJob.title}
                            </h1>

                            <p className="text-sm mt-2 flex items-center gap-2">
                                <span>Status:</span>
                                {isLoading ? (
                                    <Loader2Icon className="size-4 animate-spin" />
                                ) : (
                                    <span
                                        className={`px-2 py-1 rounded-md text-white text-xs font-medium ${
                                            currentJob.status === "published"
                                                ? "bg-green-600"
                                                : "bg-amber-500"
                                        }`}
                                    >
                                        {currentJob.status[0].toUpperCase() +
                                            currentJob.status.slice(1)}
                                    </span>
                                )}
                            </p>
                        </div>

                        {/* Right */}
                        <div className="flex gap-2 shrink-0">
                            <button
                                onClick={() => {
                                    setModalType("status");
                                    setSelectedStatus(currentJob.status);
                                    setIsModalOpen(true);
                                }}
                                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                            >
                                Change Status
                            </button>

                            <button
                                onClick={() => {
                                    setModalType("delete");
                                    setIsModalOpen(true);
                                }}
                                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
                            >
                                Delete
                            </button>
                        </div>
                    </div>

                    {/* Meta */}
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-300">
                        <div className="flex items-center gap-1">
                            <CalendarDaysIcon className="w-4 h-4" />
                            {new Date(currentJob.createdAt).toLocaleDateString()}
                        </div>

                        <div className="flex items-center gap-1">
                            <BriefcaseIcon className="w-4 h-4" />
                            {currentJob.employmentType.replace("_", " ")}
                        </div>

                        {currentJob.salaryRange && (
                            <div className="flex items-center gap-1">
                                <DollarSign className="w-4 h-4" />
                                {currentJob.salaryRange}
                            </div>
                        )}
                    </div>

                    <p className="text-gray-700 dark:text-gray-200 whitespace-pre-line">
                        {currentJob.description}
                    </p>

                    <div className="flex flex-wrap gap-2">
                        {currentJob.skills.map((skill: any) => (
                            <span
                                key={skill}
                                className="px-3 py-1 rounded-full text-sm bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100"
                            >
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Applications */}
                <div className="border rounded-xl p-6 bg-white dark:bg-gray-900 shadow-sm">
                    <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                        Applications ({applications.length})
                    </h2>

                    {applications.length === 0 ? (
                        <p className="text-gray-500">No applications yet.</p>
                    ) : (
                        <div className="space-y-3">
                            {applications.map((app:any) => {
                                const isOpen = openAppId === app._id;

                                return (
                                    <div
                                        key={app._id}
                                        className="border rounded-lg bg-gray-50 dark:bg-gray-800 overflow-hidden"
                                    >
                                        {/* Header */}
                                        <button
                                            onClick={() =>
                                                setOpenAppId(
                                                    isOpen ? null : app._id
                                                )
                                            }
                                            className="w-full p-4 flex justify-between items-center text-left"
                                        >
                                            <div className="flex items-center gap-3">
                                                <img src={app.applicantId?.profile?.avatar?.url || "/avatar.png"}
                                                     className="w-8 h-8 rounded-full object-cover border border-gray-300 dark:border-gray-600"
                                                />
                                                <h1 className="font-medium text-gray-900 dark:text-white">
                                                    {app.applicantId?.profile?.name}
                                                </h1>
                                            </div>
                                            </button>

                                        </div>
                                    );
                                })}
                        </div>
                    )}
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white dark:bg-gray-900 p-6 rounded-xl w-96">
                        {modalType === "delete" ? (
                            <>
                                <h3 className="text-lg font-semibold">
                                    Confirm Delete
                                </h3>
                                <p className="mt-2 text-gray-600 dark:text-gray-300">
                                    This action cannot be undone.
                                </p>

                                <div className="mt-4 flex justify-end gap-2">
                                    <button
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-4 py-2 rounded-lg bg-gray-300 dark:bg-gray-700"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={async () => {
                                            await deleteJob(id);
                                            navigate("/jobs");
                                        }}
                                        className="px-4 py-2 rounded-lg bg-red-600 text-white"
                                    >
                                        {isLoading ? (
                                            <Loader2Icon className="animate-spin" />
                                        ) : (
                                            "Delete"
                                        )}
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <h3 className="text-lg font-semibold">
                                    Change Job Status
                                </h3>

                                <select
                                    className="mt-4 w-full border rounded-lg p-2 dark:bg-gray-800"
                                    value={selectedStatus}
                                    onChange={(e) =>
                                        setSelectedStatus(e.target.value)
                                    }
                                >
                                    <option value="draft">Draft</option>
                                    <option value="published">Published</option>
                                </select>

                                <div className="mt-4 flex justify-end gap-2">
                                    <button
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-4 py-2 rounded-lg bg-gray-300 dark:bg-gray-700"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() =>
                                            updateJobState(id, selectedStatus)
                                        }
                                        className="px-4 py-2 rounded-lg bg-blue-600 text-white"
                                    >
                                        {isLoading ? (
                                            <Loader2Icon className="animate-spin" />
                                        ) : (
                                            "Update"
                                        )}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmployeeJobDetailsPage;
