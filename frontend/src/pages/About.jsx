import React, { useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { useOutletContext } from "react-router-dom";
import useScrollReveal from "../hooks/useScrollReveal";
import { FaChevronRight } from "react-icons/fa6";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { LiaBoxSolid } from "react-icons/lia";
import { PiTruck } from "react-icons/pi";
import { BsEmojiSmile } from "react-icons/bs";
import { HiOutlineBadgeCheck } from "react-icons/hi";
import { IoPricetagOutline } from "react-icons/io5";
import { TfiHeadphoneAlt } from "react-icons/tfi";
import { Breadcrumb } from "../components";

const ease = "ease-[cubic-bezier(0.22,1,0.36,1)]";

const brands = [
  "https://www.shutterstock.com/image-vector/galati-romania-april-29-2023-600nw-2295394661.jpg",
  "https://1000logos.net/wp-content/uploads/2021/04/Nivea-logo.png",
  "https://mir-s3-cdn-cf.behance.net/projects/404/056c44149820671.Y3JvcCwyNjUzLDIwNzUsMTYyOCwyMzY.jpg",
  "https://thecapitalmall.com/wp-content/uploads/2025/02/mamaearth-Capital-Mall-Vasai.png",
  "https://vectorseek.com/wp-content/uploads/2023/08/Wild-Stone-Logo-Vector.svg-.png",
  "https://upload.wikimedia.org/wikipedia/commons/2/29/Vivo_Logo.svg",
  "https://cdn.shopify.com/s/files/1/0272/4714/9155/files/logo-aboutus.png?1207",
  "https://i.pinimg.com/736x/3d/c2/77/3dc277d9b7eae42cb4fbef1f05909e61.jpg"
]

const About = () => {
  const { isDark } = useTheme();
  const { scrollRef } = useOutletContext();

  const hero = useScrollReveal(scrollRef, 0.3);
  const story = useScrollReveal(scrollRef, 0.3);
  const team = useScrollReveal(scrollRef, 0.5);
  const cta = useScrollReveal(scrollRef, 0.3);

  const { setActiveTab } = useOutletContext();

  useEffect(() => {
    setActiveTab("");
  }, []);

  return (
    <div className={`w-full lg:min-h-[calc(100dvh-112px)] md:min-h-[calc(100dvh-80px)] min-h-[calc(100dvh-112px)] sm:px-5 lg:px-15 pb-10 pt-5`}>
      {/* Hero */}
      <Breadcrumb />
      <section className={`flex gap-10 mt-6`}>
        <div className={`w-1/2 space-y-2`}>
          <h3 className={`text-[#ff619e] font-bold`}>ABOUT US</h3>
          <h1 className={`text-5xl font-semibold ${isDark ? "text-gray-100" : "text-gray-800"}`}>Your Trusted Shopping Partner, <span className={`text-[#ff619e] font-semibold`}>Always</span></h1>
          <p className={`w-[80%] mt-6 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
            At Avenza, we believe shopping should be simple, enjoyable, and accessible for everyone. We bring you a wide range of quality products across multiple categories — all at the best prices, delivered to your doorstep.
          </p>
          <button className="px-4 mt-6 py-3 rounded-lg border-2 border-[#ff498f] bg-[#ff619e] text-[#FFFFFF] font-medium text-sm flex items-center justify-center gap-1 hover:rounded-4xl transition-all durtion-700">
            <span>Explore Our Products</span>
            <FaChevronRight />
          </button>
        </div>
        <div className={`w-1/2`}>
          <img src="/productsSnap.png" alt="products snapshot" />
        </div>
      </section>

      <div className={`flex justify-between rounded-xl mt-4 py-8 px-15 ${isDark ? "border border-gray-800 shadow-[0_0px_10px_rgba(0,0,0,0.2)]" : "bg-white shadow-[0_0px_10px_rgba(0,0,0,0.1)]"}`}>
        <div className="flex items-center gap-4 w-fit">
          <span className={`p-3 rounded-full ${isDark ? "bg-rose-900/40 text-rose-600" : "bg-rose-100 text-rose-400"}`}>
            <HiOutlineShoppingBag size={38} />
          </span>
          <div>
            <h2 className={`text-3xl font-semibold ${isDark? "text-gray-200" : "text-gray-800"}`}>10K+</h2>
            <span className={`font-medium ${isDark? "text-gray-400" : "text-gray-600"}`}>Happy Customers</span>
          </div>
        </div>
        <div className={`h-14 w-fit border-r-2 ${isDark ? "border-gray-800" : "border-gray-100"}`}></div>
        <div className="flex items-center gap-4 w-fit">
          <span className={`p-3 rounded-full ${isDark ? "bg-purple-900/40 text-purple-600" : "bg-purple-100 text-purple-400"}`}>
            <LiaBoxSolid size={38} />
          </span>
          <div>
            <h2 className={`text-3xl font-semibold ${isDark? "text-gray-200" : "text-gray-800"}`}>20K+</h2>
            <span className={`font-medium ${isDark? "text-gray-400" : "text-gray-600"}`}>Products</span>
          </div>
        </div>
        <div className={`h-14 w-fit border-r-2 ${isDark ? "border-gray-800" : "border-gray-100"}`}></div>
        <div className="flex items-center gap-4 w-fit">
          <span className={`p-3 rounded-full ${isDark ? "bg-orange-900/40 text-orange-600" : "bg-orange-100 text-orange-400"}`}>
            <PiTruck size={38} />
          </span>
          <div>
            <h2 className={`text-3xl font-semibold ${isDark? "text-gray-200" : "text-gray-800"}`}>500+</h2>
            <span className={`font-medium ${isDark? "text-gray-400" : "text-gray-600"}`}>Orders Delivered Daily</span>
          </div>
        </div>
        <div className={`h-14 w-fit border-r-2 ${isDark ? "border-gray-800" : "border-gray-100"}`}></div>
        <div className="flex items-center gap-4 w-fit">
          <span className={`p-3 rounded-full ${isDark ? "bg-green-900/40 text-green-600" : "bg-green-100 text-green-400"}`}>
            <BsEmojiSmile size={38} />
          </span>
          <div>
            <h2 className={`text-3xl font-semibold ${isDark? "text-gray-200" : "text-gray-800"}`}>4.8/5</h2>
            <span className={`font-medium ${isDark? "text-gray-400" : "text-gray-600"}`}>Customer Rating</span>
          </div>
        </div>
      </div>

      {/* Story */}
      <section
        ref={story.ref}
        className="pt-10 grid md:grid-cols-2 gap-10"
      >
        <img
          src="/assets/workingPeoples.png"
          alt="story"
          className={`rounded-2xl shadow-lg w-full object-cover transition-all duration-900 ${ease}
          ${story.show
              ? "opacity-100 translate-x-0"
              : "opacity-0 -translate-x-16"
            }`}
        />

        <div
          className={`transition-all duration-900 flex flex-col justify-center ${ease}
          ${story.show
              ? "opacity-100 translate-x-0"
              : "opacity-0 translate-x-16"
            }`}
        >
          <h3 className={`text-[#ff619e] font-bold`}>OUR STORY</h3>
          <h1 className={`text-5xl max-w-md mt-2 font-semibold ${isDark ? "text-gray-100" : "text-gray-800"}`}>Built with Passion, Driven by <span className={`text-[#ff619e] font-semibold`}>You</span></h1>
          <p className={`w-[80%] mt-6 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
            Avenza was founded with a simple goal — to create a seamless online shopping experience that combines quality, affordability, and trust.
            <br />
            <br />
            From everyday essentials to special finds, we curate products that add value to your life. Your satisfaction inspires us to keep improving every day.
          </p>
        </div>
      </section>

      <section
        className={`py-10 px-6 backdrop-blur-3xl transition-all duration-900 ${ease}
        ${isDark ? "bg-white/5" : "bg-gray-100"} overflow-hidden mt-10`}
      >
        <div className="animate-scroll flex flex-row gap-6">
          {[...brands, ...brands].map((logo, idx) => (
            <div className="min-w-50 min-h-25 bg-white text-center gap-8 rounded-xl flex justify-center items-center cursor-pointer transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-md hover:shadow-black/6 shadow-black/2" key={idx}>
              <img src={logo} alt="brand" className=" object-contain bg-contain w-30" />
            </div>
          ))}
        </div>
      </section>

      {/* Cards */}

      <section className={`flex flex-col items-center rounded-xl mt-10 pt-3 pb-8 gap-4 px-8 border-2 ${isDark ? "bg-pink-600/10 border-pink-950" : "bg-rose-200/10 border-rose-100"}`}>
        <div>
          <h1 className="text-[#ff619e] font-semibold">WHAT WE STAND FOR</h1>
        </div>
        <div className="flex w-full items-center justify-between">
          <div className="flex flex-col justify-center  items-center gap-4 w-fit">
            <span className={`p-4 rounded-full ${isDark ? "bg-rose-900/40 text-rose-600" : "bg-rose-100 text-rose-400"}`}>
              <HiOutlineBadgeCheck size={30} />
            </span>
            <div className="flex flex-col justify-center items-center">
              <h2 className={`text-lg font-semibold ${isDark? "text-gray-100" : "text-gray-800"}`}>Quality Assured</h2>
              <span className={`font-medium text-center w-[75%] text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>We handpick quality products you can trust.</span>
            </div>
          </div>
          <div className={`h-35 w-fit border-r-2 ${isDark ? "border-pink-950" : "border-rose-100"}`} />
          <div className="flex flex-col justify-center items-center gap-4 w-fit">
            <span className={`p-4 rounded-full ${isDark ? "bg-purple-900/40 text-purple-600" : "bg-purple-100 text-purple-400"}`}>
              <IoPricetagOutline size={30} />
            </span>
            <div className="flex flex-col justify-center items-center">
              <h2 className={`text-lg font-semibold ${isDark? "text-gray-100" : "text-gray-800"}`}>Best Prices</h2>
              <span className={`font-medium text-center w-[75%] text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>Competitive prices & exclusive offers, always.</span>
            </div>
          </div>
          <div className={`h-35 w-fit border-r-2 ${isDark ? "border-pink-950" : "border-rose-100"}`}></div>
          <div className="flex flex-col justify-center items-center gap-4 w-fit">
            <span className={`p-4 rounded-full ${isDark ? "bg-orange-900/40 text-orange-600" : "bg-orange-100 text-orange-400"}`}>
              <PiTruck size={30} />
            </span>
            <div className="flex flex-col justify-center items-center">
              <h2 className={`text-lg font-semibold ${isDark? "text-gray-100" : "text-gray-800"}`}>Fast Delivery</h2>
              <span className={`font-medium text-center w-[75%] text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>Quick and reliable delivery to your doorstep.</span>
            </div>
          </div>
          <div className={`h-35 w-fit border-r-2 ${isDark ? "border-pink-950" : "border-rose-100"}`}></div>
          <div className="flex flex-col justify-center items-center gap-4 w-fit">
            <span className={`p-4 rounded-full ${isDark ? "bg-green-900/40 text-green-600" : "bg-green-100 text-green-400"}`}>
              <TfiHeadphoneAlt size={30} />
            </span>
            <div className="flex flex-col justify-center items-center">
              <h2 className={`text-lg font-semibold ${isDark? "text-gray-100" : "text-gray-800"}`}>Customer First</h2>
              <span className={`font-medium text-center w-[75%] text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>Our support team is always here for you.</span>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section
        ref={team.ref}
        className={`pt-10 px-6 transition-all duration-900 ${ease}
        ${team.show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
      >
        <div>
          <h1 className="text-[#ff619e] font-semibold text-center">MEET OUR TEAM</h1>
          <h1 className="text-3xl font-semibold text-center mt-2">The People Behind Avenza</h1>
        </div>

        <div className="max-w-6xl mx-auto grid sm:grid-cols-2 md:grid-cols-3 gap-8 mt-5">
          {[
            { name: "Kapil", role: "Founder" },
            { name: "Rahul", role: "Developer" },
            { name: "Anita", role: "Support" },
          ].map((member, i) => (
            <TeamMember
              key={i}
              {...member}
              index={i}
              show={team.show}
              isDark={isDark}
            />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section
        ref={cta.ref}
        className={`text-center px-15 pt-2 mt-10 rounded-xl border transition-all duration-900 flex justify-between items-center ${ease}
        ${cta.show ? "opacity-100 scale-100" : "opacity-0 scale-90"}
        ${isDark ? "" : "bg-pink-50 border-pink-200"}`}
      >
        <div className="flex gap-20 items-center">
          <img src="/shoppingBag.png" alt="shopping bag" width={80} className="opacity-80" />
          <div className="flex flex-col gap-1 text-start">
            <h1 className={`text-xl font-semibold`}>Ready to explore amazing products?</h1>
            <p className={`font-medium`}>Shop from thousands of products across multiple categories.</p>
          </div>
        </div>
        <button className="px-4 py-3 rounded-lg border-2 border-[#ff498f] bg-[#ff619e] text-[#FFFFFF] font-medium text-sm flex items-center justify-center gap-2 hover:rounded-4xl transition-all durtion-800">
          <span>Start Shopping</span>
          <FaChevronRight />
        </button>
      </section>
    </div>
  );
};

export default About;

/* ---------- Components ---------- */

const TeamMember = ({ name, role, isDark, show, index }) => (
  <div
    style={{
      transitionDelay: show ? `${index * 120}ms` : "0ms",
    }}
    onMouseEnter={(e) => (e.currentTarget.style.transitionDelay = "0ms")}
    className={`
      p-8 rounded-2xl text-center backdrop-blur-md border cursor-pointer
      transition-all duration-900 ease-[cubic-bezier(0.22,1,0.36,1)]
      hover:-translate-y-2 hover:scale-[1.03] shadow-[0_0px_8px_rgba(0,0,0,0.1)] will-change-transform
      ${isDark
        ? "bg-white/5 border-white/10 hover:shadow-purple-500/20"
        : "bg-white/40 border-gray-200 hover:border-[#ff619e] hover:shadow-pink-500/20"
      }
      ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}
    `}
  >
    <img
      src="https://img.freepik.com/premium-vector/person-with-blue-shirt-that-says-name-person_1029948-7040.jpg"
      alt={name}
      className="w-24 h-24 mx-auto rounded-full object-cover mb-4"
    />
    <h4 className="font-semibold text-lg">{name}</h4>
    <p className="text-gray-500 text-sm">{role}</p>
  </div>
);
