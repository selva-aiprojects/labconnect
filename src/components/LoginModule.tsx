/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, FormEvent } from 'react';
import { 
  Eye, EyeOff, Lock, User, AlertCircle, Sparkles, CheckCircle2, 
  HelpCircle, Sun, Moon, Loader2, RefreshCw, KeyRound, ArrowRight, ShieldCheck
} from 'lucide-react';
import { motion } from 'motion/react';
import { SupportedLanguage, TRANSLATIONS, LimsRole } from '../types/lims';
import { LanguageSelector } from './LanguageSelector';
import { SupportModal } from './SupportModal';
import { CybeLogo } from './CybeLogo';
import { getStoredThemeForUser } from '../utils/themeUtils';

interface LoginModuleProps {
  onLoginSuccess: (username: string, role: LimsRole, fullName: string) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onBackToLanding?: () => void;
}

export function LoginModule({ onLoginSuccess, darkMode, onToggleDarkMode, onBackToLanding }: LoginModuleProps) {
  const savedTheme = getStoredThemeForUser();
  const [lang, setLang] = useState<SupportedLanguage>('en');
  const t = TRANSLATIONS[lang];

  // Form states
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberUsername, setRememberUsername] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Interaction/UX states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successAnimation, setSuccessAnimation] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [forgotPasswordState, setForgotPasswordState] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState(false);

  // Field validation errors
  const [errors, setErrors] = useState<{ username?: string; password?: string; general?: string }>({});

  // Check for saved username in localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('lims_saved_username');
    if (saved) {
      setUsername(saved);
      setRememberUsername(true);
    }
  }, []);

  // Preset quick fill for stakeholder demo
  const fillDemoCredentials = (userType: 'receptionist' | 'phlebotomist' | 'admin') => {
    setErrors({});
    if (userType === 'receptionist') {
      setUsername('reception_demo');
      setPassword('lims123');
    } else if (userType === 'phlebotomist') {
      setUsername('phleb_demo');
      setPassword('lims123');
    } else {
      setUsername('admin_demo');
      setPassword('lims123');
    }
  };

  const handleClear = () => {
    setUsername('');
    setPassword('');
    setErrors({});
  };

  const validateForm = () => {
    const newErrors: { username?: string; password?: string } = {};
    
    if (!username.trim()) {
      newErrors.username = t.validationRequired;
    } else if (username.length < 4) {
      newErrors.username = t.validationMinLength;
    }

    if (!password) {
      newErrors.password = t.validationRequired;
    } else if (password.length < 4) {
      newErrors.password = t.validationMinLength;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (isSubmitting || successAnimation) return;

    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors({});

    // Simulate enterprise-grade secure federated/local login handshake
    setTimeout(() => {
      const lowerUser = username.trim().toLowerCase();
      
      // Supported roles check
      let detectedRole: LimsRole | null = null;
      let fullName = '';

      if (lowerUser === 'reception_demo' && password === 'lims123') {
        detectedRole = 'Receptionist';
        fullName = 'Sarah Jenkins';
      } else if (lowerUser === 'phleb_demo' && password === 'lims123') {
        detectedRole = 'Phlebotomist';
        fullName = 'Marcus Vance, CPT';
      } else if (lowerUser === 'admin_demo' && password === 'lims123') {
        detectedRole = 'Administrator';
        fullName = 'Dr. Alistair Sterling';
      } else if (lowerUser === 'admin' && password === 'admin') {
        // Simple admin backup
        detectedRole = 'Administrator';
        fullName = 'Super Admin';
      }

      if (detectedRole) {
        // Remember Username storage option
        if (rememberUsername) {
          localStorage.setItem('lims_saved_username', username.trim());
        } else {
          localStorage.removeItem('lims_saved_username');
        }

        setSuccessAnimation(true);
        setIsSubmitting(false);

        // Success transition delay
        setTimeout(() => {
          onLoginSuccess(username.trim(), detectedRole!, fullName);
        }, 1500);

      } else {
        setErrors({ general: t.credentialsError });
        setIsSubmitting(false);
      }
    }, 1800);
  };

  const handleForgotPasswordSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!forgotPasswordEmail.trim() || !forgotPasswordEmail.includes('@')) {
      alert('Please enter a valid enterprise email address.');
      return;
    }
    setForgotPasswordSuccess(true);
    setTimeout(() => {
      setForgotPasswordSuccess(false);
      setForgotPasswordState(false);
      setForgotPasswordEmail('');
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col justify-between transition-colors duration-300 font-sans">
      
      {/* Top Utility Nav bar */}
      <nav className="absolute top-0 right-0 left-0 flex items-center justify-between px-6 py-5 sm:px-10 z-30">
        <div className="hidden lg:flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.18em] text-zinc-400 dark:text-zinc-500">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          Central diagnostic hub
        </div>
        {/* Language selector */}
        <div className="flex items-center gap-3 ml-auto">
          <LanguageSelector currentLang={lang} onLanguageChange={setLang} />
        </div>
      </nav>

      {/* Main Container Layout */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-screen items-stretch overflow-hidden">
        
        {/* Left Side: Illustration / Brand area (Desktop only) */}
        <section className="hidden lg:flex lg:col-span-5 xl:col-span-6 bg-[#101827] text-white relative flex-col justify-between p-12 overflow-hidden border-r border-slate-800">
          {/* Diagnostic Grid Grid lines overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#263247_1px,transparent_1px),linear-gradient(to_bottom,#263247_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-25" />
          
          {/* Fluid medical/biological vector bubble accents */}
          <div className="absolute -top-12 -left-12 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 -right-24 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl" />

          {/* Top Brand Logo Container */}
          <div className={`relative z-10 py-2 flex items-center ${
            savedTheme.logoPlacement === 'center' ? 'justify-center' :
            savedTheme.logoPlacement === 'right' ? 'justify-end' : 'justify-start'
          }`}>
            <CybeLogo 
              variant={savedTheme.logoVariant || 'full'} 
              size="xl" 
              textColor="#f8fafc" 
              accentColor={savedTheme.logoAccentColor || "#0284c7"} 
            />
          </div>

          {/* Interactive Lab illustration / Mock dashboard mock-up */}
          <div className="relative z-10 my-auto max-w-lg space-y-8">
            <div className="p-8 bg-slate-900/70 border border-slate-700/80 backdrop-blur-md rounded-3xl shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 h-1.5 w-1/3 bg-sky-500 rounded-bl-full" />
              
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 text-sky-300 font-bold text-[10px] uppercase tracking-wider mb-5 border border-sky-500/30">
                <ShieldCheck className="h-3 w-3 text-sky-400" /> Controlled clinical access
              </span>
              
              <h2 id="banner-main-title" className="text-3xl font-extrabold tracking-tight leading-tight">
                Trusted access for every diagnostic decision.
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed font-normal mt-4">
                Enter the LabConnect command layer to monitor specimens, quality controls, approvals, and connected instruments from one governed workspace.
              </p>

              {/* Sample Metrics grid */}
              <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-indigo-900/40">
                <div>
                  <span className="block text-[10px] uppercase tracking-wider text-sky-400 font-bold">Processing SLA</span>
                  <span className="block text-xl font-black font-mono text-zinc-100 mt-1">99.98%</span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase tracking-wider text-sky-400 font-bold">Verified Tests</span>
                  <span className="block text-xl font-black font-mono text-zinc-100 mt-1">1.8M/mo</span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase tracking-wider text-sky-400 font-bold">Lab Latency</span>
                  <span className="block text-xl font-black font-mono text-zinc-100 mt-1">&lt;14ms</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer of split column */}
          <div className="relative z-10 text-[11px] text-indigo-300/60 font-semibold font-mono flex items-center justify-between">
            <span>&copy; 2026 Cybe: LabConnect Enterprise.</span>
            <span>W3C SECURE CERTIFIED</span>
          </div>
        </section>

        {/* Right Side: Sign-In Panel */}
        <section className="lg:col-span-7 xl:col-span-6 flex flex-col justify-center px-6 sm:px-12 lg:px-16 xl:px-24 py-12 relative">
          
          <div className="max-w-md w-full mx-auto space-y-8">
            
            {/* Header / Brand for Mobile Layout only */}
            <div className="block lg:hidden text-center space-y-2 mb-6">
              <div className={`flex items-center ${
                savedTheme.logoPlacement === 'center' ? 'justify-center' :
                savedTheme.logoPlacement === 'right' ? 'justify-end' : 'justify-start'
              }`}>
                <CybeLogo 
                  variant={savedTheme.logoVariant || 'full'} 
                  size="lg" 
                  accentColor={savedTheme.logoAccentColor || "#0284c7"} 
                />
              </div>
            </div>

            {/* Standard Header */}
            <div className="space-y-3 text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-2 text-[10px] font-black uppercase tracking-[0.18em] text-indigo-600 dark:text-indigo-400">
                <Lock className="h-3.5 w-3.5" /> Secure workspace access
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
                Sign in to LabConnect
              </h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed">
                {t.signInSub} Your session is protected by role-based access controls.
              </p>
            </div>

            {/* Main Interactive Login Panel Container */}
            <div className="bg-white dark:bg-zinc-900/50 p-6 sm:p-8 rounded-3xl border border-zinc-150 dark:border-zinc-800 shadow-xl shadow-zinc-100/40 dark:shadow-black/20">
              
              <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* General/Credentials Warning Banner */}
                {errors.general && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 rounded-xl text-xs flex items-start gap-2.5"
                  >
                    <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span className="font-medium leading-normal">{errors.general}</span>
                  </motion.div>
                )}

                {/* Username Box */}
                <div className="space-y-1.5 relative">
                  <label htmlFor="lims-username" className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wide flex items-center justify-between">
                    <span>{t.usernameLabel}</span>
                    {errors.username && <span className="text-[10px] text-rose-500 lowercase font-medium">{errors.username}</span>}
                  </label>
                  <div className="relative">
                    <input
                      id="lims-username"
                      type="text"
                      value={username}
                      onChange={(e) => {
                        setUsername(e.target.value);
                        if (errors.username) setErrors(prev => ({ ...prev, username: undefined }));
                      }}
                      placeholder="e.g. reception_demo"
                      className={`w-full bg-zinc-50 dark:bg-zinc-950 border text-sm text-zinc-900 dark:text-zinc-100 p-3 pl-10 rounded-2xl transition-all outline-none ${
                        errors.username 
                          ? 'border-rose-400 focus:ring-1 focus:ring-rose-400' 
                          : 'border-zinc-200 dark:border-zinc-800 focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'
                      }`}
                      disabled={isSubmitting || successAnimation}
                    />
                    <User className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-400" />
                  </div>
                </div>

                {/* Password Box */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label htmlFor="lims-password" className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wide">
                      {t.passwordLabel}
                    </label>
                    {errors.password && <span className="text-[10px] text-rose-500 font-medium">{errors.password}</span>}
                  </div>
                  <div className="relative">
                    <input
                      id="lims-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (errors.password) setErrors(prev => ({ ...prev, password: undefined }));
                      }}
                      placeholder="••••••••"
                      className={`w-full bg-zinc-50 dark:bg-zinc-950 border text-sm text-zinc-900 dark:text-zinc-100 p-3 pl-10 pr-10 rounded-2xl transition-all outline-none ${
                        errors.password 
                          ? 'border-rose-400 focus:ring-1 focus:ring-rose-400' 
                          : 'border-zinc-200 dark:border-zinc-800 focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'
                      }`}
                      disabled={isSubmitting || successAnimation}
                    />
                    <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-400" />
                    
                    {/* Hide/Show Toggle */}
                    <button
                      id="btn-toggle-password"
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3 p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-600 transition-colors cursor-pointer"
                      title="Toggle password view visibility"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Form Controls Row (Remember Username, Forgot Password) */}
                <div className="flex items-center justify-between text-xs py-1">
                  <label htmlFor="chk-remember-username" className="flex items-center gap-2 cursor-pointer text-zinc-600 dark:text-zinc-400 font-semibold select-none">
                    <input
                      id="chk-remember-username"
                      type="checkbox"
                      checked={rememberUsername}
                      onChange={(e) => setRememberUsername(e.target.checked)}
                      className="accent-indigo-600 h-4 w-4 rounded-lg border-zinc-300 cursor-pointer"
                      disabled={isSubmitting || successAnimation}
                    />
                    <span>{t.rememberUsername}</span>
                  </label>

                  <button
                    id="btn-forgot-password-trigger"
                    type="button"
                    onClick={() => {
                      setForgotPasswordState(true);
                      setForgotPasswordSuccess(false);
                    }}
                    className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline cursor-pointer"
                    disabled={isSubmitting || successAnimation}
                  >
                    {t.forgotPassword}
                  </button>
                </div>

                {/* Custom Forgot Password Sheet (Animated in-place drawer overlay) */}
                {forgotPasswordState && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="p-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-150 dark:border-zinc-800 rounded-2xl space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
                        <KeyRound className="h-3.5 w-3.5 text-indigo-500" /> Reset Password
                      </span>
                      <button 
                        id="btn-close-forgot"
                        type="button" 
                        onClick={() => setForgotPasswordState(false)} 
                        className="text-[10px] text-zinc-400 hover:text-zinc-600 font-bold"
                      >
                        Cancel
                      </button>
                    </div>

                    {forgotPasswordSuccess ? (
                      <div className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1.5 py-1">
                        <CheckCircle2 className="h-4 w-4" /> Reset link dispatched to enterprise email.
                      </div>
                    ) : (
                      <form onSubmit={handleForgotPasswordSubmit} className="flex gap-2">
                        <input
                          id="forgot-email-input"
                          type="email"
                          required
                          value={forgotPasswordEmail}
                          onChange={(e) => setForgotPasswordEmail(e.target.value)}
                          placeholder="Enter your registered email..."
                          className="flex-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs p-2.5 rounded-xl outline-none focus:border-indigo-500"
                        />
                        <button
                          id="btn-send-reset"
                          type="submit"
                          className="bg-indigo-600 text-white px-3 py-2.5 rounded-xl font-bold text-xs hover:bg-indigo-500 transition-colors"
                        >
                          Send Link
                        </button>
                      </form>
                    )}
                  </motion.div>
                )}

                {/* Form Buttons: LOGIN & CLEAR Combo */}
                <div className="grid grid-cols-4 gap-3 pt-2">
                  <button
                    id="btn-lims-login"
                    type="submit"
                    disabled={isSubmitting || successAnimation}
                    className="col-span-3 bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/10 cursor-pointer hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:bg-zinc-100 dark:disabled:bg-zinc-800 disabled:text-zinc-400 dark:disabled:text-zinc-500 disabled:-translate-y-0"
                  >
                    {successAnimation ? (
                      <>
                        <CheckCircle2 className="h-5 w-5 text-emerald-400 animate-bounce" />
                        <span>Verifying Session...</span>
                      </>
                    ) : isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>{t.loggingIn}</span>
                      </>
                    ) : (
                      <>
                        <span>{t.loginButton}</span>
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>

                  <button
                    id="btn-lims-clear"
                    type="button"
                    onClick={handleClear}
                    disabled={isSubmitting || successAnimation || (!username && !password)}
                    className="col-span-1 bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-950 dark:hover:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 rounded-2xl font-bold text-xs flex items-center justify-center transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    title="Clear login fields"
                  >
                    {t.clearButton}
                  </button>
                </div>

              </form>

            </div>

            {/* DEMO PROFILES PANEL: Super handy for stakeholder presentations! */}
            <div className="p-4 bg-zinc-100/70 dark:bg-zinc-900/70 border border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-3.5">
              <span className="text-[11px] font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5 text-indigo-500" /> Demo access profiles
              </span>
              <p className="text-[10px] text-zinc-500 dark:text-zinc-400 leading-normal font-medium">
                Use a controlled demo profile to preview a role-specific workspace.
              </p>
              <div className="grid grid-cols-3 gap-2">
                <button
                  id="btn-demo-reception"
                  onClick={() => fillDemoCredentials('receptionist')}
                  className="p-2.5 bg-white dark:bg-zinc-900 hover:bg-indigo-50/40 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-xl text-center cursor-pointer transition-all hover:border-indigo-300"
                >
                  <span className="block text-[10px] font-bold text-zinc-800 dark:text-zinc-200">Sarah J.</span>
                  <span className="block text-[8px] text-zinc-400 uppercase tracking-tight font-bold mt-0.5">Receptionist</span>
                </button>
                <button
                  id="btn-demo-phleb"
                  onClick={() => fillDemoCredentials('phlebotomist')}
                  className="p-2.5 bg-white dark:bg-zinc-900 hover:bg-indigo-50/40 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-xl text-center cursor-pointer transition-all hover:border-indigo-300"
                >
                  <span className="block text-[10px] font-bold text-zinc-800 dark:text-zinc-200">Marcus V.</span>
                  <span className="block text-[8px] text-zinc-400 uppercase tracking-tight font-bold mt-0.5">Phlebotomist</span>
                </button>
                <button
                  id="btn-demo-admin"
                  onClick={() => fillDemoCredentials('admin')}
                  className="p-2.5 bg-white dark:bg-zinc-900 hover:bg-indigo-50/40 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-xl text-center cursor-pointer transition-all hover:border-indigo-300"
                >
                  <span className="block text-[10px] font-bold text-zinc-800 dark:text-zinc-200">Dr. Sterling</span>
                  <span className="block text-[8px] text-zinc-400 uppercase tracking-tight font-bold mt-0.5">Lab Director</span>
                </button>
              </div>
            </div>

            {/* Support info and Back to Landing link */}
            <div className="flex items-center justify-center gap-4 text-xs font-bold text-zinc-500 dark:text-zinc-400">
              {onBackToLanding && (
                <button
                  onClick={onBackToLanding}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 hover:underline cursor-pointer"
                >
                  &larr; Back to Home
                </button>
              )}

              {onBackToLanding && <span>•</span>}

              <button
                id="btn-trigger-support"
                onClick={() => setIsSupportOpen(true)}
                className="hover:text-indigo-600 dark:hover:text-indigo-400 inline-flex items-center gap-1 hover:underline cursor-pointer"
              >
                <HelpCircle className="h-4 w-4" />
                <span>{t.supportHelp}</span>
              </button>
            </div>

          </div>
        </section>

      </main>

      {/* Progressive Support Disclosure Modal Overlay */}
      <SupportModal 
        isOpen={isSupportOpen} 
        onClose={() => setIsSupportOpen(false)} 
        lang={lang} 
      />

    </div>
  );
}
