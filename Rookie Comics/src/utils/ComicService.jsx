import request from './axios';

// Lấy tất cả các comic
const getAllComics = () => {
  const token = localStorage.getItem('google_token');  // Lấy token Google từ localStorage
  return request.get('comics', {
    headers: {
      Authorization: `Bearer ${token}`,  // Thêm Bearer token vào header
    },
  });
};

// Lấy comics theo trạng thái
const getComicsByStatus = (status) => {
  const token = localStorage.getItem('google_token');
  return request.get(`comics/${status}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Lấy comic theo tên
const getComicsByName = (comicName) => {
  const token = localStorage.getItem('google_token');
  return request.get(`comics/${comicName}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Lấy comics theo thể loại
const getComicsByGenresName = (genresName) => {
  const token = localStorage.getItem('google_token');
  return request.get(`comics/genres/${genresName}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Thêm mới comic
const saveComic = (data) => {
  const token = localStorage.getItem('google_token');
  return request.post('comics/create', data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Cập nhật thông tin comic
const updateComicById = (data, comicId) => {
  const token = localStorage.getItem('google_token');
  return request.put(`comics/update/${comicId}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Xóa comic
const deleteComicById = (comicId) => {
  const token = localStorage.getItem('google_token');
  return request.delete(`comics/delete/${comicId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export {
  getAllComics,
  getComicsByStatus,
  getComicsByName,
  getComicsByGenresName,
  saveComic,
  updateComicById,
  deleteComicById,
};
