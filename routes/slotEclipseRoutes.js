import { Router } from 'express';
import {
  getSlotsEclipse,
  seedDefaultSlotsEclipse,
  updateSlotEclipseById,
} from '../controllers/slotEclipseController.js';

const router = Router();

router.get('/', getSlotsEclipse);
router.post('/seed', seedDefaultSlotsEclipse);
router.put('/:id', updateSlotEclipseById);

export default router;
