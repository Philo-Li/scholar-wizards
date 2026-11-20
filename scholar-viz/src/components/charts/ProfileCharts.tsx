'use client';

import { useState } from 'react';
import { formatInt } from '@/lib/stats';
import { AXIS, Tip, XAxis, YAxis, linear, log, useWidth } from './core';

/** Bars per year. A partial final year is drawn hatched-light and labelled. */
export function YearBars({
  data,
  unit,
  partialYear,
  from,
  to,
}: {
  data: [number, number][];
  unit: string;
  partialYear?: number;
  from: number;
  to: number;
}) {
  const [ref, width] = useWidth<HTMLDivElement>(560);
  const [hover, setHover] = useState<number | null>(null);
  const height = 220;
  const m = { t: 28, r: 8, b: 36, l: 44 };
  const years: number[] = [];
  for (let y = from; y <= to; y++) years.push(y);
  const value = new Map(data);
  const max = Math.max(...years.map(y => value.get(y) ?? 0), 1);
  const y = linear(0, max, height - m.b, m.t, 4);
  const band = (width - m.l - m.r) / years.length;
  const bw = Math.max(1, band - 2); // 2px surface gap between bars
  const span = to - from;
  const step = span > 40 ? 10 : span > 16 ? 5 : 2;
  const x = linear(from, to, m.l + band / 2, width - m.r - band / 2);
  x.ticks = years.filter(v => v % step === 0);

  const hv = hover !== null ? { year: hover, v: value.get(hover) ?? 0 } : null;

  return (
    <div ref={ref} className="relative">
      <svg width={width} height={height} role="img" aria-label={unit} onMouseLeave={() => setHover(null)}>
        <YAxis scale={y} x={m.l} grid={width - m.r} label={unit} />
        {years.map((yr, i) => {
          const v = value.get(yr) ?? 0;
          const bx = m.l + i * band + 1;
          const top = y(v);
          const h = Math.max(0, y(0) - top);
          const partial = yr === partialYear;
          return (
            <g key={yr} onMouseEnter={() => setHover(yr)}>
              <rect x={m.l + i * band} y={m.t} width={band} height={height - m.b - m.t} fill="transparent" />
              {h > 0 && (
                <path
                  d={roundedTop(bx, top, bw, h, Math.min(4, bw / 2))}
                  fill="var(--series-1)"
                  fillOpacity={partial ? 0.35 : hover === yr ? 1 : 0.85}
                />
              )}
            </g>
          );
        })}
        <XAxis scale={x} y={height - m.b} x0={m.l} x1={width - m.r} format={v => String(v)} />
      </svg>
      {hv && (
        <Tip x={x(hv.year)} y={y(hv.v)} width={width}>
          <span className="font-medium">{hv.year}</span>: {formatInt(hv.v)}
          {hv.year === partialYear ? ' *' : ''}
        </Tip>
      )}
    </div>
  );
}

function roundedTop(x: number, y: number, w: number, h: number, r: number) {
  const rr = Math.min(r, h);
  return `M${x},${y + h}V${y + rr}Q${x},${y} ${x + rr},${y}H${x + w - rr}Q${x + w},${y} ${x + w},${y + rr}V${y + h}Z`;
}

/** One metric: the discipline's values as faint ticks, this scholar as a dark mark. */
export function PercentileStrip({
  label,
  values,
  own,
  pctLabel,
  display,
  logScale,
}: {
  label: string;
  values: number[];
  own: number;
  pctLabel: string;
  display: string;
  logScale?: boolean;
}) {
  const [ref, width] = useWidth<HTMLDivElement>(560);
  const narrow = width < 520;
  const labelW = narrow ? 0 : 150;
  const rightW = narrow ? 0 : 170;
  const h = narrow ? 52 : 34;
  const top = narrow ? 22 : 0;
  const lo = Math.max(logScale ? 1 : 0, Math.min(...values, own));
  const hi = Math.max(...values, own, lo + 1);
  const x = logScale ? log(Math.max(1, lo), hi, labelW + 6, width - rightW - 6) : linear(lo, hi, labelW + 6, width - rightW - 6);
  const cy = top + (h - top) / 2;

  return (
    <div ref={ref}>
      <svg width={width} height={h} role="img" aria-label={`${label}: ${display}, ${pctLabel}`}>
        <text x={0} y={narrow ? 12 : cy} dy={narrow ? 0 : '0.32em'} fontFamily={AXIS.font} fontSize={13.5} fill="var(--ink)">
          {label}
          {narrow && <tspan fill="var(--ink-2)">{`  ${display}, ${pctLabel}`}</tspan>}
        </text>
        <line x1={labelW + 6} x2={width - rightW - 6} y1={cy} y2={cy} stroke="var(--rule)" />
        {values.map((v, i) => (
          <line key={i} x1={x(Math.max(v, lo))} x2={x(Math.max(v, lo))} y1={cy - 7} y2={cy + 7} stroke="var(--context)" strokeWidth={1.25} />
        ))}
        <line x1={x(Math.max(own, lo))} x2={x(Math.max(own, lo))} y1={cy - 11} y2={cy + 11} stroke="var(--ink)" strokeWidth={3} strokeLinecap="round" />
        {!narrow && (
          <text x={width - rightW + 8} y={cy} dy="0.32em" fontFamily={AXIS.font} fontSize={13.5} className="tnum">
            <tspan fill="var(--ink)" fontWeight={600}>{display}</tspan>
            <tspan fill="var(--ink-3)" dx={8}>{pctLabel}</tspan>
          </text>
        )}
      </svg>
    </div>
  );
}
