import { Router } from 'express';
import * as aiController from './ai.controller.js';
import { optionalAuthenticate } from '../../middlewares/auth.js';

const router = Router();

// As per PDF Page 5 & 6:
// POST /api/v1/ai/assistant
router.post('/assistant', optionalAuthenticate, aiController.askAssistant);

export default router;
