import request from './axios';

// Lấy tất cả comic
const getAllComics = () => {
  return request.get('/comics');
};

// Lấy comic theo trạng thái
const getComicsByStatus = (status) => {
  return request.get(`/comics/${status}`);
};

// Lấy comic theo tên
const getComicsByName = (comicName) => {
  return request.get(`/comics/${comicName}`);
};

// Lấy comic theo thể loại
const getComicsByGenresName = (genresName) => {
  return request.get(`/comics/genres/${genresName}`);
};

// Thêm mới comic
const saveComic = (data) => {
  return request.post('/comics/create', data);
};

// Cập nhật comic theo ID
const updateComicById = (comicId, data) => {
  return request.put(`/comics/update/${comicId}`, data);
};

// Xóa comic theo ID
const deleteComicById = (comicId) => {
  return request.delete(`/comics/delete/${comicId}`);
};

// const incrementViews = (comicId) => {
//   return request.post(`/comics/${comicId}/increment-views`);
// };



export {
  getAllComics,
  getComicsByStatus,
  getComicsByName,
  getComicsByGenresName,
  saveComic,
  updateComicById,
  deleteComicById,
};
