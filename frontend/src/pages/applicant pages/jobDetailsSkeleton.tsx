import { Navbar } from "@/components/navbar";

export const JobDetailsSkeleton = () => {
    return (
        <div className="min-h-screen bg-white dark:bg-black">
            <Navbar />

            <div className="max-w-4xl mx-auto px-4 pt-8 pb-20 animate-pulse">
                {/* Back */}
                <div className="h-4 w-20 bg-gray-200 dark:bg-neutral-800 rounded mb-8" />

                {/* Actions */}
                <div className="flex justify-center gap-3 mb-10">
                    <div className="h-10 w-28 bg-gray-200 dark:bg-neutral-800 rounded-lg" />
                    <div className="h-10 w-28 bg-gray-200 dark:bg-neutral-800 rounded-lg" />
                </div>

                {/* Card */}
                <div className="max-w-3xl mx-auto p-8 rounded-2xl shadow-md space-y-8">
                    {/* Title */}
                    <div>
                        <div className="h-8 w-3/4 bg-gray-200 dark:bg-neutral-800 rounded mb-4" />
                        <div className="h-4 w-40 bg-gray-200 dark:bg-neutral-800 rounded mb-6" />

                        <div className="space-y-2">
                            <div className="h-4 w-full bg-gray-200 dark:bg-neutral-800 rounded" />
                            <div className="h-4 w-full bg-gray-200 dark:bg-neutral-800 rounded" />
                            <div className="h-4 w-5/6 bg-gray-200 dark:bg-neutral-800 rounded" />
                        </div>
                    </div>

                    <hr className="border-neutral-800" />

                    {/* Meta */}
                    <div className="space-y-4">
                        {[1, 2, 3].map((_, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className="h-5 w-5 bg-gray-200 dark:bg-neutral-800 rounded" />
                                <div className="h-4 w-36 bg-gray-200 dark:bg-neutral-800 rounded" />
                                <div className="h-4 w-40 bg-gray-200 dark:bg-neutral-800 rounded" />
                            </div>
                        ))}
                    </div>

                    <hr className="border-neutral-800" />

                    {/* Skills */}
                    <div>
                        <div className="h-5 w-48 bg-gray-200 dark:bg-neutral-800 rounded mb-4" />
                        <div className="flex flex-wrap gap-2">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="h-8 w-20 bg-gray-200 dark:bg-neutral-800 rounded-full"
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
