import { useRef, useCallback, useEffect, useMemo } from 'react';
import GlassElement from './GlassElement';
import { clamp, GRAD_STOPS, BG_IMAGES } from '../hooks/useGlassState';

const CANVAS_W = 700;
const CANVAS_H = 480;

export default function Viewport({ state, setPosition, customBgs = [] }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const imgRef = useRef(null);
  const draggingRef = useRef(false);
  const offsetRef = useRef({ x: 0, y: 0 });
  const glassRef = useRef(null);

  // ─── Draw gradient background on canvas ───────
  useEffect(() => {
    if (!state.bg.startsWith('gradient-')) return;
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    canvasRef.current.width = CANVAS_W;
    canvasRef.current.height = CANVAS_H;

    const stops = GRAD_STOPS[state.bg] || GRAD_STOPS['gradient-1'];
    const grad = ctx.createLinearGradient(0, 0, CANVAS_W, CANVAS_H);
    stops.forEach(([color, pos]) => grad.addColorStop(pos, color));
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
  }, [state.bg]);

  // ─── Set image background source ──────────────
  const imgSrc = useMemo(() => {
    let currentBg = '';
    if (state.bg.startsWith('custom-')) {
      const found = customBgs.find(b => b.id === state.bg);
      if (found) currentBg = found.url;
    } else if (state.bg.startsWith('img-')) {
      currentBg = BG_IMAGES[state.bg];
    }
    return currentBg || null;
  }, [state.bg, customBgs]);

  const showCanvas = state.bg.startsWith('gradient-');
  const showImg = !showCanvas;

  // ─── SVG distortion filter params ─────────────
  const distBaseFreq = useMemo(
    () => (0.005 + state.distortion * 0.001).toFixed(4),
    [state.distortion]
  );

  // ─── Glass position ──────────────────────────
  const isSquareOrCircle = state.shape === 'circle' || state.shape === 'square';
  const h = isSquareOrCircle ? state.width : state.height;
  const glassX = state.glassX ?? (CANVAS_W - state.width) / 2;
  const glassY = state.glassY ?? (CANVAS_H - h) / 2;

  // ─── Drag handlers ───────────────────────────
  const handlePointerDown = useCallback((e) => {
    draggingRef.current = true;
    const glassEl = glassRef.current;
    if (glassEl) {
      const rect = glassEl.getBoundingClientRect();
      offsetRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
    e.target.setPointerCapture(e.pointerId);
    e.preventDefault();
  }, []);

  const handlePointerMove = useCallback((e) => {
    if (!draggingRef.current) return;
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) return;

    const isSqOrCirc = state.shape === 'circle' || state.shape === 'square';
    const currentH = isSqOrCirc ? state.width : state.height;

    let newX = e.clientX - containerRect.left - offsetRef.current.x;
    let newY = e.clientY - containerRect.top - offsetRef.current.y;

    newX = clamp(newX, -state.width * 0.3, CANVAS_W - state.width * 0.7);
    newY = clamp(newY, -currentH * 0.3, CANVAS_H - currentH * 0.7);

    setPosition(newX, newY);
  }, [state.shape, state.width, state.height, setPosition]);

  const handlePointerUp = useCallback(() => {
    draggingRef.current = false;
  }, []);

  useEffect(() => {
    document.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('pointerup', handlePointerUp);
    return () => {
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerup', handlePointerUp);
    };
  }, [handlePointerMove, handlePointerUp]);

  return (
    <div className="viewport" id="viewport">
      {/* SVG Filter for Glass Distortion */}
      <svg xmlns="http://www.w3.org/2000/svg" width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <filter id="glass-distortion" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency={distBaseFreq}
              numOctaves="3"
              seed="2"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale={state.distortion}
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      <div className="canvas-frame">
        <div className="canvas-container" id="canvas-container" ref={containerRef}>
          {/* Background layers */}
          <canvas
            className="canvas-bg-gradient"
            id="canvas-bg"
            ref={canvasRef}
            width={CANVAS_W}
            height={CANVAS_H}
            style={{ display: showCanvas ? 'block' : 'none' }}
          />
          {imgSrc && (
            <img
              className="canvas-bg"
              id="canvas-bg-img"
              ref={imgRef}
              src={imgSrc}
              alt="Background"
              style={{
                display: showImg ? 'block' : 'none',
                position: 'absolute',
                top: 0,
                left: 0,
              }}
            />
          )}

          {/* Glass overlay element */}
          <div
            ref={glassRef}
            onPointerDown={handlePointerDown}
            style={{
              position: 'absolute',
              left: glassX + 'px',
              top: glassY + 'px',
              width: state.width + 'px',
              height: h + 'px',
              cursor: 'grab',
              touchAction: 'none'
            }}
          >
            <GlassElement
              state={state}
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
