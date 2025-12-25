'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import earlyCareerData from '@/data/earlyCareer.json';

interface Scholar {
  id: string;
  name: string;
  works_count: number;
  cited_by_count: number;
  h_index: number;
  i10_index: number;
  institution: string;
  country: string;
  category: string;
  mean_citedness_2yr: number;
}

interface RankingMatrixProps {
  scholars: Scholar[];
}

type MetricKey = 'h_index' | 'mean_citedness_2yr' | 'efficiency' | 'cited_by_count' | 'works_count' | 'i10_index' | 'm_index';

interface MetricConfig {
  key: MetricKey;
  label: string;
  shortLabel: string;
  description: string;
  category: 'stature' | 'momentum' | 'structure' | 'fairness';
  importance: 'primary' | 'secondary' | 'auxiliary';
  tooltip: string;
}

// Build name to first publication year mapping
const firstPubYearMap: Record<string, number> = {};
earlyCareerData.forEach((s: { name: string; firstPubYear: number }) => {
  firstPubYearMap[s.name] = s.firstPubYear;
});

const METRICS: MetricConfig[] = [
  // Primary metrics (most important for stature)
  {
    key: 'h_index',
    label: 'H-Index',
    shortLabel: 'H-Index',
    description: 'H-index metric',
    category: 'stature',
    importance: 'primary',
    tooltip: 'Signal of sustained high-impact work. Better than total citations for measuring "long-term stable academic output quality". Caveat: strongly dependent on career length.'
  },
  {
    key: 'mean_citedness_2yr',
    label: '2-Year Impact',
    shortLabel: '2Yr',
    description: 'Recent impact (2-year mean citedness)',
    category: 'momentum',
    importance: 'primary',
    tooltip: 'Reflects "whether still at the center of the field". Critical for judging current activity and frontier status. Especially important when selecting advisors or collaborators.'
  },
  {
    key: 'efficiency',
    label: 'Citations/Paper',
    shortLabel: 'Eff',
    description: 'Average citations per paper (efficiency)',
    category: 'structure',
    importance: 'primary',
    tooltip: 'Impact per unit output. Used to "penalize pure paper quantity padding" and identify "few but impactful / methodology-type high-impact" scholars.'
  },
  // Fairness metric (adjusts for career length)
  {
    key: 'm_index',
    label: 'M-Index',
    shortLabel: 'M-Idx',
    description: 'H-index / Academic Age (career-adjusted)',
    category: 'fairness',
    importance: 'primary',
    tooltip: 'H-index divided by academic age. Key metric for distinguishing "high after 30 years" vs "high after just 10 years" - the latter is often a stronger signal.'
  },
  // Secondary metrics
  {
    key: 'cited_by_count',
    label: 'Total Citations',
    shortLabel: 'Citations',
    description: 'Total number of citations',
    category: 'stature',
    importance: 'secondary',
    tooltip: 'Intuitive but favors "major reviews/major tools/cross-domain" researchers. Use as signal for "external influence/cross-community impact" rather than sole basis for in-field status.'
  },
  // Auxiliary metrics
  {
    key: 'works_count',
    label: 'Publications',
    shortLabel: 'Pubs',
    description: 'Total publications',
    category: 'structure',
    importance: 'auxiliary',
    tooltip: 'Only indicates output scale, weakly correlated with "status". High output does not equal leading scholar - sometimes just "large team + frequent small papers".'
  },
  {
    key: 'i10_index',
    label: 'i10-Index',
    shortLabel: 'i10',
    description: 'Papers with 10+ citations',
    category: 'structure',
    importance: 'auxiliary',
    tooltip: 'Highly redundant with citations/h-index, little incremental information. Can be de-weighted or ignored.'
  },
];

// Weighting schemes for different purposes
type WeightingScheme = 'stature' | 'advisor' | 'legacy';

interface WeightConfig {
  name: string;
  description: string;
  weights: Record<MetricKey, number>;
}

const WEIGHTING_SCHEMES: Record<WeightingScheme, WeightConfig> = {
  stature: {
    name: 'Academic Stature',
    description: 'Balanced evaluation of historical contributions and current activity',
    weights: {
      h_index: 0.35,
      mean_citedness_2yr: 0.30,
      efficiency: 0.15,
      m_index: 0.10,
      cited_by_count: 0.10,
      works_count: 0,
      i10_index: 0
    }
  },
  advisor: {
    name: 'Advisor/Collaborator',
    description: 'Emphasizes current activity, suitable for finding advisors or collaborators',
    weights: {
      mean_citedness_2yr: 0.45,
      h_index: 0.20,
      efficiency: 0.15,
      m_index: 0.15,
      cited_by_count: 0.05,
      works_count: 0,
      i10_index: 0
    }
  },
  legacy: {
    name: 'Historical Legacy',
    description: 'Emphasizes cumulative impact, evaluates field founders',
    weights: {
      cited_by_count: 0.40,
      h_index: 0.35,
      efficiency: 0.15,
      m_index: 0.05,
      mean_citedness_2yr: 0.05,
      works_count: 0,
      i10_index: 0
    }
  }
};

function getRankColor(rank: number, total: number): string {
  const percentile = rank / total;
  if (percentile <= 0.05) return 'bg-yellow-400 text-yellow-900 font-bold'; // Top 5%
  if (percentile <= 0.10) return 'bg-amber-300 text-amber-900 font-semibold'; // Top 10%
  if (percentile <= 0.25) return 'bg-green-200 text-green-800'; // Top 25%
  if (percentile <= 0.50) return 'bg-blue-100 text-blue-700'; // Top 50%
  return 'bg-gray-100 text-gray-600'; // Bottom 50%
}

function getCategoryColor(category: string): string {
  switch (category) {
    case 'stature': return 'text-purple-600 bg-purple-50';
    case 'momentum': return 'text-orange-600 bg-orange-50';
    case 'structure': return 'text-blue-600 bg-blue-50';
    case 'fairness': return 'text-green-600 bg-green-50';
    default: return 'text-gray-600 bg-gray-50';
  }
}

function getImportanceIcon(importance: string): string {
  switch (importance) {
    case 'primary': return '*';
    case 'secondary': return '+';
    case 'auxiliary': return '-';
    default: return '';
  }
}

interface ExtendedScholar extends Scholar {
  efficiency: number;
  m_index: number;
  academicAge: number | null;
}

function ScholarTooltip({
  scholar,
  rankings,
  total,
  compositeRank
}: {
  scholar: ExtendedScholar;
  rankings: Record<MetricKey, number>;
  total: number;
  compositeRank: number;
}) {
  return (
    <div className="absolute z-50 left-full ml-2 top-0 w-96 bg-white rounded-xl shadow-2xl border p-4 pointer-events-none">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-bold text-gray-900 text-lg">{scholar.name}</h4>
          <p className="text-sm text-gray-500">{scholar.institution || 'Independent'}</p>
          {scholar.country && <p className="text-xs text-gray-400">{scholar.country}</p>}
        </div>
        <div className="text-right">
          <span className={`px-2 py-1 rounded text-xs font-bold ${
            compositeRank <= 10 ? 'bg-yellow-100 text-yellow-800' :
            compositeRank <= 25 ? 'bg-green-100 text-green-800' :
            'bg-gray-100 text-gray-600'
          }`}>
            Overall #{compositeRank}
          </span>
          {scholar.academicAge && (
            <p className="text-xs text-gray-400 mt-1">Academic age: {scholar.academicAge} yrs</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm mb-3">
        <div className="bg-purple-50 rounded p-2">
          <p className="text-purple-600 text-xs">H-Index (Stature)</p>
          <p className="font-bold text-purple-900">{scholar.h_index} <span className="text-xs font-normal">#{rankings.h_index}</span></p>
        </div>
        <div className="bg-orange-50 rounded p-2">
          <p className="text-orange-600 text-xs">2Yr Impact (Momentum)</p>
          <p className="font-bold text-orange-900">{scholar.mean_citedness_2yr.toFixed(1)} <span className="text-xs font-normal">#{rankings.mean_citedness_2yr}</span></p>
        </div>
        <div className="bg-blue-50 rounded p-2">
          <p className="text-blue-600 text-xs">Efficiency (Structure)</p>
          <p className="font-bold text-blue-900">{scholar.efficiency.toFixed(0)}/paper <span className="text-xs font-normal">#{rankings.efficiency}</span></p>
        </div>
        <div className="bg-green-50 rounded p-2">
          <p className="text-green-600 text-xs">M-Index (Fairness)</p>
          <p className="font-bold text-green-900">
            {scholar.m_index > 0 ? scholar.m_index.toFixed(2) : 'N/A'}
            {rankings.m_index > 0 && <span className="text-xs font-normal"> #{rankings.m_index}</span>}
          </p>
        </div>
      </div>

      <div className="text-xs text-gray-500 mb-2">
        <span className="font-medium">Total Citations:</span> {scholar.cited_by_count.toLocaleString()} |
        <span className="font-medium ml-1">Publications:</span> {scholar.works_count}
      </div>

      <div className="text-xs text-gray-500">
        <span className="font-medium">Category:</span> {scholar.category}
      </div>
    </div>
  );
}

function MetricExplanationPanel() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-lg mb-6 overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-xl">?</span>
          <span className="font-semibold text-gray-800">Metric Explanations & Weighting Principles</span>
        </div>
        <span className="text-gray-500">{isExpanded ? 'v' : '>'}</span>
      </button>

      {isExpanded && (
        <div className="p-6 space-y-6">
          {/* Three categories of metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
              <h4 className="font-bold text-purple-800 mb-2">Historical Stature / Total Impact</h4>
              <p className="text-sm text-purple-700">H-Index, Total Citations</p>
              <p className="text-xs text-purple-600 mt-2">Reflects accumulated prestige and long-term impact in the field. H-index better captures "sustained production of impactful work" than total citations.</p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg border-l-4 border-orange-500">
              <h4 className="font-bold text-orange-800 mb-2">Current Momentum</h4>
              <p className="text-sm text-orange-700">2-Year Impact (2Yr)</p>
              <p className="text-xs text-orange-600 mt-2">Reflects "whether still at the center of the field". Many historical giants are no longer active recently, and when finding advisors/collaborators, recent momentum is often more critical.</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
              <h4 className="font-bold text-blue-800 mb-2">Output Structure</h4>
              <p className="text-sm text-blue-700">Efficiency, Publications, i10</p>
              <p className="text-xs text-blue-600 mt-2">Distinguishes "high output but average impact" from "few papers but each one counts". Efficiency metric identifies methodology-type high-impact scholars.</p>
            </div>
          </div>

          {/* Fairness metric */}
          <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
            <h4 className="font-bold text-green-800 mb-2">Fairness Adjustment: M-Index</h4>
            <p className="text-sm text-green-700">M-Index = H-Index / Academic Age</p>
            <p className="text-xs text-green-600 mt-2">
              Career length affects all metrics too much. M-index distinguishes "high after 30 years" vs "high after just 10 years" - the latter is often a stronger signal, representing higher growth rate and potential.
            </p>
          </div>

          {/* Weighting schemes explanation */}
          <div className="border-t pt-4">
            <h4 className="font-semibold text-gray-800 mb-3">Three Evaluation Perspectives & Weight Allocations</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="font-medium text-gray-800">Academic Stature</p>
                <p className="text-xs text-gray-600 mt-1">H-Index 35% | 2Yr 30% | Eff 15% | M-Idx 10% | Citations 10%</p>
                <p className="text-xs text-gray-500 mt-1">Balanced evaluation of history and current activity</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="font-medium text-gray-800">Advisor/Collaborator</p>
                <p className="text-xs text-gray-600 mt-1">2Yr 45% | H-Index 20% | Eff 15% | M-Idx 15% | Citations 5%</p>
                <p className="text-xs text-gray-500 mt-1">Emphasizes current activity and growth</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="font-medium text-gray-800">Historical Legacy</p>
                <p className="text-xs text-gray-600 mt-1">Citations 40% | H-Index 35% | Eff 15% | M-Idx 5% | 2Yr 5%</p>
                <p className="text-xs text-gray-500 mt-1">Evaluates field founders and cumulative contributions</p>
              </div>
            </div>
          </div>

          {/* Important notes */}
          <div className="p-4 bg-red-50 rounded-lg border-l-4 border-red-400">
            <h4 className="font-bold text-red-800 mb-2">Important Notes</h4>
            <ul className="text-xs text-red-700 space-y-1">
              <li>* <strong>Avoid double-counting:</strong> Citations and H-index are highly correlated; weighting both heavily results in "seniority/scale" being double-counted</li>
              <li>* <strong>i10 redundancy:</strong> High overlap with citations/h-index information, can be ignored</li>
              <li>* <strong>Cross-domain bias:</strong> Scholars like Bengio who span AI-Neuro may have citations inflated by out-of-field citations</li>
              <li>* <strong>Tool developer effect:</strong> Developers of widely-used methods/tools naturally have higher citations</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export function RankingMatrix({ scholars }: RankingMatrixProps) {
  const [hoveredScholar, setHoveredScholar] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<MetricKey | 'composite'>('composite');
  const [showTop, setShowTop] = useState<number>(50);
  const [weightingScheme, setWeightingScheme] = useState<WeightingScheme>('stature');

  const currentYear = new Date().getFullYear();

  // Calculate rankings for each metric
  const { scholarsWithRankings, rankings, compositeRankings } = useMemo(() => {
    // Add efficiency and m_index metrics
    const scholarsWithMetrics: ExtendedScholar[] = scholars.map(s => {
      const firstPubYear = firstPubYearMap[s.name];
      const academicAge = firstPubYear ? currentYear - firstPubYear : null;
      const mIndex = academicAge && academicAge > 0 && s.h_index > 0 ? s.h_index / academicAge : 0;

      return {
        ...s,
        efficiency: s.works_count > 0 ? s.cited_by_count / s.works_count : 0,
        m_index: mIndex,
        academicAge
      };
    });

    // Calculate rankings for each metric
    const rankingsMap: Record<string, Record<MetricKey, number>> = {};

    METRICS.forEach(metric => {
      // For m_index, only rank scholars with data
      const validScholars = metric.key === 'm_index'
        ? scholarsWithMetrics.filter(s => s.m_index > 0)
        : scholarsWithMetrics;

      const sorted = [...validScholars].sort((a, b) => {
        const aVal = a[metric.key as keyof ExtendedScholar] as number;
        const bVal = b[metric.key as keyof ExtendedScholar] as number;
        return bVal - aVal;
      });

      sorted.forEach((scholar, idx) => {
        if (!rankingsMap[scholar.id]) {
          rankingsMap[scholar.id] = {} as Record<MetricKey, number>;
        }
        rankingsMap[scholar.id][metric.key] = idx + 1;
      });

      // For m_index, set scholars without data to 0 (no ranking)
      if (metric.key === 'm_index') {
        scholarsWithMetrics.forEach(s => {
          if (!rankingsMap[s.id]) {
            rankingsMap[s.id] = {} as Record<MetricKey, number>;
          }
          if (s.m_index === 0) {
            rankingsMap[s.id][metric.key] = 0;
          }
        });
      }
    });

    // Calculate composite score (based on normalized rankings)
    const weights = WEIGHTING_SCHEMES[weightingScheme].weights;
    const totalScholars = scholars.length;
    const mIndexScholars = scholarsWithMetrics.filter(s => s.m_index > 0).length;

    const compositeScores: Record<string, number> = {};
    scholarsWithMetrics.forEach(scholar => {
      let score = 0;
      let totalWeight = 0;

      METRICS.forEach(metric => {
        const weight = weights[metric.key];
        if (weight > 0) {
          const rank = rankingsMap[scholar.id][metric.key];
          if (rank > 0) {
            // Normalize ranking to 0-1 score (higher rank = higher score)
            const maxRank = metric.key === 'm_index' ? mIndexScholars : totalScholars;
            const normalizedScore = 1 - (rank - 1) / maxRank;
            score += normalizedScore * weight;
            totalWeight += weight;
          }
        }
      });

      compositeScores[scholar.id] = totalWeight > 0 ? score / totalWeight : 0;
    });

    // Calculate composite rankings
    const compositeRanks: Record<string, number> = {};
    const sortedByComposite = [...scholarsWithMetrics].sort(
      (a, b) => compositeScores[b.id] - compositeScores[a.id]
    );
    sortedByComposite.forEach((scholar, idx) => {
      compositeRanks[scholar.id] = idx + 1;
    });

    // Sort by selected metric or composite score
    let sortedScholars: ExtendedScholar[];
    if (sortBy === 'composite') {
      sortedScholars = sortedByComposite;
    } else {
      sortedScholars = [...scholarsWithMetrics].sort((a, b) => {
        const rankA = rankingsMap[a.id][sortBy];
        const rankB = rankingsMap[b.id][sortBy];
        // For m_index, put scholars without data at the end
        if (rankA === 0) return 1;
        if (rankB === 0) return -1;
        return rankA - rankB;
      });
    }

    return {
      scholarsWithRankings: sortedScholars,
      rankings: rankingsMap,
      compositeRankings: compositeRanks
    };
  }, [scholars, sortBy, weightingScheme, currentYear]);

  const displayScholars = scholarsWithRankings.slice(0, showTop);
  const total = scholars.length;
  const mIndexTotal = scholars.filter(s => firstPubYearMap[s.name]).length;

  return (
    <div className="space-y-6">
      {/* Metric explanation panel */}
      <MetricExplanationPanel />

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-4 border-b bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
          <h3 className="text-xl font-bold mb-2">Scholar Ranking Matrix</h3>
          <p className="text-sm text-indigo-100">
            Multi-dimensional evaluation of {total} scholars. Hover over names for details, click headers to sort.
          </p>

          {/* Controls */}
          <div className="flex flex-wrap gap-4 mt-4">
            <div className="flex items-center gap-2">
              <label className="text-sm">Perspective:</label>
              <select
                value={weightingScheme}
                onChange={(e) => setWeightingScheme(e.target.value as WeightingScheme)}
                className="px-3 py-1.5 rounded text-gray-800 text-sm font-medium"
              >
                {Object.entries(WEIGHTING_SCHEMES).map(([key, config]) => (
                  <option key={key} value={key}>{config.name}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as MetricKey | 'composite')}
                className="px-2 py-1 rounded text-gray-800 text-sm"
              >
                <option value="composite">Composite Score</option>
                {METRICS.map(m => (
                  <option key={m.key} value={m.key}>{m.label}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm">Show:</label>
              <select
                value={showTop}
                onChange={(e) => setShowTop(Number(e.target.value))}
                className="px-2 py-1 rounded text-gray-800 text-sm"
              >
                <option value={25}>Top 25</option>
                <option value={50}>Top 50</option>
                <option value={100}>Top 100</option>
                <option value={185}>All {total}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Current weighting scheme info */}
        <div className="px-4 py-2 bg-indigo-50 border-b text-sm">
          <span className="font-medium text-indigo-800">Current weights:</span>
          <span className="text-indigo-600 ml-2">{WEIGHTING_SCHEMES[weightingScheme].description}</span>
        </div>

        {/* Legend */}
        <div className="px-4 py-2 bg-gray-50 border-b flex flex-wrap items-center gap-4 text-xs">
          <span className="text-gray-500">Rank colors:</span>
          <span className="px-2 py-0.5 rounded bg-yellow-400 text-yellow-900">Top 5%</span>
          <span className="px-2 py-0.5 rounded bg-amber-300 text-amber-900">Top 10%</span>
          <span className="px-2 py-0.5 rounded bg-green-200 text-green-800">Top 25%</span>
          <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700">Top 50%</span>
          <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-600">Bottom 50%</span>
          <span className="ml-4 text-gray-500">Importance: *Primary +Secondary -Auxiliary</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 sticky top-0">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 sticky left-0 bg-gray-100 z-10 min-w-[200px]">
                  Scholar
                </th>
                <th
                  className={`px-3 py-3 text-center text-sm font-semibold cursor-pointer hover:bg-gray-200 transition-colors ${
                    sortBy === 'composite' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700'
                  }`}
                  onClick={() => setSortBy('composite')}
                  title="Composite score ranking based on current weighting scheme"
                >
                  Overall
                  {sortBy === 'composite' && <span className="ml-1">v</span>}
                </th>
                {METRICS.map(metric => (
                  <th
                    key={metric.key}
                    className={`px-3 py-3 text-center text-sm font-semibold cursor-pointer hover:bg-gray-200 transition-colors ${
                      sortBy === metric.key ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700'
                    }`}
                    onClick={() => setSortBy(metric.key)}
                    title={metric.tooltip}
                  >
                    <div className="flex flex-col items-center gap-0.5">
                      <span className={`text-xs px-1.5 py-0.5 rounded ${getCategoryColor(metric.category)}`}>
                        {getImportanceIcon(metric.importance)} {metric.shortLabel}
                      </span>
                    </div>
                    {sortBy === metric.key && <span className="ml-1">v</span>}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {displayScholars.map((scholar, idx) => {
                const scholarRankings = rankings[scholar.id];
                const compositeRank = compositeRankings[scholar.id];

                return (
                  <tr
                    key={scholar.id}
                    className={`hover:bg-indigo-50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}
                  >
                    <td className="px-4 py-2 sticky left-0 bg-inherit z-10">
                      <div
                        className="relative"
                        onMouseEnter={() => setHoveredScholar(scholar.id)}
                        onMouseLeave={() => setHoveredScholar(null)}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400 text-sm w-6">{idx + 1}.</span>
                          <Link
                            href={`/scholar/${scholar.id.split('/').pop()}`}
                            className="font-medium text-indigo-600 hover:text-indigo-800 hover:underline"
                          >
                            {scholar.name}
                          </Link>
                        </div>
                        {hoveredScholar === scholar.id && (
                          <ScholarTooltip
                            scholar={scholar}
                            rankings={scholarRankings}
                            total={total}
                            compositeRank={compositeRank}
                          />
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-2 text-center">
                      <span className={`inline-block min-w-[40px] px-2 py-1 rounded text-sm font-bold ${getRankColor(compositeRank, total)}`}>
                        {compositeRank}
                      </span>
                    </td>
                    {METRICS.map(metric => {
                      const rank = scholarRankings[metric.key];
                      const maxRank = metric.key === 'm_index' ? mIndexTotal : total;
                      return (
                        <td key={metric.key} className="px-3 py-2 text-center">
                          {rank > 0 ? (
                            <span className={`inline-block min-w-[40px] px-2 py-1 rounded text-sm ${getRankColor(rank, maxRank)}`}>
                              {rank}
                            </span>
                          ) : (
                            <span className="text-gray-400 text-sm">-</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-gray-50 border-t text-sm text-gray-500">
          Showing {displayScholars.length} / {total} scholars | M-Index data: {mIndexTotal} | Click headers to sort
        </div>
      </div>
    </div>
  );
}
