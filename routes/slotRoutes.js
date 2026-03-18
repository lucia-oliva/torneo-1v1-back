import { Router } from 'express';
import { getSlots, seedDefaultSlots } from '../controllers/slotController.js';

const router = Router();

router.get('/', getSlots);
router.post('/seed', seedDefaultSlots);

export default router;