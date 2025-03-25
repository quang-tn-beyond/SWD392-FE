import request from './axios';

// Get all genres
const getAllGenres = () => {
  return request.get('/genres');
};

// Get genre by ID
const getGenreById = (id) => {
    return request.get(`/genres/${id}`);
};

// Add a new genre (Ensure correct payload format)
// Thêm thể loại mới
// Thêm thể loại mới
const addGenre = (data) => {
    console.log("📝 Dữ liệu trước khi tạo payload:", data);

    // Tạo payload để gửi đi theo đúng định dạng của backend
    const payload = {
        genresDescription: data?.genresDescription?.trim() || "",  // 'description' đổi thành 'genresDescription'
        genresName: data?.genresName?.trim() || "",  // 'name' đổi thành 'genresName'
        status: data?.status === "active" ? 1 : 0,  // Chuyển 'active' thành 1 và 'inactive' thành 0
    };

    console.log("📤 Payload gửi đi:", payload); // Log payload gửi lên để kiểm tra

    return request.post('/genres', payload);  // Gửi dữ liệu tới backend
};

// Cập nhật thể loại đã có
const updateGenre = (id, data) => {
    const payload = {
        genresDescription: data?.genresDescription?.trim() || "",  // 'description' đổi thành 'genresDescription'
        genresName: data?.genresName?.trim() || "",  // 'name' đổi thành 'genresName'
        status: data?.status === "active" ? 1 : 0,  // Chuyển 'active' thành 1 và 'inactive' thành 0
    };

    console.log("📤 Payload cập nhật:", payload);  // Log payload gửi lên để kiểm tra

    return request.put(`/genres/${id}`, payload);  // Gửi dữ liệu PUT để cập nhật thể loại
};



// Soft delete a genre
const deleteGenre = (id) => {
    return request.delete(`/genres/${id}`);  // Gửi request DELETE để xóa thể loại
};

// Restore a deleted genre
const restoreGenre = (id) => {
    return request.put(`/genres/restore/${id}`);  // Gửi request PUT để phục hồi thể loại đã xóa
};

export {
    getAllGenres,
    getGenreById,
    addGenre,
    updateGenre,
    deleteGenre,
    restoreGenre
};
