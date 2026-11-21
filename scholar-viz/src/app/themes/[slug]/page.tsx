import type { Metadata } from 'next';
import { allPeople, peopleInTheme, toCard } from '@/lib/people';
import { ALL_THEMES, THEME_BY_SLUG } from '@/content/themes';
import { median } from '@/lib/stats';
import { risingRows } from '@/lib/rising';
import { RisingView, ThemeView } from '@/components/views/ThemeView';

export const dynamicParams = false;

export function generateStaticParams() {
  return ALL_THEMES.map(t => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const th = THEME_BY_SLUG[slug];
  return { title: th.title.en, description: th.tagline.en };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (slug === 'rising') return <RisingView rows={risingRows()} />;
  const people = peopleInTheme(slug).map(toCard);
  const all = median(allPeople().map(p => p.keyAge));
  return <ThemeView slug={slug} people={people} median={Math.round(all)} />;
}
