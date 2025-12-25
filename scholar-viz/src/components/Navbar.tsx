'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'zh' : 'en');
  };

  return (
    <nav className="bg-white text-gray-800 shadow-md sticky top-0 z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and site name */}
          <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900">{t.nav.siteName}</span>
          </Link>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-gray-600 hover:text-indigo-600 transition-colors text-sm font-medium"
            >
              {t.nav.dashboard}
            </Link>
            <Link
              href="/#ranking-matrix"
              className="text-gray-600 hover:text-indigo-600 transition-colors text-sm font-medium"
            >
              {t.nav.rankings}
            </Link>
            <Link
              href="/#early-career"
              className="text-gray-600 hover:text-indigo-600 transition-colors text-sm font-medium"
            >
              {t.nav.earlyCareer}
            </Link>
            <Link
              href="/#youngest"
              className="text-gray-600 hover:text-indigo-600 transition-colors text-sm font-medium"
            >
              {t.nav.risingStars}
            </Link>
            <div className="h-6 w-px bg-gray-300" />
            <span className="text-xs text-indigo-600 bg-indigo-50 px-2 py-1 rounded font-medium">
              {t.nav.scholarsCount}
            </span>
            <button
              onClick={toggleLanguage}
              className="px-3 py-1.5 text-sm font-medium bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center gap-1"
              title={language === 'en' ? 'Switch to Chinese' : '切换到英文'}
            >
              <span className={language === 'en' ? 'text-indigo-600 font-bold' : 'text-gray-400'}>EN</span>
              <span className="text-gray-300">|</span>
              <span className={language === 'zh' ? 'text-indigo-600 font-bold' : 'text-gray-400'}>中</span>
            </button>
            <a
              href="https://github.com/Philo-Li/scholar-wizards"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-1.5 text-sm font-medium bg-gray-800 hover:bg-gray-900 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              GitHub
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleLanguage}
              className="px-2 py-1 text-sm font-medium bg-gray-100 hover:bg-gray-200 rounded transition-colors"
            >
              {language === 'en' ? '中' : 'EN'}
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col gap-2">
              <Link
                href="/"
                className="px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-700"
                onClick={() => setIsMenuOpen(false)}
              >
                {t.nav.dashboard}
              </Link>
              <Link
                href="/#ranking-matrix"
                className="px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-700"
                onClick={() => setIsMenuOpen(false)}
              >
                {t.nav.rankings}
              </Link>
              <Link
                href="/#early-career"
                className="px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-700"
                onClick={() => setIsMenuOpen(false)}
              >
                {t.nav.earlyCareer}
              </Link>
              <Link
                href="/#youngest"
                className="px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-700"
                onClick={() => setIsMenuOpen(false)}
              >
                {t.nav.risingStars}
              </Link>
              <a
                href="https://github.com/Philo-Li/scholar-wizards"
                target="_blank"
                rel="noopener noreferrer"
                className="mx-4 mt-2 px-4 py-2 text-sm font-medium bg-gray-800 hover:bg-gray-900 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
                GitHub
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
