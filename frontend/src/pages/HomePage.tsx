import { LoginModal } from "@/components/login-modal"
import { SignupModal } from "@/components/signup-modal"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { UsersRoundIcon } from "lucide-react"
import { Link } from "react-router"
import { useState } from "react"

function HomePage() {
  const [loginOpen, setLoginOpen] = useState(false)
  const [signupOpen, setSignupOpen] = useState(false)

  return (
    <div>
      <nav className="backdrop-blur-md mt-5 border-primary/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto p-4 flex items-center justify-between">

          {/* LEFT: LOGO */}
          <Link
            to="/"
            className="flex items-center gap-3 hover:scale-105 transition-transform duration-200"
          >
            <div className="size-10 rounded-xl bg-linear-to-br from-primary via-secondary to-accent flex items-center justify-center shadow-lg">
              <UsersRoundIcon className="size-6" />
            </div>
            <span className="font-black text-2xl tracking-wider">
              JobMatrix.app
            </span>
          </Link>

          {/* RIGHT: ACTIONS */}
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
      </nav>

      {/* Auth Modals */}
      <LoginModal open={loginOpen} onOpenChange={setLoginOpen} />
      <SignupModal open={signupOpen} onOpenChange={setSignupOpen} />
    </div>
  )
}

export default HomePage
