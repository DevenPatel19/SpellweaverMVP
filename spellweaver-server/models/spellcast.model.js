import mongoose from "mongoose";
const { Schema } = mongoose;

const SpellcastSchema = new Schema(
  {
    spellId: {
      type: Schema.Types.ObjectId,
      ref: "Spell",
      required: true,
      index: true,
    },
    castBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    }, // who cast (patient or therapist)
    journal: { type: String }, // optional journal entry
    timestamp: { type: Date, default: Date.now },
    context: Schema.Types.Mixed, // small JSON notes (in prod: encrypt)
    visibleTo: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: false }
);

export default mongoose.model("Spellcast", SpellcastSchema);
