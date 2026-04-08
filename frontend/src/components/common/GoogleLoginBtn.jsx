import React from 'react'
import { useAuth } from '../../context/AuthContext';
import { useGoogleLogin } from '@react-oauth/google'
import { googleAuth } from '../../api/api';
import { useTheme } from '../../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { toast } from '../../context/ToastContext';

function GoogleLoginBtn({ setLoading, loading }) {

    const { login } = useAuth();
    const { isDark } = useTheme();
    const navigate = useNavigate();

    const responseGoogle = async (authResult) => {
        try {
            setLoading(true);
            if (authResult['code']) {

                const result = await googleAuth(authResult['code']);
                const userData = result?.data?.user;

                if (userData) {
                    toast.success("Login successful.")
                    await login(userData);
                    navigate('/home');
                    setLoading(false);
                }
            }
        } catch (error) {
            const msg = error?.message || error?.response?.data?.message || "Login failed. Please try again."
            toast.error(msg);
            setLoading(false);
        }
    }
    const handleGoogleLogin = useGoogleLogin({
        onSuccess: responseGoogle,
        onError: (error) => {
            const msg = error?.response?.data?.message || error?.message || "Something went wrong !";
            toast.error(msg);
            setLoading(false);
        },
        flow: 'auth-code'
    })
    return (
        <div className='w-full'>
            <button
                onClick={handleGoogleLogin}
                disabled={loading}
                className={`${isDark ? "bg-[#0F172A] shadow-[#0F172A] border-gray-800" : "bg-[#F9FAFB] border-[#E5E7EB] shadow-gray-200"} w-full flex flex-row justify-center shadow-sm rounded-xl p-3 items-center gap-2 border-2 ${loading ? "cursor-not-allowed" : "cursor-pointer"}`}
            >
                <img
                    loading='eager'
                    decoding='sync'
                    src="/googleLogo.webp"
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
        </div>
    )
}

export default GoogleLoginBtn