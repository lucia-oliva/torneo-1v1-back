import { Router } from 'express';
import { getSlotsNR, seedDefaultSlotsNR, updateSlotNRById } from '../controllers/slotNRController.js';

const router = Router();

router.get('/', getSlotsNR);
router.post('/seed', seedDefaultSlotsNR);
router.put('/:id', updateSlotNRById);

export default router;
