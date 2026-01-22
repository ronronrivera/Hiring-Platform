import { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { useStore } from "@/store/useAuthStore";
import { BriefcaseIcon, MapPinIcon, DollarSignIcon } from "lucide-react";
import { toast } from "sonner";

// Mock data for demonstration; replace with API call
const mockJobs = [
  { id: 1, title: "Frontend Developer", company: "TechCorp", location: "Manila", salary: "30k-50k", type: "Full-time" },
  { id: 2, title: "Backend Developer", company: "SoftInc", location: "Cebu", salary: "35k-55k", type: "Full-time" },
  { id: 3, title: "UI/UX Designer", company: "DesignStudio", location: "Remote", salary: "25k-40k", type: "Part-time" },
  // Add more jobs...
];

export function ApplicantPage() {
  const { user } = useStore();
  const [search, setSearch] = useState("");
  const [jobs, setJobs] = useState(mockJobs);
  const [filteredJobs, setFilteredJobs] = useState(mockJobs);

  useEffect(() => {
    // Filter jobs based on search query
    setFilteredJobs(
      jobs.filter(
        (job) =>
          job.title.toLowerCase().includes(search.toLowerCase()) ||
          job.company.toLowerCase().includes(search.toLowerCase()) ||
          job.location.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, jobs]);

  const handleApply = (jobId: number) => {
    toast.success("Application submitted!");

  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      {/* Navbar */}
      <Navbar />

      {/* Welcome Section */}
      <div className="max-w-3xl mx-auto mt-12 text-center px-4">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Find your next job, {user.profile?.name.split(" ")[0]}
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Explore opportunities that match your skills and preferences.
        </p>

        {/* Search Bar */}
        <div className="flex justify-center gap-2">
          <Input
            placeholder="Search jobs, companies, or locations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-lg"
          />
          <Button onClick={() => setFilteredJobs(filteredJobs)}>Search</Button>
        </div>
      </div>

      {/* Jobs List */}
      <div className="max-w-6xl mx-auto mt-12 px-4 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredJobs.length === 0 ? (
          <p className="text-center col-span-full text-gray-600 dark:text-gray-300">
            No jobs found.
          </p>
        ) : (
          filteredJobs.map((job) => (
            <Card key={job.id} className="hover:shadow-lg transition-shadow">
              <CardContent>
                <div className="flex items-center justify-between mb-2">
                  <CardTitle className="text-lg">{job.title}</CardTitle>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{job.type}</span>
                </div>
                <CardDescription className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  <div className="flex items-center gap-2">
                    <BriefcaseIcon className="w-4 h-4" />
                    {job.company}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPinIcon className="w-4 h-4" />
                    {job.location}
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSignIcon className="w-4 h-4" />
                    {job.salary}
                  </div>
                </CardDescription>
                <Button onClick={() => handleApply(job.id)} className="w-full">
                  Apply Now
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
