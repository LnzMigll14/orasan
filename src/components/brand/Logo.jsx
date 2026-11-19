/**
 * Orasan brand: an amber rounded square holding a timer glyph, plus the lowercase wordmark.
 * Same mark as public/favicon.svg. Colors come from the tokens (amber / on-amber / text).
 */

export function LogoMark({ size = 32, className = '' }) {
  return (
    <span
      className={`inline-flex flex-none items-center justify-center rounded-sm bg-amber text-on-amber ${className}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <svg
        width={Math.round(size * 0.56)}
        height={Math.round(size * 0.56)}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="10" x2="14" y1="2" y2="2" />
        <line x1="12" x2="15" y1="14" y2="11" />
        <circle cx="12" cy="14" r="8" />
      </svg>
    </span>
  )
}

/** Mark + wordmark. When it is a link's only content, give the link an aria-label ("Orasan home"). */
export function Logo({ size = 32, className = '' }) {
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <LogoMark size={size} />
      <span className="text-headline font-extrabold tracking-tight text-text">orasan</span>
    </span>
  )
}
