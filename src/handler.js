import { nanoid } from 'nanoid'
import booksData from './books.js';
export const getAllBooksHandler = (request) => {
    let query = request.query;
    let result;
    console.log(Object.hasOwn(query,Object.keys(request.query)[0]))
    switch(Object.keys(request.query)[0]) {
        case "reading":
            result = booksData.filter(book=> book.reading == query.reading).map(book => ({"id": book.id, "name": book.name, "publisher": book.publisher}));
            break;
        case "finished":
            result = booksData.filter(book=> book.finished == query.finished).map(book => ({"id": book.id, "name": book.name, "publisher": book.publisher}));
            break;
        case "name":
            console.log(booksData.filter(book=> new RegExp(query.name).test(book.name)))
            result = booksData.filter(book=> new RegExp(query.name, 'i').test(book.name)).map(book => ({"id": book.id, "name": book.name, "publisher": book.publisher}));
            break;
        default:
            result = booksData.map(book => ({"id": book.id, "name": book.name, "publisher": book.publisher}));
    }

    return ({
        status: 'success',
        data: {"books":result},
    })
};

export const addBookHandler = (request, h) => {
    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading
    } = request.payload;

    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    let finished = pageCount === readPage? true : false;
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
    booksData.push(newBook);

    const isSuccess = booksData.filter((book) => book.id === id).length > 0;
    if (isSuccess) {
        const response = h.response({
        status: 'success',
        message: 'Buku berhasil ditambahkan',
        data: {
            bookId: id,
        },
        });
        response.code(201);
        return response;
    }
    const response = h.response({
        status: 'fail',
        message: 'Buku gagal ditambahkan',
    });
    response.code(500);
    return response;
};

export const getBookDetailByIdHandler = (request, h) => {
    const {
        bookId
    } = request.params;
    const book = booksData.filter((book) => book.id === bookId)[0];

    if (book !== undefined) {
        h.code= 200
        return {
            status: 'success',
            data: {
                book,
            },
        };
    }
    const response = h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
    });
    response.code(404);
    return response;
};

export const editBookByIdHandler = (request, h) => {
    const { bookId } = request.params;
    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading
    } = request.payload;
    const updatedAt = new Date().toISOString();
    const index = booksData.findIndex((book) => book.id === bookId);
    if (index !== -1) {
        Object.assign(booksData[index], {
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            reading,
            updatedAt
        });
        const response = h.response({
        status: 'success',
        message: 'Buku berhasil diperbarui',
        });
        response.code(200);
        return response;
    }
    const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(404);
    return response;
};

export const deleteBookByIdHandler = (request, h) => {
    const { bookId } = request.params;

    const index = booksData.findIndex((book) => book.id === bookId);

    if (index !== -1) {
        booksData.splice(index, 1);
        const response = h.response({
        status: 'success',
        message: 'Buku berhasil dihapus',
        });
        response.code(200);
        return response;
    }
    const response = h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
    response.code(404);
    return response;
};
