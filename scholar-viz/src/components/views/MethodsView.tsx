'use client';

import { ReactNode } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { fmt } from '@/i18n/strings';

const REFERENCES = [
  {
    text: 'Hirsch, J. E. (2005). An index to quantify an individual’s scientific research output. Proceedings of the National Academy of Sciences, 102(46), 16569–16572.',
    href: 'https://doi.org/10.1073/pnas.0507655102',
  },
  {
    text: 'Radicchi, F., Fortunato, S., & Castellano, C. (2008). Universality of citation distributions: Toward an objective measure of scientific impact. Proceedings of the National Academy of Sciences, 105(45), 17268–17272.',
    href: 'https://doi.org/10.1073/pnas.0806977105',
  },
  {
    text: 'Waltman, L., & van Eck, N. J. (2013). A systematic empirical comparison of different approaches for normalizing citation impact indicators. Journal of Informetrics, 7(4), 833–849.',
    href: 'https://doi.org/10.1016/j.joi.2013.08.002',
  },
  {
    text: 'Hicks, D., Wouters, P., Waltman, L., de Rijcke, S., & Rafols, I. (2015). Bibliometrics: The Leiden Manifesto for research metrics. Nature, 520, 429–431.',
    href: 'https://doi.org/10.1038/520429a',
  },
  {
    text: 'San Francisco Declaration on Research Assessment (2012).',
    href: 'https://sfdora.org/read/',
  },
  {
    text: 'Priem, J., Piwowar, H., & Orr, R. (2022). OpenAlex: A fully-open index of scholarly works, authors, venues, institutions, and concepts. arXiv:2205.01833.',
    href: 'https://arxiv.org/abs/2205.01833',
  },
];

function Formula({ children }: { children: ReactNode }) {
  return (
    <div className="my-3 py-2 font-serif text-[19px] text-ink overflow-x-auto" role="math">
      {children}
    </div>
  );
}

export function MethodsView({ fetchedAt }: { fetchedAt: string }) {
  const { t, language } = useLanguage();
  const m = t.methods;

  const metrics: { term: string; formula?: ReactNode; body: string }[] = [
    {
      term: t.common.hIndex,
      formula: (
        <>
          <i>h</i> = max {'{'} <i>k</i> : <i>c</i><sub>(<i>k</i>)</sub> ≥ <i>k</i> {'}'}
          <span className="font-sans text-[13px] text-ink3 ml-4">
            {language === 'zh' ? 'c(k) 为第 k 篇高被引作品的引用数' : 'c(k): citations of the k-th most-cited work'}
          </span>
        </>
      ),
      body: m.hDef,
    },
    {
      term: t.common.academicAge,
      formula: (
        <>
          <i>A</i> = <i>Y</i><sub>now</sub> − <i>Y</i><sub>0</sub> + 1
        </>
      ),
      body: m.ageDef,
    },
    {
      term: t.common.mQuotient,
      formula: (
        <>
          <i>m</i> = <i>h</i> / <i>A</i>
        </>
      ),
      body: m.mDef,
    },
    { term: t.common.recentCites, body: m.recentDef },
    { term: t.common.c2y, body: m.c2yDef },
    {
      term: language === 'zh' ? '基尼系数' : 'Gini coefficient',
      formula: (
        <>
          <i>G</i> = Σ<sub><i>i</i></sub> (2<i>i</i> − <i>n</i> − 1) <i>x</i><sub>(<i>i</i>)</sub> / (<i>n</i> Σ<sub><i>i</i></sub> <i>x</i><sub><i>i</i></sub>)
        </>
      ),
      body: m.giniDef,
    },
  ];

  return (
    <main className="max-w-page mx-auto px-5 sm:px-8">
      <article className="max-w-prose pt-14">
        <h1 className="font-serif text-[46px] sm:text-[54px] leading-[1.05] font-semibold tracking-tight">{m.title}</h1>
        <p className="mt-5 text-[20px] leading-relaxed text-ink2">{m.lede}</p>

        <Block title={m.source}>
          <p>{fmt(m.sourceBody, { date: fetchedAt })}</p>
        </Block>

        <Block title={m.selection}>
          <ol className="list-decimal pl-6 space-y-3 marker:text-ink3 marker:font-sans marker:text-[14px]">
            <li>{m.selection1}</li>
            <li>{m.selection2}</li>
            <li>{m.selection3}</li>
          </ol>
        </Block>

        <Block title={m.metrics}>
          <dl className="space-y-8">
            {metrics.map(x => (
              <div key={x.term}>
                <dt className="font-serif text-[19px] font-semibold italic">{x.term}</dt>
                {x.formula && <Formula>{x.formula}</Formula>}
                <dd className="mt-1">{x.body}</dd>
              </div>
            ))}
          </dl>
        </Block>

        <Block title={m.limits}>
          <ul className="list-disc pl-6 space-y-3 marker:text-ink3">
            <li>{m.limit1}</li>
            <li>{m.limit2}</li>
            <li>{m.limit3}</li>
            <li>{m.limit4}</li>
          </ul>
        </Block>

        <Block title={m.responsible}>
          <p>{m.responsibleBody}</p>
        </Block>

        <Block title={m.references}>
          <ol className="space-y-3 text-[15.5px] leading-relaxed list-decimal pl-6 marker:text-ink3 marker:font-sans marker:text-[13px]">
            {REFERENCES.map(r => (
              <li key={r.href} className="pl-1">
                {r.text}{' '}
                <a href={r.href} className="link font-sans text-[13.5px] break-all" target="_blank" rel="noopener noreferrer">
                  {r.href.replace('https://', '')}
                </a>
              </li>
            ))}
          </ol>
        </Block>
      </article>
    </main>
  );
}

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-14">
      <h2 className="font-serif text-[26px] font-semibold tracking-tight border-t border-rule pt-6">{title}</h2>
      <div className="mt-4 text-[17px] leading-[1.7] text-ink">{children}</div>
    </section>
  );
}
