import { useState } from "react";
import { MdEmail } from "react-icons/md";
import { NavLink } from 'react-router-dom'
import { emailLogin } from "../api/api";
import { IoIosLock } from "react-icons/io";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import Lottie from "lottie-react";
import loader from "../assets/loader2.json";

export default function Login() {
    const [loading, setLoading] = useState(false);
    const [showPass, setShowPass] = useState(false);
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    const { isDark } = useTheme();

    const { login } = useAuth();

    const navigate = useNavigate();

    {/* Email login */ }
    const handleEmailLogin = async () => {
        // Clear previous error
        setError("");

        if (!emailRegex.test(email)) {
            setError("Please enter a valid email address !");
            return;
        }

        if (!password) {
            setError("Password is required !");
            return;
        }

        try {
            setLoading(true);

            const res = await emailLogin({ email, password });
            const userData = res.data.user;

            if (userData) {
                await login(userData);
                setTimeout(() => {
                    navigate('/');
                    setLoading(false);
                }, 2000);
            }

        } catch (err) {
            setLoading(false);
            console.log("Email Login Error ::", err);
            const backendMessage = err?.response?.data?.message;
            const error =
                typeof backendMessage === "string"
                    ? backendMessage
                    : err?.message || "Something went wrong";
            setError(error);

        }
    };

    return (
        <div className={`${isDark ? "darkBgImg" : "signupBg"} h-dvh flex items-center justify-center px-4 bg-cover`}>
            <div className={`${isDark ? "bg-[#0F172A90] shadow-lg shadow-[#0F172A] border-gray-800 border" : "bg-[#FFFFFF60]"} w-full max-w-xl rounded-4xl shadow-xl p-4 sm:p-8 flex flex-col items-center`}>

                {/* Header */}
                <h2 className={`${isDark ? "text-[#F564A9]" : "text-[#6B6F9C]"} text-5xl whitespace-nowrap sm:text-6xl font-semibold font-['Allura']`}>
                    Welcome Back
                </h2>
                <p className={`${isDark ? "text-gray-300" : "text-gray-500"} text-[16px] sm:text-[18px] text-center`}>
                    Get exclusive deals and updates!
                </p>

                <div className={`${isDark ? "bg-gray-800" : "bg-gray-100"} w-full h-px mt-2 sm:mt-4`} />

                {/* Email login */}
                <div className="mt-2 space-y-2 w-full">
                    <div className={`${isDark ? "bg-[#0F172A] border-gray-800 shadow-[#0F172A] border-2" : "bg-[#F9FAFB] border border-[#E5E7EB] shadow-gray-200"} flex flex-row shadow-sm rounded-xl px-3 items-center gap-2`}>
                        <MdEmail className="text-[#8b90c7] text-2xl" />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => { setEmail(e.target.value) }}
                            placeholder="Email Address"
                            className={`${isDark ? "text-gray-100" : "text-[#374151]"} w-full h-full py-3 text-[#374151] font-semibold focus:outline-none placeholder:font-semibold placeholder:text-[#9CA3AF]`}
                        />
                    </div>

                    <div className={`${isDark ? "bg-[#0F172A] border-gray-800 shadow-[#0F172A] border-2" : "bg-[#F9FAFB] border border-[#E5E7EB] shadow-gray-200"} flex flex-row shadow-sm rounded-xl p-3 items-center gap-2`}>
                        <IoIosLock className="text-[#8b90c7] text-xl" />
                        <input
                            value={password}
                            onChange={(e) => { setPassword(e.target.value) }}
                            type={showPass ? "text" : "password"}
                            placeholder="Password"
                            maxLength={20}
                            className={`${isDark ? "text-gray-100" : "text-[#374151]"} w-full font-semibold focus:outline-none placeholder:font-semibold placeholder:text-[#9CA3AF]`}
                        />
                        <button
                            onClick={() => setShowPass(!showPass)}
                            className="cursor-pointer">
                            {showPass ? <FaEye className="text-[#8b90c7] text-xl" /> : <FaEyeSlash className="text-[#8b90c7] text-xl" />}
                        </button>
                    </div>
                    {error && (
                        <p className="text-red-500 font-semibold">{error}</p>
                    )}

                    <button
                        className="w-full h-12 py-3 rounded-xl transition border-2 hover:bg-[#fc8479] bg-[#FF6F61] border-[#ff3e2d] font-semibold text-white cursor-pointer mt-2 relative flex justify-center items-center"
                        onClick={handleEmailLogin}
                        disabled={loading}>
                        {loading ? <Lottie
                            animationData={loader}
                            loop={true}
                            className="w-50 h-50 absolute"
                        /> : "Login"}
                    </button>
                </div>

                <button className={`text-[#6366F1] font-medium cursor-pointer active:underline hover:underline mt-4`}
                    onClick={() => navigate('/forgetpassword')}>Forget Password ?</button>

                {/* Divider */}
                <div className="w-full flex flex-row items-center justify-center my-2">
                    <div className={`${isDark ? "bg-gray-800" : "bg-gray-200"} w-full h-px`}></div>
                </div>

                <p className={`${isDark ? "text-gray-200" : "text-[#6B6F9C]"} text-sm tracking-tight  text-center mt-4`}>
                    By Login, you agree to our{" "}
                    <span className="text-[#6366F1] font-medium cursor-pointer active:underline hover:underline">
                        Terms & Privacy Policy
                    </span>
                </p>
                <p className={`${isDark ? "text-gray-200" : "text-[#6B6F9C]"} text-sm tracking-tight text-center mt-1`}>
                    don't have an account?{" "}
                    <NavLink className="text-[#6366F1] font-medium cursor-pointer active:underline hover:underline" to={"/signup"}>
                        Sign up
                    </NavLink>
                </p>
            </div>
        </div>
    );
}
