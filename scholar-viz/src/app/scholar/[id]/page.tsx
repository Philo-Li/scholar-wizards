import type { Metadata } from 'next';
import { COLLECTION, getRows, rankedRows, scholarIndex, toRow } from '@/lib/data';
import { personForOpenAlex } from '@/lib/people';
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

  // Why this scholar is on the site, from the rule that put them on the list.
  let why: ScholarPageData['why'];
  if (primary.slug === 'collection') {
    why = { kind: 'collection' };
  } else if (raw.group === 'rising') {
    const cohort = getRows(primary.slug)
      .filter(r => r.group === 'rising' && r.m !== null)
      .sort((a, b) => b.m! - a.m!);
    why = { kind: 'rising', rank: cohort.findIndex(r => r.id === id) + 1, n: cohort.length, m: row.m ?? 0, first: raw.first ?? 0 };
  } else {
    const core = getRows(primary.slug)
      .filter(r => r.group === 'core' && (raw.hyper || !r.hyper))
      .sort((a, b) => b.cites - a.cites);
    const sub = row.subfield ? core.filter(r => r.subfield === row.subfield) : [];
    why = {
      kind: 'core',
      rank: core.findIndex(r => r.id === id) + 1,
      n: core.length,
      subRank: sub.length > 1 ? sub.findIndex(r => r.id === id) + 1 : 0,
      subN: sub.length,
    };
  }
  const chapter = personForOpenAlex(id);

  return {
    why,
    chapter: chapter ? { slug: chapter.slug, name: chapter.name } : null,
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
