import { useState } from 'react';

export default function Section({ title, children, defaultOpen = true }) {
  const [collapsed, setCollapsed] = useState(!defaultOpen);

  return (
    <div className={`section${collapsed ? ' collapsed' : ''}`}>
      <div
        className="section-header"
        onClick={() => setCollapsed(c => !c)}
      >
        <span className="section-title">{title}</span>
        <svg className="section-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
      <div className="section-body">
        {children}
      </div>
    </div>
  );
}
