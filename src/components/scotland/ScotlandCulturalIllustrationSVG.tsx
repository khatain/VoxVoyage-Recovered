import type { ScotlandLandmarkId } from '../../data/scotlandWorld';

interface StationIllustrationProps {
  stationId: ScotlandLandmarkId;
  className?: string;
}

export function ScotlandStationIllustrationSVG({
  stationId,
  className = 'h-24 w-24',
}: StationIllustrationProps) {
  if (stationId === 'highland_village_square') {
    return (
      <svg viewBox="0 0 120 120" className={className} aria-hidden="true">
        <rect x="6" y="6" width="108" height="108" rx="20" fill="#EBF6F2" />
        <path d="M10 92 Q60 84 110 92 L110 110 Q60 114 10 110 Z" fill="#89A894" />
        {/* Stone cottage */}
        <rect x="18" y="48" width="38" height="36" rx="4" fill="#CBD5E1" stroke="#334155" strokeWidth="2" />
        <polygon points="14,50 37,28 60,50" fill="#475569" stroke="#1E293B" strokeWidth="2" />
        <rect x="31" y="62" width="12" height="22" rx="2" fill="#2E6B5E" />
        <rect x="23" y="56" width="6" height="6" rx="1" fill="#FDE68A" />
        <rect x="45" y="56" width="6" height="6" rx="1" fill="#FDE68A" />
        {/* Stone fountain */}
        <ellipse cx="84" cy="84" rx="18" ry="6" fill="#94A3B8" stroke="#334155" strokeWidth="2" />
        <rect x="79" y="62" width="10" height="20" rx="3" fill="#CBD5E1" stroke="#334155" strokeWidth="2" />
        <path d="M84 52 C78 58 76 62 76 66" stroke="#38BDF8" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M84 52 C90 58 92 62 92 66" stroke="#38BDF8" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <circle cx="84" cy="48" r="4" fill="#38BDF8" />
        {/* Purple heather */}
        <circle cx="64" cy="84" r="5" fill="#9333EA" opacity="0.8" />
        <circle cx="104" cy="83" r="4.5" fill="#A855F7" opacity="0.8" />
      </svg>
    );
  }

  if (stationId === 'tartan_heritage_workshop') {
    return (
      <svg viewBox="0 0 120 120" className={className} aria-hidden="true">
        <rect x="6" y="6" width="108" height="108" rx="20" fill="#FDF2F0" />
        {/* Scottish Tartan Swatch */}
        <rect x="18" y="24" width="44" height="58" rx="6" fill="#C84B43" stroke="#1E293B" strokeWidth="2" />
        <rect x="28" y="24" width="6" height="58" fill="#1E3A5F" opacity="0.85" />
        <rect x="44" y="24" width="6" height="58" fill="#2E6B5E" opacity="0.85" />
        <rect x="18" y="36" width="44" height="6" fill="#1E3A5F" opacity="0.72" />
        <rect x="18" y="54" width="44" height="6" fill="#2E6B5E" opacity="0.72" />
        <line x1="39" y1="24" x2="39" y2="82" stroke="#F59E0B" strokeWidth="1.5" />
        <line x1="18" y1="47" x2="62" y2="47" stroke="#F59E0B" strokeWidth="1.5" />
        {/* Loom & Praewa Silk Ribbon */}
        <rect x="68" y="34" width="34" height="54" rx="6" fill="#FDE68A" stroke="#78350F" strokeWidth="2" />
        <polygon points="85,40 94,52 85,64 76,52" fill="#9D174D" />
        <polygon points="85,64 94,76 85,84 76,76" fill="#0F766E" />
        <line x1="68" y1="94" x2="102" y2="94" stroke="#78350F" strokeWidth="4" strokeLinecap="round" />
        <circle cx="40" cy="94" r="6" fill="#D97706" />
        <path d="M32 94 H48" stroke="#78350F" strokeWidth="2" />
      </svg>
    );
  }

  if (stationId === 'highland_food_market') {
    return (
      <svg viewBox="0 0 120 120" className={className} aria-hidden="true">
        <rect x="6" y="6" width="108" height="108" rx="20" fill="#FEF7EC" />
        {/* Wooden market platter */}
        <ellipse cx="60" cy="86" rx="44" ry="12" fill="#B45309" stroke="#78350F" strokeWidth="2" />
        {/* Golden shortbread fingers */}
        <rect x="26" y="56" width="24" height="22" rx="4" fill="#FBBF24" stroke="#92400E" strokeWidth="2" />
        <circle cx="33" cy="63" r="1.4" fill="#92400E" />
        <circle cx="42" cy="63" r="1.4" fill="#92400E" />
        <circle cx="33" cy="71" r="1.4" fill="#92400E" />
        <circle cx="42" cy="71" r="1.4" fill="#92400E" />
        {/* Oatcakes */}
        <circle cx="72" cy="66" r="15" fill="#D6B178" stroke="#78350F" strokeWidth="2" />
        <line x1="72" y1="51" x2="72" y2="81" stroke="#92400E" strokeWidth="1.2" opacity="0.6" />
        <line x1="57" y1="66" x2="87" y2="66" stroke="#92400E" strokeWidth="1.2" opacity="0.6" />
        {/* Berries */}
        <circle cx="92" cy="54" r="7" fill="#BE123C" stroke="#881337" strokeWidth="1.5" />
        <circle cx="84" cy="46" r="6" fill="#E11D48" stroke="#881337" strokeWidth="1.5" />
        <circle cx="98" cy="44" r="5.5" fill="#4338CA" stroke="#312E81" strokeWidth="1.5" />
        <path d="M52 34 C56 26 64 26 68 34" stroke="#059669" strokeWidth="3" fill="none" strokeLinecap="round" />
      </svg>
    );
  }

  if (stationId === 'highland_games_ground') {
    return (
      <svg viewBox="0 0 120 120" className={className} aria-hidden="true">
        <rect x="6" y="6" width="108" height="108" rx="20" fill="#EEF1FA" />
        {/* Tartan festival pennants */}
        <path d="M12 24 Q60 34 108 24" stroke="#334155" strokeWidth="2" fill="none" />
        <polygon points="22,26 30,42 38,27" fill="#C84B43" />
        <polygon points="48,29 56,45 64,29" fill="#2B8C7E" />
        <polygon points="74,28 82,44 90,27" fill="#D99B26" />
        {/* Bodhran frame drum */}
        <circle cx="44" cy="74" r="21" fill="#FDE68A" stroke="#78350F" strokeWidth="4" />
        <line x1="30" y1="88" x2="58" y2="60" stroke="#92400E" strokeWidth="3" strokeLinecap="round" />
        {/* Musical notes & fiddle neck */}
        <rect x="78" y="48" width="16" height="36" rx="8" fill="#B45309" stroke="#78350F" strokeWidth="2" />
        <rect x="84" y="34" width="4" height="20" fill="#78350F" />
        <circle cx="72" cy="54" r="4" fill="#4F46E5" />
        <path d="M76 54 V38 L92 34 V46" stroke="#4F46E5" strokeWidth="2.5" fill="none" />
      </svg>
    );
  }

  // lochside_castle_viewpoint
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true">
      <rect x="6" y="6" width="108" height="108" rx="20" fill="#EAF4FB" />
      {/* Munro hills */}
      <polygon points="10,74 42,38 72,74" fill="#4D7C5F" />
      <polygon points="52,74 84,42 112,74" fill="#3B6B54" />
      {/* Castle silhouette */}
      <rect x="74" y="30" width="20" height="28" fill="#64748B" stroke="#334155" strokeWidth="1.8" />
      <rect x="74" y="25" width="5" height="5" fill="#64748B" />
      <rect x="81.5" y="25" width="5" height="5" fill="#64748B" />
      <rect x="89" y="25" width="5" height="5" fill="#64748B" />
      {/* Loch water */}
      <rect x="10" y="72" width="100" height="36" rx="8" fill="#0284C7" opacity="0.82" />
      <path d="M22 84 H52 M66 92 H96" stroke="#BAE6FD" strokeWidth="2.5" strokeLinecap="round" />
      {/* Compass star */}
      <circle cx="34" cy="40" r="11" fill="#FFFDF8" stroke="#1E293B" strokeWidth="2" />
      <polygon points="34,31 37,40 34,49 31,40" fill="#D97706" />
      <polygon points="25,40 34,37 43,40 34,43" fill="#0E7490" />
    </svg>
  );
}
