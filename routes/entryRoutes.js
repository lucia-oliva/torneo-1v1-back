import { Router } from 'express';
import {
  getEntries,
  getEntryById,
  createEntry,
  updateEntryById,
  deleteEntryById,
} from '../controllers/entryController.js';

const router = Router();

router.get('/', getEntries);
router.get('/:id', getEntryById);
router.post('/', createEntry);
router.put('/:id', updateEntryById);
router.delete('/:id', deleteEntryById);

export default router;