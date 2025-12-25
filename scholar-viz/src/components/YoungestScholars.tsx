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
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  ScatterChart,
  Scatter,
  ZAxis,
  TooltipProps
} from 'recharts';
import scholarDetails from '@/data/scholarDetails.json';

export interface YoungScholar {
  name: string;
  institution: string;
  firstPubYear: number;
  academicAge: number;
  totalCitations: number;
  hIndex: number;
  earlyCareerCitations: number;
  topPaper: string;
}

// Create name to ID mapping
const nameToIdMap: Record<string, string> = {};
(scholarDetails as { id: string; name: string }[]).forEach(s => {
  nameToIdMap[s.name] = s.id;
});

const COLORS = ['#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#f43f5e', '#ef4444'];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload }: TooltipProps<any, any>) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as YoungScholar;
    return (
      <div className="bg-white p-4 shadow-xl rounded-lg border max-w-xs">
        <p className="font-bold text-gray-800">{data.name}</p>
        <p className="text-sm text-gray-500 mb-2">{data.institution}</p>
        <div className="space-y-1 text-sm">
          <p><span className="text-gray-600">First Publication:</span> <span className="font-medium">{data.firstPubYear}</span></p>
          <p><span className="text-gray-600">Academic Age:</span> <span className="font-medium">{data.academicAge} years</span></p>
          <p><span className="text-gray-600">Total Citations:</span> <span className="font-medium text-blue-600">{data.totalCitations.toLocaleString()}</span></p>
          <p><span className="text-gray-600">H-Index:</span> <span className="font-medium">{data.hIndex}</span></p>
        </div>
      </div>
    );
  }
  return null;
};

export function YoungestScholarsChart({ data }: { data: YoungScholar[] }) {
  const chartData = data.map((d, i) => ({
    ...d,
    shortName: d.name.split(' ').pop() || d.name,
    rank: i + 1,
    citationsPerYear: Math.round(d.totalCitations / d.academicAge)
  }));

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Citations per Academic Year</h3>
      <p className="text-sm text-gray-500 mb-4">Measuring research efficiency: total citations divided by years in academia</p>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={chartData} layout="vertical" margin={{ left: 100, right: 30 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fontSize: 12 }}
            width={100}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="citationsPerYear" radius={[0, 4, 4, 0]}>
            {chartData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function YoungestScholarsBubble({ data }: { data: YoungScholar[] }) {
  const bubbleData = data.map(d => ({
    ...d,
    z: d.totalCitations / 500, // Scale for bubble size
  }));

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Academic Age vs H-Index</h3>
      <p className="text-sm text-gray-500 mb-4">Bubble size represents total citations</p>
      <ResponsiveContainer width="100%" height={400}>
        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid />
          <XAxis
            type="number"
            dataKey="academicAge"
            name="Academic Age"
            label={{ value: 'Academic Age (years)', position: 'bottom' }}
            domain={[5, 20]}
          />
          <YAxis
            type="number"
            dataKey="hIndex"
            name="H-Index"
            label={{ value: 'H-Index', angle: -90, position: 'left' }}
          />
          <ZAxis type="number" dataKey="z" range={[100, 1000]} />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const d = payload[0].payload as YoungScholar;
                return (
                  <div className="bg-white p-3 shadow-lg rounded-lg border">
                    <p className="font-semibold">{d.name}</p>
                    <p className="text-sm text-gray-600">Age: {d.academicAge} yrs | H: {d.hIndex}</p>
                    <p className="text-sm text-blue-600">Citations: {d.totalCitations.toLocaleString()}</p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Scatter data={bubbleData} fill="#8b5cf6">
            {bubbleData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}

export function YoungestScholarsTable({ data }: { data: YoungScholar[] }) {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold">#</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Scholar</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Institution</th>
              <th className="px-4 py-3 text-center text-sm font-semibold">First Pub</th>
              <th className="px-4 py-3 text-center text-sm font-semibold">Age</th>
              <th className="px-4 py-3 text-right text-sm font-semibold">Citations</th>
              <th className="px-4 py-3 text-center text-sm font-semibold">H-Index</th>
              <th className="px-4 py-3 text-right text-sm font-semibold">Cites/Year</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map((scholar, idx) => {
              const citesPerYear = Math.round(scholar.totalCitations / scholar.academicAge);
              return (
                <tr
                  key={scholar.name}
                  className="hover:bg-cyan-50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-white text-sm font-bold`}
                      style={{ backgroundColor: COLORS[idx % COLORS.length] }}>
                      {idx + 1}
                    </span>
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
                  <td className="px-4 py-3 text-sm text-gray-600 max-w-[150px] truncate" title={scholar.institution}>
                    {scholar.institution}
                  </td>
                  <td className="px-4 py-3 text-center text-sm font-medium text-gray-800">
                    {scholar.firstPubYear}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-cyan-100 text-cyan-700">
                      {scholar.academicAge} yrs
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-gray-800">
                    {scholar.totalCitations.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-center font-medium text-gray-800">
                    {scholar.hIndex}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="font-semibold text-cyan-600">{citesPerYear}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function YoungestScholarsInsights({ data }: { data: YoungScholar[] }) {
  const avgAge = Math.round(data.reduce((sum, d) => sum + d.academicAge, 0) / data.length);
  const avgCitations = Math.round(data.reduce((sum, d) => sum + d.totalCitations, 0) / data.length);
  const topEfficiency = data.reduce((max, d) =>
    (d.totalCitations / d.academicAge) > (max.totalCitations / max.academicAge) ? d : max
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white rounded-xl shadow-lg p-5 border-l-4 border-cyan-500">
        <div className="text-3xl mb-2">🌟</div>
        <h3 className="font-semibold text-gray-800 mb-1">Youngest Scholar</h3>
        <p className="text-2xl font-bold text-cyan-600">{data[0].name.split(' ').pop()}</p>
        <p className="text-sm text-gray-500">Started in {data[0].firstPubYear}, only {data[0].academicAge} years in academia</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-5 border-l-4 border-blue-500">
        <div className="text-3xl mb-2">🚀</div>
        <h3 className="font-semibold text-gray-800 mb-1">Most Efficient</h3>
        <p className="text-2xl font-bold text-blue-600">{topEfficiency.name.split(' ').pop()}</p>
        <p className="text-sm text-gray-500">{Math.round(topEfficiency.totalCitations / topEfficiency.academicAge)} citations/year average</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-5 border-l-4 border-purple-500">
        <div className="text-3xl mb-2">📊</div>
        <h3 className="font-semibold text-gray-800 mb-1">Average Stats</h3>
        <p className="text-2xl font-bold text-purple-600">{avgAge} years</p>
        <p className="text-sm text-gray-500">Avg age with {avgCitations.toLocaleString()} avg citations</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-5 border-l-4 border-pink-500">
        <div className="text-3xl mb-2">🎯</div>
        <h3 className="font-semibold text-gray-800 mb-1">AI-Neuro Focus</h3>
        <p className="text-2xl font-bold text-pink-600">70%</p>
        <p className="text-sm text-gray-500">of young scholars work on AI + neuroscience intersection</p>
      </div>
    </div>
  );
}
