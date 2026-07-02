import mongoose from 'mongoose';

const entryNRSchema = new mongoose.Schema(
  {
    slotId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SlotNR',
      required: true,
    },
    day: {
      type: Number,
      required: true,
      enum: [1, 2, 3, 4],
    },
    kills: {
      type: Number,
      default: 0,
      min: 0,
    },
    position: {
      type: String,
      enum: ['none', 'first', 'second', 'third'],
      default: 'none',
    },
    sanctionType: {
      type: String,
      enum: ['yellow', 'red', null],
      default: null,
    },
    penaltyPoints: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.model('EntryNR', entryNRSchema, 'entriesNR');
