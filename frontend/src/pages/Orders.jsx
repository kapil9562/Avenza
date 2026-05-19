import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  useLocation,
  useNavigate,
  useOutletContext,
} from "react-router-dom";
import { Breadcrumb, OrderFilterSkeleton, OrderSkeleton } from "../components";
import { IoCheckboxSharp, IoFilterSharp } from "react-icons/io5";
import { RxCross1, RxSquare } from "react-icons/rx";
import { IoMdRadioButtonOn } from "react-icons/io";
import {
  MdOutlineKeyboardDoubleArrowDown,
  MdArrowForwardIos,
  MdKeyboardArrowDown,
} from "react-icons/md";
import { formatINR } from "../utils/price";
import { useTheme } from "../context/ThemeContext";
import { getOrders } from "../api/api";
import { useAuth } from "../context/AuthContext";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { statusColors } from "../utils/format";

const createInitialFilter = () => ({
  orderStatus: [
    { label: "On the way", value: "onetheway", checked: false },
    { label: "Delivered", value: "delivered", checked: false },
    { label: "Cancelled", value: "cancelled", checked: false },
    { label: "Returned", value: "returned", checked: false },
  ],
  orderTime: [
    { label: "Last 30 days", value: "Last 30 days", checked: false },
    { label: "2024", value: "2024", checked: false },
    { label: "2023", value: "2023", checked: false },
    { label: "Older", value: "Older", checked: false },
  ],
});

const filtersEqual = (a, b) => {
  const aStatus = a.orderStatus.map((item) => item.checked);
  const bStatus = b.orderStatus.map((item) => item.checked);
  const aTime = a.orderTime.map((item) => item.checked);
  const bTime = b.orderTime.map((item) => item.checked);

  return (
    JSON.stringify(aStatus) === JSON.stringify(bStatus) &&
    JSON.stringify(aTime) === JSON.stringify(bTime)
  );
};

const Orders = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { setActiveTab } = useOutletContext();

  const [orders, setOrders] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [skip, setSkip] = useState(0);
  const limit = 5;

  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [filtersReady, setFiltersReady] = useState(false);

  const [openFilters, setOpenFilters] = useState(false);
  const [showIndicator, setShowIndicator] = useState(false);
  const [error, setError] = useState("");

  const [filter, setFilter] = useState(createInitialFilter());

  const filterRef = useRef(null);
  const boxRef = useRef(null);

  const [showMore, setShowMore] = useState({});

  const hasChecked =
    filter.orderStatus.some((s) => s.checked) ||
    filter.orderTime.some((t) => t.checked);

  const filterTags = useMemo(() => {
    return [
      ...filter.orderStatus.filter((item) => item.checked).map((item) => item.label),
      ...filter.orderTime.filter((item) => item.checked).map((item) => item.label),
    ];
  }, [filter]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (filterRef.current?.contains(e.target)) return;
      setOpenFilters(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const statusParam = query.get("status");
    const timeParam = query.get("time");

    const nextFilter = createInitialFilter();

    const selectedStatus = statusParam
      ? statusParam.split(",").map((item) => item.replaceAll("_", " "))
      : [];

    const selectedTime = timeParam
      ? timeParam.split(",").map((item) => item.replaceAll("_", " "))
      : [];

    nextFilter.orderStatus = nextFilter.orderStatus.map((item) => ({
      ...item,
      checked:
        selectedStatus.includes(item.label) ||
        selectedStatus.includes(item.value) ||
        (item.value === "shipped" && selectedStatus.includes("On the way")),
    }));

    nextFilter.orderTime = nextFilter.orderTime.map((item) => ({
      ...item,
      checked: selectedTime.includes(item.label) || selectedTime.includes(item.value),
    }));

    setFilter((prev) => (filtersEqual(prev, nextFilter) ? prev : nextFilter));
    setSkip(0);
    setFiltersReady(true);
  }, [location.search]);

  useEffect(() => {
    if (!filtersReady) return;

    const activeStatus = filter.orderStatus
      .filter((item) => item.checked)
      .map((item) => item.label.replaceAll(" ", "_"));

    const activeTime = filter.orderTime
      .filter((item) => item.checked)
      .map((item) => item.label.replaceAll(" ", "_"));

    const params = new URLSearchParams();

    if (activeStatus.length) params.set("status", activeStatus.join(","));
    if (activeTime.length) params.set("time", activeTime.join(","));

    const nextSearch = params.toString();
    const currentSearch = location.search.replace(/^\?/, "");

    if (nextSearch !== currentSearch) {
      navigate(
        nextSearch
          ? `/my-account/my-orders/search-results?${nextSearch}`
          : `/my-account/my-orders`,
        { replace: true }
      );
    }
  }, [filter, filtersReady, navigate, location.search]);

  const getActiveFilters = () => {
    const activeStatus = filter.orderStatus
      .filter((item) => item.checked)
      .map((item) => item.value);

    const activeTime = filter.orderTime
      .filter((item) => item.checked)
      .map((item) => item.value);

    return { status: activeStatus, time: activeTime };
  };

  const fetchOrders = async (append = false) => {
    if (!user?._id) return;

    setError("");

    if (append) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }

    const { status, time } = getActiveFilters();

    try {
      const res = await getOrders({
        userId: user._id,
        status,
        time,
        skip,
        limit,
      });

      const fetchedOrders = res?.data?.orders || [];
      const fetchedTotal = res?.data?.total || 0;

      if (append) {
        setOrders((prev) => [...prev, ...fetchedOrders]);
      } else {
        setOrders(fetchedOrders);
        if (fetchedOrders.length === 0) {
          setError("No orders found!");
        }
      }

      setTotalOrders(fetchedTotal);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Unable to load orders!"
      );
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    if (!filtersReady) return;
    fetchOrders(skip > 0);
  }, [filter, skip, filtersReady, user?._id]);

  useEffect(() => {
    setActiveTab("");
  }, [setActiveTab]);

  const removeTag = (tag) => {
    setSkip(0);

    setFilter((prev) => {
      if (prev.orderStatus.some((item) => item.label === tag)) {
        return {
          ...prev,
          orderStatus: prev.orderStatus.map((item) =>
            item.label === tag ? { ...item, checked: false } : item
          ),
        };
      }

      if (prev.orderTime.some((item) => item.label === tag)) {
        return {
          ...prev,
          orderTime: prev.orderTime.map((item) =>
            item.label === tag ? { ...item, checked: false } : item
          ),
        };
      }

      return prev;
    });
  };

  const clearAllFilter = () => {
    if (!hasChecked) return;
    setSkip(0);
    setFilter(createInitialFilter());
  };

  const loadMore = () => {
    if (loadingMore || orders.length >= totalOrders) return;
    setSkip((prev) => prev + limit);
  };

  const formatDate = (date) => {
    const d = new Date(date);

    return d.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatName = (str = "") => {
    return str
      .replace(/[_-]/g, " ")
      .split(" ")
      .filter(Boolean)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const paymentBadge = {
    paid: isDark
      ? "bg-green-900/40 text-green-400 border border-green-700"
      : "bg-green-100 text-green-600 border border-green-300",
    pending: isDark
      ? "bg-yellow-900/40 text-yellow-400 border border-yellow-700"
      : "bg-yellow-100 text-yellow-600 border border-yellow-300",
    failed: isDark
      ? "bg-red-900/40 text-red-400 border border-red-700"
      : "bg-red-100 text-red-600 border border-red-300",
  };

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
  }, [orders.length, totalOrders, loading, loadingMore]);

  const FilterContent = () => (
    <div
      className={`w-full h-full border-2 rounded ${isDark
        ? "bg-gray-900 text-gray-300 border-gray-800 shadow-[0px_0px_12px_rgba(0,0,0,0.5)]"
        : "bg-[#FFFFFF] text-gray-800 shadow-[0px_0px_6px_rgba(0,0,0,0.15)] border-transparent"
        }`}
    >
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

      {loading && !loadingMore ? (
        <OrderFilterSkeleton />
      ) : (
        <div className="pb-4">
          {filterTags.length > 0 && (
            <div className="flex flex-row gap-2 flex-wrap px-4 pb-2">
              {filterTags.map((tag, idx) => (
                <button
                  key={`${tag}-${idx}`}
                  className={`flex flex-row gap-2 items-center p-2 text-xs font-normal rounded hover:line-through cursor-pointer ${isDark ? "bg-gray-800" : "bg-[#e7e7e7]"
                    }`}
                  onClick={() => removeTag(tag)}
                >
                  <span>{tag}</span>
                  <RxCross1 />
                </button>
              ))}
            </div>
          )}

          <div className="flex flex-col px-4 py-2 font-semibold border-t-2 border-gray-200/30 gap-3">
            <h1 className="text-sm">ORDER STATUS</h1>
            <div className="space-y-2">
              {filter.orderStatus.map((item, idx) => (
                <label
                  key={item.value}
                  className="space-x-2 cursor-pointer flex items-center"
                  onClick={() => {
                    setSkip(0);
                    setFilter((prev) => ({
                      ...prev,
                      orderStatus: prev.orderStatus.map((statusItem, i) =>
                        i === idx
                          ? { ...statusItem, checked: !statusItem.checked }
                          : statusItem
                      ),
                    }));
                  }}
                >
                  {item.checked ? (
                    <IoCheckboxSharp size={18} className="text-[#FF6F61]" />
                  ) : (
                    <RxSquare size={18} className="text-[#c2c2c2]" />
                  )}
                  <span className="font-normal text-sm">{item.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex flex-col px-4 py-2 font-semibold border-t-2 border-gray-200/30 gap-3">
            <h1 className="text-sm">ORDER TIME</h1>
            <div className="space-y-2">
              {filter.orderTime.map((item, idx) => (
                <label
                  key={item.value}
                  className="space-x-2 cursor-pointer flex items-center"
                  onClick={() => {
                    setSkip(0);
                    setFilter((prev) => ({
                      ...prev,
                      orderTime: prev.orderTime.map((timeItem, i) =>
                        i === idx
                          ? { ...timeItem, checked: !timeItem.checked }
                          : timeItem
                      ),
                    }));
                  }}
                >
                  {item.checked ? (
                    <IoCheckboxSharp size={18} className="text-[#FF6F61]" />
                  ) : (
                    <RxSquare size={18} className="text-[#c2c2c2]" />
                  )}
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
    <div
      className={`w-full sm:px-5 px-1 sm:py-5 pb-10 lg:min-h-[calc(100dvh-112px)] md:min-h-[calc(100dvh-80px)] min-h-[calc(100dvh-112px)] ${isDark
        ? "bg-linear-to-br from-[#020617] via-[#0F172A] to-slate-800"
        : "bg-[#F1F3F6]"
        }`}
    >
      <div
        className="w-full flex flex-row justify-between items-center px-2 py-1 relative"
        ref={filterRef}
      >
        <Breadcrumb />

        <div className="lg:hidden">
          <button
            className={`flex flex-row justify-center items-center gap-2 text-lg cursor-pointer ${isDark ? "text-gray-300" : "text-gray-700"
              }`}
            onClick={() => setOpenFilters((prev) => !prev)}
          >
            <IoFilterSharp />
            Filters
          </button>
        </div>

        <div
          className={`absolute top-full z-10 right-0 w-60 sm:w-80 h-fit shadow-2xl lg:hidden ${openFilters
            ? "opacity-100 scale-100"
            : "opacity-0 scale-50 pointer-events-none"
            } transition-all duration-500 origin-top-right transform-gpu will-change-transform`}
        >
          <FilterContent />
        </div>
      </div>

      <div className="flex flex-row gap-4">
        <div className="lg:block hidden w-80 h-fit">
          <FilterContent />
        </div>

        <div className="h-fit w-full relative">
          <div
            className="w-full lg:h-[75dvh] h-[78dvh] overflow-x-hidden overflow-y-scroll no-scrollbar flex flex-col gap-3 scroll-smooth will-change-scroll relative"
            ref={boxRef}
          >
            {loading ? (
              Array(4)
                .fill(0)
                .map((_, idx) => <OrderSkeleton key={idx} />)
            ) : error && orders.length <= 0 ? (
              <div
                className={`easeIn lg:h-[75dvh] h-[78dvh] rounded flex justify-center items-center border-2 ${isDark
                  ? "bg-gray-900 text-gray-300 border-gray-800 shadow-[0px_0px_12px_rgba(0,0,0,0.5)]"
                  : "bg-white border-transparent text-gray-800 shadow-[0px_0px_8px_rgba(0,0,0,0.15)]"
                  }`}
              >
                <div className="flex flex-col justify-center items-center">
                  <img
                    src="/noResult.webp"
                    alt="img"
                    className="h-50 w-50 object-contain"
                  />
                  <p className="font-semibold text-lg mb-2">
                    Sorry, no results found
                  </p>
                  <p className="font-normal text-gray-500 text-sm mb-4">
                    Edit filter or go back to My Orders Page
                  </p>
                  <button
                    className="border-2 hover:bg-[#fc8479] bg-[#FF6F61] border-[#ff3e2d] text-white font-semibold px-3 py-2 rounded text-sm shadow-md cursor-pointer"
                    onClick={() => navigate("/my-account/my-orders")}
                  >
                    <span>Go to My Orders</span>
                  </button>
                </div>
              </div>
            ) : (
              <>
                {orders.map((order) => (
                  <div
                    key={order.orderId}
                    className={`group rounded-xl border-2 min-h-fit overflow-hidden flex flex-col cursor-pointer ${isDark
                      ? "bg-gray-900 border-gray-800 text-gray-200"
                      : "bg-white border-[#87878730] text-gray-700"
                      }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/my-account/my-orders/${order.orderId}`);
                    }}
                  >
                    <div
                      className={`px-4 sm:px-5 py-4 border-b flex items-center justify-between w-full transition-colors duration-200 ${isDark
                        ? "border-gray-800 group-hover:bg-[#171e2f] has-[.child:hover]:group-hover:bg-gray-900"
                        : "border-gray-200 group-hover:bg-gray-50 has-[.child:hover]:group-hover:bg-white"
                        }`}
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:w-full">
                        <div className="flex gap-4 items-center">
                          <div
                            className={`flex items-center justify-center p-3 rounded-xl ${isDark
                              ? "bg-pink-900/40 text-pink-600"
                              : "bg-pink-100 text-pink-500"
                              }`}
                          >
                            <HiOutlineShoppingBag size={28} />
                          </div>

                          <div className="flex flex-col gap-2 w-full">
                            <span className="text-sm sm:text-base font-semibold">
                              Order ID: {order?.orderId}
                            </span>

                            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
                              <span>Placed on: {formatDate(order?.createdAt)}</span>

                              <span>•</span>

                              <span>
                                {order?.orderItems?.length || 0} item
                                {order?.orderItems?.length > 1 ? "s" : ""}
                              </span>

                              <span className="sm:block hidden">•</span>

                              {order?.paymentMethod && (
                                <span className="sm:block hidden">
                                  Payment: {formatName(order.paymentMethod)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap w-fit sm:justify-end items-center gap-3">
                          <span className="font-semibold text-sm sm:text-base">
                            Total: ₹{formatINR(order?.totalAmount || 0)}
                          </span>

                          <span
                            className={`flex items-center gap-2 text-sm font-semibold rounded-l-full rounded-r-full px-2 py-1 ${statusColors[order?.orderStatus] || "text-gray-500"
                              }`}
                          >
                            <IoMdRadioButtonOn />
                            {formatName(order?.orderStatus)}
                          </span>

                          <span
                            className={`${paymentBadge[order?.paymentStatus] ||
                              (isDark
                                ? "bg-gray-800 text-gray-300 border border-gray-700"
                                : "bg-gray-100 text-gray-700 border border-gray-300")
                              } text-sm px-4 py-1 rounded-full flex w-fit items-center justify-center`}
                          >
                            {formatName(order?.paymentStatus)}
                          </span>

                          <button
                            className={`child sm:flex hidden text-sm px-3 py-1 rounded border cursor-pointer transition-colors duration-200 ${isDark
                              ? "border-gray-700 text-gray-300 hover:bg-gray-800"
                              : "border-gray-300 text-gray-700 hover:bg-gray-100"
                              }`}
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/my-account/my-orders/${order.orderId}`);
                            }}
                          >
                            View Details
                          </button>
                        </div>
                      </div>

                      <div className="lg:hidden shrink-0">
                        <MdArrowForwardIos className="text-lg text-gray-500" />
                      </div>
                    </div>

                    <div className="divide-y divide-gray-200/10">
                      {(showMore[order.orderId]
                        ? order?.orderItems
                        : order?.orderItems?.slice(0, 1)
                      )?.map((item, idx) => (
                        <div
                          key={`${order.orderId}-${item?._id || idx}`}
                          className={`px-4 sm:px-5 py-4 cursor-pointer transition-colors duration-200 ${isDark
                            ? "hover:bg-[#171e2f]"
                            : "hover:bg-gray-50"
                            }`}
                          onClick={() =>
                            navigate(`/my-account/my-orders/${order.orderId}`)
                          }
                        >
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-4 min-w-0">
                              <img
                                src={item?.image}
                                alt={item?.name || "product"}
                                className="h-15 w-15 object-cover rounded"
                              />

                              <div className="min-w-0 flex flex-col">
                                <span className="font-medium line-clamp-2">
                                  {item?.name}
                                </span>

                                <span className="text-sm text-gray-500 mt-1">
                                  Qty: {item?.quantity}
                                </span>
                              </div>
                            </div>

                            <div className="flex flex-col items-end gap-2 shrink-0">
                              <span className="font-semibold">
                                ₹{formatINR(item?.price || 0)}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {order?.orderItems?.length > 1 && (
                      <div
                        className={`px-4 sm:px-5 py-3 flex justify-center border-t cursor-pointer transition-colors duration-200 ${isDark
                          ? "border-gray-800 bg-gray-900 hover:bg-[#171e2f]"
                          : "border-gray-200 bg-gray-50 hover:bg-gray-100"
                          }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();

                          setShowMore((prev) => ({
                            ...prev,
                            [order.orderId]: !prev[order.orderId],
                          }));
                        }}
                      >
                        <button className="flex items-center gap-1 text-sm font-semibold text-[#FF6F61] cursor-pointer">
                          {showMore[order.orderId] ? (
                            <>
                              Show Less
                              <MdKeyboardArrowDown className="rotate-180 transition-transform duration-300" />
                            </>
                          ) : (
                            <>
                              Show More (+{order?.orderItems?.length - 1})
                              <MdKeyboardArrowDown className="transition-transform duration-300" />
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                ))}

                {loadingMore &&
                  Array(2)
                    .fill(0)
                    .map((_, idx) => <OrderSkeleton key={`more-${idx}`} />)}

                <div className="w-full flex justify-center items-center font-semibold">
                  {orders.length < totalOrders ? (
                    <button
                      className={`text-[#FF6F61] px-4 py-2 rounded transition-shadow duration-200 hover:shadow-[0px_0px_8px_rgba(0,0,0,0.15)] border-2 cursor-pointer w-fit ${isDark
                        ? "bg-gray-900 border-gray-800"
                        : "bg-white border-[#87878730]"
                        }`}
                      onClick={loadMore}
                      disabled={loadingMore}
                    >
                      {loadingMore ? (
                        "Loading..."
                      ) : (
                        <span className="flex flex-row items-center gap-1">
                          <MdOutlineKeyboardDoubleArrowDown size={20} />
                          Load More
                        </span>
                      )}
                    </button>
                  ) : (
                    <span
                      className={`text-[#FF6F61] px-4 py-2 rounded border-2 ${isDark
                        ? "bg-gray-900 border-gray-800"
                        : "bg-white border-[#87878730]"
                        }`}
                    >
                      No more results to display
                    </span>
                  )}
                </div>
              </>
            )}
          </div>

          <div
            className={`pointer-events-none absolute z-10 bottom-0 left-1/2 -translate-x-1/2 transition-all duration-300 ${showIndicator ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
              }`}
          >
            <MdKeyboardArrowDown
              size={40}
              className="animate-bounce text-gray-600"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;