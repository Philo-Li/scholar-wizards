import type { Metadata } from 'next';
import { COLLECTION, rankedRows, scholarIndex, toRow } from '@/lib/data';
import { DISCIPLINE_BY_SLUG } from '@/lib/disciplines';
import { percentileOf } from '@/lib/stats';
import { ScholarView, type ScholarPageData } from '@/components/views/ScholarView';

export const dynamicParams = false;

export function generateStaticParams() {
  return [...scholarIndex().keys()].map(id => ({ id }));
}

function build(id: string): ScholarPageData {
  const members = scholarIndex().get(id)!;
  // Prefer a discipline where the scholar is an established member.
  const primary =
    members.find(m => m.slug !== 'collection' && m.scholar.group === 'core') ??
    members.find(m => m.slug !== 'collection') ??
    members[0];
  const raw = primary.scholar;
  const row = toRow(raw);

  const pool =
    primary.slug === 'collection'
      ? COLLECTION.scholars.map(toRow)
      : rankedRows(primary.slug);

  const metric = (k: 'h' | 'cites' | 'm' | 'recent') => {
    const values = pool.map(r => (r[k] ?? 0) as number);
    const own = (row[k] ?? 0) as number;
    return { values, own, pct: Math.round(percentileOf(values, own)) };
  };

  const peers = pool
    .filter(r => r.id !== id && r.subfield && r.subfield === row.subfield)
    .sort((a, b) => Math.abs(a.h - row.h) - Math.abs(b.h - row.h))
    .slice(0, 6)
    .sort((a, b) => b.h - a.h);

  return {
    raw,
    row,
    primarySlug: primary.slug,
    memberships: [...new Set(members.map(m => m.slug))],
    position: { h: metric('h'), cites: metric('cites'), m: metric('m'), recent: metric('recent') },
    peers,
  };
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const d = build(id);
  const field = d.primarySlug === 'collection' ? 'Computational neuroscience' : DISCIPLINE_BY_SLUG[d.primarySlug].name.en;
  return {
    title: d.raw.name,
    description: `${d.raw.name}${d.raw.inst ? `, ${d.raw.inst}` : ''}. ${field}: h-index ${d.raw.h}, ${d.raw.cites.toLocaleString('en-US')} citations, ${d.raw.works} works. Career trajectory and position within the discipline.`,
  };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ScholarView data={build(id)} />;
}
