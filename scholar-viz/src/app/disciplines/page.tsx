import type { Metadata } from 'next';
import { DISCIPLINES } from '@/lib/disciplines';
import { COLLECTION, rankedRows, scholarIndex, getDiscipline } from '@/lib/data';
import { gini, median } from '@/lib/stats';
import { HomeView, type HomeDiscipline } from '@/components/views/HomeView';

export const metadata: Metadata = {
  title: 'Ten disciplines in the data',
  description: 'Leaderboards, career-stage figures and subfield norms for the most cited researchers in ten disciplines, built from OpenAlex.',
};

export default function Page() {
  const disciplines: HomeDiscipline[] = DISCIPLINES.map(d => {
    const rows = rankedRows(d.slug);
    const cites = rows.map(r => r.cites);
    return {
      slug: d.slug,
      n: rows.length,
      medianH: median(rows.map(r => r.h)),
      medianCites: median(cites),
      gini: gini(cites),
      dots: rows.map(r => ({ id: r.id, name: r.name, v: r.cites })),
    };
  });
  return (
    <HomeView
      disciplines={disciplines}
      totalScholars={scholarIndex().size}
      collectionSize={COLLECTION.scholars.length}
      fetchedAt={getDiscipline('mathematics').fetchedAt}
    />
  );
}
