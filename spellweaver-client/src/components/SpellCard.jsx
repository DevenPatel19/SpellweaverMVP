import React, { useState } from "react";
import "../styles/SpellCard.css";

export default function SpellCard({ spell, onCast, onDelete, onEdit }) {
  const [journal, setJournal] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(spell.name);
  const [description, setDescription] = useState(spell.description);
  const [particles, setParticles] = useState([]);

  // --- Particle Burst ---
  function spawnParticles() {
    const newParticles = Array.from({ length: 25 }).map(() => {
      const angle = Math.random() * 2 * Math.PI;
      const distance = Math.random() * 100 + 50;
      return {
        id: Math.random(),
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
        size: Math.random() * 6 + 4,
      };
    });

    setParticles(newParticles);
    setTimeout(() => setParticles([]), 800);
  }

  const handleCast = () => {
    spawnParticles();
    onCast(spell);
  };

  const handleSave = () => {
    onEdit({ ...spell, name, description });
    setIsEditing(false);
  };

  return (
    <div
      className="spell-card"
      onClick={() => !isEditing && handleCast()}
    >
      {/* Particle Burst */}
      <div className="particle-container">
        {particles.map((p) => (
          <span
            key={p.id}
            className="particle"
            style={{
              "--x": `${p.x}px`,
              "--y": `${p.y}px`,
              width: `${p.size}px`,
              height: `${p.size}px`,
            }}
          />
        ))}
      </div>

      {isEditing ? (
        <div className="edit-form" onClick={(e) => e.stopPropagation()}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button onClick={handleSave}>Save</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </div>
      ) : (
        <>
          <h3>{spell.name}</h3>
          <p>{spell.description}</p>
          <input
        type="text"
        placeholder="Add journal entry..."
        value={journal}
        onChange={(e) => setJournal(e.target.value)}
        style={{ width: "100%", marginBottom: "0.5rem" }}
      />
          <div className="card-actions" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setIsEditing(true)}>✏️ Edit</button>
            <button onClick={() => onDelete(spell._id)}>🗑️ Delete</button>
          </div>
        </>
      )}
    </div>
  );
}
