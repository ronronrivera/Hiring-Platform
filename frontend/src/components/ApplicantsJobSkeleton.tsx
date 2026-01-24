export function JobCardSkeleton() {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-5 animate-pulse space-y-4">
      {/* Title */}
      <div className="h-5 w-3/4 bg-gray-200 dark:bg-gray-800 rounded" />

      {/* Company / meta */}
      <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-800 rounded" />

      {/* Description */}
      <div className="space-y-2">
        <div className="h-3 w-full bg-gray-200 dark:bg-gray-800 rounded" />
        <div className="h-3 w-5/6 bg-gray-200 dark:bg-gray-800 rounded" />
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center pt-2">
        <div className="h-4 w-20 bg-gray-200 dark:bg-gray-800 rounded" />
        <div className="h-9 w-24 bg-gray-200 dark:bg-gray-800 rounded-lg" />
      </div>
    </div>
  );
}
