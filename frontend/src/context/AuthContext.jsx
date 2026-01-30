import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ===== LOAD USER FROM LOCALSTORAGE ===== */
  useEffect(() => {
    const storedUser = localStorage.getItem("user-info");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("user-info");
      }
    }
    setLoading(false);
  }, []);

  /* ===== LOGIN ===== */
  const login = (userData) => {
    localStorage.setItem("user-info", JSON.stringify(userData));
    setUser(userData);
  };

  /* ===== LOGOUT ===== */
  const logout = () => {
    localStorage.removeItem("user-info");
    window.location.reload();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
