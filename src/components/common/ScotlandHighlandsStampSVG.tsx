import type { AppLanguage, ResolvedAppearance } from '../../types/game';

interface ScotlandHighlandsStampSVGProps {
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
 * Custom Scottish Highlands Passport Stamp with thistle emblem, lochside keep, and mountain arcs.
 */
export function ScotlandHighlandsStampSVG({
  language,
  appearance,
  earned,
  completedAt,
  sizeClass = 'h-32 w-32',
}: ScotlandHighlandsStampSVGProps) {
  const isNight = appearance === 'night';
  const dateText = earned
    ? formatStampDate(completedAt)
    : language === 'th'
      ? 'รอปลดล็อก'
      : 'PENDING';
  const inkPrimary = earned
    ? isNight
      ? '#2ED6A3'
      : '#1E5B4C'
    : isNight
      ? '#5C708F'
      : '#8FA0B8';
  const inkPlum = earned
    ? isNight
      ? '#C09CEB'
      : '#6A448E'
    : isNight
      ? '#5C708F'
      : '#8FA0B8';
  const inkGold = earned
    ? isNight
      ? '#F2C66D'
      : '#B67716'
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
          ? `ตราประทับพาสปอร์ตสกอตแลนด์ ไฮแลนด์ ${earned ? dateText : 'ยังไม่ได้รับ'}`
          : `Scotland Highlands Passport Stamp ${earned ? dateText : 'Locked'}`
      }
    >
      <circle
        cx="90"
        cy="90"
        r="83"
        fill={earned ? (isNight ? '#152536' : '#EFF9F6') : isNight ? '#162238' : '#F2F5FA'}
        stroke={inkPrimary}
        strokeWidth="3.5"
      />
      <circle
        cx="90"
        cy="90"
        r="75"
        fill="none"
        stroke={inkPlum}
        strokeWidth="1.8"
        strokeDasharray="4 3"
      />
      <circle cx="90" cy="90" r="56" fill="none" stroke={inkGold} strokeWidth="1.4" />

      <defs>
        <path id="scotlandStampTopArc" d="M 30 90 A 60 60 0 0 1 150 90" />
        <path id="scotlandStampBottomArc" d="M 33 96 A 58 58 0 0 0 147 96" />
      </defs>

      <text
        fill={inkPrimary}
        fontSize="12.6"
        fontWeight="800"
        letterSpacing="2.8"
        textAnchor="middle"
      >
        <textPath href="#scotlandStampTopArc" startOffset="50%">
          SCOTLAND · SCO
        </textPath>
      </text>

      <text
        fill={inkPlum}
        fontSize="8.6"
        fontWeight="800"
        letterSpacing="1.6"
        textAnchor="middle"
      >
        <textPath href="#scotlandStampBottomArc" startOffset="50%">
          HIGHLAND HEROES
        </textPath>
      </text>

      {/* Saltire Corner Accents */}
      <circle cx="24" cy="90" r="2.2" fill={inkGold} />
      <circle cx="156" cy="90" r="2.2" fill={inkGold} />

      {/* Highland Peaks Backdrop */}
      <path
        d="M52 104 L74 72 L91 92 L108 69 L128 104 Z"
        fill={inkPrimary}
        opacity={earned ? 0.2 : 0.12}
      />

      {/* Lochside Castle Keep Silhouette */}
      <path
        d="M100 104 V76 H105 V80 H109 V74 H116 V80 H120 V76 H125 V104 Z"
        fill={inkPrimary}
        opacity={earned ? 0.85 : 0.4}
      />

      {/* Scottish Thistle Emblem */}
      <path
        d="M78 104 L78 86 M78 96 L70 90 M78 93 L86 88"
        stroke={inkPrimary}
        strokeWidth="2.4"
        strokeLinecap="round"
        fill="none"
        opacity={earned ? 0.95 : 0.45}
      />
      <ellipse
        cx="78"
        cy="82"
        rx="7.5"
        ry="6.5"
        fill={inkPrimary}
        opacity={earned ? 0.92 : 0.45}
      />
      <path
        d="M71 78 Q74 66 78 69 Q82 65 85 78 Z"
        fill={inkPlum}
        opacity={earned ? 0.94 : 0.45}
      />
      <path
        d="M74 71 L72 64 M78 70 L78 62 M82 71 L84 64"
        stroke={inkPlum}
        strokeWidth="1.8"
        strokeLinecap="round"
        opacity={earned ? 0.94 : 0.45}
      />

      {/* Loch Ripple */}
      <path
        d="M54 111 Q90 106 126 111"
        fill="none"
        stroke={inkGold}
        strokeWidth="2.1"
        strokeLinecap="round"
      />
      <path
        d="M66 116 Q90 113 114 116"
        fill="none"
        stroke={inkPrimary}
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      {/* Completion Date Badge */}
      <rect
        x="52"
        y="122"
        width="76"
        height="15"
        rx="7.5"
        fill={earned ? (isNight ? '#12292E' : '#E2F6F0') : isNight ? '#1D2940' : '#E6ECF4'}
        stroke={inkPrimary}
        strokeWidth="1"
      />
      <text
        x="90"
        y="132.5"
        textAnchor="middle"
        fill={inkPrimary}
        fontSize="8.2"
        fontWeight="800"
        fontFamily="monospace"
      >
        {dateText}
      </text>
    </svg>
  );
}
