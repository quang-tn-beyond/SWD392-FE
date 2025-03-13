import request from './axios';

// Get all genres


const getAllGenres = () => {
  return request.get('/genres')
      .then(response => response.data)
      .catch(error => {
          if (error.response) {
              // Lỗi từ server (status code khác 2xx)
              console.error('API Error:', error.response.data); // Log chi tiết từ response error
          } else if (error.request) {
              // Không nhận được phản hồi từ server
              console.error('No response from server:', error.request);
          } else {
              // Lỗi khi cấu hình request
              console.error('Error setting up request:', error.message);
          }
      });
};



// Get genre by ID
const getGenreById = (id) => {
    return request.get(`/genres/${id}`);
};

// Add a new genre
const addGenre = (data) => {
    return request.post('/genres', data);
};

// Update an existing genre
const updateGenre = (id, data) => {
    return request.put(`/genres/${id}`, data);
};

// Soft delete a genre
const deleteGenre = (id) => {
    return request.delete(`/genres/${id}`);
};

// Restore a deleted genre
const restoreGenre = (id) => {
    return request.put(`/genres/restore/${id}`);
};

export {
    getAllGenres,
    getGenreById,
    addGenre,
    updateGenre,
    deleteGenre,
    restoreGenre
};
