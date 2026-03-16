interface D20LogoProps {
  size?: number;
  className?: string;
}

export function D20Logo({ size = 32, className }: D20LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <polygon
        points="24,2 44,14 44,34 24,46 4,34 4,14"
        stroke="var(--color-accent)"
        strokeWidth="2"
        fill="none"
      />
      <polygon
        points="24,2 44,14 24,46"
        stroke="var(--color-accent)"
        strokeWidth="1.5"
        fill="rgba(var(--color-accent-rgb), 0.1)"
      />
      <polygon
        points="24,2 4,14 24,46"
        stroke="var(--color-accent)"
        strokeWidth="1.5"
        fill="rgba(var(--color-accent-rgb), 0.05)"
      />
      <line x1="4" y1="14" x2="44" y2="14" stroke="var(--color-accent)" strokeWidth="1.5" />
      <line x1="4" y1="34" x2="44" y2="34" stroke="var(--color-accent)" strokeWidth="1" opacity="0.5" />
      <line x1="24" y1="14" x2="4" y2="34" stroke="var(--color-accent)" strokeWidth="1" opacity="0.5" />
      <line x1="24" y1="14" x2="44" y2="34" stroke="var(--color-accent)" strokeWidth="1" opacity="0.5" />
      <text
        x="24"
        y="30"
        textAnchor="middle"
        fill="var(--color-accent)"
        fontSize="14"
        fontWeight="bold"
        fontFamily="'JetBrains Mono', monospace"
      >
        20
      </text>
    </svg>
  );
}
