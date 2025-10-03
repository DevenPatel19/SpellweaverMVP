import React, { useEffect, useState } from "react";
import SpellCard from "../components/SpellCard.jsx";

export default function SpellsPage({ accessToken }) {
  const [spells, setSpells] = useState([]);
  const [newSpellName, setNewSpellName] = useState("");
  const [newSpellDesc, setNewSpellDesc] = useState("");
  const [error, setError] = useState(null);

  // Fetch spells when accessToken is available
  useEffect(() => {
    if (!accessToken) return; // skip if no token

    const fetchSpells = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/v1/spells", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setSpells(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching spells:", err);
        setError("Failed to fetch spells. Please login again.");
      }
    };

    fetchSpells();
  }, [accessToken]);

  // Cast spell handler
  const handleCast = async (spell) => {
    if (!accessToken) return console.error("No access token available");

    try {
      await fetch("http://localhost:4000/api/v1/spells/cast", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ spellId: spell._id }),
      });
      console.log(`Casting ${spell.name}! ✨`);
    } catch (err) {
      console.error("Failed to cast spell:", err);
    }
  };

  // Add new spell
  const handleAdd = async () => {
    if (!accessToken) return console.error("No access token available");
    if (!newSpellName) return setError("Spell name is required");

    try {
      const res = await fetch("http://localhost:4000/api/v1/spells", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ name: newSpellName, description: newSpellDesc }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const spell = await res.json();
      setSpells([...spells, spell]);
      setNewSpellName("");
      setNewSpellDesc("");
      setError(null);
    } catch (err) {
      console.error("Failed to add spell:", err);
      setError("Failed to add spell");
    }
  };

  // Delete spell (optimistic UI)
  const handleDelete = async (id) => {
    if (!accessToken) return console.error("No access token available");

    setSpells(spells.filter((s) => s._id !== id));

    try {
      const res = await fetch(`http://localhost:4000/api/v1/spells/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
    } catch (err) {
      console.error("Failed to delete spell:", err);
      setError("Failed to delete spell");
    }
  };

  // Edit spell (optimistic UI)
  const handleEdit = async (updatedSpell) => {
    if (!accessToken) return console.error("No access token available");

    setSpells(spells.map((s) => (s._id === updatedSpell._id ? updatedSpell : s)));

    try {
      const res = await fetch(`http://localhost:4000/api/v1/spells/${updatedSpell._id}`, {
        method: "PATCH", // match backend
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(updatedSpell),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
    } catch (err) {
      console.error("Failed to edit spell:", err);
      setError("Failed to edit spell");
    }
  };

  return (
    <div className="spells-page">
      <h2>✨ My Spells ✨</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className="add-spell-form">
        <input
          type="text"
          placeholder="Spell name"
          value={newSpellName}
          onChange={(e) => setNewSpellName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Spell description"
          value={newSpellDesc}
          onChange={(e) => setNewSpellDesc(e.target.value)}
        />
        <button onClick={handleAdd}>Add Spell</button>
      </div>

      <div className="spells-grid">
        {spells.map((spell) => (
          <SpellCard
            key={spell._id}
            spell={spell}
            onCast={handleCast}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        ))}
      </div>
    </div>
  );
}
