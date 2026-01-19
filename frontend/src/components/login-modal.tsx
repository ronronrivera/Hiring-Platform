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

interface LoginModalProps {
    open: boolean
    onOpenChange: (v: boolean) => void
    onSwitchToSignup: () => void
}

export function LoginModal({
    open,
    onOpenChange,
    onSwitchToSignup
}: LoginModalProps) {
    const [form, setForm] = useState({
        email: "",
        password: "",
    })

    const {login, loading} = useStore();

    const handleChange =
    (field: keyof typeof form) =>
        (e: React.ChangeEvent<HTMLInputElement>) =>
            setForm({ ...form, [field]: e.target.value })

    const handleSubmit = () => {
        login(form);
    }

    const handleSwitchToSignup = () => {
        onOpenChange(false); // Close login modal
        onSwitchToSignup(); // Open signup modal
    }

    return (
        <div>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-center text-2xl font-bold">
                            Login
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-10 mt-10">
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

                        <Button className="w-full mt-2" onClick={handleSubmit}>
                            {loading? (<Loader2Icon className="animate-spin size-6"/>) : ("Login")}
                        </Button>
                    </div>
                    <div className="flex flex-col items-center justify-center">
                        <span>Don't have an Account?</span>
                        <button 
                            className="underline cursor-pointer"
                            onClick={handleSwitchToSignup}
                        >
                            Signup
                        </button> 
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
