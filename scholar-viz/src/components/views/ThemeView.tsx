'use client';

import Link from 'next/link';
import { useLanguage } from '@/i18n/LanguageContext';
import { fmt } from '@/i18n/strings';
import type { PersonCard } from '@/lib/people-types';
import { DISCIPLINE_BY_SLUG } from '@/lib/disciplines';
import { ALL_THEMES, THEME_BY_SLUG } from '@/content/themes';
import { formatInt } from '@/lib/stats';
import { Figure } from '@/components/ui';
import { LifeChart, LifeLegend, lifeSpan } from '@/components/charts/PeopleCharts';

export interface RisingRow {
  id: string;
  name: string;
  inst: string | null;
  slug: string;
  first: number;
  h: number;
  cites: number;
  m: number;
  rank: number;
  n: number;
}

function ThemeHeader({ slug }: { slug: string }) {
  const { t, language: L } = useLanguage();
  const th = THEME_BY_SLUG[slug];
  return (
    <header className="pt-12 pb-12 max-w-prose">
      <nav className="font-sans text-[13px] text-ink3">
        <Link href="/#chapters" className="hover:text-ink">{t.front.chaptersTitle}</Link>
      </nav>
      <h1 className="mt-3 font-serif text-[42px] sm:text-[56px] leading-[1.04] font-semibold tracking-tight">{th.title[L]}</h1>
      <p className="mt-5 font-serif text-[22px] leading-[1.5] text-ink2">{th.tagline[L]}</p>
      <div className="mt-8 space-y-5">
        {th.intro.map((para, i) => (
          <p key={i} className="text-[18px] leading-[1.7]">{para[L]}</p>
        ))}
      </div>
      <div className="mt-8 border-l-2 border-rulestrong pl-5">
        <h2 className="font-sans text-[14px] font-medium text-ink3">{t.people.themeCriteria}</h2>
        <p className="mt-1.5 text-[16.5px] leading-relaxed">{th.criteria[L]}</p>
      </div>
    </header>
  );
}

function OtherChapters({ slug }: { slug: string }) {
  const { t, language: L } = useLanguage();
  return (
    <section className="mt-24 border-t border-rule pt-8">
      <h2 className="font-serif text-[21px] font-semibold">{t.people.otherChapters}</h2>
      <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 font-serif text-[17px]">
        {ALL_THEMES.filter(th => th.slug !== slug).map(th => (
          <li key={th.slug}>
            <Link href={`/themes/${th.slug}`} className="link">{th.title[L]}</Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function ThemeView({ slug, people, median }: { slug: string; people: PersonCard[]; median: number }) {
  const { t, language: L } = useLanguage();
  const P = t.people;
  const th = THEME_BY_SLUG[slug];
  const byAge = [...people].sort((a, b) => a.keyAge - b.keyAge);

  return (
    <main className="max-w-page mx-auto px-5 sm:px-8">
      <ThemeHeader slug={slug} />

      <section className="border-t border-rule pt-10">
        <Figure n={1} title={P.themeFigure} caption={th.figureNote[L]}>
          <LifeLegend />
          <LifeChart people={byAge} median={median} />
        </Figure>
      </section>

      <section className="mt-20">
        <h2 className="font-serif text-[28px] font-semibold tracking-tight">{P.themePeople}</h2>
        <ul className="mt-6 border-t border-rulestrong">
          {people.map(p => (
            <li key={p.slug} className="py-6 border-b border-rule grid grid-cols-[4rem_minmax(0,1fr)] sm:grid-cols-[5rem_minmax(0,1fr)] gap-x-5 sm:gap-x-7">
              <Link href={`/people/${p.slug}`} aria-hidden tabIndex={-1} className="block">
                {p.portrait ? (
                  <img src={p.portrait} alt="" loading="lazy" className="w-full aspect-[4/5] object-cover object-top bg-sunk border border-rule" />
                ) : (
                  <div className="w-full aspect-[4/5] bg-sunk border border-rule" />
                )}
              </Link>
              <div className="max-w-prose">
                <Link href={`/people/${p.slug}`} className="font-serif text-[21px] leading-snug font-semibold text-ink hover:text-link">
                  {p.name[L]}
                </Link>
                <div className="mt-0.5 font-sans text-[13px] text-ink3 tnum">
                  {lifeSpan(p, P.bornOnly)}
                  <span className="ml-3">{p.disciplines.map(d => DISCIPLINE_BY_SLUG[d]?.name[L] ?? d).join(L === 'zh' ? '、' : ', ')}</span>
                </div>
                <p className="mt-2 text-[16.5px] leading-[1.6] text-ink2">{p.why[L]}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <OtherChapters slug={slug} />
    </main>
  );
}

export function RisingView({ rows }: { rows: RisingRow[] }) {
  const { t, language: L } = useLanguage();
  const P = t.people;
  return (
    <main className="max-w-page mx-auto px-5 sm:px-8">
      <ThemeHeader slug="rising" />
      <section className="border-t border-rule pt-10">
        <h2 className="font-serif text-[24px] font-semibold tracking-tight">{P.risingTable}</h2>
        <div className="mt-6 overflow-x-auto">
          <table className="booktabs min-w-[720px]">
            <thead className="font-sans text-[13.5px]">
              <tr>
                <th>{P.colDiscipline}</th>
                <th>{P.colName}</th>
                <th className="num">{P.colFirst}</th>
                <th className="num">{t.common.hIndex}</th>
                <th className="num">{t.common.mQuotient}</th>
                <th className="num">{t.common.citations}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={r.id}>
                  <td className="font-sans text-[14px] text-ink2 align-top">
                    {(i === 0 || rows[i - 1].slug !== r.slug) && (
                      <Link href={`/field/${r.slug}`} className="hover:text-link">{DISCIPLINE_BY_SLUG[r.slug].name[L]}</Link>
                    )}
                  </td>
                  <td>
                    <Link href={`/scholar/${r.id}`} className="font-serif text-[16px] text-ink hover:text-link">{r.name}</Link>
                    <div className="font-sans text-[12.5px] text-ink3 max-w-[22rem] truncate">{r.inst}</div>
                    <div className="font-sans text-[12.5px] text-ink2">
                      {fmt(P.risingWhy, { m: r.m.toFixed(2), rank: r.rank, n: r.n, field: DISCIPLINE_BY_SLUG[r.slug].name[L] })}
                    </div>
                  </td>
                  <td className="num font-sans text-[14px] tnum align-top">{r.first}</td>
                  <td className="num font-sans text-[14px] tnum align-top">{r.h}</td>
                  <td className="num font-sans text-[14px] tnum align-top">{r.m.toFixed(2)}</td>
                  <td className="num font-sans text-[14px] tnum align-top">{formatInt(r.cites)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <OtherChapters slug="rising" />
    </main>
  );
}
