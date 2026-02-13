import React, { useEffect, useMemo } from "react";
import { formatINR } from "../utils/price";
import CartItem from "./CartItem";
import { useCart } from "../context/CartContext";
import { useOutletContext, useNavigate } from "react-router-dom";
import Loader from "../utils/Loader"
import { useTheme } from "../context/ThemeContext";
import { TiShoppingCart } from "react-icons/ti";

export default function CartDetails() {

    const navigate = useNavigate();

    const { items, subtotal, loading } = useCart();
    const { setActiveTab } = useOutletContext();
    const { isDark } = useTheme();

    useEffect(() => {
        setActiveTab("");
    }, []);

    const deliveryCharge = subtotal > 0 && subtotal < 500 ? 99 : 0;
    const total = subtotal + deliveryCharge;

    return (
        <div className={`${isDark ? "bg-linear-to-br from-[#020617] via-[#0F172A] to-slate-800" : "cartBg"} min-h-screen pb-15 relative`}>
            {loading && <Loader />}
            <div className={`${isDark ? "text-gray-300" : "text-gray-600"} max-w-6xl mx-auto flex flex-col md:flex-row gap-6 p-2 sm:p-4 font-bold nunitoFont justify-center items-center`}>

                {/* Cart Items */}
                <div className="space-y-1 md:space-y-2 md:w-3/4 rounded-2xl">
                    <h1 className="sm:text-3xl text-lg flex flex-row gap-2 justify-center items-center">Your Cart <TiShoppingCart className="text-orange-500"/></h1>

                    {items.length === 0 ? (
                        <div className="text-gray-500 absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col justify-center items-center">Your cart is empty
                            <a className="text-[#6366F1] underline cursor-pointer"
                                onClick={() => {
                                    navigate('/');
                                    setActiveTab("HOME");
                                }}>
                                Shop now
                            </a>
                        </div>
                    ) : (
                        <div className={`${isDark ? "bg-[#0F172A80] border border-gray-800" : "bg-[#FFFFFF80]"} rounded-2xl`}>
                            {items.map((item, idx) => (
                                <div key={idx}>
                                    <CartItem
                                        item={item}
                                    />
                                    {idx !== items.length - 1 &&
                                        <div className="min-w-full px-4">
                                            <div className={`${isDark ? "bg-gray-800" : "bg-gray-300"} min-w-full h-px`}></div>
                                        </div>}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Order Summary */}
                {items.length > 0 &&
                    <div className={`${isDark ? "bg-[#0F172A80] border border-gray-800" : "bg-[#FFFFFF80]"} rounded-2xl shadow-sm h-fit md:w-1/2`}>
                        <div className="p-6 space-y-4">

                            <h2 className="text-xl ">
                                Order Summary
                            </h2>

                            <div className="flex justify-between text-gray-500">
                                <span className={`${isDark? "text-gray-300" : "text-gray-600"}`}>Subtotal</span>
                                <span>
                                    ₹{formatINR(subtotal)}
                                </span>
                            </div>

                            <div className="flex justify-between text-gray-500">
                                <span className={`${isDark? "text-gray-300" : "text-gray-600"}`}>Delivery</span>
                                <span
                                    className={` ${deliveryCharge
                                        ? "text-red-600"
                                        : "text-green-600"
                                        }`}
                                >
                                    +₹{deliveryCharge}
                                </span>
                            </div>

                            <div className="border-t pt-3 flex justify-between">
                                <span>Total</span>
                                <span className="text-green-600">
                                    ₹{formatINR(total)}
                                </span>
                            </div>

                            <button className="w-full mt-4 rounded-xl bg-pink-500 text-white py-2 hover:bg-pink-400 transition">
                                Proceed to Checkout
                            </button>

                        </div>
                    </div>}

            </div>
        </div>
    );
}
