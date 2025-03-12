import request from './axios';

// Generate the VNPAY payment URL
const getVnPayPaymentUrl = () => {
    return request.get('/vnpays/payment')
        .then(response => {
            // Assuming the payment URL is returned in the response
            return response.data;
        })
        .catch(error => {
            console.error('Error generating VNPAY payment URL:', error);
            throw error;
        });
};

export { getVnPayPaymentUrl };
