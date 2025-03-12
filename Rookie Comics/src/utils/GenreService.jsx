import request from "./axios";

// Lấy tất cả các genres
const getAllGenres = async () => {
  try {
    const response = await request.get('/genres');  // Use the correct endpoint
    return response.data;
  } catch (error) {
    console.error('Error fetching all genres:', error);
  }
};

// Lấy genre theo ID
const getGenreById = async (genreId) => {
  try {
    const response = await request.get(`/genres/${genreId}`);  // Use the correct endpoint
    return response.data;
  } catch (error) {
    console.error(`Error fetching genre by ID ${genreId}:`, error);
  }
};

// Thêm mới genre
const saveGenre = async (data) => {
  try {
    const token = localStorage.getItem('google_token');  // Giả sử token Google được lưu ở đây
    const response = await request.post('/genres', data, { // Correct endpoint
      headers: {
        Authorization: `Bearer ${token}`,  // Gửi token Google nếu có
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error saving new genre:', error);
  }
};

// Cập nhật genre
const updateGenre = async (genreId, data) => {
  try {
    const token = localStorage.getItem('google_token');
    const response = await request.put(`/genres/${genreId}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating genre with ID ${genreId}:`, error);
  }
};

// Xóa genre
const deleteGenre = async (genreId) => {
  try {
    const token = localStorage.getItem('google_token');
    const response = await request.delete(`/genres/${genreId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error deleting genre with ID ${genreId}:`, error);
  }
};

// Khôi phục genre đã xóa
const restoreGenre = async (genreId) => {
  try {
    const token = localStorage.getItem('google_token');
    const response = await request.put(`/genres/restore/${genreId}`, null, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error restoring genre with ID ${genreId}:`, error);
  }
};

export {
  getAllGenres,
  getGenreById,
  saveGenre,
  updateGenre,
  deleteGenre,
  restoreGenre,
};
