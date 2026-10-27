import { Router } from 'express';
import * as circController from './circulation.controller.js';
import { authenticateToken, requireRole } from '../../middlewares/auth.js';

const router = Router();

// As per PDF Page 5:
// POST /api/v1/loans                - إعارة نسخة بواسطة الموظف
// POST /api/v1/loans/:id/return     - إرجاع نسخة بواسطة الموظف
// POST /api/v1/loans/:id/renew      - طلب تجديد مع فحص السياسة في الخادم
// POST /api/v1/reservations         - تسجيل حجز عضو
// GET  /api/v1/reservations         - قائمة الحجوزات
// POST /api/v1/reservations/:id/cancel
// GET  /api/v1/fines
// POST /api/v1/fines/:id/settle

// Loans
router.post('/loans', authenticateToken, requireRole('librarian', 'admin'), circController.issueLoan);
router.post('/loans/:id/return', authenticateToken, requireRole('librarian', 'admin'), circController.returnLoan);
router.post('/loans/:id/renew', authenticateToken, circController.renewLoan);

// Reservations
router.post('/reservations', authenticateToken, circController.createReservation);
router.get('/reservations', authenticateToken, circController.getReservations);
router.post('/reservations/:id/cancel', authenticateToken, circController.cancelReservation);

// Fines
router.get('/fines', authenticateToken, circController.getFines);
router.post('/fines/:id/settle', authenticateToken, requireRole('librarian', 'admin'), circController.settleFine);

export default router;
