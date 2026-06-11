import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { FaCartArrowDown, FaHome, FaShoppingBag } from 'react-icons/fa';
import { FaBoxOpen, FaPencil } from 'react-icons/fa6';
import { FiShoppingBag } from 'react-icons/fi';
import { HiHome, HiOutlineHeart, HiOutlineHome, HiOutlineShoppingBag, HiShoppingBag } from 'react-icons/hi2';
import { HiOutlineShoppingCart } from 'react-icons/hi';
import { IoCartOutline } from 'react-icons/io5';
import { Breadcrumb } from '../components';

function AccountDetail() {

    const { user } = useAuth();
    const { name, setName } = useState(user?.name || "");
    const { email, setEmail } = useState(user?.email || "");

    const normalizeGooglePhoto = (url) => {
        if (!url) return null;
        const base = url.split("=")[0];
        return `${base}=s200`;
    };

    return (
        <div className={`lg:min-h-[calc(100dvh-112px)] md:min-h-[calc(100dvh-80px)] min-h-[calc(100dvh-112px)] px-10 gap-4 p-2 sm:p-4`}>
            <Breadcrumb />
            <div className='flex flex-col items-center p-10'>
                <div className='relative'>
                    <img src={`${user ? normalizeGooglePhoto(user?.avatar) : "/assets/userLight.png"}`} alt="pfp" className='h-40 w-40 rounded-full' />
                    <div className='absolute right-2 bottom-2 rounded-full bg-gray-300 p-2 cursor-pointer'>
                        <FaPencil size={18} className='text-gray-600' />
                    </div>
                </div>
                <div className='grid grid-cols-2 gap-2'>
                    <div className={`border flex flex-row gap-2 items-center p-2 cursor-pointer`}>
                        <div><HiOutlineHome size={24} /></div>
                        <span>Home</span>
                    </div>
                    <div className={`border flex flex-row gap-2 items-center p-2 cursor-pointer`}>
                        <div><HiOutlineShoppingBag size={24} /></div>
                        <span>My Orders</span>
                    </div>
                    <div className={`border flex flex-row gap-2 items-center p-2 cursor-pointer`}>
                        <div><HiOutlineHeart size={24} /></div>
                        <span>Wishlist</span>
                    </div>
                    <div className={`border flex flex-row gap-2 items-center p-2 cursor-pointer`}>
                        <div><IoCartOutline size={24} /></div>
                        <span>Cart</span>
                    </div>
                </div>
                <div>
                    <span>Name: </span>
                    <input type="text" value={user?.name} maxLength={20} />
                </div>
                <div>
                    <span>Email: </span>
                    <input type="email" value={user?.email} maxLength={20} />
                </div>
            </div>
        </div>
    )
}

export default AccountDetail