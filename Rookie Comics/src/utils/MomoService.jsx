import request from './axios';

// Create MoMo QR code for payment
const createMomoQR = (data) => {
    return request.post('momo/create', data);
};

// Handle MoMo IPN response
const handleMomoIPN = (data) => {
    return request.post('momo/ipn-handler', data);
};

export {
    createMomoQR,
    handleMomoIPN
};
