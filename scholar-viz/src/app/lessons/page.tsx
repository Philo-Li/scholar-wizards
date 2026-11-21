import type { Metadata } from 'next';
import { allPeople } from '@/lib/people';
import { LessonsView, type LessonExample } from '@/components/views/LessonsView';

export const metadata: Metadata = {
  title: 'What they have in common',
  description: 'Ten traits that recur across the researchers in Scholar Wizards, each linked to the people who show it most clearly.',
};

export default function Page() {
  const examples: Record<string, LessonExample[]> = {};
  for (const p of allPeople()) {
    for (const l of p.lessons) {
      (examples[l.key] ??= []).push({ slug: p.slug, name: p.name, text: { en: l.en, zh: l.zh } });
    }
  }
  return <LessonsView examples={examples} />;
}
