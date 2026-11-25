import type { JaipurVocabObjectId } from '../../data/jaipurWorld';

interface JaipurObjectIllustrationSVGProps {
  objectId: JaipurVocabObjectId;
  isNight?: boolean;
  className?: string;
}

/**
 * Purely presentational Jaipur landmark & cultural object illustrations
 * shared across India mini-game UIs (Word Detective, Sentence Train, Spot & Speak, Showcase).
 */
export function JaipurObjectIllustrationSVG({
  objectId,
  isNight = false,
  className = 'h-16 w-16',
}: JaipurObjectIllustrationSVGProps) {
  const gradId = `jaipur-sky-${objectId}-${isNight ? 'night' : 'day'}`;

  return (
    <svg viewBox="0 0 112 112" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          {isNight ? (
            <>
              <stop offset="0%" stopColor="#162347" />
              <stop offset="100%" stopColor="#2B3D6B" />
            </>
          ) : (
            <>
              <stop offset="0%" stopColor="#FCE1C3" />
              <stop offset="100%" stopColor="#FFF5E4" />
            </>
          )}
        </linearGradient>
      </defs>

      <rect width="112" height="112" rx="22" fill={`url(#${gradId})`} />
      {/* Sun or Crescent Moon */}
      {isNight ? (
        <>
          <circle cx="88" cy="20" r="8" fill="#F2C66D" />
          <circle cx="91" cy="18" r="7" fill="#162347" />
          <circle cx="24" cy="20" r="1.5" fill="#F7F9FC" opacity="0.8" />
          <circle cx="42" cy="14" r="1.2" fill="#F2C66D" opacity="0.8" />
        </>
      ) : (
        <circle cx="88" cy="22" r="9" fill="#F6C86E" opacity="0.9" />
      )}

      {/* Sandstone Courtyard Ground */}
      <rect
        x="0"
        y="80"
        width="112"
        height="32"
        fill={isNight ? '#3B2B32' : '#E8B899'}
      />
      <rect
        x="0"
        y="78"
        width="112"
        height="4"
        fill={isNight ? '#5C3C42' : '#D98C6C'}
      />

      {objectId === 'palace' && (
        <>
          {/* Hawa Mahal Pink Sandstone Palace */}
          <rect x="16" y="42" width="80" height="40" rx="3" fill="#DF7863" stroke="#9D3F31" strokeWidth="2" />
          <rect x="26" y="28" width="60" height="16" rx="2" fill="#E88974" stroke="#9D3F31" strokeWidth="2" />
          {/* Three Chhatri Domes */}
          <path d="M30 28 Q38 14 46 28 Z" fill="#F2C66D" stroke="#9D3F31" strokeWidth="1.5" />
          <path d="M48 26 Q56 10 64 26 Z" fill="#F2C66D" stroke="#9D3F31" strokeWidth="1.5" />
          <path d="M66 28 Q74 14 82 28 Z" fill="#F2C66D" stroke="#9D3F31" strokeWidth="1.5" />
          <line x1="56" y1="10" x2="56" y2="14" stroke="#F2C66D" strokeWidth="2" />
          {/* Jharokha arched windows */}
          {[24, 40, 56, 72].map((x) => (
            <g key={x}>
              <path
                d={`M${x} 64 V51 Q${x + 5} 45 ${x + 10} 51 V64 Z`}
                fill={isNight ? '#F7D27A' : '#FFF7E8'}
                stroke="#9D3F31"
                strokeWidth="1.5"
              />
              <rect
                x={x + 2}
                y="68"
                width="6"
                height="12"
                rx="1"
                fill={isNight ? '#F7D27A' : '#8A3024'}
              />
            </g>
          ))}
        </>
      )}

      {objectId === 'archway' && (
        <>
          {/* Grand Pink Sandstone Archway */}
          <rect x="18" y="24" width="76" height="58" rx="4" fill="#D96852" stroke="#8C3426" strokeWidth="2" />
          <rect x="14" y="20" width="84" height="7" rx="3" fill="#F2C66D" stroke="#8C3426" strokeWidth="1.6" />
          {/* Carved Cusped Inner Arch */}
          <path
            d="M36 82 V50 Q36 32 56 32 Q76 32 76 50 V82 Z"
            fill={isNight ? '#1B2A4A' : '#FFECCF'}
            stroke="#8C3426"
            strokeWidth="2.2"
          />
          {/* Courtyard Pathway */}
          <polygon points="44,82 68,82 78,112 34,112" fill={isNight ? '#4C363C' : '#F3C7A4'} />
          {/* Marigold Garland */}
          <path d="M37 42 Q56 54 75 42" fill="none" stroke="#F59E0B" strokeWidth="3.5" strokeDasharray="3 3" strokeLinecap="round" />
          <circle cx="27" cy="40" r="3.5" fill="#F2C66D" />
          <circle cx="85" cy="40" r="3.5" fill="#F2C66D" />
        </>
      )}

      {objectId === 'market_stall' && (
        <>
          {/* Wooden Bazaar Pillars */}
          <rect x="20" y="42" width="5" height="40" fill="#7C4728" />
          <rect x="87" y="42" width="5" height="40" fill="#7C4728" />
          {/* Striped Terracotta & Gold Canopy */}
          <path d="M12 44 L22 24 H90 L100 44 Z" fill="#E05A47" stroke="#8C3426" strokeWidth="2" />
          <path d="M30 24 L26 44 H40 L42 24 Z" fill="#F2C66D" />
          <path d="M56 24 V44 H70 L68 24 Z" fill="#F2C66D" />
          <path d="M80 24 L84 44 H96 L88 24 Z" fill="#24B8B0" />
          {/* Counter & Colorful Spice Bowls */}
          <rect x="18" y="64" width="76" height="18" rx="3" fill="#9A5B32" stroke="#683B1E" strokeWidth="2" />
          <path d="M26 64 Q34 52 42 64 Z" fill="#F59E0B" />
          <path d="M48 64 Q56 50 64 64 Z" fill="#DC2626" />
          <path d="M70 64 Q78 52 86 64 Z" fill="#10B981" />
          <rect x="25" y="63" width="18" height="4" rx="1.5" fill="#B45309" />
          <rect x="47" y="63" width="18" height="4" rx="1.5" fill="#B45309" />
          <rect x="69" y="63" width="18" height="4" rx="1.5" fill="#B45309" />
        </>
      )}

      {objectId === 'colorful_fabric' && (
        <>
          {/* Display Rack */}
          <line x1="18" y1="26" x2="94" y2="26" stroke="#7C4728" strokeWidth="4" strokeLinecap="round" />
          <line x1="22" y1="26" x2="22" y2="82" stroke="#7C4728" strokeWidth="3.5" />
          <line x1="90" y1="26" x2="90" y2="82" stroke="#7C4728" strokeWidth="3.5" />
          {/* Three Draped Rajasthani Printed Cloths */}
          <rect x="27" y="28" width="17" height="46" rx="3" fill="#D94A64" stroke="#881337" strokeWidth="1.5" />
          <rect x="47.5" y="28" width="17" height="50" rx="3" fill="#24B8B0" stroke="#0F766E" strokeWidth="1.5" />
          <rect x="68" y="28" width="17" height="44" rx="3" fill="#F2C66D" stroke="#B45309" strokeWidth="1.5" />
          {/* Block-Print Diamond Motifs */}
          <polygon points="35.5,38 40,44 35.5,50 31,44" fill="#FDE68A" />
          <polygon points="35.5,56 40,62 35.5,68 31,62" fill="#FDE68A" />
          <circle cx="56" cy="44" r="4" fill="#FFFDF8" />
          <circle cx="56" cy="60" r="4" fill="#F2C66D" />
          <polygon points="76.5,38 81,44 76.5,50 72,44" fill="#C4503B" />
          <polygon points="76.5,54 81,60 76.5,66 72,60" fill="#24B8B0" />
        </>
      )}

      {objectId === 'fountain' && (
        <>
          {/* Carved Sandstone Octagonal Basin */}
          <ellipse cx="56" cy="78" rx="38" ry="12" fill="#D98C6C" stroke="#8C3426" strokeWidth="2" />
          <ellipse cx="56" cy="74" rx="31" ry="8.5" fill="#24B8B0" />
          {/* Tiered Fountain Pedestal */}
          <rect x="50" y="48" width="12" height="24" rx="3" fill="#E8A286" stroke="#8C3426" strokeWidth="1.6" />
          <ellipse cx="56" cy="50" rx="16" ry="5" fill="#F3B89E" stroke="#8C3426" strokeWidth="1.6" />
          {/* Sparkling Turquoise Water Jets */}
          <path d="M56 32 C42 36 34 52 34 72" fill="none" stroke="#5CE1E6" strokeWidth="2.8" strokeLinecap="round" />
          <path d="M56 32 C70 36 78 52 78 72" fill="none" stroke="#5CE1E6" strokeWidth="2.8" strokeLinecap="round" />
          <path d="M56 24 V48" fill="none" stroke="#BDF6F8" strokeWidth="3" strokeLinecap="round" />
          <circle cx="56" cy="23" r="4.5" fill="#BDF6F8" />
          <circle cx="44" cy="68" r="2.2" fill="#FFFDF8" opacity="0.8" />
          <circle cx="68" cy="70" r="2.2" fill="#FFFDF8" opacity="0.8" />
        </>
      )}
    </svg>
  );
}

interface JaipurTrainBannerSVGProps {
  completedStops: number;
  totalStops: number;
  solved?: boolean;
  isNight?: boolean;
  className?: string;
}

/**
 * Scenic heritage Palace-on-Wheels steam train header banner for Sentence Train.
 */
export function JaipurTrainBannerSVG({
  completedStops,
  totalStops,
  solved = false,
  isNight = false,
  className = 'h-16 w-full',
}: JaipurTrainBannerSVGProps) {
  const bgId = isNight ? 'jaipur-train-night' : 'jaipur-train-day';
  const progressRatio = Math.min(1, Math.max(0, (completedStops + (solved ? 1 : 0.35)) / totalStops));
  const trainX = 18 + Math.round(progressRatio * 340);

  return (
    <svg viewBox="0 0 480 68" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={bgId} x1="0" y1="0" x2="1" y2="0">
          {isNight ? (
            <>
              <stop offset="0%" stopColor="#1A2648" />
              <stop offset="50%" stopColor="#26294F" />
              <stop offset="100%" stopColor="#1A2B45" />
            </>
          ) : (
            <>
              <stop offset="0%" stopColor="#FDE4C8" />
              <stop offset="55%" stopColor="#FFF4DE" />
              <stop offset="100%" stopColor="#E4F7F5" />
            </>
          )}
        </linearGradient>
      </defs>

      <rect width="480" height="68" rx="14" fill={`url(#${bgId})`} />

      {/* Distant Pink City Dome & Arch Silhouettes */}
      <path
        d="M28 52 V32 Q42 20 56 32 V52 M88 52 V28 Q106 14 124 28 V52 M220 52 V30 Q238 16 256 30 V52 M360 52 V26 Q378 14 396 26 V52"
        fill={isNight ? '#2D3A64' : '#F3BEAA'}
        opacity="0.6"
      />

      {/* Wooden Sleeper Track Bed */}
      <rect x="10" y="54" width="460" height="5" rx="2.5" fill={isNight ? '#4F6088' : '#8C583A'} />
      <rect x="10" y="51" width="460" height="3" fill={isNight ? '#8AA0C8' : '#B87C56'} />

      {/* Moving Heritage Steam Locomotive + Trailing Marigold Coach */}
      <g transform={`translate(${trainX}, 0)`}>
        {/* Steam Puffs */}
        <circle cx="72" cy="14" r="5" fill={isNight ? '#D9E4F5' : '#FFFFFF'} opacity="0.7" />
        <circle cx="60" cy="11" r="4" fill={isNight ? '#D9E4F5' : '#FFFFFF'} opacity="0.5" />
        {/* Coach */}
        <rect x="0" y="28" width="38" height="20" rx="4" fill="#24B8B0" stroke="#134E4A" strokeWidth="1.5" />
        <rect x="5" y="33" width="8" height="7" rx="1.5" fill="#FFF8E6" />
        <rect x="16" y="33" width="8" height="7" rx="1.5" fill="#FFF8E6" />
        <rect x="27" y="33" width="6" height="7" rx="1.5" fill="#FFF8E6" />
        <circle cx="10" cy="50" r="4" fill="#20304A" />
        <circle cx="28" cy="50" r="4" fill="#20304A" />
        {/* Coupling */}
        <rect x="38" y="42" width="5" height="3" fill="#9A5B32" />
        {/* Engine */}
        <rect x="43" y="24" width="44" height="24" rx="4" fill="#D95D48" stroke="#7C2D12" strokeWidth="1.5" />
        <rect x="43" y="20" width="18" height="28" rx="3" fill="#F2C66D" stroke="#7C2D12" strokeWidth="1.5" />
        <rect x="70" y="16" width="8" height="9" rx="1.5" fill="#20304A" />
        <rect x="47" y="25" width="10" height="8" rx="1.5" fill="#FFF8E6" />
        <polygon points="87,36 96,48 87,48" fill="#F2C66D" stroke="#7C2D12" strokeWidth="1.2" />
        <circle cx="53" cy="50" r="4.5" fill="#20304A" />
        <circle cx="71" cy="50" r="4.5" fill="#20304A" />
        <circle cx="81" cy="50" r="3.5" fill="#20304A" />
      </g>
    </svg>
  );
}

interface JaipurStageBannerSVGProps {
  isNight?: boolean;
  className?: string;
}

/**
 * Decorative Jaipur Royal Amphitheater crest strip for Final Jaipur Showcase.
 */
export function JaipurStageBannerSVG({
  isNight = false,
  className = 'h-16 w-full',
}: JaipurStageBannerSVGProps) {
  return (
    <svg viewBox="0 0 420 68" className={className} aria-hidden="true">
      <rect
        width="420"
        height="68"
        rx="14"
        fill={isNight ? '#1B2547' : '#FBE4D2'}
      />
      {/* Terracotta Scalloped Archways */}
      <path
        d="M0 68 V18 Q35 6 70 18 Q105 6 140 18 Q175 6 210 18 Q245 6 280 18 Q315 6 350 18 Q385 6 420 18 V68 Z"
        fill={isNight ? '#23325C' : '#F3C5AC'}
        opacity="0.65"
      />
      {/* Hanging Brass Lanterns */}
      {[54, 134, 286, 366].map((lx) => (
        <g key={lx}>
          <line x1={lx} y1="0" x2={lx} y2="18" stroke="#D99B26" strokeWidth="2" />
          <polygon points={`${lx - 6},18 ${lx + 6},18 ${lx + 8},30 ${lx - 8},30`} fill="#F2C66D" />
          <circle cx={lx} cy="24" r="3" fill="#FFFBEB" />
        </g>
      ))}
      {/* Center Lotus Podium Emblem */}
      <circle cx="210" cy="36" r="21" fill={isNight ? '#131E31' : '#FFFDF8'} stroke="#F2C66D" strokeWidth="2.5" />
      <path d="M210 21 C202 29 202 41 210 47 C218 41 218 29 210 21 Z" fill="#E07A68" />
      <path d="M196 31 C200 41 206 46 210 47 C207 37 202 31 196 31 Z" fill="#24B8B0" />
      <path d="M224 31 C220 41 214 46 210 47 C213 37 218 31 224 31 Z" fill="#24B8B0" />
    </svg>
  );
}
