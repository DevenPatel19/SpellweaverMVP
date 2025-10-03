import { Router } from 'express';
import { listSpells, createSpell, updateSpell, deleteSpell } from '../controllers/spells.controller.js';
import { castSpell } from '../controllers/spellcasts.controller.js'
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authMiddleware); // all routes below require login

router.get('/', listSpells);
router.post('/', createSpell);
router.patch('/:id', updateSpell);
router.delete('/:id', deleteSpell);

// POST /api/v1/spells/:id/cast
router.post('/:id/cast', castSpell);

export default router;
