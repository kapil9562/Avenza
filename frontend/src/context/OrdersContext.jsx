import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { getOrders } from "../api/api";
import { useAuth } from "./AuthContext";

const OrdersContext = createContext(null);

export const OrdersProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);

  const { user, authLoading } = useAuth();

  const fetchOrders = useCallback(async () => {
    if (!user?._id) return;
    try {
      const res = await getOrders({ userId: user._id });
      setOrders(res?.data?.orders || []);
    } catch (error) {
      return error
    }
  }, [user?._id]);

  useEffect(() => {
    if (authLoading) return;

    if (user?._id) {
      fetchOrders();
    } else {
      setOrders([]);
    }
  }, [user?._id, authLoading, fetchOrders]);

  const value = {
    orders,
    setOrders,
    fetchOrders
  };

  return (
    <OrdersContext.Provider value={value}>
      {children}
    </OrdersContext.Provider>
  );
};

export const useOrders = () => {
  const ctx = useContext(OrdersContext);
  if (!ctx) {
    throw new Error("useOrders must be used inside OrdersProvider");
  }
  return ctx;
};
