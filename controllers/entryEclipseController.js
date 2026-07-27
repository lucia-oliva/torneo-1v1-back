import mongoose from 'mongoose';
import EntryEclipse from '../models/EntryEclipse.js';
import SlotEclipse from '../models/SlotEclipse.js';

export const getEntriesEclipse = async (req, res) => {
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

    const entries = await EntryEclipse.find(filters)
      .populate('slotId', 'name active')
      .sort({ day: 1, createdAt: -1, updatedAt: -1 });

    return res.status(200).json({
      ok: true,
      data: entries,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'Error al obtener entries de NovaEclipse',
      error: error.message,
    });
  }
};

export const deleteAllEntriesEclipse = async (_req, res) => {
  try {
    const result = await EntryEclipse.deleteMany({});

    return res.status(200).json({
      ok: true,
      message: 'Tabla de NovaEclipse reiniciada correctamente',
      data: {
        deletedCount: result.deletedCount,
      },
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'Error al reiniciar tabla de NovaEclipse',
      error: error.message,
    });
  }
};

export const getEntryEclipseById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        ok: false,
        message: 'id invalido',
      });
    }

    const entry = await EntryEclipse.findById(id).populate('slotId', 'name active');

    if (!entry) {
      return res.status(404).json({
        ok: false,
        message: 'No existe el registro de NovaEclipse',
      });
    }

    return res.status(200).json({
      ok: true,
      data: entry,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'Error al obtener entry de NovaEclipse',
      error: error.message,
    });
  }
};

export const createEntryEclipse = async (req, res) => {
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

    const slotExists = await SlotEclipse.findById(slotId);

    if (!slotExists) {
      return res.status(404).json({
        ok: false,
        message: 'El slot de NovaEclipse no existe',
      });
    }

    const newEntry = await EntryEclipse.create({
      slotId,
      day: Number(day),
      kills: Number(kills || 0),
      position,
      sanctionType: sanctionType || null,
      penaltyPoints: Number(penaltyPoints || 0),
    });

    const populatedEntry = await EntryEclipse.findById(newEntry._id).populate('slotId', 'name active');

    return res.status(201).json({
      ok: true,
      message: 'Registro de NovaEclipse creado correctamente',
      data: populatedEntry,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'Error al crear entry de NovaEclipse',
      error: error.message,
    });
  }
};

export const updateEntryEclipseById = async (req, res) => {
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

    const updatedEntry = await EntryEclipse.findByIdAndUpdate(
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
        message: 'No existe el registro de NovaEclipse para actualizar',
      });
    }

    return res.status(200).json({
      ok: true,
      message: 'Registro de NovaEclipse actualizado correctamente',
      data: updatedEntry,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'Error al actualizar entry de NovaEclipse',
      error: error.message,
    });
  }
};

export const deleteEntryEclipseById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        ok: false,
        message: 'id invalido',
      });
    }

    const deleted = await EntryEclipse.findByIdAndDelete(id).populate('slotId', 'name active');

    if (!deleted) {
      return res.status(404).json({
        ok: false,
        message: 'No existe el registro de NovaEclipse para eliminar',
      });
    }

    return res.status(200).json({
      ok: true,
      message: 'Registro de NovaEclipse eliminado correctamente',
      data: deleted,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'Error al eliminar entry de NovaEclipse',
      error: error.message,
    });
  }
};
