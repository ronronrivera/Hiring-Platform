import { useEffect } from "react";
import { Toaster } from "sonner";
import { ThemeProvider } from "./components/theme-provider";
import { Route, Routes, Navigate } from "react-router";
import HomePage from "./pages/HomePage";
import { useStore } from "./store/useAuthStore";
import SetupProfilePage from "./pages/SetupProfilePage";
import { UserPage } from "./pages/UserPage";
import PageLoader from "./components/PageLoader";

const App = () => {
    const { user, profile, CheckingAuth, checkAuth} = useStore();

    useEffect(() =>{
        checkAuth();
    },[checkAuth])
    
    if(CheckingAuth) return <PageLoader/>

    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <Toaster position="top-center" />

            <Routes>
                <Route path="/" element={!user? (<HomePage/>) : !profile? (<Navigate to={"/complete-profile"}/>): (<Navigate to={"/home"}/>)}/>
                <Route path="/complete-profile" element={user && !profile? (<SetupProfilePage/>) : !user && !profile? <Navigate to={"/"}/> : <Navigate to={"/home"}/> }/>
                <Route path="/home" element={user && profile ? <UserPage /> : <Navigate to="/" />}/>

                {/* Catch-all */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </ThemeProvider>
    );
};

export default App;
