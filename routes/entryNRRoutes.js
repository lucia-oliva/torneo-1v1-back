import { Router } from 'express';
import {
  getEntriesNR,
  getEntryNRById,
  createEntryNR,
  updateEntryNRById,
  deleteEntryNRById,
  deleteAllEntriesNR,
} from '../controllers/entryNRController.js';

const router = Router();

router.get('/', getEntriesNR);
router.delete('/', deleteAllEntriesNR);
router.get('/:id', getEntryNRById);
router.post('/', createEntryNR);
router.put('/:id', updateEntryNRById);
router.delete('/:id', deleteEntryNRById);

export default router;
