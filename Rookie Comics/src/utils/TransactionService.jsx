import request from './axios';

// Get all transactions
const getAllTransactions = () => {
    return request.get('transaction/getAll');
};

// Get a transaction by its ID
const getTransactionById = (id) => {
    return request.get(`transaction/getById/${id}`);
};

// Add a new transaction
const addTransaction = (data) => {
    return request.post('transaction/post', data);
};

// Update a transaction by ID
const updateTransaction = (id, data) => {
    return request.put(`transaction/update/${id}`, data);
};

// Delete a transaction by ID
const deleteTransaction = (id) => {
    return request.delete(`transaction/delete/${id}`);
};

export {
    getAllTransactions,
    getTransactionById,
    addTransaction,
    updateTransaction,
    deleteTransaction
};
