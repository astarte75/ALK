export const bp = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
  '3xl': '2560px',
} as const

export const mq = {
  sm: `@media (min-width: ${bp.sm})`,
  md: `@media (min-width: ${bp.md})`,
  lg: `@media (min-width: ${bp.lg})`,
  xl: `@media (min-width: ${bp.xl})`,
  '2xl': `@media (min-width: ${bp['2xl']})`,
} as const
