import request from './axios';

// Get all wallets
const getAllWallets = () => {
    return request.get('/wallets')
        .then(response => response.data)
        .catch(error => {
            console.error('Error fetching all wallets:', error);
            throw error;
        });
};

// Get a wallet by ID
const getWalletById = (id) => {
    return request.get(`/wallets/${id}`)
        .then(response => response.data)
        .catch(error => {
            console.error('Error fetching wallet by ID:', error);
            throw error;
        });
};

// Create a new wallet
const createWallet = (walletData) => {
    return request.post('/wallets/new-wallet', walletData)
        .then(response => response.data)
        .catch(error => {
            console.error('Error creating wallet:', error);
            throw error;
        });
};

// Update a wallet by ID
const updateWallet = (id, walletDTO) => {
    return request.put(`/wallets/updating/${id}`, walletDTO)
        .then(response => response.data)
        .catch(error => {
            console.error('Error updating wallet:', error);
            throw error;
        });
};

const getMainWallet = (userId) => {
    return request.get(`/wallets/${userId}/main-wallet`)    
};

const getPromotionWallet = (userId) => {
    return request.get(`/wallets/${userId}/promotion-wallet`)    
};

export {
    getAllWallets,
    getWalletById,
    createWallet,
    updateWallet,
    getMainWallet,
    getPromotionWallet,
};
