import { useState } from "react";
import { FaUser } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { IoIosLock } from "react-icons/io";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { useGoogleLogin } from '@react-oauth/google'
import { googleAuth, signup } from "../api/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { GoAlertFill } from "react-icons/go";
import Loader from "../utils/Loader";

export default function Signup() {
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { isDark } = useTheme();

  const navigate = useNavigate();

  const { login } = useAuth();

  const handleEmailSignup = async () => {
    try {
      setLoading(true)
      const res = await signup({ email, password, name });
      const data = res?.data?.user;
      console.log(data)
      if (data) {
        await login(data);
        navigate('/')
      }
    } catch (error) {
      const err = error.response?.data?.message?.originalError?.info?.message ||
        error.response?.data?.message ||
        error.message ||
        "Something went wrong";
      setError(err);
      console.log(err);
    } finally {
      setLoading(false)
    }
  }

  const responseGoogle = async (authResult) => {
    try {
      setLoading(true);
      if (authResult['code']) {

        const result = await googleAuth(authResult['code']);
        const { uid, email, name, avatar } = result.data.user;
        const token = result.data.tokens.access_token
        const userData = { uid, email, name, photo:avatar, token }

        if (userData) {
          await login(userData);
          navigate('/');
        }
      }
    } catch (error) {
      console.error("google login error:: ", error)
    } finally {
      setLoading(false);
    }
  }
  const handleGoogleLogin = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: responseGoogle,
    flow: 'auth-code'
  })

  return (
    <div className={`${isDark ? "darkBgImg" : "signupBg"} relative min-h-screen flex items-center justify-center p-4`}>
      <div className={`${isDark ? "bg-[#0F172A90] shadow-lg shadow-[#0F172A] border-gray-800 border" : "bg-[#FFFFFF60]"} w-full max-w-xl rounded-4xl shadow-xl p-4 sm:p-8 flex flex-col items-center`}>

        {/* Header */}
        <h2 className={`${isDark ? "text-[#F564A9]" : "text-[#6B6F9C]"} text-5xl sm:text-6xl whitespace-nowrap font-semibold font-['Allura']`}>
          Join Our Shop
        </h2>
        <p className={`${isDark ? "text-gray-300" : "text-gray-500"} sm:text-[18px] text-[16px]`}>
          Get exclusive deals and updates!
        </p>

        <div className={`${isDark ? "bg-gray-800" : "bg-gray-100"} w-full h-px mt-1`} />

        {/* Email Signup */}
        <div className="flex flex-col gap-2 sm:gap-4 w-full mt-2">
          <div className={`${isDark ? "bg-[#0F172A] border-gray-800 shadow-[#0F172A] border-2" : "bg-[#F9FAFB] border border-[#E5E7EB] shadow-gray-200"} flex flex-row shadow-sm rounded-xl p-3 items-center gap-2`}>
            <FaUser className="text-[#8b90c7] text-xl" />
            <input
              value={name}
              onChange={(e) => { setName(e.target.value) }}
              type="text"
              placeholder="Full Name"
              className={`${isDark ? "text-gray-100" : "text-gray-700"} w-full font-semibold focus:outline-none placeholder:font-semibold placeholder:text-[#9CA3AF]`}
            />
          </div>
          <div className={`${isDark ? "bg-[#0F172A] border-gray-800 shadow-[#0F172A] border-2" : "bg-[#F9FAFB] border border-[#E5E7EB] shadow-gray-200"} flex flex-row  shadow-sm rounded-xl p-3 items-center gap-2`}>
            <MdEmail className="text-[#8b90c7] text-xl" />
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value) }}
              placeholder="Email Address"
              className={`${isDark ? "text-gray-100" : "text-[#374151]"} w-full font-semibold focus:outline-none placeholder:font-semibold placeholder:text-[#9CA3AF]`}
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

          {error &&
            <div className=' bg-red-200 text-red-600 flex justify-between items-center p-1 border-l-3 border-red-400 rounded-md gap-5 px-2'>
              <div className='flex justify-center items-center flex-row gap-2'>
                <GoAlertFill />
                <p className='whitespace-nowrap'>{error}</p>
              </div>
              <span className='text-red-400 pr-1 cursor-pointer' onClick={() => setError("")}>x</span>
            </div>
          }

          <button className="w-full py-3 rounded-xl transition border-2 hover:bg-[#fc8479] bg-[#FF6F61] border-[#ff3e2d]  font-semibold text-white cursor-pointer" onClick={handleEmailSignup} disabled={loading}>
            Sign Up
          </button>
        </div>

        {/* Divider */}
        <div className="w-full flex flex-row items-center justify-center my-2">
          <div className={`${isDark ? "bg-gray-800" : "bg-gray-200"} w-full h-px`}></div>
          <span className="px-2 text text-gray-400 font-semibold">or</span>
          <div className={`${isDark ? "bg-gray-800" : "bg-gray-200"} w-full h-px`}></div>
        </div>

        {/* Google Button */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className={`${isDark ? "bg-[#0F172A] shadow-[#0F172A]" : "bg-[#F9FAFB] border border-[#E5E7EB] shadow-gray-200"} w-full flex flex-row justify-center shadow-sm rounded-xl p-3 items-center gap-2 cursor-pointer`}
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="w-5 h-5"
          />
          <span className={`${isDark ? "text-gray-200" : "text-[#6B6F9C]"}`}>
            Continue with {" "}
            <span className={`${isDark ? "text-gray-200" : "text-[#6B6F9C]"} font-semibold`}>
              Google
            </span>
          </span>
        </button>

        <p className={`${isDark ? "text-gray-200" : "text-[#6B6F9C]"} text-sm text-center tracking-tight mt-4 sm:mt-6`}>
          By signing up, you agree to our{" "}
          <span className="text-[#6366F1] font-medium cursor-pointer">
            Terms & Privacy Policy
          </span>
        </p>
        <p className={`${isDark ? "text-gray-200" : "text-[#6B6F9C]"} text-sm text-center tracking-tight mt-2`}>
          Already have an account?{" "}
          <NavLink className="text-[#6366F1] font-medium cursor-pointer" to={'/login'}>
            Login
          </NavLink>
        </p>
      </div>
      {loading && <Loader />}
    </div>
  );
}
