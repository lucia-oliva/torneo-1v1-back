import mongoose from 'mongoose';

const slotEclipseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.model('SlotEclipse', slotEclipseSchema, 'slotsEclipse');
