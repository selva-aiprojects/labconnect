import { CustomTheme, FontSizeScale } from '../types/theme';
import { DEFAULT_THEME } from '../data/themePresets';

export function getFontSizePx(scale: FontSizeScale): string {
  switch (scale) {
    case 'compact':
      return '13px';
    case 'normal':
      return '15px';
    case 'comfortable':
      return '17px';
    case 'xlarge':
      return '19px';
    default:
      return '15px';
  }
}

export function getFontSizeName(scale: FontSizeScale): string {
  switch (scale) {
    case 'compact':
      return 'Compact (13px)';
    case 'normal':
      return 'Standard (15px)';
    case 'comfortable':
      return 'Comfortable (17px)';
    case 'xlarge':
      return 'Extra Large (19px)';
    default:
      return 'Standard (15px)';
  }
}

export function getStoredThemeForUser(username?: string): CustomTheme {
  try {
    const key = username ? `lims_theme_${username}` : 'lims_theme_current';
    const saved = localStorage.getItem(key) || localStorage.getItem('lims_theme_current');
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...DEFAULT_THEME, ...parsed };
    }
  } catch (e) {
    console.error('Failed to read theme from localStorage:', e);
  }
  return DEFAULT_THEME;
}

export function saveThemeForUser(theme: CustomTheme, username?: string): void {
  try {
    const key = username ? `lims_theme_${username}` : 'lims_theme_current';
    localStorage.setItem(key, JSON.stringify(theme));
    localStorage.setItem('lims_theme_current', JSON.stringify(theme));
    applyThemeToDocument(theme);
  } catch (e) {
    console.error('Failed to save theme to localStorage:', e);
  }
}

export function applyThemeToDocument(theme: CustomTheme): void {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;

  const sidebarActiveText = theme.sidebarActiveTextColor || '#ffffff';
  const sidebarHover = theme.sidebarHoverBg || 'rgba(255, 255, 255, 0.12)';

  root.style.setProperty('--custom-sidebar-bg', theme.sidebarBg);
  root.style.setProperty('--custom-sidebar-text', theme.sidebarTextColor);
  root.style.setProperty('--custom-sidebar-active-bg', theme.sidebarActiveBg);
  root.style.setProperty('--custom-sidebar-active-text', sidebarActiveText);
  root.style.setProperty('--custom-sidebar-hover-bg', sidebarHover);
  
  root.style.setProperty('--custom-top-header-bg', theme.topHeaderBg);
  root.style.setProperty('--custom-top-header-text', theme.topHeaderTextColor);

  root.style.setProperty('--custom-site-bg', theme.siteBg);
  root.style.setProperty('--custom-card-bg', theme.cardBg);

  root.style.setProperty('--custom-text-color', theme.textColor);
  root.style.setProperty('--custom-text-muted', theme.textMutedColor);

  root.style.setProperty('--custom-primary', theme.primaryColor);
  root.style.setProperty('--custom-border', theme.borderColor);

  const gridHeader = theme.gridHeaderBg || '#f1f5f9';
  const gridHeaderText = theme.gridHeaderTextColor || theme.textColor || '#0f172a';
  const gridHeaderRadius = theme.gridHeaderRadius || '12px';
  const gridAltRow = theme.gridAltRowBg || 'rgba(0, 0, 0, 0.025)';
  const gridBorder = theme.gridBorderColor || theme.borderColor || '#e2e8f0';
  const gridRowHover = theme.gridRowHoverBg || 'rgba(0, 0, 0, 0.04)';

  root.style.setProperty('--custom-grid-header-bg', gridHeader);
  root.style.setProperty('--custom-grid-header-text', gridHeaderText);
  root.style.setProperty('--custom-grid-header-radius', gridHeaderRadius);
  root.style.setProperty('--custom-grid-alt-row-bg', gridAltRow);
  root.style.setProperty('--custom-grid-border-color', gridBorder);
  root.style.setProperty('--custom-grid-row-hover-bg', gridRowHover);

  root.style.setProperty('--custom-font-size-base', getFontSizePx(theme.fontSizeScale));
  
  root.setAttribute('data-custom-theme', 'enabled');
}
