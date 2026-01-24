import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Navbar } from "@/components/navbar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useStore } from "@/store/useAuthStore";
import { jobStore } from "@/store/useJobStore";
import { JobCard } from "@/components/JobCard";
import { JobCardSkeleton } from "@/components/ApplicantsJobSkeleton";
import { NoJobs } from "@/components/NoJobs";

export function ApplicantPage() {
    const { user } = useStore();
    const { jobs, getAllJobs, isLoading } = jobStore();
    const navigate = useNavigate();

    const [search, setSearch] = useState("");

    useEffect(() => {
        getAllJobs();
    }, [getAllJobs]);


    const handleSearch = () => {
        const q = search.trim();
        if (!q) return;

        const formatted = encodeURIComponent(q).replace(/%20/g, "+");
        navigate(`/jobs/search?query=${formatted}`);
    };
    
    
    const JOBS_PER_PAGE = 9;


    const publishedJobs = jobs.filter(j => j.status === "published");
    const visibleJobs = publishedJobs.slice(0, JOBS_PER_PAGE);

    return (
        <div className="min-h-screen bg-white dark:bg-black">
            <Navbar />

            {/* Header + Search */}
            <div className="max-w-3xl mx-auto mt-12 text-center px-4">
                <h1 className="text-3xl md:text-4xl font-bold mb-4">
                    Find your next job, {user.profile?.name.split(" ")[0]}
                </h1>

                <div className="flex gap-2 justify-center">
                    <Input
                        placeholder="Search jobs, skills, keywords..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full max-w-lg"
                    />
                    <Button onClick={handleSearch}>Search</Button>
                </div>
            </div>

            {/* Jobs */}
            <div className="max-w-6xl mx-auto mt-12 px-4 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {isLoading ? (
                    Array.from({ length: JOBS_PER_PAGE }).map((_, i) => (
                        <JobCardSkeleton key={i} />
                    ))
                ) : jobs.filter(j => j.status === "published").length === 0 ? (
                        <NoJobs/>
                    ) : (
                            visibleJobs
                            .map(job => (
                                <JobCard key={job._id} job={job} />
                            ))
                        )}
            </div>
        </div>
    );
}
