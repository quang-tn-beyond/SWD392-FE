import request from './axios';

// Lấy tất cả comic
const getAllComics = () => {
  return request.get('/comics');
};

// Lấy comic theo trạng thái
const getComicsByStatus = (status) => {
  return request.get(`/comics/${status}`);
};

// Lấy comic theo ID
const getComicsById = (comicId) => {
  return request.get(`/comics/${comicId}`);
};

// Lấy comic theo thể loại
const getComicsByGenresName = (genresName) => {
  return request.get(`/comics/genres/${genresName}`);
};

// Thêm mới comic
const createComic = (data) => {
  return request.post('/comics', data);
};

// Cập nhật comic theo ID
const updateComicById = (comicId, data) => {
  return request.put(`/comics/update/${comicId}`, data);
};

// Xóa comic theo ID
const deleteComicById = (comicId) => {
  return request.delete(`/comics/${comicId}`);
};

// const incrementViews = (comicId) => {
//   return request.post(`/comics/${comicId}/increment-views`);
// };



export {
  getAllComics,
  getComicsByStatus,
  getComicsByGenresName,
  getComicsById,
  createComic,
  updateComicById,
  deleteComicById,
};
