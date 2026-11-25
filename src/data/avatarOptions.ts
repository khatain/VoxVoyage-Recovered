import type {
  AvatarConfig,
  AvatarHairStyleId,
  AvatarModelId,
  AvatarOutfitId,
  LocalizedText,
} from '../types/game';

export interface LabeledOption<T extends string> {
  id: T;
  label: LocalizedText;
}

export interface ColorSwatchOption {
  id: string;
  hex: string;
  label: LocalizedText;
}

export const AVATAR_MODELS: LabeledOption<AvatarModelId>[] = [
  {
    id: 'voyager_classic',
    label: { en: 'Voyager', th: 'นักเดินทาง' },
  },
  {
    id: 'trailblazer_slim',
    label: { en: 'Trailblazer', th: 'ผู้บุกเบิก' },
  },
  {
    id: 'pioneer_sturdy',
    label: { en: 'Pioneer', th: 'นักสำรวจแกร่ง' },
  },
];

export const AVATAR_HAIR_STYLES: LabeledOption<AvatarHairStyleId>[] = [
  {
    id: 'short_tousled',
    label: { en: 'Layered Crop', th: 'ผมสั้นมีมิติ' },
  },
  {
    id: 'bob_wave',
    label: { en: 'Wavy Bob', th: 'บ๊อบประบ่า' },
  },
  {
    id: 'high_ponytail',
    label: { en: 'High Ponytail', th: 'หางม้าสูง' },
  },
  {
    id: 'twin_buns',
    label: { en: 'Twin Buns', th: 'ดังโงะคู่' },
  },
  {
    id: 'curly_crown',
    label: { en: 'Curly Crown', th: 'ผมหยิกฟู' },
  },
  {
    id: 'explorer_spiky',
    label: { en: 'Swept Spikes', th: 'ทรงตั้งเท่' },
  },
];

export const AVATAR_HAIR_COLORS: ColorSwatchOption[] = [
  { id: 'obsidian', hex: '#1E222B', label: { en: 'Midnight Black', th: 'ดำสนิท' } },
  { id: 'espresso', hex: '#4A2E1B', label: { en: 'Espresso', th: 'น้ำตาลเข้ม' } },
  { id: 'chestnut', hex: '#8A4B2A', label: { en: 'Chestnut', th: 'น้ำตาลเกาลัด' } },
  { id: 'honey', hex: '#D8A348', label: { en: 'Honey Gold', th: 'ทองน้ำผึ้ง' } },
  { id: 'auburn', hex: '#B54B32', label: { en: 'Copper Auburn', th: 'น้ำตาลแดง' } },
  { id: 'ocean', hex: '#1F7A8C', label: { en: 'Ocean Teal', th: 'เขียวน้ำทะเล' } },
];

export const AVATAR_SKIN_TONES: ColorSwatchOption[] = [
  { id: 'ivory', hex: '#F6D6C1', label: { en: 'Warm Ivory', th: 'ผิวขาวอมชมพู' } },
  { id: 'peach', hex: '#E8B896', label: { en: 'Soft Peach', th: 'ผิวขาวเหลือง' } },
  { id: 'golden', hex: '#D4986A', label: { en: 'Golden Tan', th: 'ผิวสองสี' } },
  { id: 'honey', hex: '#B97848', label: { en: 'Warm Honey', th: 'ผิวน้ำผึ้ง' } },
  { id: 'chestnut', hex: '#8C5332', label: { en: 'Rich Chestnut', th: 'ผิวแทนเข้ม' } },
  { id: 'espresso', hex: '#59331F', label: { en: 'Deep Umber', th: 'ผิวเข้ม' } },
];

export const AVATAR_OUTFITS: LabeledOption<AvatarOutfitId>[] = [
  {
    id: 'field_jacket',
    label: { en: 'Field Jacket', th: 'แจ็กเก็ตสำรวจ' },
  },
  {
    id: 'sky_hoodie',
    label: { en: 'Travel Hoodie', th: 'ฮู้ดดี้เดินทาง' },
  },
  {
    id: 'safari_vest',
    label: { en: 'Safari Vest', th: 'เสื้อกั๊กซาฟารี' },
  },
  {
    id: 'coastal_poncho',
    label: { en: 'Traveler Cape', th: 'ผ้าคลุมนักเดินทาง' },
  },
];

export const AVATAR_OUTFIT_COLORS: ColorSwatchOption[] = [
  { id: 'navy', hex: '#20304A', label: { en: 'Explorer Navy', th: 'กรมท่า' } },
  { id: 'teal', hex: '#1C8E89', label: { en: 'Ocean Teal', th: 'ฟ้าอมเขียว' } },
  { id: 'gold', hex: '#D49428', label: { en: 'Sun Amber', th: 'เหลืองอำพัน' } },
  { id: 'coral', hex: '#D9644A', label: { en: 'Sunset Coral', th: 'ส้มคอรัล' } },
  { id: 'emerald', hex: '#2F7D57', label: { en: 'Highland Green', th: 'เขียวมรกต' } },
  { id: 'plum', hex: '#634A8A', label: { en: 'Twilight Plum', th: 'ม่วงพลัม' } },
];

export const AVATAR_BACKPACK_COLORS: ColorSwatchOption[] = [
  { id: 'saddle', hex: '#A96B38', label: { en: 'Saddle Leather', th: 'น้ำตาลหนัง' } },
  { id: 'sun', hex: '#DF9F32', label: { en: 'Compass Gold', th: 'ทองคำ' } },
  { id: 'teal', hex: '#249B96', label: { en: 'Lagoon Teal', th: 'เขียวน้ำทะเล' } },
  { id: 'rust', hex: '#BD523E', label: { en: 'Canyon Red', th: 'แดงอิฐ' } },
  { id: 'forest', hex: '#346E53', label: { en: 'Forest Pine', th: 'เขียวป่า' } },
  { id: 'slate', hex: '#2B3D5B', label: { en: 'Midnight Slate', th: 'น้ำเงินเข้ม' } },
];

export const VALID_AVATAR_MODEL_IDS = new Set<string>(AVATAR_MODELS.map((m) => m.id));
export const VALID_HAIR_STYLE_IDS = new Set<string>(AVATAR_HAIR_STYLES.map((h) => h.id));
export const VALID_OUTFIT_IDS = new Set<string>(AVATAR_OUTFITS.map((o) => o.id));
export const VALID_HAIR_COLORS = new Set<string>(AVATAR_HAIR_COLORS.map((c) => c.hex));
export const VALID_SKIN_TONES = new Set<string>(AVATAR_SKIN_TONES.map((c) => c.hex));
export const VALID_OUTFIT_COLORS = new Set<string>(AVATAR_OUTFIT_COLORS.map((c) => c.hex));
export const VALID_BACKPACK_COLORS = new Set<string>(AVATAR_BACKPACK_COLORS.map((c) => c.hex));

export const DEFAULT_AVATAR_CONFIG: AvatarConfig = {
  modelId: 'voyager_classic',
  displayName: 'Explorer',
  hairStyle: 'short_tousled',
  hairColor: '#1E222B',
  skinTone: '#E8B896',
  outfitId: 'field_jacket',
  outfitColor: '#20304A',
  backpackColor: '#A96B38',
  accessoryIds: ['brass_compass'],
  customizedInPhase1: false,
};

function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

export function sanitizeExplorerName(raw: string): string {
  const cleaned = raw.replace(/\s+/g, ' ').trim().slice(0, 18);
  return cleaned.length > 0 ? cleaned : 'Explorer';
}

export function randomizeAvatarConfig(current: AvatarConfig): AvatarConfig {
  return {
    ...current,
    modelId: pickRandom(AVATAR_MODELS).id,
    hairStyle: pickRandom(AVATAR_HAIR_STYLES).id,
    hairColor: pickRandom(AVATAR_HAIR_COLORS).hex,
    skinTone: pickRandom(AVATAR_SKIN_TONES).hex,
    outfitId: pickRandom(AVATAR_OUTFITS).id,
    outfitColor: pickRandom(AVATAR_OUTFIT_COLORS).hex,
    backpackColor: pickRandom(AVATAR_BACKPACK_COLORS).hex,
  };
}
