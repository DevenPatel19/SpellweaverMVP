import Spell from '../models/spell.model.js';

// GET /api/v1/spells
export async function listSpells(req, res) {
  try {
    const userId = req.user.id; // comes from authMiddleware
    const spells = await Spell.find({ userId });
    res.json(spells);
  } catch (err) {
    console.error('Error fetching spells', err);
    res.status(500).json({ error: { code: 'SERVER_ERROR', message: 'Failed to fetch spells' } });
  }
}

// POST /api/v1/spells
export async function createSpell(req, res) {
  try {
    const userId = req.user.id;
    const { name, description, type } = req.body;

    if (!name) {
      return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'name is required' } });
    }

    const spell = await Spell.create({ name, description, type, userId });
    res.status(201).json(spell);
  } catch (err) {
    console.error('Error creating spell', err);
    res.status(500).json({ error: { code: 'SERVER_ERROR', message: 'Failed to create spell' } });
  }
}

export async function updateSpell(req, res) {
  const { id } = req.params;
  const { name, description } = req.body;

  try {
    const spell = await Spell.findByIdAndUpdate(
      id,
      { name, description },
      { new: true }
    );
    if (!spell) return res.status(404).json({ error: 'Spell not found' });
    res.json(spell);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
}

// Delete a spell
export async function deleteSpell(req, res) {
  const { id } = req.params;

  try {
    const spell = await Spell.findByIdAndDelete(id);
    if (!spell) return res.status(404).json({ error: 'Spell not found' });
    res.json({ message: 'Spell deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
}