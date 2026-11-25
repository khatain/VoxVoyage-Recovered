import type { AppLanguage, ResolvedAppearance } from '../../types/game';

interface IndiaJaipurStampSVGProps {
  language: AppLanguage;
  appearance: ResolvedAppearance;
  earned: boolean;
  completedAt?: string;
  sizeClass?: string;
}

function formatStampDate(isoDate?: string): string {
  const parsed = isoDate ? new Date(isoDate) : new Date();
  const safeDate = Number.isNaN(parsed.getTime()) ? new Date() : parsed;
  const day = safeDate.getDate().toString().padStart(2, '0');
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  const month = months[safeDate.getMonth()];
  const year = safeDate.getFullYear();
  return `${day} ${month} ${year}`;
}

export function IndiaJaipurStampSVG({
  language,
  appearance,
  earned,
  completedAt,
  sizeClass = 'h-32 w-32',
}: IndiaJaipurStampSVGProps) {
  const isNight = appearance === 'night';
  const dateText = earned ? formatStampDate(completedAt) : language === 'th' ? 'รอปลดล็อก' : 'PENDING';
  const inkPrimary = earned ? (isNight ? '#FF9E7A' : '#B83F2B') : isNight ? '#5C708F' : '#8FA0B8';
  const inkAccent = earned ? (isNight ? '#F2C66D' : '#C68218') : isNight ? '#5C708F' : '#8FA0B8';
  const inkTeal = earned ? (isNight ? '#2ED6A3' : '#0E7A74') : isNight ? '#5C708F' : '#8FA0B8';

  return (
    <svg
      viewBox="0 0 180 180"
      className={sizeClass}
      role="img"
      aria-label={
        language === 'th'
          ? `ตราประทับพาสปอร์ตอินเดีย ชัยปุระ ${earned ? dateText : 'ยังไม่ได้รับ'}`
          : `India Jaipur Passport Stamp ${earned ? dateText : 'Locked'}`
      }
    >
      {/* Subtle parchment/ink seal backdrop */}
      <circle
        cx="90"
        cy="90"
        r="83"
        fill={earned ? (isNight ? '#231926' : '#FFF4EA') : isNight ? '#162238' : '#F2F5FA'}
        stroke={inkPrimary}
        strokeWidth="3.5"
      />
      <circle
        cx="90"
        cy="90"
        r="75"
        fill="none"
        stroke={inkPrimary}
        strokeWidth="1.8"
        strokeDasharray="4 3"
      />
      <circle cx="90" cy="90" r="56" fill="none" stroke={inkAccent} strokeWidth="1.4" />

      {/* Top curved banner label: INDIA */}
      <defs>
        <path id="jaipurStampTopArc" d="M 30 90 A 60 60 0 0 1 150 90" />
        <path id="jaipurStampBottomArc" d="M 33 96 A 58 58 0 0 0 147 96" />
      </defs>

      <text
        fill={inkPrimary}
        fontSize="13.5"
        fontWeight="800"
        letterSpacing="3.5"
        textAnchor="middle"
      >
        <textPath href="#jaipurStampTopArc" startOffset="50%">
          INDIA · IND
        </textPath>
      </text>

      <text
        fill={inkAccent}
        fontSize="9.2"
        fontWeight="800"
        letterSpacing="1.8"
        textAnchor="middle"
      >
        <textPath href="#jaipurStampBottomArc" startOffset="50%">
          JAIPUR · PINK CITY
        </textPath>
      </text>

      {/* Side decorative stars */}
      <circle cx="24" cy="90" r="2.2" fill={inkAccent} />
      <circle cx="156" cy="90" r="2.2" fill={inkAccent} />

      {/* Jaipur Landmark Illustration: Pink Palace + Archway + Lotus Fountain */}
      {/* Chhatri & Palace Domes */}
      <path
        d="M66 78 C66 66, 74 60, 74 56 C74 60, 82 66, 82 78 Z"
        fill={inkAccent}
        opacity={earned ? 0.92 : 0.45}
      />
      <path
        d="M98 78 C98 66, 106 60, 106 56 C106 60, 114 66, 114 78 Z"
        fill={inkAccent}
        opacity={earned ? 0.92 : 0.45}
      />
      <path
        d="M80 76 C80 61, 90 52, 90 47 C90 52, 100 61, 100 76 Z"
        fill={inkPrimary}
        opacity={earned ? 0.95 : 0.5}
      />
      <line x1="90" y1="43" x2="90" y2="48" stroke={inkAccent} strokeWidth="2" strokeLinecap="round" />

      {/* Pink City Sandstone Archway Wall */}
      <path
        d="M54 106 L54 78 L126 78 L126 106 L106 106 L106 92 C106 83, 74 83, 74 92 L74 106 Z"
        fill={inkPrimary}
        opacity={earned ? 0.88 : 0.4}
      />

      {/* Lotus Fountain Ripples */}
      <path
        d="M62 112 Q90 107 118 112"
        fill="none"
        stroke={inkTeal}
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M72 117 Q90 113 108 117"
        fill="none"
        stroke={inkTeal}
        strokeWidth="1.6"
        strokeLinecap="round"
      />

      {/* Small completion date strip inside seal */}
      <rect
        x="52"
        y="122"
        width="76"
        height="15"
        rx="7.5"
        fill={earned ? (isNight ? '#142B30' : '#E7F8F5') : isNight ? '#1D2940' : '#E6ECF4'}
        stroke={inkTeal}
        strokeWidth="1"
      />
      <text
        x="90"
        y="132.5"
        textAnchor="middle"
        fill={inkTeal}
        fontSize="8.2"
        fontWeight="800"
        fontFamily="monospace"
      >
        {dateText}
      </text>
    </svg>
  );
}
