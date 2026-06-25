import { useRef, useEffect } from 'react';

export default function SliderControl({
  label,
  value,
  min,
  max,
  step = 1,
  displayValue,
  onChange,
  id,
}) {
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      const pct = ((value - min) / (max - min)) * 100;
      inputRef.current.style.setProperty('--fill-percent', pct + '%');
      inputRef.current.style.background = `linear-gradient(to right, var(--accent) 0%, var(--accent) ${pct}%, var(--bg-tertiary) ${pct}%, var(--bg-tertiary) 100%)`;
    }
  }, [value, min, max]);

  return (
    <div className="control-group">
      <div className="control-label">
        <span>{label}</span>
        <span className="control-value">{displayValue}</span>
      </div>
      <input
        ref={inputRef}
        type="range"
        id={id}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
      />
    </div>
  );
}
