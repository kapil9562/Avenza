import { useNavigate, useOutletContext } from "react-router-dom";
import { useFavItem } from "../context/FavItemsContext";
import { useTheme } from "../context/ThemeContext";
import { ProductSkeleton } from "../utils";
import FavItems from "./FavItems";

export default function Whitelist() {
    const { items, loading } = useFavItem();
    const { isDark } = useTheme();

    const navigate = useNavigate();

    const { setActiveTab } = useOutletContext();
    
    return (
        <div className={`min-h-dvh md:pt-4 pt-2 flex flex-col gap-4 text-white relative ${isDark ? "bg-gradient-to-br from-[#020617] via-[#0F172A] to-slate-800" : "cartBg"}`}>
            <h1 className={`text-3xl font-semibold text-center nunitoFont ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                Favourite Products <span className="text-pink-500">❤️</span>
            </h1>

            {items.length === 0 ? (
                <div className="text-gray-500 absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col justify-center items-center text-center">No favorites yet. Start exploring and add what you love ❤️
                    <button className="text-[#6366F1] underline cursor-pointer"
                        onClick={() => {
                            navigate('/');
                            setActiveTab("HOME");
                        }}>
                        Start Shopping
                    </button>
                </div>
            ) : (

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-1 lg:gap-5 sm:px-5 px-1 lg:px-10 animate-fadeUp will-change-transform pb-10">
                    {loading ?
                        Array(10)
                            .fill(0).map((_, idx) => <ProductSkeleton key={idx} />)
                        : items.map((item, idx) => (
                            <FavItems item={item} idx={idx} key={idx}/>
                        ))}
                </div>
            )}
        </div>
    );
}
