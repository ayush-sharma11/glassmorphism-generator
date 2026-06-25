import { useMemo } from 'react';

export default function CodePanel({ isOpen, cssCode, onCopy, onClose }) {
  // Simple syntax highlighting
  const highlightedCode = useMemo(() => {
    if (!cssCode) return '';
    return cssCode
      .replace(/\/\*.*?\*\//gs, m => `<span class="css-comment">${m}</span>`)
      .replace(/<!--.*?-->/g, m => `<span class="css-comment">${m}</span>`)
      .replace(/(\.liquid-glass)/g, '<span class="css-sel">$1</span>')
      .replace(
        /(\b(?:width|height|border-radius|backdrop-filter|background|border|box-shadow|filter|display|align-items|justify-content|position|overflow|-webkit-backdrop-filter)\b)(?=\s*:)/g,
        '<span class="css-prop">$1</span>'
      );
  }, [cssCode]);

  return (
    <div className={`code-panel${isOpen ? ' open' : ''}`} id="code-panel">
      <div className="code-header">
        <span className="code-header-title">Generated CSS + SVG</span>
        <div style={{ display: 'flex', gap: 6 }}>
          <button
            className="btn btn-success"
            id="btn-copy-code"
            style={{ fontSize: 12, padding: '5px 12px' }}
            onClick={onCopy}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}>
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            Copy
          </button>
          <button
            className="btn btn-icon"
            id="btn-close-code"
            style={{ padding: '5px 8px' }}
            onClick={onClose}
          >
            ✕
          </button>
        </div>
      </div>
      <div className="code-body">
        <pre
          id="code-output"
          dangerouslySetInnerHTML={{ __html: highlightedCode }}
        />
      </div>
    </div>
  );
}
