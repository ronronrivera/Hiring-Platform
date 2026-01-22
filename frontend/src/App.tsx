import { Toaster } from "sonner";
import { ThemeProvider } from "./components/theme-provider";
import { Route, Routes, Navigate } from "react-router";
import HomePage from "./pages/HomePage";
import { useStore } from "./store/useAuthStore";
import SetupProfilePage from "./pages/SetupProfilePage";
import UserPage from "./pages/UserPage";
import { useEffect, useState } from "react";
import PageLoader from "./components/PageLoader";
import PostJobPage from "./pages/employee pages/PostJobPage";
import JobsPage from "./pages/employee pages/EmployeeJobs";
const App = () => {
    const { user, profile, checkAuth, CheckingAuth } = useStore();

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    if (CheckingAuth) {
        return <PageLoader />;
    }

    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <Toaster position="top-center" />
            <Routes>
                {/*Authentication*/}
                <Route path="/" element={!user ? (<HomePage />) : user && !profile ? (<Navigate to="/complete-profile" />) : (<Navigate to="/home" /> )} />
                <Route path="/complete-profile" element={user && !profile ? (<SetupProfilePage />) : !user ? ( <Navigate to="/" />) : (<Navigate to="/home" /> )} />
                <Route path="/home" element={user && profile ? (<UserPage />) : (<Navigate to="/" />)} />
                
                {/*Jobs*/}
                <Route path="/postjob" element={user && profile && profile.role === "employee" ? (<PostJobPage/>) : (<Navigate to="/home" />)} />
                <Route path="/jobs" element={user && profile && profile.role === "employee" ? (<JobsPage/>) : (<Navigate to="/home" />)} />

            </Routes>
        </ThemeProvider>
    );
};

export default App;
