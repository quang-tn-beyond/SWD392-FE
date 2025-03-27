import React, { useEffect, useState } from "react";

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    console.log("Cart data:", JSON.parse(localStorage.getItem("cart")));


    // Load giỏ hàng từ localStorage khi trang được tải
    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
        setCartItems(storedCart);
    }, []);

    // Chọn hoặc bỏ chọn một mục trong giỏ hàng
    const handleSelectItem = (chapterId) => {
        setSelectedItems((prevSelected) =>
            prevSelected.includes(chapterId)
                ? prevSelected.filter((item) => item !== chapterId)
                : [...prevSelected, chapterId]
        );
    };

    // Chọn hoặc bỏ chọn tất cả mục trong giỏ hàng
    const handleSelectAll = () => {
        if (selectedItems.length === cartItems.length) {
            setSelectedItems([]);
        } else {
            setSelectedItems(cartItems.map((item) => item.chapterId));
        }
    };

    // Xóa một mục khỏi giỏ hàng
    const removeFromCart = (chapterId) => {
        const updatedCart = cartItems.filter((item) => item.chapterId !== chapterId);
        setCartItems(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        setSelectedItems((prevSelected) => prevSelected.filter((item) => item !== chapterId));
    };

    // Xóa toàn bộ giỏ hàng
    const clearCart = () => {
        setCartItems([]);
        localStorage.removeItem("cart");
        setSelectedItems([]);
    };

    return (
        <div className="orders-container">
            {/* Header */}
            <div className="orders-header">
                <div className="col-lg-4">
                    <div className="product">
                        <span>Sản Phẩm</span>
                    </div>
                </div>
                <div className="orders-text col-lg-8">
                    <span>Giá</span>
                    <span>Hành động</span>
                </div>
            </div>

            {/* Hiển thị sản phẩm trong giỏ */}
            {cartItems.length > 0 ? (
                cartItems.map((item, index) => (
                    <div className="product-details" key={index}>
                        <div className="product col-lg-4 px-2">
                            <div>
                                <input
                                    type="checkbox"
                                    checked={selectedItems.includes(item.chapterId)}
                                    onChange={() => handleSelectItem(item.chapterId)}
                                />
                                {/* Nếu có ảnh thì hiển thị, không có thì để placeholder */}
                                <img src={item.coverUrl || "default-image.jpg"} alt={item.title} />
                            </div>
                            <span>{`${item.title} - Chương ${item.name}`}</span>
                        </div>
                        <div className="orders-text col-lg-8">
                            <span>{item.price} xu</span>
                            <div className="actions">
                                <button onClick={() => removeFromCart(item.chapterId)}>Xóa</button>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <p className="empty-cart">Giỏ hàng trống</p>
            )}

            {/* Footer */}
            <div className="orders-footer">
                <div className="footer-text col-lg-7">
                    <div>
                        <input
                            type="checkbox"
                            checked={selectedItems.length === cartItems.length && cartItems.length > 0}
                            onChange={handleSelectAll}
                        />
                        <span>Chọn tất cả ({cartItems.length})</span>
                    </div>
                    <button onClick={clearCart} className="text-red">Xóa tất cả</button>
                </div>
                <div className="orders-text col-lg-5">
                    <div>
                        <span>Tổng tiền ({selectedItems.length} mục):</span>
                        <span className="total-price">{cartItems.filter((item) => selectedItems.includes(item.chapterId)).reduce((sum, item) => sum + item.price, 0)} xu</span>
                    </div>
                    <button className="buy-button">Thanh toán</button>
                </div>
            </div>
        </div>
    );
};

export default Cart;