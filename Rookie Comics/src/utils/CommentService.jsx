import request from './axios';

// Get all comments
const getAllComments = () => {
    return request.get('comment');
};

// Add a new comment
const addComment = (data) => {
    return request.post('comment', data);
};

// Update a comment by its ID
const updateComment = (id, data) => {
    return request.put(`comment/${id}`, data);
};

// Get a specific comment by its ID
const getCommentById = (id) => {
    return request.get(`comment/${id}`);
};

// Delete a comment by its ID
const deleteComment = (id) => {
    return request.delete(`comment/${id}`);
};

export {
    getAllComments,
    addComment,
    updateComment,
    getCommentById,
    deleteComment
};
