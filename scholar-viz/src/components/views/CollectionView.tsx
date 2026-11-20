'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { fmt } from '@/i18n/strings';
import type { ScholarRow } from '@/lib/types';
import { formatInt } from '@/lib/stats';
import { Figure, Section } from '@/components/ui';
import { Leaderboard } from '@/components/Leaderboard';

export interface EarlyRow {
  id: string | null;
  name: string;
  institution: string;
  firstPubYear: number;
  earlyCareerCitations: number;
  totalCitations: number;
  earlyPct: number;
  topPaper: string;
  topPaperCitations: number;
}

export interface YoungRow {
  id: string | null;
  name: string;
  institution: string;
  firstPubYear: number;
  totalCitations: number;
  hIndex: number;
  topPaper: string;
}

function NameLink({ id, name }: { id: string | null; name: string }) {
  return id ? (
    <Link href={`/scholar/${id}`} className="font-serif text-[15.5px] text-ink hover:text-link">{name}</Link>
  ) : (
    <span className="font-serif text-[15.5px]">{name}</span>
  );
}

export function CollectionView({
  rows,
  early,
  young,
  fetchedAt,
}: {
  rows: ScholarRow[];
  early: EarlyRow[];
  young: YoungRow[];
  fetchedAt: string;
}) {
  const { t } = useLanguage();
  const c = t.collection;
  const top = [...early].sort((a, b) => b.earlyCareerCitations - a.earlyCareerCitations).slice(0, 15);
  const max = top[0]?.earlyCareerCitations ?? 1;
  const [hover, setHover] = useState<string | null>(null);

  return (
    <main className="max-w-page mx-auto px-5 sm:px-8">
      <header className="pt-12 pb-12 max-w-prose">
        <nav className="font-sans text-[13px] text-ink3">{t.nav.collection}</nav>
        <h1 className="mt-3 font-serif text-[44px] sm:text-[52px] leading-[1.05] font-semibold tracking-tight">{c.title}</h1>
        <p className="mt-5 text-[19px] leading-relaxed text-ink2">{fmt(c.lede, { n: rows.length })}</p>
        <p className="mt-3 font-sans text-[13px] text-ink3">{fmt(t.common.source, { date: fetchedAt })}</p>
      </header>

      <div className="space-y-24">
        <Section id="list" title={c.leaderboard}>
          <Leaderboard rows={rows} defaultSort="cites" />
        </Section>

        <Section id="early" title={c.earlyTitle} intro={c.earlyIntro}>
          <Figure n={1} title={c.earlyChartTitle} caption={c.earlyChartCaption}>
            <ul className="font-sans text-[13.5px] space-y-1.5 max-w-4xl">
              {top.map(r => (
                <li
                  key={r.name}
                  className="grid grid-cols-[minmax(8rem,13rem)_1fr_7.5rem] items-center gap-3"
                  onMouseEnter={() => setHover(r.name)}
                  onMouseLeave={() => setHover(null)}
                >
                  <span className="truncate">
                    {r.id ? <Link href={`/scholar/${r.id}`} className="hover:text-link">{r.name}</Link> : r.name}
                  </span>
                  <span className="h-3.5 block relative">
                    <span
                      className="block h-full rounded-r"
                      style={{ width: `${(r.earlyCareerCitations / max) * 100}%`, background: hover === r.name ? 'var(--series-2)' : 'var(--series-1)' }}
                    />
                  </span>
                  <span className="text-right tnum text-ink2">
                    {formatInt(r.earlyCareerCitations)} <span className="text-ink3">({r.earlyPct.toFixed(0)}%)</span>
                  </span>
                  {hover === r.name && (
                    <span className="col-span-3 text-[12.5px] text-ink3 -mt-0.5 mb-1">
                      {c.topPaper}: <span className="font-serif italic text-ink2">{r.topPaper}</span>
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </Figure>

          <div className="mt-14 overflow-x-auto">
            <table className="booktabs font-sans text-[14px] min-w-[760px]">
              <thead>
                <tr>
                  <th>{t.common.name}</th>
                  <th className="num">{t.common.firstPaper}</th>
                  <th className="num">{c.earlyCites}</th>
                  <th className="num">{c.earlyShare}</th>
                  <th>{c.topPaper}</th>
                </tr>
              </thead>
              <tbody>
                {[...early].sort((a, b) => b.earlyCareerCitations - a.earlyCareerCitations).map(r => (
                  <tr key={r.name}>
                    <td>
                      <NameLink id={r.id} name={r.name} />
                      <div className="text-[12.5px] text-ink3">{r.institution}</div>
                    </td>
                    <td className="num tnum">{r.firstPubYear}</td>
                    <td className="num tnum">{formatInt(r.earlyCareerCitations)}</td>
                    <td className="num tnum">{r.earlyPct.toFixed(1)}%</td>
                    <td className="font-serif italic text-[14px] text-ink2 max-w-[380px]">{r.topPaper}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section id="young" title={c.youngTitle} intro={c.youngIntro}>
          <div className="overflow-x-auto">
            <table className="booktabs font-sans text-[14px] min-w-[720px]">
              <thead>
                <tr>
                  <th>{t.common.name}</th>
                  <th className="num">{t.common.firstPaper}</th>
                  <th className="num">{t.common.hIndex}</th>
                  <th className="num">{t.common.citations}</th>
                  <th>{c.topPaper}</th>
                </tr>
              </thead>
              <tbody>
                {[...young].sort((a, b) => b.totalCitations - a.totalCitations).map(r => (
                  <tr key={r.name}>
                    <td>
                      <NameLink id={r.id} name={r.name} />
                      <div className="text-[12.5px] text-ink3">{r.institution}</div>
                    </td>
                    <td className="num tnum">{r.firstPubYear}</td>
                    <td className="num tnum">{r.hIndex}</td>
                    <td className="num tnum">{formatInt(r.totalCitations)}</td>
                    <td className="font-serif italic text-[14px] text-ink2 max-w-[380px]">{r.topPaper}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
      </div>
    </main>
  );
}
