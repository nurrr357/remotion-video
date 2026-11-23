import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

/**
 * Canonical SatSetInfo 2D mascot.
 *
 * This is the single source of truth for the character. Do not redraw,
 * recolor, or replace this SVG with an AI-generated variation. Position,
 * scale, pose and expression may change; identity must not.
 */
export const Mascot2D = ({
  right = 40,
  bottom = 210,
  scale = 1,
}: {
  right?: number;
  bottom?: number;
  scale?: number;
} = {}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({
    frame,
    fps,
    config: {damping: 16, stiffness: 85},
  });
  const bob = Math.sin(frame / 14) * 8;
  const wave = Math.sin(frame / 6) * 12;
  const blink = frame % 96 < 5;
  const x = interpolate(enter, [0, 1], [180, 0]);

  return (
    <div
      style={{
        position: 'absolute',
        right,
        bottom,
        width: 340,
        height: 420,
        transform: `translateX(${x}px) translateY(${bob}px) scale(${
          (0.85 + enter * 0.15) * scale
        })`,
        transformOrigin: 'bottom right',
        opacity: enter,
      }}
    >
      <svg viewBox="0 0 340 420" width="340" height="420" aria-hidden="true">
        <defs>
          <linearGradient id="satset-shirt" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#2d78e8" />
            <stop offset="1" stopColor="#174aa1" />
          </linearGradient>
        </defs>

        <ellipse cx="170" cy="398" rx="105" ry="16" fill="#000" opacity="0.35" />

        <g transform={`rotate(${wave} 268 258)`}>
          <path
            d="M260 252 C294 260 306 290 300 326"
            fill="none"
            stroke="#F0C39E"
            strokeWidth="24"
            strokeLinecap="round"
          />
          <circle cx="300" cy="330" r="15" fill="#F0C39E" />
        </g>

        <path
          d="M80 248 C48 262 40 292 52 326"
          fill="none"
          stroke="#F0C39E"
          strokeWidth="24"
          strokeLinecap="round"
        />
        <circle cx="52" cy="330" r="15" fill="#F0C39E" />

        <rect x="70" y="232" width="200" height="150" rx="42" fill="url(#satset-shirt)" />
        <path
          d="M92 270 H248 M88 304 H252 M92 338 H248"
          stroke="#F5FAFF"
          strokeWidth="10"
          opacity="0.85"
        />

        <rect x="92" y="92" width="156" height="150" rx="42" fill="#F0C39E" />
        <path
          d="M92 150 C92 92 150 66 216 84 C242 92 254 120 248 148 L226 136 C198 116 156 116 120 136 Z"
          fill="#2A1A16"
        />

        <rect x="80" y="63" width="180" height="62" rx="24" fill="#1E63D6" />
        <rect x="98" y="49" width="144" height="34" rx="16" fill="#2F7CF0" />
        <circle cx="170" cy="44" r="19" fill="#1E63D6" />
        <path
          d="M92 90 H248"
          stroke="#0D2F6B"
          strokeWidth="5"
          opacity="0.45"
        />

        <path
          d="M122 136 C134 126 150 124 160 134"
          fill="none"
          stroke="#5A3022"
          strokeWidth="7"
          strokeLinecap="round"
        />
        <path
          d="M180 134 C192 124 210 126 220 138"
          fill="none"
          stroke="#5A3022"
          strokeWidth="7"
          strokeLinecap="round"
        />

        {blink ? (
          <>
            <path d="M134 166 H154" stroke="#182235" strokeWidth="8" strokeLinecap="round" />
            <path d="M190 166 H210" stroke="#182235" strokeWidth="8" strokeLinecap="round" />
          </>
        ) : (
          <>
            <rect x="136" y="158" width="18" height="22" rx="7" fill="#182235" />
            <rect x="190" y="158" width="18" height="22" rx="7" fill="#182235" />
            <circle cx="141" cy="164" r="3" fill="#FFFFFF" />
            <circle cx="195" cy="164" r="3" fill="#FFFFFF" />
          </>
        )}

        <ellipse cx="124" cy="194" rx="14" ry="8" fill="#DE8F87" opacity="0.6" />
        <ellipse cx="214" cy="194" rx="14" ry="8" fill="#DE8F87" opacity="0.6" />
        <path
          d="M156 206 C168 220 188 220 200 204"
          fill="none"
          stroke="#743728"
          strokeWidth="7"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};
