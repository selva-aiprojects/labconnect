export type FontSizeScale = 'compact' | 'normal' | 'comfortable' | 'xlarge';

export interface CustomTheme {
  id?: string;
  name?: string;
  sidebarBg: string;              // Sidebar background color
  sidebarHeaderBg?: string;        // Dedicated Sidebar Header background color
  sidebarHeaderTextColor?: string; // Dedicated Sidebar Header text/icon color
  sidebarTextColor: string;       // Inactive sidebar item text color
  sidebarActiveBg: string;        // Sidebar active menu item background
  sidebarActiveTextColor: string; // Sidebar active menu item text color
  sidebarHoverBg: string;         // Sidebar item hover background color
  logoVariant?: 'full' | 'horizontal' | 'icon'; // Logo style variant
  logoPlacement?: 'left' | 'center' | 'right';  // Logo alignment placement
  logoAccentColor?: string;       // Custom Erba Teal/Accent color
  topHeaderBg: string;            // Top navigation bar background
  topHeaderTextColor: string;     // Top navigation text/icon color
  siteBg: string;                 // Main workspace site background
  cardBg: string;                 // Content cards background
  textColor: string;              // Main primary text color
  textMutedColor: string;         // Muted / secondary label text color
  primaryColor: string;           // Primary brand accent color
  borderColor: string;            // UI element borders color
  gridHeaderBg: string;           // Data grid / table header background color
  gridHeaderTextColor: string;    // Data grid / table header text color
  gridHeaderRadius: string;       // Curved header left & right edges radius ('6px', '12px', '18px', '9999px')
  gridAltRowBg: string;           // Data grid / table alternate row background color
  gridBorderColor: string;        // Data grid / table border & line divider color
  gridRowHoverBg: string;         // Data grid / table row hover background color
  fontSizeScale: FontSizeScale;   // Text sizes scale
}
