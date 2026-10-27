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

export async function submitRating(req, res, next) {
  try {
    const { id } = req.params;
    const { rating, review } = req.body;

    if (rating === undefined || rating === null) {
      return errorResponse(res, 'Rating is required', 'VALIDATION_ERROR', 400);
    }

    const ratingVal = Number(rating);
    if (!Number.isInteger(ratingVal) || ratingVal < 1 || ratingVal > 5) {
      return errorResponse(res, 'Rating must be an integer between 1 and 5', 'VALIDATION_ERROR', 400);
    }

    const result = await catalogService.rateBook(
      id,
      req.user.id,
      ratingVal,
      review || null,
      req.user.full_name
    );

    return successResponse(res, result, 200, { message: 'Rating submitted successfully' });
  } catch (err) {
    next(err);
  }
}

export async function getRatings(req, res, next) {
  try {
    const { id } = req.params;
    const currentUserId = req.user?.id || null;
    const result = await catalogService.getBookRatings(id, currentUserId);
    return successResponse(res, result);
  } catch (err) {
    next(err);
  }
}
