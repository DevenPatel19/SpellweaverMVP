import mongoose from 'mongoose';
const { Schema } = mongoose;

const SpellSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  type: { type: String, enum: ['coping', 'relaxation', 'focus'], default: 'coping' },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

export default mongoose.model('Spell', SpellSchema);
