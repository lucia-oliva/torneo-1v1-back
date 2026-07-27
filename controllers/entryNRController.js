import mongoose from 'mongoose';
import EntryNR from '../models/EntryNR.js';
import SlotNR from '../models/SlotNR.js';

export const getEntriesNR = async (req, res) => {
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
          message: 'slotId invalido',
        });
      }

      filters.slotId = slotId;
    }

    const entries = await EntryNR.find(filters)
      .populate('slotId', 'name active')
      .sort({ day: 1, createdAt: -1, updatedAt: -1 });

    return res.status(200).json({
      ok: true,
      data: entries,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'Error al obtener entries de NovaRush',
      error: error.message,
    });
  }
};

export const deleteAllEntriesNR = async (_req, res) => {
  try {
    const result = await EntryNR.deleteMany({});

    return res.status(200).json({
      ok: true,
      message: 'Tabla de NovaRush reiniciada correctamente',
      data: {
        deletedCount: result.deletedCount,
      },
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'Error al reiniciar tabla de NovaRush',
      error: error.message,
    });
  }
};

export const getEntryNRById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        ok: false,
        message: 'id invalido',
      });
    }

    const entry = await EntryNR.findById(id).populate('slotId', 'name active');

    if (!entry) {
      return res.status(404).json({
        ok: false,
        message: 'No existe el registro de NovaRush',
      });
    }

    return res.status(200).json({
      ok: true,
      data: entry,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'Error al obtener entry de NovaRush',
      error: error.message,
    });
  }
};

export const createEntryNR = async (req, res) => {
  try {
    const {
      slotId,
      day,
      kills = 0,
      position = 'none',
      sanctionType = null,
      penaltyPoints = 0,
    } = req.body;

    if (!slotId || !mongoose.Types.ObjectId.isValid(slotId)) {
      return res.status(400).json({
        ok: false,
        message: 'slotId invalido',
      });
    }

    const slotExists = await SlotNR.findById(slotId);

    if (!slotExists) {
      return res.status(404).json({
        ok: false,
        message: 'El slot de NovaRush no existe',
      });
    }

    const newEntry = await EntryNR.create({
      slotId,
      day: Number(day),
      kills: Number(kills || 0),
      position,
      sanctionType: sanctionType || null,
      penaltyPoints: Number(penaltyPoints || 0),
    });

    const populatedEntry = await EntryNR.findById(newEntry._id).populate('slotId', 'name active');

    return res.status(201).json({
      ok: true,
      message: 'Registro de NovaRush creado correctamente',
      data: populatedEntry,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'Error al crear entry de NovaRush',
      error: error.message,
    });
  }
};

export const updateEntryNRById = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      kills = 0,
      position = 'none',
      sanctionType = null,
      penaltyPoints = 0,
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        ok: false,
        message: 'id invalido',
      });
    }

    const updatedEntry = await EntryNR.findByIdAndUpdate(
      id,
      {
        $set: {
          kills: Number(kills || 0),
          position,
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
        message: 'No existe el registro de NovaRush para actualizar',
      });
    }

    return res.status(200).json({
      ok: true,
      message: 'Registro de NovaRush actualizado correctamente',
      data: updatedEntry,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'Error al actualizar entry de NovaRush',
      error: error.message,
    });
  }
};

export const deleteEntryNRById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        ok: false,
        message: 'id invalido',
      });
    }

    const deleted = await EntryNR.findByIdAndDelete(id).populate('slotId', 'name active');

    if (!deleted) {
      return res.status(404).json({
        ok: false,
        message: 'No existe el registro de NovaRush para eliminar',
      });
    }

    return res.status(200).json({
      ok: true,
      message: 'Registro de NovaRush eliminado correctamente',
      data: deleted,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'Error al eliminar entry de NovaRush',
      error: error.message,
    });
  }
};
