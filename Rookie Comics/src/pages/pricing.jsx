import React, { useState, useEffect } from "react";

const Pricing = () => {
    const [billingCycle, setBillingCycle] = useState("option1");
    const [purchasedPlans, setPurchasedPlans] = useState({});
    const [countdowns, setCountdowns] = useState({});

    useEffect(() => {
        const interval = setInterval(() => {
            setCountdowns((prev) => {
                const newCountdowns = { ...prev };
                Object.keys(newCountdowns).forEach((plan) => {
                    if (newCountdowns[plan] > 0) {
                        newCountdowns[plan] -= 1;
                    }
                });
                return newCountdowns;
            });
        }, 86400000); // Giảm sau mỗi ngày
        return () => clearInterval(interval);
    }, []);

    const handlePurchase = (plan) => {
        setPurchasedPlans((prev) => ({ ...prev, [plan]: true }));
        setCountdowns((prev) => ({ ...prev, [plan]: 30 }));
    };

    const handleCancel = (plan) => {
        setPurchasedPlans((prev) => ({ ...prev, [plan]: false }));
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
                                    {purchasedPlans[plan] ? (
                                        <>
                                            <button className="btn btn-success w-100 mb-3">Gia hạn</button>
                                            <button className="btn btn-danger w-100" onClick={() => handleCancel(plan)}>Hủy gia hạn</button>
                                        </>
                                    ) : (
                                        <button className="btn btn-primary w-100 mb-3" onClick={() => handlePurchase(plan)}>Mua gói</button>
                                    )}
                                    <ul className="benefits-list">
                                        {plan === "Premium" ? (
                                            <>
                                                <li><i className="bi bi-check-circle"></i> 10 Xu/tháng </li>
                                                <li><i className="bi bi-check-circle"></i> Đọc truyện không giới hạn/tháng</li>
                                                <li><i className="bi bi-check-circle"></i> Icon đặc biệt </li>
                                            </>
                                        ) : (
                                            <>
                                                <li><i className="bi bi-check-circle"></i> Không giới hạn đăng truyện / tháng</li>
                                                <li><i className="bi bi-check-circle"></i> Nhận Xu từ Viewer</li>
                                            </>
                                        )}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </>
                ) : (
                    [30000, 45000, 60000].map((amount, index) => (
                        <div className="pricing-card" key={index}>
                            <div className="card-body">
                                <h2 className="card-title">Gói {amount / 1000}k</h2>
                                <div className="price-info">
                                    <span className="price">{amount.toLocaleString()} đ</span>
                                </div>
                                <button className="btn btn-primary w-100 mb-3">Mua gói</button>
                                <ul className="benefits-list">
                                    <li><i className="bi bi-check-circle"></i> Nhận ngay {amount} Xu </li>
                                    <li><i className="bi bi-check-circle"></i> Nhận 1 icon bất kỳ</li>
                                </ul>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Pricing;