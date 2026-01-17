import { Toaster } from "sonner"
import { ThemeProvider, useTheme } from "./components/theme-provider";
import { ModeToggle } from "./components/mode-toggle";
import { Route, Routes, Navigate } from "react-router";
import HomePage from "./pages/HomePage";
import { useStore } from "./store/useAuthStore";
import LandingPage from "./pages/LandingPage";

const App = () => {
    
    const {user} = useStore();
    
    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <Toaster position="top-center"/>    
            
            <Routes>
                <Route path="/" element={!user? <HomePage/> : <Navigate to={"/home"}/>}/>
                <Route path="/home" element={user? <LandingPage/> : <Navigate to={"/"}/> }/>
            </Routes>

        </ThemeProvider>
    )
}

export default App
