import { Compass, Moon, Sun } from 'lucide-react';
import type { AppLanguage, CountryId, CountryWorld, ResolvedAppearance } from '../../types/game';
import { CountryFlagBadge } from '../common/CountryFlagBadge';

interface WorldExplorerFallback2DProps {
  countries: CountryWorld[];
  selectedCountryId: CountryId;
  onSelectCountry: (id: CountryId) => void;
  language: AppLanguage;
  appearance: ResolvedAppearance;
  sceneMode: 'title' | 'map';
  webglUnavailable: boolean;
  noticeText: string;
}

const PIN_POSITIONS: Record<CountryId, { x: string; y: string }> = {
  scotland: { x: '37%', y: '25%' },
  egypt: { x: '50%', y: '44%' },
  kenya: { x: '54%', y: '60%' },
  india: { x: '68%', y: '45%' },
  australia: { x: '82%', y: '72%' },
};

export function WorldExplorerFallback2D({
  countries,
  selectedCountryId,
  onSelectCountry,
  language,
  appearance,
  sceneMode,
  webglUnavailable,
  noticeText,
}: WorldExplorerFallback2DProps) {
  const isNight = appearance === 'night';

  return (
    <div
      className={`relative h-full w-full overflow-hidden transition-colors duration-700 ${
        isNight
          ? 'bg-gradient-to-b from-[#0A0E26] via-[#171A40] to-[#261C4D]'
          : 'bg-gradient-to-b from-[#2E96D9] via-[#75C8F2] to-[#CBEBFB]'
      }`}
    >
      {/* Night Stars or Day Sun */}
      {isNight ? (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-75">
          <div className="absolute top-[12%] left-[18%] h-1.5 w-1.5 rounded-full bg-white" />
          <div className="absolute top-[22%] left-[34%] h-1 w-1 rounded-full bg-[#FFE9B3]" />
          <div className="absolute top-[15%] left-[64%] h-1.5 w-1.5 rounded-full bg-white" />
          <div className="absolute top-[28%] left-[78%] h-1 w-1 rounded-full bg-[#C7D8FF]" />
          <div className="absolute top-[10%] left-[86%] h-2 w-2 rounded-full bg-[#FFF5D6]" />
          <div className="absolute top-[38%] left-[12%] h-1 w-1 rounded-full bg-white" />
          <div className="absolute top-12 right-14 flex h-16 w-16 items-center justify-center rounded-full bg-[#FFF4CC]/15 border border-[#FFF4CC]/35">
            <Moon className="h-8 w-8 text-[#FFF4CC]" />
          </div>
        </div>
      ) : (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-10 right-14 flex h-20 w-20 items-center justify-center rounded-full bg-[#FFF3C4]/65 border border-white/70"
        >
          <Sun className="h-10 w-10 text-[#E59312]" />
        </div>
      )}

      {/* Stylized 2D Floating Earth Globe Circle */}
      <div
        className={`absolute top-1/2 -translate-y-1/2 rounded-full border-2 overflow-visible transition-all duration-700 ${
          sceneMode === 'title'
            ? 'left-1/2 -translate-x-1/2 lg:left-[62%] h-[320px] w-[320px] sm:h-[420px] sm:w-[420px]'
            : 'left-1/2 -translate-x-1/2 h-[330px] w-[330px] sm:h-[460px] sm:w-[460px]'
        } ${
          isNight
            ? 'border-[#6A94F0]/55 bg-gradient-to-br from-[#12395E] via-[#184870] to-[#0C213B] shadow-[0_0_80px_rgba(90,130,245,0.28)]'
            : 'border-[#7EE5FF]/85 bg-gradient-to-br from-[#1B86C4] via-[#1E9FD0] to-[#136099] shadow-[0_24px_60px_rgba(19,30,49,0.25)]'
        }`}
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 400 400"
          className="h-full w-full rounded-full"
        >
          <defs>
            <clipPath id="globe2dClip">
              <circle cx="200" cy="200" r="196" />
            </clipPath>
          </defs>
          <g clipPath="url(#globe2dClip)">
            {/* Subtle cartography lines */}
            <ellipse cx="200" cy="200" rx="196" ry="70" fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth="1" />
            <ellipse cx="200" cy="200" rx="110" ry="196" fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth="1" />
            <line x1="4" y1="200" x2="396" y2="200" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />

            {/* Stylized Eastern Hemisphere Continents (Europe/Scotland, Africa, Asia/India, Australia) */}
            {/* Europe + Great Britain */}
            <path
              d="M138 118 L150 96 L172 88 L194 94 L188 122 L162 128 L142 126 Z"
              fill={isNight ? '#3B6F50' : '#5EB064'}
              stroke="rgba(84,224,228,0.45)"
              strokeWidth="4"
            />
            <path
              d="M132 104 L141 96 L146 108 L138 115 Z"
              fill={isNight ? '#36694C' : '#53A85E'}
              stroke="rgba(84,224,228,0.45)"
              strokeWidth="3"
            />
            {/* Africa */}
            <path
              d="M148 150 L185 148 L210 162 L232 192 L222 232 L205 272 L185 270 L178 232 L156 205 L140 176 Z"
              fill={isNight ? '#6E7A48' : '#A4BC5A'}
              stroke="rgba(84,224,228,0.45)"
              strokeWidth="4"
            />
            {/* Sahara Golden Tint */}
            <ellipse cx="182" cy="172" rx="30" ry="14" fill={isNight ? '#877647' : '#E2BE70'} opacity="0.75" />
            {/* Asia + India + SE Asia */}
            <path
              d="M196 102 L262 84 L328 102 L344 136 L305 162 L292 198 L272 184 L256 154 L234 146 L216 142 Z"
              fill={isNight ? '#3E7351' : '#5CB062'}
              stroke="rgba(84,224,228,0.45)"
              strokeWidth="4"
            />
            {/* Indian Subcontinent */}
            <path
              d="M244 152 L276 152 L272 184 L258 202 L248 178 Z"
              fill={isNight ? '#4B7E52' : '#6EB35A'}
              stroke="rgba(247,232,184,0.45)"
              strokeWidth="2"
            />
            {/* Australia */}
            <path
              d="M286 254 L322 246 L346 266 L342 296 L312 302 L288 286 Z"
              fill={isNight ? '#87673F' : '#D99F59'}
              stroke="rgba(84,224,228,0.45)"
              strokeWidth="4"
            />
          </g>
        </svg>

        {sceneMode === 'map' && (
          <>
            {/* Thailand Start */}
            <div
              style={{ left: '72%', top: '53%' }}
              className="absolute -translate-x-1/2 -translate-y-1/2"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#131E31] border border-[#24B8B0] text-[#24B8B0] shadow-md">
                <Compass className="h-3.5 w-3.5" aria-hidden="true" />
              </div>
            </div>

            {countries.map((country) => {
              const pos = PIN_POSITIONS[country.id];
              const active = country.id === selectedCountryId;
              return (
                <button
                  key={country.id}
                  type="button"
                  onClick={() => onSelectCountry(country.id)}
                  style={{ left: pos.x, top: pos.y }}
                  aria-pressed={active}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-bold transition-transform cursor-pointer whitespace-nowrap ${
                    active
                      ? 'z-10 scale-110 bg-[#F2C66D] text-[#131E31] shadow-lg ring-2 ring-white/60'
                      : 'bg-[#131E31]/92 text-[#F7F9FC] border border-white/25 hover:bg-[#20304A]'
                  }`}
                >
                  <CountryFlagBadge countryId={country.id} className="h-3.5 w-5 shrink-0" />
                  <span>{country.countryName[language]}</span>
                </button>
              );
            })}
          </>
        )}
      </div>

      {webglUnavailable && sceneMode === 'map' && (
        <div
          role="status"
          className="absolute top-20 left-1/2 -translate-x-1/2 rounded-xl bg-[#131E31]/88 px-4 py-2 text-xs text-[#F2C66D] border border-[#F2C66D]/35"
        >
          {noticeText}
        </div>
      )}
    </div>
  );
}
