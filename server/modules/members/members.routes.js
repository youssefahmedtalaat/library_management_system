import { Router } from 'express';
import * as memberController from './members.controller.js';
import { authenticateToken, requireRole } from '../../middlewares/auth.js';

const router = Router();

// As per PDF Page 5:
// GET /api/v1/members/me/loans
router.get('/me/loans', authenticateToken, memberController.getMyLoans);
router.get('/me/reservations', authenticateToken, memberController.getMyReservations);
router.get('/me/fines', authenticateToken, memberController.getMyFines);

// Staff lookup routes
router.get('/', authenticateToken, requireRole('librarian', 'admin'), memberController.getMembers);
router.get('/:id', authenticateToken, requireRole('librarian', 'admin'), memberController.getMember);

export default router;
