import React, { useEffect, useState } from "react";
import { formatINR } from "../utils/price";
import { FiPlus, FiMinus } from "react-icons/fi";
import { ImBin } from "react-icons/im";
import { useCart } from "../context/CartContext";
import { GoAlertFill } from "react-icons/go";
import bg from '../assets/1.png'
import darkBg from '../assets/d1.png'
import { useTheme } from "../context/ThemeContext";

const CartItem = React.memo(function CartItem({ item }) {

    const { updateCartQty } = useCart();
    const [error, setError] = useState("");

    const { isDark } = useTheme();
    const getbg = !isDark ? bg : darkBg

    const updateCart = async (product_id, qtyChange) => {
        try {
            const res = await updateCartQty(
                product_id,
                qtyChange
            );
        } catch (err) {
            console.error("update cart error:", err);
            setError(err?.response?.data?.error || err)
        }
    }

    useEffect(() => {
        if (!error) return;

        const timer = setTimeout(() => {
            setError('');
        }, 3000);

        return () => clearTimeout(timer);
    }, [error]);


    return (
        <div>
            <div className="flex gap-4 p-4">

                <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-24 h-24 object-cover rounded-xl"
                    style={{
                        backgroundImage: `url(${getbg})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center"
                    }}
                />

                <div className="flex-1">
                    <h2 className="sm:text-[18px] text-[16px]">{item.title}</h2>

                    <p className="text-gray-500">
                        ₹{formatINR(item.price)}
                    </p>

                    <div className="relative flex items-center gap-3 md:mt-3">

                        <div className={`${isDark? "border-gray-700" : "border-gray-300"} border rounded-sm flex flex-row`}>

                            <button
                                onClick={() => updateCart(item.productId, -1)}
                                className={`${isDark? "hover:bg-gray-800 active:bg-gray-700" : "hover:bg-gray-200 active:bg-gray-200"} md:px-2 md:py-1 px-1 cursor-pointer`}
                            >
                                <FiMinus className="text-red-600"/>
                            </button>

                            <div className={`${isDark? "bg-gray-700" : "bg-gray-300"}  min-h-full w-px`}></div>

                            <span className="md:px-3 md:py-1 px-2">{item.qty}</span>

                            <div className={`${isDark? "bg-gray-700" : "bg-gray-300"}  min-h-full w-px`}></div>

                            <button
                                onClick={() => updateCart(item.productId, 1)}
                                className={`${isDark? "hover:bg-gray-800 active:bg-gray-700" : "hover:bg-gray-200 active:bg-gray-200"} md:px-2 md:py-1 px-1 cursor-pointer`}
                            >
                                <FiPlus className="text-green-600"/>
                            </button>

                            <div className={`absolute top-full left-0 bg-red-100 text-red-600 flex justify-between items-center p-1 border-l-3 border-red-400 rounded-md gap-5 px-2 z-99 transition-opacity ${error ? "opacity-100 visible" : "opacity-0 invisible"}`}>
                                <div className='flex justify-center items-center flex-row gap-2'>
                                    <GoAlertFill />
                                    <p className='leading-tight'>{error}</p>
                                </div>
                            </div>

                        </div>

                        <button
                            onClick={() => updateCart(item.productId, -item.qty)}
                            className={`${isDark? "hover:bg-gray-800 active:bg-gray-700" : "hover:bg-gray-200 active:bg-gray-200"} ml-2 p-2 rounded-lg cursor-pointer`}
                        >
                            <ImBin size={20} className="text-red-600" />
                        </button>

                    </div>
                </div>

                <div className="hidden items-center text-green-600 sm:flex text-xl">
                    ₹{formatINR(item.price * item.qty)}
                </div>

            </div>
        </div>
    );
});

export default CartItem;