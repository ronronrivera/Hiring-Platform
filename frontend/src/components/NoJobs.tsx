import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { Briefcase, ArrowRight } from "lucide-react";

export function NoJobs() {
    const navigate = useNavigate();

    return (
        <div className="col-span-full flex flex-col items-center justify-center gap-4 py-16 text-center">
            <Briefcase className="w-16 h-16 text-gray-400 dark:text-gray-500" />
            <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">
                No jobs available
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-md">
                It looks like there are currently no published jobs. Check back later
            </p>
        </div>
    );
}
