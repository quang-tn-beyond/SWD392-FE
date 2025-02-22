import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import { GoogleLogin } from "@react-oauth/google";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleManualLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("http://localhost:8080/login", {
        email,
        password,
      });
      const { token } = response.data;
      localStorage.setItem("token", token);
      const decodedToken = jwtDecode(token);
      setRole(decodedToken.role);
      navigate("/admin");
    } catch (error) {
      setError("Đăng nhập thất bại! Vui lòng kiểm tra lại email và mật khẩu.");
      console.error("Login error:", error);
    }
  };

  const handleSuccess = async (response) => {
    console.log("Google Token:", response.credential);
    try {
      setLoading(true);
      const res = await fetch("http://localhost:8080/users/login/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential: response.credential }),
      });

      const data = await res.json();
      console.log("User data:", data);

      if (res.ok && data.token) {
        localStorage.setItem("token", data.token);
        const decodedToken = jwtDecode(data.token);
        setRole(decodedToken.role);
        toast.success("Đăng nhập thành công!");
        navigate(data.redirectUrl || "/");
      } else {
        console.error("Server returned an error:", data);
        toast.error(data.error || "Đăng nhập thất bại!");
      }
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Lỗi kết nối đến server!");
    }
    setLoading(false);
  };

  const handleGoogleError = () => {
    toast.error("Google Sign In was unsuccessful. Try again later");
  };

  return (
    <>
      <section
        className="normal-breadcrumb set-bg"
        style={{ backgroundImage: "url('/assets/img/normal-breadcrumb.jpg')" }}
      >
        <div className="container">
          <div className="row">
            <div className="col-lg-12 text-center">
              <div className="normal__breadcrumb__text">
                <h2>Login</h2>
                <p>Welcome to the official Manga blog.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="login spad">
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              <div className="login__form">
                <h3>Login with username</h3>
                {error && <p style={{ color: "red" }}>{error}</p>}
                <form onSubmit={handleManualLogin}>
                  <div className="input__item">
                    <input
                      type="text"
                      placeholder="Email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <span className="icon_mail"></span>
                  </div>
                  <div className="input__item">
                    <input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <span className="icon_lock"></span>
                  </div>
                  <button type="submit" className="site-btn">
                    Login Now
                  </button>
                </form>
                <Link to="/forgot-password" className="forget_pass">
                  Forgot Your Password?
                </Link>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="login__register">
                <h3>Sign in With Google</h3>
                <div style={{ marginBottom: "10px" }}>
                  <GoogleLogin
                    onSuccess={handleSuccess}
                    onError={handleGoogleError}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="login__register text-center" style={{ marginTop: "20px" }}>
            <h3>Chưa có tài khoản?</h3>
            <Link to="/register" className="primary-btn">
              Register Now
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
