import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import Lottie from "lottie-react";
import { useEffect, useState } from "react";

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    const {isDark} = useTheme();
    const [animationData, setAnimationData] = useState(null);
    
        useEffect(() => {
            fetch("/assets/loader.json")
                .then(res => res.json())
                .then(data => setAnimationData(data));
        }, []);
    

    if (loading) {
        return (
            <div className={`${isDark ? "bg-linear-to-br from-[#020617] via-[#0F172A] to-slate-800" : "cartBg"} absolute top-0 left-0 min-h-screen w-full z-999 justify-center items-center flex`}>
                <Lottie
                        animationData={animationData}
                        loop
                        className="w-34 h-34 hue-rotate-40"
                    />
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
