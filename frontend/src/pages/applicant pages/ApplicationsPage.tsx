import { useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import { applicationStore } from "@/store/useApplicationStore";
import { Navbar } from "@/components/navbar";
import { format } from "date-fns";
import { Briefcase, Calendar, ArrowRight } from "lucide-react";

export default function ApplicationsPage() {
    const { applicantApplications, getApplications, isLoading } = applicationStore();
    const navigate = useNavigate();

    useEffect(() => {
        getApplications();
    }, [getApplications]);

    const statusColors = {
        PENDING: "bg-gray-400 text-white",
        VIEWED: "bg-yellow-400 text-black dark:bg-yellow-500 dark:text-black",
        REJECTED: "bg-red-500 text-white",
        SHORTLISTED: "bg-green-600 text-white",
        WITHDRAWN: "bg-gray-600 text-white"
    };

    // Sort applications: newest first
    const sortedApplications = [...applicantApplications].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return (
        <div className="min-h-screen bg-white text-black dark:bg-black dark:text-white">
            <Navbar />
            <main className="p-6 max-w-5xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">My Applications</h1>

                {isLoading ? (
                    <div className="space-y-4">
                        {[...Array(5)].map((_, i) => (
                            <div
                                key={i}
                                className="p-6 rounded-xl shadow-md bg-gray-200 dark:bg-gray-950 animate-pulse flex justify-between items-center"
                            >
                                <div className="space-y-2">
                                    <div className="h-6 w-48 bg-gray-300 dark:bg-gray-700 rounded"></div>
                                    <div className="h-4 w-32 bg-gray-300 dark:bg-gray-700 rounded"></div>
                                </div>
                                <div className="space-x-2 flex items-center">
                                    <div className="h-5 w-16 bg-gray-300 dark:bg-gray-700 rounded"></div>
                                    <div className="h-5 w-20 bg-gray-300 dark:bg-gray-700 rounded"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : sortedApplications.length === 0 ? (
                    <p className="text-center text-gray-500 dark:text-gray-400 mt-10">
                        You have not applied to any jobs yet.
                    </p>
                ) : (
                    <div className="space-y-6">
                        {sortedApplications.map((app: any) => {
                            const createdAt = app.createdAt
                                ? format(new Date(app.createdAt), "PPP")
                                : "Unknown";

                            return (
                                <motion.div
                                    key={app._id}
                                    className="group p-6 rounded-xl shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 transition-colors duration-200"
                                    whileHover={{ scale: 1.03, y: -3 }}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {/* Left: Subject */}
                                    <div className="space-y-2 mb-4 sm:mb-0">
                                        <h2 className="text-xl font-semibold flex items-center gap-2">
                                            <Briefcase className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                                            {app.subject}
                                        </h2>
                                        <p className="text-gray-500 dark:text-gray-400 text-sm flex items-center gap-1">
                                            <Calendar className="w-4 h-4" />
                                            Applied on: {createdAt}
                                        </p>
                                    </div>

                                    {/* Right: Status & Navigate */}
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                                        <span
                                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                                                statusColors[app.status]
                                            }`}
                                        >
                                            {app.status[0].toUpperCase() + app.status.slice(1)}
                                        </span>

                                        <button
                                            onClick={() => navigate(`/a-application/${app._id}`)}
                                            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition"
                                            aria-label="View application details"
                                        >
                                            <ArrowRight className="w-5 h-5" />
                                        </button>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </main>
        </div>
    );
}
