import mongoose from 'mongoose';
import SlotNR from '../models/SlotNR.js';

export const getSlotsNR = async (_req, res) => {
  try {
    const slots = await SlotNR.find({ active: true }).sort({ name: 1 });

    return res.status(200).json({
      ok: true,
      data: slots,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'Error al obtener slots de NovaRush',
      error: error.message,
    });
  }
};

export const seedDefaultSlotsNR = async (_req, res) => {
  try {
    const existing = await SlotNR.find({});

    if (existing.length > 0) {
      return res.status(200).json({
        ok: true,
        message: 'Los slots de NovaRush ya existen',
        data: existing,
      });
    }

    const created = await SlotNR.insertMany(
      Array.from({ length: 25 }, (_, index) => ({
        name: `Slot ${index + 1}`,
        active: true,
      }))
    );

    return res.status(201).json({
      ok: true,
      message: 'Slots de NovaRush creados correctamente',
      data: created,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'Error al crear slots de NovaRush',
      error: error.message,
    });
  }
};

export const updateSlotNRById = async (req, res) => {
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

    const updatedSlot = await SlotNR.findByIdAndUpdate(
      id,
      { name },
      { new: true, runValidators: true }
    );

    if (!updatedSlot) {
      return res.status(404).json({
        ok: false,
        message: 'El slot de NovaRush no existe',
      });
    }

    return res.status(200).json({
      ok: true,
      message: 'Slot de NovaRush actualizado correctamente',
      data: updatedSlot,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'Error al actualizar slot de NovaRush',
      error: error.message,
    });
  }
};
