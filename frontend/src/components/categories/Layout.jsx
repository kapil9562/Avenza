import React, { useEffect, useState } from 'react'
import { ProductSkeleton, ProductImage } from '../../utils/index'
import { useNavigate, useOutletContext } from 'react-router-dom';
import { useProducts } from '../../context/ProductsContext';
import { FaCircleArrowLeft, FaCircleArrowRight } from "react-icons/fa6";
import { useTheme } from '../../context/ThemeContext';
import { getProducts } from '../../api/api.js'
import AddToCartBtn from '../../utils/AddToCartBtn.jsx';
import { FaRegHeart } from "react-icons/fa6";
import { useFavItem } from '../../context/FavItemsContext.jsx';
import { FaHeart } from "react-icons/fa6";
import { GoAlertFill } from 'react-icons/go';

const Layout = React.memo(function Layout({ category, pid }) {

    const { cache, setProducts } = useProducts();

    const [page, setPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);

    const totalPages = Math.ceil(totalItems / 30);
    const skip = (page - 1) * 30;

    const cacheKey = `${category}-${page}`;
    const products = cache[cacheKey];
    const loading = !products;

    const navigate = useNavigate();

    const { isDark } = useTheme();

    const { setActiveTab, scrollRef } = useOutletContext();

    const showPagination = !pid && totalItems > 30 && !loading;

    const { toggleFavItems, favorites } = useFavItem();
    const [alert, setAlert] = useState("");

     useEffect(() => {
            if (!alert) return;
    
            const timer = setTimeout(() => {
                setAlert('');
            }, 2500);
    
            return () => clearTimeout(timer);
        }, [alert]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const params = { skip };
                if (category !== "HOME") params.category = category;

                const res = await getProducts(params);

                setTotalItems(res?.data?.total);

                if (!products) {
                    setProducts(cacheKey, res?.data?.products);
                }
            } catch (err) {
                console.error(err);
            }
        };

        fetchProducts();
    }, [category, page]);


    const nextPage = () => {
        setPage(p => Math.min(p + 1, totalPages));
    };

    const prevPage = () => {
        setPage(p => Math.max(p - 1, 1));
    };

    useEffect(() => {
        setPage(1);
    }, [category]);

    const getVisiblePages = (current, total) => {
        const pages = [];

        // always first page
        pages.push(1);

        // start dots
        if (current > 3) {
            pages.push("start-dots");
        }

        // middle pages
        const start = Math.max(2, current - 1);
        const end = Math.min(total - 1, current + 1);

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        // end dots
        if (current < total - 2) {
            pages.push("end-dots");
        }

        // always last page
        if (total > 1) {
            pages.push(total);
        }

        return pages;
    };
    const visiblePages = getVisiblePages(page, totalPages)


    const renderStars = (rating) => {
        const fullStars = Math.floor(rating);
        const emptyStars = 5 - fullStars;

        return (
            <div className="flex items-center ">
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

    const currentPageHandler = (currPage) => {
        setPage(currPage);
    }

    const handleAddToFav = async (ProductId) => {
        try {
            const res = await toggleFavItems(ProductId);
            console.log(res)
        } catch (error) {
            setAlert(error)
        }
    }

    const isFavorite = (productId) => {
        return favorites?.some((item) => item.productId === productId);
    };


    return (
        <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-1 lg:gap-5 sm:px-5 px-1 lg:px-10 sm:py-6 animate-fadeUp will-change-transform">

                {loading
                    ? Array(10)
                        .fill(0)
                        .map((_, idx) => <ProductSkeleton key={idx} />)
                    : products?.filter(p => p.productId !== pid).map((product, idx) => (
                        <div
                            key={idx}
                            className={`animate-fadeUp will-change-transform max-w-sm rounded-2xl transition-shadow duration-300 pt-2 border border-gray-200 relative group px-2 cursor-pointer ${isDark ? "bg-[#0F172A] shadow-lg shadow-[#0F172A] hover:shadow-xl border-gray-700" : "bg-white shadow-gray-400 shadow-lg hover:shadow-2xl"}`}
                            onClick={() => {
                                setActiveTab("");
                                navigate(`/${createSlug(product.title)}/p/${product._id}`);
                            }}
                        >
                            <div
                                className={`absolute right-2 top-2 z-100 hover:text-red-500 active:scale-90 transition-transform duration-300 will-change-transform text-2xl ${isDark ? "text-gray-500" : "text-gray-400"}`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleAddToFav(product.productId);
                                }}>{isFavorite(product.productId) ? <FaHeart className='text-red-500' /> : <FaRegHeart />}</div>

                            <ProductImage
                                src={product.thumbnail}
                                alt={product.title}
                                className="w-full h-40 object-contain transition-all duration-400 sm:group-hover:scale-120 relative z-5 will-change-transform"
                                idx={idx}
                            />

                            <div className="p-2">
                                <h2 className="text-md mb-1 text-[#F564A9] line-clamp-1">
                                    {product.title}
                                </h2>

                                <p className={`text-sm mb-2 line-clamp-2 ${isDark ? "text-gray-200" : "text-gray-500"}`}>
                                    {product.description}
                                </p>
                                <div className=" text-sm mb-2 flex flex-row text-amber-400 items-center gap-2">
                                    {renderStars(product.rating)} ({product.rating})
                                </div>

                                <div className="flex flex-col gap-2 justify-between">
                                    <span className="text-[#FF6F61] font-bold text-lg">
                                        ₹{(product.price).toLocaleString("en-IN")}
                                    </span>
                                    <AddToCartBtn product={product} />
                                </div>
                            </div>
                        </div>
                    ))}
            </div>
            {showPagination && (

                <div className="w-full flex justify-center items-center pb-20 mt-5">
                    <div className={`${isDark ? "bg-[#0F172A] shadow-xl shadow-[#0F172A] border-gray-700" : "bg-[#FFFFFF] shadow-lg shadow-gray-400"} flex justify-center items-center p-1 sm:p-2 gap-1 sm:gap-2 rounded-4xl border border-gray-200`}>
                        {/* Prev */}
                        <button
                            onClick={() => {
                                prevPage();
                                scrollRef.current?.scrollTo({ top: 0, behavior: "instant", });
                            }}
                            disabled={page === 1}
                            className={`${isDark ? "shadow-lg shadow-[#0F172A]" : "shadow-lg shadow-gray-400"} flex flex-row justify-center items-center p-2 border-[#ff5545] border-2 bg-[#FF6F61] text-white rounded-full disabled:opacity-50 cursor-pointer`}
                        >
                            <FaCircleArrowLeft />
                            <span className='hidden sm:inline'>Prev</span>
                        </button>

                        {/* Pages */}
                        {visiblePages.map((p) =>
                            p === "start-dots" || p === "end-dots" ? (<span key={p} className="px-2 font-semibold text-gray-500">...</span>
                            ) : (
                                <button
                                    key={p}
                                    onClick={() => {
                                        currentPageHandler(p);
                                        scrollRef.current?.scrollTo({ top: 0, behavior: "instant", });
                                    }}
                                    className={`${isDark ? "shadow-lg shadow-[#0F172A]" : "shadow-lg shadow-gray-400"} sm:h-10 sm:w-10 h-fit w-7 rounded-lg sm:rounded-xl font-semibold border-2 cursor-pointer ${page === p ? "bg-[#FF6F61] text-white border-[#ff5545]" : "bg-white text-black border-transparent"}`}
                                >
                                    {p}
                                </button>

                            ))}

                        {/* Next */}
                        <button
                            onClick={() => {
                                nextPage();
                                scrollRef.current?.scrollTo({ top: 0, behavior: "instant", });
                            }}
                            disabled={page === totalPages}
                            className={`${isDark ? "shadow-lg shadow-[#0F172A]" : "shadow-lg shadow-gray-400"} flex flex-row justify-center items-center p-2 bg-[#FF6F61] text-white rounded-full disabled:opacity-50 border-[#ff5545] border-2 cursor-pointer`}
                        >
                            <span className='hidden sm:inline'>Next</span>
                            <FaCircleArrowRight />
                        </button>
                    </div>
                </div>

            )}

            { alert && <div className={`absolute bottom-5 left-1/2 translate-x-[-50%] bg-red-100 text-red-600 flex justify-between items-center p-1 border-l-3 border-red-400 rounded-md gap-5 px-2 z-999 transition-all ease-out animate-fadeUp duration-300 will-change-transform `}>
                <div className='flex justify-center items-center flex-row gap-2'>
                    <GoAlertFill />
                    <p className='leading-tight'>{alert}</p>
                </div>
            </div>}
        </>
    );
})

export default Layout