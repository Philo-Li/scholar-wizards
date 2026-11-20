'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { fmt } from '@/i18n/strings';
import { DISCIPLINES, DISCIPLINE_BY_SLUG, subfieldName } from '@/lib/disciplines';
import type { FieldSummary } from '@/lib/summaries';
import { Figure, Section, Stat } from '@/components/ui';
import { Leaderboard } from '@/components/Leaderboard';
import {
  CareerScatter,
  ConcentrationCurve,
  RangePlot,
  RankedBars,
  TrajectoryGrid,
  captionGini,
} from '@/components/charts/FieldCharts';

const SECTION_IDS = ['overview', 'leaderboard', 'career', 'concentration', 'subfields', 'geography', 'trajectories', 'rising', 'notes'] as const;

export function FieldView({ summary: s }: { summary: FieldSummary }) {
  const { t, language } = useLanguage();
  const d = DISCIPLINE_BY_SLUG[s.slug];
  const active = useActiveSection();

  return (
    <main className="max-w-page mx-auto px-5 sm:px-8">
      <header className="pt-12 pb-10 max-w-prose">
        <nav className="font-sans text-[13px] text-ink3">
          <Link href="/" className="hover:text-ink">{t.field.breadcrumb}</Link>
        </nav>
        <h1 className="mt-3 font-serif text-[44px] sm:text-[52px] leading-[1.05] font-semibold tracking-tight">
          {d.name[language]}
        </h1>
        <p className="mt-5 text-[19px] leading-relaxed text-ink2">{d.scope[language]}</p>
        <p className="mt-3 font-sans text-[13px] text-ink3">{fmt(t.common.source, { date: s.fetchedAt })}</p>
      </header>

      <div className="lg:grid lg:grid-cols-[180px_minmax(0,1fr)] lg:gap-14">
        <aside className="hidden lg:block">
          <nav className="sticky top-24 font-sans text-[13.5px]" aria-label={t.field.onThisPage}>
            <p className="text-ink3 mb-3">{t.field.onThisPage}</p>
            <ul className="space-y-2 border-l border-rule">
              {SECTION_IDS.map(id => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    className={`block -ml-px pl-3 border-l-2 ${active === id ? 'border-ink text-ink' : 'border-transparent text-ink2 hover:text-ink'}`}
                  >
                    {t.field.sections[id]}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <div className="space-y-24 min-w-0">
          <Section id="overview" title={t.field.sections.overview}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-8 border-t border-rule pt-6">
              <Stat value={s.n} label={t.field.statScholars} />
              <Stat value={Math.round(s.medianH)} label={t.field.statMedianH} />
              <Stat value={Math.round(s.medianAge)} label={t.field.statMedianAge} />
              <Stat value={`${Math.round(s.top10 * 100)}%`} label={t.field.statTop10} />
            </div>
          </Section>

          <Section id="leaderboard" title={t.field.sections.leaderboard} intro={t.field.leaderboardIntro}>
            <Leaderboard rows={s.core} />
          </Section>

          <Section id="career" title={t.field.sections.career}>
            <Figure n={1} title={t.field.careerTitle} caption={t.field.careerCaption}>
              <CareerScatter rows={[...s.core.filter(r => !r.hyper), ...s.rising]} />
            </Figure>
          </Section>

          <Section id="concentration" title={t.field.sections.concentration}>
            <div className="grid md:grid-cols-[minmax(0,440px)_1fr] gap-10 items-start">
              <Figure n={2} title={t.field.concentrationTitle}>
                <ConcentrationCurve points={s.curve} />
              </Figure>
              <p className="text-[16px] leading-relaxed text-ink2 max-w-prose md:pt-12">
                {captionGini(t.field.concentrationCaption, s.gini, s.top10)}
              </p>
            </div>
          </Section>

          {s.subfields.length >= 2 && (
            <Section id="subfields" title={t.field.sections.subfields}>
              <Figure
                n={3}
                title={t.field.subfieldsTitle}
                caption={t.field.subfieldsCaption}
                table={<SubfieldTable s={s} />}
              >
                <RangePlot rows={s.subfields} metricLabel={t.common.hIndex} />
              </Figure>
            </Section>
          )}

          <Section id="geography" title={t.field.sections.geography}>
            <div className="grid md:grid-cols-2 gap-12">
              <Figure n={4} title={t.field.countriesTitle} caption={t.field.countriesCaption}>
                <RankedBars items={s.countries} kind="country" />
              </Figure>
              <Figure n={5} title={t.field.institutionsTitle} caption={t.field.institutionsCaption}>
                <RankedBars items={s.institutions} kind="plain" />
              </Figure>
            </div>
          </Section>

          <Section id="trajectories" title={t.field.sections.trajectories}>
            <Figure n={6} title={t.field.trajectoriesTitle} caption={t.field.trajectoriesCaption}>
              <TrajectoryGrid items={s.trajectories} />
            </Figure>
          </Section>

          <Section id="rising" title={t.field.sections.rising} intro={t.field.risingIntro}>
            <Leaderboard rows={s.rising} defaultSort="cites" pageSize={20} />
          </Section>

          <Section id="notes" title={t.field.sections.notes} intro={t.field.notesIntro}>
            <ol className="max-w-prose space-y-4 text-[17px] leading-relaxed list-decimal pl-6 marker:text-ink3 marker:font-sans marker:text-[14px]">
              {d.notes.map((n, i) => (
                <li key={i} className="pl-1">
                  {n[language]}
                  {s.slug === 'neuroscience' && i === d.notes.length - 1 && (
                    <>
                      {' '}
                      <Link href="/collections/computational-neuroscience" className="link">
                        {t.home.openCollection}
                      </Link>
                    </>
                  )}
                </li>
              ))}
              {s.hyperCount > 0 && <li className="pl-1">{fmt(t.field.hyperCount, { n: s.hyperCount })}</li>}
            </ol>
          </Section>

          <nav className="border-t border-rule pt-8 font-sans text-[14px]">
            <p className="text-ink3 mb-3">{t.nav.disciplines}</p>
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {DISCIPLINES.filter(x => x.slug !== s.slug).map(x => (
                <li key={x.slug}>
                  <Link href={`/field/${x.slug}`} className="text-ink2 hover:text-ink">
                    {x.name[language]}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </main>
  );
}

function SubfieldTable({ s }: { s: FieldSummary }) {
  const { t, language } = useLanguage();
  return (
    <table className="booktabs font-sans text-[13.5px] max-w-xl">
      <thead>
        <tr>
          <th>{t.common.subfield}</th>
          <th className="num">n</th>
          <th className="num">Q1</th>
          <th className="num">{t.common.median}</th>
          <th className="num">Q3</th>
        </tr>
      </thead>
      <tbody>
        {s.subfields.map(r => (
          <tr key={r.key}>
            <td>{subfieldName(r.key, language)}</td>
            <td className="num tnum">{r.n}</td>
            <td className="num tnum">{Math.round(r.q1)}</td>
            <td className="num tnum">{Math.round(r.med)}</td>
            <td className="num tnum">{Math.round(r.q3)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function useActiveSection() {
  const [active, setActive] = useState<string>('overview');
  useEffect(() => {
    const els = SECTION_IDS.map(id => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      entries => {
        const vis = entries.filter(e => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (vis[0]) setActive(vis[0].target.id);
      },
      { rootMargin: '-20% 0px -70% 0px' },
    );
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
  return active;
}
