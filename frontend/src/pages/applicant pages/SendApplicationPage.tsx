import { Navbar } from "@/components/navbar";
import {
    Briefcase,
    DollarSign,
    Calendar,
    Send,
    User,
    Loader2Icon,
} from "lucide-react";

import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { jobStore } from "@/store/useJobStore";
import { useNavigate, useParams } from "react-router";
import { motion } from "framer-motion";
import { applicationStore } from "@/store/useApplicationStore";
import { useState } from "react";

export default function SendApplicationPage() {
    const navigate = useNavigate();
    const { id } = useParams();

    const { currentApplicantJobs } = jobStore();
    const { isLoading, sendApplication } = applicationStore();

    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");

    const formatDate = (date?: string) => {
        if (!date) return "—";
        return new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const handleSubmit = async () => {
        if (!id) return;
        try {
            await sendApplication(subject, message, id);

            navigate(`/ajob/${id}`);
        } catch (error) {
            console.log(error);
        }
    };

    if (!currentApplicantJobs) return null;

    return (
        <div className="min-h-screen bg-white dark:bg-black text-foreground">
            <Navbar />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="flex justify-center px-4 py-10"
            >
                <div className="w-full max-w-4xl space-y-8">
                    {/* Job Info */}
                    <Card className="shadow-md">
                        <CardContent className="p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
                            <InfoItem
                                icon={<Briefcase />}
                                label="Type of Work"
                                value={currentApplicantJobs.employmentType.replace("_", " ")}
                                badge
                            />
                            <InfoItem
                                icon={<DollarSign />}
                                label="Salary"
                                value={currentApplicantJobs.salaryRange}
                            />
                            <InfoItem
                                icon={<User />}
                                label="Posted By"
                                value={currentApplicantJobs.employee?.profile?.name || "—"}
                            />
                            <InfoItem
                                icon={<Calendar />}
                                label="Date Posted"
                                value={formatDate(currentApplicantJobs.createdAt)}
                            />
                        </CardContent>
                    </Card>

                    {/* Application Form */}
                    <Card className="shadow-md">
                        <CardHeader>
                            <CardTitle>Application Details</CardTitle>
                        </CardHeader>

                        <Separator />

                        <CardContent className="pt-6 space-y-6">
                            {/* Subject */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Subject</label>
                                <Input
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    placeholder="Application for React Developer"
                                />
                            </div>

                            {/* Message */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Message</label>
                                <Textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    rows={6}
                                    placeholder="Write your application message here..."
                                    onInput={(e) => {
                                        const el = e.currentTarget;
                                        el.style.height = "auto";
                                        el.style.height = `${el.scrollHeight}px`;
                                    }}
                                />
                            </div>

                            {/* Actions */}
                            <div className="flex justify-end gap-3">
                                <Button
                                    variant="outline"
                                    onClick={() => navigate(`/ajob/${id}`)}
                                    disabled={isLoading}
                                >
                                    Cancel
                                </Button>
                                <Button onClick={handleSubmit} disabled={isLoading}>
                                    {isLoading ? (
                                        <Loader2Icon className="size-4 animate-spin" />
                                    ) : (
                                        <>
                                            <Send className="mr-2 h-4 w-4" />
                                            <span>Send Application</span>
                                        </>
                                    )}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </motion.div>
        </div>
    );
}

function InfoItem({
    icon,
    label,
    value,
    badge = false,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
    badge?: boolean;
}) {
    return (
        <div className="flex items-start gap-4">
            <div className="h-10 w-10 rounded-lg bg-muted text-primary flex items-center justify-center">
                {icon}
            </div>

            <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase">{label}</p>
                {badge ? (
                    <Badge variant="secondary">{value}</Badge>
                ) : (
                    <p className="text-sm font-semibold">{value}</p>
                )}
            </div>
        </div>
    );
}
