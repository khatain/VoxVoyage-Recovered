import type { AppLanguage, ResolvedAppearance } from '../../types/game';

interface KenyaWildSpeakStampSVGProps {
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

export function KenyaWildSpeakStampSVG({
  language,
  appearance,
  earned,
  completedAt,
  sizeClass = 'h-32 w-32',
}: KenyaWildSpeakStampSVGProps) {
  const isNight = appearance === 'night';
  const dateText = earned ? formatStampDate(completedAt) : language === 'th' ? 'รอปลดล็อก' : 'PENDING';
  const inkPrimary = earned ? (isNight ? '#F2C66D' : '#B8621B') : isNight ? '#5C708F' : '#8FA0B8';
  const inkAccent = earned ? (isNight ? '#2ED6A3' : '#2C7A4B') : isNight ? '#5C708F' : '#8FA0B8';
  const inkTeal = earned ? (isNight ? '#5CE1D8' : '#0E7A74') : isNight ? '#5C708F' : '#8FA0B8';

  return (
    <svg
      viewBox="0 0 180 180"
      className={sizeClass}
      role="img"
      aria-label={
        language === 'th'
          ? `ตราประทับพาสปอร์ตเคนยา มาไซมารา ${earned ? dateText : 'ยังไม่ได้รับ'}`
          : `Kenya Maasai Mara Passport Stamp ${earned ? dateText : 'Locked'}`
      }
    >
      <circle
        cx="90"
        cy="90"
        r="83"
        fill={earned ? (isNight ? '#1E241C' : '#FFF9EB') : isNight ? '#162238' : '#F2F5FA'}
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

      <defs>
        <path id="kenyaStampTopArc" d="M 30 90 A 60 60 0 0 1 150 90" />
        <path id="kenyaStampBottomArc" d="M 33 96 A 58 58 0 0 0 147 96" />
      </defs>

      <text
        fill={inkPrimary}
        fontSize="13.2"
        fontWeight="800"
        letterSpacing="3.4"
        textAnchor="middle"
      >
        <textPath href="#kenyaStampTopArc" startOffset="50%">
          KENYA · KEN
        </textPath>
      </text>

      <text
        fill={inkAccent}
        fontSize="8.8"
        fontWeight="800"
        letterSpacing="1.6"
        textAnchor="middle"
      >
        <textPath href="#kenyaStampBottomArc" startOffset="50%">
          MAASAI MARA
        </textPath>
      </text>

      <circle cx="24" cy="90" r="2.2" fill={inkAccent} />
      <circle cx="156" cy="90" r="2.2" fill={inkAccent} />

      {/* Warm Savanna Sun Behind Acacia */}
      <circle cx="90" cy="70" r="17" fill={inkPrimary} opacity={earned ? 0.28 : 0.14} />

      {/* Iconic Flat-Top Acacia Tree Silhouette */}
      <path
        d="M87 104 L88 76 L92 76 L93 104 Z"
        fill={inkPrimary}
        opacity={earned ? 0.94 : 0.45}
      />
      <path
        d="M89 82 L75 73 L78 71 L90 79 Z"
        fill={inkPrimary}
        opacity={earned ? 0.94 : 0.45}
      />
      <path
        d="M91 81 L104 72 L106 74 L92 84 Z"
        fill={inkPrimary}
        opacity={earned ? 0.94 : 0.45}
      />
      <ellipse
        cx="90"
        cy="69"
        rx="29"
        ry="7.5"
        fill={inkAccent}
        opacity={earned ? 0.92 : 0.45}
      />
      <ellipse
        cx="74"
        cy="72"
        rx="13"
        ry="4.8"
        fill={inkAccent}
        opacity={earned ? 0.88 : 0.4}
      />
      <ellipse
        cx="106"
        cy="72"
        rx="13"
        ry="4.8"
        fill={inkAccent}
        opacity={earned ? 0.88 : 0.4}
      />

      {/* Savanna Horizon + Giraffe Silhouette */}
      <path
        d="M52 106 Q90 100 128 106"
        fill="none"
        stroke={inkPrimary}
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path
        d="M112 103 L112 91 L116 79 L119 79 L117 91 L118 103"
        fill={inkPrimary}
        opacity={earned ? 0.92 : 0.4}
      />

      {/* Watering Hole Ripple */}
      <path
        d="M58 113 Q84 109 112 113"
        fill="none"
        stroke={inkTeal}
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Completion Date Badge */}
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
