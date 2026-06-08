import { useRef, useState } from "react";
import { MdEmail } from "react-icons/md";
import { NavLink, useLocation } from 'react-router-dom'
import { emailLogin } from "../api/api";
import { IoIosLock } from "react-icons/io";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import Lottie from "lottie-react";
import loader from "../assets/loader2.json";
import GoogleLoginBtn from "../components/common/GoogleLoginBtn";
import { IoBagHandleOutline, IoWarning } from "react-icons/io5";
import { RiSecurePaymentLine } from "react-icons/ri";
import { BsTags } from "react-icons/bs";

export default function Login() {
    const [loading, setLoading] = useState(false);
    const [showPass, setShowPass] = useState(false);
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("");
    const [errors, setErrors] = useState({
        email: "",
        password: "",
        other: "",
    });
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    const emailRef = useRef();
    const passRef = useRef();

    const { isDark } = useTheme();
    const { login } = useAuth();

    const navigate = useNavigate();

    const location = useLocation();
    const from = location.state?.from?.pathname;

    {/* Email login */ }
    const handleEmailLogin = async () => {
        // Clear previous error
        let newErrors = { email: "", password: "", other: "" };

        if (!email && !password) {
            newErrors.email = "Email cannot be blank";
            newErrors.password = "Password cannot be blank";
            emailRef.current.focus();

        } else if (!email) {
            newErrors.email = "Email cannot be blank";
            emailRef.current.focus();
        }
        else if (!emailRegex.test(email)) {
            newErrors.email = "Invalid email";
            emailRef.current.focus();
        }
        else if (!password) {
            newErrors.password = "Password cannot be blank";
            passRef.current.focus();
        }

        setErrors(newErrors);

        if (newErrors.email || newErrors.password) return;

        try {
            setLoading(true);

            const res = await emailLogin({ email, password });
            const userData = res.data.user;

            if (userData) {
                await login(userData);
                navigate(from, { replace: true });
            }

        } catch (err) {
            const backendMessage = err?.response?.data?.message;
            const error =
                typeof backendMessage === "string"
                    ? backendMessage
                    : err?.message || "Something went wrong";
            setErrors((prev) => ({
                ...prev,
                other: error
            }));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`${isDark ? "bg-gray-900" : "bg-[#FFFFFF]"} relative lg:min-h-[calc(100dvh-112px)] md:min-h-[calc(100dvh-80px)] min-h-[calc(100dvh-112px)] flex`}>
            <div
                className={`${isDark ? "bg-[#0F172A]" : "bg-[#FEF7FA]"
                    } w-[45%] lg:flex flex-col items-center justify-between p-10 hidden`}
            >
                <div className="max-w-xs">
                    {/* Heading */}
                    <div className="text-4xl font-semibold space-x-2">
                        <span className={`${isDark ? "text-gray-100" : "text-gray-700"}`}>Join</span>
                        <span
                            className={`${isDark
                                ? "bg-linear-to-r from-rose-400 via-pink-400 to-purple-400"
                                : "bg-linear-to-r from-rose-400 via-pink-400 to-purple-400"
                                } text-transparent bg-clip-text`}
                        >
                            Avenza
                        </span>
                    </div>

                    <h3 className={`${isDark ? "text-gray-200" : "text-gray-700"} font-medium text-2xl mb-2`}>
                        and shop the best!
                    </h3>

                    <p
                        className={`${isDark ? "text-gray-400" : "text-[#787878]"
                            } text-sm mb-4`}
                    >
                        Login your account and enjoy a seamless shopping
                        experience with exclusive benefits.
                    </p>

                    {/* Features */}
                    <div className="space-y-4">
                        <div className="flex items-start gap-4">
                            <div className={`${isDark ? "bg-pink-900/40 text-pink-600" : " bg-pink-100 text-pink-500"} p-4 rounded-full flex items-center justify-center`}>
                                <BsTags className="text-xl" />
                            </div>

                            <div>
                                <h4 className={`${isDark ? "text-gray-200" : "text-gray-700"} font-semibold`}>
                                    Exclusive Offers
                                </h4>
                                <p className="text-sm text-gray-500">
                                    Get access to members-only deals and discounts.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className={`${isDark ? "bg-purple-900/40 text-purple-600" : " bg-purple-100 text-purple-500"} p-4 rounded-full flex items-center justify-center`}>
                                <IoBagHandleOutline className="text-xl" />
                            </div>

                            <div>
                                <h4 className={`${isDark ? "text-gray-200" : "text-gray-700"} font-semibold`}>
                                    Faster Checkout
                                </h4>
                                <p className="text-sm text-gray-500">
                                    Save your details and enjoy a quicker checkout.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className={`${isDark ? "bg-green-900/40 text-green-600" : " bg-green-100 text-green-500"} p-4 rounded-full flex items-center justify-center`}>
                                <RiSecurePaymentLine className="text-xl" />
                            </div>

                            <div>
                                <h4 className={`${isDark ? "text-gray-200" : "text-gray-700"} font-semibold`}>
                                    Secure & Safe
                                </h4>
                                <p className="text-sm text-gray-500">
                                    Your data is always protected with top-notch
                                    security.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Illustration */}
                <div className="mt-8">
                    <img
                        src="/login-illustration.png"
                        alt="Signup Illustration"
                        className="object-contain h-40 w-full"
                    />
                </div>
            </div>
            <div className="flex items-center p-6 lg:w-2/3 w-full justify-center lg:justify-start">
                <div className={`${isDark ? "bg-[#0F172A90] shadow-lg shadow-[#0F172A] border-gray-800 border" : "bg-[#FFFFFF60] shadow-[0px_0px_10px_rgba(0,0,0,0.1)]"} w-full max-w-xl rounded-4xl p-4 sm:p-8 flex flex-col items-center`}>

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
                        <div>
                            <div className={`${isDark ? "bg-[#0F172A] border-gray-800 shadow-[#0F172A] border-2" : "bg-[#F9FAFB] border border-[#E5E7EB] shadow-gray-200"} flex flex-row shadow-sm rounded-xl px-3 items-center gap-2 ${errors.email && "border border-red-600"}`}>
                                <MdEmail className="text-[#8b90c7] text-2xl" />
                                <input
                                    ref={emailRef}
                                    type="email"
                                    value={email}
                                    onChange={(e) => { setEmail(e.target.value) }}
                                    placeholder="Email Address"
                                    className={`${isDark ? "text-gray-100" : "text-[#374151]"} w-full h-full py-3 text-[#374151] font-medium focus:outline-none placeholder:font-medium placeholder:text-[#9CA3AF]`}
                                />
                            </div>
                            {errors.email && (
                                <div className="flex flex-row gap-1 items-center text-red-600 text-sm">
                                    <IoWarning />
                                    <p>{errors.email}</p>
                                </div>
                            )}
                        </div>

                        <div>
                            <div className={`${isDark ? "bg-[#0F172A] border-gray-800 shadow-[#0F172A] border-2" : "bg-[#F9FAFB] border border-[#E5E7EB] shadow-gray-200"} flex flex-row shadow-sm rounded-xl p-3 items-center gap-2 ${errors.password && "border border-red-600"}`}>
                                <IoIosLock className="text-[#8b90c7] text-xl" />
                                <input
                                    ref={passRef}
                                    value={password}
                                    onChange={(e) => { setPassword(e.target.value) }}
                                    type={showPass ? "text" : "password"}
                                    placeholder="Password"
                                    maxLength={20}
                                    className={`${isDark ? "text-gray-100" : "text-[#374151]"} w-full font-medium focus:outline-none placeholder:font-medium placeholder:text-[#9CA3AF]`}
                                />
                                <button
                                    onClick={() => setShowPass(!showPass)}
                                    className="cursor-pointer">
                                    {showPass ? <FaEye className="text-[#8b90c7] text-xl" /> : <FaEyeSlash className="text-[#8b90c7] text-xl" />}
                                </button>
                            </div>
                            {errors.password && (
                                <div className="flex flex-row gap-1 items-center text-red-600 text-sm">
                                    <IoWarning />
                                    <p>{errors.password}</p>
                                </div>
                            )}
                        </div>
                        {errors.other && (
                            <div className="flex flex-row gap-1 items-center text-red-600 text-sm">
                                <IoWarning />
                                <p>{errors.other}</p>
                            </div>
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

                    {/* Divider */}
                    <div className="w-full flex flex-row items-center justify-center my-2">
                        <div className={`${isDark ? "bg-gray-800" : "bg-gray-200"} w-full h-px`}></div>
                        <span className="px-2 text text-gray-400 font-semibold">or</span>
                        <div className={`${isDark ? "bg-gray-800" : "bg-gray-200"} w-full h-px`}></div>
                    </div>

                    {/* Google Button */}
                    <GoogleLoginBtn loading={loading} setLoading={setLoading} from={from} />

                    <button className={`text-pink-500 font-medium cursor-pointer active:underline hover:underline mt-4`}
                        onClick={() => navigate('/forgetpassword')}>Forget Password ?</button>

                    {/* Divider */}
                    <div className="w-full flex flex-row items-center justify-center my-2">
                        <div className={`${isDark ? "bg-gray-800" : "bg-gray-200"} w-full h-px`}></div>
                    </div>

                    <p className={`${isDark ? "text-gray-200" : "text-[#6B6F9C]"} text-sm tracking-tight  text-center mt-4`}>
                        By Login, you agree to our{" "}
                        <span className="text-pink-500 font-medium cursor-pointer active:underline hover:underline">
                            Terms & Privacy Policy
                        </span>
                    </p>
                    <p className={`${isDark ? "text-gray-200" : "text-[#6B6F9C]"} text-sm tracking-tight text-center mt-1`}>
                        don't have an account?{" "}
                        <NavLink className="text-pink-500 font-medium cursor-pointer active:underline hover:underline" to={"/signup"} replace state={{ from: from }} >
                            Sign up
                        </NavLink>
                    </p>
                </div>
            </div>
        </div>
    );
}
