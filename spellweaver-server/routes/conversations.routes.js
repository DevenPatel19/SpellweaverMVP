import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { ensureConversation, postMessage, getMessages } from '../controllers/conversations.controller.js';

const router = Router();

router.post('/ensure', authMiddleware, ensureConversation);          // create or get conversation
router.post('/:id/messages', authMiddleware, postMessage);
router.get('/:id/messages', authMiddleware, getMessages);

export default router;
