import { createContext, useContext, useState } from "react";

const ProductsContext = createContext(null);

export const ProductsProvider = ({ children }) => {
  const [cache, setCache] = useState({});
  const [categories, setCategories] = useState([]);

  const setProducts = (key, products) => {
    setCache(prev => ({
      ...prev,
      [key]: products
    }));
  };

  const value = {
    cache,
    setCache,
    setProducts,
    categories,
    setCategories
  };

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = () => {
  const ctx = useContext(ProductsContext);
  if (!ctx) {
    throw new Error("useProducts must be used inside ProductsProvider");
  }
  return ctx;
};
