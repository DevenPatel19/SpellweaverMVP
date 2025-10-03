import React from 'react';

export default function Input({ label, type = 'text', value, onChange }) {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <label style={{ display: 'block', marginBottom: '0.3rem' }}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        style={{
          padding: '0.5rem',
          width: '100%',
          boxSizing: 'border-box'
        }}
      />
    </div>
  );
}
