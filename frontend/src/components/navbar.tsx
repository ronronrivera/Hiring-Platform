import { Link } from "react-router";
import { useStore } from "@/store/useAuthStore";
import { ModeToggle } from "@/components/mode-toggle";
import { UsersRoundIcon, LogOutIcon, UserIcon, BriefcaseIcon, FileTextIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export function Navbar() {
  const { user, logout } = useStore();

  const handleLogout = async () => {
    await logout({});
  };

  return (
    <nav className="backdrop-blur-md mt-4 border-primary/20 sticky top-0 z-50 bg-white/70 dark:bg-black">
      <div className="max-w-7xl mx-auto p-4 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-3 hover:scale-105 transition-transform"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center shadow-lg">
            <UsersRoundIcon className="w-6 h-6 text-white" />
          </div>
          <span className="font-black text-2xl tracking-wider text-gray-900 dark:text-white">
            Recruify
          </span>
        </Link>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          <ModeToggle />

          {/* User dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 rounded-full hover:scale-105 transition-transform">
                <Avatar>
                  {user.profile?.avatar ? (
                    <AvatarImage src={user.profile.avatar?.url} alt="Profile" />
                  ) : (
                    <AvatarFallback>
                      {user.profile?.name?.charAt(-1) || "U"}
                    </AvatarFallback>
                  )}
                </Avatar>
                <span className="hidden md:block font-medium text-gray-900 dark:text-white">
                  {user.profile?.name || user.email}
                </span>
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-56">
              <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                <p className="text-sm font-semibold">{user.profile?.name || user.email}</p>
                <p className="text-xs text-gray-500">{user.profile?.role || "Applicant"}</p>
              </div>

              <DropdownMenuItem asChild>
                <Link to="/profile">
                  <UserIcon className="mr-2 h-4 w-4" /> Profile
                </Link>
              </DropdownMenuItem>

              {user.profile?.role === "Applicant" && (
                <DropdownMenuItem asChild>
                  <Link to="/applications">
                    <FileTextIcon className="mr-2 h-4 w-4" /> Applications
                  </Link>
                </DropdownMenuItem>
              )}

              {user.profile?.role === "Employee" && (
                <DropdownMenuItem asChild>
                  <Link to="/jobs">
                    <BriefcaseIcon className="mr-2 h-4 w-4" /> Jobs
                  </Link>
                </DropdownMenuItem>
              )}

              <DropdownMenuItem onClick={handleLogout} className="text-red-500">
                <LogOutIcon className="mr-2 h-4 w-4" /> Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
