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

export function LoginModal({
    open,
    onOpenChange,
}: {
        open: boolean
        onOpenChange: (v: boolean) => void
    }) {
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

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-center text-2xl font-bold">
                        Login
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 mt-4">
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
            </DialogContent>
        </Dialog>
    )
}
