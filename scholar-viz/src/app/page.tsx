import { allPeople, toCard } from '@/lib/people';
import { THEMES, RISING_THEME } from '@/content/themes';
import { DISCIPLINES } from '@/lib/disciplines';
import { risingRows } from '@/lib/rising';
import { FrontView, type FrontChapter } from '@/components/views/FrontView';

export default function Home() {
  const people = allPeople();
  const cards = people.map(toCard);

  const chapters: FrontChapter[] = THEMES.map(th => {
    const members = people.filter(p => p.themes.includes(th.slug));
    return {
      slug: th.slug,
      count: members.length,
      people: members.map(p => ({ slug: p.slug, name: p.name })),
    };
  }).filter(c => c.count > 0);
  chapters.push({ slug: RISING_THEME.slug, count: risingRows().length, people: [] });

  // Label the youngest, the oldest and a few familiar names, one per column.
  const sorted = [...cards].sort((a, b) => a.keyAge - b.keyAge);
  const wanted = [sorted[0]?.slug, sorted.at(-1)?.slug, 'albert-einstein', 'yitang-zhang', 'claude-shannon', 'john-goodenough'];
  const usedBins = new Set<number>();
  const annotate: string[] = [];
  for (const slug of wanted) {
    const c = cards.find(x => x.slug === slug);
    if (!c) continue;
    const b = Math.floor(c.keyAge / 6);
    if (usedBins.has(b)) continue;
    usedBins.add(b);
    annotate.push(slug!);
  }

  const used = new Set(people.flatMap(p => p.disciplines));
  return (
    <FrontView
      people={cards}
      chapters={chapters}
      annotate={annotate}
      disciplines={DISCIPLINES.filter(d => used.has(d.slug)).length}
    />
  );
}
