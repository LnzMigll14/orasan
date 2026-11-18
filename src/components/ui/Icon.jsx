/**
 * Functional glyphs only (DESIGN.md): status markers, lock, copy, chevron, close, check.
 * 16×16 grid, 1.5px stroke, currentColor. Decorative icons are not allowed.
 */
const PATHS = {
  check: <path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="square" />,
  arrow: <path d="M3 8h9M9 4.5L12.5 8 9 11.5" fill="none" stroke="currentColor" strokeWidth="1.5" />,
  'square-hollow': <rect x="4.25" y="4.25" width="7.5" height="7.5" fill="none" stroke="currentColor" strokeWidth="1.5" />,
  'square-filled': <rect x="4" y="4" width="8" height="8" fill="currentColor" />,
  lock: (
    <>
      <rect x="3.5" y="7.25" width="9" height="6.25" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5.5 7.25V5.5a2.5 2.5 0 015 0v1.75" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </>
  ),
  copy: (
    <>
      <rect x="5.75" y="5.75" width="7.5" height="7.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3 10.25V2.75h7.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </>
  ),
  play: <path d="M5 3.5v9l7.5-4.5z" fill="currentColor" />,
  chevron: <path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" />,
  close: <path d="M4 4l8 8M12 4l-8 8" fill="none" stroke="currentColor" strokeWidth="1.5" />,
}

export function Icon({ name, size = 16, className, title }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      className={className}
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : undefined}
      focusable="false"
      style={{ flex: 'none' }}
    >
      {title ? <title>{title}</title> : null}
      {PATHS[name]}
    </svg>
  )
}
