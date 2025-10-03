import Spell from '../models/spell.model.js';
import User from '../models/user.model.js';
import Spellcast from '../models/spellcast.model.js';

export async function castSpell(req, res, next) {
  try {
    const { id } = req.params; // spell id
    const { context } = req.body;
    const spell = await Spell.findById(id);
    if (!spell) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'spell not found' } });

    // Only owner (patient) or therapist (with assignment) should cast — decide your rule:
    const userId = req.user.id;
    // allow owner to cast
    if (spell.ownerId.toString() !== userId && req.user.role !== 'therapist') {
      return res.status(403).json({ error: { code: 'FORBIDDEN', message: 'Not allowed to cast' } });
    }

    // load owner to find therapist
    const owner = await User.findById(spell.ownerId).select('therapistId');
    const visibleTo = [spell.ownerId];
    if (owner?.therapistId) visibleTo.push(owner.therapistId);

    const cast = await Spellcast.create({
      spellId: id,
      castBy: userId,
      context: context || {},
      visibleTo
    });

    // In a real app, notify therapist (socket/push). For now we return the created record id.
    return res.status(201).json({ id: cast._id });
  } catch (err) {
    next(err);
  }
}
