import Slot from '../models/Slot.js';
import mongoose from 'mongoose';

export const getSlots = async (_req, res) => {
  try {
    const slots = await Slot.find({ active: true }).sort({ name: 1 });

    res.status(200).json({
      ok: true,
      data: slots,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: 'Error al obtener slots',
      error: error.message,
    });
  }
};

export const seedDefaultSlots = async (_req, res) => {
  try {
    const existing = await Slot.find({});

    if (existing.length > 0) {
      return res.status(200).json({
        ok: true,
        message: 'Los slots ya existen',
        data: existing,
      });
    }

    const created = await Slot.insertMany([
      { name: 'Slot 1', active: true },
      { name: 'Slot 2', active: true },
      { name: 'Slot 3', active: true },
      { name: 'Slot 4', active: true },
      { name: 'Slot 5', active: true },
      { name: 'Slot 6', active: true },
      { name: 'Slot 7', active: true },
      { name: 'Slot 8', active: true },
      { name: 'Slot 9', active: true },
      { name: 'Slot 10', active: true },
      { name: 'Slot 11', active: true },
      { name: 'Slot 12', active: true },
      { name: 'Slot 13', active: true },
      { name: 'Slot 14', active: true },
      { name: 'Slot 15', active: true },
      { name: 'Slot 16', active: true },
      { name: 'Slot 17', active: true },
    ]);

    res.status(201).json({
      ok: true,
      message: 'Slots creados correctamente',
      data: created,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: 'Error al crear slots',
      error: error.message,
    });
  }
};

export const updateSlotById = async (req, res) => {
  try {
    const { id } = req.params;
    const name = String(req.body?.name || '').trim();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        ok: false,
        message: 'slotId invalido',
      });
    }

    if (!name) {
      return res.status(400).json({
        ok: false,
        message: 'El nombre del slot es obligatorio',
      });
    }

    if (name.length > 40) {
      return res.status(400).json({
        ok: false,
        message: 'El nombre del slot no puede superar los 40 caracteres',
      });
    }

    const updatedSlot = await Slot.findByIdAndUpdate(
      id,
      { name },
      { new: true, runValidators: true }
    );

    if (!updatedSlot) {
      return res.status(404).json({
        ok: false,
        message: 'El slot no existe',
      });
    }

    return res.status(200).json({
      ok: true,
      message: 'Slot actualizado correctamente',
      data: updatedSlot,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'Error al actualizar slot',
      error: error.message,
    });
  }
};
