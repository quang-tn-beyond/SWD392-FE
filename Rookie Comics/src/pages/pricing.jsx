import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../components/AuthContext";
import { createMomoQR } from "../utils/MomoService";
import { getUserIdByEmail } from "../utils/UserService";
import { useNavigate } from "react-router-dom";

const Pricing = () => {
    const { user } = useContext(AuthContext);
    const [billingCycle, setBillingCycle] = useState("option1");
    const [purchasedPlans, setPurchasedPlans] = useState({});
    const [countdowns, setCountdowns] = useState({});
    const [qrCodeUrl, setQrCodeUrl] = useState(null);
    const [userId, setUserId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserId = async () => {
            if (user && user.email) {
                try {
                    const fetchedUserId = await getUserIdByEmail(user.email);
                    setUserId(fetchedUserId);
                } catch (error) {
                    console.log('Không thể lấy userId từ email:', error);
                }
            }
        };

        fetchUserId();
    }, [user]);

    const handlePurchase = async (plan) => {
        if (!user || !user.email || !userId) {
            alert("Người dùng chưa đăng nhập");
            return;
        }
    
        // Nếu người dùng chọn gói nạp xu (ví dụ 30000, 45000, 60000)
        let price, coin;
        if (typeof plan === 'number') {
            price = plan.toString(); // Chuyển giá trị số thành chuỗi
            coin = plan.toString();  // Chuyển giá trị số thành chuỗi
        } else if (plan === "Premium") {
            price = "60000";
            coin = "60000";
        } else if (plan === "Author") {
            price = "100000";
            coin = "100000";
        }
    
        const returnUrl = "http://localhost:3000/momo-callback"; // Trang phản hồi sau thanh toán
        const ipnUrl = "http://localhost:8080/momo/ipn-handler"; // API xử lý IPN
    
        try {
            // Tạo request body với dữ liệu theo định dạng yêu cầu
            const requestData = {
                price,
                coin,
                userId,
                returnUrl,
                ipnUrl,
            };
    
            // Gửi dữ liệu tới backend để tạo mã QR
            const response = await createMomoQR(requestData);
    
            if (response.data && response.data.payUrl) {
                window.location.href = response.data.payUrl; // Chuyển đến trang thanh toán MoMo
            }
        } catch (error) {
            console.error("Lỗi khi tạo thanh toán MoMo:", error);
        }
    };
    
    

    return (
        <div className="pricing-container">
            <div className="text-center mb-4">
                <div className="toggle-switch">
                    <button
                        className={`btn ${billingCycle === "option1" ? "active" : ""}`}
                        onClick={() => setBillingCycle("option1")}
                    >
                        Gói Nâng Cấp
                    </button>
                    <button
                        className={`btn ${billingCycle === "option2" ? "active" : ""}`}
                        onClick={() => setBillingCycle("option2")}
                    >
                        Gói Nạp Xu
                    </button>
                </div>
            </div>

            <div className="d-flex justify-content-center gap-4">
                {billingCycle === "option1" ? (
                    <>
                        {["Premium", "Author"].map((plan) => (
                            <div className="pricing-card" key={plan}>
                                <div className="card-body">
                                    <h2 className="card-title">{plan} {purchasedPlans[plan] && `(${countdowns[plan]} ngày)`}</h2>
                                    <div className="price-info">
                                        <span className="price">{plan === "Premium" ? "60000 Xu" : "100000 Xu"}</span>
                                        <span className="per-month">/tháng</span>
                                    </div>
                                    <button className="btn btn-primary w-100 mb-3" onClick={() => handlePurchase(plan)}>Mua gói</button>
                                </div>
                            </div>
                        ))}
                    </>
                ) : (
                    [30000, 45000, 60000].map((amount, index) => (
                        <div className="pricing-card" key={index}>
                            <div className="card-body">
                                <h2 className="card-title">Gói {amount/1000}k</h2>
                                <div className="price-info">
                                    <span className="price">{amount.toLocaleString()} đ</span>
                                </div>
                                <button className="btn btn-primary w-100 mb-3" onClick={() => handlePurchase(amount)}>Mua gói</button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Pricing;
