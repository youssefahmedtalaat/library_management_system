import { Router } from 'express';
import * as adminController from './admin.controller.js';
import { authenticateToken, requireRole } from '../../middlewares/auth.js';

const router = Router();

// Protect all admin routes with authentication and 'admin' role
router.use(authenticateToken, requireRole('admin'));

// Staff management
router.get('/staff', adminController.getStaff);
router.post('/staff', adminController.createStaff);
router.put('/staff/:id/status', adminController.updateStaffStatus);

// System policies
router.get('/policies', adminController.getPolicies);
router.put('/policies', adminController.updatePolicies);

// Regulatory audit logs
router.get('/audit-logs', adminController.getAuditLogs);

export default router;
