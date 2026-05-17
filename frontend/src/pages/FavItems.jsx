import React from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useFavItem } from '../context/FavItemsContext';
import { ProductImage, AddToCartBtn } from "../components";
import { RxCross2 } from "react-icons/rx";
import { formatINR } from '../utils/price';

function FavItems({ product, idx }) {

    const { removeFavItem } = useFavItem();
    const { isDark } = useTheme();

    const navigate = useNavigate();

    const { setActiveTab } = useOutletContext();
    const renderStars = (rating) => (
        <div className="flex items-center">
            {Array.from({ length: 5 }, (_, i) => (
                <span key={i} className={i < Math.floor(rating) ? "text-yellow-500" : "text-gray-300"}>★</span>
            ))}
        </div>
    );

    const createSlug = (text) => {
        return text
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");
    }

    const removeItem = async (pid) => {
        try {
            await removeFavItem(pid);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div
            className={`will-change-transform max-w-sm h-fit rounded-2xl transition-shadow duration-300 pt-2 border border-gray-200 relative group px-2 cursor-pointer shadow-md hover:shadow-xl ${isDark ? "bg-[#0F172A] shadow-[#0F172A] border-gray-700" : "bg-white shadow-gray-300"}`}
            onClick={() => {
                navigate(`/${createSlug(product.title)}/p/${product._id}`);
            }}
        >
            <div
                className={`absolute right-1 top-1 z-100 hover:text-red-500 active:scale-90 transition-transform duration-300 will-change-transform text-2xl active:text-red-500 ${isDark ? "text-gray-500" : "text-gray-400"}`}
                onClick={(e) => {
                    e.stopPropagation();
                    removeItem(product._id);
                }}>  <RxCross2 />
            </div>

            <ProductImage
                src={product.thumbnail}
                alt={product.title}
                className="max-w-[80%] max-h-40 object-contain transition-all duration-500 sm:group-hover:scale-120 relative z-5 will-change-transform"
                idx={idx}
            />

            <div className="py-2">
                <div className='px-2'>
                    <h2 className="text-md mb-1 text-[#F564A9] line-clamp-1">
                        {product.title}
                    </h2>

                    <p className={`text-sm line-clamp-1 md:line-clamp-2 md:min-h-10 ${isDark ? "text-gray-200" : "text-gray-500"}`}>
                        {product.description}
                    </p>
                    <div className=" text-sm flex flex-row text-amber-400 items-center gap-2">
                        {renderStars(product?.rating)} ({(product?.rating) ? product?.rating?.toFixed(1) : 0})
                    </div>

                    <div className="flex flex-col justify-between">
                        <div className="flex flex-row flex-wrap items-center w-fit">
                            <p className="text-lg font-semibold text-[#FF6F61]">
                                ₹{formatINR(product.price)}
                            </p>
                        </div>
                        <div className='flex flex-row gap-2 mb-2'>
                            <p className={`text-sm font-semibold relative ${!isDark ? "text-gray-400" : "text-gray-200"}`}>
                                ₹
                                {(formatINR(Math.round(
                                    (product.price * 100) /
                                    (100 - product.discountPercentage)
                                )))}
                                <span className={`absolute w-full h-px left-0 top-1/2 ${!isDark ? "bg-gray-400" : "bg-gray-200"}`} />
                            </p>

                            <p className={`${!isDark ? "text-green-600" : "text-green-400"} text-sm font-semibold`}>
                                {product.discountPercentage?.toFixed(0)}% off
                            </p>
                        </div>
                    </div>
                </div>
                <AddToCartBtn product={product} />
            </div>
        </div>
    )
}

export default FavItems