import React, { useState } from 'react';
import { 
  Palette, Paintbrush, RotateCcw, Save, CheckCircle2, 
  Layout, Type, Sliders, Sparkles, Sun, Moon, Info, Eye, Check
} from 'lucide-react';
import { CustomTheme, FontSizeScale } from '../types/theme';
import { THEME_PRESETS, DEFAULT_THEME } from '../data/themePresets';
import { getFontSizePx, getFontSizeName, saveThemeForUser } from '../utils/themeUtils';
import { CybeLogo } from './CybeLogo';

interface ThemeCustomizerViewProps {
  currentTheme: CustomTheme;
  username: string;
  onThemeUpdate: (newTheme: CustomTheme) => void;
}

export function ThemeCustomizerView({
  currentTheme,
  username,
  onThemeUpdate
}: ThemeCustomizerViewProps) {
  const [theme, setTheme] = useState<CustomTheme>(currentTheme);
  const [activeTab, setActiveTab] = useState<'preset' | 'custom' | 'typography'>('custom');
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const handleColorChange = (key: keyof CustomTheme, value: string) => {
    const updated = { ...theme, [key]: value, id: 'custom-user' };
    setTheme(updated);
  };

  const handleApplyPreset = (preset: CustomTheme) => {
    setTheme(preset);
    showToast(`Preset "${preset.name}" selected! Click "Save & Apply Theme" to persist.`);
  };

  const handleSaveTheme = () => {
    saveThemeForUser(theme, username);
    onThemeUpdate(theme);
    showToast(`Custom theme successfully saved for account "${username || 'Current User'}"!`);
  };

  const handleReset = () => {
    setTheme(DEFAULT_THEME);
    saveThemeForUser(DEFAULT_THEME, username);
    onThemeUpdate(DEFAULT_THEME);
    showToast('Theme reset to Default Cybe Light configuration.');
  };

  return (
    <div className="space-y-6 text-left font-sans transition-all">
      
      {/* 1. Header Card */}
      <div 
        className="p-6 rounded-3xl border shadow-sm transition-all relative overflow-hidden"
        style={{
          backgroundColor: theme.cardBg,
          color: theme.textColor,
          borderColor: theme.borderColor
        }}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div 
              className="h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 shadow-xs"
              style={{ backgroundColor: theme.primaryColor, color: '#ffffff' }}
            >
              <Paintbrush className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black tracking-tight">Theme Studio & Pro UI Customizer</h2>
                <span 
                  className="px-2 py-0.5 text-[10px] font-black uppercase rounded-full"
                  style={{ backgroundColor: theme.primaryColor + '20', color: theme.primaryColor }}
                >
                  Pro Max Engine
                </span>
              </div>
              <p className="text-xs font-semibold opacity-75 mt-0.5">
                Customize workspace colors for sidebar, site background, header, text sizes, and cards. Saved preferences sync for <strong style={{ color: theme.primaryColor }}>{username || 'your user session'}</strong> on login.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={handleReset}
              className="px-4 py-2.5 rounded-2xl border text-xs font-extrabold flex items-center gap-1.5 hover:opacity-80 transition-all cursor-pointer"
              style={{
                borderColor: theme.borderColor,
                backgroundColor: theme.siteBg,
                color: theme.textColor
              }}
            >
              <RotateCcw className="h-4 w-4" />
              <span>Reset Defaults</span>
            </button>

            <button
              onClick={handleSaveTheme}
              className="px-5 py-2.5 rounded-2xl text-xs font-black flex items-center gap-2 text-white shadow-lg transition-all hover:scale-[1.02] cursor-pointer"
              style={{ backgroundColor: theme.primaryColor }}
            >
              <Save className="h-4.5 w-4.5" />
              <span>Save & Apply Theme</span>
            </button>
          </div>
        </div>

        {/* Sync Info Note */}
        <div 
          className="mt-4 p-3 rounded-2xl border flex items-center gap-2 text-xs font-semibold"
          style={{
            backgroundColor: theme.siteBg,
            borderColor: theme.borderColor,
            color: theme.textMutedColor
          }}
        >
          <Info className="h-4 w-4 shrink-0" style={{ color: theme.primaryColor }} />
          <span>Your theme settings are tied to your account (<strong style={{ color: theme.textColor }}>{username || 'Logged User'}</strong>). Whenever you log back in, this exact color palette and font sizing will load automatically.</span>
        </div>
      </div>

      {/* 2. Main Customization Workspace: Controls + Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 7 Columns: Color & Typography Controls */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Navigation Tabs for Settings */}
          <div 
            className="p-1.5 rounded-2xl border flex items-center gap-1 text-xs font-bold"
            style={{ backgroundColor: theme.cardBg, borderColor: theme.borderColor }}
          >
            <button
              onClick={() => setActiveTab('custom')}
              className={`flex-1 py-2 px-3 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === 'custom' ? 'shadow-xs font-black' : 'opacity-70 hover:opacity-100'
              }`}
              style={
                activeTab === 'custom'
                  ? { backgroundColor: theme.primaryColor, color: '#ffffff' }
                  : { color: theme.textColor }
              }
            >
              <Sliders className="h-4 w-4" />
              <span>Color Pickers</span>
            </button>

            <button
              onClick={() => setActiveTab('preset')}
              className={`flex-1 py-2 px-3 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === 'preset' ? 'shadow-xs font-black' : 'opacity-70 hover:opacity-100'
              }`}
              style={
                activeTab === 'preset'
                  ? { backgroundColor: theme.primaryColor, color: '#ffffff' }
                  : { color: theme.textColor }
              }
            >
              <Palette className="h-4 w-4" />
              <span>1-Click Presets</span>
            </button>

            <button
              onClick={() => setActiveTab('typography')}
              className={`flex-1 py-2 px-3 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === 'typography' ? 'shadow-xs font-black' : 'opacity-70 hover:opacity-100'
              }`}
              style={
                activeTab === 'typography'
                  ? { backgroundColor: theme.primaryColor, color: '#ffffff' }
                  : { color: theme.textColor }
              }
            >
              <Type className="h-4 w-4" />
              <span>Text Sizes</span>
            </button>
          </div>

          {/* TAB 1: Custom Color Pickers */}
          {activeTab === 'custom' && (
            <div 
              className="p-6 rounded-3xl border shadow-sm space-y-6"
              style={{ backgroundColor: theme.cardBg, borderColor: theme.borderColor }}
            >
              <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: theme.borderColor }}>
                <h3 className="text-sm font-black uppercase tracking-wider flex items-center gap-2">
                  <Paintbrush className="h-4.5 w-4.5" style={{ color: theme.primaryColor }} />
                  <span>Individual Color Customizer</span>
                </h3>
                <span className="text-[10px] font-bold uppercase opacity-60">UI/UX Pro Max System</span>
              </div>

              {/* 1. Sidebar Header & Logo Placement Controls */}
              <div className="space-y-3">
                <span className="text-[11px] font-black uppercase tracking-wider block opacity-70">
                  1. Sidebar Header & Logo Placement Controls
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {/* Sidebar Header Bg */}
                  <div className="p-3.5 rounded-2xl border space-y-2" style={{ backgroundColor: theme.siteBg, borderColor: theme.borderColor }}>
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-bold block">Sidebar Header Bg</label>
                      <button 
                        onClick={() => handleColorChange('sidebarHeaderBg', theme.sidebarBg)}
                        className="text-[9px] font-extrabold px-1.5 py-0.5 rounded border opacity-70 hover:opacity-100 cursor-pointer"
                        style={{ borderColor: theme.borderColor }}
                        title="Sync with Sidebar Bg"
                      >
                        Match Sidebar
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <input 
                        type="color" 
                        value={theme.sidebarHeaderBg || theme.sidebarBg}
                        onChange={(e) => handleColorChange('sidebarHeaderBg', e.target.value)}
                        className="h-8 w-10 rounded-lg cursor-pointer border-0 bg-transparent"
                      />
                      <input 
                        type="text"
                        value={theme.sidebarHeaderBg || theme.sidebarBg}
                        onChange={(e) => handleColorChange('sidebarHeaderBg', e.target.value)}
                        className="w-full text-xs font-mono font-bold p-1.5 rounded-lg border uppercase"
                        style={{ backgroundColor: theme.cardBg, borderColor: theme.borderColor, color: theme.textColor }}
                      />
                    </div>
                  </div>

                  {/* Sidebar Header Text Color */}
                  <div className="p-3.5 rounded-2xl border space-y-2" style={{ backgroundColor: theme.siteBg, borderColor: theme.borderColor }}>
                    <label className="text-[11px] font-bold block">Header Text & Logo Color</label>
                    <div className="flex items-center gap-2">
                      <input 
                        type="color" 
                        value={theme.sidebarHeaderTextColor || theme.sidebarTextColor}
                        onChange={(e) => handleColorChange('sidebarHeaderTextColor', e.target.value)}
                        className="h-8 w-10 rounded-lg cursor-pointer border-0 bg-transparent"
                      />
                      <input 
                        type="text"
                        value={theme.sidebarHeaderTextColor || theme.sidebarTextColor}
                        onChange={(e) => handleColorChange('sidebarHeaderTextColor', e.target.value)}
                        className="w-full text-xs font-mono font-bold p-1.5 rounded-lg border uppercase"
                        style={{ backgroundColor: theme.cardBg, borderColor: theme.borderColor, color: theme.textColor }}
                      />
                    </div>
                  </div>

                  {/* Logo Vector Accent Color */}
                  <div className="p-3.5 rounded-2xl border space-y-2" style={{ backgroundColor: theme.siteBg, borderColor: theme.borderColor }}>
                    <label className="text-[11px] font-bold block">Logo Accent Teal / Vector</label>
                    <div className="flex items-center gap-2">
                      <input 
                        type="color" 
                        value={theme.logoAccentColor || '#0284c7'}
                        onChange={(e) => handleColorChange('logoAccentColor', e.target.value)}
                        className="h-8 w-10 rounded-lg cursor-pointer border-0 bg-transparent"
                      />
                      <input 
                        type="text"
                        value={theme.logoAccentColor || '#0284c7'}
                        onChange={(e) => handleColorChange('logoAccentColor', e.target.value)}
                        className="w-full text-xs font-mono font-bold p-1.5 rounded-lg border uppercase"
                        style={{ backgroundColor: theme.cardBg, borderColor: theme.borderColor, color: theme.textColor }}
                      />
                    </div>
                  </div>
                </div>

                {/* Logo Style & Alignment Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {/* Logo Style Variant */}
                  <div className="p-3.5 rounded-2xl border space-y-2" style={{ backgroundColor: theme.siteBg, borderColor: theme.borderColor }}>
                    <label className="text-[11px] font-bold block">Logo Display Style / Variant</label>
                    <div className="grid grid-cols-3 gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleColorChange('logoVariant', 'full')}
                        className={`py-1.5 px-2 rounded-xl text-[10px] font-black border transition-all cursor-pointer ${
                          (theme.logoVariant || 'full') === 'full' ? 'shadow-xs' : 'opacity-60 hover:opacity-100'
                        }`}
                        style={
                          (theme.logoVariant || 'full') === 'full'
                            ? { backgroundColor: theme.primaryColor, color: '#ffffff', borderColor: theme.primaryColor }
                            : { backgroundColor: theme.cardBg, color: theme.textColor, borderColor: theme.borderColor }
                        }
                      >
                        Full Brand
                      </button>
                      <button
                        type="button"
                        onClick={() => handleColorChange('logoVariant', 'horizontal')}
                        className={`py-1.5 px-2 rounded-xl text-[10px] font-black border transition-all cursor-pointer ${
                          theme.logoVariant === 'horizontal' ? 'shadow-xs' : 'opacity-60 hover:opacity-100'
                        }`}
                        style={
                          theme.logoVariant === 'horizontal'
                            ? { backgroundColor: theme.primaryColor, color: '#ffffff', borderColor: theme.primaryColor }
                            : { backgroundColor: theme.cardBg, color: theme.textColor, borderColor: theme.borderColor }
                        }
                      >
                        Horizontal
                      </button>
                      <button
                        type="button"
                        onClick={() => handleColorChange('logoVariant', 'icon')}
                        className={`py-1.5 px-2 rounded-xl text-[10px] font-black border transition-all cursor-pointer ${
                          theme.logoVariant === 'icon' ? 'shadow-xs' : 'opacity-60 hover:opacity-100'
                        }`}
                        style={
                          theme.logoVariant === 'icon'
                            ? { backgroundColor: theme.primaryColor, color: '#ffffff', borderColor: theme.primaryColor }
                            : { backgroundColor: theme.cardBg, color: theme.textColor, borderColor: theme.borderColor }
                        }
                      >
                        Emblem
                      </button>
                    </div>
                  </div>

                  {/* Logo Alignment Placement */}
                  <div className="p-3.5 rounded-2xl border space-y-2" style={{ backgroundColor: theme.siteBg, borderColor: theme.borderColor }}>
                    <label className="text-[11px] font-bold block">Logo Alignment Placement</label>
                    <div className="grid grid-cols-3 gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleColorChange('logoPlacement', 'left')}
                        className={`py-1.5 px-2 rounded-xl text-[10px] font-black border transition-all cursor-pointer ${
                          (theme.logoPlacement || 'left') === 'left' ? 'shadow-xs' : 'opacity-60 hover:opacity-100'
                        }`}
                        style={
                          (theme.logoPlacement || 'left') === 'left'
                            ? { backgroundColor: theme.primaryColor, color: '#ffffff', borderColor: theme.primaryColor }
                            : { backgroundColor: theme.cardBg, color: theme.textColor, borderColor: theme.borderColor }
                        }
                      >
                        Left
                      </button>
                      <button
                        type="button"
                        onClick={() => handleColorChange('logoPlacement', 'center')}
                        className={`py-1.5 px-2 rounded-xl text-[10px] font-black border transition-all cursor-pointer ${
                          theme.logoPlacement === 'center' ? 'shadow-xs' : 'opacity-60 hover:opacity-100'
                        }`}
                        style={
                          theme.logoPlacement === 'center'
                            ? { backgroundColor: theme.primaryColor, color: '#ffffff', borderColor: theme.primaryColor }
                            : { backgroundColor: theme.cardBg, color: theme.textColor, borderColor: theme.borderColor }
                        }
                      >
                        Centered
                      </button>
                      <button
                        type="button"
                        onClick={() => handleColorChange('logoPlacement', 'right')}
                        className={`py-1.5 px-2 rounded-xl text-[10px] font-black border transition-all cursor-pointer ${
                          theme.logoPlacement === 'right' ? 'shadow-xs' : 'opacity-60 hover:opacity-100'
                        }`}
                        style={
                          theme.logoPlacement === 'right'
                            ? { backgroundColor: theme.primaryColor, color: '#ffffff', borderColor: theme.primaryColor }
                            : { backgroundColor: theme.cardBg, color: theme.textColor, borderColor: theme.borderColor }
                        }
                      >
                        Right
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Sidebar Navigation & Menu Items */}
              <div className="space-y-3">
                <span className="text-[11px] font-black uppercase tracking-wider block opacity-70">
                  2. Sidebar Navigation & Menu Buttons
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {/* Sidebar Bg */}
                  <div className="p-3.5 rounded-2xl border space-y-2" style={{ backgroundColor: theme.siteBg, borderColor: theme.borderColor }}>
                    <label className="text-[11px] font-bold block">Sidebar Background</label>
                    <div className="flex items-center gap-2">
                      <input 
                        type="color" 
                        value={theme.sidebarBg}
                        onChange={(e) => handleColorChange('sidebarBg', e.target.value)}
                        className="h-8 w-10 rounded-lg cursor-pointer border-0 bg-transparent"
                      />
                      <input 
                        type="text"
                        value={theme.sidebarBg}
                        onChange={(e) => handleColorChange('sidebarBg', e.target.value)}
                        className="w-full text-xs font-mono font-bold p-1.5 rounded-lg border uppercase"
                        style={{ backgroundColor: theme.cardBg, borderColor: theme.borderColor, color: theme.textColor }}
                      />
                    </div>
                  </div>

                  {/* Sidebar Inactive Item Text */}
                  <div className="p-3.5 rounded-2xl border space-y-2" style={{ backgroundColor: theme.siteBg, borderColor: theme.borderColor }}>
                    <label className="text-[11px] font-bold block">Sidebar Button Text (Inactive)</label>
                    <div className="flex items-center gap-2">
                      <input 
                        type="color" 
                        value={theme.sidebarTextColor}
                        onChange={(e) => handleColorChange('sidebarTextColor', e.target.value)}
                        className="h-8 w-10 rounded-lg cursor-pointer border-0 bg-transparent"
                      />
                      <input 
                        type="text"
                        value={theme.sidebarTextColor}
                        onChange={(e) => handleColorChange('sidebarTextColor', e.target.value)}
                        className="w-full text-xs font-mono font-bold p-1.5 rounded-lg border uppercase"
                        style={{ backgroundColor: theme.cardBg, borderColor: theme.borderColor, color: theme.textColor }}
                      />
                    </div>
                  </div>

                  {/* Sidebar Hover Bg */}
                  <div className="p-3.5 rounded-2xl border space-y-2" style={{ backgroundColor: theme.siteBg, borderColor: theme.borderColor }}>
                    <label className="text-[11px] font-bold block">Sidebar Button Hover Bg</label>
                    <div className="flex items-center gap-2">
                      <input 
                        type="color" 
                        value={theme.sidebarHoverBg || '#2e2a72'}
                        onChange={(e) => handleColorChange('sidebarHoverBg', e.target.value)}
                        className="h-8 w-10 rounded-lg cursor-pointer border-0 bg-transparent"
                      />
                      <input 
                        type="text"
                        value={theme.sidebarHoverBg || '#2e2a72'}
                        onChange={(e) => handleColorChange('sidebarHoverBg', e.target.value)}
                        className="w-full text-xs font-mono font-bold p-1.5 rounded-lg border uppercase"
                        style={{ backgroundColor: theme.cardBg, borderColor: theme.borderColor, color: theme.textColor }}
                      />
                    </div>
                  </div>

                  {/* Sidebar Active Item Bg */}
                  <div className="p-3.5 rounded-2xl border space-y-2" style={{ backgroundColor: theme.siteBg, borderColor: theme.borderColor }}>
                    <label className="text-[11px] font-bold block">Sidebar Active Button Bg</label>
                    <div className="flex items-center gap-2">
                      <input 
                        type="color" 
                        value={theme.sidebarActiveBg}
                        onChange={(e) => handleColorChange('sidebarActiveBg', e.target.value)}
                        className="h-8 w-10 rounded-lg cursor-pointer border-0 bg-transparent"
                      />
                      <input 
                        type="text"
                        value={theme.sidebarActiveBg}
                        onChange={(e) => handleColorChange('sidebarActiveBg', e.target.value)}
                        className="w-full text-xs font-mono font-bold p-1.5 rounded-lg border uppercase"
                        style={{ backgroundColor: theme.cardBg, borderColor: theme.borderColor, color: theme.textColor }}
                      />
                    </div>
                  </div>

                  {/* Sidebar Active Item Text */}
                  <div className="p-3.5 rounded-2xl border space-y-2" style={{ backgroundColor: theme.siteBg, borderColor: theme.borderColor }}>
                    <label className="text-[11px] font-bold block">Sidebar Active Button Text</label>
                    <div className="flex items-center gap-2">
                      <input 
                        type="color" 
                        value={theme.sidebarActiveTextColor || '#ffffff'}
                        onChange={(e) => handleColorChange('sidebarActiveTextColor', e.target.value)}
                        className="h-8 w-10 rounded-lg cursor-pointer border-0 bg-transparent"
                      />
                      <input 
                        type="text"
                        value={theme.sidebarActiveTextColor || '#ffffff'}
                        onChange={(e) => handleColorChange('sidebarActiveTextColor', e.target.value)}
                        className="w-full text-xs font-mono font-bold p-1.5 rounded-lg border uppercase"
                        style={{ backgroundColor: theme.cardBg, borderColor: theme.borderColor, color: theme.textColor }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Top Header Colors Section */}
              <div className="space-y-3">
                <span className="text-[11px] font-black uppercase tracking-wider block opacity-70">
                  2. Top Header Navigation
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Top Header Bg */}
                  <div className="p-3.5 rounded-2xl border space-y-2" style={{ backgroundColor: theme.siteBg, borderColor: theme.borderColor }}>
                    <label className="text-[11px] font-bold block">Header Background</label>
                    <div className="flex items-center gap-2">
                      <input 
                        type="color" 
                        value={theme.topHeaderBg}
                        onChange={(e) => handleColorChange('topHeaderBg', e.target.value)}
                        className="h-8 w-10 rounded-lg cursor-pointer border-0 bg-transparent"
                      />
                      <input 
                        type="text"
                        value={theme.topHeaderBg}
                        onChange={(e) => handleColorChange('topHeaderBg', e.target.value)}
                        className="w-full text-xs font-mono font-bold p-1.5 rounded-lg border uppercase"
                        style={{ backgroundColor: theme.cardBg, borderColor: theme.borderColor, color: theme.textColor }}
                      />
                    </div>
                  </div>

                  {/* Top Header Text */}
                  <div className="p-3.5 rounded-2xl border space-y-2" style={{ backgroundColor: theme.siteBg, borderColor: theme.borderColor }}>
                    <label className="text-[11px] font-bold block">Header Text / Icons</label>
                    <div className="flex items-center gap-2">
                      <input 
                        type="color" 
                        value={theme.topHeaderTextColor}
                        onChange={(e) => handleColorChange('topHeaderTextColor', e.target.value)}
                        className="h-8 w-10 rounded-lg cursor-pointer border-0 bg-transparent"
                      />
                      <input 
                        type="text"
                        value={theme.topHeaderTextColor}
                        onChange={(e) => handleColorChange('topHeaderTextColor', e.target.value)}
                        className="w-full text-xs font-mono font-bold p-1.5 rounded-lg border uppercase"
                        style={{ backgroundColor: theme.cardBg, borderColor: theme.borderColor, color: theme.textColor }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Main Site Background & Cards Section */}
              <div className="space-y-3">
                <span className="text-[11px] font-black uppercase tracking-wider block opacity-70">
                  3. Workspace Backgrounds & Cards
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Site Bg */}
                  <div className="p-3.5 rounded-2xl border space-y-2" style={{ backgroundColor: theme.siteBg, borderColor: theme.borderColor }}>
                    <label className="text-[11px] font-bold block">Site Background</label>
                    <div className="flex items-center gap-2">
                      <input 
                        type="color" 
                        value={theme.siteBg}
                        onChange={(e) => handleColorChange('siteBg', e.target.value)}
                        className="h-8 w-10 rounded-lg cursor-pointer border-0 bg-transparent"
                      />
                      <input 
                        type="text"
                        value={theme.siteBg}
                        onChange={(e) => handleColorChange('siteBg', e.target.value)}
                        className="w-full text-xs font-mono font-bold p-1.5 rounded-lg border uppercase"
                        style={{ backgroundColor: theme.cardBg, borderColor: theme.borderColor, color: theme.textColor }}
                      />
                    </div>
                  </div>

                  {/* Card Bg */}
                  <div className="p-3.5 rounded-2xl border space-y-2" style={{ backgroundColor: theme.siteBg, borderColor: theme.borderColor }}>
                    <label className="text-[11px] font-bold block">Card Container</label>
                    <div className="flex items-center gap-2">
                      <input 
                        type="color" 
                        value={theme.cardBg}
                        onChange={(e) => handleColorChange('cardBg', e.target.value)}
                        className="h-8 w-10 rounded-lg cursor-pointer border-0 bg-transparent"
                      />
                      <input 
                        type="text"
                        value={theme.cardBg}
                        onChange={(e) => handleColorChange('cardBg', e.target.value)}
                        className="w-full text-xs font-mono font-bold p-1.5 rounded-lg border uppercase"
                        style={{ backgroundColor: theme.cardBg, borderColor: theme.borderColor, color: theme.textColor }}
                      />
                    </div>
                  </div>

                  {/* Border Color */}
                  <div className="p-3.5 rounded-2xl border space-y-2" style={{ backgroundColor: theme.siteBg, borderColor: theme.borderColor }}>
                    <label className="text-[11px] font-bold block">Border Lines</label>
                    <div className="flex items-center gap-2">
                      <input 
                        type="color" 
                        value={theme.borderColor}
                        onChange={(e) => handleColorChange('borderColor', e.target.value)}
                        className="h-8 w-10 rounded-lg cursor-pointer border-0 bg-transparent"
                      />
                      <input 
                        type="text"
                        value={theme.borderColor}
                        onChange={(e) => handleColorChange('borderColor', e.target.value)}
                        className="w-full text-xs font-mono font-bold p-1.5 rounded-lg border uppercase"
                        style={{ backgroundColor: theme.cardBg, borderColor: theme.borderColor, color: theme.textColor }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. Text & Accent Colors Section */}
              <div className="space-y-3">
                <span className="text-[11px] font-black uppercase tracking-wider block opacity-70">
                  4. Text Colors & Brand Accent
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Text Color */}
                  <div className="p-3.5 rounded-2xl border space-y-2" style={{ backgroundColor: theme.siteBg, borderColor: theme.borderColor }}>
                    <label className="text-[11px] font-bold block">Primary Text</label>
                    <div className="flex items-center gap-2">
                      <input 
                        type="color" 
                        value={theme.textColor}
                        onChange={(e) => handleColorChange('textColor', e.target.value)}
                        className="h-8 w-10 rounded-lg cursor-pointer border-0 bg-transparent"
                      />
                      <input 
                        type="text"
                        value={theme.textColor}
                        onChange={(e) => handleColorChange('textColor', e.target.value)}
                        className="w-full text-xs font-mono font-bold p-1.5 rounded-lg border uppercase"
                        style={{ backgroundColor: theme.cardBg, borderColor: theme.borderColor, color: theme.textColor }}
                      />
                    </div>
                  </div>

                  {/* Muted Text */}
                  <div className="p-3.5 rounded-2xl border space-y-2" style={{ backgroundColor: theme.siteBg, borderColor: theme.borderColor }}>
                    <label className="text-[11px] font-bold block">Secondary / Muted Text</label>
                    <div className="flex items-center gap-2">
                      <input 
                        type="color" 
                        value={theme.textMutedColor}
                        onChange={(e) => handleColorChange('textMutedColor', e.target.value)}
                        className="h-8 w-10 rounded-lg cursor-pointer border-0 bg-transparent"
                      />
                      <input 
                        type="text"
                        value={theme.textMutedColor}
                        onChange={(e) => handleColorChange('textMutedColor', e.target.value)}
                        className="w-full text-xs font-mono font-bold p-1.5 rounded-lg border uppercase"
                        style={{ backgroundColor: theme.cardBg, borderColor: theme.borderColor, color: theme.textColor }}
                      />
                    </div>
                  </div>

                  {/* Primary Accent Color */}
                  <div className="p-3.5 rounded-2xl border space-y-2" style={{ backgroundColor: theme.siteBg, borderColor: theme.borderColor }}>
                    <label className="text-[11px] font-bold block">Brand Accent Color</label>
                    <div className="flex items-center gap-2">
                      <input 
                        type="color" 
                        value={theme.primaryColor}
                        onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                        className="h-8 w-10 rounded-lg cursor-pointer border-0 bg-transparent"
                      />
                      <input 
                        type="text"
                        value={theme.primaryColor}
                        onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                        className="w-full text-xs font-mono font-bold p-1.5 rounded-lg border uppercase"
                        style={{ backgroundColor: theme.cardBg, borderColor: theme.borderColor, color: theme.textColor }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 5. Data Grid & Table Colors & Curved Edges Section */}
              <div className="space-y-3">
                <span className="text-[11px] font-black uppercase tracking-wider block opacity-70">
                  5. Data Grid & Table Customization
                </span>
                
                {/* Header Curved Edge Radius Selector */}
                <div className="p-3.5 rounded-2xl border space-y-2" style={{ backgroundColor: theme.siteBg, borderColor: theme.borderColor }}>
                  <label className="text-[11px] font-bold block">Table Header Curved Edge Style</label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {[
                      { label: 'Slight (6px)', value: '6px' },
                      { label: 'Medium (12px)', value: '12px' },
                      { label: 'Round (18px)', value: '18px' },
                      { label: 'Extra (24px)', value: '24px' },
                      { label: 'Full Pill (9999px)', value: '9999px' },
                    ].map((radiusOption) => (
                      <button
                        key={radiusOption.value}
                        type="button"
                        onClick={() => handleColorChange('gridHeaderRadius', radiusOption.value)}
                        className={`px-2.5 py-1.5 rounded-xl text-[10px] font-bold transition-all border cursor-pointer ${
                          (theme.gridHeaderRadius || '12px') === radiusOption.value
                            ? 'shadow-xs border-indigo-600'
                            : 'opacity-70 hover:opacity-100'
                        }`}
                        style={
                          (theme.gridHeaderRadius || '12px') === radiusOption.value
                            ? { backgroundColor: theme.primaryColor, color: '#ffffff', borderColor: theme.primaryColor }
                            : { backgroundColor: theme.cardBg, borderColor: theme.borderColor, color: theme.textColor }
                        }
                      >
                        {radiusOption.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                  {/* Grid Header Background */}
                  <div className="p-3.5 rounded-2xl border space-y-2" style={{ backgroundColor: theme.siteBg, borderColor: theme.borderColor }}>
                    <label className="text-[11px] font-bold block">Header Bg</label>
                    <div className="flex items-center gap-2">
                      <input 
                        type="color" 
                        value={theme.gridHeaderBg || '#f1f5f9'}
                        onChange={(e) => handleColorChange('gridHeaderBg', e.target.value)}
                        className="h-8 w-10 rounded-lg cursor-pointer border-0 bg-transparent"
                      />
                      <input 
                        type="text"
                        value={theme.gridHeaderBg || '#f1f5f9'}
                        onChange={(e) => handleColorChange('gridHeaderBg', e.target.value)}
                        className="w-full text-xs font-mono font-bold p-1.5 rounded-lg border uppercase"
                        style={{ backgroundColor: theme.cardBg, borderColor: theme.borderColor, color: theme.textColor }}
                      />
                    </div>
                  </div>

                  {/* Grid Header Text Color */}
                  <div className="p-3.5 rounded-2xl border space-y-2" style={{ backgroundColor: theme.siteBg, borderColor: theme.borderColor }}>
                    <label className="text-[11px] font-bold block">Header Text</label>
                    <div className="flex items-center gap-2">
                      <input 
                        type="color" 
                        value={theme.gridHeaderTextColor || theme.textColor || '#0f172a'}
                        onChange={(e) => handleColorChange('gridHeaderTextColor', e.target.value)}
                        className="h-8 w-10 rounded-lg cursor-pointer border-0 bg-transparent"
                      />
                      <input 
                        type="text"
                        value={theme.gridHeaderTextColor || theme.textColor || '#0f172a'}
                        onChange={(e) => handleColorChange('gridHeaderTextColor', e.target.value)}
                        className="w-full text-xs font-mono font-bold p-1.5 rounded-lg border uppercase"
                        style={{ backgroundColor: theme.cardBg, borderColor: theme.borderColor, color: theme.textColor }}
                      />
                    </div>
                  </div>

                  {/* Alternate Row Background (Zebra Striping) */}
                  <div className="p-3.5 rounded-2xl border space-y-2" style={{ backgroundColor: theme.siteBg, borderColor: theme.borderColor }}>
                    <label className="text-[11px] font-bold block">Alt Row Bg</label>
                    <div className="flex items-center gap-2">
                      <input 
                        type="color" 
                        value={theme.gridAltRowBg || '#f8fafc'}
                        onChange={(e) => handleColorChange('gridAltRowBg', e.target.value)}
                        className="h-8 w-10 rounded-lg cursor-pointer border-0 bg-transparent"
                      />
                      <input 
                        type="text"
                        value={theme.gridAltRowBg || '#f8fafc'}
                        onChange={(e) => handleColorChange('gridAltRowBg', e.target.value)}
                        className="w-full text-xs font-mono font-bold p-1.5 rounded-lg border uppercase"
                        style={{ backgroundColor: theme.cardBg, borderColor: theme.borderColor, color: theme.textColor }}
                      />
                    </div>
                  </div>

                  {/* Grid Lines & Borders */}
                  <div className="p-3.5 rounded-2xl border space-y-2" style={{ backgroundColor: theme.siteBg, borderColor: theme.borderColor }}>
                    <label className="text-[11px] font-bold block">Gridlines & Borders</label>
                    <div className="flex items-center gap-2">
                      <input 
                        type="color" 
                        value={theme.gridBorderColor || theme.borderColor || '#e2e8f0'}
                        onChange={(e) => handleColorChange('gridBorderColor', e.target.value)}
                        className="h-8 w-10 rounded-lg cursor-pointer border-0 bg-transparent"
                      />
                      <input 
                        type="text"
                        value={theme.gridBorderColor || theme.borderColor || '#e2e8f0'}
                        onChange={(e) => handleColorChange('gridBorderColor', e.target.value)}
                        className="w-full text-xs font-mono font-bold p-1.5 rounded-lg border uppercase"
                        style={{ backgroundColor: theme.cardBg, borderColor: theme.borderColor, color: theme.textColor }}
                      />
                    </div>
                  </div>

                  {/* Grid Row Hover Background */}
                  <div className="p-3.5 rounded-2xl border space-y-2" style={{ backgroundColor: theme.siteBg, borderColor: theme.borderColor }}>
                    <label className="text-[11px] font-bold block">Row Hover Bg</label>
                    <div className="flex items-center gap-2">
                      <input 
                        type="color" 
                        value={theme.gridRowHoverBg || '#f8fafc'}
                        onChange={(e) => handleColorChange('gridRowHoverBg', e.target.value)}
                        className="h-8 w-10 rounded-lg cursor-pointer border-0 bg-transparent"
                      />
                      <input 
                        type="text"
                        value={theme.gridRowHoverBg || '#f8fafc'}
                        onChange={(e) => handleColorChange('gridRowHoverBg', e.target.value)}
                        className="w-full text-xs font-mono font-bold p-1.5 rounded-lg border uppercase"
                        style={{ backgroundColor: theme.cardBg, borderColor: theme.borderColor, color: theme.textColor }}
                      />
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: Presets */}
          {activeTab === 'preset' && (
            <div 
              className="p-6 rounded-3xl border shadow-sm space-y-4"
              style={{ backgroundColor: theme.cardBg, borderColor: theme.borderColor }}
            >
              <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: theme.borderColor }}>
                <h3 className="text-sm font-black uppercase tracking-wider flex items-center gap-2">
                  <Palette className="h-4.5 w-4.5" style={{ color: theme.primaryColor }} />
                  <span>Curated Pro UI Color Themes</span>
                </h3>
                <span className="text-[10px] font-bold uppercase opacity-60">WCAG AA Compliant</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {THEME_PRESETS.map((preset) => {
                  const isSelected = theme.sidebarBg === preset.sidebarBg && theme.siteBg === preset.siteBg;
                  return (
                    <div
                      key={preset.id || preset.name}
                      onClick={() => handleApplyPreset(preset)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden space-y-3 ${
                        isSelected ? 'ring-2' : 'hover:scale-[1.01]'
                      }`}
                      style={{
                        backgroundColor: preset.cardBg,
                        borderColor: isSelected ? preset.primaryColor : theme.borderColor,
                        ringColor: preset.primaryColor
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black" style={{ color: preset.textColor }}>
                          {preset.name}
                        </span>
                        {isSelected && (
                          <span 
                            className="p-1 rounded-full text-white text-[9px]"
                            style={{ backgroundColor: preset.primaryColor }}
                          >
                            <Check className="h-3 w-3" />
                          </span>
                        )}
                      </div>

                      {/* Color Bar Swatches */}
                      <div className="flex items-center h-6 rounded-xl overflow-hidden border" style={{ borderColor: preset.borderColor }}>
                        <div className="h-full flex-1" style={{ backgroundColor: preset.sidebarBg }} title="Sidebar" />
                        <div className="h-full flex-1" style={{ backgroundColor: preset.topHeaderBg }} title="Header" />
                        <div className="h-full flex-1" style={{ backgroundColor: preset.siteBg }} title="Site Background" />
                        <div className="h-full flex-1" style={{ backgroundColor: preset.cardBg }} title="Card Container" />
                        <div className="h-full flex-1" style={{ backgroundColor: preset.primaryColor }} title="Primary Accent" />
                      </div>

                      <div className="flex items-center justify-between text-[10px] font-bold" style={{ color: preset.textMutedColor }}>
                        <span>Text: {preset.textColor}</span>
                        <span>Accent: {preset.primaryColor}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: Typography & Text Sizes */}
          {activeTab === 'typography' && (
            <div 
              className="p-6 rounded-3xl border shadow-sm space-y-5"
              style={{ backgroundColor: theme.cardBg, borderColor: theme.borderColor }}
            >
              <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: theme.borderColor }}>
                <h3 className="text-sm font-black uppercase tracking-wider flex items-center gap-2">
                  <Type className="h-4.5 w-4.5" style={{ color: theme.primaryColor }} />
                  <span>Typography & Text Size Scaling</span>
                </h3>
                <span className="text-[10px] font-bold uppercase opacity-60">UI/UX Pro Max Scale</span>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold block">Select Application Base Font Size:</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {(['compact', 'normal', 'comfortable', 'xlarge'] as FontSizeScale[]).map((scale) => {
                    const isSelected = theme.fontSizeScale === scale;
                    return (
                      <button
                        key={scale}
                        onClick={() => setTheme({ ...theme, fontSizeScale: scale })}
                        className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                          isSelected ? 'ring-2' : 'hover:opacity-80'
                        }`}
                        style={{
                          backgroundColor: isSelected ? theme.primaryColor + '10' : theme.siteBg,
                          borderColor: isSelected ? theme.primaryColor : theme.borderColor,
                          color: theme.textColor
                        }}
                      >
                        <span className="block text-xs font-black uppercase tracking-wider">{scale}</span>
                        <span className="block text-[11px] font-mono mt-1 opacity-70">{getFontSizePx(scale)}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sample Paragraph Hierarchy */}
              <div className="p-4 rounded-2xl border space-y-2 mt-4" style={{ backgroundColor: theme.siteBg, borderColor: theme.borderColor }}>
                <span className="text-[10px] font-black uppercase tracking-wider block opacity-50">Font Scale Preview</span>
                <h4 className="font-black text-base" style={{ color: theme.textColor }}>
                  Diagnostic Result & Laboratory Records
                </h4>
                <p className="text-xs leading-relaxed" style={{ color: theme.textMutedColor }}>
                  Patient sample specimen #BML01964 processed under standard biochemistry protocol. All automated calibration assays verified AA compliant.
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Right 5 Columns: Interactive Live Mini-Preview Screen */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-black uppercase tracking-wider flex items-center gap-2 opacity-80">
              <Eye className="h-4 w-4" style={{ color: theme.primaryColor }} />
              <span>Real-Time LIMS UI Preview</span>
            </span>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border" style={{ borderColor: theme.borderColor }}>
              Base Font: {getFontSizePx(theme.fontSizeScale)}
            </span>
          </div>

          {/* Mini Mock LIMS Layout Frame */}
          <div 
            className="rounded-3xl border shadow-xl overflow-hidden flex flex-col h-[520px] transition-all relative font-sans"
            style={{
              backgroundColor: theme.siteBg,
              borderColor: theme.borderColor,
              fontSize: getFontSizePx(theme.fontSizeScale)
            }}
          >
            {/* Top Bar inside preview */}
            <div 
              className="h-11 px-4 border-b flex items-center justify-between shrink-0"
              style={{
                backgroundColor: theme.topHeaderBg,
                color: theme.topHeaderTextColor,
                borderColor: theme.borderColor
              }}
            >
              <div className="flex items-center gap-2">
                <CybeLogo variant="horizontal" size="sm" textColor={theme.topHeaderTextColor} accentColor={theme.primaryColor} />
              </div>
              <div className="flex items-center gap-2 text-[10px]">
                <span className="px-2 py-0.5 rounded-md font-mono" style={{ backgroundColor: theme.siteBg, color: theme.textColor }}>
                  {username || 'Doctor'}
                </span>
              </div>
            </div>

            {/* Body inside preview */}
            <div className="flex-1 flex overflow-hidden">
              
              {/* Sidebar inside preview */}
              <div 
                className="w-36 border-r flex flex-col justify-between shrink-0"
                style={{
                  backgroundColor: theme.sidebarBg,
                  color: theme.sidebarTextColor,
                  borderColor: theme.borderColor
                }}
              >
                <div>
                  {/* Dedicated Sidebar Header in Preview */}
                  <div 
                    className="p-2 border-b flex items-center min-h-[38px]"
                    style={{
                      backgroundColor: theme.sidebarHeaderBg || theme.sidebarBg,
                      color: theme.sidebarHeaderTextColor || theme.sidebarTextColor,
                      borderColor: theme.borderColor
                    }}
                  >
                    <div className={`flex items-center w-full ${
                      theme.logoPlacement === 'center' ? 'justify-center' :
                      theme.logoPlacement === 'right' ? 'justify-end' : 'justify-start'
                    }`}>
                      <CybeLogo 
                        variant={theme.logoVariant || "horizontal"} 
                        size="sm" 
                        textColor={theme.sidebarHeaderTextColor || theme.sidebarTextColor} 
                        accentColor={theme.logoAccentColor || theme.primaryColor || '#0284c7'} 
                      />
                    </div>
                  </div>

                  <div className="p-2.5 space-y-2">
                    <span className="text-[8px] font-black uppercase tracking-widest block opacity-60">Menu</span>
                    
                    <div 
                      className="p-2 rounded-xl text-[10px] font-bold flex items-center gap-1.5 shadow-xs"
                      style={{ 
                        backgroundColor: theme.sidebarActiveBg, 
                        color: theme.sidebarActiveTextColor || '#ffffff' 
                      }}
                    >
                      <Layout className="h-3 w-3" />
                      <span>Dashboard</span>
                    </div>

                    <div className="p-2 rounded-xl text-[10px] font-medium flex items-center gap-1.5" style={{ color: theme.sidebarTextColor }}>
                      <span>Intake Desk</span>
                    </div>

                    <div className="p-2 rounded-xl text-[10px] font-medium flex items-center gap-1.5" style={{ color: theme.sidebarTextColor }}>
                      <span>Lab Workflow</span>
                    </div>
                  </div>
                </div>

                <div 
                  className="p-1.5 rounded-lg border text-[8px] font-bold text-center"
                  style={{
                    backgroundColor: theme.sidebarHoverBg || 'rgba(255, 255, 255, 0.08)',
                    color: theme.sidebarTextColor,
                    borderColor: theme.borderColor
                  }}
                >
                  Collapse Sidebar
                </div>
              </div>

              {/* Workspace inside preview */}
              <div className="flex-1 p-3 overflow-y-auto space-y-3">
                
                {/* Stat Cards */}
                <div className="grid grid-cols-2 gap-2">
                  <div 
                    className="p-3 rounded-2xl border shadow-2xs space-y-1"
                    style={{ backgroundColor: theme.cardBg, borderColor: theme.borderColor }}
                  >
                    <span className="text-[9px] font-bold block" style={{ color: theme.textMutedColor }}>Today's Intake</span>
                    <span className="text-sm font-black block" style={{ color: theme.textColor }}>128 Patients</span>
                  </div>

                  <div 
                    className="p-3 rounded-2xl border shadow-2xs space-y-1"
                    style={{ backgroundColor: theme.cardBg, borderColor: theme.borderColor }}
                  >
                    <span className="text-[9px] font-bold block" style={{ color: theme.textMutedColor }}>Pending Lab</span>
                    <span className="text-sm font-black block" style={{ color: theme.primaryColor }}>14 Samples</span>
                  </div>
                </div>

                {/* Patient Record Card */}
                <div 
                  className="p-3 rounded-2xl border shadow-2xs space-y-2"
                  style={{ backgroundColor: theme.cardBg, borderColor: theme.borderColor }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black" style={{ color: theme.textColor }}>
                      Mr. TEST DUMMY
                    </span>
                    <span 
                      className="px-2 py-0.5 text-[8px] font-mono font-bold rounded-md text-white"
                      style={{ backgroundColor: theme.primaryColor }}
                    >
                      BML01964
                    </span>
                  </div>

                  <p className="text-[10px] font-semibold" style={{ color: theme.textMutedColor }}>
                    Panel: Fasting Blood Glucose Assay
                  </p>

                  <div className="flex items-center justify-between pt-1 border-t text-[9px]" style={{ borderColor: theme.borderColor }}>
                    <span style={{ color: theme.textMutedColor }}>Status: Ready</span>
                    <span className="font-bold" style={{ color: theme.textColor }}>₹10.00</span>
                  </div>
                </div>

                {/* Live Data Grid Table Preview */}
                <div 
                  className="rounded-2xl border p-2 shadow-2xs space-y-1.5"
                  style={{ backgroundColor: theme.cardBg, borderColor: theme.gridBorderColor || theme.borderColor }}
                >
                  <div className="text-[9px] font-black uppercase tracking-wider px-1 opacity-70" style={{ color: theme.textMutedColor }}>
                    Custom Grid Format Preview
                  </div>
                  <table 
                    className="w-full text-left text-[9px]"
                    style={{ borderCollapse: 'separate', borderSpacing: 0 }}
                  >
                    <thead>
                      <tr 
                        style={{ 
                          backgroundColor: theme.gridHeaderBg || '#f1f5f9', 
                          color: theme.gridHeaderTextColor || theme.textColor
                        }}
                      >
                        <th 
                          className="p-2 font-black uppercase tracking-wider"
                          style={{
                            borderTopLeftRadius: theme.gridHeaderRadius || '12px',
                            borderBottomLeftRadius: theme.gridHeaderRadius || '12px',
                          }}
                        >
                          Patient / Test
                        </th>
                        <th 
                          className="p-2 font-black uppercase tracking-wider text-right"
                          style={{
                            borderTopRightRadius: theme.gridHeaderRadius || '12px',
                            borderBottomRightRadius: theme.gridHeaderRadius || '12px',
                          }}
                        >
                          Fee
                        </th>
                      </tr>
                    </thead>
                    <tbody style={{ color: theme.textColor }}>
                      {/* Odd Row 1 */}
                      <tr 
                        className="transition-colors border-b"
                        style={{ 
                          backgroundColor: theme.cardBg,
                          borderColor: theme.gridBorderColor || theme.borderColor 
                        }}
                      >
                        <td className="p-2 font-semibold border-b" style={{ borderColor: theme.gridBorderColor || theme.borderColor }}>
                          BML01964 - Glucose Assay
                        </td>
                        <td className="p-2 font-bold text-right font-mono border-b" style={{ borderColor: theme.gridBorderColor || theme.borderColor }}>
                          ₹10.00
                        </td>
                      </tr>
                      {/* Even Row 2 - Alternate Color */}
                      <tr 
                        className="transition-colors border-b"
                        style={{ 
                          backgroundColor: theme.gridAltRowBg || 'rgba(0,0,0,0.03)',
                          borderColor: theme.gridBorderColor || theme.borderColor 
                        }}
                      >
                        <td className="p-2 font-semibold border-b" style={{ borderColor: theme.gridBorderColor || theme.borderColor }}>
                          BML01965 - Lipid Profile
                        </td>
                        <td className="p-2 font-bold text-right font-mono border-b" style={{ borderColor: theme.gridBorderColor || theme.borderColor }}>
                          ₹450.00
                        </td>
                      </tr>
                      {/* Odd Row 3 */}
                      <tr 
                        className="transition-colors"
                        style={{ backgroundColor: theme.cardBg }}
                      >
                        <td className="p-2 font-semibold">
                          BML01966 - Thyroid Panel (T3/T4/TSH)
                        </td>
                        <td className="p-2 font-bold text-right font-mono">
                          ₹650.00
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Primary Action Button preview */}
                <button 
                  className="w-full py-2 rounded-xl text-[10px] font-black text-white shadow-xs"
                  style={{ backgroundColor: theme.primaryColor }}
                >
                  + Register New Walk-in Patient
                </button>

              </div>

            </div>
          </div>

        </div>

      </div>

      {/* Floating Toast Notification */}
      {toast && (
        <div 
          className="fixed bottom-6 right-6 z-50 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-2.5 font-sans animate-fade-in text-xs font-black"
          style={{ backgroundColor: '#0f172a' }}
        >
          <CheckCircle2 className="h-5 w-5 text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}

    </div>
  );
}
