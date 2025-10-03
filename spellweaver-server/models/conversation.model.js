import mongoose from 'mongoose';
const { Schema } = mongoose;

const ConversationSchema = new Schema({
  participants: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }]
}, { timestamps: true });

export default mongoose.model('Conversation', ConversationSchema);
