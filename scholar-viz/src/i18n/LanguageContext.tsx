'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { en, zh, type Strings } from './strings';
import type { Lang } from '@/lib/disciplines';

export type Language = Lang;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Strings;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);
const translations: Record<Language, Strings> = { en, zh };

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Static export renders English; the saved or browser language applies after mount.
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const saved = localStorage.getItem('language');
    if (saved === 'en' || saved === 'zh') setLanguageState(saved);
    else if (navigator.language?.toLowerCase().startsWith('zh')) setLanguageState('zh');
  }, []);

  useEffect(() => {
    document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en';
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translations[language] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
  return context;
}
