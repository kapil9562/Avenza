import React from 'react'
import { useLocation, useOutletContext, useParams } from 'react-router-dom'
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
import { statusColors } from '../utils/format';
import { MdPayment } from 'react-icons/md';

function OrderDetail() {

  const { id, item } = useParams();
  const { user } = useAuth();
  const { isDark } = useTheme();

  const { scrollRef } = useOutletContext();

  const [order, setOrder] = useState([]);
  const [address, setAddress] = useState([]);
  const [showMore, setShowMore] = useState(false);

  const visible = showMore ? 10 : 2

  useEffect(() => {
    if (!id) return;

    const getOrderInfo = async () => {
      try {
        const res = await getOrderDetail({ userId: user._id, orderId: id });
        setOrder(res?.data?.order);
        setAddress(res?.data?.order?.shippingAddress)
      } catch (error) {
        console.error(error);
      }
    }
    getOrderInfo();
  }, [id, user?._id]);

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
    <div className={`w-full sm:px-5 lg:px-10 px-1 sm:py-5 pb-10 lg:min-h-[calc(100dvh-124px)] md:min-h-[calc(100dvh-92px)] min-h-[calc(100dvh-124px)] ${isDark ? "bg-linear-to-br from-[#020617] via-[#0F172A] to-slate-800" : "bg-[#F1F3F6]"} md:space-y-2`}>
      <div className='w-full p-2 md:p-0'>
        <Breadcrumb />
      </div>
      <div className='flex lg:flex-row flex-col w-full gap-4'>
        <div className='lg:w-[70%] w-full flex flex-col gap-4'>
          <div className={`border-2 rounded-lg ${isDark ? "bg-gray-900 text-gray-200 border-gray-800" : "bg-[#FFFFFF] text-gray-800 border-[#eeecec]"} sm:space-y-4 space-y-2 px-5 py-4`}>
            <div>
              <h1 className='sm:text-lg font-semibold'>Ordered Items ({order?.orderItems?.length})</h1>
            </div>
            <div className='flex flex-col gap-2'>
              <div className={`flex flex-col w-full border-2 rounded-lg px-4 ${isDark ? "border-gray-800" : "border-gray-100"}`}>
                {order?.orderItems?.slice(0, visible).map((item, i) => (
                  <div key={i}>
                    <div className='flex items-center w-full gap-4'>
                      <div className='h-full flex items-center'>
                        <img src={item?.image} alt="Thumbnail" className='h-20 w-20 object-contain' loading='lazy' />
                      </div>
                      <div className='w-full flex flex-col justify-between'>
                        <div className='flex flex-row justify-between w-full h-full items-center gap-10'>
                          <div>
                            <h1 className='font-medium line-clamp-1'>{item?.name}</h1>
                            <span className='font-normal text-sm text-[#878787]'>Qty: {item?.quantity}</span>
                          </div>
                          <div className={`flex flex-col h-full`}>
                            <span className={`md:text-lg font-medium ${isDark ? "text-gray-100" : "text-gray-800"}`}>₹{formatINR(item?.price)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className={`w-full border-t ${i < (order?.orderItems?.slice(0, visible).length - 1) ? "flex" : "hidden"} ${isDark ? "border-gray-700" : "border-gray-200"}`} />
                  </div>
                ))}
              </div>
              {order?.orderItems?.length > 1 &&
                <div>
                  <button
                    className='cursor-pointer text-sm text-[#FF6F61] font-semibold'
                    onClick={() => {
                      setShowMore(!showMore);
                      scrollRef.current?.scrollTo({ top: 0, behavior: "auto" });
                    }}
                  >{showMore ?
                    "Show less"
                    : `Show more (+${order?.orderItems?.length - visible})`}
                  </button>
                </div>
              }
            </div>
          </div>
          <div className={`border-2 rounded-lg ${isDark ? "bg-gray-900 text-gray-200 border-gray-800" : "bg-[#FFFFFF] text-gray-800 border-[#eeecec]"} sm:space-y-4 space-y-2 px-5 py-4`}>
            <OrderStatusTracker currentStatus={order?.orderStatus} estimatedDelivery={formatDate(deliveryDate(order?.createdAt))} />
          </div>
        </div>
        <div className='h-fit lg:w-[30%] w-full flex flex-col gap-5'>
          <div className={`border-2 rounded-lg ${isDark ? "bg-gray-900 text-gray-200 border-gray-800" : "bg-[#FFFFFF] text-gray-800 border-[#eeecec]"} p-4 space-y-2`}>
            <h1 className='text-lg font-medium'>Delivery details</h1>
            <div className={`p-4 rounded-2xl space-y-3 ${isDark ? "bg-[#151e30] text-gray-200" : "bg-[#F9F9F9] text-gray-700"}`}>
              <div className='flex flex-row gap-2 items-center text-sm font-medium'>
                <span><HiOutlineHome size={18} /></span>
                <span>Home</span>
                <span className='line-clamp-1 text-xs font-normal'>{[address?.addressLine1, address?.addressLine2, address?.city, address?.state, address?.country].filter(Boolean).join(", ") || "Address not available"}</span>
              </div>
              <div className={`h-px w-full ${isDark ? "bg-gray-800" : "bg-[#ECECEC]"}`} />
              <div className='flex flex-row gap-2 items-center  text-sm font-medium'>
                <span><HiOutlineUser size={18} /></span>
                <span className='whitespace-nowrap'>{address?.fullName}</span>
                <span className='line-clamp-1 text-xs font-normal'>{address?.phone}</span>
              </div>
              <div className={`h-px w-full ${isDark ? "bg-gray-800" : "bg-[#ECECEC]"}`} />
              <div className='flex gap-2 items-center text-sm font-medium'>
                <span><MdPayment size={18} className='text-purple-800' /></span>
                <span>Payment Method</span>
                <span className='font-normal text-xs'>{order?.paymentMethod}</span>
              </div>
            </div>
          </div>
          <div className={`border-2 rounded-lg ${isDark ? "bg-gray-900 text-gray-200 border-gray-800" : "bg-[#FFFFFF] text-gray-800 border-[#eeecec]"} p-4 space-y-2`}>
            <h1 className='text-lg font-medium'>Price details</h1>
            <div className={`space-y-1 border-b border-dashed pb-2 ${isDark ? "border-gray-600" : "border-gray-900"}`}>
              <div className='flex flex-row justify-between'>
                <span className={`text-sm ${isDark ? "text-gray-200" : "text-gray-800"}`}>Subtotal</span>
                <span>₹{formatINR(order?.totalAmount)}</span>
              </div>
              <div className='flex flex-row justify-between'>
                <span className={`text-sm ${isDark ? "text-gray-200" : "text-gray-800"}`}>Shipping Fee</span>
                <span className={`${order?.shippingAmount === 0 ? "text-green-500" : "text-red-500"}`}>+₹{formatINR(order?.shippingAmount)}</span>
              </div>
              <div className='flex flex-row justify-between'>
                <span className={`text-sm ${isDark ? "text-gray-200" : "text-gray-800"}`}>Delivery Fee</span>
                <span className={`${order?.deliveryCharge === 0 ? "text-green-500" : "text-red-500"}`}>+₹{formatINR(order?.deliveryCharge)}</span>
              </div>
            </div>
            <div className='flex flex-row justify-between'>
              <span className={`text-sm font-semibold ${isDark ? "text-gray-200" : "text-gray-800"}`}>Total Amount</span>
              <span className='font-semibold text-green-500'>₹{formatINR(order?.totalAmount + order?.deliveryCharge + order?.shippingAmount)}</span>
            </div>
          </div>
          <div className={`border-2 rounded-lg ${isDark ? "bg-gray-900 text-gray-200 border-gray-800" : "bg-[#FFFFFF] text-gray-800 border-[#eeecec]"} p-4 space-y-2`}>
            <h1 className='font-medium'>Need Help?</h1>
            <p className={`text-xs w-[80%] ${isDark ? "" : "text-gray-600"}`}>If you have any questions about your order, feel free to contact our support team.
            </p>
            <button className={`flex w-full items-center mt-4 justify-center gap-2 text-sm font-medium py-2 border rounded-lg cursor-pointer active:scale-95 transition-transform duration-300 will-change-transform ${isDark ? "border-rose-600 bg-red-900/20 text-rose-600" : "border-rose-300 bg-red-300/10 text-rose-500"}`}>
              <SlEarphonesAlt />
              <span>Contact Support</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderDetail