import React from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useFavItem } from '../context/FavItemsContext';
import { ProductImage } from "../utils";
import AddToCartBtn from "../utils/AddToCartBtn";
import { FaRegHeart } from "react-icons/fa6";

function FavItems({ item, idx }) {

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

    const removeItem = async(pid) => {
        try {
            await removeFavItem(pid);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div
            className={`animate-fadeUp will-change-transform max-w-sm rounded-2xl transition-shadow duration-300 pt-2 border border-gray-200 relative group px-2 cursor-pointer ${isDark ? "bg-[#0F172A] shadow-lg shadow-[#0F172A] hover:shadow-xl border-gray-700" : "bg-white shadow-gray-400 shadow-lg hover:shadow-2xl"}`}
            onClick={() => {
                setActiveTab("");
                navigate(`/${createSlug(item.title)}/p/${item._id}`);
            }}
        >
            <div
                className={`absolute right-2 top-2 z-100 hover:text-red-500 active:scale-90 transition-transform duration-300 will-change-transform text-2xl ${isDark ? "text-gray-500" : "text-gray-400"}`}
                onClick={(e) => {
                    e.stopPropagation();
                    removeItem(item._id);
                }}>  <FaRegHeart />
            </div>

            <ProductImage
                src={item?.thumbnail}
                alt={item?.title}
                className="w-full h-40 object-contain transition-all duration-400 group-hover:scale-120 relative z-5 will-change-transform"
                idx={idx}
            />

            <div className="p-2">
                <h2 className="text-md mb-1 text-[#F564A9] line-clamp-1">
                    {item?.title}
                </h2>

                <p className={`text-sm mb-2 line-clamp-2 ${isDark ? "text-gray-200" : "text-gray-500"}`}>
                    {item?.description}
                </p>
                <div className=" text-sm mb-2 flex flex-row text-amber-400 items-center gap-2">
                    {renderStars(item?.rating)} ({item?.rating})
                </div>

                <div className="flex flex-col gap-2 justify-between">
                    <span className="text-[#FF6F61] font-bold text-lg">
                        ₹{(item?.price).toLocaleString("en-IN")}
                    </span>
                    <AddToCartBtn product={item} />
                </div>
            </div>
        </div>
    )
}

export default FavItems