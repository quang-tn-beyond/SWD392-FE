import request from './axios';

// Get all order details
const getAllOrderDetails = () => {
    return request.get('orders/orderDetail');
};

// Add a new order detail
const addOrderDetail = (data) => {
    return request.post('orders/orderDetail', data);
};

// Update an existing order detail by ID
const updateOrderDetail = (id, data) => {
    return request.put(`orders/orderDetail/${id}`, data);
};

// Get a specific order detail by ID
const getOrderDetailById = (id) => {
    return request.get(`orders/orderDetail/${id}`);
};

// Delete an order detail by ID
const deleteOrderDetail = (id) => {
    return request.delete(`orders/orderDetail/${id}`);
};

// Add a list of order details
const addListOfOrderDetails = (data) => {
    return request.post('orders/orderDetail/add-list-order-details', data);
};

export {
    getAllOrderDetails,
    addOrderDetail,
    updateOrderDetail,
    getOrderDetailById,
    deleteOrderDetail,
    addListOfOrderDetails
};
