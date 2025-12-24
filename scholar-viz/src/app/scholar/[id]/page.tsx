'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from 'recharts';
import scholarDetails from '@/data/scholarDetails.json';

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
  if (citations >= 100000) return { level: 'Legendary', color: 'from-yellow-400 to-amber-500', description: '领域传奇人物，引用超10万' };
  if (citations >= 50000) return { level: 'Elite', color: 'from-purple-500 to-pink-500', description: '顶级学者，引用超5万' };
  if (citations >= 20000) return { level: 'Distinguished', color: 'from-blue-500 to-cyan-500', description: '杰出学者，引用超2万' };
  if (citations >= 10000) return { level: 'Established', color: 'from-green-500 to-emerald-500', description: '知名学者，引用超1万' };
  if (citations >= 5000) return { level: 'Rising', color: 'from-orange-400 to-red-400', description: '新锐学者，引用超5千' };
  return { level: 'Emerging', color: 'from-gray-400 to-gray-500', description: '新兴学者' };
}

function getCareerStage(firstYear: number | null): { stage: string; years: number; description: string } {
  if (!firstYear) return { stage: 'Unknown', years: 0, description: '未知' };
  const currentYear = new Date().getFullYear();
  const years = currentYear - firstYear;

  if (years >= 30) return { stage: 'Senior', years, description: '资深学者（30年+）' };
  if (years >= 20) return { stage: 'Established', years, description: '成熟学者（20-30年）' };
  if (years >= 10) return { stage: 'Mid-Career', years, description: '中期学者（10-20年）' };
  return { stage: 'Early-Career', years, description: '早期学者（<10年）' };
}

function generateAnalysis(scholar: ScholarDetail): string[] {
  const analyses: string[] = [];
  const impact = getImpactLevel(scholar.citedByCount);
  const career = getCareerStage(scholar.earlyCareer?.firstPubYear || null);

  // 影响力分析
  analyses.push(`${scholar.name} 是计算神经科学领域的${impact.description}，目前任职于 ${scholar.institution || '独立研究'}。`);

  // 产出分析
  const worksPerYear = career.years > 0 ? (scholar.worksCount / career.years).toFixed(1) : 0;
  analyses.push(`在 ${career.years} 年的学术生涯中，共发表 ${scholar.worksCount} 篇论文（年均 ${worksPerYear} 篇），被引用 ${scholar.citedByCount.toLocaleString()} 次。`);

  // H-index分析
  if (scholar.hIndex >= 100) {
    analyses.push(`h-index 达到 ${scholar.hIndex}，是极少数能达到此高度的学者，表明其研究具有持久且广泛的影响力。`);
  } else if (scholar.hIndex >= 50) {
    analyses.push(`h-index 为 ${scholar.hIndex}，远高于领域平均水平，表明其有大量高引用论文。`);
  } else if (scholar.hIndex >= 30) {
    analyses.push(`h-index 为 ${scholar.hIndex}，是一个活跃且有影响力的研究者。`);
  }

  // 早期职业分析
  if (scholar.earlyCareer && scholar.earlyCareer.earlyCareerCitations > 0) {
    const earlyPct = scholar.earlyCareer.earlyPct;
    if (earlyPct >= 30) {
      analyses.push(`早期职业表现突出：前5年引用占总引用的 ${earlyPct}%（${scholar.earlyCareer.earlyCareerCitations.toLocaleString()} 次），显示出极强的早期爆发力。`);
    } else if (earlyPct <= 10) {
      analyses.push(`其学术影响力是逐步积累的：前5年引用仅占 ${earlyPct}%，说明后期作品更具影响力。`);
    }
  }

  // 研究方向分析
  if (scholar.topics && scholar.topics.length > 0) {
    const topTopics = scholar.topics.slice(0, 3).map(t => t.name).join('、');
    analyses.push(`主要研究方向包括 ${topTopics} 等领域。`);
  }

  return analyses;
}

function generateKeyFindings(scholar: ScholarDetail): { title: string; content: string; type: 'success' | 'info' | 'warning' | 'highlight' }[] {
  const findings: { title: string; content: string; type: 'success' | 'info' | 'warning' | 'highlight' }[] = [];

  // 顶级论文分析
  if (scholar.topWorks && scholar.topWorks.length > 0) {
    const topWork = scholar.topWorks[0];
    findings.push({
      title: '代表作品',
      content: `《${topWork.title}》是其最具影响力的作品，被引用 ${topWork.citations.toLocaleString()} 次，发表于 ${topWork.year} 年。`,
      type: 'highlight'
    });
  }

  // 引用效率
  if (scholar.worksCount > 0) {
    const citesPerWork = Math.round(scholar.citedByCount / scholar.worksCount);
    if (citesPerWork >= 500) {
      findings.push({
        title: '高引用效率',
        content: `平均每篇论文被引用 ${citesPerWork} 次，表明其作品质量极高，而非依靠数量取胜。`,
        type: 'success'
      });
    } else if (citesPerWork >= 100) {
      findings.push({
        title: '稳定产出',
        content: `平均每篇论文被引用 ${citesPerWork} 次，维持着稳定的高质量产出。`,
        type: 'info'
      });
    }
  }

  // 近期活跃度
  if (scholar.twoYearMeanCitedness > 10) {
    findings.push({
      title: '持续影响力',
      content: `近两年平均引用率为 ${scholar.twoYearMeanCitedness.toFixed(1)}，表明其研究仍在持续产生影响。`,
      type: 'success'
    });
  } else if (scholar.twoYearMeanCitedness < 1 && scholar.citedByCount > 10000) {
    findings.push({
      title: '经典型学者',
      content: `虽然近两年引用率较低，但总引用量巨大，说明其影响主要来自经典作品。`,
      type: 'info'
    });
  }

  // 职业生涯模式
  if (scholar.earlyCareer) {
    if (scholar.earlyCareer.earlyPct >= 50) {
      findings.push({
        title: '早期爆发型',
        content: `超过一半的引用来自职业生涯前5年，可能是开创性工作或经典教材的作者。`,
        type: 'warning'
      });
    } else if (scholar.earlyCareer.earlyPct <= 5 && scholar.citedByCount > 20000) {
      findings.push({
        title: '持续增长型',
        content: `早期引用占比极低，说明其影响力是通过长期积累建立的，后期作品更具影响力。`,
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
                    label={({ name, percent }) => `${name.slice(0, 15)}: ${(percent * 100).toFixed(0)}%`}
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
