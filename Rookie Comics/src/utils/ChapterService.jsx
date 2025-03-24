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
const createChapter = (data) => {
  return request.post('chapters', JSON.stringify(data), {
     
  });
};

// Update a chapter by ID
const updateChapterById = ( data, chapterId) => {
  return request.put(`chapters/${chapterId}`, data, {
     
  });
};

// Delete a chapter by ID
const deleteChapterById = (chapterId) => {
  return request.delete(`chapters/${chapterId}`, {
     
  });
};

// Search chapters (you can modify this if there are specific search parameters)
const searchChapters = (params) => {
  return request.get('chapters/search', { params });
};

const reviewChapter = (chapterId, isApproved, modComment) => {
  return request.post(
    'chapters/review',
    null, // Không có body trong request, thông tin sẽ được truyền qua params
    {
      params: {
        chapterId,
        isApproved,
        modComment
      }
    }
  );
};

export {
  getAllChapters,
  getChapterById,
  createChapter,
  updateChapterById,
  deleteChapterById,
  searchChapters,
  reviewChapter,
};
