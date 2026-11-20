import type { Metadata } from 'next';
import { DISCIPLINES, DISCIPLINE_BY_SLUG } from '@/lib/disciplines';
import { fieldSummary } from '@/lib/summaries';
import { FieldView } from '@/components/views/FieldView';

export const dynamicParams = false;

export function generateStaticParams() {
  return DISCIPLINES.map(d => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const d = DISCIPLINE_BY_SLUG[slug];
  return {
    title: `${d.name.en}: most-cited researchers`,
    description: `Leaderboard, career-stage figures, subfield norms and rising scholars in ${d.name.en.toLowerCase()}. ${d.scope.en}`,
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <FieldView summary={fieldSummary(slug)} />;
}
