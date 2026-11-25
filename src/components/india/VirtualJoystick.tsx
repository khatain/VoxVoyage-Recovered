import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';

export interface JoystickVector {
  x: number;
  y: number;
}

interface VirtualJoystickProps {
  onVectorChange: (vec: JoystickVector) => void;
  isNight: boolean;
  label: string;
}

const OUTER_RADIUS = 54;
const KNOB_MAX_OFFSET = 34;
const DEADZONE = 0.14;

export function VirtualJoystick({ onVectorChange, isNight, label }: VirtualJoystickProps) {
  const baseRef = useRef<HTMLDivElement | null>(null);
  const activePointerIdRef = useRef<number | null>(null);
  const [knobPos, setKnobPos] = useState<JoystickVector>({ x: 0, y: 0 });
  const [isPressed, setIsPressed] = useState(false);

  useEffect(() => {
    return () => {
      onVectorChange({ x: 0, y: 0 });
    };
  }, [onVectorChange]);

  const updateFromClientCoords = (clientX: number, clientY: number) => {
    const baseEl = baseRef.current;
    if (!baseEl) return;
    const rect = baseEl.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    const dx = clientX - cx;
    const dy = clientY - cy;
    const dist = Math.hypot(dx, dy);
    const clampedDist = Math.min(dist, KNOB_MAX_OFFSET);
    const angle = dist > 0.0001 ? Math.atan2(dy, dx) : 0;

    const kx = Math.cos(angle) * clampedDist;
    const ky = Math.sin(angle) * clampedDist;
    setKnobPos({ x: kx, y: ky });

    const normMag = clampedDist / KNOB_MAX_OFFSET;
    if (normMag < DEADZONE) {
      onVectorChange({ x: 0, y: 0 });
      return;
    }

    const rescaled = (normMag - DEADZONE) / (1 - DEADZONE);
    onVectorChange({
      x: Math.cos(angle) * rescaled,
      y: Math.sin(angle) * rescaled,
    });
  };

  const handlePointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    activePointerIdRef.current = e.pointerId;
    setIsPressed(true);
    updateFromClientCoords(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (activePointerIdRef.current !== e.pointerId) return;
    e.stopPropagation();
    updateFromClientCoords(e.clientX, e.clientY);
  };

  const releaseStick = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (activePointerIdRef.current !== e.pointerId) return;
    e.stopPropagation();
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    activePointerIdRef.current = null;
    setIsPressed(false);
    setKnobPos({ x: 0, y: 0 });
    onVectorChange({ x: 0, y: 0 });
  };

  return (
    <div
      ref={baseRef}
      role="application"
      aria-label={label}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={releaseStick}
      onPointerCancel={releaseStick}
      style={{ width: OUTER_RADIUS * 2, height: OUTER_RADIUS * 2, touchAction: 'none' }}
      className={`relative flex select-none items-center justify-center rounded-full border-2 shadow-xl transition-colors ${
        isNight
          ? 'border-[#8FC2FF]/45 bg-[#121C3A]/85'
          : 'border-white/95 bg-[#FFFDF8]/82'
      }`}
    >
      {/* Compass Crosshair */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-3 rounded-full border border-dashed ${
          isNight ? 'border-white/25' : 'border-[#20304A]/20'
        }`}
      />
      <div
        aria-hidden="true"
        style={{
          transform: `translate(${knobPos.x}px, ${knobPos.y}px) scale(${isPressed ? 1.07 : 1})`,
        }}
        className={`pointer-events-none h-11 w-11 rounded-full border-2 shadow-lg transition-transform duration-75 ${
          isPressed
            ? 'border-white bg-[#F2C66D]'
            : 'border-white/85 bg-[#24B8B0]'
        }`}
      />
    </div>
  );
}
