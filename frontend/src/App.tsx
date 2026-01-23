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
import EmployeeJobDetailsPage from "./pages/employee pages/EmployeeJobDetails";
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
                <Route path="/job/:id" element={user && profile && profile.role === "employee"? <EmployeeJobDetailsPage/> : <Navigate to={"/home"}/>}/>

            </Routes>
        </ThemeProvider>
    );
};

export default App;

//TODO: ADD A FEATURE THAT ALLOW EMPLOYEE TO VISIT THEIR JOBS, EDIT THE STATUS, STATES, OR DELETE IT, 
//TODO: FOR APPLICANTS, CREATE A PAGE THAN ALLOWS THEM TO FETCH ALL OPEN JOBS, SEARCH KEYWORDS, OPEN A JOBS WITH TITLE, Description, Skills, salary range, job created date and employment type
//TODO: THE APPLICANT MUST BE ABLE TO SEND APPLICATIONS TO THIS JOBS, WITH MESSAGE, AND SUBJECT, THEY MUST BE ABLE TO SEE THE EMPLOYEE NAME BUT NOT THEIR AVATAR
//TODO: AN EMPLOYEE MUST BE ABLE TO VISIT APPLICANTS PROFILE, IN WHICH THEY CAN SEE THE INFO OF THAT APPLICANT AND THEIR PORTFOLIO
