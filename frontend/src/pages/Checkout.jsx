import React, { useEffect, useState } from 'react'
import { Breadcrumb } from '../components'
import { IoCardOutline, IoWalletOutline } from 'react-icons/io5'
import { RiBankLine } from 'react-icons/ri'
import { FaAngleRight } from 'react-icons/fa'
import { useTheme } from '../context/ThemeContext'
import { MdOutlinePayments } from 'react-icons/md'
import { useLocation, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { HiOutlineShoppingBag } from 'react-icons/hi2'
import { formatINR } from '../utils/price'
import { buyNow } from '../api/api'
import { toast } from '../context/ToastContext'
import { useAuth } from '../context/AuthContext'
import Lottie from "lottie-react";
import loader from "../assets/loader2.json";

function Checkout() {

  const { isDark } = useTheme();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const { product: productData, addressId } = location?.state || {};
  const { items: cartItems, subtotal: cartTotal } = useCart();
  const products = productData ? [productData] : cartItems;

  useEffect(() => {
    if (!productData || !addressId) {
      navigate("/", { replace: true })
    }
  }, [productData, addressId]);

  const subtotal = productData
    ? productData.price * productData.qty
    : cartTotal;
  const deliveryCharge = subtotal > 0 && subtotal < 500 ? 99 : 0;
  const total = subtotal + deliveryCharge;
  const [paymentMethod, setPaymentMethod] = useState("");

  const { user } = useAuth();


  const navigate = useNavigate();

  const paymentOptions = [
    {
      value: "upi",
      title: "UPI",
      description: "Pay securely using any UPI app",
      icon: (
        <img
          src="https://images.icon-icons.com/2699/PNG/512/upi_logo_icon_170312.png"
          alt="UPI"
          className="h-5 w-5 object-contain"
        />
      ),
      status: total < 100000 ? true : false
    },
    {
      value: "card",
      title: "Cards",
      description: "Visa, Mastercard, Rupay & more",
      icon: <IoCardOutline className="text-xl" />,
      status: true
    },
    {
      value: "netbanking",
      title: "Net Banking",
      description: "All major banks supported",
      icon: <RiBankLine className="text-xl text-purple-600" />,
      status: false
    },
    {
      value: "wallet",
      title: "Wallets",
      description: "Paytm, PhonePe, Amazon Pay & more",
      icon: <IoWalletOutline className="text-xl text-violet-600" />,
      status: false
    },
    {
      value: "cod",
      title: "Cash on Delivery",
      description: "Cash payment at your doorstep",
      icon: <MdOutlinePayments className="text-xl text-green-600" />,
      status: true
    },
  ];

  const order = products?.map((product) => ({
    productId: product?._id,
    quantity: product?.qty
  }));

  const onSubmit = async () => {

    if (loading) return;

    if (!paymentMethod) {
      toast.error("Please select a payment option!");
      return;
    }

    try {
      setLoading(true);
      const res = await buyNow({ order, addressId, paymentMethod, userId: user._id });

      const url = res?.data?.url;
      const orderId = res?.data?.orderId;

      if (url) {
        window.location.href = url;
      } else if (orderId) {
        navigate("/success", { state: orderId });
      } else {
        navigate("/cancel");
      }

    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to send OTP! Try again.";

      toast.error(message);

    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={`w-full sm:px-5 lg:px-10 py-2 lg:py-4 px-2 lg:min-h-[calc(100dvh-112px)] md:min-h-[calc(100dvh-80px)] min-h-[calc(100dvh-112px)] flex lg:flex-row flex-col gap-10 ${isDark ? "bg-gray-900" : "bg-[#FFFFFF]"} `}>
      <div className='space-y-4 lg:w-[60%] w-full'>
        <Breadcrumb />
        <div>
          <h2 className={`${isDark ? "text-gray-100" : "text-gray-800"} text-2xl font-semibold`}>Choose Payment Method</h2>
          <p className={`${isDark ? "text-gray-400" : "text-[#787878]"} text-sm font-medium`}>Select a secure payment option to complete your order.</p>
        </div>

        <div className={`${isDark ? "border-gray-800" : "border-gray-200"} w-full border rounded-lg overflow-hidden`}>
          {paymentOptions.map((option, i) => (
            <label
              key={option.value}
              className={`flex items-center gap-4 p-4 cursor-pointer transition-[border-color,background-color] duration-200 ${!option.status && `${isDark? "brightness-50": "opacity-50"} pointer-events-none`} ${paymentMethod === option.value
                ? isDark
                  ? "bg-rose-600/10 ring-1 ring-inset ring-rose-400 rounded-lg"
                  : "bg-rose-50 ring-1 ring-inset ring-rose-400 rounded-lg"
                : ""
                } ${i !== paymentOptions.length - 1
                  ? isDark
                    ? "border-b border-gray-800"
                    : "border-b border-gray-200"
                  : ""
                }`}
            >
              <label className="relative flex items-center">
                <input
                  type="radio"
                  name="payment"
                  value={option.value}
                  checked={paymentMethod === option.value}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="sr-only peer"
                />

                <div
                  className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${isDark ? "border-gray-500" : "border-gray-300"} peer-checked:border-rose-500 peer-checked:border-6`}
                >

                </div>
              </label>

              <div className={`flex items-center justify-center w-10 h-10 rounded-lg shrink-0 ${isDark ? "text-blue-600" : "text-[#3A1CFE]"} ${paymentMethod === option.value ? "bg-pink-600/10" : isDark ? "bg-slate-800" : "bg-gray-50"}`}>
                {option.icon}
              </div>

              <div className="flex items-center justify-between w-full">
                <div>
                  <h3 className={`font-medium ${isDark ? "text-gray-100" : "text-gray-800"}`}>{option.title}</h3>
                  <span className={`text-sm font-medium ${isDark ? "text-gray-400" : "text-[#787878]"}`}>
                    {option.description}
                  </span>
                </div>

                <FaAngleRight className="text-gray-400" />
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className='lg:w-[40%] lg:p-4 w-full'>
        <div className={`${isDark ? "border-gray-800 shadow-[0px_1px_8px_rgba(0,0,0,0.1)]" : "bg-[#FFFFFF] shadow-[0px_1px_8px_rgba(0,0,0,0.1)] border-transparent"} border rounded-lg p-4`}>
          <div className='flex flex-row w-full justify-between'>
            <h2 className={`${isDark ? "text-gray-100" : "text-gray-800"} font-semibold text-lg`}>Order Summary</h2>
            <span className={`text-rose-400 bg-rose-600/10 border border-rose-400 px-2 py-1 rounded-4xl text-sm flex items-center justify-center gap-2 font-medium`}><HiOutlineShoppingBag size={18} />{products?.length}{" "}{products?.length > 1 ? "items" : "items"}</span>
          </div>
          <div className={`${isDark ? "border-b-gray-800" : "border-b-gray-200"} border-b mt-4 space-y-2 pb-4`}>
            {products?.map((item, idx) => (
              <div key={idx} className={`flex flex-row justify-between items-center`}>
                <div className='flex flex-row gap-2 items-center'>
                  <img
                    src={item?.thumbnail}
                    alt={item?.title || "image"}
                    loading='lazy'
                    className={`h-15 w-15 rounded-lg ${isDark ? "bg-gray-800" : "bg-gray-50"}`}
                  />
                  <div className='flex flex-col'>
                    <h4 className={`${isDark ? "text-gray-200" : "text-gray-800"} font-medium`}>{item?.title}</h4>
                    <span className={`${isDark ? "text-gray-400" : "text-[#787878]"} text-sm font-medium`}>Qty: {item?.qty}</span>
                  </div>
                </div>
                <span className={`${isDark ? "text-gray-400" : "text-gray-800"} font-medium`}>₹{item?.price?.toLocaleString("en-IN")}</span>
              </div>
            ))}
          </div>

          <div className='mt-4'>
            <div className='flex flex-col gap-2 py-2'>
              <div className="flex justify-between text-gray-600 font-medium text-sm">
                <span className={`${isDark ? "text-gray-300" : "text-gray-700"} text-sm font-medium`}>Subtotal</span>
                <span>
                  ₹{formatINR(subtotal)}
                </span>
              </div>

              <div className="flex justify-between text-gray-500">
                <span className={`${isDark ? "text-gray-300" : "text-gray-700"} text-sm font-medium`}>Delivery</span>
                <span
                  className={` ${deliveryCharge
                    ? "text-red-600"
                    : "text-green-600"
                    }`}
                >
                  +₹{deliveryCharge}
                </span>
              </div>
            </div>

            <div className={`border-t pt-3 flex justify-between font-semibold ${isDark ? "border-gray-500 text-gray-200" : "border-gray-700 text-gray-800"}`}>
              <span>Total</span>
              <span className="text-green-600">
                ₹{formatINR(total)}
              </span>
            </div>

            <button className="w-full h-12 py-3 rounded-xl transition border-2 hover:bg-[#fc8479] bg-[#FF6F61] border-[#ff3e2d] font-semibold text-white cursor-pointer mt-4 relative flex justify-center items-center disabled:cursor-not-allowed"
              disabled={loading}
              onClick={() => onSubmit()}
            >
              {loading ? <Lottie
                animationData={loader}
                loop={true}
                className="w-50 h-50 absolute"
              />
                : paymentMethod === "cod" ? "Place Order" : `Pay ₹${total?.toLocaleString("en-IN")}`
              }
            </button>
          </div>
        </div>
      </div>

    </div>
  )
}

export default Checkout