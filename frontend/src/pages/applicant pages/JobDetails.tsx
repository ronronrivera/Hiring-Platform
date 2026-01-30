import { useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { jobStore } from "@/store/useJobStore";
import { toast } from "sonner";
import {
    BriefcaseIcon,
    UserIcon,
    DollarSignIcon,
    TagIcon,
    ArrowLeftIcon,
    ClockIcon,
} from "lucide-react";
import { Navbar } from "@/components/navbar";
import { JobDetailsSkeleton } from "./jobDetailsSkeleton";
import { applicationStore } from "@/store/useApplicationStore";

const JobDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { currentApplicantJobs, fetchJobById, isLoading } = jobStore();
    const {hasApplied, checkExistingApplication} = applicationStore()
    
    useEffect(() => {
        if (id){ 
            fetchJobById(id)
            checkExistingApplication(id);
        }
    }, [id]);

    const job = currentApplicantJobs;

    const formatDate = (date?: string) => {
        if (!date) return "—";
        return new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    if (isLoading || !job) {
        return (
            <JobDetailsSkeleton/>
       );
    }

    const handleApply = () => {
        navigate(`/ajob/${id}/apply`);
    };

    const handleReport = () => {
        toast("Job reported. Thank you for your feedback.");
    };

    return (
        <div className="min-h-screen text-black dark:text-white bg-white dark:bg-black">
            <Navbar />

            <div className="max-w-4xl mx-auto px-4 pt-8 pb-20">
                {/* Back */}
                <button
                    onClick={() => navigate("/home")}
                    className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition mb-6"
                >
                    <ArrowLeftIcon className="w-5 h-5" />
                    <span className="text-sm font-medium">Back</span>
                </button>

                {/* Actions */}
                <div className="flex justify-center gap-3 mb-10">
                    

                    <button
                        onClick={handleApply}
                        disabled={hasApplied}
                        className={`
                            px-5 py-2 rounded-lg transition flex items-center gap-2
                            ${hasApplied? "bg-gray-700 cursor-not-allowed text-black": "bg-green-500 hover:bg-green-600 text-white"}`}
                    >
                        <BriefcaseIcon className="w-4 h-4" />
                        {hasApplied ? "Applied" : "Apply"}
                    </button>


                    <button
                        onClick={handleReport}
                        className="px-5 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition flex items-center gap-2"
                    >
                        <UserIcon className="w-4 h-4" />
                        Report
                    </button>
                </div>

                {/* Job Card */}
                <div className="max-w-3xl mx-auto p-8 rounded-2xl shadow-md space-y-8">
                    {/* Title */}
                    <div>
                        <h1 className="text-3xl font-bold mb-2">
                            {job.title}
                        </h1>

                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
                            <ClockIcon className="w-4 h-4" />
                            <span>Posted {formatDate(job.createdAt)}</span>
                        </div>

                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                            {job.description}
                        </p>
                    </div>

                    <hr className="border-neutral-800" />

                    {/* Meta */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <DollarSignIcon className="w-5 h-5 text-gray-500" />
                            <span className="font-semibold w-36">
                                Salary Range
                            </span>
                            <span>{job.salaryRange}</span>
                        </div>

                        <div className="flex items-center gap-3">
                            <BriefcaseIcon className="w-5 h-5 text-gray-500" />
                            <span className="font-semibold w-36">
                                Employment
                            </span>
                            <span>
                                {job.employmentType?.replace("_", " ")}
                            </span>
                        </div>

                        <div className="flex items-center gap-3">
                            <UserIcon className="w-5 h-5 text-gray-500" />
                            <span className="font-semibold w-36">
                                Posted by
                            </span>
                            <img src={job.employee?.profile.avatar?.url || "/avatar.png"} className="size-6 rounded-full"/>
                            <span>
                                {job.employee?.profile?.name || "Unknown"}
                            </span>
                        </div>
                    </div>

                    <hr className="border-neutral-800" />

                    {/* Skills */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <TagIcon className="w-5 h-5 text-gray-500" />
                            <h2 className="font-semibold text-lg">
                                Skills Required
                            </h2>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {job.skills?.map((skill: string, idx: number) => (
                                <span
                                    key={idx}
                                    className="px-3 py-1 text-sm rounded-full bg-gray-100 dark:bg-neutral-900 border border-gray-300 dark:border-neutral-700 capitalize"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobDetails;
