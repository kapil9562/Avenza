import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { useNavigate, useOutletContext } from "react-router-dom";
import { FaChevronRight } from "react-icons/fa6";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { LiaBoxSolid } from "react-icons/lia";
import { PiTruck } from "react-icons/pi";
import { BsEmojiSmile } from "react-icons/bs";
import { HiOutlineBadgeCheck } from "react-icons/hi";
import { IoPricetagOutline } from "react-icons/io5";
import { TfiHeadphoneAlt } from "react-icons/tfi";
import { Breadcrumb } from "../components";

const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9 } },
};

const Container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.5,
    },
  },
};

const brands = [
  "https://www.shutterstock.com/image-vector/galati-romania-april-29-2023-600nw-2295394661.jpg",
  "https://1000logos.net/wp-content/uploads/2021/04/Nivea-logo.png",
  "https://mir-s3-cdn-cf.behance.net/projects/404/056c44149820671.Y3JvcCwyNjUzLDIwNzUsMTYyOCwyMzY.jpg",
  "https://thecapitalmall.com/wp-content/uploads/2025/02/mamaearth-Capital-Mall-Vasai.png",
  "https://vectorseek.com/wp-content/uploads/2023/08/Wild-Stone-Logo-Vector.svg-.png",
  "https://upload.wikimedia.org/wikipedia/commons/2/29/Vivo_Logo.svg",
  "https://cdn.shopify.com/s/files/1/0272/4714/9155/files/logo-aboutus.png?1207",
  "https://i.pinimg.com/736x/3d/c2/77/3dc277d9b7eae42cb4fbef1f05909e61.jpg"
];

const members = [
  { name: "Kapil Adhikari", role: "Founder & CEO", pfp: "/members/kapil.jpg" },
  { name: "Ayush Adhikari", role: "Product Manager", pfp: "/members/ayush.png" },
  { name: "Amit Adhikari", role: "Head of Operations", pfp: "/members/amit.png" },
  { name: "Sumit Adhikari", role: "Customer Experience Lead", pfp: "/members/sumit.jpg" },
];

const About = () => {
  const { isDark } = useTheme();
  const { setActiveTab } = useOutletContext();
  const navigate = useNavigate();

  useEffect(() => {
    setActiveTab("");
  }, []);

  return (
    <div className="w-full lg:min-h-[calc(100dvh-112px)] md:min-h-[calc(100dvh-80px)] min-h-[calc(100dvh-112px)] px-2 sm:px-5 lg:px-15 pb-10 pt-5 overflow-hidden">

      <Breadcrumb />

      {/* HERO */}
      <section className="flex lg:flex-row flex-col gap-10 sm:mt-6 mt-4">

        <motion.div
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="lg:w-1/2 sm:space-y-2 space-y-1"
        >
          <h3 className="text-[#ff619e] font-bold">ABOUT US</h3>

          <h1 className={`md:text-5xl text-3xl font-semibold ${isDark ? "text-gray-100" : "text-gray-800"}`}>
            Your Trusted Shopping Partner,
            <span className="text-[#ff619e] font-semibold"> Always</span>
          </h1>

          <p className={`sm:w-[80%] md:text-[16px] text-sm sm:mt-6 mt-2 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
            At Avenza, we believe shopping should be simple, enjoyable, and accessible for everyone. We bring you a wide range of quality products across multiple categories — all at the best prices, delivered to your doorstep.
          </p>

          <button
            className="px-4 sm:mt-6 mt-2 py-3 rounded-lg border-2 border-[#ff498f] bg-[#ff619e] text-[#FFFFFF] font-medium text-sm flex items-center justify-center gap-1 hover:rounded-4xl transition-all duration-500"
            onClick={() => {
              setActiveTab("HOME");
              navigate("/home");
            }}
          >
            <span>Explore Our Products</span>
            <FaChevronRight />
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="lg:w-1/2 w-full"
        >
          <img src="/productsSnap.png" alt="products snapshot" />
        </motion.div>

      </section>

      <StatsSection isDark={isDark} />

      {/* STORY */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="pt-10 grid md:grid-cols-2 gap-10"
      >

        <motion.img
          src="/assets/workingPeoples.png"
          alt="story"
          className="rounded-2xl shadow-lg w-full object-cover"
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        />

        <motion.div
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="flex flex-col justify-center"
        >
          <h3 className="text-[#ff619e] font-bold">OUR STORY</h3>

          <h1 className={`md:text-5xl text-3xl max-w-md mt-2 font-semibold ${isDark ? "text-gray-100" : "text-gray-800"}`}>
            Built with Passion, Driven by
            <span className="text-[#ff619e] font-semibold"> You</span>
          </h1>

          <p className={`sm:w-[80%] sm:mt-6 mt-2 md:text-[16px] text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
            Avenza was founded with a simple goal — to create a seamless online shopping experience that combines quality, affordability, and trust.
            <br />
            <br />
            From everyday essentials to special finds, we curate products that add value to your life. Your satisfaction inspires us to keep improving every day.
          </p>
        </motion.div>

      </motion.section>

      {/* BRANDS */}
      <section
        className={`md:py-10 py-4 px-6 transition-transform duration-900 overflow-hidden
        ${isDark ? "bg-white/5" : "bg-gray-100"} mt-10`}
      >
        <div className="animate-scroll flex flex-row gap-6">
          {[...brands, ...brands].map((logo, idx) => (
            <div className="md:min-w-50 min-w-30 md:min-h-25 min-h-15 bg-white text-center gap-8 rounded-xl flex justify-center items-center cursor-pointer transition-transform duration-300 hover:-translate-y-2 shadow-lg hover:shadow-md hover:shadow-black/6 shadow-black/2" key={idx}>
              <img src={logo} alt="brand" className=" object-contain bg-contain w-20 lg:w-30" />
            </div>
          ))}
        </div>
      </section>

      {/* Cards */}
      <section className={`flex flex-col items-center rounded-xl mt-10 pt-3 pb-8 gap-4 xl:px-8 lg:px-6 px-4 border-2 ${isDark ? "bg-pink-600/10 border-pink-950" : "bg-rose-200/10 border-rose-100"}`}>
        <div>
          <h1 className="text-[#ff619e] font-semibold text-center">WHAT WE STAND FOR</h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 w-full">

          {/* Card 1 */}
          <div className={`flex flex-col justify-center items-center gap-4 xl:px-6 px-4 py-6 xl:py-1 ${isDark ? "sm:border-r xl:border-r border-b sm:border-b xl:border-b-0 border-pink-950" : "sm:border-r xl:border-r border-b sm:border-b xl:border-b-0 border-rose-100"}`}>
            <span className={`p-4 rounded-full ${isDark ? "bg-rose-900/40 text-rose-600" : "bg-rose-100 text-rose-400"}`}>
              <HiOutlineBadgeCheck size={30} />
            </span>

            <div className="flex flex-col justify-center items-center">
              <h2 className={`text-lg font-semibold ${isDark ? "text-gray-100" : "text-gray-800"}`}>
                Quality Assured
              </h2>

              <span className={`font-medium text-center xl:w-[75%] w-full text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                We handpick quality products you can trust.
              </span>
            </div>
          </div>

          {/* Card 2 */}
          <div className={`flex flex-col justify-center items-center gap-4 xl:px-6 px-4 py-6 xl:py-1 ${isDark ? "xl:border-r border-b sm:border-b xl:border-b-0 border-pink-950" : "xl:border-r border-b sm:border-b xl:border-b-0 border-rose-100"}`}>
            <span className={`p-4 rounded-full ${isDark ? "bg-purple-900/40 text-purple-600" : "bg-purple-100 text-purple-400"}`}>
              <IoPricetagOutline size={30} />
            </span>

            <div className="flex flex-col justify-center items-center">
              <h2 className={`text-lg font-semibold ${isDark ? "text-gray-100" : "text-gray-800"}`}>
                Best Prices
              </h2>

              <span className={`font-medium text-center xl:w-[75%] w-full text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                Competitive prices & exclusive offers, always.
              </span>
            </div>
          </div>

          {/* Card 3 */}
          <div className={`flex flex-col justify-center items-center gap-4 xl:px-6 px-4 py-6 xl:py-1 ${isDark ? "sm:border-r xl:border-r border-pink-950" : "sm:border-r xl:border-r border-b sm:border-b-0 border-rose-100"}`}>
            <span className={`p-4 rounded-full ${isDark ? "bg-orange-900/40 text-orange-600" : "bg-orange-100 text-orange-400"}`}>
              <PiTruck size={30} />
            </span>

            <div className="flex flex-col justify-center items-center">
              <h2 className={`text-lg font-semibold ${isDark ? "text-gray-100" : "text-gray-800"}`}>
                Fast Delivery
              </h2>

              <span className={`font-medium text-center xl:w-[75%] w-full text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                Quick and reliable delivery to your doorstep.
              </span>
            </div>
          </div>

          {/* Card 4 */}
          <div className="flex flex-col justify-center items-center gap-4 xl:px-6 px-4 py-6 xl:py-1">
            <span className={`p-4 rounded-full ${isDark ? "bg-green-900/40 text-green-600" : "bg-green-100 text-green-400"}`}>
              <TfiHeadphoneAlt size={30} />
            </span>

            <div className="flex flex-col justify-center items-center">
              <h2 className={`text-lg font-semibold ${isDark ? "text-gray-100" : "text-gray-800"}`}>
                Customer First
              </h2>

              <span className={`font-medium text-center xl:w-[75%] w-full text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                Our support team is always here for you.
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* TEAM */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="pt-10"
      >

        <div>
          <h1 className="text-[#ff619e] font-semibold text-center">
            MEET OUR TEAM
          </h1>

          <h1 className={`text-3xl font-semibold text-center mt-2 ${isDark ? "text-gray-100" : "text-gray-800"}`}>
            The People Behind Avenza
          </h1>
        </div>

        <motion.div
          variants={Container}
          initial="hidden"
          animate="show"
          className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 mt-5">
          {members.map((member, i) => (
            <TeamMember
              key={i}
              {...member}
              index={i}
              isDark={isDark}
            />
          ))}
        </motion.div>

      </motion.section>

      {/* CTA */}
      <motion.section
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className={`text-center px-4 sm:px-6 lg:px-12 py-5 sm:pb-0 sm:pt-2 mt-10 rounded-2xl border flex flex-col sm:flex-row gap-5 lg:gap-0 justify-between items-center ${isDark ? "bg-pink-900/40 border-pink-700" : "bg-pink-50 border-pink-200"}`}
      >

        <div className="flex items-start sm:items-center gap-3 sm:gap-5 lg:gap-10 w-full lg:w-auto">
          <img src="/shoppingBag.png" alt="shopping bag" className="w-10 sm:w-14 lg:w-20 shrink-0" />

          <div className="flex flex-col gap-1 text-left">
            <h1 className={`text-sm sm:text-lg lg:text-xl font-semibold leading-snug ${isDark ? "text-gray-200" : "text-gray-800"}`}>
              Ready to explore amazing products?
            </h1>

            <p className={`text-xs sm:text-sm lg:text-base font-medium leading-relaxed ${isDark ? "text-gray-400" : "text-gray-500"}`}>
              Shop from thousands of products across multiple categories.
            </p>
          </div>
        </div>

        <button
          className="w-full sm:w-auto px-5 py-3 rounded-xl border-2 border-[#ff498f] bg-[#ff619e] text-white font-medium text-sm flex items-center justify-center gap-2 hover:rounded-4xl transition-[border-radius] duration-500 whitespace-nowrap"
          onClick={() => {
            setActiveTab("HOME");
            navigate("/home");
          }}
        >
          <span>Start Shopping</span>
          <FaChevronRight />
        </button>

      </motion.section>

    </div>
  );
};

export default About;

const TeamMember = ({ name, role, pfp, isDark, index }) => (

  <motion.div
    variants={fadeInUp}
    className={`
      p-8 rounded-2xl text-center border cursor-pointer hover:-translate-y-2 transition-all duration-500
      ${isDark
        ? "bg-[#0F172A] border-gray-800 hover:border-[#b361ff] hover:shadow-purple-500/40 shadow-[0_0px_10px_rgba(0,0,0,0.2)]"
        : "bg-white/40 border-gray-200 hover:border-[#ff619e] hover:shadow-pink-500/40 shadow-[0_0px_10px_rgba(0,0,0,0.1)]"
      }
    `}
  >
    <img
      src={pfp}
      alt={name}
      className="w-24 h-24 mx-auto rounded-full object-cover mb-4"
    />

    <h4 className={`font-semibold text-lg ${isDark ? "text-gray-100" : "text-gray-800"}`}>
      {name}
    </h4>

    <p className={`text-sm font-medium ${isDark ? "text-gray-400" : "text-gray-500"}`}>
      {role}
    </p>
  </motion.div>
);

const statsData = [
  {
    id: 1,
    title: "10K+",
    subtitle: "Happy Customers",
    icon: <HiOutlineShoppingBag />,
    light: "bg-rose-100 text-rose-400",
    dark: "bg-rose-900/40 text-rose-600",
  },
  {
    id: 2,
    title: "20K+",
    subtitle: "Products",
    icon: <LiaBoxSolid />,
    light: "bg-purple-100 text-purple-400",
    dark: "bg-purple-900/40 text-purple-600"
  },
  {
    id: 3,
    title: "500+",
    subtitle: "Orders Delivered Daily",
    icon: <PiTruck />,
    light: "bg-orange-100 text-orange-400",
    dark: "bg-orange-900/40 text-orange-600"
  },
  {
    id: 4,
    title: "4.8/5",
    subtitle: "Customer Rating",
    icon: <BsEmojiSmile />,
    light: "bg-green-100 text-green-400",
    dark: "bg-green-900/40 text-green-600"
  },
];

const StatsSection = ({ isDark }) => {
  return (
    <div
      className={`mt-4 rounded-2xl overflow-hidden grid grid-cols-2 xl:grid-cols-4 ${isDark
        ? "border border-gray-800 shadow-[0_0px_10px_rgba(0,0,0,0.2)]"
        : "bg-white shadow-[0_0px_10px_rgba(0,0,0,0.1)]"
        }`}
    >
      {statsData?.map((stat, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.5,
            delay: i * 0.1
          }}
          className={`flex xl:justify-center items-center gap-3 xl:gap-4 xl:px-8 lg:px-6 px-4 xl:py-8 lg:py-6 py-5 ${isDark ? "border-r border-gray-800" : "border-r border-gray-100"} ${i < 2 ? isDark ? "border-b border-gray-800 xl:border-b-0" : "border-b border-gray-100 xl:border-b-0" : ""}`}
        >
          <div
            className={`flex items-center justify-center xl:w-16 xl:h-16 lg:w-14 lg:h-14 w-12 h-12 rounded-full shrink-0 ${isDark ? stat?.dark : stat?.light}`}
          >
            <div className="xl:text-3xl lg:text-2xl text-xl">
              {stat.icon}
            </div>
          </div>

          <div className="flex flex-col min-w-0">
            <h2
              className={`xl:text-3xl lg:text-2xl text-lg font-bold leading-tight ${isDark ? "text-white" : "text-gray-900"}`}
            >
              {stat?.title}
            </h2>

            <span
              className={`xl:text-[16px] text-xs font-medium mt-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}
            >
              {stat?.subtitle}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
};