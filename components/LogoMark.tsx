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
          <stop offset="0%" stopColor="#b06af0" />
          <stop offset="100%" stopColor="#5b21b6" />
        </linearGradient>
        <linearGradient id={`${id}-stroke`} x1="5" y1="7" x2="27" y2="7" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#ffffff" stopOpacity="0.75" />
          <stop offset="50%"  stopColor="#ffffff" stopOpacity="1" />
          <stop offset="100%" stopColor="#e9d5ff" stopOpacity="0.9" />
        </linearGradient>
        <filter id={`${id}-glow`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="1.2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id={`${id}-dotglow`} x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="1.8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Background */}
      <rect width="32" height="32" rx="9" fill={`url(#${id}-bg)`} />

      {/* Subtle inner highlight at top */}
      <rect width="32" height="16" rx="9" fill="white" fillOpacity="0.06" />

      {/* Wide glow pass */}
      <path
        d="M 5,7 Q 10,18 14.5,24.5 Q 19,18 27,6"
        stroke="white"
        strokeOpacity="0.18"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Main V with curved arms */}
      <path
        d="M 5,7 Q 10,18 14.5,24.5 Q 19,18 27,6"
        stroke={`url(#${id}-stroke)`}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        filter={`url(#${id}-glow)`}
      />

      {/* Glowing dot at vertex */}
      <circle
        cx="14.5"
        cy="24.5"
        r="1.8"
        fill="white"
        filter={`url(#${id}-dotglow)`}
      />
    </svg>
  );
}
