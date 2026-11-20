'use client';

import { ReactNode, useState } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';

/** A numbered figure: title above, plot, caption below, optional data table. */
export function Figure({
  n,
  title,
  caption,
  children,
  table,
  className = '',
}: {
  n: number;
  title: string;
  caption?: ReactNode;
  children: ReactNode;
  table?: ReactNode;
  className?: string;
}) {
  const { t } = useLanguage();
  const [showTable, setShowTable] = useState(false);
  return (
    <figure className={`my-0 ${className}`}>
      <h3 className="font-serif text-[19px] leading-snug font-semibold text-ink mb-4">
        <span className="font-sans text-[13px] font-medium text-ink3 mr-2 tnum">
          {t.common.figure} {n}
        </span>
        {title}
      </h3>
      <div>{children}</div>
      {(caption || table) && (
        <figcaption className="mt-4 max-w-prose text-[15px] leading-relaxed text-ink2">
          {caption}
          {table && (
            <button
              type="button"
              onClick={() => setShowTable(s => !s)}
              className="ml-2 font-sans text-[13px] text-link underline underline-offset-2 decoration-1"
              aria-expanded={showTable}
            >
              {showTable ? t.common.hideTable : t.common.viewTable}
            </button>
          )}
        </figcaption>
      )}
      {table && showTable && <div className="mt-4 overflow-x-auto">{table}</div>}
    </figure>
  );
}

/** Section heading anchored for the table of contents. */
export function Section({
  id,
  title,
  intro,
  children,
}: {
  id: string;
  title: string;
  intro?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-20 pt-4">
      <h2 className="font-serif text-[26px] leading-tight font-semibold tracking-tight text-ink">{title}</h2>
      {intro && <p className="mt-3 max-w-prose text-[17px] leading-relaxed text-ink2">{intro}</p>}
      <div className="mt-8">{children}</div>
    </section>
  );
}

/** Tooltip box shared by every chart. */
export function TipBox({ children }: { children: ReactNode }) {
  return (
    <div className="font-sans text-[12.5px] leading-snug bg-paper text-ink border border-rule rounded shadow-sm px-3 py-2 max-w-[260px] tnum">
      {children}
    </div>
  );
}

/** A labelled number, set in text rather than a card. */
export function Stat({ value, label }: { value: ReactNode; label: string }) {
  return (
    <div>
      <div className="font-serif text-[34px] leading-none font-semibold text-ink tnum">{value}</div>
      <div className="mt-2 font-sans text-[13px] leading-snug text-ink2 max-w-[18ch]">{label}</div>
    </div>
  );
}

export function Legend({ items }: { items: { label: string; color: string; shape?: 'dot' | 'line' }[] }) {
  return (
    <ul className="flex flex-wrap gap-x-5 gap-y-1 font-sans text-[13px] text-ink2 mb-3">
      {items.map(it => (
        <li key={it.label} className="flex items-center gap-2">
          {it.shape === 'line' ? (
            <span className="inline-block w-5 border-t-2 border-dashed" style={{ borderColor: it.color }} />
          ) : (
            <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ background: it.color }} />
          )}
          {it.label}
        </li>
      ))}
    </ul>
  );
}
