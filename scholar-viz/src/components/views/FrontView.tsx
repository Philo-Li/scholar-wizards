'use client';

import Link from 'next/link';
import { useLanguage } from '@/i18n/LanguageContext';
import { fmt } from '@/i18n/strings';
import type { PersonCard } from '@/lib/people-types';
import { ALL_THEMES } from '@/content/themes';
import { LESSONS } from '@/content/lessons';
import { Figure } from '@/components/ui';
import { AgeDots } from '@/components/charts/PeopleCharts';

export interface FrontChapter {
  slug: string;
  count: number;
  people: { slug: string; name: { en: string; zh: string } }[];
}

export function FrontView({
  people,
  chapters,
  annotate,
  disciplines,
}: {
  people: PersonCard[];
  chapters: FrontChapter[];
  annotate: string[];
  disciplines: number;
}) {
  const { t, language } = useLanguage();
  const F = t.front;
  const themeBySlug = Object.fromEntries(ALL_THEMES.map(th => [th.slug, th]));

  return (
    <main className="max-w-page mx-auto px-5 sm:px-8">
      <header className="pt-16 sm:pt-24 pb-14 max-w-[44rem]">
        <h1 className="font-serif text-[46px] sm:text-[68px] leading-[1.02] font-semibold tracking-[-0.02em]">
          {F.title}
        </h1>
        <p className="mt-7 text-[20px] sm:text-[22px] leading-[1.6] text-ink2">{F.lede}</p>
        <p className="mt-6 text-[16px] leading-relaxed text-ink3 italic">{F.modelNote}</p>
        <p className="mt-5 font-sans text-[14px] text-ink3 tnum">
          {fmt(F.stats, { people: people.length, themes: chapters.length, disciplines })}
        </p>
      </header>

      <section className="border-t border-rule pt-10">
        <Figure
          n={1}
          title={F.ageFigTitle}
          caption={fmt(F.ageFigCaption, { min: Math.min(...people.map(p => p.keyAge)), max: Math.max(...people.map(p => p.keyAge)) })}
        >
          <AgeDots people={people} annotate={annotate} />
        </Figure>
      </section>

      <section id="chapters" className="mt-24 scroll-mt-20">
        <h2 className="font-serif text-[30px] font-semibold tracking-tight">{F.chaptersTitle}</h2>
        <p className="mt-3 max-w-prose text-[17px] leading-relaxed text-ink2">{F.chaptersIntro}</p>
        <ol className="mt-8 border-t border-rulestrong">
          {chapters.map(c => {
            const th = themeBySlug[c.slug];
            const shown = c.people.slice(0, 6);
            return (
              <li key={c.slug} className="grid md:grid-cols-[minmax(0,18rem)_minmax(0,1fr)] gap-x-10 gap-y-2 py-6 border-b border-rule">
                <div>
                  <Link href={`/themes/${c.slug}`} className="font-serif text-[22px] leading-snug font-semibold text-ink hover:text-link">
                    {th.title[language]}
                  </Link>
                  <div className="mt-1 font-sans text-[13px] text-ink3 tnum">{fmt(F.peopleCount, { n: c.count })}</div>
                </div>
                <div>
                  <p className="text-[17px] leading-relaxed text-ink2 max-w-prose">{th.tagline[language]}</p>
                  {shown.length > 0 && (
                    <p className="mt-2 text-[15px] leading-relaxed text-ink3">
                      {shown.map((p, i) => (
                        <span key={p.slug}>
                          {i > 0 && (language === 'zh' ? '、' : ', ')}
                          <Link href={`/people/${p.slug}`} className="hover:text-link">{p.name[language]}</Link>
                        </span>
                      ))}
                      {c.people.length > shown.length && (language === 'zh' ? ' 等' : ' and others')}
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
        <p className="mt-6 font-sans text-[14.5px]">
          <Link href="/people" className="link">{F.allPeople}</Link>
        </p>
      </section>

      <section className="mt-24">
        <h2 className="font-serif text-[30px] font-semibold tracking-tight">{F.lessonsTitle}</h2>
        <p className="mt-3 max-w-prose text-[17px] leading-relaxed text-ink2">{F.lessonsIntro}</p>
        <div className="mt-8 grid md:grid-cols-3 gap-10 md:gap-12">
          {LESSONS.slice(0, 3).map(l => (
            <div key={l.key} className="border-t border-rule pt-4">
              <h3 className="font-serif text-[19px] font-semibold">{l.title[language]}</h3>
              <p className="mt-2 text-[16.5px] leading-relaxed text-ink2">{l.body[language]}</p>
            </div>
          ))}
        </div>
        <p className="mt-8 font-sans text-[14.5px]">
          <Link href="/lessons" className="link">{F.readLessons}</Link>
        </p>
      </section>

      <section className="mt-24 border-t border-rule pt-10 max-w-prose">
        <h2 className="font-serif text-[24px] font-semibold tracking-tight">{F.dataTitle}</h2>
        <p className="mt-3 text-[17px] leading-relaxed text-ink2">{F.dataIntro}</p>
        <p className="mt-4 font-sans text-[14.5px]">
          <Link href="/disciplines" className="link">{F.openData}</Link>
        </p>
      </section>
    </main>
  );
}
