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


export function SignupModal({
    open,
    onOpenChange,
}: {
        open: boolean
        onOpenChange: (v: boolean) => void
    }) {
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

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-center text-2xl font-bold">
                        Sign up
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 mt-4">
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
                    {loading? (
                        <Loader2Icon className="animate-spin" size={6}/>
                    ) : 

                    (
                    <Button className="w-full mt-2" onClick={handleSubmit}>
                        Create account
                    </Button>

                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
