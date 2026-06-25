export default function SelectControl({ label, value, options, onChange, id }) {
  return (
    <div className="control-group">
      {label && (
        <div className="control-label">
          <span>{label}</span>
        </div>
      )}
      <div className="control-select">
        <select id={id} value={value} onChange={(e) => onChange(e.target.value)}>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
