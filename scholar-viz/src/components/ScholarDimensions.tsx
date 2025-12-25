'use client';

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import scholarDetails from '@/data/scholarDetails.json';

// Icons for each dimension (using inline SVGs for consistency)
const DimensionIcons = {
  impact: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  ),
  momentum: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  ),
  output: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  ),
  efficiency: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  novelty: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  ),
  breadth: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  peakPower: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  ),
};

interface ScholarDetail {
  id: string;
  name: string;
  worksCount: number;
  citedByCount: number;
  hIndex: number;
  i10Index: number;
  twoYearMeanCitedness: number;
  topics: { name: string; score: number; level: number }[];
  topWorks: { title: string; year: number; citations: number }[];
  yearlyData: { year: number; works: number }[];
  earlyCareer: {
    firstPubYear: number | null;
    earlyCareerEnd: number | null;
    earlyWorksCount: number;
    earlyCareerCitations: number;
    earlyPct: number;
  } | null;
}

interface DimensionScore {
  dimension: string;
  dimensionCN: string;
  score: number;        // 0-100 percentile
  rawValue: number;
  description: string;
  icon: keyof typeof DimensionIcons;
}

interface ScholarTag {
  label: string;
  labelCN: string;
  color: string;
  description: string;
}

// Calculate percentile rank
function getPercentile(value: number, allValues: number[]): number {
  const sorted = [...allValues].sort((a, b) => a - b);
  const index = sorted.findIndex(v => v >= value);
  if (index === -1) return 100;
  return Math.round((index / sorted.length) * 100);
}

// Get academic age
function getAcademicAge(firstPubYear: number | null): number {
  if (!firstPubYear) return 0;
  return new Date().getFullYear() - firstPubYear;
}

// Calculate topic diversity (entropy-like measure)
function getTopicDiversity(topics: { name: string; score: number }[]): number {
  if (!topics || topics.length === 0) return 0;
  const uniqueTopics = new Set(topics.map(t => t.name));
  return uniqueTopics.size;
}

// Calculate recent momentum (works in last 3 years vs average)
function getRecentMomentum(yearlyData: { year: number; works: number }[]): number {
  if (!yearlyData || yearlyData.length === 0) return 0;
  const currentYear = new Date().getFullYear();
  const recentYears = yearlyData.filter(d => d.year >= currentYear - 3);
  const recentTotal = recentYears.reduce((sum, d) => sum + d.works, 0);
  const avgPerYear = yearlyData.reduce((sum, d) => sum + d.works, 0) / Math.max(yearlyData.length, 1);
  const recentAvg = recentTotal / 3;
  // Return ratio of recent to historical average (capped at 3x)
  return Math.min(recentAvg / Math.max(avgPerYear, 0.1), 3);
}

// Calculate top paper concentration
function getTopPaperConcentration(topWorks: { citations: number }[], totalCitations: number): number {
  if (!topWorks || topWorks.length === 0 || totalCitations === 0) return 0;
  const top3Citations = topWorks.slice(0, 3).reduce((sum, w) => sum + w.citations, 0);
  return top3Citations / totalCitations;
}

// Pre-compute all scholar metrics for percentile calculation
function computeAllMetrics(scholars: ScholarDetail[]) {
  const validScholars = scholars.filter(s => s.worksCount > 0 && s.citedByCount > 0);

  return {
    citations: validScholars.map(s => s.citedByCount),
    hIndex: validScholars.map(s => s.hIndex),
    worksCount: validScholars.map(s => s.worksCount),
    citationsPerPaper: validScholars.map(s => s.citedByCount / Math.max(s.worksCount, 1)),
    twoYearMean: validScholars.filter(s => s.twoYearMeanCitedness > 0).map(s => s.twoYearMeanCitedness),
    topicDiversity: validScholars.map(s => getTopicDiversity(s.topics)),
    recentMomentum: validScholars.map(s => getRecentMomentum(s.yearlyData)),
    topPaperConc: validScholars.map(s => getTopPaperConcentration(s.topWorks, s.citedByCount)),
    worksPerYear: validScholars
      .filter(s => s.earlyCareer?.firstPubYear)
      .map(s => s.worksCount / Math.max(getAcademicAge(s.earlyCareer?.firstPubYear ?? null), 1)),
  };
}

// Compute dimension scores for a scholar
export function computeDimensionScores(scholar: ScholarDetail): DimensionScore[] {
  const allScholars = scholarDetails as ScholarDetail[];
  const metrics = computeAllMetrics(allScholars);
  const academicAge = getAcademicAge(scholar.earlyCareer?.firstPubYear ?? null);

  const scores: DimensionScore[] = [];

  // 1. Impact (影响力) - citations, h-index weighted
  const impactRaw = (scholar.citedByCount * 0.5) + (scholar.hIndex * 1000 * 0.5);
  const impactValues = metrics.citations.map((c, i) => c * 0.5 + metrics.hIndex[i] * 1000 * 0.5);
  scores.push({
    dimension: 'Impact',
    dimensionCN: '影响力',
    score: getPercentile(impactRaw, impactValues),
    rawValue: scholar.citedByCount,
    description: `${scholar.citedByCount.toLocaleString()} citations, h=${scholar.hIndex}`,
    icon: 'impact'
  });

  // 2. Momentum (动量) - recent activity and citation trend
  const momentumRaw = scholar.twoYearMeanCitedness > 0
    ? scholar.twoYearMeanCitedness
    : getRecentMomentum(scholar.yearlyData) * 10;
  scores.push({
    dimension: 'Momentum',
    dimensionCN: '动量',
    score: scholar.twoYearMeanCitedness > 0
      ? getPercentile(scholar.twoYearMeanCitedness, metrics.twoYearMean)
      : getPercentile(getRecentMomentum(scholar.yearlyData), metrics.recentMomentum),
    rawValue: momentumRaw,
    description: scholar.twoYearMeanCitedness > 0
      ? `2yr mean: ${scholar.twoYearMeanCitedness.toFixed(1)}`
      : 'Based on publication trend',
    icon: 'momentum'
  });

  // 3. Output (产出) - total works, works per year
  const worksPerYear = academicAge > 0 ? scholar.worksCount / academicAge : scholar.worksCount;
  scores.push({
    dimension: 'Output',
    dimensionCN: '产出',
    score: getPercentile(scholar.worksCount, metrics.worksCount),
    rawValue: scholar.worksCount,
    description: `${scholar.worksCount} papers (${worksPerYear.toFixed(1)}/year)`,
    icon: 'output'
  });

  // 4. Efficiency (效率) - citations per paper
  const citesPerPaper = scholar.worksCount > 0 ? scholar.citedByCount / scholar.worksCount : 0;
  scores.push({
    dimension: 'Efficiency',
    dimensionCN: '效率',
    score: getPercentile(citesPerPaper, metrics.citationsPerPaper),
    rawValue: citesPerPaper,
    description: `${Math.round(citesPerPaper)} cites/paper`,
    icon: 'efficiency'
  });

  // 5. Novelty (创新) - topic diversity
  const topicDiv = getTopicDiversity(scholar.topics);
  scores.push({
    dimension: 'Novelty',
    dimensionCN: '创新',
    score: getPercentile(topicDiv, metrics.topicDiversity),
    rawValue: topicDiv,
    description: `${topicDiv} unique research topics`,
    icon: 'novelty'
  });

  // 6. Breadth (广度) - topic count and variety
  const breadthScore = scholar.topics?.length || 0;
  scores.push({
    dimension: 'Breadth',
    dimensionCN: '广度',
    score: Math.min(breadthScore * 10, 100), // Normalized
    rawValue: breadthScore,
    description: `${breadthScore} topic areas`,
    icon: 'breadth'
  });

  // 7. Peak Power (爆发力) - top paper concentration
  const peakConc = getTopPaperConcentration(scholar.topWorks, scholar.citedByCount);
  scores.push({
    dimension: 'Peak Power',
    dimensionCN: '爆发力',
    score: getPercentile(peakConc, metrics.topPaperConc),
    rawValue: peakConc * 100,
    description: `Top 3 papers: ${(peakConc * 100).toFixed(0)}% of citations`,
    icon: 'peakPower'
  });

  return scores;
}

// Determine scholar tags based on dimension scores
export function computeScholarTags(scholar: ScholarDetail, scores: DimensionScore[]): ScholarTag[] {
  const tags: ScholarTag[] = [];

  const getScore = (dim: string) => scores.find(s => s.dimension === dim)?.score || 0;
  const getRaw = (dim: string) => scores.find(s => s.dimension === dim)?.rawValue || 0;

  const impact = getScore('Impact');
  const momentum = getScore('Momentum');
  const output = getScore('Output');
  const efficiency = getScore('Efficiency');
  const novelty = getScore('Novelty');
  const peakPower = getScore('Peak Power');

  const academicAge = getAcademicAge(scholar.earlyCareer?.firstPubYear ?? null);
  const earlyPct = scholar.earlyCareer?.earlyPct || 0;

  // Tag: 卷王 (High Output + Consistent Momentum)
  if (output >= 80 && momentum >= 50) {
    tags.push({
      label: 'Prolific',
      labelCN: '卷王',
      color: 'bg-orange-500',
      description: 'Extremely high output with sustained momentum'
    });
  }

  // Tag: 天赋怪 (High Efficiency + High Impact but Medium Output)
  if (efficiency >= 80 && impact >= 70 && output < 70) {
    tags.push({
      label: 'Genius',
      labelCN: '天赋怪',
      color: 'bg-purple-500',
      description: 'High impact with exceptional efficiency, quality over quantity'
    });
  }

  // Tag: 厚积薄发 (Late bloomer - low early%, high recent momentum)
  if (academicAge > 15 && earlyPct < 15 && momentum >= 60) {
    tags.push({
      label: 'Late Bloomer',
      labelCN: '厚积薄发',
      color: 'bg-green-500',
      description: 'Academic influence grew significantly over time'
    });
  }

  // Tag: 早期爆发 (High early career impact)
  if (earlyPct >= 30 && impact >= 60) {
    tags.push({
      label: 'Early Burst',
      labelCN: '早期爆发',
      color: 'bg-amber-500',
      description: 'Major early career impact, possibly seminal work'
    });
  }

  // Tag: 黑马 (Rising star - high recent momentum but lower base)
  if (momentum >= 80 && impact < 60 && academicAge < 15) {
    tags.push({
      label: 'Dark Horse',
      labelCN: '黑马',
      color: 'bg-blue-500',
      description: 'Rapidly rising influence in the field'
    });
  }

  // Tag: 全能型 (Well-rounded across all dimensions)
  const avgScore = scores.reduce((sum, s) => sum + s.score, 0) / scores.length;
  const minScore = Math.min(...scores.map(s => s.score));
  if (avgScore >= 60 && minScore >= 40) {
    tags.push({
      label: 'All-Rounder',
      labelCN: '全能型',
      color: 'bg-cyan-500',
      description: 'Strong and balanced across all dimensions'
    });
  }

  // Tag: 代表作驱动 (Peak power dominant)
  if (peakPower >= 80 && getRaw('Peak Power') >= 50) {
    tags.push({
      label: 'Landmark Paper',
      labelCN: '代表作驱动',
      color: 'bg-rose-500',
      description: 'Impact driven by iconic publications'
    });
  }

  // Tag: 开拓者 (High novelty + breadth)
  if (novelty >= 75) {
    tags.push({
      label: 'Pioneer',
      labelCN: '开拓者',
      color: 'bg-indigo-500',
      description: 'Exploring diverse research frontiers'
    });
  }

  // Tag: 传奇 (Legendary status)
  if (impact >= 95 && scholar.citedByCount >= 100000) {
    tags.push({
      label: 'Legend',
      labelCN: '传奇',
      color: 'bg-gradient-to-r from-yellow-400 to-amber-500',
      description: 'One of the most influential figures in the field'
    });
  }

  return tags;
}

// Custom radar chart tooltip
function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: { dimension: string; dimensionCN: string; score: number; description: string } }> }) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
        <p className="font-semibold text-gray-800">{data.dimensionCN} ({data.dimension})</p>
        <p className="text-2xl font-bold text-blue-600">{data.score}%</p>
        <p className="text-sm text-gray-500">{data.description}</p>
      </div>
    );
  }
  return null;
}

interface ScholarDimensionsProps {
  scholar: ScholarDetail;
}

export default function ScholarDimensions({ scholar }: ScholarDimensionsProps) {
  const scores = computeDimensionScores(scholar);
  const tags = computeScholarTags(scholar, scores);

  // Prepare data for radar chart
  const radarData = scores.map(s => ({
    dimension: s.dimension,
    dimensionCN: s.dimensionCN,
    score: s.score,
    description: s.description,
    fullMark: 100
  }));

  // Calculate overall score (weighted average)
  const overallScore = Math.round(scores.reduce((sum, s) => sum + s.score, 0) / scores.length);

  return (
    <section className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">Ability Dimensions / 能力维度分析</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Overall Score</span>
          <span className={`text-2xl font-bold ${
            overallScore >= 80 ? 'text-green-600' :
            overallScore >= 60 ? 'text-blue-600' :
            overallScore >= 40 ? 'text-amber-600' : 'text-gray-600'
          }`}>{overallScore}</span>
        </div>
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {tags.map((tag, idx) => (
            <div
              key={idx}
              className={`px-3 py-1.5 rounded-full text-white text-sm font-medium ${tag.color}`}
              title={tag.description}
            >
              {tag.labelCN} / {tag.label}
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar Chart */}
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
              <PolarGrid stroke="#e5e7eb" />
              <PolarAngleAxis
                dataKey="dimensionCN"
                tick={{ fill: '#374151', fontSize: 12 }}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 100]}
                tick={{ fill: '#9ca3af', fontSize: 10 }}
                tickCount={5}
              />
              <Radar
                name="Score"
                dataKey="score"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.3}
                strokeWidth={2}
              />
              <Tooltip content={<CustomTooltip />} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Dimension Details */}
        <div className="space-y-3">
          {scores.map((score, idx) => {
            const Icon = DimensionIcons[score.icon];
            const barColor = score.score >= 80 ? 'bg-green-500' :
                           score.score >= 60 ? 'bg-blue-500' :
                           score.score >= 40 ? 'bg-amber-500' : 'bg-gray-400';

            return (
              <div key={idx} className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  score.score >= 80 ? 'bg-green-100 text-green-600' :
                  score.score >= 60 ? 'bg-blue-100 text-blue-600' :
                  score.score >= 40 ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 text-gray-600'
                }`}>
                  {Icon}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium text-gray-800 text-sm">
                      {score.dimensionCN} <span className="text-gray-400">/ {score.dimension}</span>
                    </span>
                    <span className="font-bold text-gray-700">{score.score}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${barColor}`}
                      style={{ width: `${score.score}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{score.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend / Explanation */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          * Percentile scores are calculated relative to all scholars in the computational neuroscience dataset.
          Tags are assigned based on dimension combinations. Hover over the radar chart for details.
        </p>
      </div>
    </section>
  );
}
