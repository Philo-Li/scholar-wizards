'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/i18n/LanguageContext';
import type { PersonCard } from '@/lib/people-types';
import { CURRENT_YEAR } from '@/lib/stats';
import { fmt } from '@/i18n/strings';
import { AXIS, Tip, XAxis, linear, useWidth } from './core';

const KEY = 'var(--series-1)';
const PRIZE = 'var(--series-2)';

export function lifeSpan(p: { bornYear: number; diedYear: number | null }, bornOnly: string) {
  return p.diedYear ? `${p.bornYear}–${p.diedYear}` : fmt(bornOnly, { year: p.bornYear });
}

function PersonTip({ p }: { p: PersonCard }) {
  const { t, language } = useLanguage();
  const L = t.people;
  return (
    <>
      <div className="font-medium text-ink">{p.name[language]}</div>
      <div className="text-ink3">{lifeSpan(p, L.bornOnly)}</div>
      <div className="mt-1">
        {p.keyWork[language]}
        <span className="text-ink3">{' '}({fmt(L.yearAge, { year: p.keyYear, age: p.keyAge })})</span>
      </div>
      {p.prize && (
        <div className="mt-1 text-ink2">
          {language === 'zh' ? p.prize.zh : p.prize.en}
          <span className="text-ink3">{' '}({fmt(L.yearAge, { year: p.prize.year, age: p.prize.age })})</span>
        </div>
      )}
    </>
  );
}

export function LifeLegend({ lifeLabel }: { lifeLabel?: string }) {
  const { t } = useLanguage();
  return (
    <ul className="flex flex-wrap gap-x-5 gap-y-1 font-sans text-[13px] text-ink2 mb-3">
      <li className="flex items-center gap-2">
        <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ background: KEY }} />
        {t.people.legendKey}
      </li>
      <li className="flex items-center gap-2">
        <span className="inline-block w-2.5 h-2.5 rounded-full border-2" style={{ borderColor: PRIZE }} />
        {t.people.legendPrize}
      </li>
      <li className="flex items-center gap-2">
        <span className="inline-block w-5 border-t-2" style={{ borderColor: 'var(--context)' }} />
        {lifeLabel ?? t.people.legendLife}
      </li>
    </ul>
  );
}

/* ------------------------------------------------------------------ */
/* One row per person on an age axis: life, key work, first prize      */
/* ------------------------------------------------------------------ */

export function LifeChart({
  people,
  median,
  compact = false,
}: {
  people: PersonCard[];
  /** Median age at key work across the whole book, drawn as a reference. */
  median?: number;
  compact?: boolean;
}) {
  const { t, language } = useLanguage();
  const router = useRouter();
  const [ref, width] = useWidth<HTMLDivElement>();
  const [hover, setHover] = useState<string | null>(null);

  const rowH = compact ? 30 : 26;
  const labelW = compact ? 0 : Math.min(190, Math.max(110, width * 0.26));
  const m = { t: median !== undefined ? 22 : 8, r: 18, b: 44, l: labelW + 8 };
  const height = m.t + people.length * rowH + m.b;
  const maxAge = Math.max(90, ...people.map(p => (p.diedYear ?? CURRENT_YEAR) - p.bornYear));
  const x = linear(0, Math.ceil(maxAge / 10) * 10, m.l, width - m.r, 6);
  const hovered = people.find(p => p.slug === hover);

  return (
    <div ref={ref} className="relative">
      <svg width={width} height={height} role="img" aria-label={t.people.lifeChartLabel}>
        <XAxis scale={x} y={height - m.b} x0={m.l} x1={width - m.r} grid={m.t - 4} label={t.people.ageAxis} />
        {median !== undefined && (
          <g>
            <line x1={x(median)} x2={x(median)} y1={m.t - 6} y2={height - m.b} stroke="var(--guide)" strokeDasharray="4 4" />
            <text x={x(median) + 4} y={m.t - 10} fontFamily={AXIS.font} fontSize={12} fill={AXIS.tick}>
              {t.people.medianAge} {median}
            </text>
          </g>
        )}
        {people.map((p, i) => {
          const cy = m.t + i * rowH + rowH / 2;
          const end = (p.diedYear ?? CURRENT_YEAR) - p.bornYear;
          const dim = hover && hover !== p.slug;
          return (
            <g
              key={p.slug}
              opacity={dim ? 0.35 : 1}
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => setHover(p.slug)}
              onMouseLeave={() => setHover(null)}
              onClick={() => router.push(`/people/${p.slug}`)}
            >
              <rect x={0} y={cy - rowH / 2} width={width} height={rowH} fill="transparent" />
              {!compact && (
                <text x={labelW} y={cy} dy="0.32em" textAnchor="end" fontFamily="var(--font-serif), serif" fontSize={14} fill="var(--ink)">
                  {p.name[language]}
                </text>
              )}
              <line x1={x(0)} x2={x(end)} y1={cy} y2={cy} stroke="var(--context)" strokeWidth={2} strokeLinecap="round" />
              {!p.diedYear && (
                <path d={`M${x(end) + 2},${cy - 4} L${x(end) + 8},${cy} L${x(end) + 2},${cy + 4}`} fill="none" stroke="var(--context)" strokeWidth={1.5} />
              )}
              {p.prize && p.prize.age > p.keyAge && (
                <line x1={x(p.keyAge)} x2={x(p.prize.age)} y1={cy} y2={cy} stroke={PRIZE} strokeWidth={2} strokeOpacity={0.55} />
              )}
              {p.prize && (
                <circle cx={x(p.prize.age)} cy={cy} r={5} fill="var(--paper)" stroke={PRIZE} strokeWidth={2} />
              )}
              <circle cx={x(p.keyAge)} cy={cy} r={5.5} fill={KEY} stroke="var(--paper)" strokeWidth={2} />
            </g>
          );
        })}
      </svg>
      {hovered && (
        <Tip
          x={x(hovered.keyAge)}
          y={m.t + people.indexOf(hovered) * rowH + rowH / 2}
          width={width}
        >
          <PersonTip p={hovered} />
        </Tip>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Dot histogram of age at key work, for the home page                 */
/* ------------------------------------------------------------------ */

export function AgeDots({ people, annotate }: { people: PersonCard[]; annotate: string[] }) {
  const { t, language } = useLanguage();
  const router = useRouter();
  const [ref, width] = useWidth<HTMLDivElement>();
  const [hover, setHover] = useState<PersonCard | null>(null);

  const bin = 2; // years per column
  const stacks = useMemo(() => {
    const map = new Map<number, PersonCard[]>();
    for (const p of [...people].sort((a, b) => a.keyAge - b.keyAge)) {
      const k = Math.floor(p.keyAge / bin) * bin;
      map.set(k, [...(map.get(k) ?? []), p]);
    }
    return map;
  }, [people]);

  const tallest = Math.max(1, ...[...stacks.values()].map(s => s.length));
  const m = { t: 34, r: 16, b: 46, l: 16 };
  const x = linear(10, 80, m.l, width - m.r, 7);
  const step = Math.max(6, Math.min(14, (x(10 + bin) - x(10)) - 2));
  const r = step / 2 - 0.5;
  const height = m.t + tallest * step + m.b + 8;
  const base = height - m.b - r - 2;

  const pos = new Map<string, { cx: number; cy: number }>();
  for (const [k, list] of stacks) {
    list.forEach((p, i) => pos.set(p.slug, { cx: x(k + bin / 2), cy: base - i * step }));
  }

  return (
    <div ref={ref} className="relative">
      <svg width={width} height={height} role="img" aria-label={t.front.ageFigTitle}>
        <XAxis scale={x} y={height - m.b} x0={m.l} x1={width - m.r} label={t.people.ageAtKey} />
        {people.map(p => {
          const q = pos.get(p.slug)!;
          return (
            <circle
              key={p.slug}
              cx={q.cx}
              cy={q.cy}
              r={hover?.slug === p.slug ? r + 1.5 : r}
              fill={KEY}
              fillOpacity={hover && hover.slug !== p.slug ? 0.4 : 0.9}
              stroke="var(--paper)"
              strokeWidth={1.5}
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => setHover(p)}
              onMouseLeave={() => setHover(null)}
              onClick={() => router.push(`/people/${p.slug}`)}
            >
              <title>{`${p.name[language]}, ${p.keyAge}`}</title>
            </circle>
          );
        })}
        {annotate.map(slug => {
          const p = people.find(q => q.slug === slug);
          const q = p && pos.get(slug);
          if (!p || !q) return null;
          const top = Math.min(q.cy - r - 6, base - tallest * step);
          return (
            <g key={slug} fontFamily={AXIS.font} fontSize={12.5} pointerEvents="none">
              <line x1={q.cx} x2={q.cx} y1={q.cy - r - 2} y2={top + 4} stroke="var(--guide)" />
              <text x={q.cx} y={top} textAnchor="middle" fill="var(--ink-2)">
                {p.name[language].split(/[ ·]/).pop()} {p.keyAge}
              </text>
            </g>
          );
        })}
      </svg>
      {hover && pos.get(hover.slug) && (
        <Tip x={pos.get(hover.slug)!.cx} y={pos.get(hover.slug)!.cy} width={width}>
          <PersonTip p={hover} />
        </Tip>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Lives in calendar time, for the people index                        */
/* ------------------------------------------------------------------ */

export function LivesTimeline({ people }: { people: PersonCard[] }) {
  const { t, language } = useLanguage();
  const router = useRouter();
  const [ref, width] = useWidth<HTMLDivElement>();
  const [hover, setHover] = useState<string | null>(null);

  const rowH = 20;
  const m = { t: 8, r: 14, b: 44, l: 14 };
  const from = Math.floor(Math.min(...people.map(p => p.bornYear)) / 20) * 20;
  const x = linear(from, 2030, m.l, width - m.r, 8);
  const height = m.t + people.length * rowH + m.b;
  const hovered = people.find(p => p.slug === hover);

  return (
    <div ref={ref} className="relative">
      <svg width={width} height={height} role="img" aria-label={t.people.timelineTitle}>
        <XAxis scale={x} y={height - m.b} x0={m.l} x1={width - m.r} grid={m.t} label={t.people.yearAxis} format={v => String(v)} />
        {people.map((p, i) => {
          const cy = m.t + i * rowH + rowH / 2;
          const end = p.diedYear ?? CURRENT_YEAR;
          const dim = hover && hover !== p.slug;
          const nameRight = x(end) + 8;
          const flip = nameRight > width - 150;
          return (
            <g
              key={p.slug}
              opacity={dim ? 0.3 : 1}
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => setHover(p.slug)}
              onMouseLeave={() => setHover(null)}
              onClick={() => router.push(`/people/${p.slug}`)}
            >
              <rect x={0} y={cy - rowH / 2} width={width} height={rowH} fill="transparent" />
              <line x1={x(p.bornYear)} x2={x(end)} y1={cy} y2={cy} stroke="var(--context)" strokeWidth={2} strokeLinecap="round" />
              {p.prize && <circle cx={x(p.prize.year)} cy={cy} r={4} fill="var(--paper)" stroke={PRIZE} strokeWidth={1.75} />}
              <circle cx={x(p.keyYear)} cy={cy} r={4.5} fill={KEY} stroke="var(--paper)" strokeWidth={1.5} />
              <text
                x={flip ? x(p.bornYear) - 8 : nameRight}
                y={cy}
                dy="0.32em"
                textAnchor={flip ? 'end' : 'start'}
                fontFamily="var(--font-serif), serif"
                fontSize={13}
                fill="var(--ink-2)"
              >
                {p.name[language]}
              </text>
            </g>
          );
        })}
      </svg>
      {hovered && (
        <Tip x={x(hovered.keyYear)} y={m.t + people.indexOf(hovered) * rowH + rowH / 2} width={width}>
          <PersonTip p={hovered} />
        </Tip>
      )}
    </div>
  );
}

