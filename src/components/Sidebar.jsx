import Section from './Section';
import BackgroundGrid from './BackgroundGrid';
import SliderControl from './controls/SliderControl';
import SelectControl from './controls/SelectControl';
import ColorControl from './controls/ColorControl';

export default function Sidebar({ state, setProperty, setBackground, onCopyCSS, onDownload, onCustomUpload, isOpen, customBgs }) {
  return (
    <aside className={`sidebar ${isOpen ? '' : 'collapsed'}`} id="sidebar">

      {/* Backgrounds Section */}
      <Section title="Backgrounds">
        <BackgroundGrid
          activeBg={state.bg}
          onSelect={setBackground}
          onCustomUpload={onCustomUpload}
          customBgs={customBgs}
        />
      </Section>

      {/* Glass Shape Section */}
      <Section title="Glass Shape">
        <SelectControl
          label="Shape"
          id="ctrl-shape"
          value={state.shape}
          options={[
            { value: 'rectangle', label: 'Rectangle' },
            { value: 'square', label: 'Square' },
            { value: 'circle', label: 'Circle' },
            { value: 'pill', label: 'Pill' },
          ]}
          onChange={(val) => {
            setProperty('shape', val);
            setProperty('glassX', null);
            setProperty('glassY', null);
          }}
        />

        <div className="control-group">
          <div className="control-label"><span>Symbol</span></div>
          <input
            type="text"
            className="control-input"
            id="ctrl-symbol"
            value={state.symbol}
            maxLength={20}
            onChange={(e) => setProperty('symbol', e.target.value)}
          />
          <span className="control-hint">Emoji or text inside glass</span>
        </div>

        <SliderControl
          label="Icon Size"
          id="ctrl-icon-size"
          value={state.iconSize}
          min={10}
          max={80}
          displayValue={`${state.iconSize}%`}
          onChange={(val) => setProperty('iconSize', val)}
        />

        <SliderControl
          label="Width"
          id="ctrl-width"
          value={state.width}
          min={60}
          max={650}
          displayValue={`${state.width}px`}
          onChange={(val) => setProperty('width', val)}
        />

        {!(state.shape === 'circle' || state.shape === 'square') && (
          <SliderControl
            label="Height"
            id="ctrl-height"
            value={state.height}
            min={60}
            max={440}
            displayValue={`${state.height}px`}
            onChange={(val) => setProperty('height', val)}
          />
        )}

        <SliderControl
          label="Corner Radius"
          id="ctrl-radius"
          value={state.radius}
          min={0}
          max={220}
          displayValue={`${state.radius}px`}
          onChange={(val) => setProperty('radius', val)}
        />
      </Section>

      {/* Glass Properties Section */}
      <Section title="Glass Properties">
        <SliderControl
          label="Blur"
          id="ctrl-blur"
          value={state.blur}
          min={0}
          max={60}
          displayValue={`${state.blur}px`}
          onChange={(val) => setProperty('blur', val)}
        />

        <SliderControl
          label="Saturation"
          id="ctrl-saturation"
          value={state.saturation}
          min={0}
          max={300}
          displayValue={(state.saturation / 100).toFixed(2)}
          onChange={(val) => setProperty('saturation', val)}
        />

        <SliderControl
          label="Distortion"
          id="ctrl-distortion"
          value={state.distortion}
          min={0}
          max={80}
          displayValue={(state.distortion / 10).toFixed(1)}
          onChange={(val) => setProperty('distortion', val)}
        />

        <SliderControl
          label="Opacity"
          id="ctrl-opacity"
          value={state.opacity}
          min={0}
          max={100}
          displayValue={(state.opacity / 100).toFixed(2)}
          onChange={(val) => setProperty('opacity', val)}
        />

        <SliderControl
          label="Edge Glow"
          id="ctrl-edge-glow"
          value={state.edgeGlow}
          min={0}
          max={100}
          displayValue={(state.edgeGlow / 100).toFixed(2)}
          onChange={(val) => setProperty('edgeGlow', val)}
        />

        <SliderControl
          label="Shadow"
          id="ctrl-shadow"
          value={state.shadow}
          min={0}
          max={60}
          displayValue={`${state.shadow}px`}
          onChange={(val) => setProperty('shadow', val)}
        />
      </Section>

      {/* Tint & Color Section */}
      <Section title="Tint & Color">
        <ColorControl
          label="Tint Color"
          value={state.tintColor}
          onChange={(val) => setProperty('tintColor', val)}
        />

        <SliderControl
          label="Tint Strength"
          id="ctrl-tint-strength"
          value={state.tintStrength}
          min={0}
          max={100}
          displayValue={(state.tintStrength / 100).toFixed(2)}
          onChange={(val) => setProperty('tintStrength', val)}
        />

        <SliderControl
          label="Border Width"
          id="ctrl-border-width"
          value={state.borderWidth}
          min={0}
          max={6}
          step={0.5}
          displayValue={`${state.borderWidth}px`}
          onChange={(val) => setProperty('borderWidth', val)}
        />
      </Section>

      {/* Export Section */}
      <Section title="Export">
        <button
          className="btn btn-accent"
          id="btn-copy-css-sidebar"
          style={{ width: '100%', justifyContent: 'center' }}
          onClick={onCopyCSS}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16 }}>
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
          </svg>
          Copy CSS Code
        </button>
        <button
          className="btn"
          id="btn-download-sidebar"
          style={{ width: '100%', justifyContent: 'center' }}
          onClick={onDownload}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16 }}>
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Download as PNG
        </button>
      </Section>
    </aside>
  );
}
