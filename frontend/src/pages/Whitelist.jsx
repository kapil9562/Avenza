import { useNavigate, useOutletContext } from "react-router-dom";
import { useFavItem } from "../context/FavItemsContext";
import { useTheme } from "../context/ThemeContext";
import { ProductSkeleton } from "../components";
import FavItems from "./FavItems";
import { useEffect } from "react";
import Lottie from "lottie-react";
import emptyFav from "../assets/emptyFav.json"

export default function Whitelist() {
    const { items, loading, clearAll } = useFavItem();
    const { isDark } = useTheme();

    const navigate = useNavigate();

    const { setActiveTab } = useOutletContext();

    useEffect(() => {
        setActiveTab("");
    }, []);


    const clearFav = async () => {
        try {
            await clearAll();
        } catch (error) {
            console.log("whitelist error ::", error);
        }
    }

    return (
        <div className={`lg:min-h-[calc(100dvh-112px)] md:min-h-[calc(100dvh-80px)] min-h-[calc(100dvh-112px)] md:pt-4 pt-2 flex flex-col gap-2 font-bold nunitoFont text-white relative ${isDark ? "bg-linear-to-br from-[#020617] via-[#0F172A] to-slate-800" : "bg-linear-to-br from-[#CAD0FD] to-[#F9E1FE]"}`}>
            <div className={`w-full flex flex-row justify-between items-center sm:px-5 px-1 lg:px-10 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                <h1 className={`sm:text-3xl text-lg `}>
                    Favourite Products <span className="text-pink-500">❤️</span>
                </h1>
                {items.length > 0 && <button className="underline cursor-pointer hover:text-orange-500 active:text-orange-500" onClick={clearFav}>clear all</button>}
            </div>

            {items.length === 0 ? (
                <div className="text-gray-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col justify-center items-center text-center">
                    <div className="relative flex flex-col justify-center items-center gap-4">
                        <Lottie
                            animationData={emptyFav}
                            loop
                            className="h-30 w-fit"
                        />
                        <div className="flex flex-col justify-center items-center">
                            <span>No favorites yet. Start exploring and add what you love ❤️</span>
                            <button className="text-[#6366F1] underline cursor-pointer"
                                onClick={() => {
                                    navigate('/home');
                                    setActiveTab("HOME");
                                }}>
                                Start Shopping
                            </button>
                        </div>
                    </div>
                </div>
            ) : (

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-1 lg:gap-5 sm:px-5 px-1 lg:px-10 animate-fadeUp will-change-transform pb-10">
                    {loading ?
                        Array(10)
                            .fill(0).map((_, idx) => <ProductSkeleton key={idx} />)
                        : items.map((item, idx) => (
                            <FavItems item={item} idx={idx} key={idx} />
                        ))}
                </div>
            )}
        </div>
    );
}
