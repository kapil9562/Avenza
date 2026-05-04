import { useState, useRef, useEffect } from "react";
import { FaPencil, FaUser } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { IoIosLock } from "react-icons/io";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { NavLink, useLocation } from "react-router-dom";
import { sendOtp, verifyOtp } from "../api/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import Lottie from "lottie-react";
import loader from "../assets/loader2.json";
import GoogleLoginBtn from "../components/common/GoogleLoginBtn";
import { toast } from "../context/ToastContext";
import { IoWarning } from "react-icons/io5";

const OTP_LENGTH = 6;

export default function Signup() {
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    other: ""
  });
  const [timer, setTimer] = useState(0);
  const passwordRef = useRef()
  const nameRef = useRef()
  const emailRef = useRef()

  useEffect(() => {
    const expiry = localStorage.getItem("otpExpiry");

    if (expiry) {
      const remaining = Math.floor((expiry - Date.now()) / 1000);

      if (remaining > 0) {
        setTimer(remaining);
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

  const { isDark } = useTheme();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/home";

  const { login } = useAuth();

  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const [otpSent, setOtpSent] = useState(false);
  const inputsRef = useRef([]);
  const isOtpComplete = otp.every((d) => d !== "");
  const emailInputRef = useRef(null);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_\-+=])[A-Za-z\d@$!%*?&#^()_\-+=]{8,}$/;

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
    let newErrors = { name: "", email: "", password: "", other: "" };

    // Required field validation
    if (!name && !email && !password) {
      newErrors.name = "Name cannot be blank";
      newErrors.email = "Email cannot be blank";
      newErrors.password = "Password cannot be blank";
      nameRef.current.focus();
    } else if (!name) {
      newErrors.name = "Name cannot be blank";
      nameRef.current.focus();
    } else if (!email) {
      newErrors.email = "Email cannot be blank";
      emailRef.current.focus();
    } else if (!password) {
      newErrors.password = "Password cannot be blank";
      passwordRef.current.focus();
    } else if (email && !emailRegex.test(email)) {
      newErrors.email = "Please enter a valid email address!";
      emailRef.current.focus();
    } else if (password && !passwordRegex.test(password)) {
      newErrors.password =
        "Password must be at least 8 characters and include uppercase, lowercase, number and special character.";
      passwordRef.current.focus();
    }

    if (newErrors.name || newErrors.email || newErrors.password) {
      setErrors(newErrors);
      return;
    }

    try {
      setErrors({
        name: "",
        email: "",
        password: "",
        other: ""
      });
      setLoading(true);
      const newEmail = normalizeEmail(email);
      await sendOtp({ email: newEmail });
      toast.success("OTP sent successfully.");

      const expiryTime = Date.now() + 60 * 1000;
      localStorage.setItem("otpExpiry", expiryTime);
      setTimer(60);

      setOtpSent(true);
      setTimeout(() => inputsRef.current[0]?.focus(), 300);
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to send OTP! Try again.";
      setErrors((prev) => ({
        ...prev,
        other: message
      }));
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
      setErrors((prev) => ({
        ...prev,
        other: "Please enter complete OTP !"
      }));
      const firstEmptyIndex = otp.findIndex((digit) => !digit);
      inputsRef.current[firstEmptyIndex]?.focus();
      return;
    }
    try {
      setErrors({
        other: ""
      });
      setLoading(true);
      setErrors({});
      const otpCode = otp.join("");
      const newEmail = normalizeEmail(email);
      const res = await verifyOtp({
        name,
        email: newEmail,
        password,
        otp: otpCode
      });

      const userData = res?.data?.user;

      if (userData) {
        await login(userData);
        toast.success("Signup successful.");
        navigate(from, { replace: true });
        setLoading(false);
      }
      setErrors({});
    } catch (err) {
      setLoading(false);
      setOtp(Array(OTP_LENGTH).fill(""));
      inputsRef.current[0].focus();
      const message =
        err.response?.data?.message ||
        err.message ||
        "Failed to verify OTP! Try again.";
      setErrors({
        other: message
      });
    }
  };

  const handleOtpKeyDown = (e, idx) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0)
      inputsRef.current[idx - 1]?.focus();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').slice(0, 6);

    if (!/^\d+$/.test(pasteData)) return;

    const newOtp = [...otp];
    const pasteArray = pasteData.split('');

    pasteArray.forEach((char, index) => {
      if (index < newOtp.length) {
        newOtp[index] = char;
      }
    });

    setOtp(newOtp);

    const nextActiveIndex = Math.min(pasteArray.length, newOtp.length - 1);
    inputsRef.current[nextActiveIndex].focus();
  };

  const handleChangeEmail = () => {
    setOtpSent(false);
    setOtp(Array(OTP_LENGTH).fill(""));
    setTimeout(() => emailInputRef.current?.focus(), 100);
  };

  useEffect(() => {
    if (!errors.email && !errors.password && !errors.name) return;

    setErrors((prev) => ({
      ...prev,
      name: name ? "" : prev.name,
      email: email ? "" : prev.email,
      password: password ? "" : prev.password,
    }));
  }, [email, password, name]);

  useEffect(() => {
    if (otp.includes("")) return;

    setErrors((prev) => ({
      ...prev,
      other: "",
    }));
  }, [otp]);

  return (
    <div className={`${isDark ? "bg-linear-to-br from-[#020617] via-[#0F172A] to-slate-800" : "bg-linear-to-br from-[#CAD0FD] to-[#F9E1FE]"} relative lg:min-h-[calc(100dvh-112px)] md:min-h-[calc(100dvh-80px)] min-h-[calc(100dvh-112px)] flex items-center justify-center p-4`}>
      <div className={`${isDark ? "bg-[#0F172A90] shadow-lg shadow-[#0F172A] border-gray-800 border" : "bg-[#FFFFFF60]"} w-full max-w-xl rounded-4xl shadow-xl p-4 sm:p-8 overflow-hidden`}>

        <div className={`flex flex-col w-full justify-center items-center`}>
          {/* Header */}
          <h2 className={`${isDark ? "text-[#F564A9]" : "text-[#6B6F9C]"} text-5xl sm:text-6xl whitespace-nowrap font-semibold font-['Allura']`}>
            Join Our Shop
          </h2>
          <p className={`${isDark ? "text-gray-300" : "text-gray-500"} sm:text-[18px] text-[16px] text-center`}>
            Get exclusive deals and updates!
          </p>

          <div className={`${isDark ? "bg-gray-800" : "bg-gray-100"} w-full h-px mt-1`} />

          {/* Email Signup */}
          <div className="flex flex-col gap-2 sm:gap-4 w-full mt-2">
            <div className={`${otpSent ? "hidden" : "flex"} transition-all duration-500 w-full flex-col gap-2 sm:gap-4 mt-2`}>
              <div>
                <div className={`${isDark ? "bg-[#0F172A] border-gray-800 shadow-[#0F172A] border-2" : "bg-[#F9FAFB] border border-[#E5E7EB] shadow-gray-200"} flex flex-row shadow-sm rounded-xl p-3 items-center gap-2 w-full ${errors.name && "border border-red-600"}`}>
                  <FaUser className="text-[#8b90c7] text-xl" />
                  <input
                    ref={nameRef}
                    value={name}
                    onChange={(e) => { setName(e.target.value) }}
                    type="text"
                    placeholder="Full Name"
                    className={`${isDark ? "text-gray-100" : "text-gray-700"} w-full font-semibold focus:outline-none placeholder:font-semibold placeholder:text-[#9CA3AF]`}
                  />
                </div>
                {errors.name && (
                  <div className="flex flex-row gap-1 items-center text-red-600 text-sm">
                    <IoWarning />
                    <p>{errors.name}</p>
                  </div>
                )}
              </div>
              <div>
                <div className={`${isDark ? "bg-[#0F172A] border-gray-800 shadow-[#0F172A] border-2" : "bg-[#F9FAFB] border border-[#E5E7EB] shadow-gray-200"} flex flex-row  shadow-sm rounded-xl p-3 items-center gap-2  w-full ${errors.email && "border border-red-600"}`}>
                  <MdEmail className="text-[#8b90c7] text-xl" />
                  <input
                    ref={emailRef}
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value.trim().toLowerCase()) }}
                    placeholder="Email Address"
                    className={`${isDark ? "text-gray-100" : "text-[#374151]"} w-full font-semibold focus:outline-none placeholder:font-semibold placeholder:text-[#9CA3AF]`}
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
                <div className={`${isDark ? "bg-[#0F172A] border-gray-800 shadow-[#0F172A] border-2" : "bg-[#F9FAFB] border border-[#E5E7EB] shadow-gray-200"} flex flex-row shadow-sm rounded-xl p-3 items-center gap-2  w-full ${errors.password && "border border-red-600"}`}>
                  <IoIosLock className="text-[#8b90c7] text-xl" />
                  <input
                    ref={passwordRef}
                    value={password}
                    maxLength={20}
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
                      onPaste={(e) => handlePaste(e)}
                      className={`w-[66%] h-15 min-h-10 m-w-10 text-center text-xl border-2 focus:border-[#f5719d] outline-none font-semibold mt-2 rounded-2xl  ${isDark ? "bg-[#0F172A] border-gray-700 shadow-lg shadow-[#0F172A] text-gray-200" : "bg-[#F9FAFB] shadow-lg shadow-gray-200 border-[#f8d4e0] text-black"}`}
                    />
                  ))}
                </div>
                {errors.other && (
                  <div className="flex flex-row gap-1 items-center text-red-600 text-sm mt-1">
                    <IoWarning />
                    <p>{errors.other}</p>
                  </div>
                )}
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

            <button className={`w-full h-12 py-3 rounded-xl transition border-2 hover:bg-[#fc8479] bg-[#FF6F61] border-[#ff3e2d]  font-semibold text-white cursor-pointer relative flex justify-center items-center ${(timer > 0) && !otpSent && "opacity-50"}`}
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
          <div className="w-full flex flex-row items-center justify-center my-2">
            <div className={`${isDark ? "bg-gray-800" : "bg-gray-200"} w-full h-px`}></div>
            <span className="px-2 text text-gray-400 font-semibold">or</span>
            <div className={`${isDark ? "bg-gray-800" : "bg-gray-200"} w-full h-px`}></div>
          </div>

          {/* Google Button */}
          <GoogleLoginBtn loading={loading} setLoading={setLoading} />

          <p className={`${isDark ? "text-gray-200" : "text-[#6B6F9C]"} text-sm text-center tracking-tight mt-4 sm:mt-6`}>
            By signing up, you agree to our{" "}
            <span className="text-[#6366F1] font-medium cursor-pointer">
              Terms & Privacy Policy
            </span>
          </p>
          <p className={`${isDark ? "text-gray-200" : "text-[#6B6F9C]"} text-sm text-center tracking-tight mt-2`}>
            Already have an account?{" "}
            <NavLink className="text-[#6366F1] font-medium cursor-pointer" to={'/login'} replace state={{ from: from }}>
              Login
            </NavLink>
          </p>
        </div>
      </div>
    </div>
  );
}
