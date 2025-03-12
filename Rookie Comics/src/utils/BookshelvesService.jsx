import request from './axios';

// Create a new bookshelf for a user
const createBookshelf = (userId, data) => {
    return request.post(`bookshelves/create/${userId}`, data);
};

// Delete a bookshelf by its ID
const deleteBookshelf = (bookshelfId) => {
    return request.delete(`bookshelves/delete/${bookshelfId}`);
};

// Get all bookshelves by user ID
const getBookshelvesByUser = (userId) => {
    return request.get(`bookshelves/user/${userId}`);
};

// Add a comic to a specific bookshelf
const addComicToBookshelf = (bookshelfId, comicId) => {
    return request.post(`bookshelves/${bookshelfId}/addComic/${comicId}`);
};

// Remove a comic from a specific bookshelf
const removeComicFromBookshelf = (bookshelfId, comicId) => {
    return request.delete(`bookshelves/${bookshelfId}/removeComic/${comicId}`);
};

export {
    createBookshelf,
    deleteBookshelf,
    getBookshelvesByUser,
    addComicToBookshelf,
    removeComicFromBookshelf
};
