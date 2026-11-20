import type { Metadata } from 'next';
import { COLLECTION, toRow } from '@/lib/data';
import legacy from '@/data/collections/comp-neuro-early-career.json';
import { CollectionView, type EarlyRow, type YoungRow } from '@/components/views/CollectionView';

export const metadata: Metadata = {
  title: 'Computational neuroscience: a curated collection',
  description: 'A hand-picked list of computational neuroscientists from David Marr to the current generation, with early-career impact measured paper by paper.',
};

export default function Page() {
  return (
    <CollectionView
      rows={COLLECTION.scholars.map(toRow)}
      early={legacy.early as EarlyRow[]}
      young={legacy.young as YoungRow[]}
      fetchedAt={COLLECTION.fetchedAt}
    />
  );
}
