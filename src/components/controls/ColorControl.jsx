import { useState, useEffect } from 'react';

export default function ColorControl({ label, value, onChange }) {
  const [hexInput, setHexInput] = useState(value.toUpperCase());

  // Sync hex input when value changes externally (e.g. randomize)
  useEffect(() => {
    setHexInput(value.toUpperCase());
  }, [value]);

  const handleColorChange = (e) => {
    const newColor = e.target.value;
    setHexInput(newColor.toUpperCase());
    onChange(newColor);
  };

  const handleHexChange = (e) => {
    setHexInput(e.target.value.trim());
  };

  const handleHexBlur = () => {
    let val = hexInput;
    if (!val.startsWith('#')) val = '#' + val;
    if (/^#[0-9a-fA-F]{6}$/.test(val)) {
      onChange(val);
      setHexInput(val.toUpperCase());
    } else {
      setHexInput(value.toUpperCase());
    }
  };

  const handleHexKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleHexBlur();
    }
  };

  return (
    <div className="control-group">
      {label && (
        <div className="control-label">
          <span>{label}</span>
        </div>
      )}
      <div className="color-row">
        <div className="color-swatch" style={{ background: value }}>
          <input
            type="color"
            value={value}
            onChange={handleColorChange}
          />
        </div>
        <input
          type="text"
          className="color-hex"
          value={hexInput}
          maxLength={7}
          onChange={handleHexChange}
          onBlur={handleHexBlur}
          onKeyDown={handleHexKeyDown}
        />
      </div>
    </div>
  );
}
