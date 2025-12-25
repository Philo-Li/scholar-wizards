'use client';

import { ReactNode } from 'react';
import { LanguageProvider } from '@/i18n/LanguageContext';

export function Providers({ children }: { children: ReactNode }) {
  return <LanguageProvider>{children}</LanguageProvider>;
}
