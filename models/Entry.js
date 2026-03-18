import mongoose from "mongoose";

const entrySchema = new mongoose.Schema(
  {
    slotId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Slot",
      required: true,
    },
    day: {
      type: Number,
      required: true,
      enum: [16, 17, 18, 19, 20],
    },
    kills: {
      type: Number,
      default: 0,
      min: 0,
    },
    position: {
      type: String,
      enum: ["none", "first", "second", "third"],
      default: "none",
    },
    tiktokPoints: {
      type: Number,
      default: 0,
      min: 0,
    },
    sanctionType: {
      type: String,
      enum: ["yellow", "red", null],
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
  },
);

export default mongoose.model("Entry", entrySchema);
