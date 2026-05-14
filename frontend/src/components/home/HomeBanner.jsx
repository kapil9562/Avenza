import React from 'react'
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";


import "swiper/css";
import "swiper/css/pagination";
import { useTheme } from '../../context/ThemeContext';
import { useProducts } from '../../context/ProductsContext';
import { useNavigate, useOutletContext } from 'react-router-dom';

function HomeBanner() {

    const { categories, setCategories, setCache } = useProducts();
    const { isDark } = useTheme();
    const navigate = useNavigate();

    const banners = [
        {
            id: 1,
            link: '/assets/banner1.webp'
        },
        {
            id: 2,
            link: '/assets/banner2.webp'
        },
        {
            id: 3,
            link: '/assets/banner3.webp'
        }
    ];

    const cards = [
        {
            title: "DRESS & FROCK",
            category: "womens-dresses",
            image: "/assets/icons/dress.svg"
        },
        {
            title: "Winter wear",
            category: "mens-shirts",
            image: "/assets/icons/coat.svg"
        },
        {
            title: "Glasses & lens",
            category: "sunglasses",
            image: "/assets/icons/glasses.svg"
        },
        {
            title: "Shorts & jeans",
            category: "tops",
            image: "/assets/icons/shorts.svg"
        },
        {
            title: "T-shirts",
            category: "mens-T-Shirts",
            image: "/assets/icons/tee.svg"
        },
        {
            title: "Jacket",
            category: "mens-jacket",
            image: "/assets/icons/jacket.svg"
        },
        {
            title: "Watch",
            category: "mens-watches",
            image: "/assets/icons/watch.svg"
        },
        {
            title: "bags",
            category: "womens-bags",
            image: "/assets/icons/bag.svg"
        },
    ]

    const getChildItems = (childName) => {
        for (const parent of categories || []) {
            const child = parent.categories?.find(
                (c) => c.name === childName
            );

            if (child) {
                return child.totalItems;
            }
        }

        return 0;
    };

    const { activeTab, setActiveTab } = useOutletContext();

    const handleTabClick = (tab, pCategory) => {
        if (tab === activeTab) return;

        setCache({});
        setActiveTab(tab);

        if (tab === "HOME") {
            navigate("/home");
            return;
        }

        navigate(`/${pCategory}/${tab}`);
    };

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
                                <img src={banner.link} alt='banner' className={`h-full w-full object-cover rounded-lg`} />
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
            <div className='lg:px-10 px-1 sm:px-5'>
                <div className='flex gap-4 overflow-x-auto has-scrollbar snap-x snap-mandatory scroll-smooth'>

                    {cards?.map((card, idx) => (
                        <div
                            key={idx}
                            className='snap-start flex border border-gray-200 p-4 rounded-xl gap-2 min-w-full sm:min-w-[calc(50%-8px)] lg:min-w-[calc(33.33%-11px)] xl:min-w-[calc(25%-12px)]'
                        >
                            <div className='bg-[#EDEDED] border border-gray-300 rounded-md items-center flex min-h-13 min-w-13 justify-center'>
                                <img
                                    src={card?.image}
                                    alt="dress"
                                    height={30}
                                    width={30}
                                />
                            </div>

                            <div className='flex flex-col justify-between w-full'>
                                <div className='flex justify-between gap-2'>
                                    <span className='text-[#212121] font-semibold whitespace-nowrap'>
                                        {card?.title}
                                    </span>

                                    <span className='text-sm text-[#787878]'>
                                        {getChildItems(card?.category)}
                                    </span>
                                </div>

                                <button className='text-sm text-orange-500 font-medium cursor-pointer text-start'
                                onClick={() => handleTabClick(card?.category, card?.title.replaceAll(" ", "").toLowerCase())}>
                                    Show All
                                </button>
                            </div>
                        </div>
                    ))}

                </div>
            </div>
        </>
    )
}

export default HomeBanner