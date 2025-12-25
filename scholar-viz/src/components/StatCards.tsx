'use client';

import { useLanguage } from '@/i18n/LanguageContext';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: string;
  color?: 'blue' | 'green' | 'purple' | 'orange';
}

const colorClasses = {
  blue: 'from-blue-500 to-blue-600',
  green: 'from-emerald-500 to-emerald-600',
  purple: 'from-purple-500 to-purple-600',
  orange: 'from-orange-500 to-orange-600'
};

export function StatCard({ title, value, subtitle, icon, color = 'blue' }: StatCardProps) {
  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} rounded-xl p-6 text-white shadow-lg`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-white/80 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold mt-2">{typeof value === 'number' ? value.toLocaleString() : value}</p>
          {subtitle && <p className="text-white/70 text-sm mt-1">{subtitle}</p>}
        </div>
        {icon && <span className="text-4xl opacity-80">{icon}</span>}
      </div>
    </div>
  );
}

interface StatsGridProps {
  stats: {
    totalScholars: number;
    citations: { mean: number; median: number; max: number; top10Percent: number };
    hIndex: { mean: number; median: number; max: number };
    worksCount: { mean: number; median: number };
  };
}

export function StatsGrid({ stats }: StatsGridProps) {
  const { t } = useLanguage();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title={t.home.totalScholars}
        value={stats.totalScholars}
        subtitle={t.home.inComputationalNeuroscience}
        icon="👨‍🔬"
        color="blue"
      />
      <StatCard
        title={t.home.avgCitations}
        value={stats.citations.mean.toLocaleString()}
        subtitle={`${t.home.median}: ${stats.citations.median.toLocaleString()}`}
        icon="📚"
        color="green"
      />
      <StatCard
        title={t.home.avgHIndex}
        value={stats.hIndex.mean}
        subtitle={`${t.home.max}: ${stats.hIndex.max}`}
        icon="📊"
        color="purple"
      />
      <StatCard
        title={t.home.avgPublications}
        value={stats.worksCount.mean}
        subtitle={`${t.home.median}: ${stats.worksCount.median}`}
        icon="📝"
        color="orange"
      />
    </div>
  );
}
