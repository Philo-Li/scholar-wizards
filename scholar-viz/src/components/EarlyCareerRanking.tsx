'use client';

import Link from 'next/link';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import scholarDetails from '@/data/scholarDetails.json';

// Create name to ID mapping
const nameToIdMap: Record<string, string> = {};
(scholarDetails as { id: string; name: string }[]).forEach(s => {
  nameToIdMap[s.name] = s.id;
});

export interface EarlyCareerScholar {
  name: string;
  institution: string;
  firstPubYear: number;
  earlyCareerEnd: number;
  earlyWorksCount: number;
  earlyCareerCitations: number;
  totalCitations: number;
  hIndex: number;
  earlyPct: number;
  topPaper: string;
  topPaperCitations: number;
}

interface RankingProps {
  data: EarlyCareerScholar[];
  title: string;
}

const GRADIENT_COLORS = [
  '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16',
  '#22c55e', '#14b8a6', '#06b6d4', '#0ea5e9', '#3b82f6',
  '#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899',
  '#f43f5e', '#fb7185', '#fda4af', '#fecdd3', '#fee2e2'
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: any[] }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as EarlyCareerScholar;
    return (
      <div className="bg-white p-4 shadow-xl rounded-lg border max-w-xs">
        <p className="font-bold text-gray-800">{data.name}</p>
        <p className="text-sm text-gray-500 mb-2">{data.institution || 'Independent'}</p>
        <div className="space-y-1 text-sm">
          <p><span className="text-gray-600">Career Start:</span> <span className="font-medium">{data.firstPubYear} - {data.earlyCareerEnd}</span></p>
          <p><span className="text-gray-600">Early Citations:</span> <span className="font-medium text-blue-600">{data.earlyCareerCitations.toLocaleString()}</span></p>
          <p><span className="text-gray-600">Total Citations:</span> <span className="font-medium">{data.totalCitations.toLocaleString()}</span></p>
          <p><span className="text-gray-600">Early Papers:</span> <span className="font-medium">{data.earlyWorksCount}</span></p>
          <p><span className="text-gray-600">Early %:</span> <span className="font-medium">{data.earlyPct}%</span></p>
        </div>
        {data.topPaper && (
          <div className="mt-2 pt-2 border-t">
            <p className="text-xs text-gray-500">Top Paper:</p>
            <p className="text-xs font-medium text-gray-700">{data.topPaper.slice(0, 60)}...</p>
          </div>
        )}
      </div>
    );
  }
  return null;
};

export function EarlyCareerBarChart({ data, title }: RankingProps) {
  const chartData = data.slice(0, 15).map((d, i) => ({
    ...d,
    shortName: d.name.length > 20 ? d.name.slice(0, 18) + '...' : d.name,
    rank: i + 1
  }));

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={500}>
        <BarChart data={chartData} layout="vertical" margin={{ left: 140, right: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            type="number"
            tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(1)}K` : v}
          />
          <YAxis
            type="category"
            dataKey="shortName"
            tick={{ fontSize: 12 }}
            width={140}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="earlyCareerCitations" radius={[0, 4, 4, 0]}>
            {chartData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={GRADIENT_COLORS[index % GRADIENT_COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function EarlyCareerTable({ data }: { data: EarlyCareerScholar[] }) {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold">#</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Scholar</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Institution</th>
              <th className="px-4 py-3 text-center text-sm font-semibold">Career Start</th>
              <th className="px-4 py-3 text-right text-sm font-semibold">Early Citations</th>
              <th className="px-4 py-3 text-right text-sm font-semibold">Early %</th>
              <th className="px-4 py-3 text-center text-sm font-semibold">Papers</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.slice(0, 20).map((scholar, idx) => (
              <tr
                key={scholar.name}
                className={`hover:bg-amber-50 transition-colors ${idx < 3 ? 'bg-amber-50/50' : ''}`}
              >
                <td className="px-4 py-3">
                  {idx < 3 ? (
                    <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-white text-sm font-bold ${
                      idx === 0 ? 'bg-yellow-500' : idx === 1 ? 'bg-gray-400' : 'bg-amber-600'
                    }`}>
                      {idx + 1}
                    </span>
                  ) : (
                    <span className="text-gray-500 font-medium">{idx + 1}</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/scholar/${nameToIdMap[scholar.name] || ''}`}
                    className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    {scholar.name}
                  </Link>
                  <div className="text-xs text-gray-500 mt-0.5 truncate max-w-[200px]" title={scholar.topPaper}>
                    {scholar.topPaper}
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600 max-w-[180px] truncate" title={scholar.institution}>
                  {scholar.institution || 'Independent'}
                </td>
                <td className="px-4 py-3 text-center text-sm text-gray-600">
                  {scholar.firstPubYear}-{scholar.earlyCareerEnd}
                </td>
                <td className="px-4 py-3 text-right">
                  <span className="font-semibold text-amber-600">
                    {scholar.earlyCareerCitations.toLocaleString()}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${
                    scholar.earlyPct >= 50 ? 'bg-green-100 text-green-700' :
                    scholar.earlyPct >= 20 ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {scholar.earlyPct}%
                  </span>
                </td>
                <td className="px-4 py-3 text-center text-sm text-gray-600">
                  {scholar.earlyWorksCount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

interface InsightCardProps {
  icon: string;
  title: string;
  description: string;
  highlight?: string;
}

function InsightCard({ icon, title, description, highlight }: InsightCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-amber-500">
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
      {highlight && (
        <p className="mt-2 text-amber-600 font-medium text-sm">{highlight}</p>
      )}
    </div>
  );
}

export function EarlyCareerInsights({ data }: { data: EarlyCareerScholar[] }) {
  const avgEarlyCitations = Math.round(data.reduce((sum, d) => sum + d.earlyCareerCitations, 0) / data.length);
  const highEarlyPct = data.filter(d => d.earlyPct >= 20).length;
  const modernScholars = data.filter(d => d.firstPubYear >= 2005);
  const classicScholars = data.filter(d => d.firstPubYear < 1990);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <InsightCard
        icon="1"
        title="David Marr's Legacy"
        description="David Marr leads with 6,724 early citations. His 1969-1973 works, especially 'A theory of cerebellar cortex', defined computational neuroscience's foundations."
        highlight="Single paper: 3,291 citations"
      />
      <InsightCard
        icon="2"
        title="Early Burst Pattern"
        description={`${highEarlyPct} scholars have >20% of total citations from their first 5 years, indicating strong early-career impact in this field.`}
        highlight={`Average early citations: ${avgEarlyCitations.toLocaleString()}`}
      />
      <InsightCard
        icon="3"
        title="Modern Rising Stars"
        description={`${modernScholars.length} scholars starting after 2005 made the top 20, showing the field's continued growth and new talent emergence.`}
        highlight="Gershman, Scellier, Zenke lead the new generation"
      />
      <InsightCard
        icon="4"
        title="Sustained vs. Early Impact"
        description={`Compare Warland (100% early) vs Paninski (7.5% early): some scholars peak early, others build influence over decades.`}
        highlight={`${classicScholars.length} pre-1990 scholars still influential`}
      />
    </div>
  );
}
