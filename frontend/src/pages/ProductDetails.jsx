import { useLocation, useNavigate, useOutletContext, useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { ProductDetailsSkeleton, Layout, AddToCartBtn } from "../components";
import { formatINR } from "../utils/price.js";
import { useTheme } from "../context/ThemeContext.jsx";
import { getProducts, productReview } from "../api/api.js";
import { IoGiftOutline, IoShieldCheckmarkOutline, IoStar } from "react-icons/io5";
import { useAuth } from "../context/AuthContext.jsx";
import { BsBoxSeam, BsThreeDotsVertical } from "react-icons/bs";
import { PiPencilLineFill, PiTruck } from "react-icons/pi";
import { ImBin } from "react-icons/im";
import { TfiHeadphoneAlt } from "react-icons/tfi";
import { LuRefreshCw, LuWeight } from "react-icons/lu";
import { SlTag } from "react-icons/sl";

function ProductDetails() {
    const { productId } = useParams();

    const [product, setProduct] = useState(null);
    const [currentImg, setCurrentImg] = useState(null);
    const [loading, setLoading] = useState(true);
    const [imgLoading, setImgLoading] = useState(true);
    const [price, setPrice] = useState();
    const [error, setError] = useState("");
    const [refreshReviews, setRefreshReviews] = useState(0);

    const { setActiveTab } = useOutletContext();

    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [showInput, setShowInput] = useState(false);
    const [review, setReview] = useState("");
    const { isDark } = useTheme();
    const getbg = !isDark ? '/assets/1.png' : '/assets/d1.png'

    const [activeOption, setActiveOption] = useState(null);

    const navigate = useNavigate();

    const location = useLocation();

    const { user } = useAuth();

    const submitReview = async () => {
        if (!user) {
            navigate('/login', { replace: true, state: { from: location } });
            return;
        }
        try {
            const res = await productReview({
                productId,
                rating,
                comment: review,
                reviewerName: user?.name,
                reviewerEmail: user?.email
            })
            setReview("");
            setRating(0);
            setShowInput(false);
            setRefreshReviews((prev) => prev + 1);

        } catch (error) {
            console.error(error);
        }
    }

    const handleRatingClick = (value) => {
        setRating(value);
        setShowInput(true);
    };


    useEffect(() => {
        setActiveTab("");
    }, []);

    useEffect(() => {
        const fetchProductById = async () => {
            try {
                setLoading(true);
                const res = await getProducts({ productId });
                const data = res.data.products[0] || null;
                setProduct(data);
                setCurrentImg(data.images?.[0] || null);
                setImgLoading(true);
            } catch (err) {
                setError(err?.response?.data?.message || err?.message || "Unable to load product");
            } finally {
                setLoading(false);
            }
        };

        fetchProductById();
    }, [productId, refreshReviews]);

    useEffect(() => {
        product?.images?.forEach((src) => {
            const img = new Image();
            img.src = src;
        });

        if (product?.price != null) {
            setPrice(product?.price);
        }
    }, [product]);

    const formattedDate = (date) => {
        return new Date(date).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

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

    const handleBuyNow = () => {
        if (!user) {
            navigate('/login', { replace: true, state: { from: location } });
            return;
        }

        navigate(`/checkout/${productId}`);
    }

    const hasUserReviewed = product?.reviews?.some(
        (review) => review.reviewerEmail === user?.email
    );


    const highlights = [
        {
            id: 1,
            title: "Stock",
            value: product?.stock,
            icon: <BsBoxSeam />
        },
        {
            id: 2,
            title: "Brand",
            value: product?.brand || "-",
            icon: <SlTag />
        },
        {
            id: 3,
            title: "Weight",
            value: product?.weight,
            icon: <LuWeight />
        },
        {
            id: 4,
            title: "Warranty",
            value: product?.warrantyInformation,
            icon: <IoShieldCheckmarkOutline />
        },
    ]

    return (
        <div className={`flex flex-col gap-2 md:p-5 lg:min-h-[calc(100dvh-112px)] md:min-h-[calc(100dvh-80px)] min-h-[calc(100dvh-112px)] w-full ${isDark ? "bg-gray-900" : "bg-[#FFFFFF]"}`}>

            {loading ?
                (
                    <ProductDetailsSkeleton />
                ) : (
                    <div className={`md:rounded-xl flex flex-col justify-center items-center lg:min-h-[calc(100dvh-112px)] md:min-h-[calc(100dvh-80px)] min-h-[calc(100dvh-112px)] md:p-2 animate-easeIn ${!isDark ? "bg-[#FFFFFF95]" : "bg-[#0F172A95]"}`}>
                        {!product ? (
                            <div className="flex flex-col h-full justify-center items-center gap-4 px-4 text-center">
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
                            <>

                                <div className="flex flex-col sm:flex-row gap-2 sm:gap-8 p-2 w-full">
                                    {/* IMAGE SECTION */}
                                    <div className="flex gap-3 justify-start items-start flex-col">

                                        {/* Main Image */}
                                        <div className={`relative lg:w-150 lg:h-120 sm:w-80 w-full h-80 flex items-center justify-center rounded-2xl ${isDark && "shadow-lg shadow-[#0F172A] border border-gray-800"}`} style={{
                                            backgroundImage: `url(${getbg})`,
                                            backgroundSize: "cover",
                                            backgroundPosition: "center",
                                        }}>
                                            {imgLoading && (
                                                <div className="absolute inset-0 animate-pulse rounded-lg" />
                                            )}

                                            {currentImg && (
                                                <img
                                                    src={currentImg}
                                                    alt="Thumbnail"
                                                    onLoad={() => setImgLoading(false)}
                                                    className={`max-h-full object-contain transition-all duration-500 ease-out ${imgLoading ? "opacity-0" : "opacity-100"
                                                        }`}
                                                />
                                            )}
                                        </div>

                                        {/* Thumbnails */}
                                        <div className="flex gap-4 flex-row">
                                            {product?.images?.map((img, idx) => (
                                                <button
                                                    style={{
                                                        backgroundImage: `url(${getbg})`,
                                                        backgroundSize: "cover",
                                                        backgroundPosition: "center",
                                                    }}
                                                    key={idx}
                                                    onClick={() => {
                                                        if (img !== currentImg) {
                                                            setImgLoading(true);
                                                            setCurrentImg(img);
                                                        }
                                                    }}
                                                    className={`border-2 rounded-xl p-1 border-gray-400 cursor-pointer ${currentImg === img
                                                        && "border-pink-500"
                                                        } ${isDark && "shadow-lg shadow-[#0F172A] border border-gray-800"}`}
                                                >
                                                    <img
                                                        src={img}
                                                        className="h-14 w-14 object-contain"
                                                        alt="img"
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* DETAILS */}
                                    <div className="flex flex-col gap-4">
                                        <div className="px-2">
                                            <h1 className={`${!isDark ? "text-gray-800" : "text-[#F564A9]"} font-medium text-3xl`}>
                                                {product.title}
                                            </h1>

                                            <p className={`${!isDark ? "text-gray-600" : "text-gray-200"} mt-2`}>
                                                {product.description}
                                            </p>

                                            <div className="flex flex-row gap-4 justify-center items-center w-fit mt-4">
                                                <p className="text-3xl font-semibold text-[#FF6F61]">
                                                    ₹{formatINR(price)}
                                                </p>

                                                <p className={`text-xl font-semibold relative ${!isDark ? "text-gray-400" : "text-gray-200"}`}>
                                                    ₹
                                                    {(formatINR(Math.round(
                                                        (product.price * 100) /
                                                        (100 - product.discountPercentage)
                                                    )))}
                                                    <span className={`absolute w-full h-px left-0 top-1/2 ${!isDark ? "bg-gray-400" : "bg-gray-200"}`} />
                                                </p>

                                                <p className={`${!isDark ? "text-green-600" : "text-green-400"} text-xl font-semibold`}>
                                                    {product.discountPercentage.toFixed(0)}% off
                                                </p>
                                            </div>
                                            <div className="text-white font-semibold bg-green-700 w-fit rounded-full px-2 py-1 mt-2">
                                                {(product.rating) ? product?.rating?.toFixed(1) : 0} ★
                                            </div>

                                            <div className="flex flex-col md:flex-row gap-4 mt-6">

                                                <div className="min-w-35">
                                                    <AddToCartBtn product={product} />
                                                </div>

                                                <button
                                                    onClick={() => { handleBuyNow() }}
                                                    className="min-w-35 px-6 py-2 bg-[#FF6F61] text-[#FFFFFF] rounded-xl cursor-pointer active:scale-95 transition-transform duration-300"
                                                >
                                                    Buy Now
                                                </button>
                                            </div>
                                        </div>

                                        <div className="px-2 mt-2">
                                            <StatsSection isDark={isDark} />
                                        </div>

                                        <div className="px-2">
                                            <div className={`flex flex-row items-center gap-2 rounded-xl px-4 border py-3 ${isDark ? "border-gray-700" : "border-gray-200"}`}>
                                                <div className="p-2 rounded-lg bg-pink-600/10 text-pink-500 h-fit w-fit text-lg">
                                                    <LuRefreshCw />
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex flex-row gap-8 items-center">
                                                        <h3 className={`font-semibold ${!isDark ? "text-gray-800" : "text-gray-200"}`}>
                                                            Return Policy
                                                        </h3>
                                                        <p className={`bg-pink-600/10 w-fit h-fit py-1 px-4 rounded-4xl text-pink-600 font-medium flex items-center justify-center text-xs ${isDark ? "border border-pink-700" : ""}`}>
                                                            {product.returnPolicy}
                                                        </p>
                                                    </div>

                                                    <p className={`${isDark ? "text-gray-400" : "text-[#787878]"} text-sm font-medium`}>Easy returns & refunds on eligible items.</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="px-2">
                                            <div className={`${isDark ? "border-gray-700" : "border-gray-200"} border rounded-xl px-4 py-3`}>
                                                <h1 className={`text-lg mb-2 font-semibold ${!isDark ? "text-gray-800" : "text-gray-200"}`}>
                                                    Product Highlights
                                                </h1>

                                                <div className="grid grid-cols-2 gap-4">
                                                    {highlights?.map((item, i) => (
                                                        <div key={i} className="flex flex-row items-center gap-2">
                                                            <div className="bg-pink-600/10 text-pink-500 p-2 rounded-md h-fit w-fit text-lg">
                                                                {item?.icon}
                                                            </div>
                                                            <div>
                                                                <h1 className={`${isDark ? "text-gray-200" : "text-gray-800"}  text-sm font-semibold`}>
                                                                    {item?.title}
                                                                </h1>
                                                                <span className={`${isDark ? "text-gray-400" : "text-[#787878]"} text-sm font-medium`}>{item?.value}</span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full p-4 h-1">
                                    <div className={`w-full h-px ${!isDark ? "bg-gray-200" : "bg-gray-700"}`}></div>
                                </div>
                                <div className="pb-4 flex flex-col gap-4 px-6 w-full">
                                    <h1 className={`text-2xl mb-2 font-medium ${!isDark ? "text-gray-800" : "text-gray-200"}`}>
                                        Customer Reviews
                                    </h1>
                                    {product?.reviews?.length > 0 ?
                                        <div className="grid lg:grid-cols-3 gap-5">
                                            {product?.reviews?.map((review, idx) => (
                                                <div key={idx} className={idx !== product.reviews.length - 1 ? `${isDark ? "border-gray-600" : "border-gray-200"}  lg:border-r flex flex-row lg:pr-4 pb-4 lg:pb-0 border-b-2 lg:border-b-0` : "border-none flex flex-row lg:pr-4 pb-4 lg:pb-0"}>
                                                    <div className="flex gap-4">
                                                        <img
                                                            src={`${isDark ? '/assets/user.png' : '/assets/userLight.png'}`}
                                                            alt="User"
                                                            className="w-10 h-10 rounded-full"
                                                        />
                                                        <div className="flex flex-col gap-2">
                                                            <div className={`${isDark ? "text-[#FFFFFF]" : "text-gray-800"} font-semibold flex flex-row items-center gap-2`}>
                                                                <span>{review.reviewerName}</span>
                                                                <span>
                                                                    {renderStars(review.rating)}
                                                                </span>
                                                                <div className={`h-fit w-fit justify-center items-center ${user ? review.reviewerEmail === user?.email ? "flex" : "hidden" : "hidden"} ${isDark ? "text-gray-200" : "text-gray-800"} relative`}>
                                                                    <button onClick={() =>
                                                                        setActiveOption(activeOption === idx ? null : idx)
                                                                    } className="cursor-pointer">
                                                                        <BsThreeDotsVertical />
                                                                    </button>
                                                                    <div className={`absolute top-full left-0 border-2 rounded-lg overflow-hidden ${activeOption === idx ? "block" : "hidden"} ${isDark ? "border-gray-700 bg-[#0F172A] " : "border-gray-200 bg-white"}`}>
                                                                        <button className={`py-1 px-2 flex flex-row gap-2 items-center text-blue-500 cursor-pointer w-full ${isDark ? "hover:bg-gray-800" : "hover:bg-gray-200"}`}>
                                                                            <PiPencilLineFill />
                                                                            <span>Edit</span>
                                                                        </button>
                                                                        <div className={`w-full h-px ${!isDark ? "bg-gray-200" : "bg-gray-700"}`} />
                                                                        <button className={`py-1 px-2 flex flex-row gap-2 items-center text-red-500 cursor-pointer w-full ${isDark ? "hover:bg-gray-800" : "hover:bg-gray-200"}`}>
                                                                            <ImBin />
                                                                            <span>Delete</span>
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <p className={`${isDark ? "text-gray-300" : "text-gray-600"}`}>
                                                                {review.comment}
                                                            </p>
                                                            <p className="text-[14px] text-gray-400 font-semibold">
                                                                • {formattedDate(review.date)}
                                                            </p>
                                                        </div>
                                                    </div>

                                                </div>
                                            ))}
                                        </div>
                                        :
                                        <div className={`grid lg:grid-cols-3 gap-5 ${isDark ? "text-gray-200" : "text-gray-800"}`}>
                                            <h1>No reviews yet. Be the first to review this product!</h1>
                                        </div>
                                    }
                                </div>

                                {user && !hasUserReviewed &&
                                    (<div className={`w-full p-4 h-1`}>
                                        <div className={`w-full h-px ${!isDark ? "bg-gray-200" : "bg-gray-700"}`}></div>
                                    </div>)
                                }

                                {/* Give Review */}
                                {user && !hasUserReviewed &&
                                    (<div className={`w-full pb-4 flex flex-col gap-2 px-6`}>
                                        <h2 className={`text-2xl mb-2 font-medium ${!isDark ? "text-gray-800" : "text-gray-200"}`}>
                                            Give a Review
                                        </h2>

                                        {/* Stars */}
                                        <div className="flex items-center gap-2 mb-4">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <IoStar
                                                    key={star}
                                                    size={32}
                                                    onClick={() => handleRatingClick(star)}
                                                    onMouseEnter={() => setHover(star)}
                                                    onMouseLeave={() => setHover(0)}
                                                    className={`cursor-pointer transition-all duration-200 outline-none ${star <= (hover || rating)
                                                        ? "fill-yellow-400 text-yellow-400 scale-110"
                                                        : "text-gray-300"
                                                        }`}
                                                />
                                            ))}
                                        </div>

                                        {/* Review Input */}
                                        {showInput && (
                                            <div className="transition-all duration-300">
                                                <textarea
                                                    value={review}
                                                    onChange={(e) => setReview(e.target.value)}
                                                    placeholder="Write your review..."
                                                    className={`w-full p-3 border-2 rounded-xl focus:outline-none shadow-md resize-none ${isDark ? "focus:shadow-purple-900/40 border-gray-700 placeholder:text-gray-400 text-gray-200" : "focus:shadow-purple-300 border-gray-200"}`}
                                                    rows="4"
                                                    maxLength={200}
                                                />

                                                <button
                                                    className={`mt-3 px-6 py-2 bg-linear-to-r from-orange-400 via-orange-500 to-orange-600 text-white rounded-xl font-medium transition-all cursor-pointer`}
                                                    onClick={() => {
                                                        submitReview();
                                                    }}
                                                >
                                                    Submit Review
                                                </button>
                                            </div>
                                        )}
                                    </div>)
                                }

                                <div className="w-full p-4 h-1">
                                    <div className={`w-full h-px ${!isDark ? "bg-gray-200" : "bg-gray-700"}`}></div>
                                </div>
                                {/* Related Products */}
                                <div className="pb-4 flex flex-col w-full">
                                    <h1 className={`text-2xl mb-2 font-medium sm:pl-6 pl-4 ${!isDark ? "text-gray-800" : "text-gray-200"}`}>
                                        Related Products
                                    </h1>
                                    <Layout category={product?.category} pid={product?.productId} />
                                </div>
                            </>
                        )}
                    </div>
                )}
        </div>
    );
}

const statsData = [
    {
        id: 1,
        title: "Free Delivery",
        subtitle: "On orders ₹499+",
        icon: <PiTruck />
    },
    {
        id: 2,
        title: "100% Authentic",
        subtitle: "Original products",
        icon: <IoShieldCheckmarkOutline />
    },
    {
        id: 3,
        title: "24/7 Support",
        subtitle: "We're here to help",
        icon: <TfiHeadphoneAlt />
    },
    {
        id: 4,
        title: "Secure Payment",
        subtitle: "Safe & encrypted",
        icon: <IoGiftOutline />
    },
];

const StatsSection = ({ isDark }) => {
    return (
        <div
            className={`rounded-xl overflow-hidden grid grid-cols-2 xl:grid-cols-4 ${isDark
                ? "border border-pink-700 bg-pink-600/10"
                : "bg-pink-50 border border-pink-200"
                }`}
        >
            {statsData?.map((stat, i) => (
                <div
                    key={i}
                    className={`flex xl:justify-center items-center gap-3 py-3 px-2 ${isDark ? "border-r border-pink-800" : "border-r border-pink-100"} ${i < 2 ? isDark ? "border-b border-pink-800 xl:border-b-0" : "border-b border-pink-100 xl:border-b-0" : ""}`}
                >
                    <div
                        className={`flex items-center justify-center p-2 rounded-full shrink-0 bg-rose-600/10 text-rose-500`}
                    >
                        <div className="xl:text-xl lg:text-2xl text-xl">
                            {stat.icon}
                        </div>
                    </div>

                    <div className="flex flex-col min-w-0">
                        <h2
                            className={`text-sm font-semibold leading-tight ${isDark ? "text-white" : "text-gray-900"}`}
                        >
                            {stat?.title}
                        </h2>

                        <span
                            className={`xl:text-sm text-xs font-medium mt-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}
                        >
                            {stat?.subtitle}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ProductDetails;
