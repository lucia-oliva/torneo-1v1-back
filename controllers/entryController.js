import mongoose from 'mongoose';
import Entry from '../models/Entry.js';
import Slot from '../models/Slot.js';

export const getEntries = async (req, res) => {
  try {
    const { day, slotId } = req.query;
    const filters = {};

    if (day !== undefined) {
      filters.day = Number(day);
    }

    if (slotId) {
      if (!mongoose.Types.ObjectId.isValid(slotId)) {
        return res.status(400).json({
          ok: false,
          message: 'slotId inválido',
        });
      }

      filters.slotId = slotId;
    }

    const entries = await Entry.find(filters)
      .populate('slotId', 'name active')
      .sort({ day: 1, createdAt: -1, updatedAt: -1 });

    return res.status(200).json({
      ok: true,
      data: entries,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'Error al obtener entries',
      error: error.message,
    });
  }
};

export const getEntryById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        ok: false,
        message: 'id inválido',
      });
    }

    const entry = await Entry.findById(id).populate('slotId', 'name active');

    if (!entry) {
      return res.status(404).json({
        ok: false,
        message: 'No existe el registro',
      });
    }

    return res.status(200).json({
      ok: true,
      data: entry,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'Error al obtener entry',
      error: error.message,
    });
  }
};

export const createEntry = async (req, res) => {
  try {
    const {
      slotId,
      day,
      kills = 0,
      position = 'none',
      tiktokPoints = 0,
      sanctionType = null,
      penaltyPoints = 0,
    } = req.body;

    if (!slotId || !mongoose.Types.ObjectId.isValid(slotId)) {
      return res.status(400).json({
        ok: false,
        message: 'slotId inválido',
      });
    }

    const slotExists = await Slot.findById(slotId);

    if (!slotExists) {
      return res.status(404).json({
        ok: false,
        message: 'El slot no existe',
      });
    }

    const newEntry = await Entry.create({
      slotId,
      day: Number(day),
      kills: Number(kills || 0),
      position,
      tiktokPoints: Number(tiktokPoints || 0),
      sanctionType: sanctionType || null,
      penaltyPoints: Number(penaltyPoints || 0),
    });

    const populatedEntry = await Entry.findById(newEntry._id).populate('slotId', 'name active');

    return res.status(201).json({
      ok: true,
      message: 'Registro creado correctamente',
      data: populatedEntry,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'Error al crear entry',
      error: error.message,
    });
  }
};

export const updateEntryById = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      kills = 0,
      position = 'none',
      tiktokPoints = 0,
      sanctionType = null,
      penaltyPoints = 0,
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        ok: false,
        message: 'id inválido',
      });
    }

    const updatedEntry = await Entry.findByIdAndUpdate(
      id,
      {
        $set: {
          kills: Number(kills || 0),
          position,
          tiktokPoints: Number(tiktokPoints || 0),
          sanctionType: sanctionType || null,
          penaltyPoints: Number(penaltyPoints || 0),
        },
      },
      {
        new: true,
        runValidators: true,
      }
    ).populate('slotId', 'name active');

    if (!updatedEntry) {
      return res.status(404).json({
        ok: false,
        message: 'No existe el registro para actualizar',
      });
    }

    return res.status(200).json({
      ok: true,
      message: 'Registro actualizado correctamente',
      data: updatedEntry,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'Error al actualizar entry',
      error: error.message,
    });
  }
};

export const deleteEntryById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        ok: false,
        message: 'id inválido',
      });
    }

    const deleted = await Entry.findByIdAndDelete(id).populate('slotId', 'name active');

    if (!deleted) {
      return res.status(404).json({
        ok: false,
        message: 'No existe el registro para eliminar',
      });
    }

    return res.status(200).json({
      ok: true,
      message: 'Registro eliminado correctamente',
      data: deleted,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'Error al eliminar entry',
      error: error.message,
    });
  }
};