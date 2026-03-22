import React from 'react'
import { IoLocationSharp } from "react-icons/io5";
import { FaInstagram, FaWhatsapp, FaGithub, FaLinkedinIn, FaArrowRight } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

function Hero() {
    const navigate = useNavigate();
    return (
        <section className="relative z-0 overflow-hidden bg-gradient-to-br from-[#fff1eb] via-[#ffd1dc] to-[#ffb38a] min-h-dvh flex items-center flex-col">
            <div className="absolute top-[-80px] left-[-60px] w-72 h-72 bg-orange-400/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-[-100px] right-[-60px] w-80 h-80 bg-pink-400/30 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-rose-300/20 rounded-full blur-3xl"></div>


            <header className='h-[10dvh] flex flex-row justify-between items-center w-full px-10'>
                {/* LOGO */}
                <div className='cursor-pointer flex justify-center items-center relative z-0'>
                    <img src='/assets/logo.png' alt="logo" className='sm:w-40 w-25 object-cover' />
                </div>

                <div className='font-semibold font-mono tracking-widest flex flex-row items-center justify-center h-full text-gray-800'>
                    <div className='px-4 cursor-pointer text-center flex justify-center items-center pt-4 h-full relative group' onClick={() => navigate("home")}>
                        <span className='relative z-1'>HOME</span>
                        <div className='absolute top-0 left-0 h-0 group-hover:h-full w-full bg-[#efb48b] z-0 transition-[height] duration-300 group-hover:border-b-2 border-[#f38b41] transform-gpu will-change-transform'></div>
                    </div>
                    <div className='px-4 cursor-pointer text-center flex justify-center items-center pt-4 h-full relative group' onClick={() => navigate("about")}>
                        <span className='relative z-1'>ABOUT</span>
                        <div className='absolute top-0 left-0 h-0 group-hover:h-full w-full bg-[#efb48b] z-0 transition-[height] duration-300 group-hover:border-b-2 border-[#f38b41] transform-gpu will-change-transform'></div>
                    </div>
                    <div className='px-4 cursor-pointer text-center flex justify-center items-center pt-4 h-full relative group' onClick={() => navigate("home")}>
                        <span className='relative z-1'>CONTACT</span>
                        <div className='absolute top-0 left-0 h-0 group-hover:h-full w-full bg-[#efb48b] z-0 transition-[height] duration-300 group-hover:border-b-2 border-[#f38b41] transform-gpu will-change-transform'></div>
                    </div>
                </div>

                <div>
                    <button
                        className="px-6 py-3 rounded-xl hover:rounded-4xl bg-[#efb48b] text-white/80 font-semibold shadow-md hover:shadow-lg active:scale-95 transition-all duration-300 cursor-pointer"
                        onClick={() => navigate("home")}
                    >
                        Get Started
                    </button>
                </div>
            </header>
            <main className='md:h-[75dvh] w-full flex md:flex-row flex-col justify-center items-center px-20 lg:px-0'>

                <div className='relative w-[40%] flex justify-center items-center flex-col'>
                    <div>
                        <div className='relative'>
                            <span className='lg:text-4xl md:text-3xl text-4xl font-extralight font-xplor'>NEW ARRIVALS</span>
                            <h1 className='xl:text-9xl lg:text-8xl md:text-7xl text-9xl font-extrabold font-[Montserrat] leading-[0.9]'>JUST<br />FOR</h1>
                            <span className='xl:text-9xl lg:text-8xl md:text-7xl text-9xl absolute -bottom-6 lg:-bottom-10 flex -rotate-15 font-medium font-[playlistScript] ml-15 lg:ml-20 text-[#EC9453]'>you</span>
                        </div>
                        <button
                            className="w-full px-6 py-4 rounded-xl hover:rounded-4xl bg-[#efb48b] text-white/80 font-semibold shadow-md hover:shadow-lg active:scale-95 transition-all duration-300 cursor-pointer lg:mt-25 mt-15 mt-20 flex flex-row gap-2 justify-center items-center text-lg"
                            onClick={() => navigate("home")}
                        >
                            <span>Get Started</span>
                            <FaArrowRight />
                        </button>
                    </div>
                </div>

                <div className='h-full w-fit'>
                    <img src="/heroImg.png" alt="img" className='h-full w-fit object-contain' />
                </div>

                <div className='flex flex-col justify-center items-center gap-5 w-[40%]'>
                    <div className='flex flex-col items-end ont-[Montserrat] relative z-0'>
                        <span className='font-bold lg:text-4xl md:text-3xl text-4xl'>FOR</span>
                        <h1 className='font-bold lg:text-6xl md:text-5xl text-6xl'>ONLINE</h1>
                        <span className='font-bold lg:text-4xl md:text-3xl text-4xl'>ORDER</span>
                        <div className='w-[250px] h-[250px] absolute bg-[#ffb38a80] rounded-full -z-10 -right-50 -top-15'></div>
                    </div>
                    <div className='border-b-2 border-t-2 border-black text-[#EC9453] font-[Montserrat] font-bold w-fit text-center lg:text-8xl md:text-6xl text-8xl'>
                        <h1>30%</h1>
                        <h1>OFF</h1>
                    </div>
                </div>
            </main>
            <footer className='flex flex-row justify-between w-full items-center px-10 h-[10dvh]'>
                <div className='flex flex-row'>
                    <IoLocationSharp className='text-4xl text-[#EC9453]' />
                    <div className='flex flex-col font-semibold leading-[1.2] font-mono tracking-wider'>
                        <span>UTTARAKHAND, INDIA</span>
                        <span>DHARANAULA ROAD, ALMORA, 263601</span>
                    </div>
                </div>
                <div className='flex flex-col relative z-0 gap-2 items-end mb-8'>
                    <div className='flex flex-row gap-2'>
                        <div className='h-10 w-10 flex justify-center items-center rounded-full cursor-pointer hover:-translate-y-1 transition-transform duration-300 bg-[#EC9453]'>
                            <FaInstagram className='text-2xl text-white' />
                        </div>
                        <div className='h-10 w-10 flex justify-center items-center rounded-full cursor-pointer hover:-translate-y-1 transition-transform duration-300 bg-[#EC9453]'>
                            <FaLinkedinIn className='text-2xl text-white' />
                        </div>
                        <div className='h-10 w-10 flex justify-center items-center rounded-full cursor-pointer hover:-translate-y-1 transition-transform duration-300 bg-[#EC9453]'>
                            <FaGithub className='text-2xl text-white' />
                        </div>
                        <div className='h-10 w-10 flex justify-center items-center rounded-full cursor-pointer hover:-translate-y-1 transition-transform duration-300 bg-[#EC9453]'>
                            <FaWhatsapp className='text-2xl text-white' />
                        </div>
                    </div>
                    <span className='font-semibold leading-[1.2] font-mono tracking-wider'>DHARANAULA ROAD, ALMORA, 263601</span>
                </div>
            </footer>
        </section>
    )
}

export default Hero 