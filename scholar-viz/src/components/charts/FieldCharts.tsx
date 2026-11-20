'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/i18n/LanguageContext';
import { fmt } from '@/i18n/strings';
import { subfieldName, countryName } from '@/lib/disciplines';
import type { ScholarRow } from '@/lib/types';
import { formatInt } from '@/lib/stats';
import { Legend } from '@/components/ui';
import { AXIS, Tip, XAxis, YAxis, linear, log, useWidth } from './core';

/* ------------------------------------------------------------------ */
/* h-index against academic age, with m-quotient guides               */
/* ------------------------------------------------------------------ */

export function CareerScatter({ rows }: { rows: ScholarRow[] }) {
  const { t, language } = useLanguage();
  const router = useRouter();
  const [ref, width] = useWidth<HTMLDivElement>();
  const [hover, setHover] = useState<ScholarRow | null>(null);

  const pts = rows.filter(r => r.age && r.h > 0);
  const height = Math.min(520, Math.max(340, width * 0.6));
  const m = { t: 28, r: 16, b: 46, l: 44 };
  const maxAge = Math.max(10, ...pts.map(p => p.age!));
  const maxH = Math.max(10, ...pts.map(p => p.h));
  const x = linear(0, Math.ceil(maxAge / 10) * 10, m.l, width - m.r, 6);
  const y = linear(0, Math.ceil(maxH / 50) * 50, height - m.b, m.t, 5);
  const xMax = Math.ceil(maxAge / 10) * 10;
  const yMax = Math.ceil(maxH / 50) * 50;

  const guides = [1, 2, 3].map(k => {
    const ex = Math.min(xMax, yMax / k);
    return { k, x2: x(ex), y2: y(ex * k) };
  });

  // Draw rising scholars last so they stay visible on top.
  const ordered = [...pts].sort((a, b) => (a.group === b.group ? 0 : a.group === 'rising' ? 1 : -1));

  return (
    <div>
      <Legend
        items={[
          { label: t.common.established, color: 'var(--series-1)' },
          { label: t.common.rising, color: 'var(--series-2)' },
          { label: 'm = 1, 2, 3', color: 'var(--guide)', shape: 'line' },
        ]}
      />
      <div ref={ref} className="relative">
        <svg width={width} height={height} role="img" aria-label={t.field.careerTitle}>
          <YAxis scale={y} x={m.l} grid={width - m.r} label={t.common.hIndex} />
          <XAxis scale={x} y={height - m.b} x0={m.l} x1={width - m.r} label={`${t.common.academicAge} (${t.common.years})`} />
          {guides.map(g => (
            <g key={g.k}>
              <line x1={x(0)} y1={y(0)} x2={g.x2} y2={g.y2} stroke="var(--guide)" strokeDasharray="4 4" strokeWidth={1} />
              <text x={g.x2 - 4} y={g.y2 + (g.y2 <= m.t + 2 ? 14 : -6)} textAnchor="end" fontFamily={AXIS.font} fontSize={12} fill={AXIS.tick}>
                m = {g.k}
              </text>
            </g>
          ))}
          {ordered.map(p => (
            <circle
              key={p.id}
              cx={x(p.age!)}
              cy={y(p.h)}
              r={hover?.id === p.id ? 6 : 4}
              fill={p.group === 'rising' ? 'var(--series-2)' : 'var(--series-1)'}
              fillOpacity={hover && hover.id !== p.id ? 0.35 : 0.8}
              stroke="var(--paper)"
              strokeWidth={1.5}
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => setHover(p)}
              onMouseLeave={() => setHover(null)}
              onClick={() => router.push(`/scholar/${p.id}`)}
            />
          ))}
        </svg>
        {hover && (
          <Tip x={x(hover.age!)} y={y(hover.h)} width={width}>
            <div className="font-medium">{hover.name}</div>
            <div className="text-ink3">{subfieldName(hover.subfield, language)}</div>
            <div className="mt-1">
              h {hover.h} · {t.common.academicAge} {hover.age} · m {hover.m?.toFixed(2)}
            </div>
          </Tip>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Concentration (Lorenz-style) curve                                 */
/* ------------------------------------------------------------------ */

export function ConcentrationCurve({ points }: { points: { x: number; y: number }[] }) {
  const { language } = useLanguage();
  const [ref, width] = useWidth<HTMLDivElement>(480);
  const [hover, setHover] = useState<{ x: number; y: number } | null>(null);
  const size = Math.min(width, 440);
  const m = { t: 28, r: 16, b: 46, l: 44 };
  const x = linear(0, 100, m.l, size - m.r, 5);
  const y = linear(0, 100, size - m.b, m.t, 5);
  const path = points.map((p, i) => `${i ? 'L' : 'M'}${x(p.x)},${y(p.y)}`).join('');
  const area = `${path}L${x(100)},${y(100)}L${x(100)},${y(0)}L${x(0)},${y(0)}Z`;
  const pct = (v: number) => `${v}%`;

  return (
    <div ref={ref} className="relative" style={{ maxWidth: 440 }}>
      <svg
        width={size}
        height={size}
        role="img"
        onMouseMove={e => {
          const rect = (e.currentTarget as SVGSVGElement).getBoundingClientRect();
          const px = ((e.clientX - rect.left - m.l) / (size - m.l - m.r)) * 100;
          if (px < 0 || px > 100) return setHover(null);
          const near = points.reduce((a, b) => (Math.abs(b.x - px) < Math.abs(a.x - px) ? b : a));
          setHover(near);
        }}
        onMouseLeave={() => setHover(null)}
      >
        <YAxis scale={y} x={m.l} grid={size - m.r} format={pct} label={language === 'zh' ? '引用份额' : 'Share of citations'} />
        <XAxis scale={x} y={size - m.b} x0={m.l} x1={size - m.r} format={pct} label={language === 'zh' ? '学者份额（从高被引起）' : 'Share of scholars, most cited first'} />
        <path d={area} fill="var(--series-1)" fillOpacity={0.08} />
        <line x1={x(0)} y1={y(0)} x2={x(100)} y2={y(100)} stroke="var(--guide)" strokeDasharray="4 4" />
        <path d={path} fill="none" stroke="var(--series-1)" strokeWidth={2} />
        {hover && (
          <>
            <line x1={x(hover.x)} x2={x(hover.x)} y1={y(0)} y2={y(100)} stroke="var(--guide)" />
            <circle cx={x(hover.x)} cy={y(hover.y)} r={5} fill="var(--series-1)" stroke="var(--paper)" strokeWidth={2} />
          </>
        )}
      </svg>
      {hover && (
        <Tip x={x(hover.x)} y={y(hover.y)} width={size}>
          {language === 'zh'
            ? `前 ${hover.x}% 的学者持有 ${hover.y}% 的引用`
            : `Top ${hover.x}% of scholars hold ${hover.y}% of citations`}
        </Tip>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Subfield medians with interquartile range                          */
/* ------------------------------------------------------------------ */

export interface RangeRow {
  key: string;
  n: number;
  q1: number;
  med: number;
  q3: number;
}

export function RangePlot({ rows, metricLabel }: { rows: RangeRow[]; metricLabel: string }) {
  const { language } = useLanguage();
  const [ref, width] = useWidth<HTMLDivElement>();
  const [hover, setHover] = useState<string | null>(null);
  const labelW = Math.min(260, width * 0.42);
  const rowH = 30;
  const m = { t: 8, r: 48, b: 46 };
  const height = m.t + rows.length * rowH + m.b;
  const max = Math.max(...rows.map(r => r.q3), 10);
  const x = linear(0, Math.ceil(max / 20) * 20, labelW, width - m.r, 5);

  return (
    <div ref={ref}>
      <svg width={width} height={height} role="img" aria-label={metricLabel}>
        <XAxis scale={x} y={height - m.b} x0={labelW} x1={width - m.r} label={metricLabel} grid={m.t} />
        {rows.map((r, i) => {
          const cy = m.t + i * rowH + rowH / 2;
          const on = hover === r.key;
          return (
            <g key={r.key} onMouseEnter={() => setHover(r.key)} onMouseLeave={() => setHover(null)}>
              <rect x={0} y={cy - rowH / 2} width={width} height={rowH} fill={on ? 'var(--paper-sunk)' : 'transparent'} />
              <text x={labelW - 12} y={cy} dy="0.32em" textAnchor="end" fontSize={13.5} fill="var(--ink)" fontFamily={AXIS.font}>
                {subfieldName(r.key, language)}
              </text>
              <line x1={x(r.q1)} x2={x(r.q3)} y1={cy} y2={cy} stroke="var(--series-1)" strokeWidth={2} strokeLinecap="round" opacity={0.55} />
              <circle cx={x(r.med)} cy={cy} r={5} fill="var(--series-1)" stroke="var(--paper)" strokeWidth={2} />
              <text x={width - m.r + 8} y={cy} dy="0.32em" fontSize={12} fill={AXIS.tick} fontFamily={AXIS.font} className="tnum">
                n={r.n}
              </text>
              {on && (
                <text x={x(r.q3) + 8} y={cy} dy="0.32em" fontSize={12} fill="var(--ink-2)" fontFamily={AXIS.font} className="tnum">
                  {Math.round(r.q1)}–{Math.round(r.med)}–{Math.round(r.q3)}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Ranked horizontal bars (countries)                                 */
/* ------------------------------------------------------------------ */

export function RankedBars({ items, kind }: { items: { key: string; count: number }[]; kind: 'country' | 'plain' }) {
  const { language } = useLanguage();
  const max = Math.max(...items.map(i => i.count), 1);
  return (
    <ul className="font-sans text-[13.5px] space-y-1.5">
      {items.map(it => (
        <li key={it.key} className="grid grid-cols-[minmax(7rem,11rem)_1fr_2.5rem] items-center gap-3">
          <span className="truncate text-ink" title={it.key}>
            {kind === 'country' ? countryName(it.key, language) : it.key}
          </span>
          <span className="h-3.5 block">
            <span
              className="block h-full rounded-r"
              style={{ width: `${(it.count / max) * 100}%`, background: 'var(--series-1)' }}
            />
          </span>
          <span className="text-right text-ink2 tnum">{it.count}</span>
        </li>
      ))}
    </ul>
  );
}

/* ------------------------------------------------------------------ */
/* Small multiples of yearly citations                                */
/* ------------------------------------------------------------------ */

export interface Trajectory {
  id: string;
  name: string;
  series: [number, number][]; // [year, citations]
}

export function TrajectoryGrid({ items }: { items: Trajectory[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-7">
      {items.map(it => (
        <Spark key={it.id} item={it} />
      ))}
    </div>
  );
}

function Spark({ item }: { item: Trajectory }) {
  const router = useRouter();
  const { language } = useLanguage();
  const [ref, width] = useWidth<HTMLDivElement>(300);
  const [hover, setHover] = useState<number | null>(null);
  const h = 84;
  const m = { t: 6, b: 18, l: 2, r: 2 };
  const years = item.series.map(s => s[0]);
  const y0 = Math.min(...years);
  const y1 = Math.max(...years);
  const max = Math.max(...item.series.map(s => s[1]), 1);
  const x = linear(y0, y1, m.l, width - m.r);
  const y = linear(0, max, h - m.b, m.t);
  const line = item.series.map((s, i) => `${i ? 'L' : 'M'}${x(s[0])},${y(s[1])}`).join('');
  const area = `${line}L${x(y1)},${y(0)}L${x(y0)},${y(0)}Z`;
  const peak = item.series.reduce((a, b) => (b[1] > a[1] ? b : a));
  const hv = hover !== null ? item.series.find(s => s[0] === hover) : null;

  return (
    <div>
      <button
        type="button"
        onClick={() => router.push(`/scholar/${item.id}`)}
        className="font-sans text-[13.5px] font-medium text-ink hover:text-link text-left truncate block max-w-full"
      >
        {item.name}
      </button>
      <div className="font-sans text-[12px] text-ink3 tnum">
        {hv ? `${hv[0]}: ${formatInt(hv[1])}` : language === 'zh' ? `峰值 ${formatInt(peak[1])}（${peak[0]}）` : `peak ${formatInt(peak[1])} (${peak[0]})`}
      </div>
      <div ref={ref} className="mt-1">
        <svg
          width={width}
          height={h}
          onMouseMove={e => {
            const rect = (e.currentTarget as SVGSVGElement).getBoundingClientRect();
            const yr = Math.round(y0 + ((e.clientX - rect.left - m.l) / (width - m.l - m.r)) * (y1 - y0));
            setHover(Math.min(y1, Math.max(y0, yr)));
          }}
          onMouseLeave={() => setHover(null)}
        >
          <path d={area} fill="var(--series-1)" fillOpacity={0.12} />
          <path d={line} fill="none" stroke="var(--series-1)" strokeWidth={1.75} />
          <line x1={m.l} x2={width - m.r} y1={y(0)} y2={y(0)} stroke="var(--guide)" />
          {hv && (
            <>
              <line x1={x(hv[0])} x2={x(hv[0])} y1={m.t} y2={y(0)} stroke="var(--guide)" />
              <circle cx={x(hv[0])} cy={y(hv[1])} r={3.5} fill="var(--series-1)" stroke="var(--paper)" strokeWidth={1.5} />
            </>
          )}
          <text x={m.l} y={h - 4} fontSize={11} fill={AXIS.tick} fontFamily={AXIS.font}>{y0}</text>
          <text x={width - m.r} y={h - 4} fontSize={11} fill={AXIS.tick} fontFamily={AXIS.font} textAnchor="end">{y1}</text>
        </svg>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Home: citation distributions across disciplines                    */
/* ------------------------------------------------------------------ */

export interface StripRow {
  slug: string;
  label: string;
  median: number;
  dots: { id: string; name: string; v: number }[];
}

export function NormsStrip({ rows }: { rows: StripRow[] }) {
  const { language, t } = useLanguage();
  const router = useRouter();
  const [ref, width] = useWidth<HTMLDivElement>(1000);
  const [hover, setHover] = useState<{ row: StripRow; dot: StripRow['dots'][number]; cy: number } | null>(null);
  const narrow = width < 640;
  const labelW = narrow ? 0 : 210;
  const rowH = narrow ? 56 : 42;
  const m = { t: 8, r: 20, b: 46 };
  const height = m.t + rows.length * rowH + m.b;
  const all = rows.flatMap(r => r.dots.map(d => d.v));
  const x = log(Math.max(1000, Math.min(...all) * 0.9), Math.max(...all) * 1.1, labelW + 8, width - m.r);

  // Deterministic jitter so dots in a row do not sit on one line.
  const jitter = useMemo(() => {
    const out: Record<string, number> = {};
    for (const r of rows) for (const d of r.dots) {
      let hsh = 0;
      for (let i = 0; i < d.id.length; i++) hsh = (hsh * 31 + d.id.charCodeAt(i)) | 0;
      out[`${r.slug}:${d.id}`] = ((hsh % 1000) / 1000) * 0.5 + (hsh % 2 ? 0.25 : -0.25);
    }
    return out;
  }, [rows]);

  return (
    <div ref={ref} className="relative">
      <svg width={width} height={height} role="img" aria-label={t.home.heroTitle}>
        <XAxis scale={x} y={height - m.b} x0={labelW + 8} x1={width - m.r} grid={m.t} label={language === 'zh' ? '总引用数（对数刻度）' : 'Total citations (log scale)'} />
        {rows.map((r, i) => {
          const top = m.t + i * rowH;
          const cy = narrow ? top + 34 : top + rowH / 2;
          const band = narrow ? 14 : rowH * 0.32;
          const dim = hover && hover.row.slug !== r.slug;
          return (
            <g key={r.slug}>
              <text
                x={narrow ? 0 : labelW - 4}
                y={narrow ? top + 12 : cy}
                dy="0.32em"
                textAnchor={narrow ? 'start' : 'end'}
                fontSize={14}
                fill="var(--ink)"
                fontFamily="var(--font-serif), serif"
                style={{ cursor: 'pointer' }}
                onClick={() => router.push(`/field/${r.slug}`)}
              >
                {r.label}
              </text>
              {r.dots.map(d => {
                const isH = hover?.dot.id === d.id && hover.row.slug === r.slug;
                return (
                  <circle
                    key={d.id}
                    cx={x(d.v)}
                    cy={cy + (jitter[`${r.slug}:${d.id}`] ?? 0) * band}
                    r={isH ? 5 : 2.6}
                    fill={isH ? 'var(--series-2)' : 'var(--series-1)'}
                    fillOpacity={dim ? 0.15 : isH ? 1 : 0.45}
                    style={{ cursor: 'pointer' }}
                    onMouseEnter={() => setHover({ row: r, dot: d, cy })}
                    onMouseLeave={() => setHover(null)}
                    onClick={() => router.push(`/scholar/${d.id}`)}
                  />
                );
              })}
              <line x1={x(r.median)} x2={x(r.median)} y1={cy - band - 3} y2={cy + band + 3} stroke="var(--ink)" strokeWidth={2} />
            </g>
          );
        })}
      </svg>
      {hover && (
        <Tip x={x(hover.dot.v)} y={hover.cy} width={width}>
          <div className="font-medium">{hover.dot.name}</div>
          <div className="text-ink3">{hover.row.label}</div>
          <div className="mt-1">{formatInt(hover.dot.v)} {language === 'zh' ? '次引用' : 'citations'}</div>
        </Tip>
      )}
    </div>
  );
}

export function captionGini(template: string, gini: number, top10: number) {
  return fmt(template, { gini: gini.toFixed(2), top10: `${Math.round(top10 * 100)}%` });
}
