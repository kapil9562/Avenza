import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Breadcrumb from "../utils/Breadcrumb";
import { IoCheckboxSharp } from "react-icons/io5";
import { RxSquare } from "react-icons/rx";
import { RxCross1 } from "react-icons/rx";
import { useOrders } from "../context/OrdersContext";
import { formatINR } from "../utils/price";
import { IoMdRadioButtonOn } from "react-icons/io";
import { useTheme } from "../context/ThemeContext";

const Orders = () => {
    const [filter, setfilter] = useState({
        orderStatus: {
            "On the way": false,
            "Delivered": false,
            "Cancelled": false,
            "Returned": false
        },
        orderTime: {
            "Last 30 days": false,
            "2024": false,
            "2023": false,
            "Older": false
        }
    });

    const [filterTags, setFilterTags] = useState([]);
    const { isDark } = useTheme();

    useEffect(() => {
        const tags = [...Object.keys(filter.orderStatus).filter(k => filter.orderStatus[k]),
        ...Object.keys(filter.orderTime).filter(k => filter.orderTime[k])]

        setFilterTags(tags);
    }, [filter]);

    const removeTag = (tag) => {
        setfilter(prev => {
            if (tag in prev.orderStatus) {
                return {
                    ...prev,
                    orderStatus: {
                        ...prev.orderStatus,
                        [tag]: false
                    }
                };
            }

            if (tag in prev.orderTime) {
                return {
                    ...prev,
                    orderTime: {
                        ...prev.orderTime,
                        [tag]: false
                    }
                };
            }

            return prev;
        });
    };

    const clearAllFilter = () => {
        setfilter(prev => {
            const newStatus = {};
            const newTime = {};

            Object.keys(prev.orderStatus).forEach(key => {
                newStatus[key] = false;
            });

            Object.keys(prev.orderTime).forEach(key => {
                newTime[key] = false;
            });

            return {
                ...prev,
                orderStatus: newStatus,
                orderTime: newTime
            };
        });
    };

    const statusColors = {
        processing: " text-yellow-600",
        shipped: "bg-blue-100 text-blue-600",
        delivered: "bg-green-100 text-green-600",
        cancelled: "bg-red-100 text-red-600",
    };

    const statusMessages = {
        processing: "Your order is being processed.",
        shipped: "Your order has been shipped and is on the way.",
        delivered: "Your order has been successfully delivered. Thank you for shopping with us!",
        cancelled: "Your order was cancelled as per your request."
    };

    const { orders } = useOrders();

    const formatName = (str) =>
        str.split("-").map(word =>
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(" ");


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

    const formatDate = (date) => {
        const d = new Date(date);

        const day = String(d.getDate()).padStart(2, "0");
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const year = d.getFullYear();

        return `${day}-${month}-${year}`;
    };

    return (
        <div className="w-full sm:px-5 px-1 sm:py-5 pb-10 bg-[#F1F3F6]  min-h-[calc(100dvh-124px)] space-y-2">
            <Breadcrumb />
            <div className="flex flex-row gap-4">
                <div className="bg-white w-90 h-fit shadow-md rounded">
                    <div className="flex flex-col justify-center px-4 py-2 font-semibold border-b-2 border-gray-100">
                        <div className="flex flex-row justify-between items-center w-full">
                            <h1 className="text-xl">Filters</h1>
                            <span className="text-blue-500 text-sm cursor-pointer hover:underline" onClick={clearAllFilter}>Clear all</span>
                        </div>
                        {filterTags.length > 0 &&
                            <div className="flex flex-row gap-2 flex-wrap pt-2">
                                {filterTags.map((tag, idx) => (
                                    <button className="flex flex-row gap-2 items-center p-2 bg-[#e7e7e7] text-xs font-normal rounded hover:line-through cursor-pointer" onClick={() => removeTag(tag)} key={idx}>
                                        <span>{tag}</span>
                                        <RxCross1 />
                                    </button>
                                ))}
                            </div>
                        }
                    </div>
                    <div className="flex flex-col px-4 py-2 font-semibold border-b border-gray-200 gap-3">
                        <h1 className="text-sm">ORDER STATUS</h1>
                        <div className="space-y-2">
                            {Object.entries(filter.orderStatus).map(([key, value], idx) => (
                                <label className="space-x-2 cursor-pointer flex flex-row items-center" key={idx}
                                    onClick={() =>
                                        setfilter((prev) => ({
                                            ...prev,
                                            orderStatus: {
                                                ...prev.orderStatus,
                                                [key]: !prev.orderStatus[key]
                                            }
                                        }))
                                    }>
                                    {value ?
                                        <IoCheckboxSharp size={18} className="text-blue-600" />
                                        :
                                        <RxSquare size={18} className={`text-[#c2c2c2]`} />}
                                    <span className="font-normal">{key}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col px-4 py-2 font-semibold border-b border-gray-200 gap-3">
                        <h1 className="text-sm">ORDER TIME</h1>
                        <div className="space-y-2">
                            {Object.entries(filter.orderTime).map(([key, value], idx) => (
                                <label className="space-x-2 cursor-pointer flex flex-row items-center" key={idx}
                                    onClick={() =>
                                        setfilter((prev) => ({
                                            ...prev,
                                            orderTime: {
                                                ...prev.orderTime,
                                                [key]: !prev.orderTime[key]
                                            }
                                        }))
                                    }>
                                    {value ?
                                        <IoCheckboxSharp size={18} className="text-blue-600" />
                                        :
                                        <RxSquare size={18} className={`text-[#c2c2c2]`} />}
                                    <span className="font-normal">{key}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="w-full flex flex-col gap-4">
                    {orders.length > 0 &&
                        orders.map((order, idx) => (
                            <div className="px-5 bg-white rounded-lg border border-[#87878750] hover:shadow-lg transition-shadow duration-200 cursor-pointer ">
                                <table
                                    key={idx}
                                    className="w-full table-fixed"
                                >
                                    <tbody>
                                        <tr>
                                            {/* Product */}
                                            <td className="px-4 py-4 w-1/2 pl-10">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={order?.orderItems[0]?.image}
                                                        alt="img"
                                                        className="h-20 w-20 object-cover rounded"
                                                    />
                                                    <div className="flex flex-col">
                                                        <span>{order?.orderItems[0]?.name}</span>
                                                        <span className="text-sm text-gray-500">
                                                            Qty: {order?.orderItems[0]?.quantity}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Amount */}
                                            <td className="px-4 py-4 w-1/6">
                                                ₹{formatINR(order?.totalAmount)}
                                            </td>

                                            {/* Status */}
                                            <td className="px-4 py-4 w-1/3">
                                                <div>
                                                    <span className="flex items-center gap-2 font-semibold">
                                                        <IoMdRadioButtonOn
                                                            className={statusColors[order?.orderStatus]}
                                                        />
                                                        {formatName(order?.orderStatus)}
                                                    </span>

                                                    <p className="text-sm text-gray-500">
                                                        {statusMessages[order?.orderStatus]}
                                                    </p>
                                                </div>
                                            </td>

                                            {/* Payment */}
                                            <td className="px-4 py-4 w-1/6">
                                                <div className="flex flex-col gap-2 justify-center items-center">
                                                    <span>{formatDate(order?.createdAt)}</span>
                                                <span className={`${paymentBadge[order?.paymentStatus]} text-sm px-4 py-1 rounded-r-full rounded-l-full flex w-fit items-center justify-center`}>{formatName(order?.paymentStatus)}</span>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
};

export default Orders;