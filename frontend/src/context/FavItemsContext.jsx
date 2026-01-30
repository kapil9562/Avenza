import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getFavItems, getProducts, toggleFav } from "../api/api";
import { useAuth } from "./AuthContext";

const FavItemsContext = createContext();

export const FavItemsProvider = ({ children }) => {
    const { user, loading: authLoading } = useAuth();
    const [items, setItems] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchFavorites = async () => {
        if (!user?.uid) return;

        try {
            setLoading(true);

            const favRes = await getFavItems({ UserId: user.uid });
            const favList = Array.isArray(favRes.data.data) ? favRes.data.data : [];

            setFavorites(favList);

            const productPromises = favList.map(async (item) => {
                const res = await getProducts({ productId: item.productId });
                const product = res.data?.products?.[0];
                return product ? { product } : null;
            });

            const results = await Promise.all(productPromises);
            setItems(results.filter(Boolean));

        } catch (err) {
            console.error("Fetch favorites failed", err);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        if (!authLoading && user?.uid) {
            fetchFavorites();
        }
    }, [authLoading, user?.uid]);


    const toggleFavItems = async (pid) => {
        if (!user?.uid) return;
        try {
            const res = await toggleFav({ UserId: user?.uid, ProductId: pid });

            setFavorites((prev) => {
                if (!Array.isArray(prev)) return [];

                const exists = prev.some((f) => f.productId === pid);

                if (exists) {
                    return prev.filter((f) => f.productId !== pid);
                }

                return [...prev, { productId: pid }];
            });

            fetchFavorites();
            return res?.data?.res;
        } catch (err) {
            throw err?.response?.data?.res || "Something went wrong !"
        }
    };

    const contextValue = useMemo(
        () => ({
            favorites,
            loading,
            items,
            toggleFavItems,
            fetchFavorites
        }),
        [items, loading, favorites]
    );

    return (
        <FavItemsContext.Provider value={contextValue}>
            {children}
        </FavItemsContext.Provider>
    );
};

export const useFavItem = () => useContext(FavItemsContext);