import type { Metadata } from 'next';
import { allPeople, getPerson, peopleInTheme, toCard } from '@/lib/people';
import { scholarIndex } from '@/lib/data';
import { PersonView, type PersonPageData } from '@/components/views/PersonView';

export const dynamicParams = false;

export function generateStaticParams() {
  return allPeople().map(p => ({ slug: p.slug }));
}

function build(slug: string): PersonPageData {
  const person = getPerson(slug)!;
  const member = person.meta.openalex ? scholarIndex().get(person.meta.openalex)?.[0]?.scholar : undefined;
  const theme = person.themes.find(th => peopleInTheme(th).length > 1) ?? null;
  return {
    person,
    card: toCard(person),
    data: member ? { id: member.id, h: member.h, cites: member.cites } : null,
    related: theme
      ? { theme, people: peopleInTheme(theme).filter(p => p.slug !== slug).slice(0, 4).map(toCard) }
      : null,
  };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getPerson(slug)!;
  const span = p.diedYear ? `${p.bornYear}–${p.diedYear}` : `born ${p.bornYear}`;
  return {
    title: `${p.name.en} (${span})`,
    description: p.why.en,
    openGraph: p.meta.portrait ? { images: [p.meta.portrait.src] } : undefined,
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <PersonView data={build(slug)} />;
}
