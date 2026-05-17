import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    clearFav,
    getFavItems,
    getProducts,
    toggleFav,
} from "../api/api";

import { useAuth } from "./AuthContext";
import { toast } from "./ToastContext";

const FavItemsContext = createContext();

export const useFavItem = () => useContext(FavItemsContext);

const getErrorMessage = (err, fallback) =>
    err.response?.data?.message ||
    err.message ||
    fallback;

export const FavItemsProvider = ({ children }) => {
    const { user, loading: authLoading } = useAuth();

    const [items, setItems] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(false);

    // ================= FETCH FAVORITES =================
    const fetchFavorites = useCallback(async () => {
        if (!user?.uid) return;

        try {
            setLoading(true);

            const favRes = await getFavItems({
                UserId: user.uid,
            });

            const favList = Array.isArray(favRes.data?.data)
                ? favRes.data.data
                : [];

            setFavorites(favList);

            const ids = favList.map((f) => f.productId);

            if (ids.length === 0) {
                setItems([]);
                return;
            }

            const res = await getProducts({
                productIds: ids.join(","),
            });

            const products = res.data?.products || [];

            setItems(products);
        } catch (err) {
            toast.error(
                getErrorMessage(err, "Failed to fetch favorites!")
            );
        } finally {
            setLoading(false);
        }
    }, [user?.uid]);

    // ================= TOGGLE FAVORITE =================
    const toggleFavItems = useCallback(
        async (pid) => {
            if (!user?.uid) return;

            const exists = favorites.some(
                (f) => f.productId === pid
            );

            // LIMIT CHECK
            if (!exists && favorites.length >= 10) {
                toast.error("LIMIT REACHED!");
                return;
            }

            // SAVE PREVIOUS STATE FOR ROLLBACK
            const prevFavorites = favorites;
            const prevItems = items;

            // ================= OPTIMISTIC UPDATE =================
            if (exists) {
                setFavorites((prev) =>
                    prev.filter((f) => f.productId !== pid)
                );

                setItems((prev) =>
                    prev.filter((item) => item?._id !== pid)
                );
            } else {
                setFavorites((prev) => [
                    ...prev,
                    { productId: pid },
                ]);

                try {
                    const res = await getProducts({
                        productId: pid,
                    });

                    const product = res.data?.products?.[0];

                    if (product) {
                        setItems((prev) => {
                            const alreadyExists = prev.some(
                                (p) => p._id === product._id
                            );

                            if (alreadyExists) return prev;

                            return [...prev, product];
                        });
                    }
                } catch (err) {
                    console.error(
                        "Failed to fetch product",
                        err
                    );
                }
            }

            // ================= API CALL =================
            try {
                await toggleFav({
                    UserId: user.uid,
                    ProductId: pid,
                });
            } catch (err) {
                // ROLLBACK
                setFavorites(prevFavorites);
                setItems(prevItems);

                toast.error(
                    getErrorMessage(
                        err,
                        "Failed to update favorites!"
                    )
                );
            }
        },
        [user?.uid, favorites, items]
    );

    // ================= REMOVE FAVORITE =================
    const removeFavItem = useCallback(
        async (pid) => {
            if (!user?.uid) return;

            const prevFavorites = favorites;
            const prevItems = items;

            // OPTIMISTIC REMOVE
            setItems((prev) =>
                prev.filter((item) => item._id !== pid)
            );

            setFavorites((prev) =>
                prev.filter((f) => f.productId !== pid)
            );

            try {
                await toggleFav({
                    UserId: user.uid,
                    ProductId: pid,
                });
            } catch (err) {
                // ROLLBACK
                setFavorites(prevFavorites);
                setItems(prevItems);

                toast.error(
                    getErrorMessage(
                        err,
                        "Failed to remove favorite!"
                    )
                );
            }
        },
        [user?.uid, favorites, items]
    );

    // ================= CLEAR ALL =================
    const clearAll = useCallback(async () => {
        if (!user?.uid) return;

        const prevFavorites = favorites;
        const prevItems = items;

        // OPTIMISTIC CLEAR
        setItems([]);
        setFavorites([]);

        try {
            await clearFav({
                uid: user.uid,
            });
        } catch (err) {
            // ROLLBACK
            setFavorites(prevFavorites);
            setItems(prevItems);

            toast.error(
                getErrorMessage(
                    err,
                    "Failed to clear favorites!"
                )
            );
        }
    }, [user?.uid, favorites, items]);

    // ================= AUTH EFFECT =================
    useEffect(() => {
        if (authLoading) return;

        if (user?.uid) {
            fetchFavorites();
        } else {
            setItems([]);
            setFavorites([]);
        }
    }, [authLoading, user?.uid, fetchFavorites]);

    // ================= CONTEXT VALUE =================
    const contextValue = useMemo(
        () => ({
            favorites,
            items,
            loading,
            toggleFavItems,
            fetchFavorites,
            removeFavItem,
            clearAll,
        }),
        [
            favorites,
            items,
            loading,
            toggleFavItems,
            fetchFavorites,
            removeFavItem,
            clearAll,
        ]
    );

    return (
        <FavItemsContext.Provider value={contextValue}>
            {children}
        </FavItemsContext.Provider>
    );
};