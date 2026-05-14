import React, { useEffect, useRef, useState } from 'react'
import { ProductSkeleton, ProductImage } from '../index.js'
import { useNavigate, useOutletContext, useParams, useSearchParams } from 'react-router-dom';
import { useProducts } from '../../context/ProductsContext.jsx';
import { FaCircleArrowLeft, FaCircleArrowRight } from "react-icons/fa6";
import { useTheme } from '../../context/ThemeContext.jsx';
import { getProducts } from '../../api/api.js'
import AddToCartBtn from '../product/AddToCartBtn.jsx';
import { FaRegHeart } from "react-icons/fa6";
import { useFavItem } from '../../context/FavItemsContext.jsx';
import { FaHeart } from "react-icons/fa6";
import { useAuth } from '../../context/AuthContext.jsx';
import { formatINR } from '../../utils/price.js';
import { AiOutlineReload } from "react-icons/ai";
import { useToast } from '../../context/ToastContext.jsx';
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";

import "swiper/css/effect-fade";

import { Autoplay, EffectFade, Pagination } from 'swiper/modules';

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

const Layout = React.memo(function Layout({ category, pid }) {

    const { categories, setCategories, cache, setProducts, setCache } = useProducts();
    const [searchParams, setSearchParams] = useSearchParams();
    const [loading, setLoading] = useState(true);
    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const [totalItems, setTotalItems] = useState(0);
    const PAGE_SIZE = 20;
    const skip = (page - 1) * PAGE_SIZE;
    const totalPages = Math.ceil(totalItems / PAGE_SIZE);
    const cacheKey = `${category}-${page}`;
    const products = cache[cacheKey];
    const navigate = useNavigate();
    const { isDark } = useTheme();
    const { scrollRef } = useOutletContext();
    const showPagination = !pid && totalPages > 1;
    const { toggleFavItems, favorites } = useFavItem();
    const { isAuthenticated, loading: authloading } = useAuth();
    const [error, setError] = useState("");
    const prevCategoryRef = useRef(category);
    const toast = useToast();

    const [openDropdown, setDropDowm] = useState();

    const icons = ["/assets/icons/beauty.svg", "/assets/icons/electronics.svg", "/assets/icons/glasses.svg", "/assets/icons/groceries.svg", "/assets/icons/home.svg", "/assets/icons/man.svg", "/assets/icons/sports.svg", "/assets/icons/vehicle.svg", "/assets/icons/women.svg"]

    const scrollToTop = () => {
        scrollRef.current?.scrollTo({ top: 0, behavior: "instant" });
    };

    useEffect(() => {
        if (prevCategoryRef.current !== category) {
            prevCategoryRef.current = category;
            setTotalItems(0);
            setError("");
            setSearchParams({}, { replace: true });
        }
    }, [category, setSearchParams]);

    useEffect(() => {
        let cancelled = false;

        const fetchProducts = async () => {
            try {
                setLoading(!products);
                setError("");

                const params = { skip };
                if (category !== "HOME") params.category = category;

                const res = await getProducts(params);
                if (cancelled) return;

                const fetchedProducts = res?.data?.products ?? [];
                const total = res?.data?.total ?? 0;

                setTotalItems(total);
                setProducts(cacheKey, fetchedProducts);

                if (total === 0) {
                    setError("No products found!");
                }
            } catch (err) {
                if (cancelled) return;
                const msg = err?.response?.data?.message || err?.message || "Unable to load products!"
                setError(msg);
                toast.error(msg);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();

        return () => {
            cancelled = true;
        };
    }, [category, skip, cacheKey]);

    const goToPage = (nextPage) => {
        const safePage = Math.min(Math.max(nextPage, 1), Math.max(totalPages, 1));
        setSearchParams(safePage === 1 ? {} : { page: String(safePage) });
        scrollToTop();
    };

    const nextPage = () => goToPage(page + 1);
    const prevPage = () => goToPage(page - 1);

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
    const visiblePages = getVisiblePages(page, totalPages);

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

    const { activeTab, setActiveTab } = useOutletContext();

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


    return (
        <>
            <div className='flex lg:min-h-[calc(100dvh-112px)] md:min-h-[calc(100dvh-80px)] min-h-[calc(100dvh-112px)] sm:px-5 px-1 lg:px-10 sm:py-2 gap-6 relative mb-6'>
                <aside className={`sticky top-32 p-4 lg:block hidden min-w-1/4 max-w-1/4 border h-fit ${isDark ? "" : "border-gray-200"} rounded-xl`}>
                    <div className='relative'>
                        <h1 className={`uppercase font-semibold text-lg tracking-wide mb-3 ${isDark ? "" : "text-[#454545]"}`}>Category</h1>
                        <div className='space-y-2'>
                            {categories?.map((item, idx) => (
                                <div key={idx}>
                                    <div className='flex justify-between font-medium text-lg text-[#787878] cursor-pointer' onClick={() => setDropDowm((prev) => (prev === item?.parentCategory) ? "" : item?.parentCategory)}>
                                        <div className='flex gap-2'>
                                            <img src={icons[idx]} alt="" className='h-5 w-5' />
                                            <h3>{item?.parentCategory}</h3>
                                        </div>
                                        <span>{openDropdown === item?.parentCategory ? "-" : "+"}</span>
                                    </div>

                                    <div className={`grid ${openDropdown === item?.parentCategory ? "grid-rows-[1fr]" : "grid-rows-[0fr]"} transition-all duration-600`}>
                                        <div className='overflow-hidden min-h-0'>
                                            <div className='pt-3 pb-2 border-t border-t-gray-200 '>
                                                {item?.categories?.map((sub, i) => (
                                                    <div
                                                        className={`flex justify-between py-0.5 cursor-pointer hover:text-gray-700 ${isDark ? "" : "text-[#787878]"}`}
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
                <div className='w-full h-fit'>
                    {activeTab === "HOME" && <ProductSection products={products} />}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-1 lg:gap-5 will-change-transform w-full h-full relative ">

                        {loading
                            ? Array(PAGE_SIZE)
                                .fill(0)
                                .map((_, idx) => <ProductSkeleton key={idx} />)
                            :
                            error ?
                                (<div className={`w-full rounded px-10 flex justify-center items-center absolute left-1/2 -translate-x-1/2 -translate-y-1/2 top-1/2 ${isDark ? "text-gray-300" : "text-gray-800"}`}>
                                    <div className="flex flex-col justify-center items-center text-center">
                                        <img src="/noResult.webp" alt="img" className="sm:h-50 sm:w-50 h-40 w-40 object-contain" />
                                        <p className="font-semibold text-lg mb-2">Unable to load products</p>
                                        <p className="font-normal text-gray-500 text-sm mb-4">Try changing the category or refresh the page</p>
                                        <button className="border-2 flex flex-row items-center justify-center gap-2 hover:bg-[#fc8479] bg-[#FF6F61] border-[#ff3e2d] text-white font-semibold px-3 py-2 rounded text-sm shadow-md cursor-pointer" onClick={() => window.location.reload()}>
                                            <AiOutlineReload size={20} />
                                            <span>Reload</span>
                                        </button>
                                    </div>
                                </div>
                                ) : (
                                    products?.filter(p => p.productId !== pid).map((product, idx) => (
                                        <ProductCard key={product.productId} idx={idx} product={product} isDark={isDark} isFavorite={isFavorite} onFavClick={handleAddToFav} navigate={navigate} />
                                    )))
                        }
                    </div>
                    {showPagination && (

                        <div className="w-full flex justify-center items-center pb-20 mt-5">
                            <div className={`${isDark ? "bg-[#0F172A] shadow-xl shadow-[#0F172A] border-gray-700" : "bg-[#FFFFFF] shadow-md shadow-gray-300"} flex justify-center items-center p-1 sm:p-2 gap-1 sm:gap-2 rounded-4xl border border-gray-200`}>
                                {/* Prev */}
                                <button
                                    onClick={() => {
                                        prevPage();
                                        scrollToTop();
                                    }}
                                    disabled={page === 1}
                                    className={`${isDark ? "shadow-md shadow-[#0F172A]" : "shadow-md shadow-gray-300"} flex flex-row justify-center items-center p-2 border-[#ff5545] border-2 bg-[#FF6F61] text-white rounded-full disabled:opacity-50 cursor-pointer`}
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
                                                goToPage(p);
                                                scrollToTop();
                                            }}
                                            className={`${isDark ? "shadow-md shadow-[#0F172A]" : "shadow-md shadow-gray-300"} sm:h-10 sm:w-10 h-fit w-7 rounded-lg sm:rounded-xl font-semibold border-2 cursor-pointer ${page === p ? "bg-[#FF6F61] text-white border-[#ff5545]" : "bg-white text-black border-transparent"}`}
                                        >
                                            {p}
                                        </button>

                                    ))}

                                {/* Next */}
                                <button
                                    onClick={() => {
                                        nextPage();
                                        scrollToTop();
                                    }}
                                    disabled={page === totalPages}
                                    className={`${isDark ? "shadow-md shadow-[#0F172A]" : "shadow-md shadow-gray-300"} flex flex-row justify-center items-center p-2 bg-[#FF6F61] text-white rounded-full disabled:opacity-50 border-[#ff5545] border-2 cursor-pointer`}
                                >
                                    <span className='hidden sm:inline'>Next</span>
                                    <FaCircleArrowRight />
                                </button>
                            </div>
                        </div>

                    )}
                </div>
            </div>
        </>
    );
})

const ProductCard = React.memo(function ProductCard({ product, isDark, isFavorite, onFavClick, idx, navigate }) {
    return (
        <div
            className={`will-change-transform max-w-sm h-fit rounded-2xl transition-shadow duration-300 pt-2 border border-gray-200 relative group px-2 cursor-pointer shadow-md hover:shadow-xl ${isDark ? "bg-[#0F172A] shadow-[#0F172A] border-gray-700" : "bg-white shadow-gray-300"}`}
            onClick={() => {
                navigate(`/${createSlug(product.title)}/p/${product._id}`);
            }}
        >
            <div
                className={`absolute right-2 top-2 z-100 hover:text-red-500 active:scale-90 transition-transform duration-300 will-change-transform text-2xl ${isDark ? "text-gray-500" : "text-gray-400"}`}
                onClick={(e) => {
                    e.stopPropagation();
                    onFavClick(product._id);
                }}>
                {isFavorite(product._id) ? <FaHeart className='text-red-500' /> : <FaRegHeart />}
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
                        {renderStars(product.rating)} ({product.rating.toFixed(1)})
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
                    </div>
                </div>
                <AddToCartBtn product={product} />
            </div>
        </div>
    );
});

const ProductSection = ({ products }) => {

    const navigate = useNavigate();
    // Sort latest first
    const sortedProducts = products
        ? [...products].sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        )
        : [];

    // helpers
    const chunkArray = (arr, size = 4) => {
        const result = [];
        for (let i = 0; i < arr.length; i += size) {
            result.push(arr.slice(i, i + size));
        }
        return result;
    };

    // filters
    const newArrivals = products ? [...products].sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
    }) : [];

    const trending = sortedProducts.filter((p) => p.price >= 5000);

    const topRated = sortedProducts.filter((p) => p.rating >= 4);

    const sections = [
        {
            title: "New Arrivals",
            products: newArrivals,
        },
        {
            title: "Trending",
            products: trending,
        },
        {
            title: "Top Rated",
            products: topRated,
        },
    ];

    return (
        <div className="py-10 bg-white font-[Poppins]">

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

                {sections.map((section, idx) => {

                    const slides = chunkArray(section.products, 4);

                    return (
                        <div key={idx}>

                            {/* heading */}
                            <div className="border-b border-gray-200 pb-4">
                                <h2 className="text-lg font-semibold text-[#212121]">
                                    {section.title}
                                </h2>
                            </div>

                            {/* swiper */}
                            <Swiper
                                key={slides.length}
                                modules={[Autoplay, Pagination, EffectFade]}
                                effect="fade"
                                fadeEffect={{ crossFade: true }}
                                autoplay={{
                                    delay: 4000,
                                    disableOnInteraction: false,
                                    pauseOnMouseEnter: true,
                                }}
                                speed={990}
                                loop={false}
                                watchSlidesProgress={true}
                                className="overflow-hidden"
                            >
                                {slides.map((group, i) => (
                                    <SwiperSlide key={i}>

                                        <div className="flex flex-col gap-4 opacity-100 transition-opacity duration-700 py-6">

                                            {group.map((product) => (
                                                <div
                                                    key={product._id}
                                                    className="border border-gray-200 rounded-xl p-4 flex items-center gap-4 hover:-translate-y-2 hover:border-[#ff8f9c] transition-all duration-300"
                                                    onClick={() => {
                                                        navigate(`/${createSlug(product.title)}/p/${product._id}`);
                                                    }}
                                                >

                                                    {/* image */}
                                                    <img
                                                        src={product.thumbnail}
                                                        alt={product.title}
                                                        className="object-contain"
                                                        width={70}
                                                    />

                                                    {/* content */}
                                                    <div className="flex flex-col gap-1 w-full overflow-hidden">

                                                        <h3 className="text-[15px] font-semibold text-[#212121] truncate">
                                                            {product.title}
                                                        </h3>

                                                        <span className="text-[14px] text-[#787878]">
                                                            {product.category}
                                                        </span>

                                                        <div className="flex items-center gap-3 mt-1">

                                                            <span className="text-[15px] font-bold text-[#ff8f9c]">
                                                                ₹{formatINR(product.price)}
                                                            </span>

                                                            <span className="text-[14px] text-gray-500 line-through">
                                                                ₹{formatINR(
                                                                    Math.round(
                                                                        (product.price * 100) /
                                                                        (100 - product.discountPercentage)
                                                                    )
                                                                )}
                                                            </span>

                                                        </div>

                                                    </div>
                                                </div>
                                            ))}

                                        </div>

                                    </SwiperSlide>
                                ))}

                            </Swiper>

                        </div>
                    );
                })}

            </div>

        </div>
    );
};


export default Layout;