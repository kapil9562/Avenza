import React from 'react'
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";


import "swiper/css";
import "swiper/css/pagination";
import { useTheme } from '../../context/ThemeContext';

function HomeBanner() {

    const {isDark} = useTheme();

    const banners = [
        {
            id: 1,
            link: '/assets/banner1.png'
        },
        {
            id: 2,
            link: '/assets/banner2.png'
        },
        {
            id: 3,
            link: '/assets/banner3.jpg'
        }
    ];

    return (
        <>
            <Swiper
                modules={[Autoplay, Pagination]}
                speed={960}
                autoplay={{ delay: 4000 }}
                pagination={{ clickable: true }}
                loop
                className="overflow-hidden"
            >
                {banners.map((banner) => (
                    <SwiperSlide key={banner.id}>
                        <div
                            className={`flex justify-center items-center pb-10 lg:px-10 px-1 sm:px-5 cursor-grab active:cursor-grabbing`}
                        >
                            <div className="h-full w-full bg-center bg-cover flex justify-center items-center">
                                <img src={banner.link} alt='banner' className={`h-full w-full object-cover rounded-lg shadow-xl ${isDark ? "shadow-[#0F172A]" : "shadow-gray-400"}`}></img>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </>
    )
}

export default HomeBanner