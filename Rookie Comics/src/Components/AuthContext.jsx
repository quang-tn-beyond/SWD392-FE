import React, { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

const ROLE_MAP = {
  1: "ADMIN",
  2: "MANAGER",
  3: "MODERATOR",
  4: "STAFF",
  5: "CUSTOMER_NORMAL",
  6: "CUSTOMER_READER",
  7: "CUSTOMER_AUTHOR",
  8: "CUSTOMER_VIP",
};

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  // Kiểm tra đăng nhập từ localStorage
  const checkAuth = () => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decodedToken = jwtDecode(token);

        // Kiểm tra token hết hạn
        if (decodedToken.exp * 1000 < Date.now()) {
          console.warn("Token đã hết hạn.");
          logout();
          return;
        }

        const userData = {
          email: decodedToken.sub, // Lấy email từ JWT
          role: ROLE_MAP[decodedToken.role] || "UNKNOWN", // Chuyển đổi role từ số sang tên
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

  // Kiểm tra quyền theo role
  const hasRole = (roles) => {
    if (!user || !user.role) return false;
    return roles.includes(user.role);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, setUser, setIsLoggedIn, checkAuth, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
};
