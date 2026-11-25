import type { EgyptLandmarkId, EgyptNpcId } from '../../data/egyptWorld';

interface NpcPortraitProps {
  npcId: EgyptNpcId;
  className?: string;
}

export function EgyptNpcPortraitSVG({
  npcId,
  className = 'h-16 w-16',
}: NpcPortraitProps) {
  if (npcId === 'npc_layla') {
    return (
      <svg viewBox="0 0 80 80" className={className} aria-hidden="true">
        <defs>
          <linearGradient id="EgyptLaylaBg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#E7B43C" />
            <stop offset="100%" stopColor="#12B8B0" />
          </linearGradient>
        </defs>
        <rect width="80" height="80" rx="20" fill="url(#EgyptLaylaBg)" />
        {/* Dark hair back */}
        <path d="M22 29 Q19 52 24 62 L56 62 Q61 52 58 29 Z" fill="#231917" />
        {/* Field Archaeology Vest & Scarf */}
        <path d="M16 78 C18 60 28 54 40 54 C52 54 62 60 64 78 Z" fill="#D4AC72" />
        <path d="M30 55 L40 67 L50 55 L46 78 L34 78 Z" fill="#FFFDF7" />
        <path d="M32 55 Q40 64 48 55" fill="none" stroke="#12B8B0" strokeWidth="3.2" strokeLinecap="round" />
        {/* Neck & Face */}
        <rect x="35" y="45" width="10" height="11" rx="4" fill="#D89E76" />
        <circle cx="40" cy="34" r="14.5" fill="#D89E76" />
        {/* Hair Bangs */}
        <path
          d="M25 31 C25 19 33 16 40 16 C48 16 55 20 55 31 C50 25 43 24 34 26 Z"
          fill="#231917"
        />
        {/* Sun Hat Brim */}
        <ellipse cx="40" cy="21" rx="21" ry="4.5" fill="#EAD7B1" />
        <path d="M28 21 C30 13 50 13 52 21 Z" fill="#D4B785" />
        <rect x="29" y="18.5" width="22" height="2.4" rx="1" fill="#12B8B0" />
        {/* Glasses & Warm Smile */}
        <rect x="29.5" y="31.5" width="8.5" height="6.5" rx="2" fill="none" stroke="#254EAC" strokeWidth="1.6" />
        <rect x="42" y="31.5" width="8.5" height="6.5" rx="2" fill="none" stroke="#254EAC" strokeWidth="1.6" />
        <line x1="38" y1="34.5" x2="42" y2="34.5" stroke="#254EAC" strokeWidth="1.6" />
        <circle cx="33.8" cy="34.8" r="1.7" fill="#1E293B" />
        <circle cx="46.2" cy="34.8" r="1.7" fill="#1E293B" />
        <path d="M35.5 41.5 Q40 44.8 44.5 41.5" fill="none" stroke="#7A3F2B" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  if (npcId === 'npc_omar') {
    return (
      <svg viewBox="0 0 80 80" className={className} aria-hidden="true">
        <defs>
          <linearGradient id="EgyptOmarBg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ED7852" />
            <stop offset="100%" stopColor="#E7B43C" />
          </linearGradient>
        </defs>
        <rect width="80" height="80" rx="20" fill="url(#EgyptOmarBg)" />
        {/* Safety Vest & Khaki Shirt */}
        <path d="M16 78 C18 60 28 54 40 54 C52 54 62 60 64 78 Z" fill="#F2EDE1" />
        <path d="M22 57 L34 55 L34 78 L20 78 Z" fill="#EA580C" />
        <path d="M46 55 L58 57 L60 78 L46 78 Z" fill="#EA580C" />
        <rect x="21" y="66" width="13" height="3" fill="#FDE68A" />
        <rect x="46" y="66" width="13" height="3" fill="#FDE68A" />
        {/* Neck & Face */}
        <rect x="35" y="45" width="10" height="11" rx="4" fill="#CE936A" />
        <circle cx="40" cy="34" r="14.5" fill="#CE936A" />
        {/* Dark Hair & Field Cap */}
        <path
          d="M25 31 C25 20 31 15 40 15 C49 15 55 20 55 31 C49 25 43 24 34 25 Z"
          fill="#1F1918"
        />
        <path d="M25 23 C28 15 52 15 55 23 Z" fill="#254EAC" />
        <rect x="24" y="21.5" width="32" height="3.8" rx="1.8" fill="#E7B43C" />
        {/* Eyes & Smile */}
        <circle cx="34.5" cy="34.5" r="2.1" fill="#1E293B" />
        <circle cx="45.5" cy="34.5" r="2.1" fill="#1E293B" />
        <path d="M35.5 41.2 Q40 44.5 44.5 41.2" fill="none" stroke="#683422" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  if (npcId === 'npc_mariam') {
    return (
      <svg viewBox="0 0 80 80" className={className} aria-hidden="true">
        <defs>
          <linearGradient id="EgyptMariamBg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#12B8B0" />
            <stop offset="100%" stopColor="#254EAC" />
          </linearGradient>
        </defs>
        <rect width="80" height="80" rx="20" fill="url(#EgyptMariamBg)" />
        {/* Teal Hijab / Headscarf */}
        <path
          d="M21 35 C21 19 30 14 40 14 C50 14 59 19 59 35 L62 62 C55 68 25 68 18 62 Z"
          fill="#0F766E"
        />
        <path d="M16 78 C18 60 28 55 40 55 C52 55 62 60 64 78 Z" fill="#F8F1E3" />
        <path d="M27 57 Q40 69 53 57" fill="none" stroke="#E7B43C" strokeWidth="2.8" />
        {/* Face */}
        <circle cx="40" cy="35" r="13.8" fill="#DFAA82" />
        <path
          d="M26 35 C26 22 33 19 40 19 C47 19 54 22 54 35 C52 27 46 24 40 24 C34 24 28 27 26 35 Z"
          fill="#14B8A6"
        />
        {/* Eyes, Cheeks & Smile */}
        <circle cx="34.8" cy="35.2" r="2" fill="#1E293B" />
        <circle cx="45.2" cy="35.2" r="2" fill="#1E293B" />
        <circle cx="34.3" cy="34.5" r="0.7" fill="#FFFFFF" />
        <circle cx="44.7" cy="34.5" r="0.7" fill="#FFFFFF" />
        <circle cx="31.2" cy="39.2" r="2.2" fill="#F43F5E" opacity="0.38" />
        <circle cx="48.8" cy="39.2" r="2.2" fill="#F43F5E" opacity="0.38" />
        <path d="M36 41.5 Q40 44.8 44 41.5" fill="none" stroke="#7A3D2B" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  // Karim Mansour
  return (
    <svg viewBox="0 0 80 80" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="EgyptKarimBg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#254EAC" />
          <stop offset="100%" stopColor="#12B8B0" />
        </linearGradient>
      </defs>
      <rect width="80" height="80" rx="20" fill="url(#EgyptKarimBg)" />
      {/* Indigo Jacket & Gold Trim */}
      <path d="M16 78 C18 60 28 54 40 54 C52 54 62 60 64 78 Z" fill="#1E3A8A" />
      <path d="M31 55 L40 67 L49 55" fill="#F5E7C8" />
      <rect x="37" y="61" width="6" height="12" rx="2" fill="#E7B43C" />
      {/* Neck & Face */}
      <rect x="35" y="45" width="10" height="11" rx="4" fill="#C78A62" />
      <circle cx="40" cy="34" r="14.5" fill="#C78A62" />
      {/* Curly dark hair */}
      <path
        d="M24 31 C23 19 31 15 40 15 C49 15 57 19 56 31 C50 24 45 23 40 24 C34 23 29 25 24 31 Z"
        fill="#1E1715"
      />
      {/* Eyes & Smile */}
      <circle cx="34.5" cy="34.5" r="2.1" fill="#1E293B" />
      <circle cx="45.5" cy="34.5" r="2.1" fill="#1E293B" />
      <path d="M35.5 41.2 Q40 44.5 44.5 41.2" fill="none" stroke="#622E1E" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

interface LandmarkBadgeProps {
  landmarkId: EgyptLandmarkId;
  className?: string;
}

export function EgyptLandmarkBadgeSVG({
  landmarkId,
  className = 'h-16 w-20',
}: LandmarkBadgeProps) {
  if (landmarkId === 'nile_expedition_camp') {
    return (
      <svg viewBox="0 0 120 84" className={className} aria-hidden="true">
        <rect width="120" height="84" rx="14" fill="#FEF3C7" />
        <rect y="55" width="120" height="29" fill="#0E95B0" />
        {/* Expedition Tent */}
        <path d="M16 55 L34 25 L52 55 Z" fill="#FFFDF7" stroke="#D97706" strokeWidth="1.8" />
        <path d="M29 55 L34 39 L39 55 Z" fill="#9A3412" />
        {/* Felucca Sail Boat */}
        <path d="M68 62 Q86 68 104 62 L98 56 L74 56 Z" fill="#78350F" />
        <path d="M84 56 L84 22 L102 52 Z" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.2" />
        <circle cx="96" cy="18" r="7" fill="#F59E0B" />
      </svg>
    );
  }

  if (landmarkId === 'giza_pyramid_plaza') {
    return (
      <svg viewBox="0 0 120 84" className={className} aria-hidden="true">
        <rect width="120" height="84" rx="14" fill="#FDE68A" />
        <rect y="58" width="120" height="26" fill="#D9A86C" />
        {/* Distant Great Pyramids */}
        <path d="M8 58 L38 18 L68 58 Z" fill="#C99758" />
        <path d="M38 18 L48 31 L28 31 Z" fill="#F2C66D" />
        <path d="M48 58 L76 22 L104 58 Z" fill="#BA8446" />
        <path d="M76 22 L84 32 L68 32 Z" fill="#F2C66D" />
        {/* Obelisk */}
        <rect x="97" y="34" width="8" height="26" fill="#EAD7B1" />
        <path d="M97 34 L101 26 L105 34 Z" fill="#E7B43C" />
      </svg>
    );
  }

  if (landmarkId === 'ancient_scribe_workshop') {
    return (
      <svg viewBox="0 0 120 84" className={className} aria-hidden="true">
        <rect width="120" height="84" rx="14" fill="#CCFBF1" />
        <rect x="16" y="24" width="88" height="44" rx="6" fill="#E2B980" />
        <rect x="14" y="20" width="92" height="8" rx="3" fill="#12B8B0" />
        {/* Papyrus Scroll */}
        <rect x="34" y="38" width="52" height="22" rx="4" fill="#FFFBEB" stroke="#92400E" strokeWidth="1.5" />
        <line x1="42" y1="45" x2="78" y2="45" stroke="#254EAC" strokeWidth="2.2" />
        <line x1="42" y1="52" x2="70" y2="52" stroke="#0F766E" strokeWidth="2.2" />
        <circle cx="28" cy="50" r="6" fill="#254EAC" />
      </svg>
    );
  }

  if (landmarkId === 'temple_of_the_sun') {
    return (
      <svg viewBox="0 0 120 84" className={className} aria-hidden="true">
        <rect width="120" height="84" rx="14" fill="#DBEAFE" />
        <rect y="60" width="120" height="24" fill="#D5A66E" />
        {/* Sun Pylon */}
        <path d="M18 60 L25 22 L48 22 L52 60 Z" fill="#D4A36A" />
        <path d="M68 60 L72 22 L95 22 L102 60 Z" fill="#D4A36A" />
        <rect x="44" y="20" width="32" height="14" fill="#B8874E" />
        <circle cx="60" cy="27" r="7" fill="#E7B43C" />
        <rect x="48" y="34" width="24" height="26" fill="#1E3A8A" />
      </svg>
    );
  }

  // Sealed Chamber of Wisdom
  return (
    <svg viewBox="0 0 120 84" className={className} aria-hidden="true">
      <rect width="120" height="84" rx="14" fill="#1E293B" />
      <rect x="14" y="16" width="92" height="54" rx="6" fill="#C49A64" />
      <rect x="26" y="22" width="68" height="6" rx="2" fill="#254EAC" />
      {/* Sealed Stone Door */}
      <rect x="44" y="30" width="32" height="40" rx="2" fill="#7C5E3B" stroke="#E7B43C" strokeWidth="2" />
      <circle cx="60" cy="49" r="8" fill="#12B8B0" stroke="#FDE68A" strokeWidth="2" />
      <circle cx="60" cy="49" r="3" fill="#FDE68A" />
    </svg>
  );
}

export function EgyptSkylineRibbonSVG({
  className = 'w-full h-14',
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 420 56"
      className={className}
      aria-hidden="true"
      preserveAspectRatio="none"
    >
      {/* Pyramids + Sun + Obelisk + Nile wave */}
      <path d="M36 48 L82 14 L128 48 Z" fill="currentColor" opacity="0.22" />
      <path d="M108 48 L146 20 L184 48 Z" fill="currentColor" opacity="0.28" />
      <path d="M172 48 L198 28 L224 48 Z" fill="currentColor" opacity="0.18" />
      <rect x="262" y="20" width="8" height="28" fill="currentColor" opacity="0.24" />
      <path d="M262 20 L266 12 L270 20 Z" fill="currentColor" opacity="0.32" />
      <circle cx="348" cy="20" r="10" fill="currentColor" opacity="0.22" />
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
