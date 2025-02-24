// AuthContext.js
import React, { createContext, useState, useEffect } from "react";
import Cookies from "js-cookie";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const checkAuth = () => {
    const token = Cookies.get("token");
    setIsLoggedIn(!!token);
  };

  useEffect(() => {
    checkAuth();
    // Nếu cần, bạn có thể thêm một cơ chế để lắng nghe thay đổi cookie
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
