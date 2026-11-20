'use client';

import { ReactNode, RefObject, useEffect, useRef, useState } from 'react';

/** Width of a container, tracked with ResizeObserver. */
export function useWidth<T extends HTMLElement>(fallback = 720): [RefObject<T | null>, number] {
  const ref = useRef<T>(null);
  const [w, setW] = useState(fallback);
  useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(entries => {
      const cw = entries[0]?.contentRect.width;
      if (cw) setW(Math.round(cw));
    });
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);
  return [ref, w];
}

export type Scale = ((v: number) => number) & { ticks: number[] };

export function linear(d0: number, d1: number, r0: number, r1: number, tickCount = 5): Scale {
  const span = d1 - d0 || 1;
  const f = ((v: number) => r0 + ((v - d0) / span) * (r1 - r0)) as Scale;
  f.ticks = niceTicks(d0, d1, tickCount);
  return f;
}

export function log(d0: number, d1: number, r0: number, r1: number): Scale {
  const l0 = Math.log10(Math.max(d0, 1e-9));
  const l1 = Math.log10(d1);
  const span = l1 - l0 || 1;
  const f = ((v: number) => r0 + ((Math.log10(Math.max(v, d0)) - l0) / span) * (r1 - r0)) as Scale;
  const ticks: number[] = [];
  for (let e = Math.floor(l0); e <= Math.ceil(l1); e++) {
    const p = 10 ** e;
    if (p >= d0 && p <= d1) ticks.push(p);
  }
  if (ticks.length < 3) {
    for (let e = Math.floor(l0); e <= Math.ceil(l1); e++) {
      const p = 3 * 10 ** e;
      if (p >= d0 && p <= d1) ticks.push(p);
    }
    ticks.sort((a, b) => a - b);
  }
  f.ticks = ticks;
  return f;
}

export function niceTicks(d0: number, d1: number, count = 5): number[] {
  const span = d1 - d0;
  if (span <= 0) return [d0];
  const raw = span / count;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const norm = raw / mag;
  const step = (norm >= 5 ? 10 : norm >= 2 ? 5 : norm >= 1 ? 2 : 1) * mag;
  const out: number[] = [];
  for (let v = Math.ceil(d0 / step) * step; v <= d1 + 1e-9; v += step) out.push(Math.round(v * 1e6) / 1e6);
  return out;
}

export function tickLabel(v: number): string {
  if (v >= 1e6) return `${v / 1e6}M`;
  if (v >= 1e3) return `${v / 1e3}k`;
  return String(v);
}

/** Absolutely positioned tooltip inside a relative chart container. */
export function Tip({ x, y, width, children }: { x: number; y: number; width: number; children: ReactNode }) {
  const left = x > width - 240 ? x - 12 : x + 12;
  return (
    <div
      className="pointer-events-none absolute z-10"
      style={{ left, top: y, transform: `translate(${x > width - 240 ? '-100%' : '0'}, -50%)` }}
    >
      <div className="font-sans text-[12.5px] leading-snug bg-paper text-ink border border-rule rounded shadow-sm px-3 py-2 w-max max-w-[260px] tnum">
        {children}
      </div>
    </div>
  );
}

export const AXIS = {
  font: 'var(--font-sans), system-ui, sans-serif',
  tick: 'var(--ink-3)',
  label: 'var(--ink-2)',
  line: 'var(--guide)',
  grid: 'var(--rule)',
};

/** Horizontal axis with ticks below the plot. */
export function XAxis({
  scale,
  y,
  x0,
  x1,
  label,
  format = tickLabel,
  grid,
}: {
  scale: Scale;
  y: number;
  x0: number;
  x1: number;
  label?: string;
  format?: (v: number) => string;
  grid?: number; // top of plot; draws vertical grid lines when given
}) {
  return (
    <g fontFamily={AXIS.font} fontSize={12}>
      <line x1={x0} x2={x1} y1={y} y2={y} stroke={AXIS.line} />
      {scale.ticks.map(t => (
        <g key={t} transform={`translate(${scale(t)},0)`}>
          {grid !== undefined && <line y1={grid} y2={y} stroke={AXIS.grid} />}
          <line y1={y} y2={y + 4} stroke={AXIS.line} />
          <text y={y + 17} textAnchor="middle" fill={AXIS.tick} className="tnum">
            {format(t)}
          </text>
        </g>
      ))}
      {label && (
        <text x={x1} y={y + 36} textAnchor="end" fill={AXIS.label} fontSize={12.5}>
          {label}
        </text>
      )}
    </g>
  );
}

export function YAxis({
  scale,
  x,
  label,
  format = tickLabel,
  grid,
}: {
  scale: Scale;
  x: number;
  label?: string;
  format?: (v: number) => string;
  grid?: number; // right edge of plot; draws horizontal grid lines when given
}) {
  return (
    <g fontFamily={AXIS.font} fontSize={12}>
      {scale.ticks.map(t => (
        <g key={t} transform={`translate(0,${scale(t)})`}>
          {grid !== undefined && <line x1={x} x2={grid} stroke={AXIS.grid} />}
          <text x={x - 8} dy="0.32em" textAnchor="end" fill={AXIS.tick} className="tnum">
            {format(t)}
          </text>
        </g>
      ))}
      {label && (
        <text x={0} y={12} textAnchor="start" fill={AXIS.label} fontSize={12.5}>
          {label}
        </text>
      )}
    </g>
  );
}
