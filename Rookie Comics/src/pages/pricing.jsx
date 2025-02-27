import React, { useState } from "react";

const Pricing = () => {
    const [billingCycle, setBillingCycle] = useState("month");

    return (
        <div className="pricing-container">

            {/* Toggle Month / Year */}
            <div className="text-center mb-4">
                <div className="toggle-switch">
                    <button
                        className={`btn ${billingCycle === "month" ? "active" : ""}`}
                        onClick={() => setBillingCycle("month")}
                    >
                        Month
                    </button>
                    <button
                        className={`btn ${billingCycle === "year" ? "active" : ""}`}
                        onClick={() => setBillingCycle("year")}
                    >
                        Year
                    </button>
                    <span className="discount-badge">70% off</span>
                </div>
            </div>

            <div className="d-flex justify-content-center gap-4">
                {/* Premium Plan */}
                <div className="pricing-card">
                    <div className="card-body">
                        <h2 className="card-title">Premium</h2>
                        <div className="price-info">
                            <span className="price">{billingCycle === "month" ? "$12.99" : "$99.99"}</span>
                            <span className="per-month">{billingCycle === "month" ? "/month" : "/year"}</span>
                            <span className="discount-badge">30% off</span>
                            <span className="old-price">$18.56</span>
                        </div>
                        <button className="btn btn-primary w-100 mb-3">Pay with Credit / Debit Card</button>
                        <button className="btn btn-secondary w-100 mb-3">Other Payments</button>
                        <ul className="benefits-list">
                            <li><i className="bi bi-check-circle"></i> 10 Coin/month</li>
                            <li><i className="bi bi-check-circle"></i> Unlimited reading/month</li>
                            <li><i className="bi bi-check-circle"></i> Special icon for comment</li>
                        </ul>
                    </div>
                </div>

                {/* Author Plan */}
                <div className="pricing-card">
                    <div className="card-body">
                        <h2 className="card-title">Author</h2>
                        <div className="price-info">
                            <span className="price">{billingCycle === "month" ? "$43.99" : "$200.99"}</span>
                            <span className="per-month">{billingCycle === "month" ? "/month" : "/year"}</span>
                        </div>
                        <button className="btn btn-primary w-100 mb-3">Pay with Credit / Debit Card</button>
                        <button className="btn btn-secondary w-100 mb-3">Other Payments</button>
                        <ul className="benefits-list">
                            <li><i className="bi bi-check-circle"></i> Unlimited posting comic / month</li>
                            <li><i className="bi bi-check-circle"></i> Get coin from Viewer</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Pricing;
