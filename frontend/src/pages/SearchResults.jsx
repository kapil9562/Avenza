import React, { useState, useEffect } from 'react'
import { useNavigate, useOutletContext, useSearchParams } from 'react-router-dom';
import { ProductSkeleton, ProductImage, AddToCartBtn } from '../components';
import { useSearch } from '../context/SearchContext';
import { useTheme } from '../context/ThemeContext';
import { formatINR } from '../utils/price';
import { getProducts } from '../api/api';

function SearchResults() {

    const navigate = useNavigate();

    const { searchResults: products } = useSearch();
    const [loading, setLoading] = useState(true);

    const { isDark } = useTheme();

    const { setActiveTab } = useOutletContext();

    const { setSearchResults } = useSearch();

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

    const createSlug = (text) => {
        return text
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");
    }

    return (
        <div className={`${isDark ? "bg-linear-to-br from-[#020617] via-[#0F172A] to-slate-800" : "bg-linear-to-br from-[#CAD0FD] to-[#F9E1FE]"} lg:min-h-[calc(100dvh-112px)] md:min-h-[calc(100dvh-80px)] min-h-[calc(100dvh-112px)] pb-15 pt-2`}>
            <div className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-1 lg:gap-5 sm:px-5 px-1 lg:px-10 sm:py-6 animate-fadeUp will-change-transform relative min-h-[calc(100dvh-115px)]`}>


                {loading
                    ? Array(10)
                        .fill(0)
                        .map((_, idx) => <ProductSkeleton key={idx} />)
                    :
                    products.length === 0 ?
                        (<div className="fixed inset-0 top-1/2 text-center h-fit w-fit left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col justify-center items-center gap-4 col-span-full">
                            <img src='/noResult.png' alt="not found" className="h-40 object-contain" />
                            <span className={`${isDark ? "text-gray-300" : "text-gray-700"} text-lg`}>
                                We couldn't find what you were looking for. Let's start over.
                            </span>
                            <button className="min-w-35 px-4 py-3 border-[#FF6F61] border-2 text-[#FF6F61] rounded-sm cursor-pointer active:scale-95 transition-transform duration-300 font-semibold"
                                onClick={() => {
                                    setActiveTab('HOME');
                                    navigate('/');
                                }}>Go To HomePage</button>
                        </div>
                        ) : (
                            products.map((product, idx) => (
                                <div
                                    key={idx}
                                    className={`animate-fadeUp will-change-transform max-w-sm rounded-2xl transition-shadow duration-300 pt-2 border border-gray-200 relative group px-2 cursor-pointer h-fit ${isDark ? "bg-[#0F172A] shadow-lg shadow-[#0F172A] hover:shadow-xl border-gray-700" : "bg-white shadow-gray-400 shadow-lg hover:shadow-2xl"}`}
                                    onClick={() => {
                                        setActiveTab("");
                                        navigate(`/${createSlug(product.title)}/p/${product._id}`);
                                    }}
                                >
                                    <ProductImage
                                        src={product.thumbnail}
                                        alt={product.title}
                                        className="max-w-[80%] max-h-40 object-contain transition-all duration-400 group-hover:scale-120 relative z-5 will-change-transform"
                                        idx={idx}
                                    />

                                    <div className="p-2">
                                        <h2 className="text-md mb-1 text-[#F564A9] line-clamp-1">
                                            {product.title}
                                        </h2>

                                        <p className={`text-sm line-clamp-1 md:line-clamp-2 md:min-h-10 ${isDark ? "text-gray-200" : "text-gray-500"}`}>
                                            {product.description}
                                        </p>
                                        <div className=" text-sm flex flex-row text-amber-400 items-center gap-2">
                                            {renderStars(product.rating)} ({product.rating})
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
                                                    {product.discountPercentage.toFixed(0)}% off
                                                </p>
                                            </div>
                                            <AddToCartBtn product={product} />
                                        </div>
                                    </div>
                                </div>
                            )))}
            </div>
        </div>
    );
}

export default SearchResults