import React from 'react';

export interface CybeLogoProps {
  variant?: 'full' | 'horizontal' | 'icon';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  textColor?: string;
  accentColor?: string;
  showSubtitle?: boolean;
  className?: string;
}

export const CybeLogo: React.FC<CybeLogoProps> = ({
  variant = 'full',
  size = 'md',
  textColor,
  accentColor,
  showSubtitle = true,
  className = '',
}) => {
  // Determine if textColor indicates a dark background
  const isDarkBg = Boolean(
    textColor && (
      textColor.includes('#f') || 
      textColor.includes('#e') || 
      textColor.includes('#d') || 
      textColor.includes('white') ||
      textColor.includes('#94a3b8') ||
      textColor.includes('#cbd5e1') ||
      textColor.includes('#ddd6fe') ||
      textColor.includes('#bfdbfe')
    )
  );

  // Dynamic branding color tokens for Cybe: LabConnect
  const cyanAccent = accentColor || (isDarkBg ? '#00e5d8' : '#00a39e');
  const electricBlue = isDarkBg ? '#818cf8' : '#4f46e5';
  const primaryText = textColor || (isDarkBg ? '#ffffff' : '#0f172a');
  const secondaryText = isDarkBg ? '#94a3b8' : '#64748b';

  // Size height dimensions
  const heightMap = {
    sm: { h: 30, wFull: 190, wHoriz: 160 },
    md: { h: 42, wFull: 240, wHoriz: 200 },
    lg: { h: 54, wFull: 290, wHoriz: 240 },
    xl: { h: 72, wFull: 360, wHoriz: 300 },
  };

  const currentSize = heightMap[size] || heightMap.md;

  // 1. ICON ONLY VARIANT (For collapsed sidebar & compact UI badges)
  if (variant === 'icon') {
    return (
      <svg
        height={currentSize.h}
        width={currentSize.h}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`shrink-0 transition-transform duration-200 hover:scale-105 ${className}`}
        aria-label="Cybe: LabConnect Icon"
      >
        <defs>
          <linearGradient id="cybeIconGrad" x1="10" y1="10" x2="90" y2="90" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={cyanAccent} />
            <stop offset="100%" stopColor={electricBlue} />
          </linearGradient>
          <filter id="cybeGlow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor={cyanAccent} floodOpacity="0.35" />
          </filter>
        </defs>

        {/* Outer Cybernetic Hexagon Node */}
        <path
          d="M50 8 L86 28 V72 L50 92 L14 72 V28 Z"
          stroke="url(#cybeIconGrad)"
          strokeWidth="6"
          strokeLinejoin="round"
          fill={isDarkBg ? 'rgba(6, 182, 212, 0.08)' : 'rgba(79, 70, 229, 0.04)'}
          filter="url(#cybeGlow)"
        />

        {/* Laboratory Flask & Connected Cross Core */}
        <path
          d="M44 24 H56 V36 L68 58 C70 62 67 68 62 68 H38 C33 68 30 62 32 58 L44 36 V24 Z"
          fill="url(#cybeIconGrad)"
          opacity="0.9"
        />

        {/* Liquid Wave in Flask */}
        <path
          d="M36 56 Q44 52 50 56 T64 56 L62 66 H38 L36 56 Z"
          fill={isDarkBg ? '#ffffff' : '#ffffff'}
          opacity="0.4"
        />

        {/* Digital Pulse Nodes */}
        <circle cx="50" cy="18" r="4" fill={cyanAccent} />
        <circle cx="80" cy="35" r="3.5" fill={electricBlue} />
        <circle cx="20" cy="35" r="3.5" fill={cyanAccent} />
        <circle cx="50" cy="58" r="3" fill="#ffffff" />
      </svg>
    );
  }

  // 2. HORIZONTAL & FULL BRANDING LOGO
  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      <svg
        height={currentSize.h}
        viewBox="0 0 260 56"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-auto shrink-0 transition-opacity duration-200 hover:opacity-95"
        aria-label="Cybe: LabConnect Logo"
      >
        <defs>
          <linearGradient id="cybeBrandGrad" x1="0" y1="0" x2="50" y2="50" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={cyanAccent} />
            <stop offset="100%" stopColor={electricBlue} />
          </linearGradient>
          <filter id="cybeBrandGlow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="1.5" stdDeviation="2" floodColor={cyanAccent} floodOpacity="0.25" />
          </filter>
        </defs>

        {/* --- 1. Left Emblem (Hexagon + Flask Node) --- */}
        <g transform="translate(4, 3) scale(0.55)">
          {/* Hexagon Shield */}
          <path
            d="M45 4 L78 23 V61 L45 80 L12 61 V23 Z"
            stroke="url(#cybeBrandGrad)"
            strokeWidth="5.5"
            strokeLinejoin="round"
            fill={isDarkBg ? 'rgba(6, 182, 212, 0.12)' : 'rgba(79, 70, 229, 0.05)'}
            filter="url(#cybeBrandGlow)"
          />

          {/* Connected Laboratory Flask */}
          <path
            d="M40 18 H50 V28 L60 48 C62 52 59 58 54 58 H36 C31 58 28 52 30 48 L40 28 V18 Z"
            fill="url(#cybeBrandGrad)"
          />

          {/* Liquid highlight */}
          <path
            d="M33 46 Q40 42 45 46 T57 46 L55 56 H35 L33 46 Z"
            fill="#ffffff"
            opacity="0.5"
          />

          {/* Nodes */}
          <circle cx="45" cy="12" r="3.5" fill={cyanAccent} />
          <circle cx="72" cy="28" r="3" fill={electricBlue} />
          <circle cx="18" cy="28" r="3" fill={cyanAccent} />
        </g>

        {/* --- 2. "CYBE" Wordmark --- */}
        <text
          x="58"
          y="31"
          fill={primaryText}
          fontSize="24"
          fontWeight="900"
          fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          letterSpacing="0.8"
        >
          CYBE
        </text>

        {/* High-Tech Colon Accent ":" */}
        <text
          x="128"
          y="30"
          fill={cyanAccent}
          fontSize="24"
          fontWeight="900"
          fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
        >
          :
        </text>

        {/* --- 3. "LabConnect" Wordmark --- */}
        <text
          x="140"
          y="31"
          fill={cyanAccent}
          fontSize="20"
          fontWeight="800"
          fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          letterSpacing="0.4"
        >
          LabConnect
        </text>

        {/* --- 4. Subtitle Tagline --- */}
        {showSubtitle && (
          <g>
            <text
              x="59"
              y="45"
              fill={secondaryText}
              fontSize="8"
              fontWeight="800"
              fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
              letterSpacing="2.4"
            >
              ENTERPRISE LIMS INTELLIGENCE
            </text>
            
            {/* Small live badge pill on right */}
            <circle cx="244" cy="26" r="3" fill="#10b981" />
          </g>
        )}
      </svg>
    </div>
  );
};
