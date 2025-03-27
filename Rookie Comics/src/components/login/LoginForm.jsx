import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { AuthContext } from "../AuthContext";
import { toast } from "react-toastify"; // Assuming you're using react-toastify for notifications


export const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { setUser, setIsLoggedIn } = useContext(AuthContext); // Lấy từ AuthContext
  const navigate = useNavigate();

  const handleSuccess = async (response) => {
    console.log("Google Token:", response.credential);
    try {
      setLoading(true);

      const res = await axios.post("http://localhost:8080/users/auth/google", {
        credential: response.credential,
      });

      if (res.status === 200) {
        const { token, redirectUrl } = res.data;

        localStorage.setItem("token", token);
        const decodedToken = jwtDecode(token);
        decodedToken.role = Number(decodedToken.role); // Chuyển role về số

        console.log("Decoded Token:", decodedToken);

        const userData = {
          email: decodedToken.sub || decodedToken.email,
          role: decodedToken.role,
          family_name:decodedToken.family_name,
          given_name:decodedToken.given_name,
        };

        if (!userData.email) {
          console.error("Email không tồn tại trong token!");
        }

        setUser(userData);
        setIsLoggedIn(true);

        toast.success("Đăng nhập thành công!");

        // Điều hướng theo redirectUrl từ Back-end
        navigate(redirectUrl || "/");
      } else {
        console.error("Server returned an error:", res.data);
        toast.error(res.data.error || "Đăng nhập thất bại!");
      }
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Lỗi kết nối đến server!");
    } finally {
      setLoading(false);
    }
  };


  const handleGoogleError = () => {
    toast.error("Google Sign In was unsuccessful. Try again later");
  };
  return (
    <main className="form-container">
      <h1 className="form-title">Sign to your account</h1>
      <GoogleLogin
      onSuccess={handleSuccess}
      onError={handleGoogleError}
      />
    </main>
  );
};
