import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import Lottie from "lottie-react";

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    const navigate = useNavigate();
    const { isDark } = useTheme();
    const [animationData, setAnimationData] = useState(null);

    useEffect(() => {
        fetch("/assets/loader.json")
            .then((res) => res.json())
            .then((data) => setAnimationData(data))
            .catch((err) => console.error("Failed to load animation:", err));
    }, []);

    useEffect(() => {
        if (loading) return;

        if (!isAuthenticated) {
            const timer = setTimeout(() => {
                navigate("/login", { replace: true });
            }, 1000);

            return () => clearTimeout(timer);
        }
    }, [isAuthenticated, loading, navigate]);

    if (loading || !isAuthenticated) {
        return (
            <div
                className={`${
                    isDark
                        ? "bg-linear-to-br from-[#020617] via-[#0F172A] to-slate-800"
                        : "bg-linear-to-br from-[#CAD0FD] to-[#F9E1FE]"
                } sm:px-5 px-1 lg:px-10 sm:py-6 pb-10 will-change-transform w-full h-full relative lg:min-h-[calc(100dvh-112px)] md:min-h-[calc(100dvh-80px)] min-h-[calc(100dvh-112px)]`}
            >
                <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2">
                    {animationData && (
                        <Lottie
                            animationData={animationData}
                            loop
                            className="md:w-34 md:h-34 h-25 w-25 hue-rotate-160"
                        />
                    )}
                </div>
            </div>
        );
    }

    return children;
};

export default ProtectedRoute;