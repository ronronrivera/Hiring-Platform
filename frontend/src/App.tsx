import { useEffect } from "react";
import { Toaster } from "sonner";
import { ThemeProvider } from "./components/theme-provider";
import { Route, Routes, Navigate } from "react-router";
import HomePage from "./pages/HomePage";
import { useStore } from "./store/useAuthStore";
import SetupProfilePage from "./pages/SetupProfilePage";
import { UserPage } from "./pages/UserPage";

const App = () => {
    const { user, profile, getProfile } = useStore();

    useEffect(() => {
        if (user && !profile) {
            getProfile();
        }
    }, [user]);
    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <Toaster position="top-center" />

            <Routes>
                {/* Landing page */}
                <Route
                    path="/"
                    element={
                        !user ? (
                            <HomePage />
                        ) : !profile ? (
                                <Navigate to="/complete-profile" />
                            ) : (
                                    <Navigate to="/home" />
                                )
                    }
                />

                {/* Profile setup */}
                <Route
                    path="/complete-profile"
                    element={
                        user && !profile ? <SetupProfilePage /> : <Navigate to="/home" />
                    }
                />

                {/* Main user page */}
                <Route
                    path="/home"
                    element={user && profile ? <UserPage /> : <Navigate to="/" />}
                />

                {/* Catch-all */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </ThemeProvider>
    );
};

export default App;
