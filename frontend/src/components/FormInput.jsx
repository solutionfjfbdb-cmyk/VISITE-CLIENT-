import React from 'react';

function FormInput({ label, type = 'text', value, onChange, required = false }) {
  return (
    <div className="form-group">
      <label>{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        required={required}
      />
    </div>
  );
}

export default FormInput;
