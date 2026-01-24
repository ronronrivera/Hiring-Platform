import { Link } from "react-router";
import { useStore } from "@/store/useAuthStore";
import { ModeToggle } from "@/components/mode-toggle";

import { UsersRoundIcon, 
        LogOutIcon, 
        UserIcon, 
        BriefcaseIcon, 
        FileTextIcon, 
        LayoutDashboardIcon,
        SettingsIcon,
        BellIcon} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "./ui/button";

export function Navbar() {
    const { user, logout } = useStore();

    const handleLogout = async () => {
        await logout({});
    };
    
    

    const isLoadingUser = !user.profile || !user 

    return (
        <nav className="backdrop-blur-md border-primary/20 sticky top-0 z-50 bg-white dark:bg-black">
            <div className="max-w-7xl mx-auto p-4 flex items-center justify-between">
                {/* Logo */}
                <Link
                    to="/"
                    className="flex items-center gap-3 hover:scale-105 transition-transform"
                >
                    <div className="w-10 h-10 rounded-xl bg-linear-to-br from-primary via-secondary to-accent flex items-center justify-center shadow-lg">
                        <UsersRoundIcon className="w-6 h-6 text-black dark:text-white" />
                    </div>
                    <span className="font-black text-2xl  text-gray-900 dark:text-white">
                        Recruify
                    </span>
                </Link>

                {/* Right Side */}
                <div className="flex items-center gap-4">
                    <ModeToggle />
                    {user.profile?.role === "employee" && (
                        <Link to={"/postjob"}>
                            <Button>
                                Post Job
                            </Button>

                        </Link>
                    )}
                    {/* User dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            {isLoadingUser ? (
                                // 🔹 Skeleton state
                                <div className="flex items-center gap-2">
                                    <Skeleton className="h-9 w-9 rounded-full animate-pulse" />
                                    <Skeleton className="h-4 w-24 hidden md:block animate-pulse" />
                                </div>
                            ) : (
                                    // 🔹 Loaded state
                                    <button className="flex items-center gap-2 rounded-full hover:scale-105 transition-transform focus:outline-none">
                                        <Avatar>
                                            {user.profile?.avatar? (
                                                <AvatarImage
                                                    src={user.profile.avatar?.url || "/avatar.png"}
                                                    alt="Profile"
                                                />
                                            ) : (
                                                    <AvatarImage
                                                        src={"/avatar.png"}
                                                        alt="Profile"
                                                    />
                                                )}
                                        </Avatar>

                                        <span className="hidden md:block font-medium text-black dark:text-white">
                                            {user.profile?.name || user.email}
                                        </span>
                                    </button>
                                )}
                        </DropdownMenuTrigger>

                        <DropdownMenuContent   className="w-56 animate-dropdown-open will-change-transform
                            data-[side=top]:origin-bottom
                            data-[side=right]:origin-left
                            data-[side=bottom]:origin-top
                            data-[side=left]:origin-right">
                            <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                                <p className="text-sm font-semibold">{user.profile?.name }</p>
                                <p className="text-xs text-gray-500">{user.profile?.role[0].toUpperCase() + user.profile?.role.slice(1)}</p>
                            </div>

                            <DropdownMenuItem asChild>
                                <Link to="/profile">
                                    <UserIcon className="mr-2 h-4 w-4" /> Profile
                                </Link>
                            </DropdownMenuItem>
                            {user.profile?.role === "applicant" && (
                                <DropdownMenuItem asChild>
                                    <Link to="/applications">
                                        <FileTextIcon className="mr-2 h-4 w-4" /> Applications
                                    </Link>
                                </DropdownMenuItem>
                            )}

                            {user.profile?.role === "employee" && (
                                <DropdownMenuItem asChild>
                                    <Link to="/jobs">
                                        <BriefcaseIcon className="mr-2 h-4 w-4" /> Jobs
                                    </Link>
                                </DropdownMenuItem>
                            )}

                            {user.profile?.role === "admin" && (
                                <DropdownMenuItem asChild>
                                    <Link to="/admin/dashboard">
                                        <LayoutDashboardIcon className="mr-2 h-4 w-4" />
                                        Dashboard
                                    </Link>
                                </DropdownMenuItem>
                            )}
                            <DropdownMenuItem asChild>
                                <Link to="/notifications">
                                    <BellIcon className="mr-2 h-4 w-4" /> Notifications
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link to="/settings">
                                    <SettingsIcon className="mr-2 h-4 w-4" /> Settings
                                </Link>
                            </DropdownMenuItem>
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
