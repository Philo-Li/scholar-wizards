'use client';

import Link from 'next/link';
import { useLanguage } from '@/i18n/LanguageContext';
import { fmt } from '@/i18n/strings';
import { DISCIPLINE_BY_SLUG, countryName, subfieldName, type Lang } from '@/lib/disciplines';
import type { RawScholar, ScholarRow } from '@/lib/types';
import { CITES_SINCE, CURRENT_YEAR, formatInt } from '@/lib/stats';
import { Figure, Stat } from '@/components/ui';
import { PercentileStrip, YearBars } from '@/components/charts/ProfileCharts';

interface Position {
  values: number[];
  own: number;
  pct: number;
}

export interface ScholarPageData {
  why:
    | { kind: 'collection' }
    | { kind: 'rising'; rank: number; n: number; m: number; first: number }
    | { kind: 'core'; rank: number; n: number; subRank: number; subN: number };
  chapter: { slug: string; name: { en: string; zh: string } } | null;
  raw: RawScholar;
  row: ScholarRow;
  primarySlug: string;
  memberships: string[];
  position: { h: Position; cites: Position; m: Position; recent: Position };
  peers: ScholarRow[];
}

function ordinal(n: number) {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return `${n}${s[(v - 20) % 10] || s[v] || s[0]}`;
}

function disciplineName(slug: string, lang: Lang) {
  if (slug === 'collection') return lang === 'zh' ? '计算神经科学专题' : 'Computational neuroscience collection';
  return DISCIPLINE_BY_SLUG[slug].name[lang];
}

function disciplineHref(slug: string) {
  return slug === 'collection' ? '/collections/computational-neuroscience' : `/field/${slug}`;
}

export function ScholarView({ data }: { data: ScholarPageData }) {
  const { t, language } = useLanguage();
  const { raw, row, position } = data;
  const field = disciplineName(data.primarySlug, language);
  const pct = (p: number) => fmt(t.scholar.percentile, { p: language === 'zh' ? p : ordinal(p) });
  const first = raw.first ?? raw.years[0]?.[0] ?? CURRENT_YEAR;

  return (
    <main className="max-w-page mx-auto px-5 sm:px-8">
      <header className="pt-12 pb-10">
        <nav className="font-sans text-[13px] text-ink3">
          <Link href={disciplineHref(data.primarySlug)} className="hover:text-ink">
            {fmt(t.common.backTo, { name: field })}
          </Link>
        </nav>
        <h1 className="mt-3 font-serif text-[40px] sm:text-[50px] leading-[1.05] font-semibold tracking-tight">
          {raw.name}
          {raw.hyper && <span className="text-ink3 font-normal" title={t.common.hyperNote}>†</span>}
        </h1>
        <p className="mt-4 text-[19px] text-ink2">
          {raw.inst ?? '—'}
          {raw.country && <>, {countryName(raw.country, language)}</>}
        </p>
        <p className="mt-2 font-sans text-[14px] text-ink2">
          {subfieldName(raw.subfield, language)}
          {raw.first && raw.last && (
            <span className="text-ink3">{'  ·  '}{fmt(t.scholar.careerSpan, { first: raw.first, last: raw.last })}</span>
          )}
        </p>
        <p className="mt-4 font-sans text-[14px] flex flex-wrap gap-x-5 gap-y-1">
          <a className="link" href={`https://openalex.org/authors/${raw.id}`} target="_blank" rel="noopener noreferrer">
            {t.common.openAlexProfile}
          </a>
          {raw.orcid && (
            <a className="link" href={`https://orcid.org/${raw.orcid}`} target="_blank" rel="noopener noreferrer">
              {t.common.orcid} {raw.orcid}
            </a>
          )}
          <span className="text-ink3">
            {t.scholar.listedIn}{' '}
            {data.memberships.map((m, i) => (
              <span key={m}>
                {i > 0 && ', '}
                <Link href={disciplineHref(m)} className="link">{disciplineName(m, language)}</Link>
              </span>
            ))}
          </span>
        </p>
      </header>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-8 gap-y-8 border-t border-rule pt-6">
        <Stat value={raw.h} label={t.common.hIndex} />
        <Stat value={formatInt(raw.cites)} label={t.common.citations} />
        <Stat value={row.m?.toFixed(2) ?? '—'} label={t.common.mQuotient} />
        <Stat value={raw.i10} label={t.common.i10} />
        <Stat value={formatInt(raw.works)} label={t.common.works} />
        <Stat value={formatInt(row.recent)} label={t.common.recentCites} />
      </div>

      <section aria-labelledby="why" className="mt-10 max-w-prose border-l-2 border-rulestrong pl-5">
        <h2 id="why" className="font-sans text-[14px] font-medium text-ink3">{t.scholar.whyTitle}</h2>
        <p className="mt-1.5 text-[16.5px] leading-relaxed">
          {data.why.kind === 'collection' && t.scholar.whyCollection}
          {data.why.kind === 'rising' &&
            fmt(t.scholar.whyRising, { field, first: data.why.first, m: data.why.m.toFixed(2), rank: data.why.rank, n: data.why.n })}
          {data.why.kind === 'core' &&
            fmt(t.scholar.whyCore, {
              field,
              name: raw.name,
              rank: data.why.rank,
              n: data.why.n,
              sub: data.why.subRank
                ? fmt(t.scholar.whySub, { rank: data.why.subRank, n: data.why.subN, subfield: subfieldName(raw.subfield, language) })
                : '',
            })}
          {raw.hyper && data.why.kind === 'core' && <> {t.scholar.whyHyper}</>}
        </p>
        {data.chapter && (
          <p className="mt-3 font-sans text-[14.5px]">
            <Link href={`/people/${data.chapter.slug}`} className="link">
              {fmt(t.scholar.chapterLink, { name: data.chapter.name[language] })}
            </Link>
          </p>
        )}
      </section>

      {raw.hyper && (
        <p className="mt-8 max-w-prose text-[15.5px] leading-relaxed text-ink2 border-l-2 border-rule pl-4">{t.scholar.flagged}</p>
      )}

      <div className="mt-20 space-y-24">
        <section id="position">
          <Figure n={1} title={fmt(t.scholar.position, { name: field })} caption={fmt(t.scholar.positionCaption, { name: field })}>
            <div className="space-y-2 max-w-4xl">
              <PercentileStrip label={t.common.hIndex} values={position.h.values} own={position.h.own} display={String(raw.h)} pctLabel={pct(position.h.pct)} />
              <PercentileStrip label={t.common.citations} values={position.cites.values} own={position.cites.own} display={formatInt(raw.cites)} pctLabel={pct(position.cites.pct)} logScale />
              <PercentileStrip label={t.common.mQuotient} values={position.m.values} own={position.m.own} display={row.m?.toFixed(2) ?? '—'} pctLabel={pct(position.m.pct)} />
              <PercentileStrip label={t.common.recentCites} values={position.recent.values} own={position.recent.own} display={formatInt(row.recent)} pctLabel={pct(position.recent.pct)} logScale />
            </div>
          </Figure>
        </section>

        <section className="grid lg:grid-cols-2 gap-14">
          <Figure n={2} title={t.scholar.worksTitle} caption={t.scholar.worksCaption}>
            <YearBars
              data={raw.years.map(([y, w]) => [y, w] as [number, number])}
              unit={t.common.works}
              from={Math.min(first, CURRENT_YEAR - 9)}
              to={CURRENT_YEAR}
              partialYear={CURRENT_YEAR}
            />
          </Figure>
          <Figure n={3} title={t.scholar.citesTitle} caption={<>{t.scholar.citesCaption} {t.common.partialYear}</>}>
            <YearBars
              data={raw.years.map(([y, , c]) => [y, c] as [number, number])}
              unit={t.common.citations}
              from={Math.max(CITES_SINCE, Math.min(first, CURRENT_YEAR - 9))}
              to={CURRENT_YEAR}
              partialYear={CURRENT_YEAR}
            />
          </Figure>
        </section>

        <section className="grid lg:grid-cols-2 gap-14 items-start">
          <div>
            <h2 className="font-serif text-[22px] font-semibold">{t.scholar.topicsTitle}</h2>
            <p className="mt-2 mb-5 text-[15px] text-ink2">{t.scholar.topicsCaption}</p>
            <table className="booktabs font-sans text-[14px]">
              <thead>
                <tr>
                  <th>{t.scholar.topic}</th>
                  <th>{t.common.subfield}</th>
                  <th className="num">{t.common.works}</th>
                </tr>
              </thead>
              <tbody>
                {raw.topics.map(tp => (
                  <tr key={tp.n}>
                    <td className="font-serif text-[15px]">{tp.n}</td>
                    <td className="text-ink2 text-[13px]">{subfieldName(tp.sf, language)}</td>
                    <td className="num tnum">{tp.c}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {data.peers.length > 0 && (
            <div>
              <h2 className="font-serif text-[22px] font-semibold">
                {fmt(t.scholar.peersTitle, { subfield: subfieldName(raw.subfield, language) })}
              </h2>
              <p className="mt-2 mb-5 text-[15px] text-ink2">{t.scholar.peersCaption}</p>
              <table className="booktabs font-sans text-[14px]">
                <thead>
                  <tr>
                    <th>{t.common.name}</th>
                    <th className="num">{t.common.hIndex}</th>
                    <th className="num">{t.common.citations}</th>
                    <th className="num">{t.common.firstPaper}</th>
                  </tr>
                </thead>
                <tbody>
                  {data.peers.map(p => (
                    <tr key={p.id}>
                      <td>
                        <Link href={`/scholar/${p.id}`} className="font-serif text-[15px] text-ink hover:text-link">{p.name}</Link>
                        <div className="text-[12.5px] text-ink3 truncate max-w-[260px]">{p.inst}</div>
                      </td>
                      <td className="num tnum">{p.h}</td>
                      <td className="num tnum">{formatInt(p.cites)}</td>
                      <td className="num tnum">{p.first ?? '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
