import React from "react";
import { FaShippingFast, FaLock, FaHeadset } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";
import { useOutletContext } from "react-router-dom";
import useScrollReveal from "../utils/useScrollReveal";

const ease = "ease-[cubic-bezier(0.22,1,0.36,1)]";

const About = () => {
  const { isDark } = useTheme();
  const { scrollRef } = useOutletContext();

  const hero = useScrollReveal(scrollRef, 0.3);
  const story = useScrollReveal(scrollRef, 0.5);
  const cards = useScrollReveal(scrollRef, 0.3);
  const stats = useScrollReveal(scrollRef, 0.3);
  const team = useScrollReveal(scrollRef, 0.3);
  const cta = useScrollReveal(scrollRef, 0.3);

  const bgMain = isDark
    ? "bg-gradient-to-br from-[#020617] via-[#0F172A] to-slate-800"
    : "bg-gradient-to-br from-[#AAC4F580] to-[#FDCFFA80]";

  const textMain = isDark ? "text-gray-200" : "text-gray-700";
  const textSoft = isDark ? "text-gray-400" : "text-gray-600";

  return (
    <div className={`w-full min-h-screen ${bgMain} ${textMain}`}>
      {/* Hero */}
      <section
        ref={hero.ref}
        className={`py-24 px-6 text-center bg-white/6 transition-all duration-900 ${ease}
        ${
          hero.show
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-10"
        }`}
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-6">About Us</h1>
        <p className={`max-w-3xl mx-auto text-lg ${textSoft}`}>
          Welcome to our online shopping platform, your one-stop destination for
          quality products and seamless shopping experience.
        </p>
      </section>

      {/* Story */}
      <section
        ref={story.ref}
        className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-10 items-center"
      >
        <img
          src="/assets/story.png"
          alt="story"
          className={`rounded-2xl shadow-lg w-full object-cover transition-all duration-900 ${ease}
          ${
            story.show
              ? "opacity-100 translate-x-0"
              : "opacity-0 -translate-x-16"
          }`}
        />

        <div
          className={`transition-all duration-900 ${ease}
          ${
            story.show
              ? "opacity-100 translate-x-0"
              : "opacity-0 translate-x-16"
          }`}
        >
          <h2 className="text-3xl font-bold mb-4">Our Story</h2>
          <p className="mb-4">
            Started with a simple idea — to make online shopping easy,
            affordable, and reliable.
          </p>
          <p>Today, thousands of customers trust us for their daily needs.</p>
        </div>
      </section>

      {/* Cards */}
      <section
        ref={cards.ref}
        className="max-w-6xl mx-auto px-6 pb-20 grid md:grid-cols-3 gap-8"
      >
        {[
          {
            icon: <FaShippingFast />,
            title: "Fast Delivery",
            desc: "Quick and reliable shipping.",
          },
          {
            icon: <FaLock />,
            title: "Secure Payment",
            desc: "Safe and encrypted payments.",
          },
          {
            icon: <FaHeadset />,
            title: "24/7 Support",
            desc: "We’re always here to help.",
          },
        ].map((item, i) => (
          <GlassCard
            key={i}
            {...item}
            index={i}
            show={cards.show}
            isDark={isDark}
          />
        ))}
      </section>

      {/* Stats */}
      <section
        ref={stats.ref}
        className={`py-16 px-6 backdrop-blur-3xl transition-all duration-900 ${ease}
        ${isDark ? "bg-white/5" : "bg-gray-100/60"}
        ${stats.show ? "opacity-100 scale-100" : "opacity-0 scale-90"}`}
      >
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 text-center gap-8">
          <Stat number="50K+" label="Customers" />
          <Stat number="10K+" label="Products" />
          <Stat number="100+" label="Brands" />
          <Stat number="24/7" label="Support" />
        </div>
      </section>

      {/* Team */}
      <section
        ref={team.ref}
        className={`pt-10 px-6 transition-all duration-900 ${ease}
        ${team.show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
      >
        <h2 className="text-4xl font-bold text-center pb-12">Our Team</h2>

        <div className="max-w-6xl mx-auto grid sm:grid-cols-2 md:grid-cols-3 gap-8">
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
        className={`text-center pb-20 px-6 pt-20 transition-all duration-900 ${ease}
        ${cta.show ? "opacity-100 scale-100" : "opacity-0 scale-90"}`}
      >
        <h2 className="text-3xl font-bold mb-4">Start Shopping Today</h2>

        <button className="border-2 border-orange-500 text-orange-500 px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:bg-orange-500 hover:text-white hover:scale-105">
          Shop Now
        </button>
      </section>
    </div>
  );
};

export default About;

/* ---------- Components ---------- */

const GlassCard = ({ icon, title, desc, isDark, show, index }) => (
  <div
    style={{
      transitionDelay: show ? `${index * 120}ms` : "0ms",
    }}
    onMouseEnter={(e) => (e.currentTarget.style.transitionDelay = "0ms")}
    className={`
      p-8 rounded-2xl text-center backdrop-blur-md border cursor-pointer
      transition-all duration-900 ease-[cubic-bezier(0.22,1,0.36,1)]
      hover:-translate-y-2 hover:scale-[1.03]
      ${
        isDark
          ? "bg-white/5 border-white/10 shadow-lg hover:shadow-purple-500/20"
          : "bg-white/40 border-purple-300 shadow-lg hover:shadow-pink-500/20"
      }
      ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}
    `}
  >
    <div className="text-4xl text-orange-500 mb-4 flex justify-center">
      {icon}
    </div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className={`${isDark ? "text-gray-400" : "text-gray-600"}`}>
      {desc}
    </p>
  </div>
);

const Stat = ({ number, label }) => (
  <div>
    <h3 className="text-3xl font-bold text-orange-500">{number}</h3>
    <p className="text-gray-400">{label}</p>
  </div>
);

const TeamMember = ({ name, role, isDark, show, index }) => (
  <div
    style={{
      transitionDelay: show ? `${index * 120}ms` : "0ms",
    }}
    onMouseEnter={(e) => (e.currentTarget.style.transitionDelay = "0ms")}
    className={`
      p-8 rounded-2xl text-center backdrop-blur-md border cursor-pointer
      transition-all duration-900 ease-[cubic-bezier(0.22,1,0.36,1)]
      hover:-translate-y-2 hover:scale-[1.03]
      ${
        isDark
          ? "bg-white/5 border-white/10 shadow-lg hover:shadow-purple-500/20"
          : "bg-white/40 border-purple-300 shadow-lg hover:shadow-pink-500/20"
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
