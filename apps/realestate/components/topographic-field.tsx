import { useId } from "react";

const contourPaths = [
  "M-40 438C58 368 120 413 205 336c64-58 106-154 214-142 116 13 143 97 239 65 75-25 105-98 157-110",
  "M-43 394c107-52 159 8 232-51 78-63 111-172 226-162 103 10 142 84 222 66 89-20 117-93 170-139",
  "M-47 349c92-23 157 45 247-33 92-80 110-180 213-182 124-1 157 77 239 58 78-18 112-72 163-132",
  "M-50 304c96 2 160 80 260-16 85-80 101-181 208-198 113-18 153 73 227 45 83-32 113-95 168-149",
  "M-43 253c91 29 172 95 270-1 73-72 101-179 198-202 101-24 153 66 218 24 76-49 113-110 168-160",
  "M-34 201c100 55 182 101 273 19 79-71 94-181 183-211 100-34 153 46 218-6 62-49 109-118 173-170",
  "M-30 145c89 55 194 125 287 43 71-63 93-176 167-209 91-41 150 21 209-33 62-57 109-113 184-165",
];

const focalLines = [
  "M125 510c20-87 85-164 179-180 91-15 172 21 241-35 72-58 58-152 159-206",
  "M129 555c11-108 84-198 180-221 95-23 184 18 257-45 75-64 62-156 177-211",
  "M88 497c33-94 93-153 188-164 105-12 175 24 248-29 72-53 60-149 157-196",
];

export function TopographicField({
  className,
  variant = 0,
  showGrain = false,
}: {
  className?: string;
  variant?: number;
  showGrain?: boolean;
}) {
  const focalLine = focalLines[variant % focalLines.length];
  const instanceId = useId().replace(/:/g, "");
  const washId = `terrain-wash-${variant}-${instanceId}`;
  const poolId = `terrain-pool-${variant}-${instanceId}`;
  const grainId = `terrain-grain-${variant}-${instanceId}`;

  return (
    <div className={`topographic-field ${className ?? ""}`} aria-hidden="true">
      <svg viewBox="0 0 760 600" preserveAspectRatio="xMidYMid slice" focusable="false">
        <defs>
          <linearGradient id={washId} x1="0" x2="1" y1="0" y2="1">
            <stop className="topographic-field__wash-start" offset="0" />
            <stop className="topographic-field__wash-middle" offset="0.52" />
            <stop className="topographic-field__wash-end" offset="1" />
          </linearGradient>
          <radialGradient id={poolId} cx="67%" cy="22%" r="62%">
            <stop className="topographic-field__pool-start" offset="0" stopOpacity="0.48" />
            <stop className="topographic-field__pool-middle" offset="0.55" stopOpacity="0.05" />
            <stop className="topographic-field__pool-end" offset="1" stopOpacity="0" />
          </radialGradient>
          {showGrain ? (
            <filter id={grainId} x="-10%" y="-10%" width="120%" height="120%">
              <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="3" seed={variant + 7} />
              <feColorMatrix type="saturate" values="0" />
              <feComponentTransfer>
                <feFuncA type="table" tableValues="0 0.15" />
              </feComponentTransfer>
            </filter>
          ) : null}
        </defs>
        <rect width="760" height="600" fill={`url(#${washId})`} />
        <rect width="760" height="600" fill={`url(#${poolId})`} />
        <g className="topographic-field__contours">
          {contourPaths.map((path, index) => (
            <path
              key={path}
              d={path}
              fill="none"
              pathLength="1"
              stroke="currentColor"
              strokeDasharray={index % 3 === 0 ? "0.006 0.014" : undefined}
              strokeOpacity={0.2 + index * 0.035}
              strokeWidth={index === 3 ? 1.6 : 1}
            />
          ))}
          <path
            className="topographic-field__focal-line"
            d={focalLine}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
        </g>
        {showGrain ? <rect width="760" height="600" filter={`url(#${grainId})`} opacity="0.36" /> : null}
      </svg>
      <span className="topographic-field__crosshair topographic-field__crosshair--one" />
      <span className="topographic-field__crosshair topographic-field__crosshair--two" />
    </div>
  );
}
