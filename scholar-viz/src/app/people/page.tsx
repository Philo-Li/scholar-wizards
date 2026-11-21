import type { Metadata } from 'next';
import { allPeople, toCard } from '@/lib/people';
import { PeopleIndexView } from '@/components/views/PeopleIndexView';

export const metadata: Metadata = {
  title: 'People',
  description: 'Everyone in Scholar Wizards: researchers in ten disciplines whose paths, ages and styles were anything but ordinary.',
};

export default function Page() {
  return <PeopleIndexView people={allPeople().map(toCard)} />;
}
