import { useState } from 'react';
import type { AppLanguage } from '../../types/game';
import type { AustraliaLandmarkId } from '../../data/australiaWorld';
import starterForgeImg from '../../assets/images/aus_starter_forge_1795336697037.jpg';
import transitArchitectImg from '../../assets/images/aus_transit_architect_1795336697439.jpg';
import cafeKitchenImg from '../../assets/images/aus_cafe_kitchen_1795336697418.jpg';
import ticketHubImg from '../../assets/images/aus_ticket_hub_1795336698885.jpg';
import dialogueRescueImg from '../../assets/images/aus_dialogue_rescue_1795336698474.jpg';
import sydneyHeroImg from '../../assets/images/world_australia_sydney_1795065329488.jpg';
import egyptHeroImg from '../../assets/images/egypt_day_expedition_1795070978060.jpg';
import { AustraliaLandmarkBadgeSVG } from './AustraliaSvgArtwork';

export const AUSTRALIA_LANDMARK_SCENE_IMAGES: Record<AustraliaLandmarkId, string> = {
  circular_quay_plaza: starterForgeImg,
  city_transit_station: transitArchitectImg,
  harbour_market_cafe: cafeKitchenImg,
  darling_harbour_hub: ticketHubImg,
  harbour_gardens_help_point: dialogueRescueImg,
};

export const SYDNEY_CELEBRATION_HERO_IMAGE = sydneyHeroImg;
export const EGYPT_PREVIEW_HERO_IMAGE = egyptHeroImg;

export type AustraliaContextPropId =
  | 'tourist_brochure'
  | 'sydney_visitor_map'
  | 'ferry_ticket'
  | 'train_ticket'
  | 'direction_sign'
  | 'sandwich'
  | 'salad'
  | 'orange_juice'
  | 'cafe_menu'
  | 'attraction_ticket'
  | 'visitor_info_board'
  | 'garden_signpost'
  | 'ambassador_emblem';

export function AustraliaSceneHeroBanner({
  landmarkId,
  title,
  subtitle,
  badgeLabel,
  accentColor = '#168FE5',
  isNight,
  compact = false,
}: {
  landmarkId: AustraliaLandmarkId;
  title: string;
  subtitle?: string;
  badgeLabel?: string;
  accentColor?: string;
  isNight: boolean;
  compact?: boolean;
}) {
  const [imageFailed, setImageFailed] = useState(false);
  const src = AUSTRALIA_LANDMARK_SCENE_IMAGES[landmarkId];

  if (imageFailed) {
    return (
      <div
        className={`flex items-center gap-3.5 rounded-2xl border p-3.5 ${
          isNight
            ? 'border-[#38BDF8]/35 bg-[#13254A]'
            : 'border-[#BAE6FD] bg-gradient-to-r from-[#E0F2FE] via-[#F0F9FF] to-[#ECFDF5]'
        }`}
      >
        <AustraliaLandmarkBadgeSVG
          landmarkId={landmarkId}
          className="h-14 w-20 shrink-0 rounded-xl shadow-sm"
        />
        <div className="min-w-0">
          {badgeLabel && (
            <span
              className="inline-block rounded-md px-2 py-0.5 text-[10px] font-extrabold text-white"
              style={{ backgroundColor: accentColor }}
            >
              {badgeLabel}
            </span>
          )}
          <p className="mt-1 font-display text-sm font-extrabold truncate">{title}</p>
          {subtitle && (
            <p className={`text-xs truncate ${isNight ? 'text-[#CBD5E1]' : 'text-[#475569]'}`}>
              {subtitle}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative w-full overflow-hidden rounded-2xl border shadow-md ${
        compact ? 'h-24 sm:h-28' : 'h-28 sm:h-36'
      } ${isNight ? 'border-[#38BDF8]/40' : 'border-[#168FE5]/25'}`}
    >
      <img
        src={src}
        alt={title}
        referrerPolicy="no-referrer"
        onError={() => setImageFailed(true)}
        className="h-full w-full object-cover"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#09162D]/90 via-[#09162D]/40 to-[#09162D]/15" />
      <div className="pointer-events-none absolute inset-x-3.5 bottom-2.5 sm:inset-x-4 sm:bottom-3 flex items-end justify-between gap-3">
        <div className="min-w-0">
          {badgeLabel && (
            <span
              className="inline-flex items-center rounded-md px-2 py-0.5 font-display text-[10px] font-extrabold tracking-wide text-white shadow-sm"
              style={{ backgroundColor: accentColor }}
            >
              {badgeLabel}
            </span>
          )}
          <h3 className="mt-1 font-display text-sm sm:text-base font-extrabold text-white drop-shadow truncate">
            {title}
          </h3>
          {subtitle && (
            <p className="text-[11px] sm:text-xs font-semibold text-[#E0F2FE] drop-shadow truncate">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export function AustraliaContextObjectSVG({
  propId,
  className = 'h-10 w-10',
}: {
  propId: AustraliaContextPropId;
  className?: string;
}) {
  switch (propId) {
    case 'tourist_brochure':
      return (
        <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
          <rect width="64" height="64" rx="14" fill="#E0F2FE" />
          <path d="M12 16 L26 12 V48 L12 52 Z" fill="#168FE5" />
          <path d="M26 12 L40 16 V52 L26 48 Z" fill="#00BFA5" />
          <path d="M40 16 L52 12 V48 L40 52 Z" fill="#FFFDF8" stroke="#168FE5" strokeWidth="1.8" />
          <path d="M43 24 H49 M43 31 H49 M43 38 H47" stroke="#253B80" strokeWidth="2.2" strokeLinecap="round" />
          <circle cx="19" cy="28" r="3.5" fill="#FFCC4D" />
        </svg>
      );
    case 'sydney_visitor_map':
      return (
        <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
          <rect width="64" height="64" rx="14" fill="#DBEAFE" />
          <path d="M10 18 L24 14 L40 18 L54 14 V48 L40 52 L24 48 L10 52 Z" fill="#FFFDF8" stroke="#168FE5" strokeWidth="2" />
          <path d="M10 24 Q24 20 40 25 T54 22" fill="none" stroke="#38BDF8" strokeWidth="4" />
          <path d="M18 42 L28 32 L38 38 L46 28" fill="none" stroke="#FF795E" strokeWidth="2.5" strokeDasharray="3 2.5" strokeLinecap="round" />
          <circle cx="46" cy="28" r="4" fill="#FF795E" />
          <circle cx="18" cy="42" r="3.5" fill="#00BFA5" />
        </svg>
      );
    case 'ferry_ticket':
      return (
        <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
          <rect width="64" height="64" rx="14" fill="#E0F2FE" />
          <rect x="8" y="18" width="48" height="28" rx="6" fill="#168FE5" />
          <rect x="13" y="23" width="38" height="18" rx="3" fill="#FFFDF8" />
          <path d="M18 35 H42 L46 31 H21 Z" fill="#00BFA5" />
          <path d="M24 31 V26 H35 L38 31 Z" fill="#253B80" />
          <path d="M16 38 Q32 35 48 38" fill="none" stroke="#168FE5" strokeWidth="1.8" />
        </svg>
      );
    case 'train_ticket':
      return (
        <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
          <rect width="64" height="64" rx="14" fill="#FEF3C7" />
          <rect x="10" y="17" width="44" height="30" rx="6" fill="#253B80" />
          <rect x="15" y="22" width="34" height="20" rx="3" fill="#FFFDF8" />
          <rect x="20" y="25" width="24" height="10" rx="3" fill="#168FE5" />
          <circle cx="25" cy="32" r="2" fill="#FFCC4D" />
          <circle cx="39" cy="32" r="2" fill="#FFCC4D" />
          <path d="M22 39 L19 42 M42 39 L45 42" stroke="#253B80" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      );
    case 'direction_sign':
      return (
        <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
          <rect width="64" height="64" rx="14" fill="#ECFEFF" />
          <rect x="30" y="12" width="4" height="42" rx="2" fill="#253B80" />
          <path d="M14 17 H46 L52 22 L46 27 H14 Z" fill="#00BFA5" />
          <path d="M50 31 H18 L12 36 L18 41 H50 Z" fill="#FF795E" />
          <path d="M20 22 H41 M24 36 H44" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case 'sandwich':
      return (
        <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
          <rect width="64" height="64" rx="14" fill="#FFF7ED" />
          <path d="M12 37 L32 17 L52 37 Z" fill="#FFCC4D" stroke="#D97706" strokeWidth="2" />
          <rect x="12" y="36" width="40" height="5" rx="2.5" fill="#10B981" />
          <rect x="13" y="40" width="38" height="4" rx="2" fill="#FF795E" />
          <rect x="11" y="43" width="42" height="6" rx="3" fill="#F59E0B" />
        </svg>
      );
    case 'salad':
      return (
        <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
          <rect width="64" height="64" rx="14" fill="#ECFDF5" />
          <circle cx="24" cy="29" r="9" fill="#10B981" />
          <circle cx="38" cy="28" r="9" fill="#34D399" />
          <circle cx="31" cy="24" r="8" fill="#059669" />
          <circle cx="27" cy="28" r="3" fill="#FF795E" />
          <circle cx="37" cy="29" r="2.8" fill="#FFCC4D" />
          <path d="M13 33 H51 C49 46 42 51 32 51 C22 51 15 46 13 33 Z" fill="#168FE5" />
        </svg>
      );
    case 'orange_juice':
      return (
        <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
          <rect width="64" height="64" rx="14" fill="#FFEDD5" />
          <path d="M21 20 H43 L39 51 H25 Z" fill="#FFFDF8" stroke="#F97316" strokeWidth="2" />
          <path d="M22.5 27 H41.5 L38.5 49 H25.5 Z" fill="#FF9F1C" />
          <line x1="36" y1="11" x2="32" y2="27" stroke="#00BFA5" strokeWidth="3.2" strokeLinecap="round" />
          <circle cx="43" cy="19" r="6" fill="#FF795E" />
        </svg>
      );
    case 'cafe_menu':
      return (
        <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
          <rect width="64" height="64" rx="14" fill="#FFF7ED" />
          <rect x="14" y="11" width="36" height="42" rx="6" fill="#253B80" />
          <rect x="18" y="15" width="28" height="34" rx="3" fill="#FFFDF8" />
          <rect x="22" y="19" width="20" height="5" rx="2.5" fill="#FF795E" />
          <path d="M22 29 H41 M22 35 H41 M22 41 H35" stroke="#253B80" strokeWidth="2.4" strokeLinecap="round" />
        </svg>
      );
    case 'attraction_ticket':
      return (
        <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
          <rect width="64" height="64" rx="14" fill="#EDE9FE" />
          <path d="M10 21 H54 V28 A4 4 0 0 0 54 36 V43 H10 V36 A4 4 0 0 0 10 28 Z" fill="#FFCC4D" />
          <line x1="40" y1="22" x2="40" y2="42" stroke="#253B80" strokeWidth="2" strokeDasharray="3 2" />
          <circle cx="24" cy="32" r="6" fill="#168FE5" />
          <path d="M22 32 L24 34 L27 30" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case 'visitor_info_board':
      return (
        <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
          <rect width="64" height="64" rx="14" fill="#E0F2FE" />
          <rect x="11" y="13" width="42" height="31" rx="5" fill="#253B80" />
          <rect x="15" y="17" width="34" height="23" rx="3" fill="#FFFDF8" />
          <rect x="18" y="20" width="28" height="5" rx="2" fill="#168FE5" />
          <rect x="18" y="28" width="13" height="8" rx="2" fill="#00BFA5" />
          <rect x="33" y="28" width="13" height="8" rx="2" fill="#FFCC4D" />
          <rect x="20" y="44" width="4" height="9" fill="#253B80" />
          <rect x="40" y="44" width="4" height="9" fill="#253B80" />
        </svg>
      );
    case 'garden_signpost':
      return (
        <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
          <rect width="64" height="64" rx="14" fill="#ECFDF5" />
          <rect x="30" y="14" width="4" height="39" rx="2" fill="#78350F" />
          <path d="M14 18 H46 L51 23 L46 28 H14 Z" fill="#00BFA5" />
          <path d="M49 31 H19 L14 36 L19 41 H49 Z" fill="#168FE5" />
          <circle cx="20" cy="49" r="5" fill="#10B981" />
          <circle cx="44" cy="49" r="4.5" fill="#34D399" />
        </svg>
      );
    case 'ambassador_emblem':
      return (
        <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
          <defs>
            <linearGradient id="ambMedalGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FFCC4D" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>
          </defs>
          <rect width="64" height="64" rx="16" fill="#253B80" />
          <path d="M20 42 L16 56 L26 51 L32 56 L38 51 L48 56 L44 42" fill="#00BFA5" />
          <circle cx="32" cy="28" r="18" fill="url(#ambMedalGrad)" stroke="#FFFDF8" strokeWidth="2.5" />
          <circle cx="32" cy="28" r="13" fill="#168FE5" />
          <path d="M22 33 Q32 21 42 33" fill="none" stroke="#FFCC4D" strokeWidth="2.4" strokeLinecap="round" />
          <path d="M25 33 Q28 24 31 33 M31 33 Q34 22 38 33" fill="#FFFFFF" />
          <circle cx="32" cy="18" r="2.2" fill="#FFCC4D" />
        </svg>
      );
  }
}

export function EgyptNextPreviewCard({
  language,
  isNight,
}: {
  language: AppLanguage;
  isNight: boolean;
}) {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <div
      className={`overflow-hidden rounded-2xl border p-3.5 text-left ${
        isNight
          ? 'border-[#F2C66D]/40 bg-[#1B223C] text-[#F8FAFC]'
          : 'border-[#D99B26]/40 bg-gradient-to-r from-[#FFFBEB] to-[#FEF3C7]/65 text-[#1E2E46]'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-3.5">
        <div className="h-20 w-full sm:w-32 shrink-0 overflow-hidden rounded-xl border border-black/15">
          {!imageFailed ? (
            <img
              src={egyptHeroImg}
              alt={language === 'th' ? 'อียิปต์ — Echoes of Egypt' : 'Egypt — Echoes of Egypt'}
              referrerPolicy="no-referrer"
              onError={() => setImageFailed(true)}
              className="h-full w-full object-cover"
            />
          ) : (
            <svg viewBox="0 0 120 75" className="h-full w-full" aria-hidden="true">
              <rect width="120" height="75" fill="#FDE68A" />
              <path d="M0 55 H120 V75 H0 Z" fill="#D99B26" />
              <path d="M18 55 L46 22 L74 55 Z" fill="#B45309" />
              <path d="M58 55 L82 28 L106 55 Z" fill="#92400E" />
              <circle cx="96" cy="18" r="7" fill="#FF795E" />
            </svg>
          )}
        </div>

        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-md bg-[#F2C66D] px-2 py-0.5 font-display text-[10px] font-extrabold text-[#131E31]">
              {language === 'th' ? 'จุดหมายถัดไป: ปลดล็อกแล้ว · เร็ว ๆ นี้' : 'Next Destination: Unlocked — Coming Soon'}
            </span>
          </div>
          <h4 className="font-display text-sm sm:text-base font-extrabold">
            {language === 'th'
              ? 'อียิปต์ — Echoes of Egypt'
              : 'Egypt — Echoes of Egypt'}
          </h4>
          <p className={`text-xs font-semibold ${isNight ? 'text-[#CBD5E1]' : 'text-[#475569]'}`}>
            {language === 'th'
              ? 'บทบาททางภาษา: การให้คำแนะนำและบอกขั้นตอน (TO GIVE INSTRUCTIONS) · เนื้อหากำลังเตรียมเปิดให้ผจญภัยเร็ว ๆ นี้'
              : 'Language Function: TO GIVE INSTRUCTIONS · Next expedition unlocked on World Map (playable in future update).'}
          </p>
        </div>
      </div>
    </div>
  );
}
