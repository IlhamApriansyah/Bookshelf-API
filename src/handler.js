// handler.js
const { nanoid } = require('nanoid');
const books = require('./notes');

const addBookHandler = (request, h) => {
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

    if (!name) {
        return h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku',
        }).code(400);
    }

    if (readPage > pageCount) {
        return h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        }).code(400);
    }

    const id = nanoid();
    const finished = pageCount === readPage;
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    const newBook = {
        id,
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        finished,
        reading,
        insertedAt,
        updatedAt,
    };

    books.push(newBook);


    return h.response({
        status: 'success',
        message: 'Buku berhasil ditambahkan',
        data: {
            bookId: id,
        },
    }).code(201);
};

const getAllBooksHandler = (req, res) => {
    const response = {
        status: 'success',
        data: {
            books: books.map(({ id, name, publisher }) => ({ id, name, publisher })),
        },
    };
    return res.response(response).code(200);
};

const getBookByIdHandler = (req, res) => {
    const { bookId } = req.params;
    const book = books.find(b => b.id === bookId);

    if(!book){
        return res.response({
            status: 'fail',
            message: 'Buku tidak ditemukan',
        }).code(404);
    }

    return res.response({
        status: 'success',
        data: {
            book,
        },
    }).code(200);
};

const updateBookHandler = (request, h) => {
    const { bookId } = request.params;
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

    if (!name) {
        return h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku',
        }).code(400);
    }

    if (readPage > pageCount) {
        return h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
        }).code(400);
    }

    const index = books.findIndex((book) => book.id === bookId);

    if (index === -1) {
        return h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Id tidak ditemukan',
        }).code(404);
    }

    const updatedAt = new Date().toISOString();
    books[index] = {
        ...books[index],
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
        updatedAt,
        finished: pageCount === readPage,
    };

    return h.response({
        status: 'success',
        message: 'Buku berhasil diperbarui',
    }).code(200);
};

const deleteBookHandler = (request, h) => {
    const { bookId } = request.params;

    const index = books.findIndex((book) => book.id === bookId);

    if(index === -1){
        return h.response({
            status: 'fail',
            message: 'Buku gagal disimpan. Id tidak ditemukan',
        }).code(404);
    }

    books.splice(index, 1);

    return h.response({
        status: 'success',
        message: 'Buku berhasil dihapus',
    }).code(200);
};


module.exports = {addBookHandler, getAllBooksHandler, getBookByIdHandler, updateBookHandler, deleteBookHandler};