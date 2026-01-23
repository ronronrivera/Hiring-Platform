import { CalendarDaysIcon, BriefcaseIcon, DollarSign } from "lucide-react";
import { Navbar } from "./navbar";

const JobDetailsSkeleton = () => {
    return (
        <div>
            <Navbar/>
            <div className="bg-white dark:bg-black min-h-screen animate-pulse">
                <div className="max-w-5xl mx-auto p-6 space-y-6">
                    {/* Job Info Skeleton */}
                    <div className="border rounded-xl p-6 space-y-4 bg-white dark:bg-gray-900 shadow-sm">
                        <div className="flex justify-between items-start">
                            <div className="space-y-2">
                                <div className="h-8 w-64 bg-gray-300 dark:bg-gray-700 rounded"></div>
                                <div className="h-4 w-32 bg-gray-200 dark:bg-gray-600 rounded"></div>
                            </div>

                            <div className="flex gap-2">
                                <div className="h-8 w-28 bg-gray-300 dark:bg-gray-700 rounded"></div>
                                <div className="h-8 w-28 bg-gray-300 dark:bg-gray-700 rounded"></div>
                            </div>
                        </div>

                        {/* Job Meta Skeleton */}
                        <div className="flex flex-wrap gap-4 mt-2">
                            <div className="flex items-center gap-1">
                                <CalendarDaysIcon className="w-4 h-4 text-gray-300 dark:text-gray-600" />
                                <div className="h-3 w-20 bg-gray-200 dark:bg-gray-600 rounded"></div>
                            </div>
                            <div className="flex items-center gap-1">
                                <BriefcaseIcon className="w-4 h-4 text-gray-300 dark:text-gray-600" />
                                <div className="h-3 w-24 bg-gray-200 dark:bg-gray-600 rounded"></div>
                            </div>
                            <div className="flex items-center gap-1">
                                <DollarSign className="w-4 h-4 text-gray-300 dark:text-gray-600" />
                                <div className="h-3 w-16 bg-gray-200 dark:bg-gray-600 rounded"></div>
                            </div>
                        </div>

                        <div className="mt-4 space-y-2">
                            <div className="h-4 w-full bg-gray-200 dark:bg-gray-600 rounded"></div>
                            <div className="h-4 w-full bg-gray-200 dark:bg-gray-600 rounded"></div>
                            <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-600 rounded"></div>
                        </div>

                        <div className="flex flex-wrap gap-2 mt-4">
                            <div className="h-6 w-20 bg-gray-200 dark:bg-gray-600 rounded-full"></div>
                            <div className="h-6 w-24 bg-gray-200 dark:bg-gray-600 rounded-full"></div>
                            <div className="h-6 w-16 bg-gray-200 dark:bg-gray-600 rounded-full"></div>
                        </div>
                    </div>

                    {/* Applications Skeleton */}
                    <div className="border rounded-xl p-6 bg-white dark:bg-gray-900 shadow-sm space-y-4">
                        <div className="h-6 w-40 bg-gray-300 dark:bg-gray-700 rounded"></div>
                        <div className="space-y-2">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="border rounded-lg p-4 space-y-2 bg-gray-50 dark:bg-gray-800">
                                    <div className="h-4 w-32 bg-gray-200 dark:bg-gray-600 rounded"></div>
                                    <div className="h-3 w-40 bg-gray-200 dark:bg-gray-600 rounded"></div>
                                    <div className="h-3 w-24 bg-gray-200 dark:bg-gray-600 rounded"></div>
                                    <div className="h-3 w-48 bg-gray-200 dark:bg-gray-600 rounded"></div>
                                    <div className="h-3 w-28 bg-gray-200 dark:bg-gray-600 rounded"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default JobDetailsSkeleton;
