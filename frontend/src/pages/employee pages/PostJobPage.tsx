
import { useState, KeyboardEvent } from "react";
import { Navbar } from "@/components/navbar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    BriefcaseIcon,
    FileTextIcon,
    DollarSignIcon,
    TagsIcon,
    XIcon,
    CheckCircleIcon,
    ClipboardIcon,
    Loader2Icon,
} from "lucide-react";
import { motion } from "framer-motion";
import { jobStore } from "@/store/useJobStore";
import JobSuccess from "./SuccessPostPage";

type EmploymentType = "FULL_TIME" | "PART_TIME" | "GIG";
type JobState = "draft" | "published";

interface JobForm {
    title: string;
    description: string;
    salaryRange: string;
    employmentType: EmploymentType;
    skills: string[];
    states: JobState;
}

const emptyForm: JobForm = {
    title: "",
    description: "",
    salaryRange: "",
    employmentType: "FULL_TIME",
    skills: [],
    states: "draft",
};

const countWords = (text: string) =>
    text.trim() === "" ? 0 : text.trim().split(/\s+/).length;

export default function PostJobPage() {
    const [form, setForm] = useState<JobForm>(emptyForm);
    const [skillInput, setSkillInput] = useState("");
    const [success, setSuccess] = useState(false);

    const { postJob, isLoading } = jobStore();

    // ---------- SKILLS ----------
    const handleSkillKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && skillInput.trim()) {
            e.preventDefault();

            const normalized = skillInput
            .trim()
            .toLowerCase()
            .replace(/\s+/g, " ");

            if (!form.skills.includes(normalized)) {
                setForm(prev => ({
                    ...prev,
                    skills: [...prev.skills, normalized],
                }));
            }

            setSkillInput("");
        }
    };

    const removeSkill = (skill: string) => {
        setForm(prev => ({
            ...prev,
            skills: prev.skills.filter(s => s !== skill),
        }));
    };

    // ---------- SUBMIT ----------
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await postJob(form);
            setSuccess(true);
        } catch {
            setSuccess(false);
        }
    };

    const handlePostAnother = () => {
        setForm(emptyForm);
        setSkillInput("");
        setSuccess(false);
    };

    return (
        <div className="min-h-screen bg-white dark:bg-black">
            <Navbar />

            {/* Header */}
            <div className="max-w-3xl mx-auto mt-6 text-center px-4">
                <h1 className="text-3xl md:text-4xl font-bold mb-3">
                    Post a Job
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                    Create and publish a new job listing for applicants.
                </p>
            </div>

            {/* Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="max-w-3xl mx-auto mt-10 px-4"
            >
                <Card className="shadow-lg min-h-130">
                    <CardContent className="h-full">
                        {success ? (
                            //  SUCCESS STATE
                            <JobSuccess
                                isDraft={form.states === "draft"}
                                onPostAnother={handlePostAnother}
                            />
                        ) : (
                                // 📝 FORM STATE
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* TITLE */}
                                    <div>
                                        <label className="flex items-center gap-2 text-sm font-medium mb-1">
                                            <BriefcaseIcon className="w-4 h-4" />
                                            Job Title
                                        </label>
                                        <Input
                                            required
                                            value={form.title}
                                            onChange={e =>
                                                setForm({ ...form, title: e.target.value })
                                            }
                                            placeholder="e.g. Senior Frontend Developer"
                                        />
                                    </div>

                                    {/* DESCRIPTION */}
                                    <div>
                                        <label className="flex items-center gap-2 text-sm font-medium mb-1">
                                            <FileTextIcon className="w-4 h-4" />
                                            Description
                                        </label>

                                        <textarea
                                            required
                                            value={form.description}
                                            onChange={e => {
                                                const value = e.target.value;
                                                if (countWords(value) <= 2000) {
                                                    setForm({ ...form, description: value });
                                                }
                                            }}
                                            onInput={e => {
                                                const el = e.currentTarget;
                                                el.style.height = "auto"; // reset height
                                                el.style.height = `${el.scrollHeight}px`; // set to scrollHeight
                                            }}
                                            className="w-full resize-none rounded-md border px-3 py-2 text-sm leading-relaxed overflow-hidden"
                                            placeholder="Describe responsibilities, expectations, and requirements..."
                                            rows={3} // default visible rows
                                        />
                                        <div className="text-xs text-right text-gray-500">
                                            {countWords(form.description)} / 2000 words
                                        </div>
                                    </div>

                                    {/* SALARY */}
                                    <div>
                                        <label className="flex items-center gap-2 text-sm font-medium mb-1">
                                            <DollarSignIcon className="w-4 h-4" />
                                            Salary Range
                                        </label>
                                        <Input
                                            required
                                            value={form.salaryRange}
                                            onChange={e =>
                                                setForm({ ...form, salaryRange: e.target.value })
                                            }
                                            placeholder="₱40,000 - ₱60,000"
                                        />
                                    </div>

                                    {/* EMPLOYMENT TYPE */}
                                    <div>
                                        <label className="flex items-center gap-2 text-sm font-medium mb-1">
                                            <ClipboardIcon className="w-4 h-4" />
                                            Employment Type
                                        </label>
                                        <select
                                            value={form.employmentType}
                                            onChange={e =>
                                                setForm({
                                                    ...form,
                                                    employmentType:
                                                    e.target.value as EmploymentType,
                                                })
                                            }
                                            className="w-full rounded-md border px-3 py-2 text-sm"
                                        >
                                            <option value="FULL_TIME">Full Time</option>
                                            <option value="PART_TIME">Part Time</option>
                                            <option value="GIG">Gig</option>
                                        </select>
                                    </div>

                                    {/* SKILLS */}
                                    <div>
                                        <label className="flex items-center gap-2 text-sm font-medium mb-2">
                                            <TagsIcon className="w-4 h-4" />
                                            Skills
                                        </label>

                                        <div className="flex flex-wrap gap-2 mb-3">
                                            {form.skills.map(skill => (
                                                <span
                                                    key={skill}
                                                    className="flex items-center gap-2 bg-gray-200 dark:bg-gray-800 px-3 py-1 rounded-md text-sm"
                                                >
                                                    {skill}
                                                    <button
                                                        type="button"
                                                        onClick={() => removeSkill(skill)}
                                                    >
                                                        <XIcon className="w-3 h-3" />
                                                    </button>
                                                </span>
                                            ))}
                                        </div>

                                        <Input
                                            value={skillInput}
                                            onChange={e => setSkillInput(e.target.value)}
                                            onKeyDown={handleSkillKeyDown}
                                            placeholder="Type a skill and press Enter"
                                        />
                                    </div>

                                    {/* STATUS */}
                                    <div>
                                        <label className="flex items-center gap-2 text-sm font-medium mb-1">
                                            <CheckCircleIcon className="w-4 h-4" />
                                            Status
                                        </label>
                                        <select
                                            value={form.states}
                                            onChange={e =>
                                                setForm({
                                                    ...form,
                                                    states: e.target.value as JobState,
                                                })
                                            }
                                            className="w-full rounded-md border px-3 py-2 text-sm"
                                        >
                                            <option value="draft">Draft</option>
                                            <option value="published">Published</option>
                                        </select>
                                    </div>

                                    {/* ACTION */}
                                    <Button type="submit" className="w-full">
                                        {isLoading ? (
                                            <Loader2Icon className="animate-spin" />
                                        ) : (
                                                "Save Job"
                                            )}
                                    </Button>
                                </form>
                            )}
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
