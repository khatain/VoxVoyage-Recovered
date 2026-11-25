import type { CountryId } from '../../types/game';

interface CountryFlagBadgeProps {
  countryId: CountryId;
  className?: string;
}

/**
 * Crisp inline SVG flag component for all 5 VoxVoyage destinations:
 * India (Ashoka Chakra tricolor), Kenya (Maasai shield & spears),
 * Scotland (St. Andrew's Saltire), Australia (Commonwealth & Southern Cross), Egypt (Eagle tricolor).
 */
export function CountryFlagBadge({ countryId, className = 'h-5 w-7' }: CountryFlagBadgeProps) {
  switch (countryId) {
    case 'india':
      return (
        <svg viewBox="0 0 30 20" className={`rounded-[3px] shadow-xs ring-1 ring-black/15 ${className}`} aria-hidden="true">
          <rect width="30" height="6.67" y="0" fill="#FF9933" />
          <rect width="30" height="6.67" y="6.67" fill="#FFFFFF" />
          <rect width="30" height="6.67" y="13.33" fill="#138808" />
          <circle cx="15" cy="10" r="2.6" fill="none" stroke="#000080" strokeWidth="0.65" />
          <circle cx="15" cy="10" r="0.6" fill="#000080" />
          <line x1="15" y1="7.4" x2="15" y2="12.6" stroke="#000080" strokeWidth="0.4" />
          <line x1="12.4" y1="10" x2="17.6" y2="10" stroke="#000080" strokeWidth="0.4" />
          <line x1="13.2" y1="8.2" x2="16.8" y2="11.8" stroke="#000080" strokeWidth="0.35" />
          <line x1="16.8" y1="8.2" x2="13.2" y2="11.8" stroke="#000080" strokeWidth="0.35" />
        </svg>
      );

    case 'kenya':
      return (
        <svg viewBox="0 0 30 20" className={`rounded-[3px] shadow-xs ring-1 ring-black/15 ${className}`} aria-hidden="true">
          <rect width="30" height="6" y="0" fill="#111111" />
          <rect width="30" height="1" y="6" fill="#FFFFFF" />
          <rect width="30" height="6" y="7" fill="#BB0000" />
          <rect width="30" height="1" y="13" fill="#FFFFFF" />
          <rect width="30" height="6" y="14" fill="#006600" />
          {/* Crossed Maasai spears */}
          <line x1="11.5" y1="15.5" x2="18.5" y2="4.5" stroke="#FFFFFF" strokeWidth="0.9" strokeLinecap="round" />
          <line x1="18.5" y1="15.5" x2="11.5" y2="4.5" stroke="#FFFFFF" strokeWidth="0.9" strokeLinecap="round" />
          {/* Maasai Shield */}
          <ellipse cx="15" cy="10" rx="2.6" ry="4.4" fill="#BB0000" stroke="#FFFFFF" strokeWidth="0.6" />
          <ellipse cx="15" cy="10" rx="0.9" ry="3.8" fill="#111111" />
          <circle cx="15" cy="10" r="0.7" fill="#FFFFFF" />
        </svg>
      );

    case 'scotland':
      // Official Scottish Saltire (St Andrew's Cross)
      return (
        <svg viewBox="0 0 30 20" className={`rounded-[3px] shadow-xs ring-1 ring-black/15 ${className}`} aria-hidden="true">
          <rect width="30" height="20" fill="#005EB8" />
          <path d="M0 0 L30 20 M30 0 L0 20" stroke="#FFFFFF" strokeWidth="3.8" />
        </svg>
      );

    case 'australia':
      return (
        <svg viewBox="0 0 30 20" className={`rounded-[3px] shadow-xs ring-1 ring-black/15 ${className}`} aria-hidden="true">
          <rect width="30" height="20" fill="#00008B" />
          {/* Simplified crisp Union Jack Canton */}
          <g>
            <rect width="14" height="9.5" fill="#012169" />
            <path d="M0 0 L14 9.5 M14 0 L0 9.5" stroke="#FFFFFF" strokeWidth="1.9" />
            <path d="M0 0 L14 9.5 M14 0 L0 9.5" stroke="#C8102E" strokeWidth="0.85" />
            <path d="M7 0 V9.5 M0 4.75 H14" stroke="#FFFFFF" strokeWidth="2.8" />
            <path d="M7 0 V9.5 M0 4.75 H14" stroke="#C8102E" strokeWidth="1.5" />
          </g>
          {/* Commonwealth Star */}
          <polygon points="7,12.2 7.7,14.1 9.6,14.1 8.1,15.3 8.7,17.2 7,16 5.3,17.2 5.9,15.3 4.4,14.1 6.3,14.1" fill="#FFFFFF" />
          {/* Southern Cross */}
          <circle cx="22.5" cy="4.2" r="1.15" fill="#FFFFFF" />
          <circle cx="19.2" cy="8.5" r="1.05" fill="#FFFFFF" />
          <circle cx="25.8" cy="7.8" r="1.05" fill="#FFFFFF" />
          <circle cx="22.5" cy="14.8" r="1.2" fill="#FFFFFF" />
          <circle cx="24.5" cy="10.6" r="0.7" fill="#FFFFFF" />
        </svg>
      );

    case 'egypt':
      return (
        <svg viewBox="0 0 30 20" className={`rounded-[3px] shadow-xs ring-1 ring-black/15 ${className}`} aria-hidden="true">
          <rect width="30" height="6.67" y="0" fill="#CE1126" />
          <rect width="30" height="6.67" y="6.67" fill="#FFFFFF" />
          <rect width="30" height="6.67" y="13.33" fill="#111111" />
          {/* Golden Eagle of Saladin emblem */}
          <path d="M13.3 8.2 L15 7.4 L16.7 8.2 L16.2 11.7 L15 12.6 L13.8 11.7 Z" fill="#C09300" />
          <rect x="14.4" y="8.9" width="1.2" height="2.4" fill="#A67C00" />
        </svg>
      );
  }
}

/**
 * Draws an identical crisp country flag onto a 2D Canvas for 3D Three.js textures/badges.
 */
export function drawFlagOnCanvas(
  ctx: CanvasRenderingContext2D,
  countryId: CountryId,
  x: number,
  y: number,
  w: number,
  h: number,
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.beginPath();
  ctx.roundRect(0, 0, w, h, 4);
  ctx.clip();

  if (countryId === 'india') {
    ctx.fillStyle = '#FF9933';
    ctx.fillRect(0, 0, w, h / 3);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, h / 3, w, h / 3);
    ctx.fillStyle = '#138808';
    ctx.fillRect(0, (h * 2) / 3, w, h / 3);
    ctx.strokeStyle = '#000080';
    ctx.lineWidth = Math.max(1.5, h * 0.05);
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, h * 0.13, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = '#000080';
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, h * 0.035, 0, Math.PI * 2);
    ctx.fill();
  } else if (countryId === 'kenya') {
    ctx.fillStyle = '#111111';
    ctx.fillRect(0, 0, w, h * 0.3);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, h * 0.3, w, h * 0.05);
    ctx.fillStyle = '#BB0000';
    ctx.fillRect(0, h * 0.35, w, h * 0.3);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, h * 0.65, w, h * 0.05);
    ctx.fillStyle = '#006600';
    ctx.fillRect(0, h * 0.7, w, h * 0.3);
    // Spears
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = Math.max(1.5, h * 0.05);
    ctx.beginPath();
    ctx.moveTo(w * 0.38, h * 0.8);
    ctx.lineTo(w * 0.62, h * 0.2);
    ctx.moveTo(w * 0.62, h * 0.8);
    ctx.lineTo(w * 0.38, h * 0.2);
    ctx.stroke();
    // Shield
    ctx.fillStyle = '#BB0000';
    ctx.strokeStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.ellipse(w / 2, h / 2, w * 0.09, h * 0.24, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  } else if (countryId === 'scotland') {
    // Scottish Saltire
    ctx.fillStyle = '#005EB8';
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = h * 0.2;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(w, h);
    ctx.moveTo(w, 0);
    ctx.lineTo(0, h);
    ctx.stroke();
  } else if (countryId === 'australia') {
    ctx.fillStyle = '#00008B';
    ctx.fillRect(0, 0, w, h);
    // Canton
    const cw = w * 0.48;
    const ch = h * 0.48;
    ctx.fillStyle = '#012169';
    ctx.fillRect(0, 0, cw, ch);
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = h * 0.08;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(cw, ch);
    ctx.moveTo(cw, 0);
    ctx.lineTo(0, ch);
    ctx.stroke();
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(cw * 0.4, 0, cw * 0.2, ch);
    ctx.fillRect(0, ch * 0.38, cw, ch * 0.24);
    ctx.fillStyle = '#C8102E';
    ctx.fillRect(cw * 0.44, 0, cw * 0.12, ch);
    ctx.fillRect(0, ch * 0.42, cw, ch * 0.16);
    // Stars
    ctx.fillStyle = '#FFFFFF';
    [
      [w * 0.24, h * 0.74, h * 0.11],
      [w * 0.75, h * 0.22, h * 0.06],
      [w * 0.64, h * 0.44, h * 0.055],
      [w * 0.86, h * 0.40, h * 0.055],
      [w * 0.75, h * 0.75, h * 0.065],
    ].forEach(([sx, sy, sr]) => {
      ctx.beginPath();
      ctx.arc(sx, sy, sr, 0, Math.PI * 2);
      ctx.fill();
    });
  } else {
    // Egypt
    ctx.fillStyle = '#CE1126';
    ctx.fillRect(0, 0, w, h / 3);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, h / 3, w, h / 3);
    ctx.fillStyle = '#111111';
    ctx.fillRect(0, (h * 2) / 3, w, h / 3);
    ctx.fillStyle = '#C09300';
    ctx.fillRect(w * 0.44, h * 0.38, w * 0.12, h * 0.24);
  }

  ctx.restore();
}
