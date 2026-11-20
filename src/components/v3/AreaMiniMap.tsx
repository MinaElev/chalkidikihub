import { MAP_CLIP, MAP_LAND, MAP_PROJ, MAP_REGIONS } from '@/content/chalkidiki-map';

type MiniArea = 'kassandra' | 'sithonia' | 'athos' | 'mainland';
type Peninsula = Exclude<MiniArea, 'mainland'>;

const project = (lon: number, lat: number): [number, number] => [
  (lon - MAP_PROJ.w) * MAP_PROJ.k * MAP_PROJ.S,
  (MAP_PROJ.n - lat) * MAP_PROJ.S,
];
const box = (lon1: number, lat1: number, lon2: number, lat2: number) => {
  const [x1, y1] = project(lon1, lat1);
  const [x2, y2] = project(lon2, lat2);
  return [x1, y1, x2 - x1, y2 - y1];
};
/** What each area page shows (north-west and south-east corners), a little wider than the land so the sea frames it. */
const FRAME: Record<MiniArea, number[]> = {
  kassandra: box(23.15, 40.3, 23.9, 39.85),
  sithonia: box(23.5, 40.33, 24.15, 39.88),
  athos: box(23.75, 40.5, 24.5, 40.08),
  mainland: box(22.8, 40.62, 24.05, 40.12),
};
const PENINSULAS = Object.keys(MAP_REGIONS) as Peninsula[];

/**
 * A still, server-rendered outline of one peninsula with its villages as dots,
 * for the "get to know" block of an area page. The interactive map is /map.
 */
export function AreaMiniMap({ area, villages, label }: { area: MiniArea; villages: Array<{ lat: number; lon: number }>; label: string }) {
  const [x, y, w, h] = FRAME[area];
  const unit = w / 500; // map units per CSS pixel at ~500 px wide
  const on = '#cfe8b4';
  const off = '#eef3e6';
  return (
    <svg viewBox={`${x} ${y} ${w} ${h}`} preserveAspectRatio="xMidYMid meet" className="absolute inset-0 size-full" role="img" aria-label={label}>
      <defs>
        <clipPath id={`mm-admin-${area}`}><path d={MAP_CLIP} /></clipPath>
        {PENINSULAS.map((p) => (
          <clipPath key={p} id={`mm-${area}-${p}`}><path d={MAP_REGIONS[p]} /></clipPath>
        ))}
      </defs>
      <g clipPath={`url(#mm-admin-${area})`} stroke="#8fb39a" strokeWidth={1.5 * unit} strokeLinejoin="round">
        <path d={MAP_LAND} fill={area === 'mainland' ? on : off} />
        {PENINSULAS.map((p) => (
          <g key={p} clipPath={`url(#mm-${area}-${p})`}>
            <path d={MAP_LAND} fill={p === area ? on : off} />
          </g>
        ))}
      </g>
      {villages.map((v, i) => {
        const [cx, cy] = project(v.lon, v.lat);
        return <circle key={i} cx={cx} cy={cy} r={4 * unit} fill="#0e7490" stroke="#fff" strokeWidth={1.5 * unit} />;
      })}
    </svg>
  );
}
