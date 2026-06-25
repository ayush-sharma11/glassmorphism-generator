import { useReducer, useCallback, useMemo } from 'react';

// Constants
export const DEFAULTS = {
  shape: 'pill',
  symbol: '',
  iconSize: 35,
  width: 385,
  height: 170,
  radius: 170,
  blur: 18,
  saturation: 180,
  distortion: 0,
  opacity: 10,
  edgeGlow: 60,
  shadow: 24,
  tintColor: '#ffffff',
  tintStrength: 10,
  borderWidth: 1.5,
  bg: 'gradient-1',
  glassX: null,
  glassY: null,
};

export const GRADIENTS = {
  'gradient-1': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'gradient-2': 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
  'gradient-3': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'gradient-4': 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
};

export const GRAD_STOPS = {
  'gradient-1': [['#667eea', 0], ['#764ba2', 1]],
  'gradient-2': [['#0f2027', 0], ['#203a43', 0.5], ['#2c5364', 1]],
  'gradient-3': [['#f093fb', 0], ['#f5576c', 1]],
  'gradient-4': [['#11998e', 0], ['#38ef7d', 1]],
};

export const BG_IMAGES = {
  'img-crystal': '/backgrounds/crystal_prism.png',
  'img-gradient': '/backgrounds/gradient_flow.png',
  'img-holo': '/backgrounds/holographic_metal.png',
  'img-neon': '/backgrounds/neon_lights.png',
};

export const SYMBOLS = [
  '≡', '⟡', '◈', '✦', '❖', '⬡', '⊕', '◉', '△', '♢',
  '⟐', '⊞', '⬟', '☰', '⌘', '⎔', '✧', '❋', '⊛', '⚡',
];

export const SHAPES = ['rectangle', 'square', 'circle', 'pill'];

export const BG_KEYS = [
  'gradient-1', 'gradient-2', 'gradient-3', 'gradient-4',
  'img-crystal', 'img-gradient', 'img-holo', 'img-neon',
];

// Utilities
export function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

export function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}

// Reducer
function glassReducer(state, action) {
  switch (action.type) {
    case 'SET_PROPERTY':
      return { ...state, [action.key]: action.value };

    case 'SET_POSITION':
      return { ...state, glassX: action.x, glassY: action.y };

    case 'SET_BACKGROUND':
      return { ...state, bg: action.bg };

    case 'RANDOMIZE': {
      const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
      const symbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
      const bg = BG_KEYS[Math.floor(Math.random() * BG_KEYS.length)];
      const rndColor = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');

      return {
        ...state,
        shape,
        symbol,
        iconSize: 20 + Math.floor(Math.random() * 50),
        width: 150 + Math.floor(Math.random() * 400),
        height: 100 + Math.floor(Math.random() * 300),
        radius: Math.floor(Math.random() * 180),
        blur: 8 + Math.floor(Math.random() * 30),
        saturation: 100 + Math.floor(Math.random() * 200),
        distortion: Math.floor(Math.random() * 3),
        opacity: 5 + Math.floor(Math.random() * 25),
        edgeGlow: 30 + Math.floor(Math.random() * 60),
        shadow: 10 + Math.floor(Math.random() * 35),
        tintStrength: 3 + Math.floor(Math.random() * 20),
        borderWidth: 0.5 + Math.round(Math.random() * 3 * 2) / 2,
        tintColor: rndColor,
        bg,
        glassX: null,
        glassY: null,
      };
    }

    case 'RESET':
      return { ...DEFAULTS, glassX: null, glassY: null };

    default:
      return state;
  }
}

// CSS Generation
export function generateCSS(state) {
  const isSquareOrCircle = state.shape === 'circle' || state.shape === 'square';
  const w = state.width;
  const h = isSquareOrCircle ? state.width : state.height;
  let r = state.radius;

  if (state.shape === 'circle') r = state.width / 2;
  else if (state.shape === 'pill') r = Math.min(w, h) / 2;
  else r = Math.min(w / 2, h / 2, state.radius);

  const tintRgb = hexToRgb(state.tintColor);
  const tintA = (state.tintStrength / 100).toFixed(2);
  const edgeGlow = state.edgeGlow / 100;
  const borderAlpha = (edgeGlow * 0.6).toFixed(2);
  const satVal = (state.saturation / 100).toFixed(2);
  const shadowVal = state.shadow;
  const shadowAlpha = (0.15 + (shadowVal / 60) * 0.35).toFixed(2);
  const glowTop = (edgeGlow * 0.4).toFixed(2);
  const glowBottom = (edgeGlow * 0.08).toFixed(2);
  const distortion = state.distortion;
  const bw = state.borderWidth;

  let css = `/* Liquid Glass Effect */\n\n`;
  
  css += `/* --- HTML Structure --- \n`;
  css += `<div class="liquid-glass">\n`;
  css += `  <div class="glass-filter"></div>\n`;
  if (distortion > 0) css += `  <div class="glass-distortion-overlay"></div>\n`;
  css += `  <div class="glass-overlay"></div>\n`;
  css += `  <div class="glass-specular"></div>\n`;
  css += `</div>\n`;
  css += `*/\n\n`;

  css += `.liquid-glass {\n`;
  css += `  position: relative;\n`;
  css += `  width: ${w}px;\n`;
  css += `  height: ${h}px;\n`;
  css += `  border-radius: ${r}px;\n`;
  css += `  overflow: hidden;\n`;
  css += `  box-shadow: 0 ${Math.round(shadowVal / 3)}px ${shadowVal}px rgba(0, 0, 0, ${shadowAlpha});\n`;
  css += `}\n\n`;

  css += `.glass-filter, .glass-distortion-overlay, .glass-overlay, .glass-specular {\n`;
  css += `  position: absolute;\n`;
  css += `  inset: 0;\n`;
  css += `  border-radius: inherit;\n`;
  css += `  pointer-events: none;\n`;
  css += `}\n\n`;

  css += `.glass-filter {\n`;
  css += `  z-index: 1;\n`;
  css += `  backdrop-filter: blur(${state.blur}px) saturate(${satVal});\n`;
  css += `  -webkit-backdrop-filter: blur(${state.blur}px) saturate(${satVal});\n`;
  if (distortion > 0) {
    css += `  filter: url(#glass-distortion);\n`;
  }
  css += `}\n\n`;

  if (distortion > 0) {
    css += `.glass-distortion-overlay {\n`;
    css += `  z-index: 2;\n`;
    css += `  background: radial-gradient(circle at 20% 30%, rgba(255,255,255,0.05) 0%, transparent 80%),\n`;
    css += `              radial-gradient(circle at 80% 70%, rgba(255,255,255,0.05) 0%, transparent 80%);\n`;
    css += `  background-size: 300% 300%;\n`;
    css += `  animation: floatDistort 10s infinite ease-in-out;\n`;
    css += `  mix-blend-mode: overlay;\n`;
    css += `}\n\n`;
    css += `@keyframes floatDistort {\n`;
    css += `  0% { background-position: 0% 0%; }\n`;
    css += `  50% { background-position: 100% 100%; }\n`;
    css += `  100% { background-position: 0% 0%; }\n`;
    css += `}\n\n`;
  }

  css += `.glass-overlay {\n`;
  css += `  z-index: 3;\n`;
  css += `  background: rgba(${tintRgb.r}, ${tintRgb.g}, ${tintRgb.b}, ${tintA});\n`;
  css += `}\n\n`;

  css += `.glass-specular {\n`;
  css += `  z-index: 4;\n`;
  css += `  border: ${bw}px solid rgba(255, 255, 255, ${borderAlpha});\n`;
  css += `  box-shadow:\n`;
  css += `    inset 0 1px 0 rgba(255, 255, 255, ${glowTop}),\n`;
  css += `    inset 0 -1px 0 rgba(255, 255, 255, ${glowBottom});\n`;
  css += `}\n\n`;

  css += `.glass-content {\n`;
  css += `  position: relative;\n`;
  css += `  z-index: 5;\n`;
  css += `  display: flex;\n`;
  css += `  flex-direction: column;\n`;
  css += `  justify-content: center;\n`;
  css += `  align-items: center;\n`;
  css += `  height: 100%;\n`;
  css += `  pointer-events: none;\n`;
  css += `}\n\n`;

  css += `.glass-symbol {\n`;
  css += `  color: rgba(255,255,255,0.75);\n`;
  css += `  text-shadow: 0 1px 4px rgba(0,0,0,0.15), 0 0 20px rgba(255,255,255,0.08);\n`;
  css += `}\n`;

  if (distortion > 0) {
    const baseFreq = (0.005 + distortion * 0.001).toFixed(4);
    css += `\n\n`;
    css += `<!-- SVG Filter (place in your HTML) -->\n`;
    css += `<svg xmlns="http://www.w3.org/2000/svg" width="0" height="0"\n`;
    css += `     style="position: absolute;">\n`;
    css += `  <defs>\n`;
    css += `    <filter id="liquid-glass-distortion"\n`;
    css += `            x="-20%" y="-20%" width="140%" height="140%">\n`;
    css += `      <feTurbulence type="fractalNoise"\n`;
    css += `                    baseFrequency="${baseFreq}"\n`;
    css += `                    numOctaves="3" seed="2"\n`;
    css += `                    result="noise" />\n`;
    css += `      <feDisplacementMap in="SourceGraphic"\n`;
    css += `                         in2="noise"\n`;
    css += `                         scale="${distortion}"\n`;
    css += `                         xChannelSelector="R"\n`;
    css += `                         yChannelSelector="G" />\n`;
    css += `    </filter>\n`;
    css += `  </defs>\n`;
    css += `</svg>`;
  }

  return css;
}

// Hook
export default function useGlassState() {
  const [state, dispatch] = useReducer(glassReducer, DEFAULTS);

  const setProperty = useCallback((key, value) => {
    dispatch({ type: 'SET_PROPERTY', key, value });
  }, []);

  const setPosition = useCallback((x, y) => {
    dispatch({ type: 'SET_POSITION', x, y });
  }, []);

  const setBackground = useCallback((bg) => {
    dispatch({ type: 'SET_BACKGROUND', bg });
  }, []);

  const randomize = useCallback(() => {
    dispatch({ type: 'RANDOMIZE' });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  const cssCode = useMemo(() => generateCSS(state), [state]);

  return {
    state,
    setProperty,
    setPosition,
    setBackground,
    randomize,
    reset,
    cssCode,
  };
}
