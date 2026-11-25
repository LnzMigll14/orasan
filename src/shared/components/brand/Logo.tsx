/**
 * Orasan brand: "Oras", a stopwatch with a face, on the amber rounded tile, plus the lowercase
 * wordmark. Same mark as public/favicon.svg. Colors come from the tokens (amber / on-amber / overdue).
 */

type LogoProps = {
  size?: number
  className?: string
}

// The face stays a warm off-white so it reads on the amber tile at every size.
const faceColor = '#FFF6E6'

export function LogoMark({ size = 32, className = '' }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      className={`flex-none ${className}`}
      aria-hidden="true"
      focusable="false"
    >
      <rect width="120" height="120" rx="28" className="fill-amber" />
      {/* Crown and side button of the stopwatch */}
      <rect x="51" y="13" width="18" height="10" rx="3" className="fill-on-amber" />
      <rect x="57" y="21" width="6" height="10" className="fill-on-amber" />
      <rect x="85" y="27" width="12" height="8" rx="2.5" transform="rotate(40 91 31)" className="fill-on-amber" />
      {/* Dial */}
      <circle cx="60" cy="67" r="36" fill={faceColor} strokeWidth="6" className="stroke-on-amber" />
      <g strokeWidth="4" strokeLinecap="round" className="stroke-on-amber">
        <line x1="60" y1="37" x2="60" y2="43" />
        <line x1="30" y1="67" x2="35" y2="67" />
        <line x1="85" y1="67" x2="90" y2="67" />
      </g>
      {/* Face */}
      <circle cx="47" cy="63" r="5.5" className="fill-on-amber" />
      <circle cx="73" cy="63" r="5.5" className="fill-on-amber" />
      <circle cx="48.8" cy="61.2" r="1.8" fill="#FFFFFF" />
      <circle cx="74.8" cy="61.2" r="1.8" fill="#FFFFFF" />
      <ellipse cx="40" cy="75" rx="5" ry="3" opacity="0.5" className="fill-overdue" />
      <ellipse cx="80" cy="75" rx="5" ry="3" opacity="0.5" className="fill-overdue" />
      <path d="M50 77 Q60 87 70 77" fill="none" strokeWidth="4" strokeLinecap="round" className="stroke-on-amber" />
    </svg>
  )
}

/** Mark + wordmark. When it is a link's only content, give the link an aria-label ("Orasan home"). */
export function Logo({ size = 32, className = '', wordmarkClassName = '' }: LogoProps & { wordmarkClassName?: string }) {
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <LogoMark size={size} />
      <span className={`text-headline font-extrabold tracking-tight text-text ${wordmarkClassName}`}>orasan</span>
    </span>
  )
}
