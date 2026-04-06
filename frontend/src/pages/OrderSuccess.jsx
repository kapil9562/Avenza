import { useSearchParams, Link, useOutletContext } from "react-router-dom";
import { FaRegCheckCircle } from "react-icons/fa";
import { verifyPayment } from '../api/api.js'
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import Lottie from 'lottie-react';
import Loader from '../assets/paymentLoader.json'
import { useTheme } from "../context/ThemeContext.jsx";

const OrderSuccess = () => {
    const [searchParams] = useSearchParams();

    const sessionId = searchParams.get("session_id");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [orderId, setOrderId] = useState("");
    const { setActiveTab } = useOutletContext();

    const { user, isAuthenticated } = useAuth();
    const {isDark} = useTheme();

    useEffect(() => {

        const verify = async () => {

            if (!isAuthenticated) return;

            setLoading(true);

            try {
                const res = await verifyPayment({ sessionId, userId: user._id });

                if (res?.data?.success) {
                    setOrderId(res?.data?.order?._id);
                }
            } catch (error) {
                const msg = error?.response?.data?.message || error?.message || "Something went wrong!";
                setError(msg);
            } finally {
                setTimeout(() => {
                    setLoading(false);
                }, 500);
            }

        };

        if (sessionId) {
            verify();
        }

    }, [sessionId, isAuthenticated, user]);

    useEffect(() => {
        setActiveTab("");
    }, [])

    return (
        <div className={`lg:min-h-[calc(100dvh-112px)] md:min-h-[calc(100dvh-80px)] min-h-[calc(100dvh-112px)] flex items-center justify-center px-4 ${isDark? "bg-[#0F172A]" : "bg-[#F1F3F6]"}`}>
            {loading ?
                <div className="flex flex-col items-center justify-center relative">
                    <Lottie
                        animationData={Loader}
                        loop={true}
                        className="w-40 h-40 hue-rotate-50"
                    />
                    <p className="text-gray-500 font-semibold absolute bottom-4">
                        Loading...
                    </p>
                </div>
                :
                !error ?
                    <div className={`shadow-xl rounded-2xl p-8 max-w-md w-full text-center border-2 ${isDark? "bg-gray-900 border-gray-800" : "bg-white border-transparent"}`}>

                        <div className="flex justify-center mb-4">
                            <FaRegCheckCircle size={70} className="text-green-500" />
                        </div>

                        <h1 className={`text-2xl font-bold mb-2 ${isDark? "text-gray-200" : "text-gray-800"}`}>
                            Order Placed Successfully 🎉
                        </h1>

                        <p className={`mb-4 ${isDark? "text-gray-400" : "text-gray-600"}`}>
                            Thank you for your purchase. Your order has been placed successfully.
                        </p>

                        <div className={`p-3 rounded-lg mb-6 ${isDark? "bg-gray-800" : "bg-gray-100"}`}>
                            <p className={`text-sm ${isDark? "text-gray-300" : "text-gray-500"}`}>Order ID</p>
                            <p className={`font-semibold ${isDark? "text-white" : "text-gray-800"}`}>{orderId}</p>
                        </div>

                        <div className="flex flex-col gap-3">

                            <Link
                                to="/my-account/my-orders"
                                className={`bg-[#FF6F61] border-[#ff3e2d] hover:bg-[#fc8479] text-white py-2 rounded-lg transition border-2 nunitoFont font-semibold`}
                            >
                                View Orders
                            </Link>

                            <Link
                                to="/home"
                                className={`border-2 py-2 rounded-lg transform-gpu ${isDark? "hover:bg-gray-800 text-white border-gray-700" : "hover:bg-gray-100 border-gray-300"} nunitoFont font-semibold`}
                            >
                                Continue Shopping
                            </Link>

                        </div>
                    </div>
                    :
                    <div className="max-w-2xl">
                        <h1 className="text-red-500 text-lg whitespace-normal break-all text-center">{error}</h1>
                    </div>}
        </div>
    );
};

export default OrderSuccess;