import type { AppLanguage } from '../../types/game';
import {
  DIRECTION_DECODER_PINS,
  type AustraliaDiscoverMissionId,
  type SydneyMiniMapPinId,
} from '../../data/australiaDiscovery';

export function AustraliaMissionEmblemSVG({
  missionId,
  className = 'h-12 w-12',
}: {
  missionId: AustraliaDiscoverMissionId;
  className?: string;
}) {
  if (missionId === 'greeting_detective') {
    return (
      <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
        <rect width="64" height="64" rx="16" fill="#0284C7" />
        <path d="M12 46 Q24 22 36 46 Z" fill="#FFFFFF" opacity="0.92" />
        <path d="M26 46 Q38 18 52 46 Z" fill="#BAE6FD" opacity="0.95" />
        <rect x="10" y="46" width="44" height="6" rx="3" fill="#0EA5E9" />
        <circle cx="48" cy="18" r="7" fill="#F59E0B" />
        <path d="M14 14 H34 V26 H23 L17 31 V26 H14 Z" fill="#FFFDF8" />
        <circle cx="20" cy="20" r="1.7" fill="#0284C7" />
        <circle cx="24" cy="20" r="1.7" fill="#0284C7" />
        <circle cx="28" cy="20" r="1.7" fill="#0284C7" />
      </svg>
    );
  }

  if (missionId === 'direction_decoder') {
    return (
      <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
        <rect width="64" height="64" rx="16" fill="#1D4ED8" />
        <path d="M14 48 V30 H34 V18 H50" stroke="#93C5FD" strokeWidth="5" strokeLinecap="round" fill="none" />
        <path d="M14 48 V30 H34 V18 H50" stroke="#FBBF24" strokeWidth="2.5" strokeDasharray="4 4" strokeLinecap="round" fill="none" />
        <circle cx="14" cy="48" r="6" fill="#10B981" stroke="#FFFFFF" strokeWidth="2" />
        <path d="M50 10 C45 10 42 14 42 18 C42 24 50 31 50 31 C50 31 58 24 58 18 C58 14 55 10 50 10 Z" fill="#F97316" />
        <circle cx="50" cy="18" r="2.8" fill="#FFFFFF" />
      </svg>
    );
  }

  if (missionId === 'cafe_order_quest') {
    return (
      <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
        <rect width="64" height="64" rx="16" fill="#EA580C" />
        <rect x="12" y="14" width="40" height="8" rx="4" fill="#FFF7ED" />
        <rect x="18" y="25" width="20" height="22" rx="4" fill="#FFFFFF" />
        <path d="M38 29 H44 C47 29 47 38 44 38 H38" stroke="#FFFFFF" strokeWidth="3.2" fill="none" />
        <ellipse cx="28" cy="29" rx="7" ry="3" fill="#B45309" />
        <rect x="12" y="49" width="40" height="4" rx="2" fill="#FDE68A" />
        <path d="M23 18 Q25 14 23 11 M30 18 Q32 14 30 11" stroke="#EA580C" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      </svg>
    );
  }

  if (missionId === 'ticket_talk_challenge') {
    return (
      <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
        <rect width="64" height="64" rx="16" fill="#7C3AED" />
        <rect x="10" y="18" width="44" height="28" rx="6" fill="#FFFDF8" />
        <circle cx="10" cy="32" r="4" fill="#7C3AED" />
        <circle cx="54" cy="32" r="4" fill="#7C3AED" />
        <line x1="25" y1="21" x2="25" y2="43" stroke="#C4B5FD" strokeWidth="2" strokeDasharray="3 3" />
        <rect x="30" y="25" width="18" height="4" rx="2" fill="#0EA5E9" />
        <rect x="30" y="33" width="13" height="4" rx="2" fill="#F59E0B" />
        <circle cx="18" cy="32" r="4" fill="#8B5CF6" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <rect width="64" height="64" rx="16" fill="#0D9488" />
      <circle cx="32" cy="32" r="18" fill="#FFFFFF" />
      <circle cx="32" cy="32" r="9" fill="#0D9488" />
      <path d="M28 14 H36 V23 H28 Z M28 41 H36 V50 H28 Z M14 28 H23 V36 H14 Z M41 28 H50 V36 H41 Z" fill="#F97316" />
      <circle cx="48" cy="17" r="7" fill="#FBBF24" />
      <path d="M45 17 H51 M48 14 V20" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function SydneyRoutePuzzleMapSVG({
  language,
  isNight,
  selectedPinId,
  highlightedPathPoints,
  interactivePins,
  onSelectPin,
}: {
  language: AppLanguage;
  isNight: boolean;
  selectedPinId: SydneyMiniMapPinId | null;
  highlightedPathPoints: string | null;
  interactivePins: boolean;
  onSelectPin: (pinId: SydneyMiniMapPinId) => void;
}) {
  return (
    <div
      className={`rounded-2xl border p-3 ${
        isNight ? 'border-[#38BDF8]/30 bg-[#0C1930]' : 'border-[#BAE6FD] bg-[#F0F9FF]'
      }`}
    >
      <div className="mb-2 flex items-center justify-between text-[11px] font-bold">
        <span className={isNight ? 'text-[#BAE6FD]' : 'text-[#0369A1]'}>
          {language === 'th'
            ? 'แผนที่จำลองย่านอ่าวซิดนีย์ · แตะจุดหมาย A, B, C หรือ D'
            : 'Sydney Harbour Route Map · Tap Pin A, B, C, or D'}
        </span>
        <span className="text-[#10B981]">
          {language === 'th' ? 'จุดเริ่มต้น: City Transit' : 'Start: City Transit'}
        </span>
      </div>

      <svg
        viewBox="0 0 340 202"
        className="w-full h-auto rounded-xl border border-black/10"
        role="img"
        aria-label={
          language === 'th'
            ? 'แผนที่เส้นทางจำลองรอบสถานี City Transit ซิดนีย์'
            : 'Sydney interactive street direction map around City Transit Station'
        }
      >
        {/* Map Ground */}
        <rect
          width="340"
          height="202"
          fill={isNight ? '#11223F' : '#F8FAFC'}
        />
        {/* Sydney Harbour Water Top Strip */}
        <path
          d="M0 0 H340 V28 Q265 34 170 28 Q85 22 0 28 Z"
          fill={isNight ? '#0C4A6E' : '#0EA5E9'}
        />
        <text
          x="170"
          y="18"
          textAnchor="middle"
          fontSize="10"
          fontWeight="700"
          fill="#FFFFFF"
        >
          {language === 'th' ? 'อ่าวซิดนีย์ (Sydney Harbour Waterfront)' : 'Sydney Harbour Waterfront'}
        </text>

        {/* Harbour Gardens Park Area (bottom-left) */}
        <rect
          x="18"
          y="126"
          width="112"
          height="58"
          rx="10"
          fill={isNight ? '#064E3B' : '#DCFCE7'}
          stroke={isNight ? '#10B981' : '#86EFAC'}
        />
        <text
          x="44"
          y="174"
          fontSize="8.5"
          fontWeight="700"
          fill={isNight ? '#A7F3D0' : '#166534'}
        >
          {language === 'th' ? 'สวนริมอ่าว' : 'Green Park'}
        </text>

        {/* Tram Kiosk & Bookshop Blocks */}
        <rect
          x="36"
          y="54"
          width="74"
          height="24"
          rx="5"
          fill={isNight ? '#1E293B' : '#E2E8F0'}
        />
        <text
          x="73"
          y="69"
          textAnchor="middle"
          fontSize="8.5"
          fontWeight="700"
          fill={isNight ? '#CBD5E1' : '#334155'}
        >
          {language === 'th' ? 'ร้านหนังสือมุมถนน' : 'Bookshop Corner'}
        </text>

        <rect
          x="194"
          y="78"
          width="66"
          height="22"
          rx="5"
          fill={isNight ? '#1E293B' : '#E2E8F0'}
        />
        <text
          x="227"
          y="92"
          textAnchor="middle"
          fontSize="8.5"
          fontWeight="700"
          fill={isNight ? '#CBD5E1' : '#334155'}
        >
          {language === 'th' ? 'ป้ายรถราง' : 'Tram Kiosk'}
        </text>

        {/* City Streets Grid */}
        <path
          d="M170 184 V44 M38 44 H304 M38 92 H304 M38 120 H304 M82 146 H170"
          stroke={isNight ? '#334155' : '#CBD5E1'}
          strokeWidth="12"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <path
          d="M170 184 V44 M38 44 H304 M38 92 H304 M38 120 H304 M82 146 H170"
          stroke={isNight ? '#475569' : '#FFFFFF'}
          strokeWidth="2"
          strokeDasharray="6 5"
          fill="none"
        />

        {/* Fountain Square Centerpiece */}
        <circle
          cx="170"
          cy="92"
          r="14"
          fill={isNight ? '#0369A1' : '#BAE6FD'}
          stroke="#0EA5E9"
          strokeWidth="2"
        />
        <text
          x="170"
          y="73"
          textAnchor="middle"
          fontSize="8.5"
          fontWeight="800"
          fill={isNight ? '#E0F2FE' : '#0369A1'}
        >
          {language === 'th' ? 'ลานน้ำพุ' : 'Fountain Sq'}
        </text>

        {/* Highlighted Route Trace when resolved */}
        {highlightedPathPoints && (
          <polyline
            points={highlightedPathPoints}
            fill="none"
            stroke="#F59E0B"
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="6 4"
          />
        )}

        {/* Start Marker: City Transit Station */}
        <g transform="translate(170, 176)">
          <rect
            x="-42"
            y="-12"
            width="84"
            height="22"
            rx="7"
            fill="#1D4ED8"
            stroke="#FFFFFF"
            strokeWidth="1.5"
          />
          <text
            x="0"
            y="2.5"
            textAnchor="middle"
            fontSize="8.5"
            fontWeight="800"
            fill="#FFFFFF"
          >
            {language === 'th' ? '★ คุณอยู่ที่นี่ (Transit)' : '★ YOU · City Transit'}
          </text>
        </g>

        {/* Clickable Pins A, B, C, D */}
        {DIRECTION_DECODER_PINS.map((pin) => {
          const isSelected = selectedPinId === pin.id;
          return (
            <g
              key={pin.id}
              transform={`translate(${pin.x}, ${pin.y})`}
              onClick={() => {
                if (interactivePins) onSelectPin(pin.id);
              }}
              onKeyDown={(e) => {
                if (!interactivePins) return;
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectPin(pin.id);
                }
              }}
              tabIndex={interactivePins ? 0 : -1}
              role={interactivePins ? 'button' : undefined}
              aria-label={`Pin ${pin.code}: ${pin.label[language]}`}
              className={interactivePins ? 'cursor-pointer focus:outline-none' : undefined}
            >
              {isSelected && (
                <circle r="19" fill="none" stroke="#F59E0B" strokeWidth="3" />
              )}
              <circle
                r="13.5"
                fill={pin.color}
                stroke="#FFFFFF"
                strokeWidth="2.5"
              />
              <text
                x="0"
                y="4"
                textAnchor="middle"
                fontSize="11.5"
                fontWeight="900"
                fill="#FFFFFF"
              >
                {pin.code}
              </text>
              <rect
                x="-44"
                y="16"
                width="88"
                height="15"
                rx="4"
                fill={isNight ? '#0F172A' : '#FFFFFF'}
                stroke={pin.color}
                strokeWidth="1"
              />
              <text
                x="0"
                y="26.5"
                textAnchor="middle"
                fontSize="8.5"
                fontWeight="700"
                fill={isNight ? '#F8FAFC' : '#0F172A'}
              >
                {pin.label[language]}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export function CafeItemIconSVG({
  kind,
  className = 'h-10 w-10',
}: {
  kind: 'wrap' | 'smoothie' | 'banana_bread' | 'flat_white' | 'takeaway_bag' | 'receipt_stamp';
  className?: string;
}) {
  if (kind === 'wrap') {
    return (
      <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
        <rect width="48" height="48" rx="12" fill="#ECFDF5" />
        <ellipse cx="24" cy="25" rx="15" ry="9" transform="rotate(-18 24 25)" fill="#FDE68A" stroke="#D97706" strokeWidth="2" />
        <circle cx="18" cy="24" r="3" fill="#10B981" />
        <circle cx="25" cy="22" r="2.8" fill="#EF4444" />
        <circle cx="30" cy="24" r="2.5" fill="#22C55E" />
      </svg>
    );
  }
  if (kind === 'smoothie') {
    return (
      <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
        <rect width="48" height="48" rx="12" fill="#FDF2F8" />
        <path d="M16 17 H32 L29 40 H19 Z" fill="#EC4899" stroke="#BE185D" strokeWidth="2" />
        <ellipse cx="24" cy="17" rx="8" ry="2.5" fill="#FCE7F3" />
        <line x1="27" y1="8" x2="24" y2="21" stroke="#0EA5E9" strokeWidth="3" strokeLinecap="round" />
      </svg>
    );
  }
  if (kind === 'banana_bread') {
    return (
      <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
        <rect width="48" height="48" rx="12" fill="#FFFBEB" />
        <path d="M12 36 L14 21 C14 14 34 14 34 21 L36 36 Z" fill="#D97706" />
        <path d="M15 34 L17 22 C17 17 31 17 31 22 L33 34 Z" fill="#FBBF24" />
        <circle cx="22" cy="25" r="1.5" fill="#92400E" />
        <circle cx="27" cy="28" r="1.5" fill="#92400E" />
      </svg>
    );
  }
  if (kind === 'flat_white') {
    return (
      <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
        <rect width="48" height="48" rx="12" fill="#FFF7ED" />
        <rect x="13" y="18" width="18" height="17" rx="4" fill="#B45309" />
        <path d="M31 21 H36 C38 21 38 30 36 30 H31" stroke="#B45309" strokeWidth="2.5" fill="none" />
        <ellipse cx="22" cy="19" rx="7" ry="2.5" fill="#FFFBEB" />
        <ellipse cx="22" cy="38" rx="12" ry="2.5" fill="#FDE68A" />
      </svg>
    );
  }
  if (kind === 'takeaway_bag') {
    return (
      <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
        <rect width="48" height="48" rx="12" fill="#EFF6FF" />
        <path d="M19 16 C19 10 29 10 29 16" stroke="#2563EB" strokeWidth="2.5" fill="none" />
        <rect x="14" y="16" width="20" height="22" rx="4" fill="#F59E0B" />
        <rect x="18" y="23" width="12" height="5" rx="2" fill="#FFFBEB" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <rect width="48" height="48" rx="12" fill="#ECFDF5" />
      <rect x="14" y="10" width="20" height="28" rx="3" fill="#FFFFFF" stroke="#10B981" strokeWidth="2" />
      <line x1="18" y1="18" x2="30" y2="18" stroke="#64748B" strokeWidth="2" />
      <line x1="18" y1="24" x2="28" y2="24" stroke="#64748B" strokeWidth="2" />
      <circle cx="29" cy="31" r="4" fill="#10B981" />
    </svg>
  );
}
