/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { LimsRole } from './types/lims';
import { LoginModule } from './components/LoginModule';
import { DashboardModule } from './components/DashboardModule';
import { getStoredThemeForUser, applyThemeToDocument } from './utils/themeUtils';

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [session, setSession] = useState<{
    isLoggedIn: boolean;
    username: string;
    role: LimsRole;
    fullName: string;
  }>({
    isLoggedIn: false,
    username: '',
    role: 'Receptionist',
    fullName: ''
  });

  // Apply Tailwind dark mode class to HTML element on mount and theme state change
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkMode]);

  // Load user theme whenever session user changes
  useEffect(() => {
    const userTheme = getStoredThemeForUser(session.username);
    applyThemeToDocument(userTheme);
  }, [session.username]);

  // Restore session from localStorage if present
  useEffect(() => {
    const savedSession = localStorage.getItem('lims_session');
    if (savedSession) {
      try {
        const parsed = JSON.parse(savedSession);
        setSession({
          isLoggedIn: true,
          username: parsed.username,
          role: parsed.role,
          fullName: parsed.fullName
        });
      } catch (e) {
        localStorage.removeItem('lims_session');
      }
    }
  }, []);

  const handleLoginSuccess = (username: string, role: LimsRole, fullName: string) => {
    const newSession = {
      isLoggedIn: true,
      username,
      role,
      fullName
    };
    setSession(newSession);
    localStorage.setItem('lims_session', JSON.stringify(newSession));
    
    // Auto restore user's saved theme upon login
    const userTheme = getStoredThemeForUser(username);
    applyThemeToDocument(userTheme);
  };

  const handleLogout = () => {
    setSession({
      isLoggedIn: false,
      username: '',
      role: 'Receptionist',
      fullName: ''
    });
    localStorage.removeItem('lims_session');
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      {session.isLoggedIn ? (
        <DashboardModule
          username={session.username}
          role={session.role}
          fullName={session.fullName}
          onLogout={handleLogout}
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode(!darkMode)}
        />
      ) : (
        <LoginModule
          onLoginSuccess={handleLoginSuccess}
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode(!darkMode)}
        />
      )}
    </div>
  );
}
