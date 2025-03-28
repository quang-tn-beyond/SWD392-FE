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
const addOrder = (data) => {
    return request.post('orders', data);
};

// Update an existing order by ID
const updateOrders = (id, data) => {
    return request.put(`orders/${id}`, data);
};

// Delete an order by ID
const deleteOrders = (id) => {
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
    addOrder,
    updateOrders,
    deleteOrders,
    updateOrderStatus
};
