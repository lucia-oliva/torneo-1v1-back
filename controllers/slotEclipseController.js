import mongoose from 'mongoose';
import SlotEclipse from '../models/SlotEclipse.js';

export const getSlotsEclipse = async (_req, res) => {
  try {
    const slots = await SlotEclipse.find({ active: true }).sort({ name: 1 });

    return res.status(200).json({
      ok: true,
      data: slots,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'Error al obtener slots de NovaEclipse',
      error: error.message,
    });
  }
};

export const seedDefaultSlotsEclipse = async (_req, res) => {
  try {
    const existing = await SlotEclipse.find({});

    if (existing.length > 0) {
      return res.status(200).json({
        ok: true,
        message: 'Los slots de NovaEclipse ya existen',
        data: existing,
      });
    }

    const created = await SlotEclipse.insertMany(
      Array.from({ length: 25 }, (_, index) => ({
        name: `Slot ${index + 1}`,
        active: true,
      }))
    );

    return res.status(201).json({
      ok: true,
      message: 'Slots de NovaEclipse creados correctamente',
      data: created,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'Error al crear slots de NovaEclipse',
      error: error.message,
    });
  }
};

export const updateSlotEclipseById = async (req, res) => {
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

    const updatedSlot = await SlotEclipse.findByIdAndUpdate(
      id,
      { name },
      { new: true, runValidators: true }
    );

    if (!updatedSlot) {
      return res.status(404).json({
        ok: false,
        message: 'El slot de NovaEclipse no existe',
      });
    }

    return res.status(200).json({
      ok: true,
      message: 'Slot de NovaEclipse actualizado correctamente',
      data: updatedSlot,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'Error al actualizar slot de NovaEclipse',
      error: error.message,
    });
  }
};
