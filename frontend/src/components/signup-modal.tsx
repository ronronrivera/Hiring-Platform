import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { useStore } from "@/store/useAuthStore"
import { Loader2Icon } from "lucide-react"

interface SignupModalProps {
    open: boolean
    onOpenChange: (v: boolean) => void
    onSwitchToLogin: () => void
}

export function SignupModal({
    open,
    onOpenChange,
    onSwitchToLogin
}: SignupModalProps) {
    const [form, setForm] = useState({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
    })

    const {signup, loading} = useStore();

    const handleChange =
    (field: keyof typeof form) =>
        (e: React.ChangeEvent<HTMLInputElement>) =>
            setForm({ ...form, [field]: e.target.value })

    const handleSubmit = () => {
        signup(form);
    }

    const handleSwitchToLogin = () => {
        onOpenChange(false); // Close signup modal
        onSwitchToLogin(); // Open login modal
    }

    return (
        <div>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-center text-2xl font-bold">
                            Sign up
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-10 mt-10">
                        <Input
                            placeholder="Full name"
                            value={form.fullName}
                            onChange={handleChange("fullName")}
                        />

                        <Input
                            type="email"
                            placeholder="Email"
                            value={form.email}
                            onChange={handleChange("email")}
                        />

                        <Input
                            type="password"
                            placeholder="Password"
                            value={form.password}
                            onChange={handleChange("password")}
                        />

                        <Input
                            type="password"
                            placeholder="Confirm password"
                            value={form.confirmPassword}
                            onChange={handleChange("confirmPassword")}
                        />
                        <Button className="w-full mt-2" onClick={handleSubmit}>
                            {loading? ( <Loader2Icon className="size-3"/>) : (
                                "Create account"
                            )} 
                        </Button>

                    </div>
                    <div className="flex flex-col items-center justify-center">
                        <span>Already have an Account?</span>
                        <button 
                            className="underline cursor-pointer"
                            onClick={handleSwitchToLogin}
                        >
                            Login
                        </button> 
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
