import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { jobStore } from "@/store/useJobStore";
import { CalendarDaysIcon, BriefcaseIcon, DollarSign, Loader2Icon, ArrowLeftIcon } from "lucide-react";
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
    const [modalType, setModalType] = useState<"delete" | "status">("delete");
    const [selectedStatus, setSelectedStatus] = useState("draft");

    useEffect(() => {
        if (!id) return;
        fetchEmployeeJobById(id);
    }, [id]);

    if (!currentJob) return <JobDetailsSkeleton/>;

    const openDeleteModal = () => {
        setModalType("delete");
        setIsModalOpen(true);
    };

    const openStatusModal = () => {
        setModalType("status");
        setSelectedStatus(currentJob.status || "draft");
        setIsModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        await deleteJob(id);
        setIsModalOpen(false);
        navigate("/jobs");
    };

    const handleConfirmStatusChange = async () => {
        await updateJobState(id, selectedStatus);
        setIsModalOpen(false);
    };

    return (
        <div className="bg-white dark:bg-black min-h-screen">
            <Navbar />
            <div className="max-w-5xl mx-auto p-6 space-y-6">

                <div className="flex items-center gap-2 cursor-pointer mb-10 mt-10" onClick={() => navigate("/jobs")}>
                    <ArrowLeftIcon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                    <span className="text-gray-700 dark:text-gray-300 hover:underline">Back to Jobs</span>
                </div>
                {/* Job Info */}
                <div className="border rounded-xl p-6 space-y-4 bg-white dark:bg-gray-900 shadow-sm">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                {currentJob.title}
                            </h1>
                            <p className="text-sm mt-1">
                                Status: <span className={`font-medium ml-1 ${currentJob.status === "published"? "bg-green-600" : "bg-amber-500"} rounded-md p-1`}>
                                    {currentJob.status[0].toUpperCase() + currentJob.status.slice(1)}</span>
                            </p>
                        </div>

                        <div className="flex gap-2">
                            {/* Change Status Button */}
                            <button
                                onClick={openStatusModal}
                                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                            >
                                Change Status
                            </button>

                            <button
                                onClick={openDeleteModal}
                                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
                            >
                                Delete
                            </button>
                        </div>
                    </div>

                    {/* Job Meta */}
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-300 mt-2">
                        <div className="flex items-center gap-1">
                            <CalendarDaysIcon className="w-4 h-4" />
                            <span>
                                Posted: {new Date(currentJob.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                        <div className="flex items-center gap-1">
                            <BriefcaseIcon className="w-4 h-4" />
                            <span>{currentJob.employmentType.replace("_", " ")}</span>
                        </div>
                        {currentJob.salaryRange && (
                            <div className="flex items-center gap-1">
                                <DollarSign className="w-4 h-4" />
                                <span>{currentJob.salaryRange}</span>
                            </div>
                        )}
                    </div>

                    <p className="text-gray-700 dark:text-gray-200 mt-4">
                        {currentJob.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mt-4">
                        {currentJob.skills.map((skill) => (
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
                        <p className="text-muted-foreground dark:text-gray-400">
                            No applications yet.
                        </p>
                    ) : (
                            <div className="space-y-4">
                                {applications.map((app) => (
                                    <div
                                        key={app._id}
                                        className="border rounded-lg p-4 space-y-2 bg-gray-50 dark:bg-gray-800"
                                    >
                                        <p className="font-medium text-gray-900 dark:text-white">
                                            {app.applicantId?.name}
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-300">
                                            {app.applicantId?.email}
                                        </p>
                                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                                            {app.subject}
                                        </p>
                                        <p className="text-sm text-gray-700 dark:text-gray-200">
                                            {app.message}
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-300">
                                            📞 {app.contact}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white dark:bg-gray-900 p-6 rounded-xl w-96 shadow-lg">
                        {modalType === "delete" ? (
                            <>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Confirm Delete
                                </h3>
                                <p className="mt-2 text-gray-700 dark:text-gray-300">
                                    Are you sure you want to delete this job? This action cannot
                                    be undone.
                                </p>
                                <div className="mt-4 flex justify-end gap-2">
                                    <button
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-4 py-2 rounded-lg bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-400 dark:hover:bg-gray-600 transition"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleConfirmDelete}
                                        className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
                                    >
                                        {isLoading? <Loader2Icon className="size-6 animate-spin"/> : "Delete"}
                                    </button>
                                </div>
                            </>
                        ) : (
                                <>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        Change Job Status
                                    </h3>
                                    <p className="mt-2 text-gray-700 dark:text-gray-300">
                                        Select the new status for this job:
                                    </p>
                                    <select
                                        className="mt-4 w-full border rounded-lg p-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                        value={selectedStatus}
                                        onChange={(e) => setSelectedStatus(e.target.value)}
                                    >
                                        <option value="draft">Draft</option>
                                        <option value="published">Published</option>
                                    </select>
                                    <div className="mt-4 flex justify-end gap-2">
                                        <button
                                            onClick={() => setIsModalOpen(false)}
                                            className="px-4 py-2 rounded-lg bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-400 dark:hover:bg-gray-600 transition"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleConfirmStatusChange}
                                            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                                        >
                                            {isLoading? <Loader2Icon className="size-6 animate-spin"/> : "Change Status"}
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
