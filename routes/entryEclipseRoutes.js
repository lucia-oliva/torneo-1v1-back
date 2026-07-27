import { Router } from 'express';
import {
  getEntriesEclipse,
  getEntryEclipseById,
  createEntryEclipse,
  updateEntryEclipseById,
  deleteEntryEclipseById,
  deleteAllEntriesEclipse,
} from '../controllers/entryEclipseController.js';

const router = Router();

router.get('/', getEntriesEclipse);
router.delete('/', deleteAllEntriesEclipse);
router.get('/:id', getEntryEclipseById);
router.post('/', createEntryEclipse);
router.put('/:id', updateEntryEclipseById);
router.delete('/:id', deleteEntryEclipseById);

export default router;
