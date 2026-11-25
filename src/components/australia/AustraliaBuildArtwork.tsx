import { useState } from 'react';
import type { AppLanguage } from '../../types/game';
import type { AustraliaLandmarkId } from '../../data/australiaWorld';
import {
  DARLING_HARBOUR_BUILD_BOARD,
  HARBOUR_CAFE_BUILD_MENU,
  type AustraliaBuildMissionId,
  type CafeBuildMenuItem,
  type DirectionRouteNodeId,
} from '../../data/australiaBuild';
import starterForgeImg from '../../assets/images/aus_starter_forge_1795336697037.jpg';
import transitArchitectImg from '../../assets/images/aus_transit_architect_1795336697439.jpg';
import cafeKitchenImg from '../../assets/images/aus_cafe_kitchen_1795336697418.jpg';
import ticketHubImg from '../../assets/images/aus_ticket_hub_1795336698885.jpg';
import dialogueRescueImg from '../../assets/images/aus_dialogue_rescue_1795336698474.jpg';

const BUILD_BANNER_IMAGES: Record<AustraliaLandmarkId, string> = {
  circular_quay_plaza: starterForgeImg,
  city_transit_station: transitArchitectImg,
  harbour_market_cafe: cafeKitchenImg,
  darling_harbour_hub: ticketHubImg,
  harbour_gardens_help_point: dialogueRescueImg,
};

export function AustraliaBuildEmblemSVG({
  missionId,
  className = 'h-12 w-12',
}: {
  missionId: AustraliaBuildMissionId;
  className?: string;
}) {
  if (missionId === 'conversation_starter_forge') {
    return (
      <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
        <rect width="64" height="64" rx="16" fill="#0284C7" />
        <rect x="10" y="13" width="32" height="12" rx="6" fill="#FFFFFF" />
        <rect x="22" y="29" width="32" height="12" rx="6" fill="#BAE6FD" />
        <rect x="10" y="45" width="28" height="8" rx="4" fill="#FDE68A" />
        <circle cx="48" cy="19" r="5" fill="#10B981" />
        <path d="M45.5 19 L47.5 21 L51 17" stroke="#FFFFFF" strokeWidth="2" fill="none" strokeLinecap="round" />
      </svg>
    );
  }

  if (missionId === 'direction_dialogue_architect') {
    return (
      <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
        <rect width="64" height="64" rx="16" fill="#1D4ED8" />
        <rect x="10" y="14" width="44" height="36" rx="8" fill="#0F172A" opacity="0.25" />
        <path d="M16 46 H30 V24 H48" stroke="#FBBF24" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <circle cx="16" cy="46" r="5" fill="#10B981" stroke="#FFFFFF" strokeWidth="2" />
        <circle cx="48" cy="24" r="5" fill="#F97316" stroke="#FFFFFF" strokeWidth="2" />
      </svg>
    );
  }

  if (missionId === 'cafe_conversation_kitchen') {
    return (
      <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
        <rect width="64" height="64" rx="16" fill="#EA580C" />
        <rect x="10" y="42" width="44" height="10" rx="5" fill="#FDE68A" />
        <rect x="18" y="22" width="18" height="20" rx="4" fill="#FFFFFF" />
        <path d="M36 26 H41 C44 26 44 34 41 34 H36" stroke="#FFFFFF" strokeWidth="3" fill="none" />
        <path d="M22 18 Q24 13 22 10 M29 18 Q31 13 29 10" stroke="#FED7AA" strokeWidth="2" fill="none" strokeLinecap="round" />
      </svg>
    );
  }

  if (missionId === 'ticket_information_builder') {
    return (
      <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
        <rect width="64" height="64" rx="16" fill="#7C3AED" />
        <rect x="12" y="14" width="40" height="36" rx="7" fill="#FFFDF8" />
        <rect x="17" y="20" width="30" height="6" rx="3" fill="#0EA5E9" />
        <rect x="17" y="30" width="18" height="5" rx="2.5" fill="#F59E0B" />
        <rect x="17" y="39" width="24" height="5" rx="2.5" fill="#10B981" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <rect width="64" height="64" rx="16" fill="#0D9488" />
      <circle cx="32" cy="32" r="18" fill="#FFFFFF" />
      <circle cx="32" cy="32" r="8" fill="#0D9488" />
      <path d="M28 14 H36 V22 H28 Z M28 42 H36 V50 H28 Z M14 28 H22 V36 H14 Z M42 28 H50 V36 H42 Z" fill="#F97316" />
    </svg>
  );
}

export function AustraliaBuildBannerArt({
  landmarkId,
  missionId,
  title,
  isNight,
}: {
  landmarkId: AustraliaLandmarkId;
  missionId: AustraliaBuildMissionId;
  title: string;
  isNight: boolean;
}) {
  const [imageFailed, setImageFailed] = useState(false);
  const src = BUILD_BANNER_IMAGES[landmarkId];

  if (imageFailed) {
    return (
      <div
        className={`flex items-center gap-3 rounded-2xl border p-3 ${
          isNight
            ? 'border-[#38BDF8]/30 bg-[#13254A]'
            : 'border-[#BAE6FD] bg-gradient-to-r from-[#E0F2FE] to-[#F0F9FF]'
        }`}
      >
        <AustraliaBuildEmblemSVG missionId={missionId} className="h-12 w-12 shrink-0" />
        <p className="font-display text-sm font-extrabold">{title}</p>
      </div>
    );
  }

  return (
    <div className="relative h-24 sm:h-28 w-full overflow-hidden rounded-2xl border border-black/10 dark:border-white/15">
      <img
        src={src}
        alt={title}
        referrerPolicy="no-referrer"
        onError={() => setImageFailed(true)}
        className="h-full w-full object-cover"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#081229]/85 via-[#081229]/25 to-transparent" />
      <div className="pointer-events-none absolute inset-x-3 bottom-2.5 flex items-center justify-between gap-2">
        <p className="font-display text-xs sm:text-sm font-extrabold text-white drop-shadow">
          {title}
        </p>
      </div>
    </div>
  );
}

const ROUTE_NODES: {
  id: DirectionRouteNodeId;
  x: number;
  y: number;
  code: string;
  label: { en: string; th: string };
  fill: string;
}[] = [
  {
    id: 'node_transit',
    x: 56,
    y: 144,
    code: '1',
    label: { en: 'City Transit', th: 'สถานีซิตี้' },
    fill: '#0EA5E9',
  },
  {
    id: 'node_left_corner',
    x: 132,
    y: 144,
    code: '2',
    label: { en: 'Turn Left', th: 'แยกเลี้ยวซ้าย' },
    fill: '#F59E0B',
  },
  {
    id: 'node_harbour_path',
    x: 200,
    y: 76,
    code: '3',
    label: { en: 'Harbour Path', th: 'ทางเดินริมอ่าว' },
    fill: '#10B981',
  },
  {
    id: 'node_ferry_quay',
    x: 266,
    y: 76,
    code: '4',
    label: { en: 'Circular Quay', th: 'เซอร์คิวลาร์คีย์' },
    fill: '#6366F1',
  },
  {
    id: 'node_gardens_gate',
    x: 80,
    y: 44,
    code: '5',
    label: { en: 'Gardens Gate', th: 'ประตูสวนริมอ่าว' },
    fill: '#14B8A6',
  },
];

export function DirectionRouteDiagramSVG({
  language,
  isNight,
  selectedNodeId,
  activePathPoints,
  interactive,
  onSelectNode,
}: {
  language: AppLanguage;
  isNight: boolean;
  selectedNodeId: DirectionRouteNodeId | null;
  activePathPoints: string | null;
  interactive: boolean;
  onSelectNode: (nodeId: DirectionRouteNodeId) => void;
}) {
  return (
    <div
      className={`rounded-2xl border p-3 ${
        isNight ? 'border-[#38BDF8]/30 bg-[#0D1A33]' : 'border-[#BAE6FD] bg-[#F0F9FF]'
      }`}
    >
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-[11px] font-bold">
        <span className={isNight ? 'text-[#BAE6FD]' : 'text-[#0369A1]'}>
          {language === 'th'
            ? 'แผนผังเส้นทางซิดนีย์ · แตะจุดที่ตรงกับบทสนทนา (1–5)'
            : 'Sydney Route Diagram · Tap matching landmark pin (1–5)'}
        </span>
        <span className="text-[#10B981]">
          {language === 'th' ? 'จุดเริ่ม: 1 City Transit' : 'Start: 1 City Transit'}
        </span>
      </div>

      <svg
        viewBox="0 0 340 202"
        className="w-full h-auto rounded-xl border border-black/10"
        role="img"
        aria-label={
          language === 'th'
            ? 'แผนผังเส้นทางถามทางซิดนีย์สำหรับเลือกหมุดจุดหมาย'
            : 'Sydney interactive direction confirmation diagram with five route nodes'
        }
      >
        <rect width="340" height="202" fill={isNight ? '#11223F' : '#F8FAFC'} />
        <path
          d="M0 0 H340 V26 Q255 32 170 26 Q85 20 0 26 Z"
          fill={isNight ? '#0C4A6E' : '#0EA5E9'}
        />
        <text
          x="170"
          y="17"
          textAnchor="middle"
          fontSize="9.5"
          fontWeight="700"
          fill="#FFFFFF"
        >
          Sydney Harbour Waterfront
        </text>

        {/* Harbour Gardens Green Zone */}
        <rect
          x="16"
          y="34"
          width="96"
          height="52"
          rx="10"
          fill={isNight ? '#064E3B' : '#DCFCE7'}
          stroke={isNight ? '#10B981' : '#86EFAC'}
        />

        {/* Road & Path Network */}
        <path
          d="M56 144 H132 V76 H266 M132 76 L80 44"
          stroke={isNight ? '#334155' : '#CBD5E1'}
          strokeWidth="12"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* Active Dotted Highlighted Route */}
        {activePathPoints && (
          <polyline
            points={activePathPoints}
            stroke="#F59E0B"
            strokeWidth="4"
            strokeDasharray="6 5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        )}

        {/* Interactive Nodes */}
        {ROUTE_NODES.map((node) => {
          const isSelected = selectedNodeId === node.id;
          return (
            <g
              key={node.id}
              onClick={() => interactive && onSelectNode(node.id)}
              style={{ cursor: interactive ? 'pointer' : 'default' }}
            >
              {isSelected && (
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="19"
                  fill="none"
                  stroke="#F59E0B"
                  strokeWidth="3"
                />
              )}
              <circle
                cx={node.x}
                cy={node.y}
                r="13"
                fill={node.fill}
                stroke="#FFFFFF"
                strokeWidth="2.5"
              />
              <text
                x={node.x}
                y={node.y + 4}
                textAnchor="middle"
                fontSize="10.5"
                fontWeight="800"
                fill="#FFFFFF"
              >
                {node.code}
              </text>
              <rect
                x={node.x - 38}
                y={node.y + 16}
                width="76"
                height="16"
                rx="4"
                fill={isNight ? '#0F172A' : '#FFFFFF'}
                stroke={isSelected ? '#F59E0B' : isNight ? '#334155' : '#CBD5E1'}
              />
              <text
                x={node.x}
                y={node.y + 27}
                textAnchor="middle"
                fontSize="8.3"
                fontWeight="700"
                fill={isNight ? '#F8FAFC' : '#1E2E46'}
              >
                {node.label[language]}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Accessible Keyboard Tap Strip matching the SVG Pins */}
      <div className="mt-2.5 grid grid-cols-2 sm:grid-cols-5 gap-1.5">
        {ROUTE_NODES.map((node) => {
          const active = selectedNodeId === node.id;
          return (
            <button
              key={node.id}
              type="button"
              disabled={!interactive}
              onClick={() => onSelectNode(node.id)}
              className={`min-h-[40px] rounded-xl border px-2 py-1.5 text-[11px] font-extrabold transition-colors cursor-pointer disabled:opacity-75 ${
                active
                  ? 'border-[#F59E0B] bg-[#F59E0B] text-[#1E293B]'
                  : isNight
                    ? 'border-white/15 bg-[#162544] text-[#E2E8F0] hover:bg-[#1E325B]'
                    : 'border-[#CBD5E1] bg-white text-[#1E2E46] hover:bg-[#F1F5F9]'
              }`}
            >
              {node.code}. {node.label[language]}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function CafeBuildMenuIconSVG({
  itemId,
  className = 'h-7 w-7',
}: {
  itemId: CafeBuildMenuItem['id'];
  className?: string;
}) {
  switch (itemId) {
    case 'chicken_sandwich':
      return (
        <svg viewBox="0 0 36 36" className={className} aria-hidden="true">
          <rect width="36" height="36" rx="9" fill="#FEF3C7" />
          <path d="M7 22 L18 11 L29 22 Z" fill="#F59E0B" />
          <rect x="8" y="21" width="20" height="4" rx="2" fill="#10B981" />
          <rect x="7" y="24" width="22" height="4" rx="2" fill="#D97706" />
        </svg>
      );
    case 'avocado_toast':
      return (
        <svg viewBox="0 0 36 36" className={className} aria-hidden="true">
          <rect width="36" height="36" rx="9" fill="#DCFCE7" />
          <rect x="7" y="13" width="22" height="15" rx="5" fill="#B45309" />
          <rect x="10" y="15" width="16" height="9" rx="4" fill="#22C55E" />
          <circle cx="18" cy="19.5" r="2.5" fill="#78350F" />
        </svg>
      );
    case 'orange_juice':
      return (
        <svg viewBox="0 0 36 36" className={className} aria-hidden="true">
          <rect width="36" height="36" rx="9" fill="#FFEDD5" />
          <path d="M12 12 H24 L22 28 H14 Z" fill="#F97316" />
          <line x1="20" y1="8" x2="18" y2="16" stroke="#0EA5E9" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      );
    case 'flat_white':
      return (
        <svg viewBox="0 0 36 36" className={className} aria-hidden="true">
          <rect width="36" height="36" rx="9" fill="#F1F5F9" />
          <rect x="10" y="12" width="14" height="14" rx="3" fill="#78350F" />
          <path d="M24 15 H27 C29 15 29 21 27 21 H24" stroke="#78350F" strokeWidth="2" fill="none" />
          <ellipse cx="17" cy="14" rx="5" ry="2" fill="#FFFDF8" />
        </svg>
      );
    case 'banana_bread':
      return (
        <svg viewBox="0 0 36 36" className={className} aria-hidden="true">
          <rect width="36" height="36" rx="9" fill="#FEF3C7" />
          <path d="M9 26 V16 C9 12 27 12 27 16 V26 Z" fill="#B45309" />
          <circle cx="15" cy="19" r="1.7" fill="#FDE68A" />
          <circle cx="21" cy="21" r="1.7" fill="#FDE68A" />
        </svg>
      );
    case 'berry_smoothie':
      return (
        <svg viewBox="0 0 36 36" className={className} aria-hidden="true">
          <rect width="36" height="36" rx="9" fill="#FCE7F3" />
          <path d="M12 13 H24 L22 28 H14 Z" fill="#DB2777" />
          <circle cx="18" cy="12" r="3" fill="#F472B6" />
        </svg>
      );
  }
}

export function CafeOrderTrayCard({
  language,
  isNight,
  trayItemIds,
}: {
  language: AppLanguage;
  isNight: boolean;
  trayItemIds: CafeBuildMenuItem['id'][];
}) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {/* Fictional Menu Reference */}
      <div
        className={`rounded-2xl border p-3 ${
          isNight ? 'border-white/12 bg-[#121F3B]' : 'border-[#FED7AA] bg-[#FFF7ED]'
        }`}
      >
        <p className="text-[11px] font-extrabold text-[#EA580C]">
          {language === 'th' ? 'เมนูจำลอง Harbour Market Café' : 'Harbour Café Practice Menu'}
        </p>
        <div className="mt-2 grid grid-cols-2 gap-1.5">
          {HARBOUR_CAFE_BUILD_MENU.map((item) => (
            <div
              key={item.id}
              className={`flex items-center gap-2 rounded-xl border p-1.5 ${
                isNight ? 'border-white/10 bg-[#18294A]' : 'border-[#FDBA74]/50 bg-white'
              }`}
            >
              <CafeBuildMenuIconSVG itemId={item.id} className="h-7 w-7 shrink-0" />
              <div className="min-w-0">
                <p className="text-[11px] font-bold truncate">{item.name[language]}</p>
                <p className="text-[10px] font-mono-num text-[#EA580C] font-bold">
                  {item.priceText}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Live Assembled Order Tray */}
      <div
        className={`rounded-2xl border p-3 ${
          isNight ? 'border-[#38BDF8]/30 bg-[#10203E]' : 'border-[#BAE6FD] bg-[#F0F9FF]'
        }`}
      >
        <div className="flex items-center justify-between gap-2">
          <p className="text-[11px] font-extrabold text-[#0EA5E9]">
            {language === 'th' ? 'ถาดออเดอร์ของคุณ' : 'Your Live Order Tray'}
          </p>
          <span className="font-mono-num text-[11px] font-bold opacity-80">
            {trayItemIds.length}
          </span>
        </div>

        {trayItemIds.length === 0 ? (
          <p className={`mt-3 text-xs ${isNight ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
            {language === 'th'
              ? 'เลือกรายการอาหารหรือเครื่องดื่มในบทสนทนา แล้วรายการจะมาวางบนถาดนี้'
              : 'Pick your polite order lines below to place items onto your tray.'}
          </p>
        ) : (
          <div className="mt-2 flex flex-wrap gap-2">
            {trayItemIds.map((id, idx) => {
              const meta = HARBOUR_CAFE_BUILD_MENU.find((m) => m.id === id);
              if (!meta) return null;
              return (
                <div
                  key={`${id}_${idx}`}
                  className={`inline-flex items-center gap-1.5 rounded-xl border px-2 py-1 text-xs font-bold ${
                    isNight
                      ? 'border-[#10B981]/40 bg-[#0D2B24] text-[#A7F3D0]'
                      : 'border-[#A7F3D0] bg-[#ECFDF5] text-[#065F46]'
                  }`}
                >
                  <CafeBuildMenuIconSVG itemId={id} className="h-5 w-5" />
                  <span>{meta.name[language]}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export function DarlingHarbourInfoBoardCard({
  language,
  isNight,
  activeTab,
  onTabChange,
}: {
  language: AppLanguage;
  isNight: boolean;
  activeTab: 'schedules' | 'tickets' | 'booking';
  onTabChange: (tab: 'schedules' | 'tickets' | 'booking') => void;
}) {
  const tabs: { id: 'schedules' | 'tickets' | 'booking'; label: { en: string; th: string } }[] = [
    { id: 'schedules', label: { en: 'Times', th: 'ตารางเวลา' } },
    { id: 'tickets', label: { en: 'Prices', th: 'ค่าบัตรตัวอย่าง' } },
    { id: 'booking', label: { en: 'Tips & Booking', th: 'การจองและแนะนำ' } },
  ];

  const rows = DARLING_HARBOUR_BUILD_BOARD.filter((r) => r.tab === activeTab);

  return (
    <div
      className={`rounded-2xl border p-3.5 ${
        isNight ? 'border-[#38BDF8]/30 bg-[#10203E]' : 'border-[#CBD5E1] bg-[#F8FAFC]'
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-[11px] font-extrabold text-[#7C3AED] dark:text-[#C4B5FD]">
          {language === 'th'
            ? 'กระดานข้อมูลจำลอง Darling Harbour (ฝึกสร้างคำถาม)'
            : 'Darling Harbour Sample Board (Practice Info Only)'}
        </p>

        <div className="flex flex-wrap gap-1.5">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`min-h-[34px] rounded-lg px-2.5 py-1 text-[11px] font-extrabold cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#7C3AED] text-white'
                  : isNight
                    ? 'bg-white/10 text-[#CBD5E1] hover:bg-white/15'
                    : 'bg-white text-[#334155] border border-[#CBD5E1]'
              }`}
            >
              {tab.label[language]}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-2.5 grid gap-2 sm:grid-cols-2">
        {rows.map((row) => (
          <div
            key={row.itemTitle.en}
            className={`rounded-xl border p-2.5 ${
              isNight ? 'border-white/10 bg-[#162544]' : 'border-[#E2E8F0] bg-white'
            }`}
          >
            <p className="text-xs font-extrabold">{row.itemTitle[language]}</p>
            <p className={`mt-0.5 text-xs ${isNight ? 'text-[#CBD5E1]' : 'text-[#475569]'}`}>
              {row.detailLine[language]}
            </p>
            <p className="mt-1 text-[10px] font-bold opacity-75">
              {row.fictionalTag[language]}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function RepairSignalProgressCard({
  language,
  isNight,
  problemPicked,
  tilesCount,
  followUpPicked,
}: {
  language: AppLanguage;
  isNight: boolean;
  problemPicked: boolean;
  tilesCount: number;
  followUpPicked: boolean;
}) {
  const steps = [
    {
      done: problemPicked,
      label: language === 'th' ? '1. ระบุปัญหา' : '1. Identify',
    },
    {
      done: tilesCount > 0,
      label: language === 'th' ? '2. ต่อประโยคแก้ไข' : '2. Build Repair',
    },
    {
      done: followUpPicked,
      label: language === 'th' ? '3. ตอบรับสุภาพ' : '3. Follow-Up',
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-2">
      {steps.map((s) => (
        <div
          key={s.label}
          className={`rounded-xl border px-2.5 py-2 text-center text-[11px] font-extrabold ${
            s.done
              ? isNight
                ? 'border-[#10B981]/50 bg-[#0D2B24] text-[#A7F3D0]'
                : 'border-[#10B981] bg-[#ECFDF5] text-[#065F46]'
              : isNight
                ? 'border-white/10 bg-[#152344] text-[#94A3B8]'
                : 'border-[#E2E8F0] bg-[#F8FAFC] text-[#64748B]'
          }`}
        >
          {s.label}
        </div>
      ))}
    </div>
  );
}
