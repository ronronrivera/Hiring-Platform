import { Toaster } from "sonner"
import { ThemeProvider, useTheme } from "./components/theme-provider";
import { ModeToggle } from "./components/mode-toggle";
import { Route, Routes, Navigate } from "react-router";
import HomePage from "./pages/HomePage";
import { useStore } from "./store/useAuthStore";
import LandingPage from "./components/LandingPage";

const App = () => {
    
    const {isAuth} = useStore();
    
    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <Toaster position="top-center"/>    
            
            <Routes>
                <Route path="/" element={!isAuth? <HomePage/> : <Navigate to={"/home"}/>}/>
                <Route path="/home" element={isAuth? <LandingPage/> : <Navigate to={"/"}/> }/>
            </Routes>

        </ThemeProvider>
    )
}

export default App
