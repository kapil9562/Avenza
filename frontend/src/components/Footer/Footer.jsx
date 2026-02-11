// components/Footer.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { FaFacebook, FaGithub, FaInstagram, FaTwitter } from "react-icons/fa";

function Footer({ activeTab, setActiveTab, scrollRef }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark } = useTheme();

  return (
    <section
      className={` ${isDark ? "bg-[#020617] text-gray-300" : "bg-gray-50 text-gray-700"
        } pb-10`}
    >
      <div>
        <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-2 md:col-span-3 lg:grid-cols-6 gap-y-16 gap-x-12">

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
            <ul className={`flex w-fit text-base transition-all duration-200 flex-col space-y-2 ${isDark? "text-gray-300" : "text-black"}`}>
              <li
                className={`hover:text-orange-500 cursor-pointer`}
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
              <li className={`hover:text-orange-500 cursor-pointer`}>
                Products
              </li>
              <li
                className={`hover:text-orange-500 cursor-pointer`}
                onClick={() => {
                  setActiveTab('')
                  navigate('/carts')
                }}
              >
                Cart
              </li>
              <li className={`hover:text-orange-500 cursor-pointer`}>
                Contact
              </li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <p className="text-sm font-semibold tracking-widest text-gray-400 uppercase">
              Help
            </p>

            <ul className="mt-6 space-y-4">
              {[
                "Customer Support",
                "Delivery Details",
                "Terms & Conditions",
                "Privacy Policy",
              ].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className={`flex w-fit text-base transition-all duration-200 ${isDark
                      ? "text-gray-300 hover:text-orange-500"
                      : "text-black hover:text-orange-500"
                      }`}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="col-span-2 md:col-span-1 lg:col-span-2 lg:pl-8">
            <p className="text-sm font-semibold tracking-widest text-gray-400 uppercase">
              Subscribe to newsletter
            </p>

            <form className="mt-6">
              <div>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className={`block w-full p-4 placeholder-gray-500 transition-all duration-200 border rounded-md focus:outline-none ${isDark
                    ? "bg-[#0F172A] text-white border-gray-700 focus:border-orange-500 caret-orange-500"
                    : "bg-white text-black border-gray-200 focus:border-orange-500 caret-orange-500"
                    }`}
                />
              </div>

              <button
                type="submit"
                className="inline-flex items-center justify-center px-6 py-4 mt-3 font-semibold text-white transition-all duration-200 bg-orange-500 rounded-md hover:bg-orange-600"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <hr
          className={`mt-16 mb-10 ${isDark ? "border-gray-700" : "border-gray-200"
            }`}
        />

        <p
          className={`text-sm text-center ${isDark ? "text-gray-400" : "text-gray-600"
            }`}
        >
          © {new Date().getFullYear()} Avenza. All Rights Reserved.
        </p>
      </div>
    </section>
  );
}

export default Footer;
