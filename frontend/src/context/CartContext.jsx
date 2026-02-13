import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { addCart, getCart, getProducts, updateQty } from "../api/api";
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
      const { data: dbCart } = await getCart({ uid: user.uid });

      if (!dbCart?.length) {
        setItems([]);
        return;
      }

      const productPromises = dbCart.map(async (item) => {
        const res = await getProducts({ productId: item._id });
        const product = res.data?.products?.[0];

        if (!product) return null;

        return {
          ...product,
          id: product.productId,
          qty: item.qty,
        };
      });

      const results = await Promise.all(productPromises);
      setItems(results.filter(Boolean));
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
      console.log("pid :", product_id)

      try {
        const res = await getProducts({ productId: product_id });
        const fullProduct = res?.data?.products?.[0];

        if (!fullProduct) return;

        const addCartRes = await addCart({
          uid: user.uid,
          product_id: fullProduct.productId,
          price: fullProduct.price,
          qty,
        });

        setItems((prev) => {
          const exists = prev.find((i) => i.productId === fullProduct.productId);
          if (exists) {
            return prev.map((i) =>
              i.productId === fullProduct.productId
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
            if (item.productId === product_id) {
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
            item.productId === product_id
              ? { ...item, qty: prevQty }
              : item
          )
        );
        return err;

      }
    },
    [user?.uid]
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
      updateCartQty
    }),
    [items, totalItems, subtotal, loading, addToCart, updateCartQty]
  );

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};
