import request from './axios';

// Get all chapters
const getAllChapters = () => {
  return request.get('chapters');
};

// Get a chapter by ID
const getChapterById = (chapterId) => {
  return request.get(`chapters/${chapterId}`);
};

// Create a new chapter
const createChapter = (token, data) => {
  return request.post('chapters', data, {
     
  });
};

// Update a chapter by ID
const updateChapterById = (token, data, chapterId) => {
  return request.put(`chapters/${chapterId}`, data, {
     
  });
};

// Delete a chapter by ID
const deleteChapterById = (token, chapterId) => {
  return request.delete(`chapters/${chapterId}`, {
     
  });
};

// Search chapters (you can modify this if there are specific search parameters)
const searchChapters = (params) => {
  return request.get('chapters/search', { params });
};

export {
  getAllChapters,
  getChapterById,
  createChapter,
  updateChapterById,
  deleteChapterById,
  searchChapters,
};
