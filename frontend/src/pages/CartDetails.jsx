import React, { useEffect, useRef, useState } from "react";
import { formatINR } from "../utils/price";
import { CartItem, Loader } from "../components";
import { useCart } from "../context/CartContext";
import { useOutletContext, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { TiShoppingCart } from "react-icons/ti";
import Lottie from "lottie-react";
import emptyCart from "../assets/emptyCart.json"
import { MdKeyboardArrowDown } from "react-icons/md";
import CartSkeleton from "../components/skeletons/CartSkeleton";

export default function CartDetails() {

    const navigate = useNavigate();

    const { items, subtotal, clearAll, loading } = useCart();
    const { setActiveTab } = useOutletContext();
    const { isDark } = useTheme();
    const [showIndicator, setShowIndicator] = useState(false);
    const boxRef = useRef();

    useEffect(() => {
        setActiveTab("");
    }, []);

    const clearCart = async () => {
        await clearAll();
    }

    const deliveryCharge = subtotal > 0 && subtotal < 500 ? 99 : 0;
    const total = subtotal + deliveryCharge;

    const checkScroll = () => {
        const el = boxRef.current;
        if (!el) return;

        const hasScrollableContent = el.scrollHeight > el.clientHeight;
        const isAtBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 2;

        setShowIndicator(hasScrollableContent && !isAtBottom);
    };

    useEffect(() => {
        checkScroll();

        const el = boxRef.current;
        if (!el) return;

        el.addEventListener("scroll", checkScroll);
        window.addEventListener("resize", checkScroll);

        return () => {
            el.removeEventListener("scroll", checkScroll);
            window.removeEventListener("resize", checkScroll);
        };
    }, [items]);

    return (
        <div className={`${isDark ? "bg-gray-900" : "bg-[#FFFFFF]"} lg:min-h-[calc(100dvh-112px)] md:min-h-[calc(100dvh-80px)] min-h-[calc(100dvh-112px)] relative`}>
            {loading ? (
                <CartSkeleton />
            ) : (
                <div className={`${isDark ? "text-gray-300" : "text-gray-600"} max-w-6xl mx-auto flex flex-col md:flex-row gap-6 p-2 sm:p-4 h-full`}>

                    {/* Cart Items */}
                    <div className="space-y-1 md:space-y-2 md:w-3/4 rounded-2xl h-full">
                        <div className="flex w-full flex-row justify-between items-center font-semibold">
                            <h1 className="sm:text-2xl text-lg flex flex-row gap-2 items-center">Your Cart <TiShoppingCart className="text-orange-500" /></h1>
                            {items.length > 0 && <button className="underline cursor-pointer hover:text-orange-500 active:text-orange-500" onClick={clearCart}>clear all</button>}
                        </div>

                        {items.length === 0 && !loading ? (
                            <div className="text-gray-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col justify-center items-center font-semibold">
                                <div className="relative">
                                    <Lottie
                                        animationData={emptyCart}
                                        loop
                                        className="h-60 w-fit"
                                    />
                                    <div className="flex flex-col justify-center items-center">
                                        <span className={`${isDark ? "text-gray-400" : "text-gray-500"}`}>Your cart is empty</span>
                                        <a className="text-rose-400 underline cursor-pointer"
                                            onClick={() => {
                                                navigate('/home');
                                                setActiveTab("HOME");
                                            }}>
                                            Shop now
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="relative h-full">
                                <div className={`${isDark ? "bg-[#0F172A80] border-gray-800" : "bg-[#FFFFFF80] border-gray-200"} shadow border lg:max-h-[72dvh] md:max-h-[76dvh] max-h-[78dvh] sm:max-h-[78dvh] overflow-y-auto no-scrollbar scroll-smooth rounded-2xl h-fit`} ref={boxRef}>
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
                                <div
                                    className={`pointer-events-none absolute z-10 bottom-0 left-1/2 -translate-x-1/2 transition-all duration-300 ${showIndicator ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                                        }`}
                                >
                                    <MdKeyboardArrowDown size={40} className={`animate-bounce ${isDark ? "text-gray-300" : "text-gray-600"} `} />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Order Summary */}
                    {items.length > 0 &&
                        <div className={`${isDark ? "bg-[#0F172A80] border-gray-800" : "bg-[#FFFFFF80] border-gray-200"} border rounded-2xl shadow-sm h-fit md:w-1/2`}>
                            <div className="p-6 space-y-4">

                                <h2 className="text-xl font-semibold">
                                    Order Summary
                                </h2>

                                <div className="flex justify-between text-gray-500">
                                    <span className={`${isDark ? "text-gray-300" : "text-gray-600"}`}>Subtotal</span>
                                    <span>
                                        ₹{formatINR(subtotal)}
                                    </span>
                                </div>

                                <div className="flex justify-between text-gray-500">
                                    <span className={`${isDark ? "text-gray-300" : "text-gray-600"}`}>Delivery</span>
                                    <span
                                        className={` ${deliveryCharge
                                            ? "text-red-600"
                                            : "text-green-600"
                                            }`}
                                    >
                                        +₹{deliveryCharge}
                                    </span>
                                </div>

                                <div className="border-t pt-3 flex justify-between font-semibold text-lg">
                                    <span>Total</span>
                                    <span className="text-green-600">
                                        ₹{formatINR(total)}
                                    </span>
                                </div>

                                <button className="w-full h-12 py-3 rounded-xl transition border-2 hover:bg-[#fc8479] bg-[#FF6F61] border-[#ff3e2d] font-semibold text-white cursor-pointer mt-2 relative flex justify-center items-center"
                                    onClick={() => navigate("/carts/checkout")}>
                                    Proceed to Checkout
                                </button>

                            </div>
                        </div>}

                </div>
            )}

        </div>
    );
}
