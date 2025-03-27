import request from './axios';

// Get all users
const getAllUsers = () => {
    return request.get('/users');
};

// Get a user by ID
const getUserById = (id) => {
    return request.get(`/users/${id}`);
};

// Add a new user
const addUser = (data) => {
    return request.post('/users', data);
};

// Delete a user by ID
const deleteUser = (id) => {
    return request.delete(`/users/${id}`);
};

// Get admin and staff users
const getAdminAndStaffUsers = () => {
    return request.get('/users/admin-staff');
};

// Get customer users
const getCustomerUsers = () => {
    return request.get('/users/customers');
};

// Update user role
const updateUserRole = (id, role) => {
    console.log("API Request: /users/" + id + "/role", role);  // Log yêu cầu API
    return request.put(`/users/${id}/role`, null, { params: { role } });
};

// Hàm gọi API để lấy userId từ email
const getUserIdByEmail = async (email) => {
    try {
      const response = await request.get(`/users/getUserIdByEmail`, {
        params: { email }, // Truyền email vào params
      });
  
      // Trả về userId nếu có
      if (response.data && response.data.userId) {
        return response.data.userId; 
      } else {
        console.error('Không có userId trong dữ liệu trả về');
        return null;
      }
    } catch (error) {
      console.error('Lỗi khi gọi API:', error);
      return null;
    }
  };
  

// Login with Google (handles OAuth)
const loginWithGoogle = (credential) => {
    return request.post('/users/auth/google', { credential });
};

// Logout
const logout = () => {
    return request.get('/users/logout');
};

export {
    getAllUsers,
    getUserById,
    addUser,
    deleteUser,
    getAdminAndStaffUsers,
    getCustomerUsers,
    updateUserRole,
    getUserIdByEmail,
    loginWithGoogle,
    logout
};
