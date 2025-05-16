import { useState } from 'react';

function Modal({ onSubmit, onCancel, fields, message, defaultValues }) {
  const [formData, setFormData] = useState(defaultValues || {});

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div style={{ position: 'fixed', top: '20%', left: '20%', background: 'white', padding: '20px', border: '1px solid black' }}>
      {message ? (
        <div>
          <p>{message}</p>
          <button onClick={handleSubmit}>Confirm</button>
          <button onClick={onCancel}>Cancel</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {fields.map((field) => (
            <div key={field}>
              <label>{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
              <input
                type={field.includes('count') || field.includes('width') || field.includes('height') ? 'number' : 'text'}
                value={formData[field] || ''}
                onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
              />
            </div>
          ))}
          <button type="submit">Confirm</button>
          <button type="button" onClick={onCancel}>Cancel</button>
        </form>
      )}
    </div>
  );
}

export default Modal;