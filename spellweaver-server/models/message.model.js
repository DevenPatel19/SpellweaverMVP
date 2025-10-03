import mongoose from 'mongoose';
const { Schema } = mongoose;

const MessageSchema = new Schema({
  conversationId: { type: Schema.Types.ObjectId, ref: 'Conversation', required: true },
  senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  body: { type: String, required: true } // in prod: encrypt
}, { timestamps: true });

export default mongoose.model('Message', MessageSchema);
