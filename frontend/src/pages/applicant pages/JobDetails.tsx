import { useEffect } from "react";
import { useParams } from "react-router";
import { jobStore } from "@/store/useJobStore";
import { toast } from "sonner";
import { BriefcaseIcon, UserIcon, DollarSignIcon, TagIcon } from "lucide-react";

const JobDetails = () => {
    const { id } = useParams();
    const { currentApplicantJobs, fetchJobById, isLoading } = jobStore();

    useEffect(() => {
        if (id) fetchJobById(id);
    }, [id]);

    if (isLoading) {
        return (
            <div className="p-6 text-center text-gray-500">
                Loading job details...
            </div>
        );
    }

    const handleApply = () => {
        toast.success("Applied to this job successfully!");
    };

    const handleReport = () => {
        toast("Job reported. Thank you for your feedback.", { variant: "warning" });
    };

    const job = currentApplicantJobs; // alias for clarity

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-md space-y-6">
            <h1 className="text-2xl font-bold">{job.title}</h1>
            <p className="text-gray-700">{job.description}</p>

            <div className="flex items-center gap-2">
                <TagIcon className="w-5 h-5 text-gray-500" />
                <h2 className="font-semibold">Skills Required:</h2>
            </div>
            <ul className="list-disc list-inside ml-6">
                {job.skills?.map((skill, idx) => (
                    <li key={idx} className="capitalize">{skill}</li>
                ))}
            </ul>

            <div className="flex items-center gap-2">
                <DollarSignIcon className="w-5 h-5 text-gray-500" />
                <h2 className="font-semibold">Salary Range:</h2>
            </div>
            <p>{job.salaryRange}</p>

            <div className="flex items-center gap-2">
                <BriefcaseIcon className="w-5 h-5 text-gray-500" />
                <h2 className="font-semibold">Employment Type:</h2>
            </div>
            <p>{job.employmentType?.replace("_", " ").toLowerCase()}</p>

            <div className="flex items-center gap-2">
                <UserIcon className="w-5 h-5 text-gray-500" />
                <h2 className="font-semibold">Posted By:</h2>
            </div>
            <p>{job.employee?.name || "Unknown"}</p>

            <div className="flex gap-4 mt-4">
                <button
                    onClick={handleApply}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition flex items-center gap-2"
                >
                    <BriefcaseIcon className="w-4 h-4" />
                    Apply
                </button>
                <button
                    onClick={handleReport}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition flex items-center gap-2"
                >
                    <UserIcon className="w-4 h-4" />
                    Report
                </button>
            </div>
        </div>
    );
};

export default JobDetails;
