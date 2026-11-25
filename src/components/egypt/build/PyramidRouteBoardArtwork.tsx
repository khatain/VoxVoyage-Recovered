import type { AppLanguage } from '../../../types/game';
import type {
  ArchitectBoardLandmark,
  RouteDirectionKind,
} from '../../../data/egyptBuild';

export function ArchitectLandmarkSVG({
  iconKey,
  className = 'h-7 w-7',
}: {
  iconKey: ArchitectBoardLandmark['iconKey'];
  className?: string;
}) {
  switch (iconKey) {
    case 'camp':
      return (
        <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
          <ellipse cx="24" cy="40" rx="18" ry="4" fill="#D97706" opacity="0.22" />
          <path d="M8 38 L24 12 L40 38 Z" fill="#0D9488" stroke="#0F4C5C" strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M24 12 L40 38 L31 38 L24 20 Z" fill="#14B8A6" opacity="0.72" />
          <path d="M18 38 L24 23 L30 38 Z" fill="#FEF3C7" stroke="#0F4C5C" strokeWidth="1.2" />
          <line x1="24" y1="7" x2="24" y2="13" stroke="#78350F" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M24 7 L33 10 L24 13 Z" fill="#F59E0B" />
        </svg>
      );
    case 'pyramid_north':
      return (
        <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
          <ellipse cx="24" cy="40" rx="20" ry="4" fill="#92400E" opacity="0.24" />
          <polygon points="24,7 6,38 25,38" fill="#FBBF24" stroke="#78350F" strokeWidth="1.5" strokeLinejoin="round" />
          <polygon points="24,7 25,38 42,38" fill="#D97706" stroke="#78350F" strokeWidth="1.5" strokeLinejoin="round" />
          <polygon points="24,7 19.5,14.5 28.5,14.5" fill="#FEF3C7" />
          <line x1="14" y1="26" x2="34" y2="26" stroke="#92400E" strokeWidth="0.9" opacity="0.45" />
          <line x1="10" y1="32" x2="38" y2="32" stroke="#92400E" strokeWidth="0.9" opacity="0.45" />
        </svg>
      );
    case 'viewing_platform':
      return (
        <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
          <ellipse cx="24" cy="40" rx="17" ry="3.5" fill="#4C1D95" opacity="0.18" />
          <rect x="9" y="29" width="30" height="8" rx="2" fill="#D97706" stroke="#78350F" strokeWidth="1.4" />
          <rect x="12" y="22" width="24" height="7" rx="1.5" fill="#EDE9FE" stroke="#6D28D9" strokeWidth="1.4" />
          <line x1="16" y1="22" x2="16" y2="29" stroke="#6D28D9" strokeWidth="1.4" />
          <line x1="24" y1="22" x2="24" y2="29" stroke="#6D28D9" strokeWidth="1.4" />
          <line x1="32" y1="22" x2="32" y2="29" stroke="#6D28D9" strokeWidth="1.4" />
          <line x1="24" y1="22" x2="24" y2="15" stroke="#475569" strokeWidth="2" />
          <g transform="rotate(-18 24 14)">
            <rect x="17" y="11" width="16" height="4.5" rx="2" fill="#7C3AED" stroke="#312E81" strokeWidth="1.2" />
            <circle cx="33" cy="13.2" r="2.2" fill="#FDE68A" />
          </g>
        </svg>
      );
    case 'flag':
      return (
        <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
          <ellipse cx="24" cy="40" rx="14" ry="3.5" fill="#991B1B" opacity="0.2" />
          <rect x="14" y="34" width="20" height="5" rx="2" fill="#D6D3D1" stroke="#57534E" strokeWidth="1.3" />
          <line x1="19" y1="9" x2="19" y2="35" stroke="#78350F" strokeWidth="2.4" strokeLinecap="round" />
          <circle cx="19" cy="8.5" r="2.2" fill="#FBBF24" />
          <path d="M20 10 C26 8, 31 14, 38 11 L35 18 L38 23 C30 25, 25 20, 20 22 Z" fill="#DC2626" stroke="#7F1D1D" strokeWidth="1.3" strokeLinejoin="round" />
          <circle cx="27" cy="16" r="2" fill="#FEF3C7" />
        </svg>
      );
    case 'info_point':
      return (
        <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
          <ellipse cx="24" cy="40" rx="14" ry="3.5" fill="#1E3A8A" opacity="0.18" />
          <rect x="21.5" y="27" width="5" height="11" rx="1" fill="#92400E" />
          <circle cx="24" cy="20" r="11.5" fill="#2563EB" stroke="#FFFFFF" strokeWidth="2" />
          <circle cx="24" cy="14.6" r="1.8" fill="#FFFFFF" />
          <rect x="22.3" y="18.2" width="3.4" height="8" rx="1.5" fill="#FFFFFF" />
        </svg>
      );
    case 'oasis':
      return (
        <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
          <ellipse cx="24" cy="34" rx="17" ry="6.5" fill="#0EA5E9" stroke="#0369A1" strokeWidth="1.4" />
          <ellipse cx="23" cy="33" rx="11" ry="3.2" fill="#BAE6FD" opacity="0.65" />
          <path d="M16 32 Q14 22 18 14" fill="none" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M18 14 Q10 12 7 17" fill="none" stroke="#059669" strokeWidth="2.6" strokeLinecap="round" />
          <path d="M18 14 Q14 8 10 10" fill="none" stroke="#10B981" strokeWidth="2.4" strokeLinecap="round" />
          <path d="M18 14 Q24 9 27 14" fill="none" stroke="#059669" strokeWidth="2.6" strokeLinecap="round" />
          <path d="M18 14 Q23 15 26 20" fill="none" stroke="#10B981" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M32 32 Q34 24 31 18" fill="none" stroke="#78350F" strokeWidth="2.1" strokeLinecap="round" />
          <path d="M31 18 Q26 15 24 19" fill="none" stroke="#10B981" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M31 18 Q36 14 39 18" fill="none" stroke="#059669" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      );
    case 'sphinx':
      return (
        <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
          <ellipse cx="24" cy="40" rx="18" ry="3.5" fill="#92400E" opacity="0.22" />
          <rect x="9" y="34" width="30" height="5" rx="1.5" fill="#B45309" stroke="#78350F" strokeWidth="1.2" />
          <path d="M10 34 L15 24 L27 24 L31 16 L37 16 L38 24 L39 34 Z" fill="#F59E0B" stroke="#78350F" strokeWidth="1.4" strokeLinejoin="round" />
          <path d="M29 14 C31 10, 36 10, 37 15 L39 22 L30 22 Z" fill="#FBBF24" stroke="#78350F" strokeWidth="1.3" />
          <line x1="31" y1="15" x2="36" y2="15" stroke="#1E3A8A" strokeWidth="1.6" />
          <path d="M34 34 L39 34 L41 31 L35 31 Z" fill="#FDE68A" stroke="#78350F" strokeWidth="1.1" />
        </svg>
      );
  }
}

export function SandDuneBlockedSVG({
  className = 'h-7 w-7',
}: {
  className?: string;
}) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path d="M4 37 Q15 21 27 28 Q36 22 44 37 Z" fill="#F59E0B" stroke="#92400E" strokeWidth="1.4" />
      <path d="M10 37 Q20 27 32 32 Q39 30 43 37 Z" fill="#FDE68A" opacity="0.6" />
      <line x1="12" y1="18" x2="12" y2="37" stroke="#78350F" strokeWidth="2.4" strokeLinecap="round" />
      <line x1="36" y1="18" x2="36" y2="37" stroke="#78350F" strokeWidth="2.4" strokeLinecap="round" />
      <rect x="8" y="19" width="32" height="6" rx="2" fill="#DC2626" stroke="#7F1D1D" strokeWidth="1.3" />
      <line x1="14" y1="19.5" x2="18" y2="24.5" stroke="#FEF3C7" strokeWidth="2.2" />
      <line x1="22" y1="19.5" x2="26" y2="24.5" stroke="#FEF3C7" strokeWidth="2.2" />
      <line x1="30" y1="19.5" x2="34" y2="24.5" stroke="#FEF3C7" strokeWidth="2.2" />
    </svg>
  );
}

export function PyramidExplorerTokenSVG({
  facingRotationDeg,
  hasError,
  isSuccess,
  className = 'h-9 w-9',
}: {
  facingRotationDeg: number;
  hasError?: boolean;
  isSuccess?: boolean;
  className?: string;
}) {
  const ringStroke = hasError
    ? '#FCA5A5'
    : isSuccess
      ? '#6EE7B7'
      : '#FFFFFF';
  const bodyFill = hasError
    ? '#B91C1C'
    : isSuccess
      ? '#059669'
      : '#1E40AF';
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <circle cx="24" cy="25" r="18" fill="#0F172A" opacity="0.22" />
      <g
        style={{
          transform: `rotate(${facingRotationDeg}deg)`,
          transformOrigin: '24px 24px',
          transition: 'transform 240ms cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        {/* Directional compass pointer beak indicating current facing */}
        <polygon
          points="24,2 31,13 17,13"
          fill={hasError ? '#EF4444' : isSuccess ? '#34D399' : '#FBBF24'}
          stroke="#1E293B"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        {/* Explorer token base */}
        <circle
          cx="24"
          cy="25"
          r="13.5"
          fill={bodyFill}
          stroke={ringStroke}
          strokeWidth="2.5"
        />
        {/* Explorer hat crown & brim */}
        <ellipse cx="24" cy="25" rx="8.5" ry="6.2" fill="#FDE68A" stroke="#78350F" strokeWidth="1.3" />
        <ellipse cx="24" cy="24" rx="5.2" ry="4" fill="#F59E0B" stroke="#78350F" strokeWidth="1.1" />
        <circle cx="24" cy="21" r="1.4" fill="#1E293B" />
      </g>
    </svg>
  );
}

export function DesertCompassRoseSVG({
  activeFacing,
  isNight,
  language,
  className = 'h-20 w-20',
}: {
  activeFacing: RouteDirectionKind;
  isNight: boolean;
  language: AppLanguage;
  className?: string;
}) {
  const dirs: Array<{
    dir: RouteDirectionKind;
    x: number;
    y: number;
    label: string;
  }> = [
    { dir: 'N', x: 40, y: 12, label: language === 'th' ? 'N' : 'N' },
    { dir: 'E', x: 68, y: 43, label: 'E' },
    { dir: 'S', x: 40, y: 74, label: 'S' },
    { dir: 'W', x: 12, y: 43, label: 'W' },
  ];

  const rot =
    activeFacing === 'N'
      ? 0
      : activeFacing === 'E'
        ? 90
        : activeFacing === 'S'
          ? 180
          : 270;

  return (
    <svg viewBox="0 0 80 80" className={className} aria-hidden="true">
      <circle
        cx="40"
        cy="40"
        r="24"
        fill={isNight ? '#121D36' : '#FFFBEB'}
        stroke={isNight ? '#FBBF24' : '#D97706'}
        strokeOpacity="0.55"
        strokeWidth="2"
      />
      <circle
        cx="40"
        cy="40"
        r="19"
        fill="none"
        stroke={isNight ? '#334155' : '#FDE68A'}
        strokeWidth="1"
        strokeDasharray="3 3"
      />
      <g
        style={{
          transform: `rotate(${rot}deg)`,
          transformOrigin: '40px 40px',
          transition: 'transform 240ms cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        <polygon points="40,21 45,40 35,40" fill="#0D9488" stroke="#FFFFFF" strokeWidth="1" />
        <polygon points="40,59 45,40 35,40" fill={isNight ? '#475569' : '#CBD5E1'} />
        <circle cx="40" cy="40" r="3.5" fill="#FBBF24" stroke="#78350F" strokeWidth="1.2" />
      </g>
      {dirs.map((d) => {
        const isActive = activeFacing === d.dir;
        return (
          <text
            key={d.dir}
            x={d.x}
            y={d.y}
            textAnchor="middle"
            fontSize={isActive ? '10.5' : '9.5'}
            fontWeight="800"
            fill={
              isActive
                ? '#0D9488'
                : isNight
                  ? '#CBD5E1'
                  : '#78350F'
            }
          >
            {d.label}
          </text>
        );
      })}
    </svg>
  );
}
