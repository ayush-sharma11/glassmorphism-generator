import { useRef } from 'react';
import { GRADIENTS, BG_IMAGES } from '../hooks/useGlassState';

const GRADIENT_ENTRIES = [
  { key: 'gradient-1', title: 'Purple Flow', style: GRADIENTS['gradient-1'] },
  { key: 'gradient-2', title: 'Ocean', style: GRADIENTS['gradient-2'] },
  { key: 'gradient-3', title: 'Sunset', style: GRADIENTS['gradient-3'] },
  { key: 'gradient-4', title: 'Forest', style: GRADIENTS['gradient-4'] },
];

const IMAGE_ENTRIES = [
  { key: 'img-crystal', title: 'Crystal Prism', src: BG_IMAGES['img-crystal'] },
  { key: 'img-gradient', title: 'Gradient Flow', src: BG_IMAGES['img-gradient'] },
  { key: 'img-holo', title: 'Holographic', src: BG_IMAGES['img-holo'] },
  { key: 'img-neon', title: 'Neon', src: BG_IMAGES['img-neon'] },
];

export default function BackgroundGrid({ activeBg, onSelect, onCustomUpload, customBgs = [] }) {
  const fileInputRef = useRef(null);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      onCustomUpload(ev.target.result);
    };
    reader.readAsDataURL(file);
    // Reset the input so the same file can be re-selected
    e.target.value = '';
  };

  return (
    <div className="bg-grid">
      {GRADIENT_ENTRIES.map(({ key, title, style }) => (
        <div
          key={key}
          className={`bg-thumb${activeBg === key ? ' active' : ''}`}
          data-bg={key}
          title={title}
          onClick={() => onSelect(key)}
        >
          <div className="bg-thumb-gradient" style={{ background: style }} />
        </div>
      ))}

      {IMAGE_ENTRIES.map(({ key, title, src }) => (
        <div
          key={key}
          className={`bg-thumb${activeBg === key ? ' active' : ''}`}
          data-bg={key}
          title={title}
          onClick={() => onSelect(key)}
        >
          <img src={src} alt={title} loading="lazy" />
        </div>
      ))}

      {customBgs.map(({ id, url }) => (
        <div
          key={id}
          className={`bg-thumb${activeBg === id ? ' active' : ''}`}
          data-bg={id}
          title="Custom Upload"
          onClick={() => onSelect(id)}
        >
          <img src={url} alt="Custom Background" loading="lazy" />
        </div>
      ))}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleUpload}
      />
      <button
        className="bg-upload-btn"
        title="Upload Image"
        onClick={() => fileInputRef.current?.click()}
      >
        +
      </button>
    </div>
  );
}
