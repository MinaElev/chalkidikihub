// Sun & Sea logo icon — used in Header, Footer, and anywhere the brand icon appears
export function BrandIcon({ size = 32, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect width="48" height="48" rx="14" fill="#0891B2"/>
      {/* Sun */}
      <circle cx="24" cy="18" r="7" fill="#fbbf24"/>
      {/* Rays */}
      <line x1="24" y1="6" x2="24" y2="9" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round"/>
      <line x1="32" y1="10" x2="30.5" y2="12" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round"/>
      <line x1="36" y1="18" x2="33" y2="18" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round"/>
      <line x1="16" y1="10" x2="17.5" y2="12" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round"/>
      <line x1="12" y1="18" x2="15" y2="18" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round"/>
      {/* Waves */}
      <path d="M8 32 Q14 27 20 32 Q26 37 32 32 Q38 27 44 32" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      <path d="M8 38 Q14 33 20 38 Q26 43 32 38 Q38 33 44 38" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.5"/>
    </svg>
  );
}
