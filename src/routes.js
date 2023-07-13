import Joi from'joi';
import {
    addBookHandler,
    getAllBooksHandler,
    getBookDetailByIdHandler,
    editBookByIdHandler,
    deleteBookByIdHandler
  } from './handler.js';

const bookSchema = Joi.object({
    name: Joi.string().required().messages({
        'string.base': ` Isi nama dengan benar`,
        'string.empty': ` Mohon isi nama buku`,
        'any.required': ` Mohon isi nama buku`
      }),
    year: Joi.number(),
    author: Joi.string(),
    summary: Joi.string(),
    publisher: Joi.string(),
    pageCount: Joi.number(),
    readPage: Joi.number().max(Joi.ref('pageCount')).messages({'number.max': ` readPage tidak boleh lebih besar dari pageCount`}),
    reading: Joi.boolean()
});

const routes = [
    {
        method: 'POST',
        path: '/books',
        handler: addBookHandler,
        options: {
            validate: {
                payload: bookSchema,
                failAction: (req, h, source, error) => {  
                    error = "Gagal menambahkan buku."                                   
                    const response = h.response({
                        status: 'fail',
                        message: error + source.details[0].message,
                    }).takeover();
                    response.code(400);
                    return response;                      
                }
            }
        }
    },
    {
        method: 'GET',
        path: '/books',
        handler: getAllBooksHandler,
    },
    {
        method: 'GET',
        path: '/books/{bookId}',
        handler: getBookDetailByIdHandler,
    },
    {
        method: 'PUT',
        path: '/books/{bookId}',
        handler: editBookByIdHandler,
        options: {
            validate: {
                payload: bookSchema,
                failAction: (req, h, source, error) => {    
                    error = "Gagal memperbarui buku."                               
                    const response = h.response({
                        status: 'fail',
                        message: error + source.details[0].message,
                    }).takeover();
                    response.code(400);
                    return response;                      
                }
            }
        }
    },
    {
        method: 'DELETE',
        path: '/books/{bookId}',
        handler: deleteBookByIdHandler,
    },

];
 
export default routes;