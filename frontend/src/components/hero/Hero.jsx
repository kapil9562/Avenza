import React, { useEffect, useRef, useState } from 'react'
import { IoLocationSharp } from "react-icons/io5";
import { FaInstagram, FaWhatsapp, FaGithub, FaLinkedinIn, FaArrowRight } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react';
import menuBar from '../../assets/menu.json';

function Hero() {
    const navigate = useNavigate();
    const openWhatsApp = () => {
        const phone = "918791029562";
        const message = "Hello Kapil!";
        window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, "_blank");
    };

    const [isOpen, setIsOpen] = useState(false);
    const lottieRef = useRef(null);
    const [isAnimating, setIsAnimating] = useState(false);

    const STOP_FRAME = 35;

    useEffect(() => {
        // initial state
        lottieRef.current?.goToAndStop(0, true);
    }, []);

    const handleClick = () => {
        if (!lottieRef.current || isAnimating) return;

        setIsAnimating(true);

        if (!isOpen) {
            // OPEN: 0 -> 35
            lottieRef.current.goToAndStop(0, true);
            lottieRef.current.playSegments([0, STOP_FRAME], true);
            setIsOpen(true);
        } else {
            // CLOSE: 35 -> 0
            lottieRef.current.goToAndStop(STOP_FRAME, true);
            lottieRef.current.playSegments([STOP_FRAME, 0], true);
            setIsOpen(false);
        }
    };

    const handleComplete = () => {
        if (isOpen) {
            lottieRef.current?.goToAndStop(STOP_FRAME, true);
        } else {
            lottieRef.current?.goToAndStop(0, true);
        }
        setIsAnimating(false);
    };

    return (
        <div className='h-dvh overflow-y-auto custom-scroll scroll-smooth bg-linear-to-br from-[#fff7fb] via-[#f9d9e9] to-[#e8dcff] relative z-0 overflow-x-hidden'>
            <div className="absolute -top-20 -left-15 w-72 h-72 bg-[#f3a4c7]/30 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0  w-80 h-80 bg-[#c7b6ff]/30 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-100 h-100 bg-[#f8c7dd]/20 rounded-full blur-3xl"></div>

            <header className='h-[8dvh] md:h-[10dvh] sticky top-0 z-99 animate-fadeDown'>
                <nav className='h-full w-full flex flex-row justify-between items-center md:px-10 px-5 md:border-b-0  border-b-2 border-pink-200 backdrop-blur-2xl'>
                    {/* LOGO */}
                    <div className='cursor-pointer flex justify-center items-center relative z-0'>
                        <img src='/assets/logo.png' alt="logo" className='md:w-40 w-30 object-cover' />
                    </div>

                    <div className='font-semibold font-mono tracking-widest flex-row items-center justify-center h-full text-gray-800 md:flex hidden'>
                        <div className='px-4 cursor-pointer text-center flex justify-center items-center pt-4 h-full relative group' onClick={() => navigate("/home")}>
                            <span className='relative z-1'>HOME</span>
                            <div className='absolute top-0 left-0 h-0 group-hover:h-full w-full bg-[#FF6F61] border-[#ff3e2d] z-0 transition-[height] duration-300 group-hover:border-b-2 transform-gpu will-change-transform'></div>
                        </div>
                        <div className='px-4 cursor-pointer text-center flex justify-center items-center pt-4 h-full relative group' onClick={() => navigate("/about")}>
                            <span className='relative z-1'>ABOUT</span>
                            <div className='absolute top-0 left-0 h-0 group-hover:h-full w-full bg-[#FF6F61] border-[#ff3e2d] z-0 transition-[height] duration-300 group-hover:border-b-2 transform-gpu will-change-transform'></div>
                        </div>
                        <div className='px-4 cursor-pointer text-center flex justify-center items-center pt-4 h-full relative group' onClick={() => navigate("/home")}>
                            <span className='relative z-1'>CONTACT</span>
                            <div className='absolute top-0 left-0 h-0 group-hover:h-full w-full bg-[#FF6F61] border-[#ff3e2d] z-0 transition-[height] duration-300 group-hover:border-b-2 transform-gpu will-change-transform'></div>
                        </div>
                    </div>

                    <div className='space-x-4 md:flex flex-row hidden'>
                        <button className='text-gray-800 cursor-pointer font-bold font-[Nunito] hover:text-orange-400 transition-colors duration-200'>
                            Sign in
                        </button>
                        <button
                            className="px-5 py-2 rounded-xl hover:rounded-4xl bg-[#FF6F61] border-[#ff3e2d] border-2 text-white/80 font-medium shadow-md hover:shadow-lg active:scale-95 transition-all duration-300 cursor-pointer font-[Sour_Gummy]"
                            onClick={() => navigate("/home")}
                        >
                            Get Started
                        </button>
                    </div>
                    <div className='cursor-pointer relative md:hidden' onClick={() => {
                        handleClick();
                    }}>
                        <Lottie
                            animationData={menuBar}
                            className='h-8 w-8 hue-rotate-50'
                            loop={false}
                            autoplay={false}
                            lottieRef={lottieRef}
                            onComplete={handleComplete}
                        />
                    </div>
                </nav>

                <ul className={`rounded-xl absolute right-5 top-full border-2 border-pink-200 justify-center items-start text-[16px] flex-col text-gray-700 shadow-md z-99 bg-pink/20 backdrop-blur-xl w-50 md:hidden flex overflow-hidden ${isOpen ? "opacity-100 scale-100 visible" : "opacity-0 scale-60 invisible"} transition-all origin-top-right duration-500`}>
                    <div className='w-full hover:text-orange-500 active:bg-pink-200 transition-colors duration-150'
                        onClick={() => {
                            handleClick();
                            navigate("/home");
                        }}>
                        <li className="w-full cursor-pointer pt-2 pb-2 border-b-2 border-b-pink-200 px-4">
                            <a
                                className={
                                    `h-full w-full font-medium`
                                }
                            >
                                HOME
                            </a>
                        </li>
                    </div>
                    <div className='w-full hover:text-orange-500 active:bg-pink-200 transition-colors duration-150'
                        onClick={() => {
                            handleClick();
                            navigate("/about");
                        }}>
                        <li className="w-full cursor-pointer pt-2 pb-2 border-b-2 border-b-pink-200 px-4">
                            <a
                                className={
                                    `h-full w-full font-medium`
                                }
                            >
                                ABOUT
                            </a>
                        </li>
                    </div>
                    <div className='w-full hover:text-orange-500 active:bg-pink-200 transition-colors duration-150'
                        onClick={() => {
                            handleClick();
                            navigate("/home");
                        }}>
                        <li className="w-full cursor-pointer pt-2 pb-2 px-4">
                            <a
                                className={
                                    `h-full w-full font-medium`
                                }
                            >
                                CONTACT
                            </a>
                        </li>
                    </div>
                </ul>
            </header>

            <section className="overflow-hidden relative z-0  min-h-[90dvh] flex items-center flex-col justify-between">

                <main className='md:h-[75dvh] w-full flex md:flex-row flex-col justify-center items-center md:px-20 lg:px-0 px-10 py-5 md:py-0'>

                    <div className='animate-fadeRight relative md:w-[40%] flex justify-center md:items-center flex-col w-full z-2'>
                        <div className=''>
                            <div className='relative'>
                                <span className='lg:text-4xl md:text-3xl text-xl font-extralight font-xplor'>NEW ARRIVALS</span>
                                <h1 className='xl:text-9xl lg:text-8xl text-6xl font-extrabold font-[Montserrat] leading-[0.9]'>JUST<br />FOR</h1>
                                <span className='xl:text-9xl lg:text-8xl text-6xl absolute md:-bottom-6 -bottom-5 lg:-bottom-10 flex -rotate-15 font-medium font-[playlistScript] ml-15 lg:ml-20 text-[#FF6F61]'>you</span>
                            </div>
                            <button
                                className="md:w-full px-6 py-3 rounded-xl hover:rounded-4xl bg-[#FF6F61] border-[#ff3e2d] border-2 text-white/80 font-medium shadow-md hover:shadow-lg active:scale-95 transition-all duration-300 cursor-pointer lg:mt-25 mt-15 flex flex-row gap-2 justify-center items-center text-lg font-[Sour_Gummy]"
                                onClick={() => navigate("home")}
                            >
                                <span>Get Started</span>
                                <FaArrowRight />
                            </button>
                        </div>
                    </div>

                    <div className='animate-fadeIn h-full w-fit relative z-0'>
                        <img src="/heroImg.webp" alt="img" className='md:h-full h-100 w-fit object-contain' />

                        <div className='flex-col justify-center items-center gap-5 w-[40%] flex md:hidden absolute sm:-right-20 -right-5 top-1/2 -translate-y-1/2'>
                            <div className='flex flex-col items-end font-[Montserrat] relative z-0'>
                                <span className='font-bold text-2xl'>FOR</span>
                                <h1 className='font-bold text-4xl'>ONLINE</h1>
                                <span className='font-bold text-2xl'>ORDER</span>

                            </div>
                            <div className='border-b-2 border-t-2 border-black text-[#EC9453] font-[Montserrat] font-bold w-fit text-center text-6xl'>
                                <h1>30%</h1>
                                <h1>OFF</h1>
                            </div>
                        </div>
                        <div className='w-60 h-60 absolute bg-[#FF6F6180] rounded-full -z-10 -right-25 -top-15 md:hidden'></div>
                    </div>

                    <div className='flex-col animate-fadeLeft justify-center items-center gap-5 w-[40%] hidden md:flex'>
                        <div className='flex flex-col items-end ont-[Montserrat] relative z-0'>
                            <span className='font-bold lg:text-4xl md:text-3xl text-4xl'>FOR</span>
                            <h1 className='font-bold lg:text-6xl md:text-5xl text-6xl'>ONLINE</h1>
                            <span className='font-bold lg:text-4xl md:text-3xl text-4xl'>ORDER</span>
                            <div className='w-[250px] h-[250px] absolute bg-[#FF6F6180] rounded-full -z-10 -right-50 -top-15'></div>
                        </div>
                        <div className='border-b-2 border-t-2 border-black text-[#FF6F61] font-[Montserrat] font-bold w-fit text-center lg:text-8xl md:text-6xl text-8xl'>
                            <h1>30%</h1>
                            <h1>OFF</h1>
                        </div>
                    </div>
                </main>
                <footer className='w-full flex flex-col justify-center items-center pb-10 md:pb-0 gap-4 animate-fadeUp2'>
                    <div className='flex flex-row justify-between w-full items-center md:px-10 px-5 h-[10dvh] gap-4'>
                        <div className='flex flex-row hover:underline cursor-pointer' onClick={() => window.open("https://www.google.com/maps/search/?api=1&query=DHARANAULA+ROAD%2C+ALMORA%2C+UTTARAKHAND%2C+INDIA+263601")}>
                            <IoLocationSharp className='text-4xl text-[#FF6F61]' />
                            <div className='flex flex-col font-semibold leading-[1.2] font-sans tracking-wider'>
                                <span>UTTARAKHAND, INDIA</span>
                                <span>DHARANAULA ROAD, ALMORA, 263601</span>
                            </div>
                        </div>
                        <div className='flex flex-col relative z-0 gap-2 items-end md:mb-8'>
                            <div className='flex flex-row gap-2'>
                                <div className='h-10 w-10 flex justify-center items-center rounded-full cursor-pointer hover:-translate-y-1 transition-transform duration-300 bg-[#FF6F61]' onClick={() => window.open("https://www.instagram.com/kapil_art_official")}>
                                    <FaInstagram className='text-2xl text-white' />
                                </div>
                                <div className='h-10 w-10 flex justify-center items-center rounded-full cursor-pointer hover:-translate-y-1 transition-transform duration-300 bg-[#FF6F61]' onClick={() => window.open("https://www.linkedin.com/in/kapil-adhikari9562")}>
                                    <FaLinkedinIn className='text-2xl text-white' />
                                </div>
                                <div className='h-10 w-10 flex justify-center items-center rounded-full cursor-pointer hover:-translate-y-1 transition-transform duration-300 bg-[#FF6F61]' onClick={() => window.open("https://github.com/kapil9562")}>
                                    <FaGithub className='text-2xl text-white' />
                                </div>
                                <div className='h-10 w-10 flex justify-center items-center rounded-full cursor-pointer hover:-translate-y-1 transition-transform duration-300 bg-[#FF6F61]' onClick={openWhatsApp}>
                                    <FaWhatsapp className='text-2xl text-white' />
                                </div>
                            </div>
                            <span className='font-normal leading-[1.2] font-sans text-gray-700 md:flex hidden'>© Avenza {new Date().getFullYear()}. All rights reserved.</span>
                        </div>
                    </div>
                    <span className='font-normal leading-[1.2] font-mono text-gray-700 md:hidden'>© Avenza {new Date().getFullYear()}. All rights reserved.</span>
                </footer>
            </section>
        </div>
    )
}

export default Hero 