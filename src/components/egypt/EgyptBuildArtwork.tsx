import type { EgyptBuildGameId } from '../../types/game';
import type {
  EquipmentPropId,
  PapyrusWorkshopStepSpec,
  TempleRuleArchitectVariant,
} from '../../data/egyptBuildTypes';

export function EgyptBuildStationEmblemSVG({
  gameId,
  className = 'h-12 w-12',
}: {
  gameId: EgyptBuildGameId;
  className?: string;
}) {
  if (gameId === 'expedition_command_forge') {
    return (
      <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
        <defs>
          <linearGradient id="forgeBg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#0D9488" />
            <stop offset="100%" stopColor="#1E3A8A" />
          </linearGradient>
        </defs>
        <rect x="4" y="4" width="56" height="56" rx="16" fill="url(#forgeBg)" />
        <rect x="14" y="20" width="36" height="28" rx="6" fill="#FDE68A" />
        <rect x="18" y="24" width="28" height="20" rx="3" fill="#B45309" />
        <circle cx="32" cy="34" r="7" fill="#FFFBEB" stroke="#134E4A" strokeWidth="2" />
        <polygon points="32,29 35,34 32,39 29,34" fill="#DC2626" />
        <path d="M24 20 V15 C24 13 40 13 40 15 V20" fill="none" stroke="#FDE68A" strokeWidth="3.5" strokeLinecap="round" />
      </svg>
    );
  }
  if (gameId === 'pyramid_route_architect') {
    return (
      <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
        <rect x="4" y="4" width="56" height="56" rx="16" fill="#FEF3C7" stroke="#D97706" strokeWidth="2.5" />
        <polygon points="10,48 28,22 44,48" fill="#E7B43C" />
        <polygon points="32,48 45,28 56,48" fill="#D97706" />
        <path
          d="M14 52 C22 44, 34 45, 48 36"
          fill="none"
          stroke="#0F766E"
          strokeWidth="3.2"
          strokeDasharray="4 3"
          strokeLinecap="round"
        />
        <circle cx="49" cy="35" r="4.5" fill="#12B8B0" stroke="#FFF" strokeWidth="1.5" />
      </svg>
    );
  }
  if (gameId === 'papyrus_instruction_workshop') {
    return (
      <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
        <rect x="4" y="4" width="56" height="56" rx="16" fill="#CCFBF1" stroke="#0D9488" strokeWidth="2.5" />
        <rect x="16" y="13" width="32" height="38" rx="4" fill="#FEF3C7" stroke="#B45309" strokeWidth="2" />
        <ellipse cx="32" cy="14" rx="18" ry="4" fill="#FDE68A" stroke="#B45309" strokeWidth="1.8" />
        <ellipse cx="32" cy="50" rx="18" ry="4" fill="#FDE68A" stroke="#B45309" strokeWidth="1.8" />
        <line x1="22" y1="24" x2="42" y2="24" stroke="#0F766E" strokeWidth="2.6" strokeLinecap="round" />
        <line x1="22" y1="32" x2="40" y2="32" stroke="#1E3A8A" strokeWidth="2.6" strokeLinecap="round" />
        <line x1="22" y1="40" x2="36" y2="40" stroke="#B45309" strokeWidth="2.6" strokeLinecap="round" />
      </svg>
    );
  }
  if (gameId === 'temple_rule_architect') {
    return (
      <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
        <rect x="4" y="4" width="56" height="56" rx="16" fill="#E0E7FF" stroke="#254EAC" strokeWidth="2.5" />
        <rect x="12" y="16" width="40" height="34" rx="5" fill="#FDE68A" stroke="#B45309" strokeWidth="2" />
        <circle cx="32" cy="24" r="6" fill="#F59E0B" />
        <line x1="20" y1="36" x2="44" y2="36" stroke="#1E3A8A" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="23" y1="43" x2="41" y2="43" stroke="#1E3A8A" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="bpGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1E3A8A" />
          <stop offset="100%" stopColor="#0F766E" />
        </linearGradient>
      </defs>
      <rect x="4" y="4" width="56" height="56" rx="16" fill="url(#bpGrad)" />
      <rect x="14" y="14" width="36" height="36" rx="4" fill="none" stroke="#FDE68A" strokeWidth="2" strokeDasharray="3 2" />
      <polygon points="32,18 44,44 20,44" fill="none" stroke="#FCD34D" strokeWidth="2.5" />
      <circle cx="32" cy="34" r="4.5" fill="#FCD34D" />
    </svg>
  );
}

export function ExpeditionEquipmentTableSVG({
  highlightedItems,
  actionDemoKey,
  isSolved,
  className = 'w-full h-auto',
}: {
  highlightedItems: EquipmentPropId[];
  actionDemoKey: string;
  isSolved: boolean;
  className?: string;
}) {
  const has = (id: EquipmentPropId) => highlightedItems.includes(id);

  return (
    <svg viewBox="0 0 420 155" className={className} role="img" aria-label="Expedition camp equipment table">
      <rect x="6" y="6" width="408" height="143" rx="18" fill="#FEF3C7" stroke="#E7B43C" strokeWidth="2" />
      {/* Wooden Table Surface */}
      <rect x="20" y="96" width="380" height="42" rx="10" fill="#B45309" />
      <rect x="24" y="92" width="372" height="14" rx="6" fill="#D97706" />

      {/* Backpack */}
      <g opacity={has('backpack') ? 1 : 0.45}>
        <rect x="38" y="42" width="52" height="58" rx="12" fill="#0F766E" stroke={has('backpack') ? '#FDE68A' : 'none'} strokeWidth="2.5" />
        <rect x="47" y="64" width="34" height="24" rx="6" fill="#14B8A6" />
        <path d="M52 42 V34 C52 30 76 30 76 34 V42" fill="none" stroke="#115E59" strokeWidth="4" />
        <text x="64" y="114" textAnchor="middle" fontSize="9.5" fontWeight="700" fill="#FEF3C7">PACK</text>
      </g>

      {/* Compass */}
      <g opacity={has('compass') ? 1 : 0.45}>
        <circle cx="122" cy="70" r="20" fill="#FDE68A" stroke={has('compass') ? '#0D9488' : '#B45309'} strokeWidth="3" />
        <circle cx="122" cy="70" r="14" fill="#FFFBEB" />
        <polygon points="122,58 126,70 122,82 118,70" fill="#DC2626" />
        <text x="122" y="114" textAnchor="middle" fontSize="9.5" fontWeight="700" fill="#FEF3C7">COMPASS</text>
      </g>

      {/* Rolled Map & Notebook */}
      <g opacity={has('map') || has('notebook') ? 1 : 0.45}>
        <rect x="160" y="54" width="60" height="40" rx="5" fill="#FFFBEB" stroke={has('map') ? '#2563EB' : '#B45309'} strokeWidth="2.5" />
        <path d="M168 78 L184 66 L198 76 L212 62" fill="none" stroke="#0D9488" strokeWidth="2.5" strokeDasharray="3 2" />
        <rect x="228" y="58" width="34" height="36" rx="4" fill="#254EAC" stroke={has('notebook') ? '#FDE68A' : 'none'} strokeWidth="2.5" />
        <rect x="233" y="63" width="24" height="26" rx="2" fill="#FFFDF8" />
        <line x1="237" y1="70" x2="252" y2="70" stroke="#94A3B8" strokeWidth="1.6" />
        <line x1="237" y1="76" x2="250" y2="76" stroke="#94A3B8" strokeWidth="1.6" />
        <text x="208" y="114" textAnchor="middle" fontSize="9.5" fontWeight="700" fill="#FEF3C7">MAP / BOOK</text>
      </g>

      {/* Camera (with Warning Badge when ban_camera) */}
      <g opacity={has('camera') ? 1 : 0.45}>
        <rect x="276" y="60" width="44" height="32" rx="6" fill="#334155" stroke={has('camera') ? '#F59E0B' : 'none'} strokeWidth="2.5" />
        <circle cx="298" cy="76" r="9" fill="#0EA5E9" stroke="#CBD5E1" strokeWidth="2.5" />
        {actionDemoKey === 'ban_camera' && (
          <g>
            <circle cx="316" cy="58" r="10" fill="#DC2626" />
            <line x1="311" y1="53" x2="321" y2="63" stroke="#FFF" strokeWidth="2.5" />
            <line x1="321" y1="53" x2="311" y2="63" stroke="#FFF" strokeWidth="2.5" />
          </g>
        )}
        <text x="298" y="114" textAnchor="middle" fontSize="9.5" fontWeight="700" fill="#FEF3C7">CAMERA</text>
      </g>

      {/* Water Bottle & Sun Hat */}
      <g opacity={has('water_bottle') || has('sun_hat') ? 1 : 0.45}>
        <rect x="334" y="48" width="18" height="44" rx="5" fill="#0EA5E9" stroke={has('water_bottle') ? '#FFF' : 'none'} strokeWidth="2" />
        <rect x="338" y="42" width="10" height="7" rx="2" fill="#0369A1" />
        <ellipse cx="378" cy="84" rx="22" ry="7" fill="#FDE68A" stroke={has('sun_hat') ? '#D97706' : 'none'} strokeWidth="2" />
        <path d="M366 82 C366 64, 390 64, 390 82 Z" fill="#F59E0B" />
        <text x="364" y="114" textAnchor="middle" fontSize="9.5" fontWeight="700" fill="#FEF3C7">WATER / HAT</text>
      </g>

      {/* Pencil indicator */}
      {has('pencil') && (
        <g>
          <rect x="198" y="42" width="44" height="7" rx="2" fill="#F59E0B" stroke="#78350F" strokeWidth="1" />
          <polygon points="242,42 250,45.5 242,49" fill="#1E293B" />
        </g>
      )}

      {/* Solved stamp check */}
      {isSolved && (
        <g>
          <circle cx="386" cy="24" r="12" fill="#059669" />
          <path d="M380 24 L384 28 L392 20" fill="none" stroke="#FFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      )}
    </svg>
  );
}

export function PapyrusStepSceneSVG({
  sceneKey,
  className = 'h-12 w-12',
}: {
  sceneKey: PapyrusWorkshopStepSpec['sceneKey'];
  className?: string;
}) {
  const palette: Record<PapyrusWorkshopStepSpec['sceneKey'], { bg: string; fg: string; label: string }> = {
    prepare_notebook: { bg: '#DBEAFE', fg: '#1E3A8A', label: 'NOTE' },
    write_clue: { bg: '#FEF3C7', fg: '#92400E', label: 'INK' },
    seal_scroll: { bg: '#FCE7F3', fg: '#9D174D', label: 'SEAL' },
    deliver_camp: { bg: '#CCFBF1', fg: '#115E59', label: 'CAMP' },
    gather_reeds: { bg: '#DCFCE7', fg: '#166534', label: 'REED' },
    press_flat: { bg: '#FEF9C3', fg: '#854D0E', label: 'PRESS' },
    dry_sun: { bg: '#FFEDD5', fg: '#9A3412', label: 'DRY' },
    pack_gear: { bg: '#E0F2FE', fg: '#075985', label: 'BAG' },
    follow_markers: { bg: '#CCFBF1', fg: '#0F766E', label: 'PATH' },
    check_map: { bg: '#E0E7FF', fg: '#3730A3', label: 'MAP' },
    sketch_carving: { bg: '#FEF3C7', fg: '#B45309', label: 'DRAW' },
    wash_brush: { bg: '#E0F2FE', fg: '#0369A1', label: 'WASH' },
    place_scroll: { bg: '#FDE68A', fg: '#78350F', label: 'STORE' },
    greet_visitor: { bg: '#D1FAE5', fg: '#065F46', label: 'HI!' },
    point_sign: { bg: '#E0E7FF', fg: '#1E40AF', label: 'SIGN' },
    explain_rule: { bg: '#FEE2E2', fg: '#991B1B', label: 'CARE' },
  };
  const info = palette[sceneKey];
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <rect x="4" y="4" width="56" height="56" rx="14" fill={info.bg} stroke={info.fg} strokeWidth="2.5" />
      <rect x="14" y="14" width="36" height="24" rx="6" fill="#FFFFFF" stroke={info.fg} strokeWidth="1.5" />
      <circle cx="24" cy="26" r="5" fill={info.fg} opacity="0.85" />
      <line x1="33" y1="23" x2="44" y2="23" stroke={info.fg} strokeWidth="2.4" strokeLinecap="round" />
      <line x1="33" y1="29" x2="42" y2="29" stroke={info.fg} strokeWidth="2" strokeLinecap="round" />
      <text x="32" y="51" textAnchor="middle" fontSize="9.5" fontWeight="800" fill={info.fg}>
        {info.label}
      </text>
    </svg>
  );
}

export function TempleCourtyardSceneSVG({
  sceneKey,
  className = 'w-full h-24',
}: {
  sceneKey: TempleRuleArchitectVariant['courtyardSceneKey'];
  className?: string;
}) {
  const accent =
    sceneKey === 'stone_warning'
      ? '#DC2626'
      : sceneKey === 'sun_alignment'
        ? '#D97706'
        : '#254EAC';

  return (
    <svg viewBox="0 0 360 96" className={className} role="img" aria-label="Temple of the Sun courtyard scene">
      <rect x="2" y="2" width="356" height="92" rx="14" fill="#FEF3C7" stroke="#E7B43C" strokeWidth="2" />
      {/* Courtyard columns */}
      <rect x="28" y="20" width="16" height="62" rx="2" fill="#D97706" />
      <ellipse cx="36" cy="20" rx="12" ry="5" fill="#E7B43C" />
      <rect x="76" y="20" width="16" height="62" rx="2" fill="#D97706" />
      <ellipse cx="84" cy="20" rx="12" ry="5" fill="#E7B43C" />
      <rect x="268" y="20" width="16" height="62" rx="2" fill="#D97706" />
      <ellipse cx="276" cy="20" rx="12" ry="5" fill="#E7B43C" />
      <rect x="316" y="20" width="16" height="62" rx="2" fill="#D97706" />
      <ellipse cx="324" cy="20" rx="12" ry="5" fill="#E7B43C" />

      {/* Center Sun Disc */}
      <circle cx="180" cy="36" r="18" fill="#F59E0B" />
      <circle cx="180" cy="36" r="12" fill="#FEF08A" />
      <rect x="115" y="68" width="130" height="16" rx="4" fill={accent} />
      <text x="180" y="79" textAnchor="middle" fontSize="9.5" fontWeight="800" fill="#FFFBEB">
        SUN TEMPLE SANCTUARY
      </text>
    </svg>
  );
}

export function TempleSignPlaqueSVG({
  sentence,
  isSolved,
  isNight,
}: {
  sentence: string;
  isSolved: boolean;
  isNight: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border-2 px-4 py-3 text-center transition-colors ${
        isSolved
          ? isNight
            ? 'border-[#10B981] bg-[#0B2A26] text-[#A7F3D0]'
            : 'border-[#059669] bg-[#ECFDF5] text-[#065F46]'
          : isNight
            ? 'border-[#E7B43C]/55 bg-[#1B2542] text-[#FDE68A]'
            : 'border-[#D97706]/60 bg-[#FFF8E7] text-[#78350F]'
      }`}
    >
      <p className="text-[10px] font-extrabold uppercase tracking-wider opacity-75">
        Sandstone Courtyard Sign Preview
      </p>
      <p className="mt-1 font-display text-sm sm:text-base font-extrabold min-h-[1.5rem]">
        {sentence || 'Select word tiles below to engrave your temple sign...'}
      </p>
    </div>
  );
}

export function PharaohBlueprintIllustrationSVG({
  className = 'h-12 w-12',
}: {
  className?: string;
}) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <rect x="4" y="6" width="56" height="52" rx="10" fill="#1E3A8A" stroke="#FDE68A" strokeWidth="2.5" />
      <line x1="12" y1="16" x2="52" y2="16" stroke="#60A5FA" strokeWidth="1" opacity="0.5" />
      <line x1="12" y1="32" x2="52" y2="32" stroke="#60A5FA" strokeWidth="1" opacity="0.5" />
      <line x1="32" y1="12" x2="32" y2="52" stroke="#60A5FA" strokeWidth="1" opacity="0.5" />
      <polygon points="32,16 46,44 18,44" fill="none" stroke="#FCD34D" strokeWidth="2.5" />
      <circle cx="32" cy="34" r="4" fill="#14B8A6" stroke="#FFF" strokeWidth="1.5" />
    </svg>
  );
}

export function EgyptBuilderSealSVG({
  className = 'h-24 w-24',
}: {
  className?: string;
}) {
  return (
    <svg viewBox="0 0 120 120" className={className} role="img" aria-label="Decorative Expedition Assistant Builder Seal">
      <defs>
        <linearGradient id="builderSealGold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FDE68A" />
          <stop offset="50%" stopColor="#E7B43C" />
          <stop offset="100%" stopColor="#B45309" />
        </linearGradient>
      </defs>
      <circle cx="60" cy="60" r="54" fill="url(#builderSealGold)" />
      <circle cx="60" cy="60" r="46" fill="#1E3A8A" stroke="#FEF3C7" strokeWidth="2.5" />
      <polygon points="60,26 84,74 36,74" fill="#E7B43C" stroke="#FEF3C7" strokeWidth="2" />
      <rect x="44" y="64" width="32" height="18" rx="4" fill="#0F766E" stroke="#FEF3C7" strokeWidth="1.5" />
      <circle cx="60" cy="73" r="4" fill="#FDE68A" />
      <text x="60" y="96" textAnchor="middle" fontSize="8.5" fontWeight="800" fill="#FDE68A">
        BUILDER SEAL · II
      </text>
    </svg>
  );
}
