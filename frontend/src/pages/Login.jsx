import { useState, useRef } from "react";
import SignupBg from "../assets/SignupBg.png"
import { FaPencil } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { NavLink } from 'react-router-dom'
import { emailLogin } from "../api/api";
import { IoIosLock } from "react-icons/io";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const OTP_LENGTH = 6;

export default function Login() {
    const [loading, setLoading] = useState(false);
    const [showPass, setShowPass] = useState(false);
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const emailInputRef = useRef(null);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    const {isDark} = useTheme();

    const { login } = useAuth();

    // const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
    // const [otpSent, setOtpSent] = useState(false);
    // const inputsRef = useRef([]);
    // const isOtpComplete = otp.every((d) => d !== "");

    const navigate = useNavigate();

    {/* Email login */ }
    const handleEmailLogin = async () => {
        // Clear previous error
        setError("");

        if (!emailRegex.test(email)) {
            setError("Please enter a valid email address");
            return;
        }

        if (!password) {
            setError("Password is required");
            return;
        }

        try {
            setLoading(true);

            const res = await emailLogin({ email, password });
            const userData = res.data.user;

            login(userData);
            navigate("/");

        } catch (err) {
            console.log("Email Login Error ::", err);

            const backendMessage = err?.response?.data?.message;

            const error =
                typeof backendMessage === "string"
                    ? backendMessage
                    : err?.message || "Something went wrong";

            setError(error);

        } finally {
            setLoading(false);
        }
    };


    // {/* Send OTP */ }
    // const handleSendOTP = async () => {
    //     if (!emailRegex.test(email)) {
    //         setError("**Please enter a valid email address**");
    //         return
    //     }
    //     try {
    //         setLoading(true);
    //         const res = await sendOtp({ email });
    //         console.log("send otp res :: ", res);
    //         setOtpSent(true);
    //         setTimeout(() => inputsRef.current[0]?.focus(), 300);
    //         setError("");
    //     } catch (err) {
    //         console.error(err.message);
    //         setError("**Failed to send OTP. Try again.**");
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    {/* Set Otp */ }
    const handleOtpChange = (value, idx) => {
        if (!/^\d?$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[idx] = value;
        setOtp(newOtp);
        if (value && idx < OTP_LENGTH - 1) inputsRef.current[idx + 1]?.focus();
    };

    // const handleVerifyOTP = async () => {
    //     if (!isOtpComplete) {
    //         setError("**Please enter complete OTP**");
    //         return;
    //     }
    //     try {
    //         setLoading(true);
    //         const otpCode = otp.join("");
    //         const res = await verifyOtp({
    //             email,
    //             otp: otp.join("") // IMPORTANT: string
    //         });
    //         console.log("res:", res);
    //         // const user = result.user

    //         // localStorage.setItem("user", JSON.stringify({
    //         //     uid: user.uid,
    //         //     email: user.email
    //         // }));
    //         setError("");
    //         // setVerified(true);
    //         // setTimeout(() => {
    //         //     navigate("/");
    //         // }, 2000);
    //     } catch (err) {
    //         console.error(err);
    //         setError("**Invalid OTP**");
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    const handleOtpKeyDown = (e, idx) => {
        if (e.key === "Backspace" && !otp[idx] && idx > 0)
            inputsRef.current[idx - 1]?.focus();
    };

    const handleChangeEmail = () => {
        setOtpSent(false);
        setOtp(Array(OTP_LENGTH).fill(""));
        // setConfirmation(null);
        setError("");
        setTimeout(() => emailInputRef.current?.focus(), 100);
    };

    return (
        <div className={`${isDark ? "darkBgImg" : "signupBg"} min-h-screen flex items-center justify-center px-4 bg-cover`}>
            <div className={`${isDark ? "bg-[#0F172A90] shadow-lg shadow-[#0F172A] border-gray-800 border" : "bg-[#FFFFFF60]"} w-full max-w-xl rounded-4xl shadow-xl p-4 sm:p-8 flex flex-col items-center`}>

                {/* Header */}
                <h2 className={`${isDark ? "text-[#F564A9]" : "text-[#6B6F9C]"} text-5xl whitespace-nowrap sm:text-6xl font-semibold font-['Allura']`}>
                    Welcome Back
                </h2>
                <p className={`${isDark ? "text-gray-300" : "text-gray-500"} text-[16px] sm:text-[18px]`}>
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

                    {/* {otpSent && (
                        <div>
                            <div className="font-semibold mb-1 flex flex-row gap-1">
                                OTP sent to
                                <button className="text-[#6366F1] underline underline-offset-2 cursor-pointer">{email}</button>
                                <button className="flex justify-center items-center text-[#6B6F9C] text-sm cursor-pointer" onClick={handleChangeEmail}><FaPencil /></button>
                            </div>
                            <div className="flex gap-2 w-full justify-center items-center">
                                {otp.map((digit, idx) => (
                                    <input
                                        key={idx}
                                        ref={(el) => (inputsRef.current[idx] = el)}
                                        value={digit}
                                        maxLength={1}
                                        onChange={(e) => handleOtpChange(e.target.value, idx)}
                                        onKeyDown={(e) => handleOtpKeyDown(e, idx)}
                                        className="w-[66%] h-15 min-h-10 m-w-10 text-center text-xl border-2 outline-none font-semibold border-[#f8d4e0] bg-[#F9FAFB] mt-2 rounded-2xl shadow-lg shadow-gray-200"
                                    />
                                ))}
                            </div>
                            {error && <p className="text-red-500 font-semibold mt-1">{error}</p>}
                        </div>
                    )} */}

                    <button
                        className="w-full py-3 rounded-xl transition border-2 hover:bg-[#fc8479] bg-[#FF6F61] border-[#ff3e2d] font-semibold text-white cursor-pointer mt-2"
                        onClick={handleEmailLogin}
                        disabled={loading}>
                        {loading ? "Please wait..." : "Login"}
                    </button>
                </div>

                <p className={`${isDark ? "text-gray-200" : "text-[#6B6F9C]"} text-sm tracking-tight  text-center mt-4 sm:mt-6`}>
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
