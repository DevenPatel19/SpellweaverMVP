import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { castSpell } from '../controllers/spellcasts.controller.js';

const router = Router();

router.post('/:id/cast', authMiddleware, castSpell);

export default router;
