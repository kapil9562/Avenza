import React, { useEffect, useState } from 'react'
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from 'react-router-dom';
import { GoAlertFill } from "react-icons/go";
import Lottie from "lottie-react";
import { BsCheckCircleFill } from "react-icons/bs";
import { useTheme } from '../context/ThemeContext';

function AddToCartBtn({ product }) {

    const [loadingId, setLoadingId] = useState(null);
    const navigate = useNavigate();
    const { user } = useAuth()
    const { addToCart } = useCart();

    const [success, setSuccess] = useState(null)
    const [error, setError] = useState("");

    const {isDark} =useTheme();

    const handleAddToCart = async () => {

        if (loadingId === product.productId) return;

        if (!user) {
            navigate('/signup');
            return
        }

        try {
            setLoadingId(product.productId);
            await new Promise(resolve => setTimeout(resolve, 1500))
            const res = await addToCart({ product_id: product._id, price: Number(product.price) });
            setSuccess(product.productId);
        } catch (err) {
            const error = err?.response?.data?.error || "Failed to add item"
            setError(error);
        } finally {
            setLoadingId(null);
        }
    };

    useEffect(() => {
        if (!error && !success) return;

        const timer = setTimeout(() => {
            setError('');
            setSuccess(null)
        }, 3000);

        return () => clearTimeout(timer);
    }, [error, success]);

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
                className={`w-full px-6 py-5 border border-[#FF6F61] text-[#FF6F61] rounded-2xl cursor-pointer active:scale-95 transition-transform duration-300 will-change-transform whitespace-nowrap flex justify-center items-center max-h-10 overflow-hidden ${isDark? "hover:bg-red-900/20" : "hover:bg-red-50"}`}
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
                        <div className='animate-fadeUp flex flex-row justify-center items-center font-semibold gap-1 text-green-600'>
                            <BsCheckCircleFill />
                            <span>Added</span>
                        </div> : "Add to Cart"
                )}
            </button>
            <div className={`absolute bottom-full left-0 mb-2 bg-red-100 text-red-600 flex justify-between items-center p-1 border-l-2 border-red-400 rounded-md gap-5 px-2 transition-opacity duration-300 ${error ? "opacity-100 visible" : "opacity-0 invisible"}`}>
                <div className='flex justify-center items-center flex-row gap-2'>
                    <GoAlertFill size={22} />
                    <p className='leading-tight'>{error}</p>
                </div>
            </div>
        </div>
    )
}

export default AddToCartBtn