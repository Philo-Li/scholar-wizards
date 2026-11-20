'use client';

import Link from 'next/link';
import { useLanguage } from '@/i18n/LanguageContext';
import { fmt } from '@/i18n/strings';
import { DISCIPLINE_BY_SLUG } from '@/lib/disciplines';
import { formatInt } from '@/lib/stats';
import { Figure } from '@/components/ui';
import { NormsStrip } from '@/components/charts/FieldCharts';

export interface HomeDiscipline {
  slug: string;
  n: number;
  medianH: number;
  medianCites: number;
  gini: number;
  dots: { id: string; name: string; v: number }[];
}

export function HomeView({
  disciplines,
  totalScholars,
  collectionSize,
  fetchedAt,
}: {
  disciplines: HomeDiscipline[];
  totalScholars: number;
  collectionSize: number;
  fetchedAt: string;
}) {
  const { t, language } = useLanguage();
  const byMedian = [...disciplines].sort((a, b) => b.medianCites - a.medianCites);
  const month = new Date(fetchedAt).toLocaleDateString(language === 'zh' ? 'zh-CN' : 'en-GB', { year: 'numeric', month: 'long' });

  return (
    <main className="max-w-page mx-auto px-5 sm:px-8">
      <header className="pt-16 sm:pt-24 pb-14 max-w-[46rem]">
        <h1 className="font-serif text-[52px] sm:text-[72px] leading-[0.98] font-semibold tracking-[-0.02em]">
          {t.home.title}
        </h1>
        <p className="mt-7 text-[20px] sm:text-[22px] leading-[1.55] text-ink2">{t.home.lede}</p>
        <p className="mt-5 font-sans text-[14px] text-ink3 tnum">
          {fmt(t.home.stats, { scholars: formatInt(totalScholars), disciplines: disciplines.length, date: month })}
        </p>
      </header>

      <section className="border-t border-rule pt-10">
        <Figure n={1} title={t.home.heroTitle} caption={t.home.heroCaption}>
          <NormsStrip
            rows={byMedian.map(d => ({
              slug: d.slug,
              label: DISCIPLINE_BY_SLUG[d.slug].name[language],
              median: d.medianCites,
              dots: d.dots,
            }))}
          />
        </Figure>
      </section>

      <section id="disciplines" className="mt-24 scroll-mt-20">
        <h2 className="font-serif text-[30px] font-semibold tracking-tight">{t.home.disciplinesTitle}</h2>
        <p className="mt-3 max-w-prose text-[17px] leading-relaxed text-ink2">{t.home.disciplinesIntro}</p>
        <div className="mt-8 overflow-x-auto">
          <table className="booktabs min-w-[640px]">
            <thead className="font-sans text-[13.5px]">
              <tr>
                <th>{t.home.colDiscipline}</th>
                <th className="num">{t.home.colScholars}</th>
                <th className="num">{t.home.colMedianH}</th>
                <th className="num">{t.home.colMedianCites}</th>
                <th className="num">{t.home.colGini}</th>
              </tr>
            </thead>
            <tbody>
              {disciplines.map(d => {
                const info = DISCIPLINE_BY_SLUG[d.slug];
                return (
                  <tr key={d.slug}>
                    <td className="py-3.5 pr-8">
                      <Link href={`/field/${d.slug}`} className="font-serif text-[18px] font-semibold text-ink hover:text-link">
                        {info.name[language]}
                      </Link>
                      <div className="mt-0.5 text-[14.5px] leading-snug text-ink2 max-w-[56ch]">{info.scope[language]}</div>
                    </td>
                    <td className="num font-sans text-[14px] tnum">{d.n}</td>
                    <td className="num font-sans text-[14px] tnum">{Math.round(d.medianH)}</td>
                    <td className="num font-sans text-[14px] tnum">{formatInt(d.medianCites)}</td>
                    <td className="num font-sans text-[14px] tnum">{d.gini.toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="mt-3 max-w-prose font-sans text-[13px] leading-relaxed text-ink3">{t.home.giniNote}</p>
      </section>

      <section className="mt-24">
        <h2 className="font-serif text-[30px] font-semibold tracking-tight">{t.home.readingTitle}</h2>
        <div className="mt-8 grid md:grid-cols-3 gap-10 md:gap-12">
          {[
            { term: t.common.hIndex, body: t.home.reading1 },
            { term: t.common.mQuotient, body: t.home.reading2 },
            { term: language === 'zh' ? '学科规范' : 'Field norms', body: t.home.reading3 },
          ].map(x => (
            <div key={x.term} className="border-t border-rule pt-4">
              <h3 className="font-serif text-[19px] font-semibold italic">{x.term}</h3>
              <p className="mt-2 text-[16.5px] leading-relaxed text-ink2">{x.body}</p>
            </div>
          ))}
        </div>
        <p className="mt-8 font-sans text-[14.5px]">
          <Link href="/methods" className="link">{t.home.readMethods}</Link>
        </p>
      </section>

      <section className="mt-24 border-t border-rule pt-10 max-w-prose">
        <h2 className="font-serif text-[24px] font-semibold tracking-tight">{t.home.collectionTitle}</h2>
        <p className="mt-3 text-[17px] leading-relaxed text-ink2">{fmt(t.home.collectionDesc, { n: collectionSize })}</p>
        <p className="mt-4 font-sans text-[14.5px]">
          <Link href="/collections/computational-neuroscience" className="link">{t.home.openCollection}</Link>
        </p>
      </section>
    </main>
  );
}
