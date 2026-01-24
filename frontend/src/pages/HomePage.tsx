import { LoginModal } from "@/components/login-modal"
import { SignupModal } from "@/components/signup-modal"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import {
    UsersRoundIcon,
    BriefcaseIcon,
    UserCheckIcon,
    ZapIcon,
    MessageSquareIcon,
    ShieldCheckIcon,
} from "lucide-react"
import { Link } from "react-router"
import {  useState } from "react"
import JobPreviewCard from "@/components/JobPreviewCard"
import { motion } from "framer-motion"
import { AnimateOnScroll } from "@/components/AnimateScroll"

function HomePage() {
    const [loginOpen, setLoginOpen] = useState(false)
    const [signupOpen, setSignupOpen] = useState(false)
    
    return (
        <div className="min-h-screen flex flex-col">
            {/* NAVBAR */}
            <motion.nav 
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="backdrop-blur-md mt-4 border-primary/20 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto p-4 flex items-center justify-between">
                    <Link
                        to="/"
                        className="flex items-center gap-3 hover:scale-105 transition-transform"
                    >
                        <div className="size-10 rounded-xl bg-linear-to-br from-primary via-secondary to-accent flex items-center justify-center shadow-lg">
                            <UsersRoundIcon className="size-6" />
                        </div>
                        <span className="font-black text-2xl tracking-wider">
                            Recruify
                        </span>
                    </Link>

                    <div className="flex items-center gap-3">
                        <Button onClick={() => setLoginOpen(true)}>
                            Login
                        </Button>
                        <Button onClick={() => setSignupOpen(true)}>
                            Sign up
                        </Button>
                        <ModeToggle />
                    </div>
                </div>
            </motion.nav>

            {/* HERO */}
            <section className="flex-1 flex items-center">
                <div className="max-w-7xl mx-auto px-4 py-24 grid md:grid-cols-2 gap-12 items-center">
                    <motion.div 
                        initial={{ x: -40, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="space-y-6">
                        <h1 className="text-5xl font-black leading-tight">
                            Hire faster. <br /> Get hired smarter.
                        </h1>
                        <p className="text-muted-foreground text-lg">
                            Recruify connects skilled developers with serious companies using
                            smart matching, real skills, and zero noise.
                        </p>
                        <div className="flex gap-4">
                            <Button size="lg" onClick={() => setSignupOpen(true)}>
                                Find Jobs
                            </Button>
                            <Button size="lg" variant="outline" onClick={() => setSignupOpen(true)}>
                                Hire Talent
                            </Button>
                        </div>
                    </motion.div>

                    {/* Placeholder visual */}

                    <motion.div 
                        initial={{ x: 40, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="hidden md:block">
                        <div className="rounded-2xl border bg-background shadow-sm overflow-hidden">
                            {/* Fake Dashboard Header */}
                            <div className="border-b px-4 py-3 flex justify-between items-center">
                                <span className="font-semibold">Your Applications</span>
                                <span className="text-sm text-muted-foreground">Job Seeker</span>
                            </div>

                            {/* Fake Dashboard Content */}
                            <div className="p-4 space-y-3">
                                <JobPreviewCard
                                    title="Frontend Developer"
                                    company="Remote Startup"
                                    status="Interview"
                                />
                                <JobPreviewCard
                                    title="C++ Software Engineer"
                                    company="FinTech Corp"
                                    status="Applied"
                                />
                                <JobPreviewCard
                                    title="Fullstack Developer"
                                    company="SaaS Company"
                                    status="Rejected"
                                />
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* USER PATHS */}
            <section className="border-t bg-muted/30">
                <motion.div 
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-7xl mx-auto px-4 py-20 grid md:grid-cols-2 gap-8">
                    <div className="rounded-2xl border p-8 space-y-4">
                        <BriefcaseIcon className="size-8 text-primary" />
                        <h3 className="text-2xl font-bold">For Job Seekers</h3>
                        <ul className="text-muted-foreground space-y-2">
                            <li>• Apply once, get matched automatically</li>
                            <li>• Show real skills, not keyword resumes</li>
                            <li>• Track applications in one place</li>
                        </ul>
                        <Button onClick={() => setSignupOpen(true)}>
                            Create Profile
                        </Button>
                    </div>

                    <div className="rounded-2xl border p-8 space-y-4">
                        <UserCheckIcon className="size-8 text-primary" />
                        <h3 className="text-2xl font-bold">For Employers</h3>
                        <ul className="text-muted-foreground space-y-2">
                            <li>• Post jobs in minutes</li>
                            <li>• Filter by real skills, not buzzwords</li>
                            <li>• Chat directly with candidates</li>
                        </ul>
                        <Button onClick={() => setSignupOpen(true)}>
                            Post a Job
                        </Button>
                    </div>
                </motion.div>
            </section>

            {/* HOW IT WORKS */}
            <AnimateOnScroll>
                <section>
                    <div className="max-w-7xl mx-auto px-4 py-20 text-center">
                        <h2 className="text-4xl font-black mb-12">How it works</h2>
                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="space-y-3">
                                <ZapIcon className="size-8 mx-auto text-primary" />
                                <h4 className="font-bold text-lg">Create your profile</h4>
                                <p className="text-muted-foreground">
                                    Set up once and let matching work for you.
                                </p>
                            </div>
                            <div className="space-y-3">
                                <UsersRoundIcon className="size-8 mx-auto text-primary" />
                                <h4 className="font-bold text-lg">Get matched</h4>
                                <p className="text-muted-foreground">
                                    Smart filtering connects the right people.
                                </p>
                            </div>
                            <div className="space-y-3">
                                <MessageSquareIcon className="size-8 mx-auto text-primary" />
                                <h4 className="font-bold text-lg">Chat & hire</h4>
                                <p className="text-muted-foreground">
                                    Talk directly and move fast.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </AnimateOnScroll>

            {/* FEATURES */}
            <AnimateOnScroll>
                <section className="border-t bg-muted/30">
                    <div className="max-w-7xl mx-auto px-4 py-20">
                        <h2 className="text-4xl font-black text-center mb-12">
                            Built for serious hiring
                        </h2>
                        <div className="grid md:grid-cols-4 gap-6">
                            <Feature icon={<ZapIcon />} title="Smart Matching" />
                            <Feature icon={<MessageSquareIcon />} title="Real-time Chat" />
                            <Feature icon={<ShieldCheckIcon />} title="Secure Auth" />
                            <Feature icon={<UsersRoundIcon />} title="Application Tracking" />
                        </div>
                    </div>
                </section>
            </AnimateOnScroll>

            {/* FINAL CTA */}
            <AnimateOnScroll>
                <section>
                    <div className="max-w-7xl mx-auto px-4 py-24 text-center space-y-6">
                        <h2 className="text-4xl font-black">
                            Ready to stop wasting time?
                        </h2>
                        <p className="text-muted-foreground">
                            Join Recruify and experience focused hiring.
                        </p>
                        <Button size="lg" onClick={() => setSignupOpen(true)}>
                            Get Started
                        </Button>
                    </div>
                </section>
            </AnimateOnScroll>

            {/* FOOTER */}
            <footer className="border-t">
                <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row justify-between gap-4 text-sm text-muted-foreground">
                    <span>© 2026 Recruify.app</span>
                    <div className="flex gap-4">
                        <span>About</span>
                        <span>Contact</span>
                        <span>Privacy</span>
                    </div>
                </div>
            </footer>

            {/* AUTH MODALS */}
            <LoginModal
                open={loginOpen}
                onOpenChange={setLoginOpen}
                onSwitchToSignup={() => {
                    setLoginOpen(false)
                    setSignupOpen(true)
                }}
            />
            <SignupModal
                open={signupOpen}
                onOpenChange={setSignupOpen}
                onSwitchToLogin={() => {
                    setSignupOpen(false)
                    setLoginOpen(true)
                }}
            />
        </div>
    )
}

function Feature({
    icon,
    title,
}: {
        icon: React.ReactNode
        title: string
    }) {
    return (
        <div className="rounded-2xl border p-6 text-center space-y-3">
            <div className="flex justify-center text-primary">{icon}</div>
            <h4 className="font-bold">{title}</h4>
        </div>
    )
}

export default HomePage
