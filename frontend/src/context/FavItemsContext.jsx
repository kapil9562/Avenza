import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getFavItems, getProducts, toggleFav } from "../api/api";
import { useAuth } from "./AuthContext";

const FavItemsContext = createContext();
export const useFavItem = () => useContext(FavItemsContext);

export const FavItemsProvider = ({ children }) => {
    const { user, loading: authLoading } = useAuth();
    const [items, setItems] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchFavorites = useCallback(
        async () => {
            if (!user?.uid) return;

            try {
                setLoading(true);

                const favRes = await getFavItems({ UserId: user.uid });
                const favList = Array.isArray(favRes.data.data) ? favRes.data.data : [];

                setFavorites(favList);

                const ids = favList.map(f => f.productId);

                if (ids.length === 0) {
                    setItems([]);
                    return;
                }

                const res = await getProducts({
                    productIds: ids.join(",")
                });

                const products = res.data?.products || [];
                setItems(products);

            } catch (err) {
                console.error("Fetch favorites failed", err);
            } finally {
                setLoading(false);
            }
        },
        [user?.uid]
    );

    const toggleFavItems = useCallback(
        async (pid) => {
            if (!user?.uid) return;

            const exists = favorites.some((f) => f.productId === pid);

            setFavorites((prev) => {
                if (exists) return prev.filter((f) => f.productId !== pid);
                return [...prev, { productId: pid }];
            });

            if (exists) {
                setItems((prev) => prev.filter((item) => item?._id !== pid));
            } else {
                try {
                    const res = await getProducts({ productId: pid });
                    const product = res.data?.products?.[0];
                    if (product) setItems((prev) => [...prev, product]);
                } catch (err) {
                    console.error("Failed to fetch product", err);
                }
            }

            try {
                const res = await toggleFav({ UserId: user.uid, ProductId: pid });
                return res?.data?.res;
            } catch (err) {
                fetchFavorites();
                throw err?.response?.data?.res || "Something went wrong!";
            }
        },
        [user?.uid, favorites, fetchFavorites]
    );

    const removeFavItem = useCallback(
        async (pid) => {
            if (!user?.uid) return;

            
            setItems(prev =>
                prev.filter(item => item._id !== pid)
            );
            
            setFavorites(prev =>
                prev.filter(f => f.productId !== pid)
            );

            try {
                await toggleFav({ UserId: user.uid, ProductId: pid });
            } catch (err) {
                fetchFavorites();
            }
        },
        [user?.uid]
    );

    useEffect(() => {
        if (authLoading) return;

        if (user?.uid) {
            fetchFavorites();
        } else {
            setItems([]);
            setFavorites([]);
        }
    }, [authLoading, user?.uid, fetchFavorites]);

    const contextValue = useMemo(
        () => ({
            favorites,
            loading,
            items,
            toggleFavItems,
            fetchFavorites,
            removeFavItem
        }),
        [items, loading, favorites, toggleFavItems, fetchFavorites, removeFavItem]
    );

    return (
        <FavItemsContext.Provider value={contextValue}>
            {children}
        </FavItemsContext.Provider>
    );
};
