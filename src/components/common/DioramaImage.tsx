import { useState } from 'react';
import { Compass } from 'lucide-react';
import type { ResolvedAppearance } from '../../types/game';

interface DioramaImageProps {
  src: string;
  alt: string;
  title: string;
  accentColor?: string;
  appearance?: ResolvedAppearance;
  className?: string;
}

export function DioramaImage({
  src,
  alt,
  title,
  accentColor = '#24B8B0',
  appearance = 'day',
  className = '',
}: DioramaImageProps) {
  const [hasError, setHasError] = useState(false);
  const isNight = appearance === 'night';

  if (hasError) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex flex-col items-center justify-center gap-3 p-6 text-center ${
          isNight
            ? 'bg-gradient-to-br from-[#20304A] via-[#18253B] to-[#131E31]'
            : 'bg-gradient-to-br from-[#52B6EC] via-[#8AD4FA] to-[#DDF2FD]'
        } ${className}`}
      >
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl border ${
            isNight ? 'border-white/15 bg-[#131E31]/60' : 'border-white/80 bg-white/85'
          }`}
          style={{ color: accentColor }}
        >
          <Compass className="h-6 w-6" aria-hidden="true" />
        </div>
        <p
          className={`font-display text-sm font-semibold ${
            isNight ? 'text-[#F7F9FC]' : 'text-[#20304A]'
          }`}
        >
          {title}
        </p>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
}
