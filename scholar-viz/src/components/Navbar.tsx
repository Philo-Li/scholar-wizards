'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/i18n/LanguageContext';

export function Navbar() {
  const { language, setLanguage, t } = useLanguage();
  const path = usePathname();

  const links = [
    { href: '/', label: t.nav.themes, active: path === '/' || path.startsWith('/themes') },
    { href: '/people', label: t.nav.people, active: path.startsWith('/people') },
    { href: '/lessons', label: t.nav.lessons, active: path.startsWith('/lessons') },
    {
      href: '/disciplines',
      label: t.nav.data,
      active: ['/disciplines', '/field', '/scholar', '/collections'].some(p => path.startsWith(p)),
    },
    { href: '/methods', label: t.nav.methods, active: path.startsWith('/methods') },
  ];

  return (
    <header className="border-b border-rule bg-paper/95 backdrop-blur sticky top-0 z-40">
      <nav className="max-w-page mx-auto px-5 sm:px-8 min-h-14 py-2 sm:py-0 flex flex-wrap items-center gap-x-6 gap-y-1 font-sans text-[14px]">
        <Link href="/" className="font-serif text-[19px] font-semibold tracking-tight text-ink mr-auto">
          {t.nav.site}
        </Link>
        <ul className="order-last sm:order-none w-full sm:w-auto flex items-center gap-5 sm:gap-6 overflow-x-auto whitespace-nowrap pb-1 sm:pb-0">
          {links.map(l => (
            <li key={l.href}>
              <Link
                href={l.href}
                aria-current={l.active ? 'page' : undefined}
                className={l.active ? 'text-ink font-medium' : 'text-ink2 hover:text-ink'}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={() => setLanguage(language === 'en' ? 'zh' : 'en')}
          aria-label={t.nav.languageLabel}
          title={t.nav.languageLabel}
          className="text-ink2 hover:text-ink border border-rule rounded px-2 py-0.5"
        >
          {t.nav.language}
        </button>
        <a
          href="https://github.com/Philo-Li/scholar-wizards"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
          className="text-ink2 hover:text-ink hidden sm:block"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
          </svg>
        </a>
      </nav>
    </header>
  );
}
