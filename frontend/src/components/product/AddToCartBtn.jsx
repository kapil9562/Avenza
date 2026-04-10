import React, { useEffect, useState } from 'react'
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useLocation, useNavigate } from 'react-router-dom';
import { GoAlertFill } from "react-icons/go";
import Lottie from "lottie-react";
import { BsCheckCircleFill } from "react-icons/bs";
import { useTheme } from '../../context/ThemeContext';
import successCheck from "../../assets/successCheck.json"
import { toast } from '../../context/ToastContext';

function AddToCartBtn({ product }) {

    const [loadingId, setLoadingId] = useState(null);
    const navigate = useNavigate();
    const { user } = useAuth()
    const { addToCart } = useCart();

    const location = useLocation();

    const [success, setSuccess] = useState(null);

    const { isDark } = useTheme();

    const handleAddToCart = async () => {

        if (loadingId === product.productId) return;

        if (!user) {
            navigate('/signup', {replace: true, state: {from: location}});
            return
        }

        try {
            setLoadingId(product.productId);
            await new Promise(resolve => setTimeout(resolve, 1500))
            const res = await addToCart({ product_id: product._id, price: Number(product.price) });
            setSuccess(product.productId);
        } catch (err) {
            const error = err?.response?.data?.error || "Failed to add item"
            toast.error(error);
        } finally {
            setLoadingId(null);
        }
    };

    const [animationData, setAnimationData] = useState(null);

    useEffect(() => {
        fetch("/assets/loader.json")
            .then(res => res.json())
            .then(data => setAnimationData(data));
    }, []);

    return (
        <div className='relative flex justify-center items-center w-full'>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart();
                }}
                className={`w-full px-6 py-5 border border-[#FF6F61] text-[#FF6F61] rounded-2xl cursor-pointer active:scale-95 transition-transform duration-300 will-change-transform whitespace-nowrap flex justify-center items-center max-h-10 overflow-hidden ${isDark ? "hover:bg-red-900/20" : "hover:bg-red-50"}`}
                disabled={loadingId === product.productId || success}
            >
                {loadingId === product.productId ? (
                    <Lottie
                        animationData={animationData}
                        loop
                        className="w-12 h-12 hue-rotate-180"
                    />
                ) : (
                    success === product.productId ?
                        <div className='animate-fadeUp flex flex-row justify-center items-center font-semibold text-green-600 gap-1'>
                            <Lottie
                                animationData={successCheck}
                                loop={false}
                                className='h-6 w-6'
                            />
                            <span>Added</span>
                        </div> : "Add to Cart"
                )}
            </button>
        </div>
    )
}

export default AddToCartBtn