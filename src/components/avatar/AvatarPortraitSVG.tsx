import type { AvatarConfig, ResolvedAppearance } from '../../types/game';

interface AvatarPortraitSVGProps {
  avatar: AvatarConfig;
  variant?: 'bust' | 'full';
  appearance?: ResolvedAppearance;
  gesture?: 'idle' | 'greet' | 'celebrate';
  className?: string;
}

function darkenHex(hex: string, amount = 0.22): string {
  const clean = hex.replace('#', '');
  if (clean.length !== 6) return hex;
  const num = parseInt(clean, 16);
  const r = Math.max(0, Math.round(((num >> 16) & 255) * (1 - amount)));
  const g = Math.max(0, Math.round(((num >> 8) & 255) * (1 - amount)));
  const b = Math.max(0, Math.round((num & 255) * (1 - amount)));
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

function renderHairBackSVG(avatar: AvatarConfig) {
  const hair = avatar.hairColor;
  const darkHair = darkenHex(hair, 0.25);

  switch (avatar.hairStyle) {
    case 'bob_wave':
      return (
        <g>
          <path
            d="M72 68 C66 96 68 118 79 124 L121 124 C132 118 134 96 128 68 Z"
            fill={darkHair}
          />
        </g>
      );
    case 'high_ponytail':
      return (
        <g>
          <path
            d="M114 48 C134 44 146 66 138 98 C134 112 124 116 120 104 C122 86 122 68 112 58 Z"
            fill={darkHair}
          />
          <circle cx="115" cy="52" r="5" fill="#F2C66D" />
        </g>
      );
    case 'twin_buns':
      return (
        <g>
          <circle cx="71" cy="51" r="12" fill={darkHair} />
          <circle cx="129" cy="51" r="12" fill={darkHair} />
          <circle cx="71" cy="51" r="12" fill="none" stroke="#F2C66D" strokeWidth="2.5" strokeDasharray="8 16" />
          <circle cx="129" cy="51" r="12" fill="none" stroke="#F2C66D" strokeWidth="2.5" strokeDasharray="8 16" />
        </g>
      );
    case 'curly_crown':
      return (
        <g fill={darkHair}>
          <circle cx="71" cy="70" r="11" />
          <circle cx="129" cy="70" r="11" />
          <circle cx="74" cy="54" r="12" />
          <circle cx="126" cy="54" r="12" />
          <circle cx="88" cy="44" r="12" />
          <circle cx="112" cy="44" r="12" />
          <circle cx="100" cy="41" r="13" />
        </g>
      );
    default:
      return null;
  }
}

function renderHairFrontSVG(avatar: AvatarConfig) {
  const hair = avatar.hairColor;

  switch (avatar.hairStyle) {
    case 'short_tousled':
      return (
        <path
          d="M72 72 C72 48 86 42 100 42 C116 42 128 50 128 72 C122 60 112 56 102 62 C93 56 80 58 72 72 Z"
          fill={hair}
        />
      );
    case 'bob_wave':
      return (
        <path
          d="M72 76 C72 46 86 42 100 42 C116 42 128 48 128 76 C126 60 116 55 104 60 C92 55 78 60 72 76 Z"
          fill={hair}
        />
      );
    case 'high_ponytail':
      return (
        <path
          d="M74 72 C74 48 86 43 100 43 C114 43 126 48 126 72 C118 57 104 54 100 56 C92 54 81 58 74 72 Z"
          fill={hair}
        />
      );
    case 'twin_buns':
      return (
        <path
          d="M74 74 C74 49 87 43 100 43 C113 43 126 49 126 74 C120 60 107 55 100 62 C93 55 80 60 74 74 Z"
          fill={hair}
        />
      );
    case 'curly_crown':
      return (
        <g fill={hair}>
          <circle cx="80" cy="56" r="9" />
          <circle cx="93" cy="50" r="10" />
          <circle cx="107" cy="50" r="10" />
          <circle cx="120" cy="56" r="9" />
        </g>
      );
    case 'explorer_spiky':
      return (
        <path
          d="M73 73 L75 54 L85 40 L94 50 L103 36 L112 49 L123 43 L127 72 C118 58 106 58 100 61 C92 57 81 59 73 73 Z"
          fill={hair}
        />
      );
  }
}

export function AvatarPortraitSVG({
  avatar,
  variant = 'bust',
  appearance = 'day',
  gesture = 'idle',
  className = '',
}: AvatarPortraitSVGProps) {
  const isNight = appearance === 'night';
  const outfitDark = darkenHex(avatar.outfitColor, 0.24);
  const packDark = darkenHex(avatar.backpackColor, 0.2);

  const torsoWidthScale =
    avatar.modelId === 'pioneer_sturdy'
      ? 1.1
      : avatar.modelId === 'trailblazer_slim'
        ? 0.92
        : 1.0;

  if (variant === 'bust') {
    return (
      <svg
        viewBox="60 32 80 90"
        className={className}
        aria-hidden="true"
      >
        <defs>
          <clipPath id="vv-bust-clip">
            <rect x="60" y="32" width="80" height="90" rx="16" />
          </clipPath>
        </defs>
        <g clipPath="url(#vv-bust-clip)">
          <rect
            x="60"
            y="32"
            width="80"
            height="90"
            fill={isNight ? '#1A2447' : '#D8EEFB'}
          />
          {renderHairBackSVG(avatar)}
          {/* Shoulders / Outfit */}
          <path
            d={`M${100 - 30 * torsoWidthScale} 126 C${100 - 28 * torsoWidthScale} 102 ${100 - 15 * torsoWidthScale} 98 100 98 C${100 + 15 * torsoWidthScale} 98 ${100 + 28 * torsoWidthScale} 102 ${100 + 30 * torsoWidthScale} 126 Z`}
            fill={avatar.outfitColor}
          />
          {/* Backpack straps */}
          <rect x="82" y="99" width="5" height="26" rx="2.5" fill={avatar.backpackColor} />
          <rect x="113" y="99" width="5" height="26" rx="2.5" fill={avatar.backpackColor} />
          {/* Neck */}
          <rect x="94" y="88" width="12" height="14" rx="5" fill={avatar.skinTone} />
          {/* Ears */}
          <circle cx="74" cy="73" r="5" fill={avatar.skinTone} />
          <circle cx="126" cy="73" r="5" fill={avatar.skinTone} />
          {/* Head */}
          <ellipse cx="100" cy="71" rx="25" ry="26" fill={avatar.skinTone} />
          {/* Eyes */}
          <circle cx="90" cy="71" r="3" fill="#1E2433" />
          <circle cx="110" cy="71" r="3" fill="#1E2433" />
          <circle cx="91" cy="70" r="1" fill="#FFFFFF" />
          <circle cx="111" cy="70" r="1" fill="#FFFFFF" />
          {/* Smile */}
          <path
            d="M93 82 Q100 88 107 82"
            fill="none"
            stroke="#5D3628"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          {renderHairFrontSVG(avatar)}
        </g>
      </svg>
    );
  }

  return (
    <div
      className={`relative flex h-full w-full items-center justify-center overflow-hidden ${
        isNight
          ? 'bg-gradient-to-b from-[#0A0E26] via-[#1B1942] to-[#261C4D]'
          : 'bg-gradient-to-b from-[#2E96D9] via-[#75C4EE] to-[#CBEBFB]'
      } ${className}`}
    >
      {/* Night Stars or Day Clouds */}
      {isNight ? (
        <svg viewBox="0 0 400 220" className="pointer-events-none absolute inset-x-0 top-0 h-56 w-full opacity-90" aria-hidden="true">
          <circle cx="52" cy="48" r="1.8" fill="#FFFDF4" />
          <circle cx="115" cy="34" r="1.4" fill="#FFFDF4" />
          <circle cx="180" cy="60" r="1.5" fill="#F2C66D" />
          <circle cx="290" cy="42" r="1.6" fill="#FFFDF4" />
          <circle cx="348" cy="72" r="2.0" fill="#FFFDF4" />
          <circle cx="322" cy="52" r="18" fill="#FFF2CE" />
        </svg>
      ) : (
        <svg viewBox="0 0 400 200" className="pointer-events-none absolute inset-x-0 top-4 h-48 w-full opacity-80" aria-hidden="true">
          <g fill="#FFFFFF">
            <circle cx="62" cy="52" r="18" />
            <circle cx="80" cy="46" r="22" />
            <circle cx="99" cy="54" r="16" />
            <circle cx="310" cy="64" r="16" />
            <circle cx="328" cy="58" r="21" />
            <circle cx="346" cy="66" r="14" />
          </g>
        </svg>
      )}

      {/* Full Explorer Character on Floating Pedestal (2D Accessible Fallback) */}
      <svg
        viewBox="0 20 200 230"
        className={`relative z-10 h-[58vh] max-h-[430px] w-auto -translate-y-12 transition-transform duration-300 ${
          gesture === 'celebrate' ? '-translate-y-16 scale-105' : ''
        }`}
        role="img"
        aria-label={avatar.displayName}
      >
        {/* Floating Pedestal */}
        <ellipse cx="100" cy="228" rx="56" ry="11" fill="#24B8B0" opacity="0.28" />
        <ellipse cx="100" cy="218" rx="64" ry="14" fill="#20304A" />
        <ellipse cx="100" cy="213" rx="64" ry="13" fill="#F2C66D" />
        <ellipse cx="100" cy="211" rx="58" ry="10.5" fill="#EEF3FA" />
        <ellipse cx="100" cy="211" rx="28" ry="4.8" fill="rgba(19,30,49,0.22)" />

        {/* Backpack peeking behind shoulders */}
        <rect
          x="64"
          y="102"
          width="72"
          height="52"
          rx="14"
          fill={avatar.backpackColor}
          stroke={packDark}
          strokeWidth="2.5"
        />
        <rect x="76" y="96" width="48" height="10" rx="5" fill={packDark} />

        {/* Legs & Boots */}
        <rect x="83" y="160" width="13" height="38" rx="5" fill="#243147" />
        <rect x="104" y="160" width="13" height="38" rx="5" fill="#243147" />
        <rect x="79" y="194" width="18" height="14" rx="6" fill="#4B3222" />
        <rect x="103" y="194" width="18" height="14" rx="6" fill="#4B3222" />

        {/* Left Arm */}
        <g
          transform={
            gesture === 'celebrate'
              ? 'rotate(138 74 114)'
              : 'rotate(12 74 114)'
          }
        >
          <rect x="64" y="110" width="13" height="40" rx="6.5" fill={avatar.outfitColor} />
          <circle cx="70.5" cy="153" r="6" fill={avatar.skinTone} />
        </g>

        {/* Right Arm (Waves on Greet or Raises on Celebrate) */}
        <g
          transform={
            gesture === 'celebrate'
              ? 'rotate(-138 126 114)'
              : gesture === 'greet'
                ? 'rotate(-118 126 114)'
                : 'rotate(-12 126 114)'
          }
        >
          <rect x="123" y="110" width="13" height="40" rx="6.5" fill={avatar.outfitColor} />
          <circle cx="129.5" cy="153" r="6" fill={avatar.skinTone} />
        </g>

        {/* Torso & Outfit Silhouette */}
        <g transform={`translate(${100 * (1 - torsoWidthScale)}, 0) scale(${torsoWidthScale}, 1)`}>
          <rect
            x="76"
            y="102"
            width="48"
            height="62"
            rx="15"
            fill={avatar.outfitId === 'safari_vest' ? '#E9E2D2' : avatar.outfitColor}
          />
          {avatar.outfitId === 'safari_vest' && (
            <>
              <rect x="76" y="102" width="17" height="58" rx="6" fill={avatar.outfitColor} />
              <rect x="107" y="102" width="17" height="58" rx="6" fill={avatar.outfitColor} />
            </>
          )}
          {avatar.outfitId === 'coastal_poncho' && (
            <path
              d="M70 106 Q100 98 130 106 L136 138 Q100 148 64 138 Z"
              fill={outfitDark}
              stroke="#F2C66D"
              strokeWidth="2.5"
            />
          )}
          {avatar.outfitId === 'sky_hoodie' && (
            <path
              d="M82 103 Q100 116 118 103"
              fill="none"
              stroke={outfitDark}
              strokeWidth="6"
              strokeLinecap="round"
            />
          )}
          {/* Belt & Brass Buckle */}
          <rect x="76" y="148" width="48" height="7" fill={outfitDark} />
          <rect x="95" y="146.5" width="10" height="10" rx="2.5" fill="#F2C66D" />
          {/* Backpack Front Straps */}
          <rect x="81" y="103" width="5" height="45" rx="2.5" fill={avatar.backpackColor} />
          <rect x="114" y="103" width="5" height="45" rx="2.5" fill={avatar.backpackColor} />
        </g>

        {/* Head & Hair */}
        {renderHairBackSVG(avatar)}
        <rect x="94" y="88" width="12" height="16" rx="5" fill={avatar.skinTone} />
        <circle cx="74" cy="73" r="5" fill={avatar.skinTone} />
        <circle cx="126" cy="73" r="5" fill={avatar.skinTone} />
        <ellipse cx="100" cy="71" rx="25" ry="26" fill={avatar.skinTone} />
        <circle cx="90" cy="71" r="3" fill="#1E2433" />
        <circle cx="110" cy="71" r="3" fill="#1E2433" />
        <circle cx="91" cy="70" r="1" fill="#FFFFFF" />
        <circle cx="111" cy="70" r="1" fill="#FFFFFF" />
        <path
          d={gesture === 'idle' ? 'M93 82 Q100 87 107 82' : 'M91 81 Q100 90 109 81'}
          fill="none"
          stroke="#5D3628"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        {renderHairFrontSVG(avatar)}
      </svg>
    </div>
  );
}
