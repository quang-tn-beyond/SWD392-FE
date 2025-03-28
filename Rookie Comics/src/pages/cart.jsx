import React, { useEffect, useState } from "react";

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [showPurchaseModal, setShowPurchaseModal] = useState(false);
    const [selectedChapters, setSelectedChapters] = useState([]);
    const [userBalance, setUserBalance] = useState(1000); // Giả định số dư xu của người dùng

    // Load giỏ hàng từ localStorage khi trang được tải
    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
        setCartItems(storedCart);
    }, []);

    // Chọn hoặc bỏ chọn một mục trong giỏ hàng
    const handleSelectItem = (chapterId) => {
        setSelectedItems((prevSelected) =>
            prevSelected.includes(chapterId)
                ? prevSelected.filter((id) => id !== chapterId)
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
        setSelectedItems((prevSelected) => prevSelected.filter((id) => id !== chapterId));
    };

    // Xóa toàn bộ giỏ hàng
    const clearCart = () => {
        setCartItems([]);
        localStorage.removeItem("cart");
        setSelectedItems([]);
    };

    // Mở modal thanh toán
    const handlePurchaseClick = () => {
        const selectedChaptersData = cartItems.filter((item) => selectedItems.includes(item.chapterId));
        setSelectedChapters(selectedChaptersData);
        setShowPurchaseModal(true);
    };

    // Tính tổng tiền của các chương đã chọn
    const totalPrice = selectedItems.reduce((sum, id) => {
        const item = cartItems.find((i) => i.chapterId === id);
        return sum + (item ? item.price : 0);
    }, 0);

    // Xử lý khi nhấn "Mua"
    const handlePurchase = () => {
        if (totalPrice > userBalance) {
            alert("Bạn không có đủ xu để thanh toán!");
            return;
        }

        const newBalance = userBalance - totalPrice;
        setUserBalance(newBalance);
        alert("Thanh toán thành công! Số dư còn lại: " + newBalance + " xu");
        setShowPurchaseModal(false);

        // Lấy danh sách chapter đã mua từ localStorage
        let purchasedChapters = JSON.parse(localStorage.getItem("purchasedChapters")) || [];

        // Thêm các chapter mới mua vào danh sách
        purchasedChapters = [...purchasedChapters, ...selectedItems];

        // Lưu lại vào localStorage
        localStorage.setItem("purchasedChapters", JSON.stringify(purchasedChapters));

        // Xóa các mục đã mua khỏi giỏ hàng
        const updatedCart = cartItems.filter((item) => !selectedItems.includes(item.chapterId));
        setCartItems(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
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
                cartItems.map((item) => (
                    <div className="product-details" key={item.chapterId}>
                        <div className="product col-lg-4 px-2">
                            <div>
                                <input
                                    type="checkbox"
                                    checked={selectedItems.includes(item.chapterId)}
                                    onChange={() => handleSelectItem(item.chapterId)}
                                />
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
                        <span className="total-price">{totalPrice} xu</span>
                    </div>
                    <button
                        className="buy-button"
                        onClick={selectedItems.length > 0 ? handlePurchaseClick : null}
                        disabled={selectedItems.length === 0}
                    >
                        Thanh toán
                    </button>
                </div>
            </div>

            {/* Modal thanh toán */}
            {showPurchaseModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h4>Thanh toán</h4>
                        {selectedChapters.map((chapter) => (
                            <p key={chapter.chapterId}>{`${chapter.title} - Chương ${chapter.name}`}</p>
                        ))}
                        <span>Tổng tiền: {totalPrice} xu</span>
                        <div className="modal-buttons">
                            <button className="cart-btn" onClick={handlePurchase}>Mua</button>
                        </div>
                        <button className="close-btn" onClick={() => setShowPurchaseModal(false)}>Đóng</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;
