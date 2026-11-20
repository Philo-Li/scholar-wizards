'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { fmt } from '@/i18n/strings';
import { subfieldName, countryName } from '@/lib/disciplines';
import type { ScholarRow } from '@/lib/types';
import { formatInt } from '@/lib/stats';

type SortKey = 'h' | 'cites' | 'm' | 'recent' | 'first' | 'works';

const PAGE = 25;

export function Leaderboard({
  rows,
  defaultSort = 'h',
  showSubfield = true,
  showFilters = true,
  pageSize = PAGE,
}: {
  rows: ScholarRow[];
  defaultSort?: SortKey;
  showSubfield?: boolean;
  showFilters?: boolean;
  pageSize?: number;
}) {
  const { t, language } = useLanguage();
  const [sort, setSort] = useState<SortKey>(defaultSort);
  const [query, setQuery] = useState('');
  const [sub, setSub] = useState('');
  const [hyper, setHyper] = useState(false);
  const [limit, setLimit] = useState(pageSize);

  const hasHyper = rows.some(r => r.hyper);
  const subfields = useMemo(() => {
    const m = new Map<string, number>();
    rows.forEach(r => r.subfield && m.set(r.subfield, (m.get(r.subfield) ?? 0) + 1));
    return [...m.entries()].sort((a, b) => b[1] - a[1]);
  }, [rows]);

  const view = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = rows.filter(
      r =>
        (hyper || !r.hyper) &&
        (!sub || r.subfield === sub) &&
        (!q || r.name.toLowerCase().includes(q) || (r.inst ?? '').toLowerCase().includes(q)),
    );
    const val = (r: ScholarRow) => (sort === 'first' ? -(r.first ?? 9999) : (r[sort] ?? 0));
    return filtered.sort((a, b) => val(b) - val(a));
  }, [rows, query, sub, hyper, sort]);

  const max = Math.max(...view.map(r => (sort === 'first' ? 0 : (r[sort] as number) ?? 0)), 1);

  const cols: { key: SortKey; label: string; title?: string }[] = [
    { key: 'h', label: t.common.hIndex },
    { key: 'cites', label: t.common.citations },
    { key: 'm', label: t.common.mQuotient },
    { key: 'recent', label: t.common.recentCites },
    { key: 'first', label: t.common.firstPaper },
  ];

  const cell = (r: ScholarRow, k: SortKey) => {
    switch (k) {
      case 'h': return r.h;
      case 'cites': return formatInt(r.cites);
      case 'm': return r.m?.toFixed(2) ?? '—';
      case 'recent': return formatInt(r.recent);
      case 'first': return r.first ?? '—';
      case 'works': return formatInt(r.works);
    }
  };

  return (
    <div>
      {showFilters && (
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3 mb-5 font-sans text-[14px]">
          <input
            type="search"
            value={query}
            onChange={e => { setQuery(e.target.value); setLimit(pageSize); }}
            placeholder={t.common.search}
            aria-label={t.common.search}
            className="w-full sm:w-72 bg-paper border border-rule rounded px-3 py-1.5 text-ink placeholder:text-ink3"
          />
          {showSubfield && subfields.length > 1 && (
            <select
              value={sub}
              onChange={e => { setSub(e.target.value); setLimit(pageSize); }}
              aria-label={t.common.subfield}
              className="bg-paper border border-rule rounded px-2 py-1.5 text-ink max-w-full"
            >
              <option value="">{t.common.allSubfields}</option>
              {subfields.map(([s, n]) => (
                <option key={s} value={s}>
                  {subfieldName(s, language)} ({n})
                </option>
              ))}
            </select>
          )}
          {hasHyper && (
            <label className="flex items-center gap-2 text-ink2 cursor-pointer">
              <input type="checkbox" checked={hyper} onChange={e => setHyper(e.target.checked)} />
              {t.common.includeHyper}
            </label>
          )}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="booktabs font-sans text-[14px] min-w-[720px]">
          <thead>
            <tr>
              <th className="num w-10">{t.common.rank}</th>
              <th>{t.common.name}</th>
              {showSubfield && <th>{t.common.subfield}</th>}
              {cols.map(c => (
                <th key={c.key} className="num" aria-sort={sort === c.key ? 'descending' : 'none'}>
                  <button
                    type="button"
                    onClick={() => setSort(c.key)}
                    className={`inline-flex items-center gap-1 ${sort === c.key ? 'text-ink font-semibold' : 'hover:text-ink'}`}
                  >
                    {c.label}
                    <span aria-hidden className={sort === c.key ? '' : 'opacity-0'}>↓</span>
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {view.slice(0, limit).map((r, i) => (
              <tr key={r.id}>
                <td className="num text-ink3 tnum">{i + 1}</td>
                <td className="max-w-[300px]">
                  <Link href={`/scholar/${r.id}`} className="font-serif text-[15.5px] text-ink hover:text-link">
                    {r.name}
                  </Link>
                  {r.hyper && <span className="text-ink3 ml-0.5" title={t.common.hyperNote}>†</span>}
                  <div className="text-[12.5px] text-ink3 truncate" title={r.inst ?? ''}>
                    {r.inst ?? '—'}
                    {r.country && <span>, {countryName(r.country, language)}</span>}
                  </div>
                </td>
                {showSubfield && <td className="text-ink2 text-[13px]">{subfieldName(r.subfield, language)}</td>}
                {cols.map(c => {
                  const v = c.key === 'first' ? 0 : ((r[c.key] as number) ?? 0);
                  return (
                    <td key={c.key} className={`num tnum ${sort === c.key ? 'text-ink font-medium' : 'text-ink2'}`}>
                      {sort === c.key && c.key !== 'first' ? (
                        <span className="inline-flex items-center gap-2 justify-end">
                          <span className="hidden md:inline-block w-14 h-1.5 bg-sunk rounded-full overflow-hidden" aria-hidden>
                            <span className="block h-full rounded-full" style={{ width: `${(v / max) * 100}%`, background: 'var(--series-1)' }} />
                          </span>
                          {cell(r, c.key)}
                        </span>
                      ) : (
                        cell(r, c.key)
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {view.length === 0 && <p className="mt-4 font-sans text-[14px] text-ink2">{t.common.noMatch}</p>}
      <div className="mt-4 flex flex-wrap items-center gap-4 font-sans text-[13px] text-ink3">
        {limit < view.length && (
          <button
            type="button"
            onClick={() => setLimit(l => l + pageSize)}
            className="border border-rule rounded px-3 py-1.5 text-ink hover:bg-sunk"
          >
            {fmt(t.common.showMore, { n: Math.min(pageSize, view.length - limit) })}
          </button>
        )}
        <span className="tnum">
          {Math.min(limit, view.length)} / {view.length}
        </span>
        {hasHyper && <span className="basis-full max-w-prose">{t.common.hyperNote}</span>}
      </div>
    </div>
  );
}
