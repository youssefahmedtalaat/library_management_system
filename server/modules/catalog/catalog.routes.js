import { Router } from 'express';
import * as catalogController from './catalog.controller.js';
import { authenticateToken, requireRole } from '../../middlewares/auth.js';

const router = Router();

// As per PDF Page 5:
// GET    /api/v1/books?q=&category=&page=
// GET    /api/v1/books/:id
// POST   /api/v1/books
// PUT    /api/v1/books/:id
// DELETE /api/v1/books/:id
router.get('/', catalogController.getBooks);
router.get('/categories', catalogController.getCategories);
router.get('/authors', catalogController.getAuthors);
router.get('/:id', catalogController.getBook);

// Staff/Admin only routes for catalog modification
router.post('/', authenticateToken, requireRole('librarian', 'admin'), catalogController.createBook);
router.put('/:id', authenticateToken, requireRole('librarian', 'admin'), catalogController.updateBook);
router.delete('/:id', authenticateToken, requireRole('admin'), catalogController.deleteBook);

export default router;
