import { useState, useCallback } from 'react';
import TopBar from './components/TopBar';
import Viewport from './components/Viewport';
import Sidebar from './components/Sidebar';
import CodePanel from './components/CodePanel';
import Toast, { showToast } from './components/Toast';
import useGlassState, { hexToRgb, GRAD_STOPS } from './hooks/useGlassState';

const CANVAS_W = 700;
const CANVAS_H = 480;

export default function App() {
  const {
    state,
    setProperty,
    setPosition,
    setBackground,
    randomize,
    reset,
    cssCode,
  } = useGlassState();

  const [codeOpen, setCodeOpen] = useState(false);
  const [customBgs, setCustomBgs] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // ─── Toggle code panel ────────────────────────
  const toggleCode = useCallback(() => {
    setCodeOpen(prev => !prev);
  }, []);

  // ─── Copy CSS ─────────────────────────────────
  const copyCSS = useCallback(() => {
    navigator.clipboard.writeText(cssCode).then(() => {
      showToast('CSS copied to clipboard!');
    }).catch(() => {
      const ta = document.createElement('textarea');
      ta.value = cssCode;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      showToast('CSS copied to clipboard!');
    });
  }, [cssCode]);

  // ─── Custom background upload ─────────────────
  const handleCustomUpload = useCallback((dataUrl) => {
    const newId = `custom-${Date.now()}`;
    setCustomBgs(prev => [...prev, { id: newId, url: dataUrl }]);
    setBackground(newId);
  }, [setBackground]);

  // ─── Download PNG ─────────────────────────────
  const downloadPNG = useCallback(() => {
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = CANVAS_W;
    exportCanvas.height = CANVAS_H;
    const ctx = exportCanvas.getContext('2d');

    const drawBackground = (imgObj) => {
      if (imgObj) {
        ctx.drawImage(imgObj, 0, 0, CANVAS_W, CANVAS_H);
      } else {
        const stops = GRAD_STOPS[state.bg] || GRAD_STOPS['gradient-1'];
        const grad = ctx.createLinearGradient(0, 0, CANVAS_W, CANVAS_H);
        stops.forEach(([color, pos]) => grad.addColorStop(pos, color));
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
      }
    };

    const drawGlass = (imgObj) => {
      // 1. Base background
      drawBackground(imgObj);

      const isSquareOrCircle = state.shape === 'circle' || state.shape === 'square';
      const w = state.width;
      const h = isSquareOrCircle ? state.width : state.height;
      let r = state.radius;
      if (state.shape === 'circle') r = w / 2;
      else if (state.shape === 'pill') r = Math.min(w, h) / 2;
      else r = Math.min(w / 2, h / 2, state.radius);

      const x = state.glassX ?? (CANVAS_W - w) / 2;
      const y = state.glassY ?? (CANVAS_H - h) / 2;

      ctx.save();
      ctx.beginPath();
      const cr = Math.min(r, w / 2, h / 2);
      ctx.moveTo(x + cr, y);
      ctx.lineTo(x + w - cr, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + cr);
      ctx.lineTo(x + w, y + h - cr);
      ctx.quadraticCurveTo(x + w, y + h, x + w - cr, y + h);
      ctx.lineTo(x + cr, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - cr);
      ctx.lineTo(x, y + cr);
      ctx.quadraticCurveTo(x, y, x + cr, y);
      ctx.closePath();

      // 2. Drop shadow
      const shadowAlpha = 0.15 + (state.shadow / 60) * 0.35;
      ctx.shadowColor = `rgba(0, 0, 0, ${shadowAlpha.toFixed(2)})`;
      ctx.shadowBlur = state.shadow;
      ctx.shadowOffsetY = state.shadow / 3;
      ctx.fillStyle = '#fff';
      ctx.fill();

      // Reset shadow
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;

      // 3. Clip
      ctx.save();
      ctx.clip();

      // 4. Blurred background inside glass
      ctx.filter = `blur(${state.blur}px) saturate(${state.saturation}%)`;
      drawBackground(imgObj);

      ctx.filter = 'none';

      // 4.5. Distortion overlay (static frame for PNG)
      if (state.distortion > 0) {
        ctx.save();
        ctx.globalCompositeOperation = 'overlay';

        const rMax = Math.max(w, h) * 1.5;
        const grad1 = ctx.createRadialGradient(x + w * 0.2, y + h * 0.3, 0, x + w * 0.2, y + h * 0.3, rMax);
        grad1.addColorStop(0, 'rgba(255, 255, 255, 0.05)');
        grad1.addColorStop(0.8, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = grad1;
        ctx.fill();

        const grad2 = ctx.createRadialGradient(x + w * 0.8, y + h * 0.7, 0, x + w * 0.8, y + h * 0.7, rMax);
        grad2.addColorStop(0, 'rgba(255, 255, 255, 0.05)');
        grad2.addColorStop(0.8, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = grad2;
        ctx.fill();

        ctx.restore();
      }

      // 5. Tint color
      const tintRgb = hexToRgb(state.tintColor);
      const tintA = state.tintStrength / 100;
      ctx.fillStyle = `rgba(${tintRgb.r}, ${tintRgb.g}, ${tintRgb.b}, ${tintA.toFixed(2)})`;
      ctx.fill();

      // 6. Specular highlight overlay
      const edgeGlow = state.edgeGlow / 100;
      const overlayGrad = ctx.createLinearGradient(x, y, x + w, y + h);
      overlayGrad.addColorStop(0, `rgba(255, 255, 255, ${(edgeGlow * 0.12).toFixed(2)})`);
      overlayGrad.addColorStop(0.4, `rgba(255, 255, 255, ${(edgeGlow * 0.03).toFixed(2)})`);
      overlayGrad.addColorStop(0.6, `transparent`);
      overlayGrad.addColorStop(1, `rgba(255, 255, 255, ${(edgeGlow * 0.02).toFixed(2)})`);
      ctx.fillStyle = overlayGrad;
      ctx.fill();

      // Remove clip
      ctx.restore();

      // 7. Border stroke
      const borderAlpha = edgeGlow * 0.6;
      ctx.strokeStyle = `rgba(255, 255, 255, ${borderAlpha.toFixed(2)})`;
      ctx.lineWidth = state.borderWidth;
      ctx.stroke();

      // 8. Symbol
      if (state.symbol) {
        const opacity = state.opacity / 100;
        const symbolOpacity = opacity > 0.5 ? 0.9 : 0.7 + opacity * 0.4;
        ctx.fillStyle = `rgba(255, 255, 255, ${symbolOpacity.toFixed(2)})`;
        ctx.font = `${h * state.iconSize / 100}px Inter, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(state.symbol, x + w / 2, y + h / 2);
      }
      ctx.restore();
    };

    const triggerDownload = () => {
      const link = document.createElement('a');
      link.download = 'liquid-glass.png';
      link.href = exportCanvas.toDataURL('image/png');
      link.click();
      showToast('PNG downloaded!');
    };

    if (state.bg.startsWith('gradient-')) {
      drawGlass(null);
      triggerDownload();
    } else {
      const imgEl = document.getElementById('canvas-bg-img');
      if (imgEl && imgEl.src) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          drawGlass(img);
          triggerDownload();
        };
        img.src = imgEl.src;
      }
    }
  }, [state]);

  return (
    <div className={`app ${isDarkMode ? '' : 'light-mode'} ${isSidebarOpen ? '' : 'sidebar-collapsed'}`}>
      <TopBar
        onRandomize={randomize}
        onReset={reset}
        onToggleCode={toggleCode}
        onCopyCSS={copyCSS}
        onDownload={downloadPNG}
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode(prev => !prev)}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen(prev => !prev)}
      />

      <div className="main-content">
        <Viewport
          state={state}
          setPosition={setPosition}
          customBgs={customBgs}
        />
        <Sidebar
          state={state}
          setProperty={setProperty}
          setBackground={setBackground}
          onCopyCSS={copyCSS}
          onDownload={downloadPNG}
          onCustomUpload={handleCustomUpload}
          isOpen={isSidebarOpen}
          customBgs={customBgs}
        />
      </div>

      <CodePanel
        isOpen={codeOpen}
        cssCode={cssCode}
        onCopy={copyCSS}
        onClose={() => setCodeOpen(false)}
      />

      <Toast />
    </div>
  );
}
