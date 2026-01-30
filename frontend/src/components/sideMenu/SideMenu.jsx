import React, { useEffect, useRef, useState } from 'react'
import { useTheme } from '../../context/ThemeContext';
import logo from '../../assets/logo.png';
import { RxCross2 } from "react-icons/rx";
import { IoHome } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../../context/ProductsContext';
import { FaMagic, FaCar } from "react-icons/fa";
import { MdDevices, MdOutlineChair } from "react-icons/md";
import { GiClothes } from "react-icons/gi";
import { HiOutlineShoppingBag } from "react-icons/hi";
import { FcBusinessman, FcBusinesswoman, FcSportsMode } from "react-icons/fc";
import { IoIosArrowUp } from "react-icons/io";
import { FiSidebar } from "react-icons/fi";
import { TbLayoutSidebarRightExpandFilled } from "react-icons/tb";


function SideMenu({ setShow, show, setActiveTab, activeTab }) {

    const { isDark } = useTheme();

    const backdropRef = useRef(null);
    const navigate = useNavigate();

    const { categories } = useProducts();
    const [currentIdx, setCurrentIdx] = useState(null);

    const categoryIcons = [
        {
            Icon: FaMagic,
            color: "#ec4899",
        },
        {
            Icon: MdDevices,
            color: "#3b82f6",
        },
        {
            Icon: GiClothes,
            color: "#a855f7",
        },
        {
            Icon: HiOutlineShoppingBag,
            color: "#f97316",
        },
        {
            Icon: MdOutlineChair,
            color: "#22c55e",
        },
        {
            Icon: FcBusinessman,
            color: "#6366f1",
        },
        {
            Icon: FcSportsMode,
            color: "#14b8a6",
        },
        {
            Icon: FaCar,
            color: "#ef4444",
        },
        {
            Icon: FcBusinesswoman,
            color: "#ec4899",
        },
    ];

    useEffect(() => {
        const handleClickOutside = (e) => {

            if (
                backdropRef.current &&
                backdropRef.current.contains(e.target)
            ) return;

            setShow(false);
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleTabClick = (tab) => {
        navigate('/');
        setActiveTab(tab);
        setShow(false);
    }

    return (
        <div className={`w-full h-screen absolute top-0 left-0 z-99 ${show ? `translate-x-0 ${isDark ? "bg-[#00000080]" : "bg-[#00000050]"}` : "-translate-x-full transition-transform duration-300 bg-transparent overflow-hidden"} cursor-pointer`}>
            <div className={` ${show ? "block translate-x-0" : " -translate-x-full"}  top-0 z-99 w-70 transition-all duration-300 overflow-y-auto h-screen no-scrollbar will-change-scroll cursor-default ${isDark ? "sideMenuDarkBg" : "sideMenuBg"} pb-15`} ref={backdropRef}>
                <div className={`flex flex-row pt-3 pl-1 items-center gap-3 sticky top-0 z-50 pb-2 border-b-2 justify-between px-4 ${isDark ? "border-gray-800 sideMenuDarkBg" : "border-gray-200 sideMenuBg"}`}>
                    {/* LOGO */}
                    <div className='cursor-pointer flex justify-center items-center' onClick={() => handleTabClick("HOME")}>
                        <img src={logo} alt="logo" className='sm:w-35 w-30 object-cover' />
                    </div>
                    {/* categories taggle btn */}
                    <div onClick={() => setShow(!show)}>
                        <TbLayoutSidebarRightExpandFilled size={28} className={`${isDark ? "text-gray-300" : "text-gray-700"} cursor-pointer`} />
                    </div>
                </div>

                <div className='h-auto p-4 gap-1 flex flex-col'>
                    <div className={`${isDark ? "bg-[#0F172A90] backdrop-blur-[1px] border-gray-800" : "bg-[#ffffff90] border-gray-200"} rounded-2xl border-2 overflow-hidden`}>
                        <div className={`${isDark ? "text-gray-300" : "text-gray-700"} px-4 py-2 p-4 items-center gap-4 flex flex-row  cursor-pointer ${activeTab === "HOME" && `${isDark ? "bg-[#0a193c]" : "bg-[#dadada90]"} `}`} onClick={() => handleTabClick("HOME")}>
                            <IoHome size={24} />
                            <span className='font-semibold flex justify-center items-center'>HOME</span>
                        </div>
                        <div className='flex flex-col gap-1'>
                            {categories.map((item, idx) => {
                                const { Icon, color } = categoryIcons[idx] || {};
                                const isParentActive = item.categories.includes(activeTab);

                                return (
                                    <div
                                        key={idx}
                                        className="flex flex-col"
                                    >
                                        <div className={`flex flex-row px-4 py-2 w-full items-center gap-4 cursor-pointer ${isParentActive && `${isDark ? "bg-[#0a193c]" : "bg-[#dadada90]"} `} relative`} onClick={() => currentIdx === idx ? setCurrentIdx(null) : setCurrentIdx(idx)}>
                                            <Icon size={24} style={{ color }} />
                                            <span className={`font-semibold flex justify-center items-center`} style={{ color }}>
                                                {item.parentCategory}
                                            </span>
                                            <IoIosArrowUp className={`absolute right-5 text-gray-700 ${currentIdx === idx && "rotate-180 text-orange-500"} duration-300`} />
                                        </div>
                                        {<div className={`flex flex-col capitalize ${currentIdx === idx ? "max-h-500" : "max-h-0"} overflow-hidden transition-[max-height] duration-300 will-change-transform ease-in-out`}>
                                            {item.categories.map((sub, i) => (
                                                <div className='font-semibold text-gray-700 cursor-pointer w-full pl-20 hover:text-orange-500' key={i} onClick={() => handleTabClick(sub)}>
                                                    <li className={`${isDark ? "text-gray-300" : "text-gray-700"} ${activeTab === sub && "text-orange-500"}`}>{sub}</li>
                                                </div>
                                            ))}
                                        </div>}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SideMenu