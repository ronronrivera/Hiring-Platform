import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSignIcon, ClockIcon } from "lucide-react";
import { useNavigate } from "react-router";

export function JobCard({ job }) {
    const navigate = useNavigate();

    const formatDate = (date?: string) => {
        if (!date) return "—";
        return new Date(date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
        });
    };

    return (
        <Card className="hover:shadow-lg transition h-full">
            <CardContent className="flex flex-col h-full p-4">
                {/* TOP */}
                <div className="flex-1 space-y-3">
                    {/* Title */}
                    <h2 className="text-lg font-semibold line-clamp-2">
                        {job.title}
                    </h2>

                    {/* Meta */}
                    <div className="flex flex-wrap gap-3 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                            <DollarSignIcon className="w-4 h-4" />
                            {job.salaryRange}
                        </span>

                        <span className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-xs">
                            {job.employmentType.replace("_", " ")}
                        </span>

                        <span className="flex items-center gap-1 text-xs">
                            <ClockIcon className="w-3.5 h-3.5" />
                            {formatDate(job.createdAt)}
                        </span>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                        {job.description}
                    </p>

                    {/* Skills */}
                    {job.skills?.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {job.skills.slice(0, 4).map((skill, i) => (
                                <span
                                    key={i}
                                    className="px-2 py-0.5 text-xs rounded bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                                >
                                    {skill}
                                </span>
                            ))}
                            {job.skills.length > 4 && (
                                <span className="text-xs text-gray-400">
                                    +{job.skills.length - 4} more
                                </span>
                            )}
                        </div>
                    )}
                </div>

                {/* FOOTER */}
                <div className="pt-4 mt-auto">
                    <Button
                        className="w-full"
                        onClick={() => navigate(`/ajob/${job._id}`)}
                    >
                        See more
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
