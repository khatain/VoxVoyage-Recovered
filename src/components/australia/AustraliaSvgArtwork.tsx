import type { AustraliaLandmarkId, AustraliaNpcId } from '../../data/australiaWorld';

interface NpcPortraitProps {
  npcId: AustraliaNpcId;
  className?: string;
}

export function AustraliaNpcPortraitSVG({ npcId, className = 'h-16 w-16' }: NpcPortraitProps) {
  if (npcId === 'npc_olivia') {
    return (
      <svg viewBox="0 0 80 80" className={className} aria-hidden="true">
        <defs>
          <linearGradient id="AusOliviaBg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#0EA5E9" />
            <stop offset="100%" stopColor="#24B8B0" />
          </linearGradient>
        </defs>
        <rect width="80" height="80" rx="20" fill="url(#AusOliviaBg)" />
        {/* Hair behind */}
        <path d="M22 30 Q20 52 24 62 L56 62 Q60 52 58 30 Z" fill="#C27D38" />
        {/* Shoulders / Explorer Jacket */}
        <path d="M16 78 C18 60 28 54 40 54 C52 54 62 60 64 78 Z" fill="#F8FAFC" />
        <path d="M30 55 L40 67 L50 55 L45 78 L35 78 Z" fill="#0EA5E9" />
        {/* Lanyard */}
        <path d="M34 56 L40 69 L46 56" fill="none" stroke="#F59E0B" strokeWidth="2.4" />
        {/* Neck & Head */}
        <rect x="35" y="45" width="10" height="11" rx="4" fill="#F6C7A3" />
        <circle cx="40" cy="34" r="15" fill="#F6C7A3" />
        {/* Hair top */}
        <path
          d="M24 31 C24 19 33 15 41 15 C50 15 56 21 56 32 C50 26 42 25 32 28 Z"
          fill="#D48B40"
        />
        {/* Sun hat / Visor accent */}
        <path d="M22 25 Q40 16 58 25 L55 21 Q40 13 25 21 Z" fill="#F2C66D" />
        {/* Eyes & Friendly Smile */}
        <circle cx="34.5" cy="34.5" r="2.1" fill="#1E293B" />
        <circle cx="45.5" cy="34.5" r="2.1" fill="#1E293B" />
        <circle cx="35.1" cy="33.8" r="0.7" fill="#FFFFFF" />
        <circle cx="46.1" cy="33.8" r="0.7" fill="#FFFFFF" />
        <path d="M35 41 Q40 45 45 41" fill="none" stroke="#8C4A32" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  if (npcId === 'npc_noah') {
    return (
      <svg viewBox="0 0 80 80" className={className} aria-hidden="true">
        <defs>
          <linearGradient id="AusNoahBg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#1D4ED8" />
            <stop offset="100%" stopColor="#0EA5E9" />
          </linearGradient>
        </defs>
        <rect width="80" height="80" rx="20" fill="url(#AusNoahBg)" />
        {/* Transit Vest & Shirt */}
        <path d="M16 78 C18 60 28 54 40 54 C52 54 62 60 64 78 Z" fill="#1E3A8A" />
        <path d="M31 55 L40 70 L49 55" fill="#F8FAFC" />
        <path d="M24 58 L28 78 M56 58 L52 78" stroke="#38BDF8" strokeWidth="2.5" />
        {/* Neck & Face */}
        <rect x="35" y="45" width="10" height="11" rx="4" fill="#E6AD84" />
        <circle cx="40" cy="34" r="14.5" fill="#E6AD84" />
        {/* Short curly hair */}
        <path
          d="M25 31 C24 20 31 15 40 15 C49 15 56 20 55 31 C50 24 44 23 39 24 C34 23 29 25 25 31 Z"
          fill="#2B211B"
        />
        {/* Transit Cap */}
        <path d="M26 23 C28 16 52 16 54 23 Z" fill="#0F172A" />
        <rect x="25" y="22" width="30" height="4" rx="2" fill="#38BDF8" />
        {/* Eyes & Smile */}
        <circle cx="34.5" cy="34.5" r="2.1" fill="#1E293B" />
        <circle cx="45.5" cy="34.5" r="2.1" fill="#1E293B" />
        <path d="M35.5 41 Q40 44.5 44.5 41" fill="none" stroke="#6E3B25" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  if (npcId === 'npc_mia') {
    return (
      <svg viewBox="0 0 80 80" className={className} aria-hidden="true">
        <defs>
          <linearGradient id="AusMiaBg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#F97316" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>
        </defs>
        <rect width="80" height="80" rx="20" fill="url(#AusMiaBg)" />
        {/* Dark hair bun & bob */}
        <circle cx="40" cy="14" r="7" fill="#1E1B18" />
        <path d="M24 31 Q22 49 26 55 L54 55 Q58 49 56 31 Z" fill="#1E1B18" />
        {/* Apron & Striped Shirt */}
        <path d="M16 78 C18 60 28 54 40 54 C52 54 62 60 64 78 Z" fill="#FFF7ED" />
        <path d="M27 56 L53 56 L55 78 L25 78 Z" fill="#115E59" />
        <rect x="33" y="64" width="14" height="9" rx="2" fill="#2DD4BF" opacity="0.45" />
        {/* Head */}
        <rect x="35" y="45" width="10" height="10" rx="4" fill="#F5CAA4" />
        <circle cx="40" cy="35" r="14.5" fill="#F5CAA4" />
        {/* Bangs */}
        <path
          d="M25 32 C26 20 33 17 40 17 C47 17 54 20 55 32 C50 26 45 25 40 27 C35 25 30 26 25 32 Z"
          fill="#1E1B18"
        />
        {/* Eyes & Cheeks */}
        <circle cx="34.5" cy="35" r="2.1" fill="#1E293B" />
        <circle cx="45.5" cy="35" r="2.1" fill="#1E293B" />
        <circle cx="31" cy="39" r="2.2" fill="#FB7185" opacity="0.45" />
        <circle cx="49" cy="39" r="2.2" fill="#FB7185" opacity="0.45" />
        <path d="M35.5 41.5 Q40 45 44.5 41.5" fill="none" stroke="#8C4234" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  // Jack Thompson
  return (
    <svg viewBox="0 0 80 80" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="AusJackBg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#06B6D4" />
        </linearGradient>
      </defs>
      <rect width="80" height="80" rx="20" fill="url(#AusJackBg)" />
      {/* Teal & Purple Visitor Guide Polo */}
      <path d="M16 78 C18 60 28 54 40 54 C52 54 62 60 64 78 Z" fill="#0F766E" />
      <path d="M31 55 L40 65 L49 55" fill="#F2C66D" />
      {/* Neck & Face */}
      <rect x="35" y="45" width="10" height="11" rx="4" fill="#F2BE98" />
      <circle cx="40" cy="34" r="14.5" fill="#F2BE98" />
      {/* Tousled light brown hair */}
      <path
        d="M24 31 C24 19 31 15 41 15 C50 15 56 21 55 31 C50 25 45 23 39 24 C34 22 28 24 24 31 Z"
        fill="#7C5332"
      />
      {/* Glasses */}
      <rect x="29.5" y="31" width="9" height="7" rx="2.5" fill="none" stroke="#1E293B" strokeWidth="1.8" />
      <rect x="41.5" y="31" width="9" height="7" rx="2.5" fill="none" stroke="#1E293B" strokeWidth="1.8" />
      <line x1="38.5" y1="34.5" x2="41.5" y2="34.5" stroke="#1E293B" strokeWidth="1.8" />
      <circle cx="34" cy="34.5" r="1.7" fill="#1E293B" />
      <circle cx="46" cy="34.5" r="1.7" fill="#1E293B" />
      <path d="M35.5 41.5 Q40 44.8 44.5 41.5" fill="none" stroke="#8A4A32" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

interface LandmarkIllustrationProps {
  landmarkId: AustraliaLandmarkId;
  className?: string;
}

export function AustraliaLandmarkBadgeSVG({
  landmarkId,
  className = 'h-16 w-20',
}: LandmarkIllustrationProps) {
  if (landmarkId === 'circular_quay_plaza') {
    return (
      <svg viewBox="0 0 120 84" className={className} aria-hidden="true">
        <rect width="120" height="84" rx="14" fill="#E0F2FE" />
        <rect y="54" width="120" height="30" fill="#0284C7" />
        {/* Sail Vaults */}
        <path d="M18 54 Q28 16 48 54 Z" fill="#FFFFFF" stroke="#BAE6FD" strokeWidth="1.5" />
        <path d="M40 54 Q56 10 78 54 Z" fill="#F8FAFC" stroke="#BAE6FD" strokeWidth="1.5" />
        <path d="M70 54 Q85 24 102 54 Z" fill="#FFFFFF" stroke="#BAE6FD" strokeWidth="1.5" />
        <circle cx="96" cy="20" r="8" fill="#FBBF24" />
      </svg>
    );
  }

  if (landmarkId === 'city_transit_station') {
    return (
      <svg viewBox="0 0 120 84" className={className} aria-hidden="true">
        <rect width="120" height="84" rx="14" fill="#DBEAFE" />
        <rect x="14" y="22" width="92" height="46" rx="8" fill="#1E3A8A" />
        <rect x="22" y="30" width="76" height="16" rx="4" fill="#0F172A" />
        <rect x="27" y="35" width="32" height="5" rx="2" fill="#38BDF8" />
        <rect x="66" y="35" width="24" height="5" rx="2" fill="#FBBF24" />
        <circle cx="34" cy="60" r="5" fill="#F8FAFC" />
        <circle cx="86" cy="60" r="5" fill="#F8FAFC" />
      </svg>
    );
  }

  if (landmarkId === 'harbour_market_cafe') {
    return (
      <svg viewBox="0 0 120 84" className={className} aria-hidden="true">
        <rect width="120" height="84" rx="14" fill="#FFEDD5" />
        <rect x="18" y="34" width="84" height="38" rx="6" fill="#9A3412" />
        {/* Striped Awning */}
        <path d="M12 34 L22 18 L98 18 L108 34 Z" fill="#EA580C" />
        <rect x="28" y="18" width="14" height="16" fill="#FFF7ED" />
        <rect x="53" y="18" width="14" height="16" fill="#FFF7ED" />
        <rect x="78" y="18" width="14" height="16" fill="#FFF7ED" />
        {/* Coffee cup sign */}
        <rect x="46" y="44" width="28" height="18" rx="4" fill="#FFF7ED" />
        <circle cx="60" cy="53" r="5" fill="#78350F" />
      </svg>
    );
  }

  if (landmarkId === 'darling_harbour_hub') {
    return (
      <svg viewBox="0 0 120 84" className={className} aria-hidden="true">
        <rect width="120" height="84" rx="14" fill="#F3E8FF" />
        <rect y="60" width="120" height="24" fill="#06B6D4" />
        <path d="M18 60 L30 22 L90 22 L102 60 Z" fill="#6D28D9" />
        <rect x="42" y="34" width="36" height="26" rx="4" fill="#FAF5FF" />
        <circle cx="60" cy="28" r="7" fill="#F2C66D" />
        <path d="M58 26 L62 26 L62 32 L58 32 Z" fill="#1E293B" />
      </svg>
    );
  }

  // Harbour Gardens Help Point
  return (
    <svg viewBox="0 0 120 84" className={className} aria-hidden="true">
      <rect width="120" height="84" rx="14" fill="#DCFCE7" />
      <rect y="56" width="120" height="28" fill="#10B981" />
      <rect x="52" y="24" width="16" height="40" rx="5" fill="#0F766E" />
      <circle cx="60" cy="34" r="5.5" fill="#F2C66D" />
      <circle cx="28" cy="40" r="14" fill="#16A34A" />
      <rect x="26" y="46" width="4" height="14" fill="#78350F" />
      <circle cx="92" cy="42" r="12" fill="#22C55E" />
      <rect x="90" y="46" width="4" height="14" fill="#78350F" />
    </svg>
  );
}

export function SydneyHarbourSkylineRibbonSVG({ className = 'w-full h-14' }: { className?: string }) {
  return (
    <svg viewBox="0 0 420 56" className={className} aria-hidden="true" preserveAspectRatio="none">
      {/* Harbour bridge arch motif + Opera sails */}
      <path
        d="M14 48 Q74 10 134 48"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        opacity="0.35"
      />
      <line x1="10" y1="36" x2="138" y2="36" stroke="currentColor" strokeWidth="1.6" opacity="0.3" />
      <path d="M180 48 Q196 16 218 48 Z" fill="currentColor" opacity="0.22" />
      <path d="M210 48 Q232 10 256 48 Z" fill="currentColor" opacity="0.3" />
      <path d="M248 48 Q266 22 282 48 Z" fill="currentColor" opacity="0.2" />
      <path
        d="M0 50 Q105 44 210 50 T420 50"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.45"
      />
    </svg>
  );
}
