export default function ApplicationMessageSkeleton() {
    return (
        <div className="bg-white dark:bg-black min-h-screen">
            {/* Navbar skeleton */}
            <div className="h-16 bg-gray-200 dark:bg-gray-700 animate-pulse" />

            <div className="p-6 max-w-3xl mx-auto space-y-6">
                {/* Back button placeholder */}
                <div className="h-6 w-36 rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse mt-10 mb-10" />

                {/* Applicant Info + Status Button */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
                        <div className="h-5 w-32 rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse" />
                    </div>
                    <div className="h-8 w-24 rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse" />
                </div>

                {/* Subject */}
                <div className="h-8 w-3/4 rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse" />

                {/* Message */}
                <div className="space-y-2">
                    <div className="h-4 w-full rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse" />
                    <div className="h-4 w-5/6 rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse" />
                    <div className="h-4 w-4/6 rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse" />
                </div>
            </div>
        </div>
    )
}
