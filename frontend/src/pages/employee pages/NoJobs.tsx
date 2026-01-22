import React from "react";
import { BriefcaseIcon } from "lucide-react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button"; 

interface NoJobsProps {
  message?: string;
}

const NoJobs: React.FC<NoJobsProps> = ({ message }) => {
  const navigate = useNavigate();

  const handlePostJob = () => {
    navigate("/postjob");
  };

  return (
    <div className="flex flex-col items-center justify-center p-10 bg-white dark:bg-gray-800 border rounded-lg shadow-sm">
      <BriefcaseIcon className="w-16 h-16 text-gray-400 mb-4 animate-bounce" />
      <h2 className="text-2xl font-semibold text-gray-400 mb-2">
        {message || "No jobs yet"}
      </h2>
      <p className="text-gray-500 text-center max-w-xs mb-4">
        You haven’t posted any jobs yet. Click the button below to start hiring talent!
      </p>
      <Button onClick={handlePostJob} className="bg-blue-600 hover:bg-blue-700 text-white">
        Post Job
      </Button>
    </div>
  );
};

export default NoJobs;
