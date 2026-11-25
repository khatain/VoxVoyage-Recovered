import type { KenyaLandmarkId } from '../../data/kenyaWorld';
import { KenyaWildlifeIllustrationSVG } from './KenyaWildlifeIllustrationSVG';

interface KenyaSafariHeaderBannerSVGProps {
  spotId?: KenyaLandmarkId;
  isNight?: boolean;
  className?: string;
}

/**
 * Purely presentational savanna horizon & acacia silhouette strip for Kenya mini-games.
 */
export function KenyaSafariHeaderBannerSVG({
  isNight = false,
  className = 'h-14 w-full',
}: KenyaSafariHeaderBannerSVGProps) {
  const skyId = isNight ? 'kenya-banner-night' : 'kenya-banner-day';
  return (
    <svg viewBox="0 0 480 60" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={skyId} x1="0" y1="0" x2="1" y2="0">
          {isNight ? (
            <>
              <stop offset="0%" stopColor="#16233E" />
              <stop offset="60%" stopColor="#262E52" />
              <stop offset="100%" stopColor="#17323A" />
            </>
          ) : (
            <>
              <stop offset="0%" stopColor="#FBE5B2" />
              <stop offset="55%" stopColor="#FDF3D7" />
              <stop offset="100%" stopColor="#DEF5E8" />
            </>
          )}
        </linearGradient>
      </defs>

      <rect width="480" height="60" rx="14" fill={`url(#${skyId})`} />
      {/* Sun or Stars */}
      {isNight ? (
        <>
          <circle cx="426" cy="18" r="8" fill="#F2C66D" />
          <circle cx="429" cy="16" r="7" fill="#17323A" />
          <circle cx="110" cy="14" r="1.4" fill="#FFF8E6" opacity="0.8" />
          <circle cx="240" cy="11" r="1.6" fill="#F2C66D" opacity="0.85" />
        </>
      ) : (
        <circle cx="420" cy="22" r="14" fill="#F2C66D" opacity="0.75" />
      )}

      {/* Rolling Mara Savanna Hills */}
      <path
        d="M0 44 Q110 26 240 42 T480 38 L480 60 L0 60 Z"
        fill={isNight ? '#284038' : '#A9B96A'}
        opacity="0.7"
      />
      {/* Acacia Trees */}
      <rect x="46" y="30" width="4" height="22" fill={isNight ? '#3D2A20' : '#6F4B32'} />
      <ellipse cx="48" cy="27" rx="22" ry="6.5" fill={isNight ? '#2B533E' : '#4E7D3B'} />
      <rect x="342" y="34" width="3.5" height="18" fill={isNight ? '#3D2A20' : '#6F4B32'} />
      <ellipse cx="344" cy="31" rx="17" ry="5.2" fill={isNight ? '#2B533E' : '#5A8D3C'} />
    </svg>
  );
}

interface KenyaTouristPortraitSVGProps {
  npcId: 'emma' | 'daniel';
  isNight?: boolean;
  className?: string;
}

/**
 * Stylized explorer portrait artwork for Emma & Daniel in Kenya Practice/Perform booths.
 */
export function KenyaTouristPortraitSVG({
  npcId,
  isNight = false,
  className = 'h-12 w-12',
}: KenyaTouristPortraitSVGProps) {
  return (
    <svg viewBox="0 0 56 56" className={className} aria-hidden="true">
      <rect
        width="56"
        height="56"
        rx="16"
        fill={isNight ? '#1D2B4B' : '#FFF3E2'}
      />
      {npcId === 'emma' ? (
        <>
          <circle cx="28" cy="24" r="11.5" fill="#F2C8AA" />
          <path d="M16 23c0-8 5.5-13 12-13s12 5 12 13c-3.5-4.5-20.5-4.5-24 0z" fill="#6F4329" />
          {/* Safari Hat Rim */}
          <ellipse cx="28" cy="14" rx="15" ry="3.5" fill="#C9A26B" stroke="#78532A" strokeWidth="1.4" />
          <path d="M19 14c1-5 4.5-7.5 9-7.5s8 2.5 9 7.5z" fill="#DFBE8B" stroke="#78532A" strokeWidth="1.2" />
          <rect x="19" y="12.2" width="18" height="2" fill="#24B8B0" />
          <circle cx="24" cy="24" r="1.5" fill="#1E2E46" />
          <circle cx="32" cy="24" r="1.5" fill="#1E2E46" />
          <path d="M24 29c2 2.2 6 2.2 8 0" stroke="#A65646" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          <path d="M14 52c1.5-9 7-14 14-14s12.5 5 14 14z" fill="#E07A5F" />
        </>
      ) : (
        <>
          <circle cx="28" cy="24" r="11.5" fill="#C68C64" />
          <path d="M16 22c1-8 6.5-12 12-12 6.5 0 11 4 12 12-4.5-3.5-19.5-3.5-24 0z" fill="#2B211A" />
          <circle cx="23.5" cy="24" r="3.4" fill="none" stroke="#2D3442" strokeWidth="1.5" />
          <circle cx="32.5" cy="24" r="3.4" fill="none" stroke="#2D3442" strokeWidth="1.5" />
          <line x1="26.9" y1="24" x2="29.1" y2="24" stroke="#2D3442" strokeWidth="1.5" />
          <circle cx="23.5" cy="24" r="1.3" fill="#1E2E46" />
          <circle cx="32.5" cy="24" r="1.3" fill="#1E2E46" />
          <path d="M24 29.5c2 2 6 2 8 0" stroke="#783B32" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          <path d="M14 52c1.5-9 7-14 14-14s12.5 5 14 14z" fill="#386853" />
          <rect x="23" y="42" width="10" height="7" rx="2" fill="#24262D" />
          <circle cx="28" cy="45.5" r="2.2" fill="#7DD3FC" />
        </>
      )}
    </svg>
  );
}

interface KenyaSpotBadgeProps {
  spotId: KenyaLandmarkId;
  className?: string;
}

export function KenyaSpotMiniature({ spotId, className = 'h-11 w-11' }: KenyaSpotBadgeProps) {
  return (
    <KenyaWildlifeIllustrationSVG
      spotId={spotId}
      className={`${className} rounded-xl border border-black/15 shadow-xs shrink-0`}
    />
  );
}
