import { useState, useRef, useEffect } from "react";
import { FaPencil } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { sendResetOtp, verifyResetOTP } from "../api/api";
import { useTheme } from "../context/ThemeContext";
import { GoAlertFill } from "react-icons/go";
import Loader from "../utils/Loader";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import loader from "../assets/loader2.json";

const OTP_LENGTH = 6;

export default function ForgetPass() {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [timer, setTimer] = useState(0);

    const navigate = useNavigate();

    const { isDark } = useTheme();

    const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
    const [otpSent, setOtpSent] = useState(false);
    const inputsRef = useRef([]);
    const isOtpComplete = otp.every((d) => d !== "");
    const emailInputRef = useRef(null);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    useEffect(() => {
        const expiry = localStorage.getItem("otpExpiry");

        if (expiry) {
            const remaining = Math.floor((expiry - Date.now()) / 1000);

            if (remaining > 0) {
                setTimer(remaining);
                setOtpSent(true);
            } else {
                localStorage.removeItem("otpExpiry");
            }
        }
    }, []);

    useEffect(() => {
        if (timer <= 0) return;

        const interval = setInterval(() => {
            setTimer((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    localStorage.removeItem("otpExpiry");
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [timer]);

    const formatTime = (sec) => {
        const m = Math.floor(sec / 60);
        const s = sec % 60;
        return `${m}:${s.toString().padStart(2, "0")}`;
    };

    const normalizeEmail = (email) => {
        if (!email) return email;

        email = email.trim().toLowerCase();

        const [localPart, domain] = email.split("@");

        if (domain === "gmail.com" || domain === "googlemail.com") {

            let normalizedLocal = localPart.replace(/\./g, "");

            normalizedLocal = normalizedLocal.split("+")[0];

            return `${normalizedLocal}@gmail.com`;
        }

        const cleanLocal = localPart.split("+")[0];

        return `${cleanLocal}@${domain}`;
    };


    {/* Send OTP */ }
    const handleSendOTP = async () => {
        if (!emailRegex.test(email)) {
            setError("Please enter a valid email address !");
            return
        }
        try {
            setOtp(Array(OTP_LENGTH).fill(""))
            setError('')
            setLoading(true);
            const newEmail = normalizeEmail(email)
            const res = await sendResetOtp({ email: newEmail });

            const expiryTime = Date.now() + 60 * 1000;
            localStorage.setItem("otpExpiry", expiryTime);
            setTimer(60);
            setOtpSent(true);
            setTimeout(() => inputsRef.current[0]?.focus(), 300);
            setError("");
        } catch (err) {
            const message =
                err.response?.data?.message ||
                err.message ||
                "Failed to send OTP! Try again.";
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    {/* Set Otp */ }
    const handleOtpChange = (value, idx) => {
        if (!/^\d?$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[idx] = value;
        setOtp(newOtp);
        if (value && idx < OTP_LENGTH - 1) inputsRef.current[idx + 1]?.focus();
    };

    const handleVerifyOTP = async () => {
        if (!isOtpComplete) {
            setError("Please enter complete OTP !");
            return;
        }
        try {
            setLoading(true);
            setError('')
            const otpCode = otp.join("");
            const newEmail = normalizeEmail(email);
            const res = await verifyResetOTP({
                email: newEmail,
                otp: otpCode
            });
            setError("");
            setTimeout(() => {
                navigate(`/reset-password/${email}`);
                setLoading(false);
            }, 2000);

        } catch (err) {
            setLoading(false);
            console.log(err)
            setOtp(Array(OTP_LENGTH).fill(""));
            const message =
                err.response?.data?.message ||
                err.message ||
                "Failed to verify OTP! Try again.";
            setError(message);
        }
    };


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
        <div className={`${isDark ? "darkBgImg" : "signupBg"} relative h-dvh flex items-center justify-center p-4`}>
            <div className={`${isDark ? "bg-[#0F172A90] shadow-lg shadow-[#0F172A] border-gray-800 border" : "bg-[#FFFFFF60]"} w-full max-w-xl rounded-4xl shadow-xl p-4 sm:p-8 overflow-hidden`}>

                <div className={`flex flex-col w-full justify-center items-center`}>
                    {/* Header */}
                    <h2 className={`${isDark ? "text-[#F564A9]" : "text-[#6B6F9C]"} text-5xl sm:text-6xl whitespace-nowrap font-semibold font-['Allura']`}>
                        Reset Password
                    </h2>
                    <p className={`${isDark ? "text-gray-300" : "text-gray-500"} sm:text-[18px] text-[16px] text-center`}>
                        Let’s secure your account with a new password !
                    </p>

                    <div className={`${isDark ? "bg-gray-800" : "bg-gray-100"} w-full h-px mt-1`} />

                    {/* Email Signup */}
                    <div className="flex flex-col gap-2 sm:gap-4 w-full mt-2">
                        <div className={`${otpSent ? "hidden" : "flex"} transition-all duration-500 w-full flex-col gap-2 sm:gap-4 mt-2`}>
                            <div className={`${isDark ? "bg-[#0F172A] border-gray-800 shadow-[#0F172A] border-2" : "bg-[#F9FAFB] border border-[#E5E7EB] shadow-gray-200"} flex flex-row  shadow-sm rounded-xl p-3 items-center gap-2  w-full`}>
                                <MdEmail className="text-[#8b90c7] text-xl" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => { setEmail(e.target.value.trim().toLowerCase()) }}
                                    placeholder="Email Address"
                                    disabled={loading}
                                    className={`${isDark ? "text-gray-100" : "text-[#374151]"} w-full font-semibold focus:outline-none placeholder:font-semibold placeholder:text-[#9CA3AF]`}
                                />
                            </div>

                            {error &&
                                <div className=' bg-red-200 text-red-600 flex justify-between items-center p-1 border-l-3 border-red-400 rounded-md gap-5 px-2'>
                                    <div className='flex justify-center items-center flex-row gap-2'>
                                        <GoAlertFill size={24} />
                                        <p>{error}</p>
                                    </div>
                                    <span className='text-red-400 pr-1 cursor-pointer' onClick={() => setError("")}>x</span>
                                </div>
                            }
                        </div>

                        <div className={`${otpSent ? "flex" : "hidden"} transition-all duration-500 w-full flex-col items-center`}>

                            <div>
                                <div className={`font-semibold mb-1 flex flex-wrap gap-1 ${isDark ? "text-gray-300" : "text-gray-800"}`}>
                                    <p className="whitespace-nowrap">OTP sent to</p>
                                    <div className="text-[#6366F1] underline flex flex-row gap-2 underline-offset-2 cursor-pointer">{email}
                                        <button
                                            className="flex justify-center items-center text-[#6B6F9C] text-sm cursor-pointer"
                                            onClick={() => {
                                                handleChangeEmail();
                                                setOtpSent(false);
                                            }}><FaPencil />
                                        </button>
                                    </div>

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
                                            className={`w-[66%] h-15 min-h-10 m-w-10 text-center text-xl border-2 outline-none font-semibold mt-2 rounded-2xl  ${isDark ? "bg-[#0F172A] border-gray-700 shadow-lg shadow-[#0F172A] text-gray-200" : "bg-[#F9FAFB] shadow-lg shadow-gray-200 border-[#f8d4e0] text-black"}`}
                                        />
                                    ))}
                                </div>
                                {error && <p className="text-red-500 font-semibold mt-1">{error}</p>}
                                <button
                                    onClick={handleSendOTP}
                                    disabled={timer > 0}
                                    className={`text-sm font-semibold mt-2 ${timer > 0
                                        ? "text-gray-400 cursor-not-allowed"
                                        : "text-[#6366F1] cursor-pointer"
                                        }`}
                                >
                                    {timer > 0
                                        ? `Resend OTP in ${formatTime(timer)}`
                                        : "Resend OTP"}
                                </button>
                            </div>
                        </div>

                        <button className={`w-full h-12 py-3 rounded-xl transition border-2 hover:bg-[#fc8479] bg-[#FF6F61] border-[#ff3e2d] flex justify-center items-center font-semibold text-white cursor-pointer relative ${(timer > 0) && !otpSent && "opacity-50"}`}
                            onClick={() => {
                                otpSent ? handleVerifyOTP() : handleSendOTP();
                            }} disabled={(loading || (timer != 0)) && !otpSent}>
                            {loading ? <Lottie
                                animationData={loader}
                                loop={true}
                                className="w-50 h-50 absolute"
                            /> : otpSent ? "Verify OTP" : timer > 0
                                ? `${formatTime(timer)}`
                                : "Get OTP"}
                        </button>
                    </div>

                    {/* Divider */}
                    <div className="w-full flex flex-row items-center justify-center mt-4 ">
                        <div className={`${isDark ? "bg-gray-800" : "bg-gray-200"} w-full h-px`}></div>
                    </div>

                    <p className={`${isDark ? "text-gray-200" : "text-[#6B6F9C]"} text-sm text-center tracking-tight mt-4`}>
                        By Login, you agree to our{" "}
                        <span className="text-[#6366F1] font-medium cursor-pointer">
                            Terms & Privacy Policy
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
}
