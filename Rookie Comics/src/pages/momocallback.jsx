import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const MoMoCallback = () => {
  const location = useLocation(); // Dùng useLocation để lấy URL query parameters
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const handleMoMoPayment = async () => {
      const urlParams = new URLSearchParams(location.search);
      const orderId = urlParams.get("orderId");
      const requestId = urlParams.get("requestId");
      const resultCode = parseInt(urlParams.get("resultCode") || "99", 10);
      const extraData = urlParams.get("extraData");

      if (!orderId || !requestId) {
        console.log("Thiếu orderId hoặc requestId, không thể gửi lên server.");
        setIsProcessing(false);
        return;
      }

      try {
        // Gửi dữ liệu tới backend để xử lý IPN
        const response = await axios.post("http://localhost:8080/momo/ipn-handler", {
          orderId,
          requestId,
          resultCode,
          extraData,
        });

        if (response.status === 200) {
          console.log("Gửi IPN thành công: ", response.data);
        } else {
          console.log("Gửi IPN thất bại: ", response.status, response.data);
        }
      } catch (error) {
        console.error("Lỗi khi gửi IPN: ", error);
      }

      setIsProcessing(false);
      navigate("/"); // Chuyển hướng về trang chủ sau khi xử lý
    };

    handleMoMoPayment();
  }, [location, navigate]);

  return (
    <div className="callback-container">
      <div className="callback-content">
        {isProcessing ? (
          <div>Đang xử lý thanh toán...</div>
        ) : (
          <div>Thanh toán hoàn tất, đang chuyển về trang chủ...</div>
        )}
      </div>
    </div>
  );
};

export default MoMoCallback;
