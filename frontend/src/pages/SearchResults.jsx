import React, { useState, useEffect } from 'react'
import { useNavigate, useOutletContext, useSearchParams } from 'react-router-dom';
import { ProductSkeleton, ProductImage, AddToCartBtn } from '../components';
import { useSearch } from '../context/SearchContext';
import { useTheme } from '../context/ThemeContext';
import { formatINR } from '../utils/price';
import { getProducts } from '../api/api';
import { BodyCategorySkeleton } from '../components/skeletons/CategorySkeletons';
import { useProducts } from '../context/ProductsContext';
import { IoHeartOutline, IoHeartSharp } from 'react-icons/io5';
import { useFavItem } from '../context/FavItemsContext';
import { useAuth } from '../context/AuthContext';

const icons = ["/assets/icons/beauty.svg", "/assets/icons/electronics.svg", "/assets/icons/glasses.svg", "/assets/icons/groceries.svg", "/assets/icons/home.svg", "/assets/icons/man.svg", "/assets/icons/sports.svg", "/assets/icons/vehicle.svg", "/assets/icons/women.svg"]

const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const emptyStars = 5 - fullStars;

    return (
        <div className="flex items-center">
            {[...Array(fullStars)].map((_, i) => (
                <span key={`full-${i}`} className="text-yellow-500 text-xl">★</span>
            ))}
            {[...Array(emptyStars)].map((_, i) => (
                <span key={`empty-${i}`} className="text-gray-300 text-xl">★</span>
            ))}
        </div>
    );
};

function SearchResults() {

    const navigate = useNavigate();

    const { searchResults: products } = useSearch();
    const [loading, setLoading] = useState(true);
    const [openDropdown, setDropDowm] = useState();
    const { toggleFavItems, favorites } = useFavItem();
    const { isDark } = useTheme();
    const { isAuthenticated, loading: authloading } = useAuth();

    const { activeTab, setActiveTab } = useOutletContext();

    const { setSearchResults } = useSearch();

    const { categories, setCache } = useProducts();

    const [searchParams] = useSearchParams();
    const query = searchParams.get("q");

    useEffect(() => {
        setActiveTab("");
    }, []);

    useEffect(() => {
        setTimeout(() => {
            setLoading(false)
        }, 1000);
    }, [products]);

    useEffect(() => {
        const fetchProducts = async () => {
            if (!query) return;

            const res = await getProducts({
                limit: 0,
                title: query,
            });

            setSearchResults(res.data.products);
        };

        fetchProducts();
    }, [query]);

    const createSlug = (text) => {
        return text
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");
    }


    const handleTabClick = (tab, pCategory) => {
        if (tab === activeTab) return;

        setCache({});
        setActiveTab(tab);

        if (tab === "HOME") {
            navigate("/home");
            return;
        }

        navigate(`/${pCategory}/${tab}`);
    };

    const handleAddToFav = async (ProductId) => {

        if (!isAuthenticated) {
            toast.error("Please login first !")
            return;
        }

        try {
            await toggleFavItems(ProductId);
        } catch (error) {
            const msg = error?.message || error?.response?.data?.message || "Something went wrong";
            toast.error(msg);
        }
    }

    const isFavorite = (_id) => {
        return favorites?.some((item) => item.productId === _id);
    };

    return (
        <div className={`flex lg:min-h-[calc(100dvh-112px)] md:min-h-[calc(100dvh-80px)] min-h-[calc(100dvh-112px)] pb-15 pt-2 sm:px-5 px-1 lg:px-10 sm:py-2 gap-6 relative mb-6`}>
            <aside className={`sticky top-32 p-4 lg:block hidden min-w-1/4 max-w-1/4 border h-fit ${isDark ? "bg-[#0F172A] border-gray-700" : "border-gray-200"} rounded-xl`}>
                <div className='relative'>
                    <h1 className={`uppercase font-semibold text-lg tracking-wide mb-3 ${isDark ? "text-gray-100" : "text-[#454545]"}`}>Category</h1>
                    <div className='space-y-2'>
                        {categories.length <= 0 ? (
                            Array(9).fill(0).map((_, idx) => (
                                <BodyCategorySkeleton key={idx} />
                            ))
                        ) :
                            categories?.map((item, idx) => (
                                <div key={idx}>
                                    <div className={`flex justify-between font-medium text-lg cursor-pointer ${isDark ? "text-gray-300" : "text-[#787878]"}`} onClick={() => setDropDowm((prev) => (prev === item?.parentCategory) ? "" : item?.parentCategory)}>
                                        <div className='flex gap-2'>
                                            <img src={icons[idx]} alt="" className='h-5 w-5' />
                                            <h3>{item?.parentCategory}</h3>
                                        </div>
                                        <span>{openDropdown === item?.parentCategory ? "-" : "+"}</span>
                                    </div>

                                    <div className={`grid ${openDropdown === item?.parentCategory ? "grid-rows-[1fr]" : "grid-rows-[0fr]"} transition-all duration-600`}>
                                        <div className='overflow-hidden min-h-0'>
                                            <div className={`pt-3 pb-2 border-t ${isDark ? "border-t-gray-700" : "border-t-gray-200"} `}>
                                                {item?.categories?.map((sub, i) => (
                                                    <div
                                                        className={`flex justify-between py-0.5 cursor-pointer ${isDark ? "text-gray-400 hover:text-gray-200" : "text-[#787878] hover:text-gray-700"}`}
                                                        key={i}
                                                        onClick={() => { handleTabClick(sub?.name, item?.parentCategory) }}
                                                    >
                                                        <h3>{sub?.name}</h3>
                                                        <span>{sub?.totalItems}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            </aside>
            <div className={`grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-1 lg:gap-5 will-change-transform w-full h-full relative `}>


                {loading
                    ? Array(10)
                        .fill(0)
                        .map((_, idx) => <ProductSkeleton key={idx} />)
                    :
                    products.length === 0 ?
                        (<div className="fixed inset-0 top-1/2 text-center h-fit w-fit left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col justify-center items-center gap-4 col-span-full">
                            <img src='/noResult.webp' alt="not found" className="h-40 object-contain" />
                            <span className={`${isDark ? "text-gray-300" : "text-gray-700"} text-lg`}>
                                We couldn't find what you were looking for. Let's start over.
                            </span>
                            <button className="min-w-35 px-4 py-3 border-[#FF6F61] border-2 text-[#FF6F61] rounded-sm cursor-pointer active:scale-95 transition-transform duration-300 font-semibold"
                                onClick={() => {
                                    setActiveTab('HOME');
                                    navigate('/home');
                                }}>Go To HomePage</button>
                        </div>
                        ) : (
                            products.map((product, idx) => (
                                <ProductCard key={product.productId} idx={idx} product={product} isDark={isDark} isFavorite={isFavorite} onFavClick={handleAddToFav} navigate={navigate} />
                            )))}
            </div>
        </div>
    );
}

const ProductCard = React.memo(function ProductCard({ product, isDark, isFavorite, onFavClick, idx, navigate }) {
    return (
        <div
            className={`will-change-transform max-w-sm h-fit rounded-2xl transition-shadow duration-300 pt-2 border border-gray-200 relative group px-2 cursor-pointer shadow-md hover:shadow-xl overflow-hidden ${isDark ? "bg-[#0F172A] shadow-[#0F172A] border-gray-700" : "bg-white shadow-gray-300"}`}
            onClick={() => {
                navigate(`/${createSlug(product.title)}/p/${product._id}`);
            }}
        >
            <div
                className={`absolute right-2 top-2 z-100 hover:text-red-500 active:scale-90 transition-transform duration-300 will-change-transform text-xl p-1 ${!isFavorite(product?._id) && `lg:border rounded-lg lg:translate-x-10 group-hover:translate-x-0 ${isDark ? "lg:bg-[#0F172A] hover:bg-[#ff007b] hover:border-[#F564A9]" : "hover:bg-[#F564A9] hover:border-[#F564A9] lg:bg-white"}`} ${isDark ? "text-gray-500 hover:text-white border-gray-700" : "lg:text-gray-500 text-gray-400 border-gray-200 hover:text-white"}`}
                onClick={(e) => {
                    e.stopPropagation();
                    onFavClick(product._id);
                }}>
                {isFavorite(product._id) ? <IoHeartSharp className='text-red-500' /> : <IoHeartOutline />}
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
    );
});

export default SearchResults