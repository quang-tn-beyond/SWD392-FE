import request from './axios';

// Get all current chapters
const getAllCurrentChapters = () => {
    return request.get('currentChapter');
};

// Add a new current chapter
const addCurrentChapter = (data) => {
    return request.post('currentChapter', data);
};

// Update an existing current chapter by ID
const updateCurrentChapter = (id, data) => {
    return request.put(`currentChapter/${id}`, data);
};

// Get a specific current chapter by ID
const getCurrentChapterById = (id) => {
    return request.get(`currentChapter/${id}`);
};

// Delete a current chapter by ID
const deleteCurrentChapter = (id) => {
    return request.delete(`currentChapter/${id}`);
};

export {
    getAllCurrentChapters,
    addCurrentChapter,
    updateCurrentChapter,
    getCurrentChapterById,
    deleteCurrentChapter
};
