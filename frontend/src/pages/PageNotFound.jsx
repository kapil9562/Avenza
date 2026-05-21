import React from "react";
import { BsHeart, BsInstagram, BsSearch, BsTwitter, BsTwitterX } from "react-icons/bs";
import { FaShoppingBag } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const PageNotFound = () => {
  const {isDark} = useTheme();
  return (
    <div className={`lg:min-h-[calc(100dvh-112px)] md:min-h-[calc(100dvh-80px)] min-h-[calc(100dvh-112px)] ${isDark? "text-[#ed447f] bg-gray-900" : "bg-[#f8f5f2] text-black"}`}>
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center py-6 overflow-hidden">
        <div className="flex gap-10 items-center">
          {/* Left 4 */}
          <h1 className="text-[200px] font-serif leading-none">
            4
          </h1>

          {/* Center Image */}
          <div className="relative z-10">
            <img
              src="/404.jpg"
              alt="404"
              className="h-full object-cover rounded-bl-[150px]"
              width={200}
            />

            {/* 0 */}
            <h1 className="absolute inset-0 flex items-center justify-center text-[200px] font-serif text-white">
              0
            </h1>
          </div>
          {/* Right 4 */}
          <h1 className="text-[200px] font-serif leading-none">
            4
          </h1>
        </div>


        {/* Content */}
        <div className="text-center mt-10 z-10">
          <h2 className="text-4xl italic font-serif mb-5 font-medium">
            Page Not Found
          </h2>

          <p className="max-w-2xl text-gray-600 leading-7 text-sm mx-auto font-semibold">
            Looks like the page you are trying to visit doesn’t exist or has
            been moved. Explore our latest collections and continue shopping
            with Avenza.
          </p>

           <Link
            to="/"
            className={`inline-flex items-center justify-center mt-8 px-10 py-4 rounded-full tracking-wide text-sm font-semibold transition-all duration-300 shadow-lg hover:scale-105 will-change-transform
            ${
              isDark
                ? "bg-gradient-to-r from-pink-500 to-violet-500 text-white hover:shadow-pink-500/30"
                : "bg-gradient-to-r from-[#ff5ca8] to-[#a855f7] text-white hover:shadow-pink-200"
            }`}
          >
            GO BACK TO THE MAIN PAGE
          </Link>
        </div>
      </section>

    </div>
  );
};

export default PageNotFound;