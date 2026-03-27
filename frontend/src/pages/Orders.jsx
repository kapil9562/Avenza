import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation, useOutletContext } from "react-router-dom";
import { Breadcrumb, OrderFilterSkeleton, OrderSkeleton } from "../components";
import { IoCheckboxSharp } from "react-icons/io5";
import { RxCross1, RxSquare } from "react-icons/rx";
import { IoMdRadioButtonOn } from "react-icons/io";
import { formatINR } from "../utils/price";
import { useTheme } from "../context/ThemeContext";
import { getOrders } from "../api/api";
import { useAuth } from "../context/AuthContext";
import { MdOutlineKeyboardDoubleArrowDown, MdArrowForwardIos, MdKeyboardArrowDown } from "react-icons/md";
import { IoFilterSharp } from "react-icons/io5";

const Orders = () => {
    const { isDark } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();

    const { user } = useAuth();

    const [orders, setOrders] = useState([]);
    const [totalOrders, setTotalOrders] = useState(0);
    const [skip, setSkip] = useState(0);
    const limit = 5;
    const [loading, setLoading] = useState(false);
    const { setActiveTab } = useOutletContext();
    const [showLoading, setShowLoading] = useState(false);
    const [openFilters, setOpenFilters] = useState(false);
    const filterRef = useRef(null);
    const boxRef = useRef(null);
    const [showIndicator, setShowIndicator] = useState(false);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                filterRef.current?.contains(e.target)
            ) return;

            setOpenFilters(false);
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        }
    }, []);

    const [filter, setFilter] = useState({
        orderStatus: [
            { label: "On the way", checked: false },
            { label: "Delivered", checked: false },
            { label: "Cancelled", checked: false },
            { label: "Returned", checked: false },
        ],
        orderTime: [
            { label: "Last 30 days", checked: false },
            { label: "2024", checked: false },
            { label: "2023", checked: false },
            { label: "Older", checked: false },
        ],
    });

    const hasChecked =
        filter.orderStatus.some((s) => s.checked) ||
        filter.orderTime.some((t) => t.checked);

    const [filterTags, setFilterTags] = useState([]);

    useEffect(() => {
        const tags = [...filter.orderStatus.filter(item => item.checked).map(item => item.label),
        ...filter.orderTime.filter(item => item.checked).map(item => item.label)]

        setFilterTags(tags);
    }, [filter]);

    // --- Load filters from URL
    useEffect(() => {
        const query = new URLSearchParams(location.search);
        const statusParam = query.get("status");
        const timeParam = query.get("time");

        setFilter((prev) => ({
            orderStatus: prev.orderStatus.map((s) => ({
                ...s,
                checked: statusParam
                    ? statusParam.split(",").map((t) => t.replaceAll("_", " ")).includes(s.label)
                    : false,
            })),
            orderTime: prev.orderTime.map((t) => ({
                ...t,
                checked: timeParam
                    ? timeParam.split(",").map((tt) => tt.replaceAll("_", " ")).includes(t.label)
                    : false,
            })),
        }));

        setSkip(0);
    }, [location.search]);

    const getActiveFilters = () => {
        const activeStatus = filter.orderStatus.filter((s) => s.checked).map((s) => s.label);
        const activeTime = filter.orderTime.filter((t) => t.checked).map((t) => t.label);
        return { status: activeStatus, time: activeTime };
    };

    const fetchOrders = async (append = false) => {
        showLoading ? setLoading(false) : setLoading(true);
        const { status, time } = getActiveFilters();

        try {
            const res = await getOrders({
                userId: user._id,
                status,
                time,
                skip,
                limit,
            });

            if (append) {
                setOrders((prev) => [...prev, ...res.data.orders]);
            } else {
                setOrders(res.data.orders);
            }

            setTotalOrders(res.data.total || 0);
        } catch (err) {
            console.error(err);
        } finally {
            setTimeout(() => {
                setLoading(false);
                setShowLoading(false);
            }, 200);
        }
    };

    useEffect(() => {
        fetchOrders(skip > 0);
    }, [filter, skip]);


    useEffect(() => {
        const activeStatus = filter.orderStatus.filter((s) => s.checked).map((s) => s.label.replaceAll(" ", "_"));
        const activeTime = filter.orderTime.filter((t) => t.checked).map((t) => t.label.replaceAll(" ", "_"));

        const params = new URLSearchParams();
        if (activeStatus.length) params.set("status", activeStatus.join(","));
        if (activeTime.length) params.set("time", activeTime.join(","));

        if (activeStatus.length || activeTime.length) {
            navigate(`/my-account/my-orders/search-results?${params.toString()}`, { replace: true });
        } else {
            navigate(`/my-account/my-orders`, { replace: true });
        }

        setSkip(0);
    }, [filter, navigate]);

    const removeTag = (tag) => {
        setFilter(prev => {
            if (prev.orderStatus.some(s => s.label === tag)) {
                return {
                    ...prev,
                    orderStatus: prev.orderStatus.map(s =>
                        s.label === tag ? { ...s, checked: false } : s
                    )
                };
            }

            if (prev.orderTime.some(t => t.label === tag)) {
                return {
                    ...prev,
                    orderTime: prev.orderTime.map(t =>
                        t.label === tag ? { ...t, checked: false } : t
                    )
                };
            }

            return prev;
        });
    };

    const clearAllFilter = () => {

        if (!hasChecked) return;

        setFilter({
            orderStatus: filter.orderStatus.map((s) => ({ ...s, checked: false })),
            orderTime: filter.orderTime.map((t) => ({ ...t, checked: false })),
        });
    };

    const loadMore = () => {
        if (orders.length < totalOrders) {
            setSkip((prev) => prev + limit);
        }
    };

    const formatDate = (date) => {
        const d = new Date(date);
        return `${String(d.getDate()).padStart(2, "0")}-${String(d.getMonth() + 1).padStart(2, "0")}-${d.getFullYear()}`;
    };

    const formatName = (str) => {
        return str
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    };

    const statusColors = {
        processing: "text-yellow-600",
        shipped: "bg-blue-100 text-blue-600",
        delivered: "bg-green-100 text-green-600",
        cancelled: "bg-red-100 text-red-600",
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

    useEffect(() => {
        setActiveTab("");
    }, []);

    const checkScroll = () => {
        const el = boxRef.current;
        if (!el) return;

        const hasScrollableContent = el.scrollHeight > el.clientHeight;
        const isAtBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 2;

        setShowIndicator(hasScrollableContent && !isAtBottom);
    };

    useEffect(() => {
        checkScroll();

        const el = boxRef.current;
        if (!el) return;

        el.addEventListener("scroll", checkScroll);
        window.addEventListener("resize", checkScroll);

        return () => {
            el.removeEventListener("scroll", checkScroll);
            window.removeEventListener("resize", checkScroll);
        };
    }, [loadMore]);

    const FilterContent = () => (
        <div className={`w-full h-full border-2 rounded ${isDark ? "bg-gray-900 text-gray-300 border-gray-800 shadow-[0px_0px_12px_rgba(0,0,0,0.5)]" : "bg-white text-gray-800 shadow-[0px_0px_6px_rgba(0,0,0,0.15)]  border-transparent"}`}>

            <div className="flex flex-col justify-center w-full gap-2 px-4 py-2 font-semibold">
                <div className="flex flex-row justify-between items-center w-full">
                    <h1 className="text-xl">Filters</h1>
                    <button
                        className="text-[#FF6F61] text-sm cursor-pointer hover:underline disabled:cursor-not-allowed"
                        onClick={clearAllFilter}
                        disabled={!hasChecked}
                    >
                        Clear all
                    </button>
                </div>
            </div>
            {loading ? (
                <OrderFilterSkeleton />
            ) : (
                <div className="pb-4">
                    {filterTags.length > 0 &&
                        <div className="flex flex-row gap-2 flex-wrap px-4 pb-2">
                            {filterTags.map((tag, idx) => (
                                <button className={`flex flex-row gap-2 items-center p-2 text-xs font-normal rounded hover:line-through cursor-pointer ${isDark ? "bg-gray-800" : "bg-[#e7e7e7]"}`} onClick={() => removeTag(tag)} key={idx}>
                                    <span>{tag}</span>
                                    <RxCross1 />
                                </button>
                            ))}
                        </div>
                    }

                    {/* Order Status */}

                    <div className="flex flex-col px-4 py-2 font-semibold border-t-2 border-gray-200/30 gap-3">
                        <h1 className="text-sm">ORDER STATUS</h1>
                        <div className="space-y-2">
                            {filter.orderStatus.map((item, idx) => (
                                <label
                                    key={idx}
                                    className="space-x-2 cursor-pointer flex items-center"
                                    onClick={() =>
                                        setFilter((prev) => ({
                                            ...prev,
                                            orderStatus: prev.orderStatus.map((s, i) => (i === idx ? { ...s, checked: !s.checked } : s)),
                                        }))
                                    }
                                >
                                    {item.checked ? <IoCheckboxSharp size={18} className="text-[#FF6F61]" /> : <RxSquare size={18} className="text-[#c2c2c2]" />}
                                    <span className="font-normal text-sm">{item.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    {/* Order Time */}
                    <div className="flex flex-col px-4 py-2 font-semibold border-t-2 border-gray-200/30 gap-3">
                        <h1 className="text-sm">ORDER TIME</h1>
                        <div className="space-y-2">
                            {filter.orderTime.map((item, idx) => (
                                <label
                                    key={idx}
                                    className="space-x-2 cursor-pointer flex items-center"
                                    onClick={() =>
                                        setFilter((prev) => ({
                                            ...prev,
                                            orderTime: prev.orderTime.map((t, i) => (i === idx ? { ...t, checked: !t.checked } : t)),
                                        }))
                                    }
                                >
                                    {item.checked ? <IoCheckboxSharp size={18} className="text-[#FF6F61]" /> : <RxSquare size={18} className="text-[#c2c2c2]" />}
                                    <span className="font-normal text-sm">{item.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <div className={`w-full sm:px-5 px-1 sm:py-5 pb-10 lg:min-h-[calc(100dvh-124px)] md:min-h-[calc(100dvh-92px)] min-h-[calc(100dvh-124px)] ${isDark ? "bg-[#0F172A]" : "bg-[#F1F3F6]"}`}>
            <div className="w-full flex flex-row justify-between items-center px-2 py-1 relative" ref={filterRef}>
                <Breadcrumb />
                <div className="lg:hidden">
                    <button className={`flex flex-row justify-center items-center gap-2 text-lg  cursor-pointer ${isDark ? "text-gray-300" : "text-gray-700"}`}
                        onClick={(e) => {
                            setOpenFilters(!openFilters);
                        }}>
                        <IoFilterSharp />
                        Filters
                    </button>
                </div>
                <div className={`absolute top-full z-10 right-0 w-60 sm:w-80 h-fit shadow-2xl lg:hidden ${openFilters ? "opacity-100 scale-100" : "opacity-0 scale-50 pointer-events-none"} transition-all duration-500 origin-top-right transform-gpu will-change-transform`}>
                    <FilterContent />
                </div>
            </div>

            <div className="flex flex-row gap-4">
                {/* Filters Panel */}
                <div className="lg:block hidden w-80 h-fit">
                    <FilterContent />
                </div>

                <div className="h-fit w-full relative">
                    {/* Orders List */}
                    <div className="w-full h-[75dvh] overflow-x-hidden overflow-y-scroll no-scrollbar flex flex-col gap-2 scroll-smooth will-change-scroll relative" ref={boxRef}>
                        {loading ?
                            Array(5).fill(0).map((_, idx) => (
                                <OrderSkeleton key={idx} />
                            ))
                            :
                            orders.length > 0 ? (
                                <>
                                    {orders.map((order) => (
                                        <div key={order._id} className={`animate-easeIn px-5 rounded-lg border-2 transition-shadow duration-200 cursor-pointer ${isDark ? "bg-gray-900 border-gray-800 text-gray-100 hover:bg-[#171e2f] transition-colors duration-500" : "bg-white border-[#87878730] hover:shadow-[0px_0px_15px_rgba(0,0,0,0.15)]"} animate-fadeIn`}>
                                            <span className="absolute w-0 h-0 bg-[#171e2f] rounded-full group-hover:w-[300%] group-hover:h-[300%] transition-all duration-500 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></span>
                                            <table className="w-full table-fixed">
                                                <tbody>
                                                    <tr>
                                                        {/* Product */}
                                                        <td className="px-4 py-4 w-1 sm:w-1/2 lg:pl-10 pl-0">
                                                            <div className="flex items-center gap-4">
                                                                <img
                                                                    src={order?.orderItems[0]?.image}
                                                                    alt="img"
                                                                    className={`h-20 w-20 object-cover rounded transition-all duration-500 animate-easeIn`} />
                                                                <div className="flex flex-col">
                                                                    <span>{order?.orderItems[0]?.name}</span>
                                                                    <span className="text-sm text-gray-500 hidden sm:table-cell">Qty: {order?.orderItems[0]?.quantity}</span>
                                                                    <span className="text-sm text-gray-500 flex flex-row items-center gap-1 sm:hidden"><IoMdRadioButtonOn className={statusColors[order?.orderStatus]} />
                                                                        {formatName(order?.orderStatus)}</span>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        {/* Amount */}
                                                        <td className="px-4 py-4 w-1/6 sm:table-cell hidden">₹{formatINR(order?.totalAmount)}</td>
                                                        {/* Status */}
                                                        <td className="px-4 py-4 w-1/3 hidden md:table-cell">
                                                            <div>
                                                                <span className="flex items-center gap-2 font-semibold">
                                                                    <IoMdRadioButtonOn className={statusColors[order?.orderStatus]} />
                                                                    {formatName(order?.orderStatus)}
                                                                </span>
                                                                <p className="text-sm">{statusMessages[order?.orderStatus]}</p>
                                                            </div>
                                                        </td>
                                                        {/* Payment */}
                                                        <td className="px-4 py-4 w-1/6 hidden sm:table-cell">
                                                            <div className="flex flex-col gap-2 justify-center items-center">
                                                                <span className="text-sm xl:text-[16px]">{formatDate(order?.createdAt)}</span>
                                                                <span className={`${paymentBadge[order?.paymentStatus]} text-sm px-4 py-1 rounded-full flex w-fit items-center justify-center`}>
                                                                    {formatName(order?.paymentStatus)}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-4 w-1/10 sm:hidden">
                                                            <MdArrowForwardIos className="text-lg text-gray-700" />
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    ))}

                                    {showLoading &&
                                        Array(4).fill(0).map((_, idx) => (
                                            <OrderSkeleton key={idx} />
                                        ))
                                    }

                                    {/* Load More */}
                                    <div className="w-full flex justify-center items-center font-semibold">
                                        {orders.length < totalOrders ? (
                                            <button
                                                className={`text-[#FF6F61] px-4 py-2 rounded transition-shadow duration-200 hover:shadow-[0px_0px_8px_rgba(0,0,0,0.15)] border-2 cursor-pointer w-fit ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-[#87878730]"}`}
                                                onClick={() => {
                                                    setShowLoading(true);
                                                    loadMore();
                                                }}
                                                disabled={loading}
                                            >
                                                {loading ? "Loading..." :
                                                    <span className="flex flex-row items-center gap-1">
                                                        <MdOutlineKeyboardDoubleArrowDown size={20} />
                                                        Load More
                                                    </span>
                                                }
                                            </button>
                                        ) :
                                            (
                                                <span
                                                    className={`text-[#FF6F61] px-4 py-2 rounded border-2 ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-[#87878730]"}`}
                                                >
                                                    No More Results To Display
                                                </span>
                                            )}
                                    </div>
                                </>
                            ) : (
                                <div className={`easeIn h-[70dvh] rounded flex justify-center items-center border-2 ${isDark ? " bg-gray-900 text-gray-300 border-gray-800 shadow-[0px_0px_12px_rgba(0,0,0,0.5)] " : " bg-white border-transparent text-gray-800 shadow-[0px_0px_8px_rgba(0,0,0,0.15)]"}`}>
                                    <div className="flex flex-col justify-center items-center">
                                        <img src="/noResult.png" alt="img" className="h-50 w-50 object-contain" />
                                        <p className="font-semibold text-lg mb-2">Sorry, no results found</p>
                                        <p className="font-normal text-gray-500 text-sm mb-4">Edit filter or go back to My Orders Page</p>
                                        <button className="border-2 hover:bg-[#fc8479] bg-[#FF6F61] border-[#ff3e2d] text-white font-semibold px-3 py-2 rounded text-sm shadow-md cursor-pointer" onClick={() => navigate('/my-account/my-orders')}>
                                            <span>Go to My Orders</span>
                                        </button>
                                    </div>
                                </div>
                            )
                        }


                    </div>
                    <div
                        className={`pointer-events-none absolute z-10 bottom-0 left-1/2 -translate-x-1/2 transition-all duration-300 ${showIndicator ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                            }`}
                    >
                        <MdKeyboardArrowDown size={40} className="animate-bounce text-gray-600" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Orders;