type AppLogoProps = {
  size?: 'sm' | 'md' | 'lg';
  showWordmark?: boolean;
  name?: string;
  className?: string;
};

const iconSizeByVariant = {
  sm: 36,
  md: 48,
  lg: 62,
} as const;

export function AppLogo({ size = 'md', showWordmark = true, name, className }: AppLogoProps) {
  const iconSize = iconSizeByVariant[size];

  return (
    <div className={`app-logo ${className ?? ''}`.trim()}>
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 64 64"
        role="img"
        aria-label="App logo"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="logo-ring" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#2ea36c" />
            <stop offset="100%" stopColor="#1f6f4a" />
          </linearGradient>
          <linearGradient id="logo-flame" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ea8a56" />
            <stop offset="100%" stopColor="#c45d34" />
          </linearGradient>
        </defs>
        <rect x="3" y="3" width="58" height="58" rx="17" fill="#f7faf6" stroke="#d3dbcf" />
        <path
          d="M16 24.2C16 18.57 20.57 14 26.2 14h11.6C43.43 14 48 18.57 48 24.2v15.6C48 45.43 43.43 50 37.8 50H26.2C20.57 50 16 45.43 16 39.8z"
          fill="url(#logo-ring)"
        />
        <path
          d="M32 19.2c6.68 0 12.1 5.42 12.1 12.1S38.68 43.4 32 43.4s-12.1-5.42-12.1-12.1S25.32 19.2 32 19.2m0 3.1a9 9 0 1 0 0 18 9 9 0 0 0 0-18"
          fill="#eff6ef"
        />
        <path
          d="m31.7 22.7 8.65 8.6-8.65 8.62-2.15-2.15 6.5-6.47-6.5-6.45z"
          fill="url(#logo-flame)"
        />
      </svg>
      {showWordmark ? (
        <span className="app-logo__wordmark">
          {name ? <span className="app-logo__name">{name}</span> : null}
          <span className="app-logo__tag">Fullstack Typescript Kit</span>
        </span>
      ) : null}
    </div>
  );
}
