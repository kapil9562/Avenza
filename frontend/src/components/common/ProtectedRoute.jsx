import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import Lottie from "lottie-react";
import { useEffect, useState } from "react";

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated , loading} = useAuth();
    const { isDark } = useTheme();

    const [animationData, setAnimationData] = useState(null);

    useEffect(() => {
        fetch("/assets/loader.json")
            .then(res => res.json())
            .then(data => setAnimationData(data));
    }, []);

    if (loading) {
        return (
            <div className={`${isDark ? "bg-linear-to-br from-[#020617] via-[#0F172A] to-slate-800" : "bg-linear-to-br from-[#CAD0FD] to-[#F9E1FE]"} lg:min-h-[calc(100dvh-112px)] md:min-h-[calc(100dvh-80px)] min-h-[calc(100dvh-112px)] relative`}>
                <div className={`absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 min-h-screen w-full z-999 justify-center items-center flex`}>
                    <Lottie
                        animationData={animationData}
                        loop
                        className="md:w-34 md:h-34 h-25 w-25 hue-rotate-160"
                    />
                </div>
            </div>
        );
    } else if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    } else {
        return children;
    }
};

export default ProtectedRoute;
