import React, { useEffect, useState } from 'react'
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from 'react-router-dom';
import { GoAlertFill } from "react-icons/go";
import Lottie from "lottie-react";
import loader from "../assets/loader.json";
import { FaRegCircleCheck } from "react-icons/fa6";
import { BsCheckCircleFill } from "react-icons/bs";

function AddToCartBtn({ product }) {

    const [loadingId, setLoadingId] = useState(null);
    const navigate = useNavigate();
    const { user } = useAuth()
    const { addToCart } = useCart();

    const [success, setSuccess] = useState(null)
    const [error, setError] = useState("");

    const handleAddToCart = async () => {

        if (loadingId === product.id) return;

        if (!user) {
            navigate('/signup');
            return
        }
        
        try {
            setLoadingId(product.id);
            await new Promise(resolve => setTimeout(resolve, 1500))
            const res = await addToCart({ product_id: product.id, price: Number(product.price) });
            setSuccess(product.id);
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

    return (
        <div className='relative flex justify-center items-center w-full'>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart();
                }}
                className="w-full px-6 py-2 border border-[#FF6F61] text-[#FF6F61] rounded-2xl cursor-pointer active:scale-95 transition-transform duration-300 hover:scale-105 will-change-transform whitespace-nowrap flex justify-center items-center max-h-10 overflow-hidden"
                disabled={loadingId === product.id || success}
            >
                {loadingId === product.id ? (
                    <Lottie
                        animationData={loader}
                        loop
                        className="w-12 h-12 hue-rotate-180"
                    />
                ) : (
                    success === product.id  ? 
                    <div  className='animate-fadeUp flex flex-row justify-center items-center font-semibold gap-1 text-green-600'>
                        <BsCheckCircleFill/>
                        <span>Added</span>
                    </div> :"Add to Cart" 
                )}
            </button>
            <div className={`absolute bottom-full left-0 mb-2 bg-red-100 text-red-600 flex justify-between items-center p-1 border-l-2 border-red-400 rounded-md gap-5 px-2 transition-opacity duration-300 ${error ? "opacity-100 visible" : "opacity-0 invisible"}`}>
                <div className='flex justify-center items-center flex-row gap-2'>
                    <GoAlertFill size={22}/>
                    <p className='leading-tight'>{error}</p>
                </div>
            </div>
        </div>
    )
}

export default AddToCartBtn