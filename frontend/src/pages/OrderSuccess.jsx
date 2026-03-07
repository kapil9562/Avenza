import { useSearchParams, Link, useOutletContext } from "react-router-dom";
import { FaRegCheckCircle } from "react-icons/fa";
import { verifyPayment } from '../api/api.js'
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import Lottie from 'lottie-react';
import Loader from '../assets/paymentLoader.json'

const OrderSuccess = () => {
    const [searchParams] = useSearchParams();

    const sessionId = searchParams.get("session_id");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [orderId, setOrderId] = useState("");
    const { setActiveTab } = useOutletContext();

    const { user, isAuthenticated } = useAuth();

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
                console.log(error)
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
        <div className="min-h-150 flex items-center justify-center bg-gray-100 px-4">
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
                    <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full text-center">

                        <div className="flex justify-center mb-4">
                            <FaRegCheckCircle size={70} className="text-green-500" />
                        </div>

                        <h1 className="text-2xl font-bold text-gray-800 mb-2">
                            Order Placed Successfully 🎉
                        </h1>

                        <p className="text-gray-600 mb-4">
                            Thank you for your purchase. Your order has been placed successfully.
                        </p>

                        <div className="bg-gray-100 p-3 rounded-lg mb-6">
                            <p className="text-sm text-gray-500">Order ID</p>
                            <p className="font-semibold text-gray-800">{orderId}</p>
                        </div>

                        <div className="flex flex-col gap-3">

                            <Link
                                to="/my-account/my-orders"
                                className="bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition"
                            >
                                View Orders
                            </Link>

                            <Link
                                to="/"
                                className="border border-gray-300 py-2 rounded-lg hover:bg-gray-100 transition"
                            >
                                Continue Shopping
                            </Link>

                        </div>
                    </div>
                    :
                    <div>
                        <h1>{error}</h1>
                    </div>}
        </div>
    );
};

export default OrderSuccess;