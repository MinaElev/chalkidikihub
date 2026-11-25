'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { MAP_CLIP, MAP_LAND, MAP_PROJ, MAP_REGIONS, MAP_VIEWBOX } from '@/content/chalkidiki-map';

export type MapArea = 'kassandra' | 'sithonia' | 'athos' | 'mainland';
export type MapVillage = { slug: string; name: string; area: MapArea; lat: number; lon: number; count: number };
/** One stay on the map: a price bubble at its location. */
export type MapPin = { slug: string; href: string; lat: number; lon: number; price: string; village: string | null; area: MapArea };

/** Map coordinates (same projection as the generated outline). */
export function project(lon: number, lat: number): [number, number] {
  return [(lon - MAP_PROJ.w) * MAP_PROJ.k * MAP_PROJ.S, (MAP_PROJ.n - lat) * MAP_PROJ.S];
}

const FULL = MAP_VIEWBOX.split(' ').map(Number) as [number, number, number, number];
const FULL_ASPECT = FULL[2] / FULL[3];
const box = (lon1: number, lat1: number, lon2: number, lat2: number): [number, number, number, number] => {
  const [x1, y1] = project(lon1, lat1);
  const [x2, y2] = project(lon2, lat2);
  return [x1, y1, x2 - x1, y2 - y1];
};
/** What the map zooms to for each area (north-west and south-east corners). */
const ZOOM: Record<MapArea, [number, number, number, number]> = {
  kassandra: box(23.22, 40.24, 23.8, 39.88),
  sithonia: box(23.58, 40.31, 24.08, 39.9),
  athos: box(23.8, 40.47, 24.44, 40.1),
  // The stays inland are all along the south coast (Nea Kallikrateia to Psakoudia): frame that, not the empty north.
  mainland: box(22.86, 40.47, 23.92, 40.16),
};
/** Area names sit in the sea next to each peninsula, clear of the village dots. */
const LABEL_AT: Record<MapArea, [number, number]> = {
  kassandra: project(23.1, 40.06),
  sithonia: project(24.17, 40.04),
  athos: project(24.3, 40.36),
  mainland: project(23.38, 40.45),
};
/** Map units per screen pixel the sizes below were designed for (full map ~700 px wide). */
const DESIGN_UNITS_PER_PX = FULL[2] / 700;

const NAME_SIZE = 27;
const PIN_SIZE = 24;

/** What is actually on screen for a frame: the SVG fits it inside its own shape, centred. */
function visibleFrame([x, y, w, h]: number[], aspect: number): number[] {
  if (w / h > aspect) {
    const nh = w / aspect;
    return [x, y - (nh - h) / 2, w, nh];
  }
  const nw = h * aspect;
  return [x - (nw - w) / 2, y, nw, h];
}
/** One size for every dot: sizing by stays would show how few some villages have. */
const DOT_R = 13;
type NamePlace = { x: number; y: number; textAnchor: 'start' | 'end' | 'middle' };
type Box = [number, number, number, number]; // x1, y1, x2, y2 in map units
const overlaps = (a: Box, b: Box) => a[0] < b[2] && b[0] < a[2] && a[1] < b[3] && b[1] < a[3];

/**
 * Village names without collisions: busiest villages (and the picked one)
 * first, each tries eight spots around its dot and takes the first clear of
 * every dot, every name already placed and the frame's edge. A name with no
 * free spot is left out; the village is still in the buttons beside the map.
 */
function placeNames(villages: MapVillage[], scale: number, picked: string | null, frame: number[]): Map<string, NamePlace> {
  const s = scale;
  const m = 6 * s;
  const inside = (b: Box) => b[0] >= frame[0] + m && b[1] >= frame[1] + m && b[2] <= frame[0] + frame[2] - m && b[3] <= frame[1] + frame[3] - m;
  const dots: Box[] = villages.map((v) => {
    const [x, y] = project(v.lon, v.lat);
    const r = (DOT_R + 4) * s;
    return [x - r, y - r, x + r, y + r];
  });
  const taken: Box[] = [];
  const out = new Map<string, NamePlace>();
  const order = [...villages].sort((a, b) => Number(b.slug === picked) - Number(a.slug === picked) || b.count - a.count);
  for (const v of order) {
    const [x, y] = project(v.lon, v.lat);
    // The picked village is drawn bigger (dot and bold name): reserve room for that.
    const isPicked = v.slug === picked;
    const r = isPicked ? DOT_R + 4 : DOT_R;
    const size = isPicked ? NAME_SIZE + 4 : NAME_SIZE;
    const w = v.name.length * size * (isPicked ? 0.68 : 0.62) * s; // Greek glyphs average ~0.6 em; bold a bit wider
    const h = size * 1.05 * s;
    const gap = (r + 7) * s;
    const d = r * 0.75;
    const ds = d * s;
    const tries: Array<[Box, NamePlace]> = [
      [[x + gap, y - h / 2, x + gap + w, y + h / 2], { x: r + 7, y: 9, textAnchor: 'start' }],
      [[x - gap - w, y - h / 2, x - gap, y + h / 2], { x: -(r + 7), y: 9, textAnchor: 'end' }],
      [[x - w / 2, y - gap - h, x + w / 2, y - gap], { x: 0, y: -(r + 9), textAnchor: 'middle' }],
      [[x - w / 2, y + gap, x + w / 2, y + gap + h], { x: 0, y: r + NAME_SIZE + 2, textAnchor: 'middle' }],
      [[x + ds, y - ds - h, x + ds + w, y - ds], { x: d, y: -d - 6, textAnchor: 'start' }],
      [[x - ds - w, y - ds - h, x - ds, y - ds], { x: -d, y: -d - 6, textAnchor: 'end' }],
      [[x + ds, y + ds, x + ds + w, y + ds + h], { x: d, y: d + NAME_SIZE - 2, textAnchor: 'start' }],
      [[x - ds - w, y + ds, x - ds, y + ds + h], { x: -d, y: d + NAME_SIZE - 2, textAnchor: 'end' }],
    ];
    const own = villages.indexOf(v);
    const free = tries.find(([b]) => inside(b) && !taken.some((t) => overlaps(b, t)) && !dots.some((dd, i) => i !== own && overlaps(b, dd)));
    if (free) {
      taken.push(free[0]);
      out.set(v.slug, free[1]);
    }
  }
  return out;
}

function PriceBubble({ x, y, price, scale, hot }: { x: number; y: number; price: string; scale: number; hot: boolean }) {
  const w = price.length * PIN_SIZE * 0.6 + 24;
  const h = PIN_SIZE + 14;
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={h / 2} fill={hot ? '#f59e0b' : '#075985'} stroke="#fff" strokeWidth={3} />
      <text y={PIN_SIZE * 0.36} textAnchor="middle" fontSize={PIN_SIZE} fontWeight={700} fill="#fff" className="pointer-events-none">{price}</text>
    </g>
  );
}

/**
 * Chalkidiki drawn from the real OpenStreetMap coastline. Tapping a
 * peninsula zooms into it and shows its villages; tapping a village picks it
 * and shows its stays as price bubbles. The stay under the pointer in the list
 * (`hot`) gets its bubble at any zoom. Dots, names and bubbles keep the same
 * on-screen size at every zoom and width.
 */
export function ListingsMap({
  villages, pins = [], hot = null, area, village, onArea, onVillage, labels, aspect = FULL_ASPECT,
}: {
  villages: MapVillage[];
  pins?: MapPin[];
  hot?: string | null;
  area: MapArea | null;
  village: string | null;
  onArea: (a: MapArea | null) => void;
  onVillage: (slug: string | null, area: MapArea) => void;
  labels: { areas: Record<MapArea, string>; map: string };
  /** Width / height of the map box; the side column uses a taller shape than the full map. */
  aspect?: number;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const view = useRef<number[]>(visibleFrame(FULL, aspect));
  const anim = useRef(0);
  const [scale, setScale] = useState(1);

  // On-screen size compensation: map units per pixel now, relative to the design.
  const rescale = useCallback(() => {
    const w = svgRef.current?.clientWidth;
    const h = svgRef.current?.clientHeight;
    // Phones get dots and names ~30% smaller: the whole map is only ~350 px wide there.
    const phone = w && w < 520 ? 0.7 : 1;
    if (w && h) setScale((Math.max(view.current[2] / w, view.current[3] / h) / DESIGN_UNITS_PER_PX) * phone);
  }, []);

  useEffect(() => {
    // Always animate to a frame of the box's own shape, so nothing is letterboxed by the browser.
    const target = visibleFrame(area ? ZOOM[area] : FULL, aspect);
    const from = [...view.current];
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let t0: number | null = null; // taken from the first frame's timestamp
    const step = (now: number) => {
      t0 ??= now;
      const p = reduce ? 1 : Math.min(1, (now - t0) / 650);
      const e = 1 - Math.pow(1 - p, 3);
      view.current = from.map((v, i) => v + (target[i] - v) * e);
      svgRef.current?.setAttribute('viewBox', view.current.join(' '));
      rescale();
      if (p < 1) anim.current = requestAnimationFrame(step);
    };
    cancelAnimationFrame(anim.current);
    anim.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(anim.current);
  }, [area, aspect, rescale]);

  useEffect(() => {
    const ro = new ResizeObserver(rescale);
    if (svgRef.current) ro.observe(svgRef.current);
    return () => ro.disconnect();
  }, [rescale]);

  // Land stays white; once an area is picked the others fade to grey (a blue tint read as sea).
  const regionFill = (a: MapArea) => (!area || area === a ? '#ffffff' : '#e8edf3');
  const pick = (a: MapArea) => onArea(area === a ? null : a);
  const shown = villages.filter((v) => !area || v.area === area);
  const frame = visibleFrame(area ? ZOOM[area] : FULL, aspect);
  // Placed for the frame the map is zooming to, so names don't jump around at the end of the animation.
  const names = area ? placeNames(shown, scale, village, frame) : new Map<string, NamePlace>();
  // Only the stay under the pointer in the list gets a price bubble; a picked village is highlighted, never fanned out.
  const hotPin = hot ? pins.find((p) => p.slug === hot) : undefined;

  return (
    <svg
      ref={svgRef}
      viewBox={visibleFrame(FULL, aspect).join(' ')}
      style={{ aspectRatio: aspect }}
      className="block h-auto w-full select-none"
      role="group"
      aria-label={labels.map}
    >
      <defs>
        <clipPath id="lm-admin"><path d={MAP_CLIP} /></clipPath>
        {(Object.keys(MAP_REGIONS) as Exclude<MapArea, 'mainland'>[]).map((a) => (
          <clipPath key={a} id={`lm-${a}`}><path d={MAP_REGIONS[a]} /></clipPath>
        ))}
      </defs>
      <g clipPath="url(#lm-admin)" stroke="#7f9fbf" strokeWidth={2.5 * scale} strokeLinejoin="round">
        {/* Mainland = the whole land; the peninsulas are drawn over it, each cut at its isthmus. */}
        <path d={MAP_LAND} fill={regionFill('mainland')} className="cursor-pointer transition-[fill] duration-200 hover:fill-amber-50" onClick={() => pick('mainland')} />
        {(Object.keys(MAP_REGIONS) as Exclude<MapArea, 'mainland'>[]).map((a) => (
          <g key={a} clipPath={`url(#lm-${a})`}>
            <path d={MAP_LAND} fill={regionFill(a)} className="cursor-pointer transition-[fill] duration-200 hover:fill-amber-50" onClick={() => pick(a)} />
          </g>
        ))}
      </g>

      {!area && (Object.keys(LABEL_AT) as MapArea[]).map((a) => {
        const [x, y] = LABEL_AT[a];
        return (
          <g key={a} transform={`translate(${x} ${y}) scale(${scale})`} className="pointer-events-none" style={{ paintOrder: 'stroke' }}>
            <text textAnchor="middle" fontSize={44} fontWeight={800} fill="#075985" stroke="#fff" strokeWidth={9}>{labels.areas[a]}</text>
          </g>
        );
      })}

      {shown.map((v) => {
        const [x, y] = project(v.lon, v.lat);
        const on = village === v.slug;
        return (
          <g
            key={v.slug}
            transform={`translate(${x} ${y}) scale(${scale})`}
            className="cursor-pointer"
            role="button"
            tabIndex={0}
            aria-label={v.name}
            aria-pressed={on}
            onClick={() => onVillage(on ? null : v.slug, v.area)}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onVillage(on ? null : v.slug, v.area); } }}
          >
            {on && (
              <circle r={DOT_R + 10} fill="#f59e0b" opacity={0.35} className="pointer-events-none origin-center animate-ping motion-reduce:animate-none" style={{ transformBox: 'fill-box' }} />
            )}
            <circle r={on ? DOT_R + 4 : DOT_R} fill={on ? '#f59e0b' : '#0284c7'} stroke="#fff" strokeWidth={on ? 5 : 4} className="transition-all duration-200 hover:fill-sky-800" />
            {names.has(v.slug) && (
              <text
                {...names.get(v.slug)}
                fontSize={on ? NAME_SIZE + 4 : NAME_SIZE}
                fontWeight={on ? 800 : 600}
                fill={on ? '#92400e' : '#334155'}
                stroke="#fff"
                strokeWidth={on ? 9 : 7}
                style={{ paintOrder: 'stroke' }}
                className="pointer-events-none"
              >
                {v.name}
              </text>
            )}
          </g>
        );
      })}

      {hotPin && (() => {
        const [x, y] = project(hotPin.lon, hotPin.lat);
        return (
          <g className="pointer-events-none">
            <circle cx={x} cy={y} r={7 * scale} fill="#f59e0b" stroke="#fff" strokeWidth={3 * scale} />
            <PriceBubble x={x} y={y - 34 * scale} price={hotPin.price} scale={scale} hot />
          </g>
        );
      })()}
    </svg>
  );
}
