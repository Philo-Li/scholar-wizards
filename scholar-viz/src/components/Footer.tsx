'use client';

import { useLanguage } from '@/i18n/LanguageContext';

export function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="border-t border-rule mt-24">
      <div className="max-w-page mx-auto px-5 sm:px-8 py-10 font-sans text-[13px] text-ink3 space-y-1">
        <p>{t.footer.line1}</p>
        <p>{t.footer.line2}</p>
      </div>
    </footer>
  );
}
