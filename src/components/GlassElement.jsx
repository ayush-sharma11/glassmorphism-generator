import { useMemo } from 'react';
import { hexToRgb } from '../hooks/useGlassState';

export default function GlassElement({ state, style: positionStyle }) {
  const { containerStyle, filterStyle, bgOverlayStyle, specularStyle, highlightOverlay } = useMemo(() => {
    const isSquareOrCircle = state.shape === 'circle' || state.shape === 'square';
    const w = state.width;
    const h = isSquareOrCircle ? state.width : state.height;
    let r = state.radius;

    if (state.shape === 'circle') {
      r = state.width / 2;
    } else if (state.shape === 'pill') {
      r = Math.min(w, h) / 2;
    } else {
      r = Math.min(w / 2, h / 2, state.radius);
    }

    const tintRgb = hexToRgb(state.tintColor);
    const tintA = state.tintStrength / 100;
    const bgRgba = `rgba(${tintRgb.r}, ${tintRgb.g}, ${tintRgb.b}, ${tintA})`;
    const edgeGlow = state.edgeGlow / 100;
    const borderW = state.borderWidth;
    const blurVal = state.blur;
    const satVal = state.saturation / 100;
    const shadowVal = state.shadow;

    const borderAlpha = edgeGlow * 0.6;
    const shadowAlpha = 0.15 + (shadowVal / 60) * 0.35;

    const containerStyle = {
      width: w + 'px',
      height: h + 'px',
      borderRadius: r + 'px',
      boxShadow: `0 ${Math.round(shadowVal / 3)}px ${shadowVal}px rgba(0, 0, 0, ${shadowAlpha.toFixed(2)})`,
      ...positionStyle,
    };

    const filterStyle = {
      backdropFilter: `blur(${blurVal}px) saturate(${satVal})`,
      WebkitBackdropFilter: `blur(${blurVal}px) saturate(${satVal})`,
      filter: state.distortion > 0 ? 'url(#glass-distortion)' : 'none',
    };

    const bgOverlayStyle = {
      background: bgRgba,
    };

    const specularStyle = {
      border: `${borderW}px solid rgba(255, 255, 255, ${borderAlpha.toFixed(2)})`,
      boxShadow: `
        inset 0 1px 0 rgba(255, 255, 255, ${(edgeGlow * 0.4).toFixed(2)}),
        inset 0 -1px 0 rgba(255, 255, 255, ${(edgeGlow * 0.08).toFixed(2)})
      `,
    };

    // Inner specular highlight overlay (additional dynamic specular highlights over the glass)
    const highlightOverlay = {
      position: 'absolute',
      inset: 0,
      borderRadius: 'inherit',
      background: `linear-gradient(
        135deg,
        rgba(255, 255, 255, ${(edgeGlow * 0.12).toFixed(2)}) 0%,
        rgba(255, 255, 255, ${(edgeGlow * 0.03).toFixed(2)}) 40%,
        transparent 60%,
        rgba(255, 255, 255, ${(edgeGlow * 0.02).toFixed(2)}) 100%
      )`,
      pointerEvents: 'none',
      zIndex: 4,
    };

    return { containerStyle, filterStyle, bgOverlayStyle, specularStyle, highlightOverlay };
  }, [state, positionStyle]);

  const opacity = state.opacity / 100;
  const h = state.shape === 'circle' ? state.width : state.height;
  const fontSize = (h * state.iconSize / 100) + 'px';
  const symbolOpacity = opacity > 0.5 ? 0.9 : 0.7 + opacity * 0.4;

  return (
    <div className="glass-element liquid-glass" style={containerStyle}>
      <div className="glass-filter" style={filterStyle} />
      {state.distortion > 0 && <div className="glass-distortion-overlay" />}
      <div className="glass-overlay" style={bgOverlayStyle} />
      <div className="glass-specular" style={specularStyle} />
      <div style={highlightOverlay} />
      <div className="glass-content">
        <span
          className="glass-symbol"
          style={{ fontSize, opacity: symbolOpacity }}
        >
          {state.symbol}
        </span>
      </div>
    </div>
  );
}
