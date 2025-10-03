import Conversation from '../models/conversation.model.js';
import Message from '../models/message.model.js';

export async function ensureConversation(req, res, next) {
  try {
    const { patientId, therapistId } = req.body;
    if (!patientId || !therapistId) return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'patientId & therapistId required' } });

    let conv = await Conversation.findOne({ participants: { $all: [patientId, therapistId] } });
    if (!conv) conv = await Conversation.create({ participants: [patientId, therapistId] });

    return res.json({ id: conv._id });
  } catch (err) {
    next(err);
  }
}

export async function postMessage(req, res, next) {
  try {
    const { id } = req.params; // conversation id
    const { body } = req.body;
    if (!body) return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'body required' } });

    // authorization: check participant
    const conv = await Conversation.findById(id);
    if (!conv) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'conversation not found' } });
    if (!conv.participants.map(p => p.toString()).includes(req.user.id)) {
      return res.status(403).json({ error: { code: 'FORBIDDEN', message: 'not a participant' } });
    }

    const msg = await Message.create({
      conversationId: id,
      senderId: req.user.id,
      body
    });

    return res.status(201).json({ id: msg._id, createdAt: msg.createdAt });
  } catch (err) {
    next(err);
  }
}

export async function getMessages(req, res, next) {
  try {
    const { id } = req.params;
    const conv = await Conversation.findById(id);
    if (!conv) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'conversation not found' } });
    if (!conv.participants.map(p => p.toString()).includes(req.user.id)) {
      return res.status(403).json({ error: { code: 'FORBIDDEN', message: 'not a participant' } });
    }

    const messages = await Message.find({ conversationId: id }).sort({ createdAt: 1 }).limit(200);
    return res.json(messages);
  } catch (err) {
    next(err);
  }
}
