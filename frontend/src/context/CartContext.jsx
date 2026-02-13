import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { addCart, clearCart, getCart, getProducts, updateQty } from "../api/api";
import { useAuth } from "./AuthContext";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user, loading: authLoading } = useAuth();

  const totalItems = useMemo(
    () => items.reduce((a, i) => a + i.qty, 0),
    [items]
  );

  const subtotal = useMemo(
    () => items.reduce((a, i) => a + i.qty * i.price, 0),
    [items]
  );

  const fetchCart = useCallback(async () => {
    if (!user?.uid) return;

    setLoading(true);
    try {
      // 1. Get cart items
      const { data: dbCart } = await getCart({ uid: user.uid });

      if (!dbCart?.length) {
        setItems([]);
        return;
      }

      const productIds = dbCart.map(item => item.productId);

      const res = await getProducts({ productIds });
      const products = res.data?.products || [];

      const mergedItems = products.map(product => {
        const cartItem = dbCart.find(
          item => item.productId === product._id
        );

        return {
          ...product,
          qty: cartItem?.qty || 1,
        };
      });

      setItems(mergedItems);
    } catch (e) {
      console.error("fetchCart error", e);
    } finally {
      setLoading(false);
    }
  }, [user?.uid]);

  const addToCart = useCallback(
    async (product) => {
      if (!user?.uid) return;

      const { product_id, qty = 1 } = product;

      try {
        const res = await getProducts({ productId: product_id });
        const fullProduct = res?.data?.products?.[0];

        if (!fullProduct) return;

        const addCartRes = await addCart({
          uid: user.uid,
          product_id: fullProduct._id,
          price: fullProduct.price,
          qty,
        });

        setItems((prev) => {
          const exists = prev.find((i) => i._id === fullProduct._id);
          if (exists) {
            return prev.map((i) =>
              i._id === fullProduct._id
                ? { ...i, qty: i.qty + qty }
                : i
            );
          }
          return [...prev, { ...fullProduct, qty }];
        });

        return addCartRes;
      } catch (err) {
        fetchCart();
        throw err;
      }
    },
    [user?.uid, fetchCart]
  );

  const MAX_QTY = 5;

  const updateCartQty = useCallback(
    async (product_id, qtyChange) => {
      if (!user?.uid || qtyChange === 0) return;

      let prevQty;
      let blocked = false;

      setItems(prev =>
        prev
          .map(item => {
            if (item._id === product_id) {
              prevQty = item.qty;
              const nextQty = item.qty + qtyChange;

              if (nextQty > MAX_QTY) {
                blocked = true;
                return item;
              }

              return { ...item, qty: nextQty };
            }
            return item;
          })
          .filter(item => item.qty > 0)
      );

      if (blocked) {
        throw "quantity limit exceeded"
      }

      try {
        await updateQty({
          uid: user.uid,
          product_id,
          qtyChange,
        });
      } catch (err) {
        setItems(prev =>
          prev.map(item =>
            item._id === product_id
              ? { ...item, qty: prevQty }
              : item
          )
        );
        return err;

      }
    },
    [user?.uid]
  );

  const clearAll = useCallback(
    async () => {

      if (!user?.uid) return;

      setItems([]);

      try {
        await clearCart({
          uid: user?.uid,
        });
      } catch (err) {
        fetchCart();
        console.error(err);
        return err;
      }
    },
    [user?.uid, fetchCart]
  );

  useEffect(() => {
    if (authLoading) return;

    if (user?.uid) {
      fetchCart();
    } else {
      setItems([]);
    }
  }, [user?.uid, authLoading, fetchCart]);

  const contextValue = useMemo(
    () => ({
      items,
      totalItems,
      subtotal,
      loading,
      addToCart,
      updateCartQty,
      clearAll
    }),
    [items, totalItems, subtotal, loading, addToCart, updateCartQty, clearAll]
  );

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};
