import {  useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { BriefcaseIcon, Loader2Icon, UserIcon } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import { useStore } from "@/store/useAuthStore"
import PageLoader from "@/components/PageLoader"

type FormState = {
    role: string
    bio: string
    preferredSalary: string
    website: string
    address: string
    month: string
    day: string
    year: string
    mobileNumber: string
    image: File | null
}

export default function SetupProfile() {
    const [step, setStep] = useState(0)

    const {checkAuth, CheckingAuth} = useStore();

    useEffect(() => {
        checkAuth();
    },[checkAuth])

    const [form, setForm] = useState<FormState>({
        role: "",
        bio: "",
        preferredSalary: "",
        website: "",
        address: "",
        month: "",
        day: "",
        year: "",
        mobileNumber: "",
        image: null,
    })

    const steps = [
        {
            title: "Choose your role",
            content: (
                <div className="grid grid-cols-2 gap-4">
                    <button
                        type="button"
                        onClick={() => setForm({ ...form, role: "applicant" })}
                        className={`rounded-xl border p-4 flex flex-col items-center gap-3 transition ${
form.role === "applicant" ? "border-primary bg-primary/10" : "hover:border-primary/50"
}`}
                    >
                        <UserIcon className="size-8" />
                        <span className="font-semibold">Job Seeker</span>
                        <span className="text-xs text-muted-foreground">Find and apply for jobs</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setForm({ ...form, role: "employee" })}
                        className={`rounded-xl border p-4 flex flex-col items-center gap-3 transition ${
form.role === "employee" ? "border-primary bg-primary/10" : "hover:border-primary/50"
}`}
                    >
                        <BriefcaseIcon className="size-8" />
                        <span className="font-semibold">Employer</span>
                        <span className="text-xs text-muted-foreground">Hire and manage applicants</span>
                    </button>
                </div>
            ),
        },
        {
            title: "Short bio",
            content: (
                <Textarea
                    placeholder="Tell us about yourself"
                    value={form.bio}
                    onChange={(e) => setForm({ ...form, bio: e.target.value })}
                />
            ),
        },
        {
            title: "Preferred salary",
            content: (
                <Input
                    placeholder="e.g. 80,000 PHP"
                    value={form.preferredSalary}
                    onChange={(e) => setForm({ ...form, preferredSalary: e.target.value })}
                />
            ),
        },
        {
            title: "Website / Portfolio",
            content: (
                <Input
                    placeholder="https://yourwebsite.com"
                    value={form.website}
                    onChange={(e) => setForm({ ...form, website: e.target.value })}
                />
            ),
        },
        {
            title: "Address",
            content: (
                <Input
                    placeholder="City, Country"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                />
            ),
        },
        {
            title: "Mobile number",
            content: (
                <Input
                    placeholder="+63XXXXXXXXXX"
                    value={form.mobileNumber}
                    onChange={(e) => setForm({ ...form, mobileNumber: e.target.value })}
                />
            ),
        },
        {
            title: "Upload Profile Image",
            content: (
                <div className="flex flex-col items-center gap-4">
                    <div className="relative w-32 h-32 rounded-full overflow-hidden border border-muted-foreground group cursor-pointer">
                        <img
                            src={form.image ? URL.createObjectURL(form.image) : "/avatar.png"}
                            alt="Profile"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <span className="text-white text-sm font-medium text-center">Choose profile picture</span>
                        </div>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                    setForm({ ...form, image: e.target.files[0] })
                                }
                            }}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                    </div>
                    <p className="text-xs text-muted-foreground">Upload your profile picture</p>
                </div>
            ),
        },
        {
            title: "Birth date",
            content: (
                <div className="grid grid-cols-3 gap-2">
                    <Input
                        placeholder="MM"
                        value={form.month}
                        onChange={(e) => setForm({ ...form, month: e.target.value })}
                    />
                    <Input
                        placeholder="DD"
                        value={form.day}
                        onChange={(e) => setForm({ ...form, day: e.target.value })}
                    />
                    <Input
                        placeholder="YYYY"
                        value={form.year}
                        onChange={(e) => setForm({ ...form, year: e.target.value })}
                    />
                </div>
            ),
        },
    ]


    const setupProfile = useStore((state) => state.setupProfile)
    const {loading} = useStore();

    const handleNext = async () => {
        // Validation for required fields
        if (step === 0 && !form.role) {
            toast.error("Please select a role.")
            return
        }
        if (step === 2 && !form.preferredSalary) {
            toast.error("Please enter your preferred salary.")
            return
        }
        if (step === steps.length - 1) {
            if (!form.month || !form.day || !form.year) {
                toast.error("Please enter your birth date.")
                return
            }

            // Call your store function to submit form
            await setupProfile({
                role: form.role,
                bio: form.bio,
                preferredSalary: form.preferredSalary,
                website: form.website,
                address: form.address,
                month: form.month,
                day: form.day,
                year: form.year,
                mobileNumber: form.mobileNumber,
                image: form.image
            })
            toast.success("Profile setup successfully");
            return
        }
        setStep(step + 1)
    }


    const handleBack = () => setStep(step - 1)

    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/30">
            {CheckingAuth? (<PageLoader/>) : (
                <Card className="w-full max-w-md">
                    <CardContent className="p-6 space-y-6">
                        <div className="space-y-1">
                            <h2 className="text-2xl font-bold">{steps[step].title}</h2>
                            <p className="text-sm text-muted-foreground">
                                Step {step + 1} of {steps.length}
                            </p>
                        </div>

                        <AnimatePresence>
                            <motion.div
                                key={step}
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                transition={{ duration: 0.3 }}
                            >
                                {steps[step].content}
                            </motion.div>
                        </AnimatePresence>

                        <div className="flex justify-between">
                            <Button variant="ghost" disabled={step === 0} onClick={handleBack}>
                                Back
                            </Button>
                            <Button onClick={handleNext}>
                                {step === steps.length - 1 ? "Finish" : "Next"}
                                {step === steps.length - 1 && loading? (<Loader2Icon className="size-6 animate-spin"/>) : ("")}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
