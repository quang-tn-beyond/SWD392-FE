import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../components/AuthContext";
import { addOrder, getOrdersByUserIdAndStatus, updateOrderStatus } from "../utils/OrderService"; // Import API
import { getUserIdByEmail } from "../utils/UserService"; // Import hàm getUserIdByEmail

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [showPurchaseModal, setShowPurchaseModal] = useState(false);
    const [selectedChapters, setSelectedChapters] = useState([]);
    const { user } = useContext(AuthContext);

    // Load giỏ hàng từ localStorage khi trang được tải
    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
        setCartItems(storedCart);
    }, []);

    // Mở modal thanh toán khi bấm nút Thanh toán
    const handlePurchaseClick = async () => {
        const selectedChaptersData = cartItems.filter((item) => selectedItems.includes(item.chapterId));
        setSelectedChapters(selectedChaptersData); // Lưu mục đã chọn vào selectedChapters
        setShowPurchaseModal(true); // Hiển thị modal thanh toán
    };

    const handlePayment = async () => {
    try {
        const userId = await getUserIdByEmail(user?.email); // Lấy userId từ email
        if (!userId) {
            alert("Không tìm thấy thông tin người dùng!");
            return;
        }

        // 1. Tạo đơn hàng mới
        const orderData = {
            userId,
            status: 0, // Trạng thái mới là chưa hoàn thành
            orderDetails: selectedItems.map((chapterId) => {
                const item = cartItems.find((i) => i.chapterId === chapterId);
                return { chapterId, price: item?.price || 0 };
            }),
        };

        const orderResponse = await addOrder(orderData);
        if (!orderResponse) {
            alert("Thanh toán thất bại, vui lòng thử lại!");
            return;
        }

        // 2. Lấy đơn hàng chưa hoàn thành (UNORDERED) với tham số mới
        const orderRequest = {
            orderId: userId,      // Sử dụng userId làm orderId
            newStatusByte: 0,     // Trạng thái UNORDERED
        };

        const order = await getOrdersByUserIdAndStatus(orderRequest); // Truyền tham số với định dạng mới
        if (!order) {
            alert("Không tìm thấy đơn hàng chưa hoàn thành.");
            return;
        }

        // 3. Cập nhật trạng thái đơn hàng thành "COMPLETED"
        const updateRequest = {
            userId,           // Sử dụng userId
            newStatusByte: 2, // Trạng thái COMPLETED
        };

        const updateResult = await updateOrderStatus(updateRequest); // Truyền tham số với định dạng mới
        if (updateResult) {
            alert("Đơn hàng đã hoàn tất!");
            // Cập nhật lại giỏ hàng sau khi thanh toán
            const updatedCart = cartItems.filter((item) => !selectedItems.includes(item.chapterId));
            setCartItems(updatedCart);
            localStorage.setItem("cart", JSON.stringify(updatedCart));
            setSelectedItems([]);
            setShowPurchaseModal(false); // Đóng modal
        } else {
            alert("Có lỗi xảy ra khi cập nhật trạng thái đơn hàng.");
        }
    } catch (error) {
        console.error("Lỗi khi thanh toán:", error);
        alert("Có lỗi xảy ra, vui lòng thử lại sau!");
    }
};


    // Tính tổng tiền của các chương đã chọn
    const totalPrice = selectedItems.reduce((sum, id) => {
        const item = cartItems.find((i) => i.chapterId === id);
        return sum + (item ? item.price : 0);
    }, 0);

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
                                    style={{ marginRight: '10px' }}
                                />
                                <img src={item.coverUrl || "default-image.jpg"} alt={item.title} />
                            </div>
                            <span>{`${item.name}`}</span>
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
                    <button onClick={clearCart} className="buy-button">Xóa tất cả</button>
                </div>
                <div className="orders-text col-lg-5">
                    <div>
                        <span>Tổng tiền ({selectedItems.length} mục):</span>
                        <span className="total-price">{totalPrice} xu</span>
                    </div>
                    <button
                        className="buy-button"
                        onClick={handlePurchaseClick}  // Mở modal thanh toán
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
                            <p key={chapter.chapterId}>{`${chapter.name}`}</p>
                        ))}
                        <span>Tổng tiền: {totalPrice} xu</span>
                        <div className="modal-buttons">
                            <button className="cart-btn" onClick={handlePayment}>Mua</button> {/* Thực hiện thanh toán */}
                        </div>
                        <button className="close-btn" onClick={() => setShowPurchaseModal(false)}>Đóng</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;
