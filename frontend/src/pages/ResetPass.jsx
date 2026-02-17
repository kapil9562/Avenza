import { useState } from "react";
import { MdEmail } from "react-icons/md";
import { NavLink, useParams } from 'react-router-dom'
import { emailLogin, resetPassword } from "../api/api";
import { IoIosLock } from "react-icons/io";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { IoCheckmarkCircleSharp } from "react-icons/io5";
import Lottie from "lottie-react";
import loader from "../assets/loader2.json";

export default function ResetPass() {
    const { email } = useParams();
    const [loading, setLoading] = useState(false);
    const [showPass, setShowPass] = useState(false);
    const [password, setPassword] = useState("");
    const [confirmPass, setConfirmPass] = useState("");
    const [error, setError] = useState("");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_\-+=])[A-Za-z\d@$!%*?&#^()_\-+=]{8,}$/;
    const { isDark } = useTheme();
    const [alert, setAlert] = useState("");

    const { login } = useAuth();

    const navigate = useNavigate();

    const handleResetPass = async () => {
        if (!password || !confirmPass) {
            setError("All fields are required!");
            return;
        } else if (password !== confirmPass) {
            setError("Passwords do not match!");
            return;
        } else if (!passwordRegex.test(password)) {
            setError(
                "Password must be at least 8 characters and include uppercase, lowercase, number and special character."
            );
            return;
        }
        try {
            setLoading(true);
            setError('');
            const res = await resetPassword({ email, password });
            console.log(res)
            const userData = res?.data?.user;
            await login(userData);
            setAlert(res?.data?.message);
            setTimeout(() => {
                navigate('/');
                setLoading(false);
            }, 2000);
        } catch (error) {
            setLoading(false);
            console.log(error)
            const message = error?.response?.data?.message;
            setError(message);
        }
    }

    return (
        <div className={`${isDark ? "darkBgImg" : "signupBg"} relative h-dvh flex flex-col items-center justify-center px-4 bg-cover`}>
            <div className={`${isDark ? "bg-[#0F172A90] shadow-lg shadow-[#0F172A] border-gray-800 border" : "bg-[#FFFFFF60]"} w-full max-w-xl rounded-4xl shadow-xl p-4 sm:p-8 flex flex-col items-center`}>

                {/* Header */}
                <h2 className={`${isDark ? "text-[#F564A9]" : "text-[#6B6F9C]"} text-5xl whitespace-nowrap sm:text-6xl font-semibold font-['Allura']`}>
                    Create Password
                </h2>
                <p className={`${isDark ? "text-gray-300" : "text-gray-500"} text-[16px] sm:text-[18px] text-center`}>
                    Your security starts with a strong password !
                </p>

                <div className={`${isDark ? "bg-gray-800" : "bg-gray-100"} w-full h-px mt-2 sm:mt-4`} />

                {/* Email login */}
                <div className="mt-2 space-y-2 w-full">

                    <div className={`${isDark ? "bg-[#0F172A] border-gray-800 shadow-[#0F172A] border-2" : "bg-[#F9FAFB] border border-[#E5E7EB] shadow-gray-200"} flex flex-row shadow-sm rounded-xl p-3 items-center gap-2`}>
                        <IoIosLock className="text-[#8b90c7] text-xl" />
                        <input
                            value={password}
                            maxLength={20}
                            onChange={(e) => { setPassword(e.target.value) }}
                            type={showPass ? "text" : "password"}
                            placeholder="Create Password"
                            className={`${isDark ? "text-gray-100" : "text-[#374151]"} w-full font-semibold focus:outline-none placeholder:font-semibold placeholder:text-[#9CA3AF]`}
                        />
                        <button
                            onClick={() => setShowPass(!showPass)}
                            className="cursor-pointer">
                            {showPass ? <FaEye className="text-[#8b90c7] text-xl" /> : <FaEyeSlash className="text-[#8b90c7] text-xl" />}
                        </button>
                    </div>
                    <div className={`${isDark ? "bg-[#0F172A] border-gray-800 shadow-[#0F172A] border-2" : "bg-[#F9FAFB] border border-[#E5E7EB] shadow-gray-200"} flex flex-row shadow-sm rounded-xl p-3 items-center gap-2`}>
                        <IoIosLock className="text-[#8b90c7] text-xl" />
                        <input
                            value={confirmPass}
                            onChange={(e) => { setConfirmPass(e.target.value) }}
                            type={showPass ? "text" : "password"}
                            placeholder="Confirm Password"
                            className={`${isDark ? "text-gray-100" : "text-[#374151]"} w-full font-semibold focus:outline-none placeholder:font-semibold placeholder:text-[#9CA3AF]`}
                        />
                        <button
                            onClick={() => setShowPass(!showPass)}
                            className="cursor-pointer">
                            {showPass ? <FaEye className="text-[#8b90c7] text-xl" /> : <FaEyeSlash className="text-[#8b90c7] text-xl" />}
                        </button>
                    </div>
                    {error && (
                        <p className="text-red-500 font-semibold flex flex-row gap-1">{error}</p>
                    )}

                    <button
                        className="w-full h-12 py-3 rounded-xl transition border-2 hover:bg-[#fc8479] bg-[#FF6F61] border-[#ff3e2d] font-semibold text-white cursor-pointer mt-2 relative flex justify-center items-center"
                        onClick={handleResetPass}
                        disabled={loading}>
                        {loading ? <Lottie
                            animationData={loader}
                            loop={true}
                            className="w-50 h-50 absolute"
                        /> : "Create"}
                    </button>
                </div>

                {/* Divider */}
                <div className="w-full flex flex-row items-center justify-center mt-4 ">
                    <div className={`${isDark ? "bg-gray-800" : "bg-gray-200"} w-full h-px`}></div>
                </div>

                <p className={`${isDark ? "text-gray-200" : "text-[#6B6F9C]"} text-sm tracking-tight  text-center mt-4 sm:mt-6`}>
                    By Login, you agree to our{" "}
                    <span className="text-[#6366F1] font-medium cursor-pointer active:underline hover:underline">
                        Terms & Privacy Policy
                    </span>
                </p>
            </div>
            {alert &&
                <div className='absolute bottom-20 flex justify-center items-center '>
                    <div className={`bg-green-100 text-green-600 flex justify-center items-center p-1 border-l-3 border-green-400 rounded-md gap-5 px-2 z-999 transition-all ease-out animate-fadeUp duration-300 will-change-transform shadow-lg w-fit`}>
                        <div className='w-fit flex justify-center items-center flex-row gap-2'>
                            <IoCheckmarkCircleSharp size={24} />
                            <p className='tracking-tight text-lg font-semibold nunitoFont'>{alert}</p>
                        </div>
                    </div>
                </div>
            }
        </div>
    );
}
