import scholarDetails from '@/data/scholarDetails.json';
import ScholarPage from './ScholarPageClient';

// Static export: one page per scholar in the data file, nothing else
export const dynamicParams = false;

export function generateStaticParams() {
  return (scholarDetails as { id: string }[]).map(s => ({ id: s.id }));
}

export default function Page() {
  return <ScholarPage />;
}
