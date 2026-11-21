'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { fmt } from '@/i18n/strings';
import type { PersonCard } from '@/lib/people-types';
import { DISCIPLINES, DISCIPLINE_BY_SLUG } from '@/lib/disciplines';
import { THEMES, THEME_BY_SLUG } from '@/content/themes';
import { Figure } from '@/components/ui';
import { LifeLegend, LivesTimeline, lifeSpan } from '@/components/charts/PeopleCharts';

const selectClass =
  'font-sans text-[14px] bg-paper text-ink border border-rule rounded px-2.5 py-1.5 focus-visible:outline-2';

export function PeopleIndexView({ people }: { people: PersonCard[] }) {
  const { t, language: L } = useLanguage();
  const P = t.people;
  const [discipline, setDiscipline] = useState('');
  const [theme, setTheme] = useState('');

  const shown = useMemo(
    () => people.filter(p => (!discipline || p.disciplines.includes(discipline)) && (!theme || p.themes.includes(theme))),
    [people, discipline, theme],
  );
  const usedDisciplines = DISCIPLINES.filter(d => people.some(p => p.disciplines.includes(d.slug)));

  return (
    <main className="max-w-page mx-auto px-5 sm:px-8">
      <header className="pt-12 pb-10 max-w-prose">
        <h1 className="font-serif text-[42px] sm:text-[56px] leading-[1.04] font-semibold tracking-tight">{P.indexTitle}</h1>
        <p className="mt-5 text-[19px] leading-[1.6] text-ink2">{P.indexIntro}</p>
      </header>

      <div className="flex flex-wrap items-center gap-3 border-t border-rule pt-6 pb-2">
        <label className="sr-only" htmlFor="f-discipline">{P.disciplines}</label>
        <select id="f-discipline" className={selectClass} value={discipline} onChange={e => setDiscipline(e.target.value)}>
          <option value="">{P.allDisciplines}</option>
          {usedDisciplines.map(d => (
            <option key={d.slug} value={d.slug}>{d.name[L]}</option>
          ))}
        </select>
        <label className="sr-only" htmlFor="f-theme">{P.inChapters}</label>
        <select id="f-theme" className={selectClass} value={theme} onChange={e => setTheme(e.target.value)}>
          <option value="">{P.allChapters}</option>
          {THEMES.map(th => (
            <option key={th.slug} value={th.slug}>{th.title[L]}</option>
          ))}
        </select>
        <span className="font-sans text-[13.5px] text-ink3 tnum">{fmt(P.shown, { n: shown.length })}</span>
      </div>

      <section className="pt-6">
        <Figure n={1} title={P.timelineTitle} caption={P.timelineCaption}>
          <LifeLegend />
          <div className="overflow-x-auto">
            <div className="min-w-[640px]">
              <LivesTimeline people={shown} />
            </div>
          </div>
        </Figure>
      </section>

      <section className="mt-16">
        <ul className="grid md:grid-cols-2 gap-x-14 border-t border-rulestrong">
          {shown.map(p => (
            <li key={p.slug} className="py-5 border-b border-rule">
              <Link href={`/people/${p.slug}`} className="font-serif text-[19px] font-semibold text-ink hover:text-link">{p.name[L]}</Link>
              <div className="mt-0.5 font-sans text-[13px] text-ink3 tnum">
                {lifeSpan(p, P.bornOnly)}
                <span className="ml-3">{p.disciplines.map(d => DISCIPLINE_BY_SLUG[d]?.name[L] ?? d).join(L === 'zh' ? '、' : ', ')}</span>
              </div>
              <p className="mt-2 text-[15.5px] leading-[1.55] text-ink2">{p.why[L]}</p>
              <p className="mt-2 font-sans text-[12.5px] text-ink3">
                {p.themes.filter(th => THEME_BY_SLUG[th]).map((th, i) => (
                  <span key={th}>
                    {i > 0 && (L === 'zh' ? '、' : ', ')}
                    <Link href={`/themes/${th}`} className="hover:text-ink">{THEME_BY_SLUG[th].title[L]}</Link>
                  </span>
                ))}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
