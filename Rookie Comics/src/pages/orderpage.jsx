const Orders = () => {
    return (
        <div class="orders-container">

            {/* Header */}
            <div class="orders-header">
                <div class="col-lg-4 ">
                    <div class="product">
                        <input type="checkbox" />
                        <span>Sản Phẩm</span>
                    </div>
                </div>
                <div class="orders-text col-lg-8">
                    <span class="">PricePrice</span>
                    <span class="">Quantity</span>
                    <span class="">Total</span>
                    <span class="">Actions</span>
                </div>
            </div>
            {/* Product Item */}
            <div class="product-details">
                <div class="product col-lg-4 px-2">
                    <div>
                        <input type="checkbox" />
                        <img src="/assets/img/sidebar/comment-4.jpg" alt="comment" />
                    </div>
                    <span>Chapter 11 </span>
                </div>
                <div class="orders-text col-lg-8">
                    <span>50 coin </span>
                    <div class="quantity-control">
                        <button>-</button>
                        <input type="text" value="1" readOnly />
                        <button>+</button>
                    </div>
                    <span>50 coin</span>
                    <div class="actions">
                        <a href="#">Delete</a>
                        <a href="#">Find Similar</a>
                    </div>
                </div>
            </div>

            {/* Product Item 2 */}
            <div class="product-details">
                <div class="product col-lg-4 px-2">
                    <div>
                        <input type="checkbox" />
                        <img src="/assets/img/sidebar/comment-4.jpg" alt="comment" />
                    </div>
                    <span>Chapter 11 </span>
                </div>
                <div class="orders-text col-lg-8">
                    <span>50 coin </span>
                    <div class="quantity-control">
                        <button>-</button>
                        <input type="text" value="1" readOnly />
                        <button>+</button>
                    </div>
                    <span>50 coin</span>
                    <div class="actions">
                        <a href="#">Delete</a>
                        <a href="#">Find Similar</a>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div class="orders-footer">
                <div class="footer-text col-lg-7">
                    <div>
                        <input type="checkbox" />
                        <span>Select All (1)</span>
                    </div>
                    <a href="#">Delete</a>
                    <a href="#" class="text-red">Move to My Likes</a>
                </div>
                <div class="orders-text col-lg-5">
                    <span>Total (0 item):</span>
                    <span class="total-price">0 coin</span>
                    <button class="buy-button">Check out</button>
                </div>
            </div>


        </div>
    );
};

export default Orders;