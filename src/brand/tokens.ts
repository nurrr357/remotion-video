export const BRAND_VERSION = '1.0.0';

export const COLORS = {
  background: '#05080D',
  surface: '#0A1119',
  text: '#F6FAFF',
  muted: '#A9B7C9',
  accent: '#5EE6A8',
  blue: '#66B7FF',
  gold: '#FFD166',
  danger: '#FF6B6B',
} as const;

export const FONT_FAMILY = 'Inter, Arial, sans-serif';

export const SAFE_AREA = {
  top: 160,
  bottom: 220,
  left: 72,
  right: 140,
} as const;

export const MOTION = {
  spring: {damping: 18, stiffness: 90},
  characterSpring: {damping: 16, stiffness: 85},
  beatFrames: 15,
  maxBackgroundTechniques: 2,
} as const;

export const CANONICAL_CHARACTER = {
  component: 'src/brand/Mascot2D.tsx',
  width: 340,
  height: 420,
  role: 'Maskot SatSetInfo',
} as const;

export type AccentName = 'accent' | 'blue' | 'gold';
