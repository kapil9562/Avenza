import { useNavigate, useOutletContext } from "react-router-dom";
import { useFavItem } from "../context/FavItemsContext";
import { useTheme } from "../context/ThemeContext";
import { ProductImage, ProductSkeleton } from "../utils";
import AddToCartBtn from "../utils/AddToCartBtn";

export default function FavouriteProducts() {
    const { items, loading } = useFavItem();
    const { isDark } = useTheme();

    const navigate = useNavigate();

    const { setActiveTab, scrollRef } = useOutletContext();
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
                            <div
                                key={idx}
                                className={`animate-fadeUp will-change-transform max-w-sm rounded-2xl transition-shadow duration-300 pt-2 border border-gray-200 relative group px-2 cursor-pointer ${isDark ? "bg-[#0F172A] shadow-lg shadow-[#0F172A] hover:shadow-xl border-gray-700" : "bg-white shadow-gray-400 shadow-lg hover:shadow-2xl"}`}
                                onClick={() => {
                                    setActiveTab("");
                                    navigate(`/${createSlug(item.product.title)}/p/${item.product._id}`);
                                }}
                            >

                                <ProductImage
                                    src={item.product.thumbnail}
                                    alt={item.product.title}
                                    className="w-full h-40 object-contain transition-all duration-400 group-hover:scale-120 relative z-5 will-change-transform"
                                    idx={idx}
                                />

                                <div className="p-2">
                                    <h2 className="text-md mb-1 text-[#F564A9] line-clamp-1">
                                        {item.product.title}
                                    </h2>

                                    <p className={`text-sm mb-2 line-clamp-2 ${isDark ? "text-gray-200" : "text-gray-500"}`}>
                                        {item.product.description}
                                    </p>
                                    <div className=" text-sm mb-2 flex flex-row text-amber-400 items-center gap-2">
                                        {renderStars(item.product.rating)} ({item.product.rating})
                                    </div>

                                    <div className="flex flex-col gap-2 justify-between">
                                        <span className="text-[#FF6F61] font-bold text-lg">
                                            ₹{(item.product.price).toLocaleString("en-IN")}
                                        </span>
                                        <AddToCartBtn product={item.product} />
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
            )}
        </div>
    );
}
