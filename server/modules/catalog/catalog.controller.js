import * as catalogService from './catalog.service.js';
import { successResponse, errorResponse } from '../../utils/response.js';

export async function getBooks(req, res, next) {
  try {
    const { q, category, availability, page, limit } = req.query;
    const result = await catalogService.listBooks({ q, category, availability, page, limit });
    return successResponse(res, result.books, 200, { pagination: result.pagination });
  } catch (err) {
    next(err);
  }
}

export async function getBook(req, res, next) {
  try {
    const { id } = req.params;
    const book = await catalogService.getBookById(id);
    return successResponse(res, book);
  } catch (err) {
    next(err);
  }
}

export async function createBook(req, res, next) {
  try {
    const { isbn, title, author, category } = req.body;
    if (!isbn || !title || !author || !category) {
      return errorResponse(res, 'ISBN, title, author, and category are required', 'VALIDATION_ERROR', 400);
    }
    const result = await catalogService.createBook(req.body, req.user?.id);
    return successResponse(res, result, 201, { message: 'Book created successfully' });
  } catch (err) {
    next(err);
  }
}

export async function updateBook(req, res, next) {
  try {
    const { id } = req.params;
    const result = await catalogService.updateBook(id, req.body, req.user?.id);
    return successResponse(res, result, 200, { message: 'Book updated successfully' });
  } catch (err) {
    next(err);
  }
}

export async function deleteBook(req, res, next) {
  try {
    const { id } = req.params;
    const result = await catalogService.archiveBook(id, req.user?.id);
    return successResponse(res, result, 200, { message: 'Book archived successfully' });
  } catch (err) {
    next(err);
  }
}

export async function getCategories(_req, res, next) {
  try {
    const categories = await catalogService.getAllCategories();
    return successResponse(res, categories);
  } catch (err) {
    next(err);
  }
}

export async function getAuthors(_req, res, next) {
  try {
    const authors = await catalogService.getAllAuthors();
    return successResponse(res, authors);
  } catch (err) {
    next(err);
  }
}
