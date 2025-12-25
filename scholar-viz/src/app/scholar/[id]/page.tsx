'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from 'recharts';
import scholarDetails from '@/data/scholarDetails.json';
import ScholarDimensions from '@/components/ScholarDimensions';

interface ScholarDetail {
  id: string;
  name: string;
  orcid: string;
  worksCount: number;
  citedByCount: number;
  hIndex: number;
  i10Index: number;
  twoYearMeanCitedness: number;
  institution: string;
  country: string;
  topics: { name: string; score: number; level: number }[];
  topWorks: { title: string; year: number; citations: number; type: string; doi: string; venue: string }[];
  yearlyData: { year: number; works: number }[];
  summary: string;
  impactCategories: { type: string; description: string }[];
  earlyCareer: {
    firstPubYear: number | null;
    earlyCareerEnd: number | null;
    earlyWorksCount: number;
    earlyCareerCitations: number;
    earlyPct: number;
    topPaper: string;
  } | null;
  openAlexUrl: string;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];

function StatCard({ label, value, subtext, color = 'blue' }: { label: string; value: string | number; subtext?: string; color?: string }) {
  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-50 border-blue-200 text-blue-700',
    green: 'bg-green-50 border-green-200 text-green-700',
    purple: 'bg-purple-50 border-purple-200 text-purple-700',
    amber: 'bg-amber-50 border-amber-200 text-amber-700',
    red: 'bg-red-50 border-red-200 text-red-700',
  };

  return (
    <div className={`rounded-xl border-2 p-4 ${colorClasses[color]}`}>
      <p className="text-sm opacity-75">{label}</p>
      <p className="text-2xl font-bold">{typeof value === 'number' ? value.toLocaleString() : value}</p>
      {subtext && <p className="text-xs opacity-60 mt-1">{subtext}</p>}
    </div>
  );
}

function getImpactLevel(citations: number): { level: string; color: string; description: string } {
  if (citations >= 100000) return { level: 'Legendary', color: 'from-yellow-400 to-amber-500', description: 'Legendary figure in the field with 100k+ citations' };
  if (citations >= 50000) return { level: 'Elite', color: 'from-purple-500 to-pink-500', description: 'Elite scholar with 50k+ citations' };
  if (citations >= 20000) return { level: 'Distinguished', color: 'from-blue-500 to-cyan-500', description: 'Distinguished scholar with 20k+ citations' };
  if (citations >= 10000) return { level: 'Established', color: 'from-green-500 to-emerald-500', description: 'Established scholar with 10k+ citations' };
  if (citations >= 5000) return { level: 'Rising', color: 'from-orange-400 to-red-400', description: 'Rising scholar with 5k+ citations' };
  return { level: 'Emerging', color: 'from-gray-400 to-gray-500', description: 'Emerging scholar' };
}

function getCareerStage(firstYear: number | null): { stage: string; years: number; description: string } {
  if (!firstYear) return { stage: 'Unknown', years: 0, description: 'Unknown' };
  const currentYear = new Date().getFullYear();
  const years = currentYear - firstYear;

  if (years >= 30) return { stage: 'Senior', years, description: 'Senior Scholar (30+ years)' };
  if (years >= 20) return { stage: 'Established', years, description: 'Established Scholar (20-30 years)' };
  if (years >= 10) return { stage: 'Mid-Career', years, description: 'Mid-Career Scholar (10-20 years)' };
  return { stage: 'Early-Career', years, description: 'Early-Career Scholar (<10 years)' };
}

function generateAnalysis(scholar: ScholarDetail): string[] {
  const analyses: string[] = [];
  const impact = getImpactLevel(scholar.citedByCount);
  const career = getCareerStage(scholar.earlyCareer?.firstPubYear || null);

  // Impact analysis
  analyses.push(`${scholar.name} is a ${impact.description.toLowerCase()} in computational neuroscience, currently affiliated with ${scholar.institution || 'Independent Research'}.`);

  // Productivity analysis
  const worksPerYear = career.years > 0 ? (scholar.worksCount / career.years).toFixed(1) : 0;
  analyses.push(`Over a ${career.years}-year academic career, published ${scholar.worksCount} papers (averaging ${worksPerYear} per year), with ${scholar.citedByCount.toLocaleString()} citations.`);

  // H-index analysis
  if (scholar.hIndex >= 100) {
    analyses.push(`With an h-index of ${scholar.hIndex}, one of the rare scholars to reach this level, indicating lasting and broad research impact.`);
  } else if (scholar.hIndex >= 50) {
    analyses.push(`An h-index of ${scholar.hIndex}, well above field average, indicates a substantial body of highly-cited work.`);
  } else if (scholar.hIndex >= 30) {
    analyses.push(`An h-index of ${scholar.hIndex} reflects an active and influential researcher.`);
  }

  // Early career analysis
  if (scholar.earlyCareer && scholar.earlyCareer.earlyCareerCitations > 0) {
    const earlyPct = scholar.earlyCareer.earlyPct;
    if (earlyPct >= 30) {
      analyses.push(`Outstanding early career performance: first 5 years account for ${earlyPct}% of total citations (${scholar.earlyCareer.earlyCareerCitations.toLocaleString()}), showing strong early impact.`);
    } else if (earlyPct <= 10) {
      analyses.push(`Academic impact accumulated gradually: first 5 years account for only ${earlyPct}%, indicating later works are more influential.`);
    }
  }

  // Research direction analysis
  if (scholar.topics && scholar.topics.length > 0) {
    const topTopics = scholar.topics.slice(0, 3).map(t => t.name).join(', ');
    analyses.push(`Primary research areas include ${topTopics}.`);
  }

  return analyses;
}

function generateKeyFindings(scholar: ScholarDetail): { title: string; content: string; type: 'success' | 'info' | 'warning' | 'highlight' }[] {
  const findings: { title: string; content: string; type: 'success' | 'info' | 'warning' | 'highlight' }[] = [];

  // Top publication analysis
  if (scholar.topWorks && scholar.topWorks.length > 0) {
    const topWork = scholar.topWorks[0];
    findings.push({
      title: 'Signature Work',
      content: `"${topWork.title}" is the most influential work, with ${topWork.citations.toLocaleString()} citations, published in ${topWork.year}.`,
      type: 'highlight'
    });
  }

  // Citation efficiency
  if (scholar.worksCount > 0) {
    const citesPerWork = Math.round(scholar.citedByCount / scholar.worksCount);
    if (citesPerWork >= 500) {
      findings.push({
        title: 'High Citation Efficiency',
        content: `Averaging ${citesPerWork} citations per paper, indicating exceptional quality over quantity.`,
        type: 'success'
      });
    } else if (citesPerWork >= 100) {
      findings.push({
        title: 'Consistent Output',
        content: `Averaging ${citesPerWork} citations per paper, maintaining steady high-quality output.`,
        type: 'info'
      });
    }
  }

  // Recent activity
  if (scholar.twoYearMeanCitedness > 10) {
    findings.push({
      title: 'Sustained Impact',
      content: `Two-year mean citedness of ${scholar.twoYearMeanCitedness.toFixed(1)} indicates research continues to generate significant impact.`,
      type: 'success'
    });
  } else if (scholar.twoYearMeanCitedness < 1 && scholar.citedByCount > 10000) {
    findings.push({
      title: 'Classic Scholar',
      content: `Despite lower recent citations, the substantial total citations suggest impact comes primarily from classic works.`,
      type: 'info'
    });
  }

  // Career pattern
  if (scholar.earlyCareer) {
    if (scholar.earlyCareer.earlyPct >= 50) {
      findings.push({
        title: 'Early Breakthrough',
        content: `Over half of citations come from the first 5 years, possibly from pioneering work or classic textbooks.`,
        type: 'warning'
      });
    } else if (scholar.earlyCareer.earlyPct <= 5 && scholar.citedByCount > 20000) {
      findings.push({
        title: 'Sustained Growth',
        content: `Very low early citation share indicates influence built through long-term accumulation, with later works being more impactful.`,
        type: 'info'
      });
    }
  }

  return findings;
}

export default function ScholarPage() {
  const params = useParams();
  const id = params.id as string;

  const scholar = (scholarDetails as ScholarDetail[]).find(s => s.id === id);

  if (!scholar) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Scholar Not Found</h1>
          <Link href="/" className="text-blue-600 hover:underline">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  const impact = getImpactLevel(scholar.citedByCount);
  const career = getCareerStage(scholar.earlyCareer?.firstPubYear || null);
  const analyses = generateAnalysis(scholar);
  const keyFindings = generateKeyFindings(scholar);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className={`bg-gradient-to-r ${impact.color} text-white`}>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <Link href="/" className="inline-flex items-center text-white/80 hover:text-white mb-4 text-sm">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Directory
          </Link>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
                  {impact.level}
                </span>
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
                  {career.stage}
                </span>
              </div>
              <h1 className="text-4xl font-bold mb-2">{scholar.name}</h1>
              <p className="text-xl text-white/90">{scholar.institution || 'Independent Researcher'}</p>
              {scholar.country && (
                <p className="text-white/70 mt-1">{scholar.country}</p>
              )}
            </div>

            <div className="mt-6 md:mt-0 flex gap-4">
              {scholar.orcid && (
                <a
                  href={scholar.orcid}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                >
                  ORCID
                </a>
              )}
              <a
                href={scholar.openAlexUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
              >
                OpenAlex
              </a>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Stats Grid */}
        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-4">Core Metrics</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <StatCard label="Total Citations" value={scholar.citedByCount} color="blue" />
            <StatCard label="H-Index" value={scholar.hIndex} color="green" />
            <StatCard label="Publications" value={scholar.worksCount} color="purple" />
            <StatCard label="i10-Index" value={scholar.i10Index} color="amber" />
            <StatCard
              label="2-Year Citedness"
              value={scholar.twoYearMeanCitedness.toFixed(1)}
              subtext="avg citations per work"
              color="red"
            />
          </div>
        </section>

        {/* Ability Dimensions */}
        <ScholarDimensions scholar={scholar} />

        {/* Summary & Analysis */}
        <section className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Scholar Profile Analysis</h2>
          <div className="prose max-w-none text-gray-700">
            {analyses.map((para, idx) => (
              <p key={idx} className="mb-3">{para}</p>
            ))}
          </div>
        </section>

        {/* Key Findings */}
        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-4">Key Findings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {keyFindings.map((finding, idx) => {
              const bgColors = {
                success: 'bg-green-50 border-green-300',
                info: 'bg-blue-50 border-blue-300',
                warning: 'bg-amber-50 border-amber-300',
                highlight: 'bg-purple-50 border-purple-300',
              };
              const titleColors = {
                success: 'text-green-800',
                info: 'text-blue-800',
                warning: 'text-amber-800',
                highlight: 'text-purple-800',
              };
              return (
                <div key={idx} className={`p-4 rounded-xl border-l-4 ${bgColors[finding.type]}`}>
                  <h3 className={`font-semibold ${titleColors[finding.type]} mb-2`}>{finding.title}</h3>
                  <p className="text-gray-700 text-sm">{finding.content}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Early Career Analysis */}
        {scholar.earlyCareer && scholar.earlyCareer.firstPubYear && (
          <section className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Early Career Analysis (First 5 Years)</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-sm text-gray-500">Career Start</p>
                <p className="text-xl font-bold text-amber-600">
                  {scholar.earlyCareer.firstPubYear} - {scholar.earlyCareer.earlyCareerEnd}
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-sm text-gray-500">Early Citations</p>
                <p className="text-xl font-bold text-amber-600">
                  {scholar.earlyCareer.earlyCareerCitations.toLocaleString()}
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-sm text-gray-500">Early Works</p>
                <p className="text-xl font-bold text-amber-600">
                  {scholar.earlyCareer.earlyWorksCount}
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-sm text-gray-500">Early Impact %</p>
                <p className="text-xl font-bold text-amber-600">
                  {scholar.earlyCareer.earlyPct}%
                </p>
              </div>
            </div>
            {scholar.earlyCareer.topPaper && (
              <div className="bg-white rounded-lg p-4">
                <p className="text-sm text-gray-500 mb-1">Top Early Career Paper</p>
                <p className="font-medium text-gray-800">{scholar.earlyCareer.topPaper}</p>
              </div>
            )}
          </section>
        )}

        {/* Publication Timeline */}
        {scholar.yearlyData && scholar.yearlyData.length > 0 && (
          <section className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Publication Timeline</h2>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={scholar.yearlyData.filter(d => d.year >= 1980)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="works"
                  stroke="#3b82f6"
                  fill="#93c5fd"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </section>
        )}

        {/* Research Topics */}
        {scholar.topics && scholar.topics.length > 0 && (
          <section className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Research Topics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={scholar.topics.slice(0, 8)}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="score"
                    nameKey="name"
                    label={({ name, percent }) => `${(name ?? '').slice(0, 15)}: ${((percent ?? 0) * 100).toFixed(0)}%`}
                  >
                    {scholar.topics.slice(0, 8).map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-3">
                {scholar.topics.slice(0, 10).map((topic, idx) => (
                  <div key={topic.name} className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                    />
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-800">{topic.name}</span>
                        <span className="text-gray-500">{topic.score}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                        <div
                          className="h-1.5 rounded-full"
                          style={{
                            width: `${topic.score}%`,
                            backgroundColor: COLORS[idx % COLORS.length]
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Top Publications */}
        {scholar.topWorks && scholar.topWorks.length > 0 && (
          <section className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Top Publications</h2>
            <div className="space-y-4">
              {scholar.topWorks.slice(0, 10).map((work, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-lg border ${idx < 3 ? 'bg-amber-50 border-amber-200' : 'bg-gray-50 border-gray-200'}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {idx < 3 && (
                          <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-white text-xs font-bold ${
                            idx === 0 ? 'bg-yellow-500' : idx === 1 ? 'bg-gray-400' : 'bg-amber-600'
                          }`}>
                            {idx + 1}
                          </span>
                        )}
                        <span className="text-sm text-gray-500">{work.year}</span>
                        {work.venue && <span className="text-sm text-gray-400">• {work.venue}</span>}
                      </div>
                      <h3 className="font-medium text-gray-800">{work.title}</h3>
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-lg font-bold text-blue-600">{work.citations.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">citations</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Impact Categories */}
        {scholar.impactCategories && scholar.impactCategories.length > 0 && (
          <section className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Impact Classification</h2>
            <div className="flex flex-wrap gap-3">
              {scholar.impactCategories.map((cat, idx) => (
                <div key={idx} className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg">
                  <p className="font-semibold">{cat.type}</p>
                  <p className="text-sm text-white/80">{cat.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-400 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm">
          <p>Computational Neuroscience Scholar Analysis</p>
          <p className="mt-2">Data: OpenAlex API | Built with Next.js & Recharts</p>
        </div>
      </footer>
    </main>
  );
}
