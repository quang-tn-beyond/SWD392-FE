import request from './axios';

// Get all purchased coins
const getAllPurchasedCoins = () => {
    return request.get('purchasedCoins');
};

// Get a purchased coin by its ID
const getPurchasedCoinsById = (id) => {
    return request.get(`purchasedCoins/${id}`);
};

// Add a new purchased coin entry
const addPurchasedCoins = (data) => {
    return request.post('purchasedCoins', data);
};

// Update a purchased coin by ID
const updatePurchasedCoins = (id, data) => {
    return request.put(`purchasedCoins/${id}`, data);
};

// Delete a purchased coin by ID
const deletePurchasedCoins = (id) => {
    return request.delete(`purchasedCoins/${id}`);
};



export {
    getAllPurchasedCoins,
    getPurchasedCoinsById,
    addPurchasedCoins,
    updatePurchasedCoins,
    deletePurchasedCoins,
   
};
