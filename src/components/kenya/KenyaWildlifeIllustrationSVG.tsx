import type { KenyaLandmarkId } from '../../data/kenyaWorld';

interface KenyaWildlifeIllustrationSVGProps {
  spotId: KenyaLandmarkId;
  className?: string;
}

export function KenyaWildlifeIllustrationSVG({
  spotId,
  className = 'h-16 w-16',
}: KenyaWildlifeIllustrationSVGProps) {
  return (
    <svg viewBox="0 0 96 96" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`sky-${spotId}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#65BFE8" />
          <stop offset="100%" stopColor="#CBEBFB" />
        </linearGradient>
      </defs>
      <rect width="96" height="96" rx="20" fill={`url(#sky-${spotId})`} />
      <rect x="0" y="60" width="96" height="36" rx="0" fill="#B8BA5B" />

      {spotId === 'ranger_camp' && (
        <>
          <circle cx="76" cy="20" r="8" fill="#FFE89C" />
          <path d="M16 64 L36 32 L56 64 Z" fill="#E3CB9F" stroke="#4B6F46" strokeWidth="2.5" />
          <path d="M31 64 L36 46 L41 64 Z" fill="#4B6F46" />
          <rect x="58" y="49" width="26" height="14" rx="3" fill="#D8B372" />
          <rect x="58" y="54" width="26" height="4" fill="#3E6A44" />
          <circle cx="64" cy="64" r="4.5" fill="#24262D" />
          <circle cx="78" cy="64" r="4.5" fill="#24262D" />
        </>
      )}

      {spotId === 'elephant_grassland' && (
        <>
          <circle cx="20" cy="20" r="7" fill="#FFE89C" />
          <ellipse cx="48" cy="52" rx="21" ry="15" fill="#7D848E" />
          <circle cx="66" cy="45" r="10.5" fill="#7D848E" />
          <ellipse cx="60" cy="46" rx="6.5" ry="9" fill="#9E8587" />
          <path d="M74 47 Q82 54 78 64" fill="none" stroke="#7D848E" strokeWidth="5.5" strokeLinecap="round" />
          <path d="M70 52 Q76 55 78 52" fill="none" stroke="#F7EEDB" strokeWidth="2.8" strokeLinecap="round" />
          <rect x="33" y="62" width="6.5" height="14" rx="2" fill="#6F7680" />
          <rect x="44" y="62" width="6.5" height="14" rx="2" fill="#7D848E" />
          <rect x="56" y="62" width="6.5" height="14" rx="2" fill="#6F7680" />
        </>
      )}

      {spotId === 'giraffe_acacia_grove' && (
        <>
          <rect x="65" y="34" width="6" height="34" fill="#6E4C36" />
          <ellipse cx="68" cy="30" rx="22" ry="7.5" fill="#5A8D3C" />
          <ellipse cx="30" cy="60" rx="12" ry="8" fill="#E8BE6E" />
          <rect x="23" y="65" width="3.5" height="16" fill="#E8BE6E" />
          <rect x="34" y="65" width="3.5" height="16" fill="#E8BE6E" />
          <rect x="36" y="25" width="6" height="34" rx="3" fill="#E8BE6E" />
          <ellipse cx="42" cy="24" rx="7" ry="4.5" fill="#E8BE6E" />
          <circle cx="30" cy="58" r="2.2" fill="#99532A" />
          <circle cx="35" cy="61" r="2.2" fill="#99532A" />
          <circle cx="39" cy="36" r="1.8" fill="#99532A" />
          <circle cx="39" cy="46" r="1.8" fill="#99532A" />
        </>
      )}

      {spotId === 'zebra_watering_hole' && (
        <>
          <ellipse cx="48" cy="74" rx="36" ry="12" fill="#2EAFC0" stroke="#C9AC77" strokeWidth="3" />
          <ellipse cx="44" cy="48" rx="14" ry="9" fill="#F3EFE4" />
          <path d="M36 40 L38 56 M43 39 L45 57 M50 40 L51 56" stroke="#25262E" strokeWidth="2.5" />
          <rect x="34" y="54" width="3.5" height="13" fill="#F3EFE4" />
          <rect x="50" y="54" width="3.5" height="13" fill="#F3EFE4" />
          <path d="M54 44 L63 32 L69 36 L61 48 Z" fill="#F3EFE4" />
          <path d="M58 37 L63 40 M61 34 L66 37" stroke="#25262E" strokeWidth="2" />
        </>
      )}

      {spotId === 'conservation_lookout' && (
        <>
          <path d="M8 62 Q28 42 52 60 Q72 44 92 62 Z" fill="#7B9367" />
          <rect x="31" y="46" width="4" height="28" fill="#784E32" />
          <rect x="61" y="46" width="4" height="28" fill="#784E32" />
          <rect x="26" y="42" width="44" height="6" rx="2" fill="#9D6D47" />
          <path d="M24 32 L48 18 L72 32 Z" fill="#E3CB9F" stroke="#784E32" strokeWidth="2" />
          <rect x="28" y="34" width="40" height="8" fill="none" stroke="#784E32" strokeWidth="2" />
          <circle cx="52" cy="33" r="4" fill="#F2C66D" />
        </>
      )}
    </svg>
  );
}
