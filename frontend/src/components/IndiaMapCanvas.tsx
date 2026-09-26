import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as d3geo from 'd3-geo';
import { ALL_INDIA_STATES } from '../data/indiaData';
import { IndiaState } from '../types';
import { MapPin, Sparkles, Info } from 'lucide-react';

interface IndiaMapCanvasProps {
  onSelectState: (state: IndiaState) => void;
  selectedStateId?: string;
}

// Map GeoJSON NAME_1 → app state id
const GEO_NAME_TO_ID: Record<string, string> = {
  'Andaman & Nicobar Island': 'andaman-nicobar',
  'Andhra Pradesh':       'andhra-pradesh',
  'Arunanchal Pradesh':   'arunachal-pradesh',
  'Assam':                'assam',
  'Bihar':                'bihar',
  'Chandigarh':           'chandigarh',
  'Chhattisgarh':         'chhattisgarh',
  'Dadara & Nagar Havelli': 'dadra-nagar-haveli',
  'Daman & Diu':          'daman-diu',
  'NCT of Delhi':         'delhi',
  'Goa':                  'goa',
  'Gujarat':              'gujarat',
  'Haryana':              'haryana',
  'Himachal Pradesh':     'himachal-pradesh',
  'Jammu & Kashmir':      'jammu-kashmir',
  'Jharkhand':            'jharkhand',
  'Karnataka':            'karnataka',
  'Kerala':               'kerala',
  'Lakshadweep':          'lakshadweep',
  'Madhya Pradesh':       'madhya-pradesh',
  'Maharashtra':          'maharashtra',
  'Manipur':              'manipur',
  'Meghalaya':            'meghalaya',
  'Mizoram':              'mizoram',
  'Nagaland':             'nagaland',
  'Odisha':               'odisha',
  'Puducherry':           'puducherry',
  'Punjab':               'punjab',
  'Rajasthan':            'rajasthan',
  'Sikkim':               'sikkim',
  'Tamil Nadu':           'tamil-nadu',
  'Telangana':            'telangana',
  'Tripura':              'tripura',
  'Uttar Pradesh':        'uttar-pradesh',
  'Uttarakhand':          'uttarakhand',
  'West Bengal':          'west-bengal',
};

// Zone → fill color — warm heritage palette, high contrast on dark navy bg
const ZONE_COLORS: Record<string, string> = {
  North:        '#A0522D',  // sienna — rich brown
  South:        '#1A6B5E',  // deep teal
  East:         '#B8860B',  // dark goldenrod
  West:         '#C2600A',  // saffron orange
  Central:      '#8B4513',  // saddle brown
  'North-East': '#7B3F6E',  // deep purple-magenta
  UT:           '#4A7C6B',  // muted jade
};

const DEFAULT_COLOR   = '#A0522D';    // sienna
const HOVER_TINT      = '#FF7A8D';    // signboard pink (bright pink for hover)
const SELECTED_COLOR  = '#FFD38A';    // marigold gold (selected state)
const BORDER_COLOR    = '#FFD38A';    // marigold gold border for crisp state outlines

interface GeoFeature {
  type: string;
  properties: { NAME_1: string };
  geometry: any;
}

export const IndiaMapCanvas: React.FC<IndiaMapCanvasProps> = ({
  onSelectState,
  selectedStateId,
}) => {
  const mainCanvasRef   = useRef<HTMLCanvasElement>(null);
  const hitCanvasRef    = useRef<HTMLCanvasElement>(null);  // off-screen for color picking
  const containerRef    = useRef<HTMLDivElement>(null);
  const geoDataRef      = useRef<GeoFeature[]>([]);
  const hitMapRef       = useRef<Map<string, string>>(new Map()); // color hex → stateId
  const pathsRef        = useRef<Map<string, Path2D>>(new Map());

  const [hoveredState, setHoveredState] = useState<IndiaState | null>(null);
  const [activeState,  setActiveState]  = useState<IndiaState | null>(
    ALL_INDIA_STATES.find(s => s.id === selectedStateId) ?? ALL_INDIA_STATES[0]
  );
  const [loaded, setLoaded] = useState(false);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; state: IndiaState } | null>(null);

  // Build a unique color for each feature (for hit detection)
  const indexToColor = (i: number): string => {
    const r = (i >> 16) & 0xff;
    const g = (i >> 8)  & 0xff;
    const b =  i        & 0xff;
    return `rgb(${r},${g},${b})`;
  };

  const draw = useCallback((
    features: GeoFeature[],
    projection: d3geo.GeoProjection,
    hovId: string | null,
    selId: string | null,
  ) => {
    const mainCanvas = mainCanvasRef.current;
    const hitCanvas  = hitCanvasRef.current;
    if (!mainCanvas || !hitCanvas) return;

    const ctx  = mainCanvas.getContext('2d')!;
    const hctx = hitCanvas.getContext('2d')!;
    const path = d3geo.geoPath(projection, ctx);
    const hpath = d3geo.geoPath(projection, hctx);

    ctx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
    hctx.clearRect(0, 0, hitCanvas.width, hitCanvas.height);

    // Draw dark ocean background
    ctx.fillStyle = '#0E0924';
    ctx.fillRect(0, 0, mainCanvas.width, mainCanvas.height);

    features.forEach((feat, i) => {
      const geoName  = feat.properties.NAME_1;
      const stateId  = GEO_NAME_TO_ID[geoName];
      const appState = ALL_INDIA_STATES.find(s => s.id === stateId);
      const zone     = appState?.zone ?? 'UT';

      const isSelected = stateId === selId;
      const isHovered  = stateId === hovId;

      // ── Main canvas fill ──
      let fillColor = ZONE_COLORS[zone] ?? DEFAULT_COLOR;
      if (isSelected)     fillColor = SELECTED_COLOR;
      else if (isHovered) fillColor = HOVER_TINT;

      ctx.beginPath();
      path(feat as any);
      ctx.fillStyle   = fillColor;
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 211, 138, 0.4)'; // Translucent marigold border
      ctx.lineWidth   = 1.5;
      ctx.stroke();

      // Highlight selected with glow
      if (isSelected) {
        ctx.beginPath();
        path(feat as any);
        ctx.strokeStyle = '#E85B70';
        ctx.lineWidth   = 2;
        ctx.stroke();
      }

      // ── Hit canvas (unique color per feature) ──
      const hitColor = indexToColor(i + 1);
      hctx.beginPath();
      hpath(feat as any);
      hctx.fillStyle = hitColor;
      hctx.fill();

      hitMapRef.current.set(hitColor, stateId ?? '');
    });
  }, []);

  // Load GeoJSON + setup projection
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const W = container.clientWidth  || 700;
    const H = Math.round(W * 1.30);

    const mainCanvas = mainCanvasRef.current!;
    const hitCanvas  = hitCanvasRef.current!;
    mainCanvas.width  = W;
    mainCanvas.height = H;
    hitCanvas.width   = W;
    hitCanvas.height  = H;

    fetch('/india-states-full-rewound.geojson')
      .then(r => r.json())
      .then((data: { features: GeoFeature[] }) => {
        const features = data.features;
        geoDataRef.current = features;

        // fitExtent with padding so the full map (including extended J&K) is never clipped
        const pad = Math.round(W * 0.04);
        const projection = d3geo
          .geoMercator()
          .fitExtent([[pad, pad], [W - pad, H - pad]], data as any);
        
        // Shift map upwards slightly to ensure southern tip (Kerala) is fully visible
        const trans = projection.translate();
        projection.translate([trans[0], trans[1] - Math.round(H * 0.08)]);

        // Store paths for hover
        const gpath = d3geo.geoPath(projection);
        const paths = new Map<string, Path2D>();
        features.forEach(feat => {
          const p = new Path2D(gpath(feat as any)!);
          paths.set(feat.properties.NAME_1, p);
        });
        pathsRef.current = paths;

        draw(features, projection, null, selectedStateId ?? null);
        setLoaded(true);

        // Re-draw on resize
        const ro = new ResizeObserver(() => {
          const W2 = container.clientWidth;
          const H2 = Math.round(W2 * 1.30);
          mainCanvas.width  = W2;
          mainCanvas.height = H2;
          hitCanvas.width   = W2;
          hitCanvas.height  = H2;
          const pad2 = Math.round(W2 * 0.04);
          const proj2 = d3geo.geoMercator()
            .fitExtent([[pad2, pad2], [W2 - pad2, H2 - pad2]], data as any);
          const trans2 = proj2.translate();
          proj2.translate([trans2[0], trans2[1] - Math.round(H2 * 0.08)]);
          draw(features, proj2, null, selectedStateId ?? null);
        });
        ro.observe(container);
        return () => ro.disconnect();
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Redraw when selection changes
  useEffect(() => {
    if (!loaded || !geoDataRef.current.length) return;
    const container = containerRef.current!;
    const W = container.clientWidth;
    const H = Math.round(W * 1.30);
    const pad = Math.round(W * 0.04);
    const projection = d3geo.geoMercator().fitExtent(
      [[pad, pad], [W - pad, H - pad]],
      { type: 'FeatureCollection', features: geoDataRef.current } as any
    );
    const trans = projection.translate();
    projection.translate([trans[0], trans[1] - Math.round(H * 0.08)]);
    draw(
      geoDataRef.current,
      projection,
      hoveredState?.id ?? null,
      selectedStateId ?? null,
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStateId, hoveredState, loaded]);

  const getStateFromPixel = useCallback((x: number, y: number): IndiaState | null => {
    const hitCanvas = hitCanvasRef.current!;
    const hctx = hitCanvas.getContext('2d')!;
    const [r, g, b] = hctx.getImageData(x, y, 1, 1).data;
    const colorKey = `rgb(${r},${g},${b})`;
    const stateId  = hitMapRef.current.get(colorKey);
    if (!stateId) return null;
    return ALL_INDIA_STATES.find(s => s.id === stateId) ?? null;
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect  = e.currentTarget.getBoundingClientRect();
    const scale = e.currentTarget.width / rect.width;
    const x     = (e.clientX - rect.left) * scale;
    const y     = (e.clientY - rect.top)  * scale;
    const state = getStateFromPixel(x, y);

    setHoveredState(state);
    if (state) {
      setTooltip({ x: e.clientX - rect.left, y: e.clientY - rect.top, state });
      e.currentTarget.style.cursor = 'pointer';
    } else {
      setTooltip(null);
      e.currentTarget.style.cursor = 'default';
    }
  }, [getStateFromPixel]);

  const handleClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect  = e.currentTarget.getBoundingClientRect();
    const scale = e.currentTarget.width / rect.width;
    const x     = (e.clientX - rect.left) * scale;
    const y     = (e.clientY - rect.top)  * scale;
    const state = getStateFromPixel(x, y);
    if (state) {
      setActiveState(state);
      onSelectState(state);
    }
  }, [getStateFromPixel, onSelectState]);

  const handleMouseLeave = useCallback(() => {
    setHoveredState(null);
    setTooltip(null);
  }, []);

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start">

      {/* ── MAP CANVAS ── */}
      <div
        ref={containerRef}
        className="relative w-full lg:w-[65%] rounded-2xl overflow-hidden"
        style={{
          background: '#0E0924',
          border: '2px solid rgba(255,211,138,0.3)',
          boxShadow: '4px 4px 0px #120C2B, 0 8px 32px rgba(0,0,0,0.4)',
        }}
      >
        {!loaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-signboard-dark">
            <div className="w-10 h-10 border-3 border-marigold border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-xs font-semibold text-parchment/70">Loading India Map…</p>
          </div>
        )}

        {/* Hit canvas — hidden, used only for color picking */}
        <canvas ref={hitCanvasRef} className="hidden absolute inset-0" />

        {/* Visible main canvas */}
        <canvas
          ref={mainCanvasRef}
          className="w-full h-auto block"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onClick={handleClick}
        />

        {/* Hover tooltip */}
        {tooltip && (
          <div
            className="absolute z-20 pointer-events-none"
            style={{ left: tooltip.x + 12, top: tooltip.y - 8 }}
          >
            <div className="bg-[#1C1440] text-white text-[11px] font-semibold px-3 py-1.5 rounded-xl shadow-xl border border-[#7A1026]/40 flex items-center gap-1.5 whitespace-nowrap">
              <MapPin className="w-3 h-3 text-[#F09367]" />
              {tooltip.state.name}
              <span className="text-[#FFD38A] font-bold">· {tooltip.state.zone}</span>
            </div>
          </div>
        )}

        {/* Map legend */}
        <div className="absolute bottom-3 left-3 bg-signboard-dark/90 backdrop-blur-sm rounded-xl px-3 py-2 border border-marigold/30 text-[9px] font-semibold text-parchment/70">
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            {Object.entries(ZONE_COLORS).map(([zone, color]) => (
              <span key={zone} className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: color }} />
                {zone}
              </span>
            ))}
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-sm inline-block bg-[#FFD38A]" />
              Selected
            </span>
          </div>
        </div>
      </div>

      {/* ── SIDEBAR INFO ── */}
      <div className="flex-1 space-y-4">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-signboard-pink mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            Select an Indian State to Begin Quests
          </div>
          <h2 className="font-heading font-black text-2xl text-parchment leading-tight">
            Explore <span className="text-marigold">36 States</span> &amp; Union Territories
          </h2>
          <p className="text-xs text-parchment/60 mt-1 leading-relaxed">
            Click any state on the map to unlock regional quests, artisan trails &amp; heritage badges.
          </p>
        </div>

        {/* Active state card */}
        {activeState && (
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              border: '2px solid #7A1026',
              boxShadow: '4px 4px 0px #45091540',
            }}
          >
            {/* Hero image */}
            <div className="relative h-36 overflow-hidden">
              <img
                src={activeState.heroImage}
                alt={activeState.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1C1440]/85 via-transparent to-transparent" />
              <div className="absolute top-2.5 left-3">
                <span className="stamp-badge bg-[#7A1026] text-white border-[#E85B70]">
                  {activeState.zone} Zone
                </span>
              </div>
              <div className="absolute bottom-2.5 left-3 right-3 text-white">
                <h3 className="font-[Poppins] font-black text-xl leading-tight">{activeState.name}</h3>
                <p className="text-[10px] text-[#FFD38A] font-medium">{activeState.capital}</p>
              </div>
            </div>

            {/* Content */}
            <div className="bg-signboard-navyDeep p-4 space-y-3">
              <p className="text-[11px] text-parchment/80 leading-relaxed italic">{activeState.tagline}</p>

              {/* GI Crafts */}
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-marigold mb-1.5">GI Crafts</p>
                <div className="flex flex-wrap gap-1.5">
                  {activeState.culturalHighlights.giCrafts.slice(0, 3).map(craft => (
                    <span
                      key={craft}
                      className="stamp-badge text-marigold border-marigold/40 bg-signboard-dark/60"
                    >
                      {craft}
                    </span>
                  ))}
                </div>
              </div>

              {/* Heritage sites */}
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-marigold mb-1.5">Iconic Sites</p>
                <div className="flex flex-wrap gap-1">
                  {activeState.culturalHighlights.heritageSites.slice(0, 2).map(site => (
                    <span key={site} className="flex items-center gap-1 text-[10px] text-parchment/70 font-medium">
                      <MapPin className="w-2.5 h-2.5 text-signboard-pink shrink-0" />
                      {site}
                    </span>
                  ))}
                </div>
              </div>

              {/* Quest count + CTA */}
              <div className="flex items-center justify-between pt-2 border-t border-marigold/20">
                <span className="flex items-center gap-1.5 text-xs font-bold text-marigold/70">
                  <Info className="w-3.5 h-3.5" />
                  {activeState.activeQuestsCount} active quests
                </span>
                <button
                  onClick={() => onSelectState(activeState)}
                  className="bg-marigold text-signboard-navy font-heading font-black text-[11px] py-2 px-3.5 rounded-lg border-2 border-signboard-navy shadow-bollywood hover:shadow-bollywood-lg transition-all active:scale-95"
                >
                  Enter State →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Hovered state quick peek */}
        {hoveredState && hoveredState.id !== activeState?.id && (
          <div className="flex items-center gap-3 bg-signboard-navyDeep/80 backdrop-blur rounded-xl border border-marigold/20 px-3 py-2 animate-float-up">
            <MapPin className="w-4 h-4 text-signboard-pink shrink-0" />
            <div>
              <p className="font-bold text-sm text-parchment">{hoveredState.name}</p>
              <p className="text-[10px] text-parchment/60">{hoveredState.tagline.slice(0, 50)}…</p>
            </div>
          </div>
        )}

        {/* Zone quick stats */}
        <div className="grid grid-cols-3 gap-2 pt-1">
          {[
            { label: 'States', val: 28 },
            { label: 'Union Territories', val: 8 },
            { label: 'GI Crafts', val: '200+' },
          ].map(({ label, val }) => (
            <div
              key={label}
              className="text-center bg-signboard-navyDeep/60 rounded-xl border border-marigold/20 p-2.5"
            >
              <div className="font-black text-lg text-marigold">{val}</div>
              <div className="text-[9px] font-semibold text-parchment/60 uppercase tracking-wide leading-tight mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
