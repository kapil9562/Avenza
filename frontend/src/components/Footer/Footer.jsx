// components/Footer.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { FaFacebook, FaGithub, FaInstagram, FaTwitter } from "react-icons/fa";

function Footer({ setActiveTab, scrollRef }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark } = useTheme();

  return (
    <section
      className={` ${isDark ? "bg-[#020617] border-t-gray-700 text-gray-300" : "bg-gray-50 text-gray-700 border-t-gray-200"
        } pb-20 border-t`}
    >
      <div className="w-full">
        <div className="max-w-7xl mx-auto px-6 pt-10 grid grid-cols-2 md:col-span-3 lg:grid-cols-6 gap-y-16 gap-x-12">

          {/* Logo Section */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2 lg:pr-8">
            <div className="flex gap-2 flex-col">
              <div
                className="cursor-pointer"
                onClick={() => {
                  setActiveTab("HOME");
                  navigate("/");
                  if (location.pathname === "/") {
                    scrollRef.current?.scrollTo({
                      top: 0,
                      behavior: "smooth",
                    });
                  }
                }}
              >
                <img
                  src="/assets/logo.png"
                  alt="logo"
                  className="sm:w-40 w-30 object-cover"
                />
              </div>
              <p className="font-semibold">
                Your one-stop shop for the best products. Quality, trust, and fast delivery.
              </p>
            </div>

            {/* Social */}
            <ul className="flex items-center space-x-3 mt-9 text-2xl">
              <FaFacebook className={`hover:text-orange-500 cursor-pointer`} />
              <FaInstagram className={`hover:text-orange-500 cursor-pointer`} />
              <FaTwitter className={`hover:text-orange-500 cursor-pointer`} />
              <FaGithub className={`hover:text-orange-500 cursor-pointer`} />
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h3 className={` font-semibold tracking-widest text-gray-400 uppercase`}>
              Quick Links
            </h3>
            <ul className={`flex w-fit font-medium transition-all duration-200 flex-col space-y-2 ${isDark ? "text-gray-300" : "text-black"}`}>
              <li
                className={`hover:text-orange-500 cursor-pointer w-fit relative after:absolute after:left-0 after:bottom-0 after:h-px after:w-full after:bg-[#FF6F61] after:scale-x-0 after:origin-left after:transition-transform will-change-transform after:duration-300 hover:after:scale-x-100`}
                onClick={() => {
                  setActiveTab('HOME');
                  navigate('/')
                  if (location.pathname === "/") {
                    scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
                  }
                }}
              >
                Home
              </li>
              <li className={`hover:text-orange-500 cursor-pointer w-fit relative after:absolute after:left-0 after:bottom-0 after:h-px after:w-full after:bg-[#FF6F61] after:scale-x-0 after:origin-left after:transition-transform will-change-transform after:duration-300 hover:after:scale-x-100`} onClick={() => navigate('/about')}>
                About
              </li>
              <li
                className={`hover:text-orange-500 cursor-pointer w-fit relative after:absolute after:left-0 after:bottom-0 after:h-px after:w-full after:bg-[#FF6F61] after:scale-x-0 after:origin-left after:transition-transform will-change-transform after:duration-300 hover:after:scale-x-100`}
                onClick={() => {
                  setActiveTab('')
                  navigate('/carts')
                }}
              >
                Cart
              </li>
              <li className={`hover:text-orange-500 cursor-pointer w-fit relative after:absolute after:left-0 after:bottom-0 after:h-px after:w-full after:bg-[#FF6F61] after:scale-x-0 after:origin-left after:transition-transform will-change-transform after:duration-300 hover:after:scale-x-100`} onClick={() => navigate('/whitelist')}>
                Whitelist
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className={` font-semibold tracking-widest text-gray-400 uppercase`}>
              Contact Us
            </h3>
            <ul className={`flex w-fit text-base transition-all duration-200 flex-col space-y-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              <p className="space-y-2 text-[16px] break-all whitespace-normal">
                <span className="font-bold">
                  Email:{" "}
                  <a href="adhikarikapil389@gmail.com" className="hover:text-orange-400 hover:underline font-medium ">adhikarikapil389@gmail.com</a>
                </span>
              </p>
              <p className="space-y-2 text-[16px]">
                <span className="font-bold">
                  Phone:{" "}
                  <a href="tel:+918791029562" className="hover:text-orange-400 hover:underline font-medium ">+918791029562</a>
                </span>
              </p>
              <p className="space-y-2 text-[16px]">
                <span className="font-bold">
                  Location:{" "}
                  <a href="adhikarikapil389@gmail.com" className="hover:text-orange-400 hover:underline font-medium ">Almora, Uttarakhand, India</a>
                </span>
              </p>
            </ul>
          </div>

          {/* Download App */}
          <div className="col-span-2 md:col-span-1 lg:col-span-2 lg:pl-8">
            <p className="text-sm font-semibold tracking-widest text-gray-400 uppercase">
              Download Our App
            </p>

            <p className={`mt-4 text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
              Shop faster and get exclusive offers on our mobile app.
            </p>

            <div className="flex gap-3 mt-5">
              {/* Play Store */}
              <button className="transition-transform duration-200 active:scale-95 cursor-pointer will-change-transform">
                <img
                  src="/assets/playstore.png"
                  alt="Download on Play Store"
                  className={`h-12 object-contain bg-black rounded-lg  transition-all duration-300 ${isDark ? "border-2 border-gray-700 hover:border-gray-400" : "border-2 border-transparent hover:shadow-lg hover:shadow-gray-400"}`}
                />
              </button>

              {/* App Store */}
              <button className="transition-transform duration-300 active:scale-95 w-fit cursor-pointer will-change-transform">
                <img
                  src="/assets/appstore.png"
                  alt="Download on App Store"
                  className={`h-12 object-contain bg-black rounded-lg  transition-all duration-300 ${isDark ? "border-2 border-gray-700 hover:border-gray-400" : "border-2 border-transparent hover:shadow-lg hover:shadow-gray-400"}`}
                />
              </button>
            </div>
          </div>

        </div>
        <hr
          className={`mt-16 mb-10 ${isDark ? "border-gray-700" : "border-gray-200"
            }`}
        />

        <p
          className={`font-semibold nunitoFont text-sm px-4 sm:text-lg text-center ${isDark ? "text-gray-400" : "text-gray-600"
            }`}
        >
          © {new Date().getFullYear()} Avenza. Made with ❤️ and ☕ in India.
        </p>
      </div>
    </section>
  );
}

export default Footer;
