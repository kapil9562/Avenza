import React from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext';
import { Breadcrumb } from '../components';
import { useTheme } from '../context/ThemeContext';
import { useState } from 'react';
import { useEffect } from 'react';
import { getAddress, getOrderDetail } from '../api/api';
import { formatINR } from '../utils/price';
import { IoMdRadioButtonOn } from 'react-icons/io';
import OrderStatusTracker from '../components/common/OrderStatusTracker';
import { HiOutlineEnvelope, HiOutlineHome, HiOutlinePhone, HiOutlineUser } from "react-icons/hi2";
import { SlEarphonesAlt } from "react-icons/sl";

function OrderDetail() {

  const { id } = useParams();
  const { user } = useAuth();
  const { isDark } = useTheme();

  const [order, setOrder] = useState([]);
  const [address, setAddress] = useState([]);

  useEffect(() => {
    if (!id) return;

    const getOrderInfo = async () => {
      try {
        const res = await getOrderDetail({ userId: user._id, orderId: id });
        setOrder(res?.data?.order);
      } catch (error) {
        console.error(error);
      }
    }

    const getUserAddress = async () => {
      try {
        const res = await getAddress({ userId: user._id });
        setAddress(res?.data?.address);
      } catch (error) {
        console.error(error);
      }
    }

    getOrderInfo();
    getUserAddress();
  }, [id]);

  const formatDate = (isoDate) => {
    return new Date(isoDate).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    });
  };

  const paymentBadge = {
    paid: isDark
      ? "bg-green-900/40 text-green-400 border border-green-700"
      : "bg-green-100 text-green-600 border border-green-300 shadow-md",
    pending: isDark
      ? "bg-yellow-900/40 text-yellow-400 border border-yellow-700"
      : "bg-yellow-100 text-yellow-600 border border-yellow-300 shadow-md",
    failed: isDark
      ? "bg-red-900/40 text-red-400 border border-red-700"
      : "bg-red-100 text-red-600 border border-red-300 shadow-md",
  };

  const statusMessages = {
    processing: "Your order is being processed.",
    shipped: "Your order has been shipped and is on the way.",
    delivered: "Your order has been successfully delivered. Thank you for shopping with us!",
    cancelled: "Your order was cancelled as per your request."
  };

  const statusColors = {
    processing: {
      text: "text-yellow-600",
      bg: "bg-yellow-600/10"
    },
    shipped: {
      text: "text-blue-600",
      bg: "bg-blue-600/10"
    },
    delivered: {
      text: "text-green-600",
      bg: "bg-green-600/10"
    },
    cancelled: {
      text: "text-red-600",
      bg: "bg-red-600/10"
    },
  };

  const formatName = (name) => {
    if (!name || typeof name !== "string") return "";
    return name
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const deliveryDate = (date) => {
    const newDate = new Date(date);
    newDate.setUTCDate(newDate.getUTCDate() + 7);
    return newDate;
  }

  return (
    <div className={`w-full sm:px-5 px-1 sm:py-5 pb-10 lg:min-h-[calc(100dvh-124px)] md:min-h-[calc(100dvh-92px)] min-h-[calc(100dvh-124px)] ${isDark ? "bg-linear-to-br from-[#020617] via-[#0F172A] to-slate-800" : "bg-[#F1F3F6]"} md:space-y-2`}>
      <div className='w-full p-2 md:p-0'>
        <Breadcrumb />
      </div>
      <div className='flex lg:flex-row flex-col w-full gap-4'>
        <div className='lg:w-[70%] w-full flex flex-col gap-4'>
          <div className={`min-h-[70dvh] border-2 rounded-lg ${isDark ? "bg-gray-900 text-gray-200 border-gray-800" : "bg-[#FFFFFF] text-gray-800 border-[#eeecec]"} sm:space-y-4 space-y-2 px-5 py-4`}>
            <div className={`sm:border-b-2 ${isDark ? "border-gray-800" : "border-[#b3b3b320]"}`}>
              <h1 className='text-xl font-semibold sm:pb-4 font-[Roboto_Serif]'>Ordered Item</h1>
            </div>
            <div className={`flex flex-row w-full gap-4 border-2 rounded-lg px-4 py-4 ${isDark ? "border-gray-800" : "border-gray-100"}`}>
              <div className='h-full flex items-center'>
                <img src={order?.orderItems?.[0]?.image} alt="Thumbnail" className='md:h-40 md:w-50 sm:h-30 sm:w-30 h-20 w-20 object-contain' />
              </div>
              <div className='w-full flex flex-col justify-between'>
                <div className='flex flex-row gap-4 justify-between w-full'>
                  <div>
                    <h1 className='sm:text-lg md:text-xl font-medium font-[Roboto_Serif]'>{order?.orderItems?.[0]?.name}</h1>
                    <span className='font-normal text-sm md:text-lg text-[#878787]'>Qty:{order?.orderItems?.[0]?.quantity}</span>
                  </div>
                  <div className='flex flex-col'>
                    <h2 className='sm:text-lg md:text-xl font-[Cormorant_Garamond] font-bold'>Price</h2>
                    <span className='md:text-lg text-[#878787]'>₹{formatINR(order?.orderItems?.[0]?.price)}</span>
                  </div>
                </div>
                <div>
                  <div className='flex-row gap-2 items-center font-semibold hidden sm:flex'>
                    <IoMdRadioButtonOn className={statusColors[order?.orderStatus]?.text} />
                    {formatName(order?.orderStatus)}
                  </div>
                  <p className='text-sm md:text-[16px] hidden sm:block'>{statusMessages[order?.orderStatus]}</p>
                </div>
                <div className='hidden sm:block'>
                  <span className='text-[#878787] text-sm md:text-[16px]'>Estimated Delivery Date: </span>
                  <span className='font-medium text-sm md:text-[16px]'>{formatDate(deliveryDate(order?.createdAt))}</span>
                </div>
              </div>
            </div>
            <div className={`sm:border-b-2 ${isDark ? "border-gray-800" : "border-[#b3b3b320]"}`}>
              <h1 className='text-xl font-semibold sm:pb-4 font-[Roboto_Serif]'>Ordered Information</h1>
            </div>
            <OrderStatusTracker currentStatus={order?.orderStatus} estimatedDelivery={formatDate(deliveryDate(order?.createdAt))} />
          </div>
          <div className={`border-2 rounded-lg ${isDark ? "bg-gray-900 text-gray-200 border-gray-800" : "bg-[#FFFFFF] text-gray-800 border-[#eeecec]"} px-5 py-4 flex md:flex-row flex-col gap-4 justify-between`}>
            <div className='flex gap-4 flex-row'>
              <div className={`w-fit h-fit p-2 rounded-full ${isDark? "bg-[#151e30] text-gray-200" : "bg-slate-300  text-slate-600"}`}>

                <SlEarphonesAlt size={24} />
              </div>
              <div className='flex flex-col'>
                <span className={`font-medium ${isDark? "text-gray-200" : "text-gray-700"}`}>Need help? Contact out 24/7 customer support.</span>
                <div className="flex flex-col">
                  <div className="flex flex-row items-center gap-2">
                    <span><HiOutlinePhone size={18} /></span>
                    <a href="tel:+918791029562" className={`${isDark? "text-gray-200" : "text-gray-700"}`}>
                      +91 8791029562
                    </a>
                  </div>

                  <div className="flex flex-row items-center gap-2">
                    <span><HiOutlineEnvelope size={18} /></span>
                    <a href="mailto:avenzabusiness2@gmail.com" className={`break-all ${isDark? "text-gray-200" : "text-gray-700"}`}>
                      avenzabusiness2@gmail.com
                    </a>
                  </div>
                </div>
              </div>
            </div>
            {order?.orderStatus !== "cancelled" ?
              <div className='flex flex-row h-fit gap-2 whitespace-nowrap'>
                <button className={`py-2 px-3 border-2 rounded text-sm font-medium font-[Nunito] tracking-wide cursor-pointer hover:shadow-md transition-[box-shadow,border-color, transform] will-change-transform duration-300 active:scale-95 ${isDark? "border-gray-800 bg-[#151e30] text-gray-400 hover:border-gray-600" : "border-slate-300 bg-slate-200 text-gray-700"}`}>Cancel Order</button>
                <button className='py-2 px-3 border-2 border-[#4e80b3] bg-[#568FC8] rounded text-sm font-medium text-gray-100 font-[Nunito] tracking-wide cursor-pointer hover:shadow-md transition-[box-shadow,border-color, transform] will-change-transform duration-300 active:scale-95'>Track Order</button>
              </div> : <button className='py-2 px-3 border-2 border-[#4e80b3] bg-[#568FC8] rounded text-sm font-medium text-gray-100 font-[Nunito] tracking-wide cursor-pointer hover:shadow-md transition-[box-shadow,border-color, transform] will-change-transform duration-300'>Order Again</button>
            }
          </div>
        </div>
        <div className='h-fit lg:w-[30%] w-full flex flex-col gap-5'>
          <div className={`border-2 rounded-lg ${isDark ? "bg-gray-900 text-gray-200 border-gray-800" : "bg-[#FFFFFF] text-gray-800 border-[#eeecec]"} p-5 space-y-4`}>
            <div className={`border-b-2 ${isDark ? "border-gray-800" : "border-[#b3b3b320]"}`}>
              <h1 className='text-xl font-medium pb-4 font-[Roboto_Serif]'>Delivery details</h1>
            </div>
            <div className={`p-4 rounded-2xl space-y-4 ${isDark ? "bg-[#151e30] text-gray-200" : "bg-[#F9F9F9] text-gray-700"}`}>
              <div className='flex flex-row gap-2 items-center text-sm font-medium'>
                <span><HiOutlineHome size={18} /></span>
                <span>Home</span>
                <span className='line-clamp-1 text-xs font-normal'>{[address?.addressLine1, address?.addressLine2, address?.city, address?.state, address?.country].filter(Boolean).join(", ") || "Address not available"}</span>
              </div>
              <div className={`h-px w-full ${isDark? "bg-gray-800" : "bg-[#ECECEC]"}`} />
              <div className='flex flex-row gap-2 items-center  text-sm font-medium'>
                <span><HiOutlineUser size={18} /></span>
                <span className='whitespace-nowrap'>{address?.fullName}</span>
                <span className='line-clamp-1 text-xs font-normal'>{address?.phone}</span>
              </div>
            </div>
          </div>
          <div className={`border-2 rounded-lg ${isDark ? "bg-gray-900 text-gray-200 border-gray-800" : "bg-[#FFFFFF] text-gray-800 border-[#eeecec]"} p-5 space-y-4`}>
            <div className={`border-b-2 ${isDark ? "border-gray-800" : "border-[#b3b3b320]"}`}>
              <h1 className='text-xl font-medium pb-4 font-[Roboto_Serif]'>Price details</h1>
            </div>
            <div className={`p-4 rounded-2xl space-y-4 ${isDark? "bg-[#151e30]" : "bg-[#F9F9F9]"}`}>
              <div className={`space-y-2 border-b border-dashed pb-4 ${isDark? "border-gray-600" : "border-gray-900"}`}>
                <div className='flex flex-row justify-between'>
                  <span className={`text-sm ${isDark? "text-gray-200" : "text-gray-800"}`}>Subtotal</span>
                  <span>₹{formatINR(order?.orderItems?.[0]?.price)}</span>
                </div>
                <div className='flex flex-row justify-between'>
                  <span className={`text-sm ${isDark? "text-gray-200" : "text-gray-800"}`}>Shipping Fee</span>
                  <span className={`${order?.shippingAmount===0? "text-green-500" : "text-red-500"}`}>+₹{formatINR(order?.shippingAmount)}</span>
                </div>
                <div className='flex flex-row justify-between'>
                  <span className={`text-sm ${isDark? "text-gray-200" : "text-gray-800"}`}>Delivery Fee</span>
                  <span className={`${order?.deliveryCharge===0? "text-green-500" : "text-red-500"}`}>+₹{formatINR(order?.deliveryCharge)}</span>
                </div>
              </div>
              <div className='flex flex-row justify-between'>
                <span className={`text-sm font-semibold ${isDark? "text-gray-200" : "text-gray-800"}`}>Total Amount</span>
                <span className='font-semibold text-green-500'>₹{formatINR(order?.orderItems?.[0]?.price + order?.deliveryCharge + order?.shippingAmount)}</span>
              </div>
            </div>
            <div className={`flex flex-row justify-between p-4 rounded-2xl ${isDark? "bg-[#151e30]" : "bg-[#F9F9F9]"}`}>
              <span className={`text-sm ${isDark? "text-gray-200" : "text-gray-800"}`}>Payment Method:</span>
              <span className='font-semibold'>{order?.paymentMethod}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderDetail