'use client';

import Link from 'next/link';
import { useLanguage } from '@/i18n/LanguageContext';
import { LESSONS } from '@/content/lessons';
import type { Bi } from '@/lib/people-types';

export interface LessonExample {
  slug: string;
  name: Bi;
  text: Bi;
}

export function LessonsView({ examples }: { examples: Record<string, LessonExample[]> }) {
  const { t, language: L } = useLanguage();
  const P = t.people;
  return (
    <main className="max-w-page mx-auto px-5 sm:px-8">
      <header className="pt-12 pb-12 max-w-prose">
        <h1 className="font-serif text-[42px] sm:text-[56px] leading-[1.04] font-semibold tracking-tight">{P.lessonsTitle}</h1>
        <p className="mt-5 text-[19px] leading-[1.6] text-ink2">{P.lessonsIntro}</p>
        <nav className="mt-8">
          <ol className="font-serif text-[17px] leading-[1.9] list-decimal pl-6 marker:text-ink3 marker:font-sans marker:text-[14px]">
            {LESSONS.map(l => (
              <li key={l.key}>
                <a href={`#${l.key}`} className="hover:text-link">{l.title[L]}</a>
              </li>
            ))}
          </ol>
        </nav>
      </header>

      <div className="space-y-20">
        {LESSONS.map((l, i) => {
          const ex = examples[l.key] ?? [];
          return (
            <section key={l.key} id={l.key} className="scroll-mt-20 border-t border-rule pt-8 grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-x-16 gap-y-6">
              <div className="max-w-prose">
                <h2 className="font-serif text-[27px] leading-tight font-semibold tracking-tight">
                  <span className="font-sans text-[15px] font-normal text-ink3 mr-3 tnum">{i + 1}</span>
                  {l.title[L]}
                </h2>
                <p className="mt-4 text-[18px] leading-[1.7]">{l.body[L]}</p>
              </div>
              {ex.length > 0 && (
                <ul className="space-y-5 lg:pt-2">
                  {ex.map(e => (
                    <li key={e.slug}>
                      <Link href={`/people/${e.slug}`} className="font-serif text-[17px] font-semibold text-ink hover:text-link">{e.name[L]}</Link>
                      <p className="mt-1 text-[15.5px] leading-[1.6] text-ink2">{e.text[L]}</p>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          );
        })}
      </div>
    </main>
  );
}
