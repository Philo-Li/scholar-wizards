import type { Metadata } from 'next';
import { getDiscipline } from '@/lib/data';
import { MethodsView } from '@/components/views/MethodsView';

export const metadata: Metadata = {
  title: 'Methods',
  description: 'How scholars are selected, how the h-index, m-quotient and other indicators are defined, and where the numbers mislead.',
};

export default function Page() {
  return <MethodsView fetchedAt={getDiscipline('mathematics').fetchedAt} />;
}
