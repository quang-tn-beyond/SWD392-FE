import React, { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";  // Giải mã token JWT
import { GoogleLogin } from "@react-oauth/google";  // Dùng Google OAuth login
import { getUserById } from "../utils/UserService"; // Import API để lấy dữ liệu người dùng

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);  // Đảm bảo user ban đầu là null

  // Kiểm tra và lấy dữ liệu người dùng từ API
  const checkAuth = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decodedToken = jwtDecode(token); // Giải mã token

        // Kiểm tra xem token có hết hạn không
        if (decodedToken.exp * 1000 < Date.now()) {
          console.warn("Token đã hết hạn.");
          logout();
          return;
        }

        // Lấy dữ liệu người dùng từ API bằng cách sử dụng sub (Google user ID)
        const response = await getUserById(decodedToken.sub);  // sub là Google user ID
        const userData = response.data;

        const formattedUser = {
          userId: userData.userId,
          email: userData.email,
          firstName: userData.family_name || '',
          lastName: userData.given_name || '',
          fullName: `${userData.family_name || ''} ${userData.given_name || ''}`,
          role: userData.roleEnum,  // Sử dụng roleEnum thay vì role
          authorities: Array.isArray(userData.authorities)
            ? userData.authorities.map((auth) => auth.authority)
            : [],
          imageUrl: userData.imageUrl || '', // Thêm imageUrl nếu có
        };

        setUser(formattedUser);
        setIsLoggedIn(true);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu người dùng từ API:", error);
        logout();
      }
    } else {
      setUser(null);
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Token from localStorage:", token);  // Log token ra console
    if (token) {
      checkAuth();  // Kiểm tra trạng thái xác thực khi ứng dụng tải
    }
  }, []);
  
  

  // Xử lý đăng nhập thành công qua Google
  const handleGoogleLoginSuccess = async (response) => {
    console.log("Google Login Success:", response);  // Log toàn bộ response

    const { credential } = response;
    if (!credential) {
      console.error("Không có credential trong response");
      return;
    }

    try {
      // Giải mã token và log toàn bộ dữ liệu người dùng
      const userData = jwtDecode(credential);  
      console.log("Decoded User Data:", userData);  // Log dữ liệu đã giải mã

      // Lấy thêm thông tin người dùng từ People API
      const peopleApiResponse = await fetch(`https://people.googleapis.com/v1/people/me?personFields=names,emailAddresses,photos`, {
        headers: {
          Authorization: `Bearer ${credential}`,
        },
      });

      const peopleData = await peopleApiResponse.json();
      console.log("Google People API Response:", peopleData);

      const givenName = peopleData.names[0]?.givenName || 'Chưa có tên';
      const familyName = peopleData.names[0]?.familyName || 'Chưa có họ';
      const picture = peopleData.photos[0]?.url || '';

      const user = {
        userId: userData.sub,  // Dùng Google user ID làm userId
        email: peopleData.emailAddresses[0]?.value || '',  // Email
        firstName: givenName,
        lastName: familyName,
        fullName: `${givenName} ${familyName}`,
        imageUrl: picture,
        role: "CUSTOMER_NORMAL",  // Vai trò mặc định hoặc từ token nếu có
      };

      // Log thông tin người dùng đã được tạo
      console.log("User Object:", user);

      setUser(user);
      setIsLoggedIn(true);
      localStorage.setItem("token", credential);  // Lưu token vào localStorage
      checkAuth();
    } catch (error) {
      console.error("Lỗi khi xử lý đăng nhập Google:", error);
    }
  };

  // Xử lý đăng xuất
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsLoggedIn(false);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Token from localStorage:", token);  // Log token ra console
    checkAuth();  // Kiểm tra trạng thái xác thực khi ứng dụng tải
  }, []);
  

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, setUser, setIsLoggedIn, checkAuth, logout, handleGoogleLoginSuccess }}>
      {children}
    </AuthContext.Provider>
  );
};
