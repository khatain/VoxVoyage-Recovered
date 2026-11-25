import type { ComparisonZone } from '../../data/scotlandDiscovery';
import type { ScotlandPracticeSpeakerId } from '../../data/scotlandPractice';
import type { ScotlandLandmarkId } from '../../data/scotlandWorld';

interface ScotlandTextileSwatchSVGProps {
  variant: 'tartan_grid' | 'wool_kilt' | 'modern_jacket' | 'praewa_silk';
  className?: string;
}

/**
 * Miniature textile/garment illustration swatches for Station 2 (Tartan Pattern Puzzle).
 */
export function ScotlandTextileSwatchSVG({
  variant,
  className = 'h-10 w-10',
}: ScotlandTextileSwatchSVGProps) {
  return (
    <svg viewBox="0 0 48 48" className={`${className} shrink-0`} aria-hidden="true">
      {variant === 'tartan_grid' && (
        <>
          <rect width="48" height="48" rx="10" fill="#C84B43" />
          <rect x="10" y="0" width="8" height="48" fill="#1E3A5F" opacity="0.88" />
          <rect x="30" y="0" width="8" height="48" fill="#2E6B5E" opacity="0.88" />
          <rect x="0" y="10" width="48" height="8" fill="#1E3A5F" opacity="0.72" />
          <rect x="0" y="30" width="48" height="8" fill="#2E6B5E" opacity="0.72" />
          <line x1="24" y1="0" x2="24" y2="48" stroke="#F2C66D" strokeWidth="1.6" />
          <line x1="0" y1="24" x2="48" y2="24" stroke="#F2C66D" strokeWidth="1.6" />
        </>
      )}
      {variant === 'wool_kilt' && (
        <>
          <rect width="48" height="48" rx="10" fill="#EEF4F2" />
          <rect x="13" y="9" width="22" height="5" rx="2" fill="#334155" />
          <polygon points="12,14 36,14 40,39 8,39" fill="#C84B43" stroke="#1E3A5F" strokeWidth="1.5" />
          <line x1="17" y1="14" x2="14" y2="39" stroke="#1E3A5F" strokeWidth="2.5" />
          <line x1="24" y1="14" x2="24" y2="39" stroke="#2E6B5E" strokeWidth="2.5" />
          <line x1="31" y1="14" x2="34" y2="39" stroke="#1E3A5F" strokeWidth="2.5" />
          <line x1="10" y1="27" x2="38" y2="27" stroke="#F2C66D" strokeWidth="1.5" />
        </>
      )}
      {variant === 'modern_jacket' && (
        <>
          <rect width="48" height="48" rx="10" fill="#E6F1F8" />
          <path d="M15 11 L20 9 L24 13 L28 9 L33 11 L40 20 L35 23 L33 18 V38 H15 V18 L13 23 L8 20 Z" fill="#2B6CB0" stroke="#1E3A5F" strokeWidth="1.6" />
          <line x1="24" y1="14" x2="24" y2="38" stroke="#F2C66D" strokeWidth="1.8" />
        </>
      )}
      {variant === 'praewa_silk' && (
        <>
          <rect width="48" height="48" rx="10" fill="#6D1E3B" />
          <polygon points="24,8 34,20 24,32 14,20" fill="#F2C66D" />
          <polygon points="24,14 29,20 24,26 19,20" fill="#2ED6A3" />
          <polygon points="12,30 19,38 12,44 5,38" fill="#F2C66D" />
          <polygon points="36,30 43,38 36,44 29,38" fill="#F2C66D" />
        </>
      )}
    </svg>
  );
}

interface ScotlandDishIllustrationSVGProps {
  variant: 'oatcakes' | 'shortbread' | 'berries_oats';
  className?: string;
}

/**
 * Dish emblems for Station 3 (Highland Food Explorer) tray selector & recipe header.
 */
export function ScotlandDishIllustrationSVG({
  variant,
  className = 'h-10 w-10',
}: ScotlandDishIllustrationSVGProps) {
  return (
    <svg viewBox="0 0 48 48" className={`${className} shrink-0`} aria-hidden="true">
      <rect width="48" height="48" rx="10" fill="#FEF5E6" />
      {variant === 'oatcakes' && (
        <>
          <circle cx="26" cy="26" r="13" fill="#C79E63" stroke="#784C1C" strokeWidth="1.8" />
          <circle cx="20" cy="22" r="12" fill="#DCBA80" stroke="#784C1C" strokeWidth="1.8" />
          <line x1="20" y1="10" x2="20" y2="34" stroke="#8C5E2A" strokeWidth="1.2" opacity="0.65" />
          <line x1="8" y1="22" x2="32" y2="22" stroke="#8C5E2A" strokeWidth="1.2" opacity="0.65" />
        </>
      )}
      {variant === 'shortbread' && (
        <>
          <rect x="9" y="17" width="30" height="15" rx="3.5" fill="#F6C143" stroke="#92400E" strokeWidth="1.8" />
          <circle cx="15" cy="22" r="1.4" fill="#92400E" />
          <circle cx="24" cy="22" r="1.4" fill="#92400E" />
          <circle cx="33" cy="22" r="1.4" fill="#92400E" />
          <circle cx="15" cy="27" r="1.4" fill="#92400E" />
          <circle cx="24" cy="27" r="1.4" fill="#92400E" />
          <circle cx="33" cy="27" r="1.4" fill="#92400E" />
        </>
      )}
      {variant === 'berries_oats' && (
        <>
          <path d="M10 24 H38 L34 37 H14 Z" fill="#2B8C7E" stroke="#134E4A" strokeWidth="1.6" />
          <circle cx="19" cy="20" r="5" fill="#E11D48" stroke="#881337" strokeWidth="1.3" />
          <circle cx="28" cy="18" r="5.5" fill="#BE123C" stroke="#881337" strokeWidth="1.3" />
          <circle cx="32" cy="23" r="4" fill="#4338CA" />
          <ellipse cx="22" cy="24" rx="7" ry="2.2" fill="#E5C07B" />
        </>
      )}
    </svg>
  );
}

interface ScotlandCeramicMixingBowlSVGProps {
  filledCount: number;
  isNight?: boolean;
  className?: string;
}

/**
 * Interactive stoneware mixing bowl SVG that fills visually as ingredients 0 -> 3 are added.
 */
export function ScotlandCeramicMixingBowlSVG({
  filledCount,
  isNight = false,
  className = 'h-16 w-20',
}: ScotlandCeramicMixingBowlSVGProps) {
  return (
    <svg viewBox="0 0 96 76" className={`${className} shrink-0`} aria-hidden="true">
      {/* Ingredient Layers Revealed Progressively */}
      {filledCount >= 1 && (
        <ellipse cx="48" cy="34" rx="28" ry="8" fill="#E5C17B" />
      )}
      {filledCount >= 2 && (
        <>
          <circle cx="38" cy="31" r="4.5" fill="#FBBF24" />
          <circle cx="56" cy="31" r="4.5" fill="#D97706" />
        </>
      )}
      {filledCount >= 3 && (
        <>
          <circle cx="47" cy="27" r="5" fill="#E11D48" />
          <path d="M36 16 Q38 10 36 6" stroke="#2ED6A3" strokeWidth="2.2" fill="none" strokeLinecap="round" />
          <path d="M48 14 Q50 8 48 4" stroke="#F2C66D" strokeWidth="2.2" fill="none" strokeLinecap="round" />
          <path d="M60 16 Q62 10 60 6" stroke="#2ED6A3" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        </>
      )}

      {/* Bowl Body */}
      <path
        d="M14 34 H82 C82 56 68 68 48 68 C28 68 14 56 14 34 Z"
        fill={isNight ? '#2B4C58' : '#2B8C7E'}
        stroke={isNight ? '#7DD3FC' : '#134E4A'}
        strokeWidth="2.2"
      />
      <ellipse
        cx="48"
        cy="34"
        rx="34"
        ry="7"
        fill="none"
        stroke={isNight ? '#99F6E4' : '#CCFBF1'}
        strokeWidth="2"
      />
      {/* Ceramic Stripes */}
      <path d="M22 48 H74" stroke="#F2C66D" strokeWidth="3" strokeLinecap="round" opacity="0.85" />
    </svg>
  );
}

interface ScotlandInstrumentBadgeSVGProps {
  instrumentId: 'bagpipe' | 'fiddle' | 'bodhran';
  revealed: boolean;
  className?: string;
}

/**
 * Station 4 acoustic mystery crest (shows soundwave '?' until solved, then instrument vector).
 */
export function ScotlandInstrumentBadgeSVG({
  instrumentId,
  revealed,
  className = 'h-12 w-12',
}: ScotlandInstrumentBadgeSVGProps) {
  return (
    <svg viewBox="0 0 56 56" className={`${className} shrink-0`} aria-hidden="true">
      <rect
        width="56"
        height="56"
        rx="14"
        fill={revealed ? '#EEF9F5' : '#EEF1FA'}
        stroke={revealed ? '#2ED6A3' : '#64748B'}
        strokeWidth="2"
      />
      {!revealed ? (
        <>
          <circle cx="28" cy="28" r="15" fill="#5664B8" />
          <text
            x="28"
            y="34"
            textAnchor="middle"
            fontSize="18"
            fontWeight="800"
            fill="#FFFFFF"
          >
            ?
          </text>
        </>
      ) : instrumentId === 'bagpipe' ? (
        <>
          <line x1="18" y1="12" x2="26" y2="28" stroke="#78350F" strokeWidth="3" strokeLinecap="round" />
          <line x1="25" y1="10" x2="29" y2="28" stroke="#78350F" strokeWidth="3" strokeLinecap="round" />
          <line x1="33" y1="12" x2="32" y2="28" stroke="#78350F" strokeWidth="3" strokeLinecap="round" />
          <ellipse cx="29" cy="36" rx="13" ry="9" fill="#C84B43" stroke="#1E3A5F" strokeWidth="2" />
          <line x1="18" y1="36" x2="40" y2="36" stroke="#F2C66D" strokeWidth="2" />
        </>
      ) : instrumentId === 'fiddle' ? (
        <>
          <rect x="25.5" y="9" width="5" height="16" rx="1.5" fill="#78350F" />
          <ellipse cx="28" cy="32" rx="11" ry="13" fill="#C26A27" stroke="#78350F" strokeWidth="2" />
          <line x1="28" y1="14" x2="28" y2="42" stroke="#FDE68A" strokeWidth="1.5" />
          <line x1="14" y1="24" x2="42" y2="40" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
        </>
      ) : (
        <>
          <circle cx="28" cy="28" r="15" fill="#FDE68A" stroke="#78350F" strokeWidth="3.5" />
          <line x1="18" y1="38" x2="38" y2="18" stroke="#92400E" strokeWidth="3" strokeLinecap="round" />
          <circle cx="28" cy="28" r="2.5" fill="#78350F" />
        </>
      )}
    </svg>
  );
}

interface ScotlandZoneCrestSVGProps {
  zone: ComparisonZone;
  className?: string;
}

/**
 * Column emblems for Station 5 Culture Comparison Compass (Scotland / Both / Thailand).
 */
export function ScotlandZoneCrestSVG({ zone, className = 'h-7 w-7' }: ScotlandZoneCrestSVGProps) {
  return (
    <svg viewBox="0 0 36 36" className={`${className} shrink-0`} aria-hidden="true">
      {zone === 'scotland' && (
        <>
          <circle cx="18" cy="18" r="16" fill="#E3EEF8" stroke="#3B78A8" strokeWidth="2" />
          <path d="M11 25 V14 H14 V17 H16.5 V13 H19.5 V17 H22 V14 H25 V25 Z" fill="#3B78A8" />
          <circle cx="18" cy="10" r="2.5" fill="#9333EA" />
        </>
      )}
      {zone === 'both' && (
        <>
          <circle cx="18" cy="18" r="16" fill="#E2F7F3" stroke="#2B8C7E" strokeWidth="2" />
          <polygon points="18,7 21,18 18,29 15,18" fill="#D99B26" />
          <polygon points="7,18 18,15 29,18 18,21" fill="#2B8C7E" />
        </>
      )}
      {zone === 'thailand' && (
        <>
          <circle cx="18" cy="18" r="16" fill="#FEF4E4" stroke="#D98E32" strokeWidth="2" />
          <polygon points="18,7 25,18 11,18" fill="#D98E32" />
          <rect x="12" y="18" width="12" height="8" rx="1" fill="#B45309" />
          <polygon points="18,10 21,16 15,16" fill="#FDE68A" />
        </>
      )}
    </svg>
  );
}


/**
 * Subtle 6px woven tartan ribbon border accent for Scotland modal headers.
 */
export function ScotlandTartanRibbonDivider() {
  return (
    <div
      className="h-2 w-full"
      aria-hidden="true"
      style={{
        backgroundImage:
          'repeating-linear-gradient(90deg, #1E3A5F 0px, #1E3A5F 18px, #2E6B5E 18px, #2E6B5E 32px, #C84B43 32px, #C84B43 44px, #F2C66D 44px, #F2C66D 48px)',
      }}
    />
  );
}

interface ScotlandNpcPortraitSVGProps {
  npcId: ScotlandPracticeSpeakerId;
  isNight?: boolean;
  className?: string;
}

/**
 * Hand-crafted character bust portraits matching Eilidh MacLeod & Fiona Campbell in the 3D Highland world.
 */
export function ScotlandNpcPortraitSVG({
  npcId,
  isNight = false,
  className = 'h-14 w-14',
}: ScotlandNpcPortraitSVGProps) {
  const isEilidh = npcId === 'eilidh';
  return (
    <svg viewBox="0 0 64 64" className={`${className} shrink-0`} aria-hidden="true">
      <rect
        width="64"
        height="64"
        rx="14"
        fill={
          isEilidh
            ? isNight
              ? '#15323A'
              : '#E4F6F0'
            : isNight
              ? '#241E3F'
              : '#EFEAF8'
        }
      />
      {/* Soft Mist Hills Backdrop */}
      <path
        d="M0 46 Q20 34 38 42 Q52 47 64 38 V64 H0 Z"
        fill={isEilidh ? '#2E6B5E' : '#5D4A82'}
        opacity="0.22"
      />

      {isEilidh ? (
        <>
          {/* Eilidh: Auburn hair back, teal sweater + tartan scarf */}
          <path d="M19 26 Q18 11 32 11 Q46 11 45 26 L47 42 H17 Z" fill="#A94A2A" />
          <path d="M14 62 Q16 44 32 44 Q48 44 50 62 Z" fill="#2E6B5E" />
          {/* Tartan Scarf Accent */}
          <path d="M21 44 L32 51 L43 44 L41 54 L23 54 Z" fill="#C84B43" />
          <line x1="25" y1="47" x2="39" y2="47" stroke="#F2C66D" strokeWidth="1.5" />
          {/* Neck & Face */}
          <rect x="28" y="38" width="8" height="8" rx="3" fill="#F6C8A5" />
          <circle cx="32" cy="28" r="11.5" fill="#F9D5B9" />
          {/* Hair Bangs */}
          <path d="M20 26 Q25 14 35 16 Q42 17 44 26 Q36 20 20 26 Z" fill="#B85432" />
          {/* Eyes & Smile */}
          <circle cx="27.5" cy="28" r="1.6" fill="#1E2E46" />
          <circle cx="36.5" cy="28" r="1.6" fill="#1E2E46" />
          <path d="M28 33 Q32 36.5 36 33" stroke="#9C4D3B" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          {/* Teal Beret */}
          <ellipse cx="31" cy="15" rx="11" ry="4.5" fill="#1F5146" />
          <circle cx="32" cy="10.5" r="1.6" fill="#F2C66D" />
        </>
      ) : (
        <>
          {/* Fiona: Dark chestnut hair with silver heritage bun, plum heritage cloak & heather brooch */}
          <circle cx="32" cy="14" r="6" fill="#4E3E4B" />
          <circle cx="32" cy="13" r="4" fill="#9CA3AF" opacity="0.45" />
          <path d="M13 62 Q16 43 32 43 Q48 43 51 62 Z" fill="#5D4482" />
          {/* Woven Shawl */}
          <path d="M18 45 Q32 54 46 45 L44 58 H20 Z" fill="#3A7D6C" />
          <circle cx="32" cy="49" r="3" fill="#F2C66D" stroke="#1E3A5F" strokeWidth="1.2" />
          {/* Neck & Face */}
          <rect x="28" y="38" width="8" height="8" rx="3" fill="#F1C3A2" />
          <circle cx="32" cy="28" r="11.5" fill="#F5CFB2" />
          {/* Hair */}
          <path d="M20 28 Q21 15 32 15 Q43 15 44 28 Q37 21 32 22 Q27 21 20 28 Z" fill="#4E3E4B" />
          <path d="M22 22 Q26 19 30 21" stroke="#CBD5E1" strokeWidth="1.4" fill="none" strokeLinecap="round" />
          {/* Warm Eyes & Smile */}
          <circle cx="27.5" cy="28" r="1.6" fill="#1E2E46" />
          <circle cx="36.5" cy="28" r="1.6" fill="#1E2E46" />
          <path d="M28 33.5 Q32 36 36 33.5" stroke="#8C483A" strokeWidth="1.7" fill="none" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}

interface ScotlandExchangeHeaderBannerSVGProps {
  stationId: ScotlandLandmarkId;
  isNight?: boolean;
  className?: string;
}

/**
 * Highland cultural exhibition header strip for Stage 3 PRACTICE conversation modals.
 */
export function ScotlandExchangeHeaderBannerSVG({
  stationId,
  isNight = false,
  className = 'h-11 w-full',
}: ScotlandExchangeHeaderBannerSVGProps) {
  return (
    <svg
      viewBox="0 0 640 60"
      preserveAspectRatio="none"
      className={`${className} shrink-0`}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`scotland-banner-${stationId}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={isNight ? '#162847' : '#26534C'} />
          <stop offset="55%" stopColor={isNight ? '#213B5E' : '#3A7D6C'} />
          <stop offset="100%" stopColor={isNight ? '#2E2A52' : '#53477E'} />
        </linearGradient>
      </defs>

      <rect width="640" height="60" fill={`url(#scotland-banner-${stationId})`} />

      {/* Distant Munros & Mist */}
      <polygon points="0,60 95,22 195,48 310,16 440,46 555,20 640,42 640,60" fill="#0F172A" opacity="0.22" />
      <polygon points="40,60 155,30 270,52 390,26 510,50 640,28 640,60" fill="#2ED6A3" opacity="0.14" />

      {/* Festive Exhibition Bunting / Pennants */}
      <path d="M0 10 Q160 22 320 10 Q480 22 640 10" stroke="#F2C66D" strokeWidth="1.6" fill="none" opacity="0.65" />
      {[50, 120, 190, 260, 380, 450, 520, 590].map((x, idx) => (
        <polygon
          key={x}
          points={`${x - 9},14 ${x + 9},14 ${x},28`}
          fill={idx % 3 === 0 ? '#F2C66D' : idx % 3 === 1 ? '#2ED6A3' : '#FF8A65'}
          opacity="0.72"
        />
      ))}

      {/* Subtle Landmark Silhouette Accents */}
      {stationId === 'lochside_castle_viewpoint' && (
        <path
          d="M540 58 V30 H548 V36 H554 V26 H564 V36 H570 V30 H578 V58 Z"
          fill="#F2C66D"
          opacity="0.32"
        />
      )}
      {stationId === 'tartan_heritage_workshop' && (
        <g opacity="0.26" stroke="#F2C66D" strokeWidth="2">
          <line x1="530" y1="12" x2="530" y2="54" />
          <line x1="550" y1="12" x2="550" y2="54" />
          <line x1="518" y1="26" x2="564" y2="26" />
          <line x1="518" y1="40" x2="564" y2="40" />
        </g>
      )}
    </svg>
  );
}

