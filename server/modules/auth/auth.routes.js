import { Router } from 'express';
import * as authController from './auth.controller.js';
import { authenticateToken } from '../../middlewares/auth.js';

const router = Router();

// As per PDF Page 5:
// POST /api/v1/auth/login
// POST /api/v1/auth/logout
// POST /api/v1/auth/register
// GET  /api/v1/auth/me
router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/logout', authController.logout);
router.get('/me', authenticateToken, authController.getMe);

export default router;
