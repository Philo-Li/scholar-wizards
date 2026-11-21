'use client';

import Link from 'next/link';
import { useLanguage } from '@/i18n/LanguageContext';
import { fmt } from '@/i18n/strings';
import type { Person, PersonCard } from '@/lib/people-types';
import { DISCIPLINE_BY_SLUG } from '@/lib/disciplines';
import { THEME_BY_SLUG, REASONS } from '@/content/themes';
import { LESSON_BY_KEY } from '@/content/lessons';
import { formatInt } from '@/lib/stats';
import { Figure } from '@/components/ui';
import { LifeChart, LifeLegend, lifeSpan } from '@/components/charts/PeopleCharts';

export interface PersonPageData {
  person: Person;
  card: PersonCard;
  data: { id: string; h: number; cites: number } | null;
  related: { theme: string; people: PersonCard[] } | null;
}

function H2({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="scroll-mt-20 font-serif text-[25px] leading-tight font-semibold tracking-tight">
      {children}
    </h2>
  );
}

export function PersonView({ data }: { data: PersonPageData }) {
  const { t, language } = useLanguage();
  const P = t.people;
  const p = data.person;
  const L = language;
  const list = (xs: string[]) => xs.join(L === 'zh' ? '、' : ', ');
  const altName = L === 'zh' ? (p.name.en !== p.name.zh ? p.name.en : null) : p.themes.includes('chinese') ? p.name.zh : null;
  const wikiZh = p.wiki.zh ? `https://zh.wikipedia.org/wiki/${encodeURIComponent(p.wiki.zh)}` : null;
  const wikiEn = `https://en.wikipedia.org/wiki/${encodeURIComponent(p.wiki.en)}`;
  const portrait = p.meta.portrait;

  return (
    <main className="max-w-page mx-auto px-5 sm:px-8">
      <article className="pt-12 grid lg:grid-cols-[minmax(0,1fr)_17.5rem] gap-x-16">
        <header className="lg:col-start-1 lg:row-start-1 pb-10">
          <nav className="font-sans text-[13px] text-ink3 flex flex-wrap gap-x-4 gap-y-1">
            <Link href="/people" className="hover:text-ink">{t.nav.people}</Link>
            {p.themes.filter(th => THEME_BY_SLUG[th]).map(th => (
              <Link key={th} href={`/themes/${th}`} className="hover:text-ink">{THEME_BY_SLUG[th].title[L]}</Link>
            ))}
          </nav>
          <h1 className="mt-3 font-serif text-[40px] sm:text-[54px] leading-[1.04] font-semibold tracking-tight">
            {p.name[L]}
          </h1>
          <p className="mt-3 font-sans text-[15px] text-ink2 tnum">
            {altName && <span className="mr-3 text-ink3">{altName}</span>}
            {lifeSpan(p, P.bornOnly)}
            <span className="ml-3 text-ink3">{list(p.disciplines.map(d => DISCIPLINE_BY_SLUG[d]?.name[L] ?? d))}</span>
          </p>

          <section aria-labelledby="why" className="mt-10 max-w-prose">
            <h2 id="why" className="font-sans text-[14px] font-medium text-ink3">{P.whySelected}</h2>
            <p className="mt-3 font-serif text-[22px] sm:text-[24px] leading-[1.5] text-ink">{p.why[L]}</p>
            <p className="mt-4 font-sans text-[13.5px] text-ink3">
              {P.reasons}{L === 'zh' ? '：' : ': '}
              {p.reasons.filter(r => REASONS[r]).map((r, i) => (
                <span key={r} title={REASONS[r].note[L]}>
                  {i > 0 && (L === 'zh' ? '、' : ', ')}
                  <span className="text-ink2 border-b border-dotted border-ink3 cursor-help">{REASONS[r][L]}</span>
                </span>
              ))}
            </p>
          </section>
        </header>

        <aside className="lg:col-start-2 lg:row-start-1 lg:row-span-2 lg:pt-10 mb-12 lg:mb-0">
          <div className="lg:sticky lg:top-20 space-y-6">
            {portrait && (
              <figure className="max-w-[17.5rem]">
                <img
                  src={portrait.src}
                  alt={p.name[L]}
                  width={portrait.width ?? undefined}
                  height={portrait.height ?? undefined}
                  loading="lazy"
                  className="w-full h-auto bg-sunk border border-rule"
                />
                <figcaption className="mt-2 font-sans text-[12px] leading-snug text-ink3">
                  <a href={portrait.page} target="_blank" rel="noopener noreferrer" className="hover:text-ink">
                    {portrait.artist
                      ? fmt(P.portraitCredit, { artist: portrait.artist, licence: portrait.licence })
                      : fmt(P.portraitCreditNoArtist, { licence: portrait.licence })}
                  </a>
                </figcaption>
              </figure>
            )}
            <dl className="font-sans text-[13.5px] leading-snug grid grid-cols-[6.5rem_minmax(0,1fr)] gap-x-3 gap-y-2.5 border-t border-rulestrong pt-4">
              <dt className="text-ink3">{P.born}</dt>
              <dd className="tnum">{p.bornYear}</dd>
              <dt className="text-ink3">{P.died}</dt>
              <dd className="tnum">{p.diedYear ?? <span className="text-ink3">{P.living}</span>}</dd>
              <dt className="text-ink3">{P.keyWork}</dt>
              <dd>
                {p.keyWork[L]} <span className="text-ink3 tnum">({fmt(P.yearAge, { year: p.keyWork.year, age: p.keyAge })})</span>
              </dd>
              <dt className="text-ink3">{P.prizes}</dt>
              <dd>
                {p.meta.prizes.length === 0 ? (
                  <span className="text-ink3">{P.noPrizes}</span>
                ) : (
                  <ul className="space-y-1">
                    {p.meta.prizes.map(pr => (
                      <li key={`${pr.id}-${pr.year}`}>
                        {L === 'zh' ? pr.zh : pr.en}
                        {pr.year && <span className="text-ink3 tnum"> {pr.year}</span>}
                        {pr.declined && <span className="text-ink3"> ({P.declined})</span>}
                      </li>
                    ))}
                  </ul>
                )}
              </dd>
            </dl>
            <p className="font-sans text-[13px] flex flex-wrap gap-x-4 gap-y-1">
              <a className="link" href={L === 'zh' && wikiZh ? wikiZh : wikiEn} target="_blank" rel="noopener noreferrer">{P.wikipedia}</a>
              {p.meta.qid && (
                <a className="link" href={`https://www.wikidata.org/wiki/${p.meta.qid}`} target="_blank" rel="noopener noreferrer">{P.wikidata}</a>
              )}
              {data.data && <Link className="link" href={`/scholar/${data.data.id}`}>{P.dataProfile}</Link>}
            </p>
            <p className="font-sans text-[12px] text-ink3">{P.facts}</p>
          </div>
        </aside>

        <div className="lg:col-start-1 lg:row-start-2 space-y-20 pb-8 min-w-0">
          <section>
            <H2 id="life">{P.life}</H2>
            <p className="mt-5 max-w-prose text-[18px] leading-[1.7] text-ink">{p.summary[L]}</p>
            <div className="mt-10">
              <Figure n={1} title={P.lifeChartLabel}>
                <LifeLegend />
                <LifeChart people={[data.card]} compact />
              </Figure>
            </div>
            <h3 className="mt-12 font-serif text-[19px] font-semibold">{P.timeline}</h3>
            <table className="booktabs mt-4 font-sans text-[14.5px]">
              <thead>
                <tr>
                  <th className="num w-16">{P.colYear}</th>
                  <th className="num w-14">{P.colAge}</th>
                  <th>{P.colEvent}</th>
                </tr>
              </thead>
              <tbody>
                {p.timeline.map((e, i) => (
                  <tr key={i} className={e.year === p.keyWork.year ? 'bg-sunk' : undefined}>
                    <td className="num tnum">{e.year}</td>
                    <td className="num tnum text-ink3">{e.year - p.bornYear > 0 ? e.year - p.bornYear : ''}</td>
                    <td className="font-serif text-[16px] leading-snug">{e[L]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section>
            <H2 id="character">{P.character}</H2>
            <ul className="mt-5 max-w-prose space-y-4">
              {p.style.map((s, i) => (
                <li key={i} className="text-[17.5px] leading-[1.65] pl-5 relative before:content-[''] before:absolute before:left-0 before:top-[0.8em] before:w-2 before:border-t before:border-ink3">
                  {s[L]}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <H2 id="works">{P.works}</H2>
            <div className="mt-5 overflow-x-auto">
              <table className="booktabs min-w-[560px] text-[15px]">
                <thead className="font-sans text-[13.5px]">
                  <tr>
                    <th className="num w-16">{P.colYear}</th>
                    <th>{P.colTitle}</th>
                    <th>{P.colWhy}</th>
                  </tr>
                </thead>
                <tbody>
                  {p.works.map((w, i) => (
                    <tr key={i}>
                      <td className="num font-sans text-[14px] tnum">{w.year}</td>
                      <td className="italic leading-snug max-w-[18rem]">{w.title}</td>
                      <td className="leading-snug text-ink2">{w[L]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {p.quotes.length > 0 && (
            <section>
              <H2 id="words">{P.ownWords}</H2>
              <div className="mt-6 space-y-10 max-w-prose">
                {p.quotes.map((q, i) => (
                  <blockquote key={i} className="border-l-2 border-s1 pl-6">
                    <p className="font-serif text-[21px] leading-[1.55] italic">{q.text}</p>
                    {L === 'zh' && q.zh && q.zh !== q.text && <p className="mt-3 text-[17px] leading-relaxed text-ink2">{q.zh}</p>}
                    <footer className="mt-3 font-sans text-[13px] text-ink3">
                      <a href={q.url} target="_blank" rel="noopener noreferrer" className="hover:text-ink underline decoration-1 underline-offset-2 decoration-rule">
                        {q.source}
                      </a>
                    </footer>
                  </blockquote>
                ))}
              </div>
            </section>
          )}

          {p.links.length > 0 && (
            <section>
              <H2 id="coverage">{P.coverage}</H2>
              <p className="mt-3 max-w-prose text-[15px] text-ink3">{P.coverageNote}</p>
              <ul className="mt-6 border-t border-rule">
                {p.links.map(l => (
                  <li key={l.url} className="grid sm:grid-cols-[8rem_minmax(0,1fr)] gap-x-6 gap-y-1 py-3.5 border-b border-rule">
                    <span className="font-sans text-[13px] text-ink3 pt-0.5">{P.kinds[l.kind] ?? l.kind}</span>
                    <span>
                      <a href={l.url} target="_blank" rel="noopener noreferrer" className="font-serif text-[17px] leading-snug text-ink hover:text-link">
                        {l.title}
                      </a>
                      <span className="block font-sans text-[13px] text-ink3 mt-0.5">
                        {l.publisher}
                        {l.year ? `, ${l.year}` : ''}
                        {l.lang === 'zh' && L === 'en' ? ` (${P.langZh})` : ''}
                        {l.lang === 'en' && L === 'zh' ? '（英文）' : ''}
                        {l.lang === 'other' ? ` (${P.langOther})` : ''}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {p.lessons.length > 0 && (
            <section>
              <H2 id="lessons">{P.lessons}</H2>
              <div className="mt-6 space-y-7 max-w-prose">
                {p.lessons.map(l => (
                  <div key={l.key}>
                    <h3 className="font-serif text-[18px] font-semibold">
                      <Link href={`/lessons#${l.key}`} className="hover:text-link">{LESSON_BY_KEY[l.key]?.title[L] ?? l.key}</Link>
                    </h3>
                    <p className="mt-1.5 text-[17px] leading-[1.65] text-ink2">{l[L]}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {data.data && (
            <section className="border-t border-rule pt-8 max-w-prose">
              <H2 id="data">{P.dataProfile}</H2>
              <p className="mt-3 text-[17px] leading-relaxed text-ink2">
                {fmt(P.dataProfileText, { h: data.data.h, cites: formatInt(data.data.cites) })}
              </p>
              <p className="mt-3 font-sans text-[14.5px]">
                <Link href={`/scholar/${data.data.id}`} className="link">{P.openDataProfile}</Link>
              </p>
            </section>
          )}

          {data.related && data.related.people.length > 0 && (
            <section className="border-t border-rule pt-8">
              <h2 className="font-serif text-[21px] font-semibold">
                <Link href={`/themes/${data.related.theme}`} className="hover:text-link">
                  {fmt(P.readAlso, { theme: THEME_BY_SLUG[data.related.theme].title[L] })}
                </Link>
              </h2>
              <ul className="mt-5 grid sm:grid-cols-2 gap-x-10 gap-y-5">
                {data.related.people.map(r => (
                  <li key={r.slug}>
                    <Link href={`/people/${r.slug}`} className="font-serif text-[17px] font-semibold text-ink hover:text-link">{r.name[L]}</Link>
                    <p className="mt-1 text-[15px] leading-snug text-ink2 line-clamp-2">{r.why[L]}</p>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </article>
    </main>
  );
}
