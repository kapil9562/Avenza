import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import ProductDetailsSkeleton from "../utils/ProductDetailsSkeleton";
import { formatINR } from "../utils/price";
import bg from '../assets/1.png'
import darkBg from '../assets/d1.png'
import Layout from "../components/categories/Layout";
import { useTheme } from "../context/ThemeContext";
import { getProducts } from "../api/api.js";
import AddToCartBtn from "../utils/AddToCartBtn.jsx";
import userImg from "../assets/user.png"
import userLight from "../assets/userLight.png"
import notFound from "../assets/ItemNotFound.png"

function ProductDetails() {
    const { productId } = useParams();

    const [product, setProduct] = useState(null);
    const [currentImg, setCurrentImg] = useState(null);
    const [loading, setLoading] = useState(true);
    const [imgLoading, setImgLoading] = useState(true);
    const [price, setPrice] = useState();
    const [error, setError] = useState("");

    const { setActiveTab } = useOutletContext();

    const { isDark } = useTheme();
    const getbg = !isDark ? bg : darkBg

    const navigate = useNavigate();

    useEffect(() => {
        const fetchProductById = async () => {
            try {
                setLoading(true);
                const res = await getProducts({ productId: productId });
                const data = res.data.products[0];
                setProduct(data);
                setCurrentImg(data.images?.[0] || null);
                setImgLoading(true);
            } catch (err) {
                console.error(err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProductById();
    }, [productId]);

    useEffect(() => {
        setActiveTab("")
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


    return (
        <div className={`flex flex-col gap-2 md:p-5 min-h-150 w-full pb-20 ${!isDark ? "bgImg" : "darkBgImg"}`}>

            {loading ?
                (
                    <ProductDetailsSkeleton />
                ) : (
                    <div className={`md:rounded-4xl flex flex-col justify-center items-center min-h-150 md:p-2 animate-easeIn ${!isDark ? "bg-[#FFFFFF95]" : "bg-[#0F172A95]"}`}>
                        {error ? (
                            <div className="flex flex-col justify-center items-center gap-4">
                                <img src={notFound} alt="not found" className="md:h-100 h-70 object-contain float-img" />
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
                                                    loading="lazy"

                                                    alt=""
                                                    onLoad={() => setImgLoading(false)}
                                                    className={`max-h-full object-contain transition-opacity duration-300 ${imgLoading ? "opacity-0" : "opacity-100"
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
                                    <div className="flex flex-col">
                                        <div className="p-2">
                                            <h1 className={`${!isDark ? "text-black" : "text-[#F564A9]"} text-3xl font-['Playfair_Display']`}>
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
                                                {product.rating.toFixed(1)} ★
                                            </div>

                                            <div className="flex flex-col md:flex-row gap-4 mt-6">

                                                <div className="min-w-35">
                                                    <AddToCartBtn product={product} />
                                                </div>

                                                <button
                                                    // onClick={() => {}}
                                                    className="min-w-35 px-6 py-2 bg-[#FF6F61] text-[#FFFFFF] rounded-2xl cursor-pointer active:scale-95 transition-transform duration-300"
                                                >
                                                    Buy Now
                                                </button>
                                            </div>
                                        </div>

                                        <div className="w-full h-1 p-4">
                                            <div className={`w-full h-px ${!isDark ? "bg-gray-200" : "bg-gray-700"}`}></div>
                                        </div>

                                        <div className="flex flex-col rounded-lg px-4 gap-1">
                                            <h1 className={`text-2xl mb-2 font-serif ${!isDark ? "text-black" : "text-gray-200"}`}>
                                                Return Policy
                                            </h1>
                                            <p className="bg-[#FF6F6120] w-fit p-2 rounded-4xl border-2 border-[#FF6F61] text-[#FF6F61] font-semibold">
                                                {product.returnPolicy}
                                            </p>
                                        </div>

                                        <div className="w-full p-4 h-1">
                                            <div className={`w-full h-px ${!isDark ? "bg-gray-200" : "bg-gray-700"}`}></div>
                                        </div>

                                        <div className="rounded-lg px-4">
                                            <h1 className={`text-2xl mb-2 font-serif ${!isDark ? "text-black" : "text-gray-200"}`}>
                                                Product Highlights
                                            </h1>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <h1 className={`${isDark ? "text-gray-200" : "text-gray-600"}  text-sm font-semibold`}>
                                                        stock
                                                    </h1>
                                                    <span className={`${isDark ? "text-gray-300" : "text-black"}`}>{product.stock}</span>
                                                </div>

                                                <div>
                                                    <h1 className={`${isDark ? "text-gray-200" : "text-gray-600"}  text-sm font-semibold`}>
                                                        brand
                                                    </h1>
                                                    <span className={`${isDark ? "text-gray-300" : "text-black"}`}>{product.brand}</span>
                                                </div>

                                                <div>
                                                    <h1 className={`${isDark ? "text-gray-200" : "text-gray-600"}  text-sm font-semibold`}>
                                                        weight
                                                    </h1>
                                                    <span className={`${isDark ? "text-gray-300" : "text-black"}`}>{product.weight} gm</span>
                                                </div>

                                                <div>
                                                    <h1 className={`${isDark ? "text-gray-200" : "text-gray-600"}  text-sm font-semibold`}>
                                                        warranty
                                                    </h1>
                                                    <span className={`${isDark ? "text-gray-300" : "text-black"}`}>{product.warrantyInformation}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full p-4 h-1">
                                    <div className={`w-full h-px ${!isDark ? "bg-gray-200" : "bg-gray-700"}`}></div>
                                </div>
                                <div className="pb-4 flex flex-col gap-4 px-6">
                                    <h1 className={`text-2xl mb-2 font-serif ${!isDark ? "text-black" : "text-gray-200"}`}>
                                        Customer Reviews
                                    </h1>
                                    <div className="grid lg:grid-cols-3 gap-5">
                                        {product?.reviews?.map((review, idx) => (
                                            <div key={idx} className={idx !== product.reviews.length - 1 ? `${isDark ? "border-gray-600" : "border-gray-200"}  lg:border-r flex flex-row lg:pr-4 pb-4 lg:pb-0 border-b-2 lg:border-b-0` : "border-none flex flex-row lg:pr-4 pb-4 lg:pb-0"}>
                                                <div className="flex gap-4">
                                                    <img
                                                        src={`${isDark ? userImg : userLight}`}
                                                        alt="User"
                                                        className="w-10 h-10 rounded-full"
                                                    />
                                                    <div className="flex flex-col gap-2">
                                                        <div className={`${isDark ? "text-[#FFFFFF]" : "text-black"} font-semibold flex flex-row items-center gap-2`}>
                                                            <span>{review.reviewerName}</span>
                                                            <span>
                                                                {renderStars(review.rating)}
                                                            </span>
                                                        </div>
                                                        <p className={`${isDark ? "text-gray-300" : "text-gray-600"}`}>
                                                            {review.comment} Lorem ipsum dolor sit amet consectetur, adipisicing elit. Repudiandae, officiis?
                                                        </p>
                                                        <p className="text-[14px] text-gray-400 font-semibold">
                                                            • {formattedDate(review.date)}
                                                        </p>
                                                    </div>
                                                </div>

                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="w-full p-4 h-1">
                                    <div className={`w-full h-px ${!isDark ? "bg-gray-200" : "bg-gray-700"}`}></div>
                                </div>
                                {/* Related Products */}
                                <div className="pb-4 flex flex-col">
                                    <h1 className={`text-2xl mb-2 font-serif sm:pl-6 pl-4 ${!isDark ? "text-black" : "text-gray-200"}`}>
                                        Related Products
                                    </h1>
                                    <Layout category={product?.category} pid={product?.id} />
                                </div>
                            </>
                        )}
                    </div>
                )}
        </div>
    );
}

export default ProductDetails;
