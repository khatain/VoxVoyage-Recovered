import type {
  EgyptDiscoverGameId,
  ExpeditionItemId,
  FictionalGlyphId,
  TempleGuardianVariant,
} from '../../data/egyptDiscover';

export function ExpeditionItemIconSVG({
  itemId,
  className = 'h-12 w-12',
}: {
  itemId: ExpeditionItemId;
  className?: string;
}) {
  switch (itemId) {
    case 'backpack':
      return (
        <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
          <rect width="64" height="64" rx="14" fill="#FEF3C7" />
          <path d="M24 18 C24 11 40 11 40 18" fill="none" stroke="#92400E" strokeWidth="3.5" strokeLinecap="round" />
          <rect x="16" y="18" width="32" height="34" rx="9" fill="#D97706" stroke="#78350F" strokeWidth="2" />
          <path d="M16 30 Q32 35 48 30" fill="none" stroke="#FEF3C7" strokeWidth="2.5" />
          <rect x="21" y="34" width="22" height="13" rx="4" fill="#B45309" stroke="#78350F" strokeWidth="1.5" />
          <rect x="28" y="25" width="8" height="4" rx="1.5" fill="#FDE68A" />
        </svg>
      );
    case 'map':
      return (
        <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
          <rect width="64" height="64" rx="14" fill="#E0F2FE" />
          <polygon points="10,17 24,13 24,49 10,53" fill="#FFFBEB" stroke="#0284C7" strokeWidth="1.8" />
          <polygon points="24,13 40,18 40,54 24,49" fill="#FEF3C7" stroke="#0284C7" strokeWidth="1.8" />
          <polygon points="40,18 54,14 54,50 40,54" fill="#FFFBEB" stroke="#0284C7" strokeWidth="1.8" />
          <path d="M16 39 Q28 24 38 35 T48 25" fill="none" stroke="#EA580C" strokeWidth="2.4" strokeDasharray="3 3" />
          <circle cx="47" cy="24" r="3.5" fill="#DC2626" />
        </svg>
      );
    case 'compass':
      return (
        <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
          <rect width="64" height="64" rx="14" fill="#CCFBF1" />
          <circle cx="32" cy="14" r="4" fill="none" stroke="#0F766E" strokeWidth="2.5" />
          <circle cx="32" cy="35" r="18" fill="#E7B43C" stroke="#78350F" strokeWidth="2" />
          <circle cx="32" cy="35" r="13.5" fill="#FFFDF7" />
          <polygon points="32,22 36,35 32,33 28,35" fill="#DC2626" />
          <polygon points="32,48 36,35 32,37 28,35" fill="#1E3A8A" />
          <circle cx="32" cy="35" r="2.5" fill="#78350F" />
        </svg>
      );
    case 'notebook':
      return (
        <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
          <rect width="64" height="64" rx="14" fill="#DBEAFE" />
          <rect x="17" y="12" width="32" height="40" rx="5" fill="#1D4ED8" stroke="#1E3A8A" strokeWidth="2" />
          <rect x="14" y="18" width="6" height="4" rx="1.5" fill="#FDE68A" />
          <rect x="14" y="29" width="6" height="4" rx="1.5" fill="#FDE68A" />
          <rect x="14" y="40" width="6" height="4" rx="1.5" fill="#FDE68A" />
          <rect x="24" y="20" width="19" height="10" rx="2" fill="#FFFDF7" />
          <line x1="27" y1="25" x2="40" y2="25" stroke="#0284C7" strokeWidth="2" />
          <line x1="24" y1="38" x2="42" y2="38" stroke="#93C5FD" strokeWidth="2" />
          <line x1="24" y1="43" x2="38" y2="43" stroke="#93C5FD" strokeWidth="2" />
        </svg>
      );
    case 'water_bottle':
      return (
        <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
          <rect width="64" height="64" rx="14" fill="#E0F2FE" />
          <rect x="26" y="10" width="12" height="6" rx="2" fill="#0369A1" />
          <rect x="21" y="18" width="22" height="35" rx="7" fill="#38BDF8" stroke="#0284C7" strokeWidth="2" />
          <rect x="21" y="29" width="22" height="11" fill="#FFFDF7" opacity="0.88" />
          <path d="M27 34 Q32 30 37 34 Q32 38 27 34 Z" fill="#0284C7" />
        </svg>
      );
    case 'camera':
      return (
        <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
          <rect width="64" height="64" rx="14" fill="#F1F5F9" />
          <path d="M24 18 L28 13 L36 13 L40 18 Z" fill="#475569" />
          <rect x="12" y="18" width="40" height="30" rx="7" fill="#334155" stroke="#1E293B" strokeWidth="2" />
          <circle cx="32" cy="33" r="10" fill="#94A3B8" stroke="#FFFDF7" strokeWidth="2" />
          <circle cx="32" cy="33" r="6" fill="#0EA5E9" />
          <circle cx="44" cy="24" r="2.5" fill="#FBBF24" />
        </svg>
      );
    case 'sun_hat':
      return (
        <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
          <rect width="64" height="64" rx="14" fill="#FEF3C7" />
          <ellipse cx="32" cy="39" rx="24" ry="8" fill="#EAB308" stroke="#A16207" strokeWidth="2" />
          <path d="M19 36 C21 20 43 20 45 36 Z" fill="#FDE047" stroke="#A16207" strokeWidth="2" />
          <rect x="20" y="31" width="24" height="4" rx="1.5" fill="#0D9488" />
        </svg>
      );
    case 'magnifying_glass':
      return (
        <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
          <rect width="64" height="64" rx="14" fill="#EDE9FE" />
          <line x1="37" y1="37" x2="50" y2="50" stroke="#78350F" strokeWidth="6" strokeLinecap="round" />
          <circle cx="28" cy="27" r="14" fill="#DDD6FE" stroke="#6D28D9" strokeWidth="3.5" />
          <path d="M22 21 Q25 18 30 19" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );
    case 'pencil':
      return (
        <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
          <rect width="64" height="64" rx="14" fill="#FFEDD5" />
          <g transform="rotate(-38 32 32)">
            <rect x="13" y="26" width="30" height="11" rx="2" fill="#F97316" stroke="#9A3412" strokeWidth="1.6" />
            <rect x="10" y="26" width="5" height="11" rx="2" fill="#F43F5E" />
            <polygon points="43,26 54,31.5 43,37" fill="#FDE68A" stroke="#9A3412" strokeWidth="1.5" />
            <polygon points="50,29.5 54,31.5 50,33.5" fill="#1E293B" />
          </g>
        </svg>
      );
    case 'flashlight':
      return (
        <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
          <rect width="64" height="64" rx="14" fill="#FEF9C3" />
          <g transform="rotate(-30 32 32)">
            <rect x="14" y="27" width="22" height="10" rx="3" fill="#475569" stroke="#1E293B" strokeWidth="1.8" />
            <polygon points="36,24 44,21 44,43 36,40" fill="#CA8A04" stroke="#78350F" strokeWidth="1.8" />
            <polygon points="44,21 56,16 56,48 44,43" fill="#FDE047" opacity="0.65" />
          </g>
        </svg>
      );
  }
}

export function EgyptStationEmblemSVG({
  gameId,
  className = 'h-12 w-12',
}: {
  gameId: EgyptDiscoverGameId;
  className?: string;
}) {
  switch (gameId) {
    case 'expedition_essentials':
      return <ExpeditionItemIconSVG itemId="backpack" className={className} />;
    case 'pyramid_path_puzzle':
      return <ExpeditionItemIconSVG itemId="compass" className={className} />;
    case 'papyrus_sequence':
      return (
        <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
          <rect width="64" height="64" rx="14" fill="#CCFBF1" />
          <rect x="14" y="16" width="36" height="32" rx="5" fill="#FFFBEB" stroke="#B45309" strokeWidth="2" />
          <line x1="21" y1="24" x2="43" y2="24" stroke="#0F766E" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="21" y1="32" x2="39" y2="32" stroke="#D97706" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="21" y1="40" x2="35" y2="40" stroke="#254EAC" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );
    case 'temple_guardian_rules':
      return (
        <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
          <rect width="64" height="64" rx="14" fill="#DBEAFE" />
          <path d="M32 11 L49 19 V33 C49 44 41 51 32 54 C23 51 15 44 15 33 V19 Z" fill="#1E3A8A" stroke="#E7B43C" strokeWidth="2.5" />
          <circle cx="32" cy="30" r="8" fill="#E7B43C" />
          <path d="M27 30 L31 34 L38 26" fill="none" stroke="#1E3A8A" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'pharaoh_instruction_code':
      return (
        <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
          <rect width="64" height="64" rx="14" fill="#1E293B" />
          <rect x="14" y="12" width="36" height="40" rx="6" fill="#C49A64" stroke="#E7B43C" strokeWidth="2" />
          <circle cx="25" cy="24" r="5" fill="#E7B43C" />
          <polygon points="39,19 45,29 33,29" fill="#12B8B0" />
          <path d="M20 39 Q26 35 32 39 T44 39" fill="none" stroke="#1E3A8A" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );
  }
}

export function TempleRuleSceneSVG({
  sceneKey,
  className = 'w-full h-28',
}: {
  sceneKey: TempleGuardianVariant['sceneKey'];
  className?: string;
}) {
  if (sceneKey === 'flash_camera') {
    return (
      <svg viewBox="0 0 320 110" className={className} aria-hidden="true">
        <rect width="320" height="110" rx="14" fill="#1E293B" />
        <rect x="20" y="18" width="54" height="74" rx="4" fill="#D4A36A" />
        <path d="M34 38 L47 26 L60 38 Z" fill="#E7B43C" />
        <rect x="34" y="48" width="26" height="28" rx="3" fill="#12B8B0" opacity="0.65" />
        {/* Camera + Strike */}
        <rect x="132" y="34" width="60" height="42" rx="8" fill="#475569" stroke="#F8FAFC" strokeWidth="2" />
        <circle cx="162" cy="55" r="12" fill="#0EA5E9" stroke="#F8FAFC" strokeWidth="2" />
        <polygon points="196,24 214,18 205,36" fill="#FACC15" />
        <circle cx="162" cy="55" r="28" fill="none" stroke="#EF4444" strokeWidth="5" />
        <line x1="142" y1="35" x2="182" y2="75" stroke="#EF4444" strokeWidth="5" strokeLinecap="round" />
        {/* Sunlight Arrow */}
        <circle cx="272" cy="36" r="14" fill="#E7B43C" />
        <path d="M240 76 H295" stroke="#34D399" strokeWidth="4" strokeLinecap="round" />
        <circle cx="248" cy="76" r="4" fill="#34D399" />
      </svg>
    );
  }

  if (sceneKey === 'weather_shade') {
    return (
      <svg viewBox="0 0 320 110" className={className} aria-hidden="true">
        <rect width="320" height="110" rx="14" fill="#FEF3C7" />
        <rect y="78" width="320" height="32" fill="#D9A86C" />
        <circle cx="270" cy="30" r="18" fill="#F59E0B" />
        {/* Shaded Colonnade Roof */}
        <rect x="36" y="24" width="134" height="14" rx="3" fill="#B45309" />
        <rect x="46" y="38" width="16" height="40" fill="#EAD7B1" />
        <rect x="96" y="38" width="16" height="40" fill="#EAD7B1" />
        <rect x="146" y="38" width="16" height="40" fill="#EAD7B1" />
        {/* Water Bottle & Shade Bench */}
        <rect x="68" y="64" width="24" height="14" rx="3" fill="#0F766E" />
        <rect x="122" y="54" width="12" height="24" rx="4" fill="#0EA5E9" />
      </svg>
    );
  }

  if (sceneKey === 'visitor_sorting' || sceneKey === 'sandstone_sorting') {
    return (
      <svg viewBox="0 0 320 110" className={className} aria-hidden="true">
        <rect width="320" height="110" rx="14" fill="#F0FDFA" />
        <rect y="78" width="320" height="32" fill="#E2B980" />
        {/* Pylon */}
        <path d="M36 78 L46 22 H84 L92 78 Z" fill="#C99758" />
        <path d="M228 78 L236 22 H274 L284 78 Z" fill="#C99758" />
        <rect x="80" y="24" width="160" height="16" fill="#B8874E" />
        <circle cx="160" cy="32" r="9" fill="#E7B43C" />
        {/* Walkway Tiles */}
        <rect x="115" y="78" width="90" height="20" rx="4" fill="#0F766E" opacity="0.22" />
        <line x1="125" y1="88" x2="195" y2="88" stroke="#0F766E" strokeWidth="3" strokeDasharray="6 4" />
      </svg>
    );
  }

  if (sceneKey === 'preservation_why') {
    return (
      <svg viewBox="0 0 320 110" className={className} aria-hidden="true">
        <rect width="320" height="110" rx="14" fill="#EFF6FF" />
        <rect x="28" y="20" width="76" height="70" rx="8" fill="#FEF3C7" stroke="#D97706" strokeWidth="2" />
        <circle cx="66" cy="45" r="12" fill="#E7B43C" />
        <rect x="46" y="64" width="40" height="10" rx="3" fill="#0F766E" />
        <path d="M126 55 H192" stroke="#254EAC" strokeWidth="3" strokeDasharray="5 4" />
        <polygon points="190,48 202,55 190,62" fill="#254EAC" />
        <rect x="216" y="20" width="76" height="70" rx="8" fill="#DCFCE7" stroke="#059669" strokeWidth="2" />
        <path d="M238 56 L249 67 L270 43" fill="none" stroke="#059669" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  // rope_barrier default
  return (
    <svg viewBox="0 0 320 110" className={className} aria-hidden="true">
      <rect width="320" height="110" rx="14" fill="#FFFBEB" />
      <rect y="80" width="320" height="30" fill="#D9A86C" />
      {/* Carved Column */}
      <rect x="215" y="14" width="46" height="66" rx="4" fill="#C99758" stroke="#92400E" strokeWidth="1.8" />
      <circle cx="238" cy="34" r="9" fill="#E7B43C" />
      <path d="M226 56 H250 M226 66 H250" stroke="#1E3A8A" strokeWidth="2.5" />
      {/* Protective Rope Barrier */}
      <rect x="134" y="42" width="8" height="38" rx="2" fill="#78350F" />
      <rect x="184" y="42" width="8" height="38" rx="2" fill="#78350F" />
      <path d="M138 50 Q163 62 188 50" fill="none" stroke="#DC2626" strokeWidth="4" strokeLinecap="round" />
      {/* Safe Visitor Silhouette */}
      <circle cx="76" cy="40" r="10" fill="#0F766E" />
      <rect x="64" y="52" width="24" height="28" rx="7" fill="#12B8B0" />
    </svg>
  );
}

export function FictionalGlyphSVG({
  glyphId,
  className = 'h-10 w-10',
}: {
  glyphId: FictionalGlyphId;
  className?: string;
}) {
  switch (glyphId) {
    case 'sun':
      return (
        <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
          <circle cx="24" cy="24" r="10" fill="#F59E0B" stroke="#78350F" strokeWidth="2" />
          <path d="M24 4 V10 M24 38 V44 M4 24 H10 M38 24 H44 M10 10 L14 14 M34 34 L38 38 M38 10 L34 14 M14 34 L10 38" stroke="#D97706" strokeWidth="2.6" strokeLinecap="round" />
        </svg>
      );
    case 'water':
      return (
        <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
          <path d="M8 17 Q16 11 24 17 T40 17" fill="none" stroke="#0284C7" strokeWidth="3.2" strokeLinecap="round" />
          <path d="M8 26 Q16 20 24 26 T40 26" fill="none" stroke="#0EA5E9" strokeWidth="3.2" strokeLinecap="round" />
          <path d="M8 35 Q16 29 24 35 T40 35" fill="none" stroke="#0369A1" strokeWidth="3.2" strokeLinecap="round" />
        </svg>
      );
    case 'lotus':
      return (
        <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
          <path d="M24 9 C18 18 18 28 24 35 C30 28 30 18 24 9 Z" fill="#14B8A6" stroke="#0F766E" strokeWidth="1.8" />
          <path d="M24 35 C14 31 10 23 11 16 C17 18 21 25 24 35 Z" fill="#2DD4BF" stroke="#0F766E" strokeWidth="1.6" />
          <path d="M24 35 C34 31 38 23 37 16 C31 18 27 25 24 35 Z" fill="#2DD4BF" stroke="#0F766E" strokeWidth="1.6" />
          <line x1="14" y1="38" x2="34" y2="38" stroke="#0F766E" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );
    case 'pyramid':
      return (
        <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
          <polygon points="24,8 42,39 6,39" fill="#D97706" stroke="#78350F" strokeWidth="2" />
          <polygon points="24,8 30,19 18,19" fill="#FDE047" />
          <line x1="24" y1="19" x2="24" y2="39" stroke="#78350F" strokeWidth="1.6" opacity="0.6" />
        </svg>
      );
    case 'star':
      return (
        <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
          <polygon
            points="24,6 29,17 41,18 32,26 35,38 24,32 13,38 16,26 7,18 19,17"
            fill="#6366F1"
            stroke="#312E81"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <circle cx="24" cy="24" r="3.5" fill="#FDE68A" />
        </svg>
      );
    case 'scroll':
      return (
        <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
          <rect x="11" y="10" width="26" height="28" rx="4" fill="#FFFBEB" stroke="#92400E" strokeWidth="2" />
          <rect x="8" y="10" width="6" height="28" rx="3" fill="#D97706" stroke="#78350F" strokeWidth="1.5" />
          <rect x="34" y="10" width="6" height="28" rx="3" fill="#D97706" stroke="#78350F" strokeWidth="1.5" />
          <line x1="18" y1="18" x2="30" y2="18" stroke="#254EAC" strokeWidth="2.4" strokeLinecap="round" />
          <line x1="18" y1="24" x2="30" y2="24" stroke="#0F766E" strokeWidth="2.4" strokeLinecap="round" />
          <line x1="18" y1="30" x2="27" y2="30" stroke="#B45309" strokeWidth="2.4" strokeLinecap="round" />
        </svg>
      );
  }
}

export function EgyptKnowledgeSealSVG({
  className = 'h-24 w-24',
}: {
  className?: string;
}) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="EgyptSealRing" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#E7B43C" />
          <stop offset="100%" stopColor="#12B8B0" />
        </linearGradient>
      </defs>
      <circle cx="60" cy="60" r="54" fill="#131E31" stroke="url(#EgyptSealRing)" strokeWidth="5" />
      <circle cx="60" cy="60" r="44" fill="none" stroke="#E7B43C" strokeWidth="1.8" strokeDasharray="4 3" />
      {/* Sun & Pyramid Emblem */}
      <circle cx="60" cy="38" r="10" fill="#E7B43C" />
      <polygon points="36,78 60,44 84,78" fill="#12B8B0" stroke="#FDE68A" strokeWidth="2" />
      <polygon points="60,44 68,55 52,55" fill="#FDE68A" />
      {/* Nile Wave */}
      <path d="M32 85 Q46 80 60 85 T88 85" fill="none" stroke="#38BDF8" strokeWidth="2.8" strokeLinecap="round" />
    </svg>
  );
}
