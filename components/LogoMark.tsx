interface LogoMarkProps {
  size?: number;
  className?: string;
}

export default function LogoMark({ size = 32, className = "" }: LogoMarkProps) {
  const id = `lg-${size}`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id={`${id}-bg`} x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#6d28d9" />
        </linearGradient>
        <linearGradient id={`${id}-stroke`} x1="4" y1="24" x2="28" y2="6" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="1" />
        </linearGradient>
        <filter id={`${id}-glow`}>
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Rounded square background */}
      <rect width="32" height="32" rx="9" fill={`url(#${id}-bg)`} />

      {/* V shape with checkmark style — right arm rises higher than left */}
      <g filter={`url(#${id}-glow)`}>
        <polyline
          points="5,8 14,24 27,6"
          stroke={`url(#${id}-stroke)`}
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </g>
    </svg>
  );
}
