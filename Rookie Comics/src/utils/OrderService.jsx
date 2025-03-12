import request from './axios';

// Get all orders
const getAllOrders = () => {
    return request.get('orders');
};

// Get an order by its ID
const getOrdersById = (ordersId) => {
    return request.post(`orders/${ordersId}`);
};

// Create a new order
const createOrder = (data) => {
    return request.post('orders/new-order', data);
};

// Update an existing order by ID
const updateOrder = (id, data) => {
    return request.put(`orders/${id}`, data);
};

// Delete an order by ID
const deleteOrder = (id) => {
    return request.delete(`orders/${id}`);
};

// Update the status of an order
const updateOrderStatus = (id, status) => {
    return request.put(`orders/${id}/status`, null, {
        params: { status }
    });
};

export {
    getAllOrders,
    getOrdersById,
    createOrder,
    updateOrder,
    deleteOrder,
    updateOrderStatus
};
