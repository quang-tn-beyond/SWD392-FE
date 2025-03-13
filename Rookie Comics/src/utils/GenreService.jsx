import request from './axios';

// Get all genres
const getAllGenres = () => {
  return request.get('/genres')
      .then(response => response.data)
      .catch(error => {
          if (error.response) {
              console.error('API Error:', error.response.data);
          } else if (error.request) {
              console.error('No response from server:', error.request);
          } else {
              console.error('Error setting up request:', error.message);
          }
      });
};

// Get genre by ID
const getGenreById = (id) => {
    return request.get(`/genres/${id}`);
};

// Add a new genre (Ensure correct payload format)
const addGenre = (data) => {
    console.log("📝 Dữ liệu trước khi tạo payload:", data);

    const payload = {
        genres_name: data?.genres_name?.trim() || "",
        genres_description: data?.genres_description?.trim() || "",
        status: data?.status === "active" ? 1 : 0,
    };

    console.log("📤 Payload gửi đi:", payload); // Log payload gửi lên

    return request.post('/genres', payload);
};


// Update an existing genre
const updateGenre = (id, data) => {
    const payload = {
        genres_name: data?.genres_name?.trim() || "",
        genres_description: data?.genres_description?.trim() || "",
        status: data?.status === "active" ? 1 : 0,
    };

    console.log("📤 Payload cập nhật:", payload);

    return request.put(`/genres/${id}`, payload);
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
