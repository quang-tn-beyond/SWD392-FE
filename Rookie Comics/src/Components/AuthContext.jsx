import React, { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  // Kiểm tra đăng nhập từ localStorage
  const checkAuth = () => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const userData = {
          email: decodedToken.sub, // Lấy email từ JWT
          role: decodedToken.role,
        };

        setUser(userData);
        setIsLoggedIn(true);
      } catch (error) {
        console.error("Lỗi khi giải mã token:", error);
        logout();
      }
    } else {
      setUser(null);
      setIsLoggedIn(false);
    }
  };

  // Xử lý logout
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsLoggedIn(false);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, setUser, setIsLoggedIn, checkAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
