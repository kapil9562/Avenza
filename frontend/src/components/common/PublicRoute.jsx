import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import Lottie from "lottie-react";
import loader from "../../assets/loader.json"

const PublicRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    const { isDark } = useTheme();
    const [animationData, setAnimationData] = useState(null);
    const [dots, setDots] = useState("");

    const location = useLocation();
    const navigate = useNavigate();
    const from = location.state?.from || "/home";

    useEffect(() => {
        const interval = setInterval(() => {
            setDots((prev) => {
                if (prev.length >= 3) return "";
                return prev + ".";
            });
        }, 500);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (loading) return;

        if (isAuthenticated) {
            const timer = setTimeout(() => {
                navigate(from, { replace: true });
            }, 1000);

            return () => clearTimeout(timer);
        }
    }, [isAuthenticated, loading, navigate, from]);

    if (loading || isAuthenticated) {
        return (
            <div
                className={`${isDark
                    ? "bg-gray-900"
                    : "bg-[#FFFFFF]"
                    } sm:px-5 px-1 lg:px-10 sm:py-6 pb-10 will-change-transform w-full relative lg:min-h-[calc(100dvh-112px)] min-h-[calc(100dvh-80px)]`}
            >
                <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2">
                    <div className="flex flex-col items-center justify-center relative">
                        <Lottie
                            animationData={loader}
                            loop={true}
                            className="w-40 h-40 hue-rotate-50"
                        />
                        <p className={`ml-3 font-semibold absolute bottom-4 ${isDark? "text-gray-300" : "text-gray-500"}`}>
                            Loading
                            <span className="inline-block w-4 text-left">
                                {dots}
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return children;
};

export default PublicRoute;