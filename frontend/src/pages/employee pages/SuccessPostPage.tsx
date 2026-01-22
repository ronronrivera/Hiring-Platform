import { FC } from "react";
import { Button } from "@/components/ui/button";
import {
    CheckCircleIcon,
    AlertTriangleIcon,
} from "lucide-react";
import { motion } from "framer-motion";

interface JobSuccessProps {
    isDraft: boolean;
    onPostAnother: () => void;
}

const JobSuccess: FC<JobSuccessProps> = ({ isDraft, onPostAnother }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center justify-center h-full text-center gap-4"
        >
            {isDraft ? (
                <>
                    <AlertTriangleIcon className="w-14 h-14 text-yellow-500" />
                    <h2 className="text-2xl font-semibold text-yellow-600">
                        Job saved as draft
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 max-w-sm">
                        This job is currently a draft. Applicants will not see it until you publish.
                    </p>
                </>
            ) : (
                <>
                    <CheckCircleIcon className="w-14 h-14 text-green-500" />
                    <h2 className="text-2xl font-semibold">
                        Job posted successfully
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 max-w-sm">
                        Your job listing is now live and visible to applicants.
                    </p>
                </>
            )}

            <Button
                onClick={onPostAnother}
                className="mt-4"
            >
                {isDraft ? "Create another draft" : "Post another job"}
            </Button>
        </motion.div>
    );
};

export default JobSuccess;
