import React, { useEffect } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';

const GoogleAuth = () => {
  useEffect(() => {
    // Tải script Google OAuth
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.onload = () => console.log('Google script loaded');
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleLoginSuccess = (response) => {
    console.log('Google login success:', response);
    
    // Lấy token từ response của Google
    const googleToken = response.credential;
    
    // Gửi token đến backend để xác thực
    sendTokenToBackend(googleToken);
  };

  const handleLoginFailure = (error) => {
    console.error('Google login failed:', error);
  };

  const sendTokenToBackend = async (googleToken) => {
    try {
      // Gửi token đến backend để xác thực
      const response = await axios.post('http://localhost:8080/auth/google', {
        token: googleToken,
      });

      console.log('Backend response:', response.data);
      
      // Nếu đăng nhập thành công, lưu token vào localStorage/cookies
      localStorage.setItem('auth_token', response.data.token);
      
      // Thực hiện điều hướng hoặc hành động khác sau khi đăng nhập thành công
      // Ví dụ: chuyển hướng đến trang dashboard
      window.location.href = '/dashboard';
    } catch (error) {
      console.error('Error sending token to backend:', error);
    }
  };

  return (
    <div>
      <GoogleLogin
        onSuccess={handleLoginSuccess}
        onError={handleLoginFailure}
      />
    </div>
  );
};

export default GoogleAuth;
