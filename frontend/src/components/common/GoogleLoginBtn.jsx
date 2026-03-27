import React from 'react'
import { useAuth } from '../../context/AuthContext';
import { useGoogleLogin } from '@react-oauth/google'
import { googleAuth } from '../../api/api';
import { useTheme } from '../../context/ThemeContext';
import { useNavigate } from 'react-router-dom';

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
                // const token = result?.data?.tokens?.access_token;

                if (userData) {
                    await login(userData);
                    setTimeout(() => {
                        navigate('/home');
                        setLoading(false);
                    }, 2000);
                }
            }
        } catch (error) {
            setLoading(false);
            console.error("google login error:: ", error);
        }
    }
    const handleGoogleLogin = useGoogleLogin({
        onSuccess: responseGoogle,
        onError: responseGoogle,
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
                    src="/googleLogo.svg"
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