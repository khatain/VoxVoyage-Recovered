import type { AppLanguage, ResolvedAppearance } from '../../types/game';

interface AustraliaSydneyStampSVGProps {
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
  const months = [
    'JAN',
    'FEB',
    'MAR',
    'APR',
    'MAY',
    'JUN',
    'JUL',
    'AUG',
    'SEP',
    'OCT',
    'NOV',
    'DEC',
  ];
  const month = months[safeDate.getMonth()];
  const year = safeDate.getFullYear();
  return `${day} ${month} ${year}`;
}

/**
 * Custom Sydney, Australia Passport Stamp with Harbour Bridge arch ribs,
 * curved harbour sails, ocean waves, coastal teal accents, and completion date.
 */
export function AustraliaSydneyStampSVG({
  language,
  appearance,
  earned,
  completedAt,
  sizeClass = 'h-32 w-32',
}: AustraliaSydneyStampSVGProps) {
  const isNight = appearance === 'night';
  const dateText = earned
    ? formatStampDate(completedAt)
    : language === 'th'
      ? 'รอปลดล็อก'
      : 'PENDING';

  const inkBlue = earned
    ? isNight
      ? '#38BDF8'
      : '#168FE5'
    : isNight
      ? '#5C708F'
      : '#8FA0B8';
  const inkTeal = earned
    ? isNight
      ? '#2DD4BF'
      : '#00A896'
    : isNight
      ? '#5C708F'
      : '#8FA0B8';
  const inkGold = earned
    ? isNight
      ? '#FFCC4D'
      : '#C2820A'
    : isNight
      ? '#5C708F'
      : '#8FA0B8';
  const inkCoral = earned
    ? isNight
      ? '#FF9478'
      : '#D95338'
    : isNight
      ? '#5C708F'
      : '#8FA0B8';

  return (
    <svg
      viewBox="0 0 180 180"
      className={sizeClass}
      role="img"
      aria-label={
        language === 'th'
          ? `ตราประทับพาสปอร์ตออสเตรเลีย ซิดนีย์ ${earned ? dateText : 'รอปลดล็อก'}`
          : `Australia Sydney Passport Stamp ${earned ? dateText : 'Locked'}`
      }
    >
      <circle
        cx="90"
        cy="90"
        r="83"
        fill={earned ? (isNight ? '#0F223D' : '#EBF7FF') : isNight ? '#162238' : '#F2F5FA'}
        stroke={inkBlue}
        strokeWidth="3.5"
      />
      <circle
        cx="90"
        cy="90"
        r="75"
        fill="none"
        stroke={inkTeal}
        strokeWidth="1.8"
        strokeDasharray="4 3"
      />
      <circle cx="90" cy="90" r="56" fill="none" stroke={inkGold} strokeWidth="1.4" />

      <defs>
        <path id="australiaStampTopArc" d="M 29 90 A 61 61 0 0 1 151 90" />
        <path id="australiaStampBottomArc" d="M 33 96 A 58 58 0 0 0 147 96" />
      </defs>

      <text
        fill={inkBlue}
        fontSize="12.4"
        fontWeight="800"
        letterSpacing="2.6"
        textAnchor="middle"
      >
        <textPath href="#australiaStampTopArc" startOffset="50%">
          AUSTRALIA · AUS
        </textPath>
      </text>

      <text
        fill={inkTeal}
        fontSize="8.8"
        fontWeight="800"
        letterSpacing="1.8"
        textAnchor="middle"
      >
        <textPath href="#australiaStampBottomArc" startOffset="50%">
          CITYTALK QUEST
        </textPath>
      </text>

      {/* Sunburst Corner Dots */}
      <circle cx="24" cy="90" r="2.4" fill={inkGold} />
      <circle cx="156" cy="90" r="2.4" fill={inkGold} />

      {/* Warm Coastal Sun */}
      <circle
        cx="119"
        cy="66"
        r="8"
        fill={inkCoral}
        opacity={earned ? 0.85 : 0.35}
      />

      {/* Harbour Bridge Steel Arch Silhouette */}
      <path
        d="M52 103 Q90 61 128 103"
        fill="none"
        stroke={inkBlue}
        strokeWidth="3.2"
        strokeLinecap="round"
        opacity={earned ? 0.9 : 0.45}
      />
      <path
        d="M64 103 Q90 73 116 103"
        fill="none"
        stroke={inkBlue}
        strokeWidth="1.6"
        opacity={earned ? 0.75 : 0.35}
      />
      <rect x="50" y="92" width="6" height="14" rx="1" fill={inkBlue} opacity={earned ? 0.9 : 0.45} />
      <rect x="124" y="92" width="6" height="14" rx="1" fill={inkBlue} opacity={earned ? 0.9 : 0.45} />
      <line
        x1="50"
        y1="101"
        x2="130"
        y2="101"
        stroke={inkGold}
        strokeWidth="2"
        opacity={earned ? 0.9 : 0.45}
      />

      {/* Opera Sails Waterfront Emblem */}
      <path
        d="M64 105 Q71 80 82 105 Z"
        fill={isNight ? '#F8FAFC' : '#FFFFFF'}
        stroke={inkTeal}
        strokeWidth="1.8"
        opacity={earned ? 0.98 : 0.55}
      />
      <path
        d="M78 105 Q88 73 102 105 Z"
        fill={isNight ? '#E0F2FE' : '#F0F9FF'}
        stroke={inkTeal}
        strokeWidth="1.8"
        opacity={earned ? 0.98 : 0.55}
      />
      <path
        d="M97 105 Q106 83 115 105 Z"
        fill={isNight ? '#BAE6FD' : '#E0F2FE'}
        stroke={inkTeal}
        strokeWidth="1.8"
        opacity={earned ? 0.98 : 0.55}
      />

      {/* Ocean Wave Lines */}
      <path
        d="M52 110 Q71 106 90 110 Q109 114 128 110"
        fill="none"
        stroke={inkTeal}
        strokeWidth="2.1"
        strokeLinecap="round"
      />
      <path
        d="M62 115 Q90 112 118 115"
        fill="none"
        stroke={inkGold}
        strokeWidth="1.6"
        strokeLinecap="round"
      />

      {/* Completion Date Badge */}
      <rect
        x="52"
        y="122"
        width="76"
        height="15"
        rx="7.5"
        fill={earned ? (isNight ? '#112B4A' : '#E0F2FE') : isNight ? '#1D2940' : '#E6ECF4'}
        stroke={inkBlue}
        strokeWidth="1"
      />
      <text
        x="90"
        y="132.5"
        textAnchor="middle"
        fill={inkBlue}
        fontSize="8.2"
        fontWeight="800"
        fontFamily="monospace"
      >
        {dateText}
      </text>
    </svg>
  );
}
