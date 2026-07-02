import { Router } from 'express';
import { getSlots, seedDefaultSlots, updateSlotById } from '../controllers/slotController.js';

const router = Router();

router.get('/', getSlots);
router.post('/seed', seedDefaultSlots);
router.put('/:id', updateSlotById);

export default router;
