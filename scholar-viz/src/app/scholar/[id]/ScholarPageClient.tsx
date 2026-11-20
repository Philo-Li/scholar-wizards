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
import { useLanguage } from '@/i18n/LanguageContext';
import type { Translations } from '@/i18n/LanguageContext';

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

function getImpactLevel(citations: number, t: Translations): { level: string; color: string; description: string } {
  if (citations >= 100000) return { level: t.scholar.impactLevels.legendary, color: 'from-yellow-400 to-amber-500', description: t.scholar.impactLevels.legendaryDesc };
  if (citations >= 50000) return { level: t.scholar.impactLevels.elite, color: 'from-purple-500 to-pink-500', description: t.scholar.impactLevels.eliteDesc };
  if (citations >= 20000) return { level: t.scholar.impactLevels.distinguished, color: 'from-blue-500 to-cyan-500', description: t.scholar.impactLevels.distinguishedDesc };
  if (citations >= 10000) return { level: t.scholar.impactLevels.established, color: 'from-green-500 to-emerald-500', description: t.scholar.impactLevels.establishedDesc };
  if (citations >= 5000) return { level: t.scholar.impactLevels.rising, color: 'from-orange-400 to-red-400', description: t.scholar.impactLevels.risingDesc };
  return { level: t.scholar.impactLevels.emerging, color: 'from-gray-400 to-gray-500', description: t.scholar.impactLevels.emergingDesc };
}

function getCareerStage(firstYear: number | null, t: Translations): { stage: string; years: number; description: string } {
  if (!firstYear) return { stage: t.scholar.careerStages.unknown, years: 0, description: t.scholar.careerStages.unknown };
  const currentYear = new Date().getFullYear();
  const years = currentYear - firstYear;

  if (years >= 30) return { stage: 'Senior', years, description: t.scholar.careerStages.senior };
  if (years >= 20) return { stage: 'Established', years, description: t.scholar.careerStages.established };
  if (years >= 10) return { stage: 'Mid-Career', years, description: t.scholar.careerStages.midCareer };
  return { stage: 'Early-Career', years, description: t.scholar.careerStages.earlyCareer };
}

function generateAnalysis(scholar: ScholarDetail, t: Translations): string[] {
  const analyses: string[] = [];
  const impact = getImpactLevel(scholar.citedByCount, t);
  const career = getCareerStage(scholar.earlyCareer?.firstPubYear || null, t);

  // Impact analysis
  analyses.push(t.scholar.analysis.intro
    .replace('{name}', scholar.name)
    .replace('{impact}', impact.description.toLowerCase())
    .replace('{institution}', scholar.institution || t.scholar.analysis.independentResearch));

  // Productivity analysis
  const worksPerYear = career.years > 0 ? (scholar.worksCount / career.years).toFixed(1) : '0';
  analyses.push(t.scholar.analysis.productivity
    .replace('{years}', String(career.years))
    .replace('{works}', String(scholar.worksCount))
    .replace('{perYear}', worksPerYear)
    .replace('{citations}', scholar.citedByCount.toLocaleString()));

  // H-index analysis
  if (scholar.hIndex >= 100) {
    analyses.push(t.scholar.analysis.hIndexHigh.replace('{hIndex}', String(scholar.hIndex)));
  } else if (scholar.hIndex >= 50) {
    analyses.push(t.scholar.analysis.hIndexMedium.replace('{hIndex}', String(scholar.hIndex)));
  } else if (scholar.hIndex >= 30) {
    analyses.push(t.scholar.analysis.hIndexLow.replace('{hIndex}', String(scholar.hIndex)));
  }

  // Early career analysis
  if (scholar.earlyCareer && scholar.earlyCareer.earlyCareerCitations > 0) {
    const earlyPct = scholar.earlyCareer.earlyPct;
    if (earlyPct >= 30) {
      analyses.push(t.scholar.analysis.earlyCareerStrong
        .replace('{pct}', String(earlyPct))
        .replace('{count}', scholar.earlyCareer.earlyCareerCitations.toLocaleString()));
    } else if (earlyPct <= 10) {
      analyses.push(t.scholar.analysis.earlyCareerGradual.replace('{pct}', String(earlyPct)));
    }
  }

  // Research direction analysis
  if (scholar.topics && scholar.topics.length > 0) {
    const topTopics = scholar.topics.slice(0, 3).map(topic => topic.name).join(', ');
    analyses.push(t.scholar.analysis.researchAreas.replace('{topics}', topTopics));
  }

  return analyses;
}

function generateKeyFindings(scholar: ScholarDetail, t: Translations): { title: string; content: string; type: 'success' | 'info' | 'warning' | 'highlight' }[] {
  const findings: { title: string; content: string; type: 'success' | 'info' | 'warning' | 'highlight' }[] = [];

  // Top publication analysis
  if (scholar.topWorks && scholar.topWorks.length > 0) {
    const topWork = scholar.topWorks[0];
    findings.push({
      title: t.scholar.findings.signatureWork,
      content: t.scholar.findings.signatureWorkContent
        .replace('{title}', topWork.title)
        .replace('{citations}', topWork.citations.toLocaleString())
        .replace('{year}', String(topWork.year)),
      type: 'highlight'
    });
  }

  // Citation efficiency
  if (scholar.worksCount > 0) {
    const citesPerWork = Math.round(scholar.citedByCount / scholar.worksCount);
    if (citesPerWork >= 500) {
      findings.push({
        title: t.scholar.findings.highEfficiency,
        content: t.scholar.findings.highEfficiencyContent.replace('{count}', String(citesPerWork)),
        type: 'success'
      });
    } else if (citesPerWork >= 100) {
      findings.push({
        title: t.scholar.findings.consistentOutput,
        content: t.scholar.findings.consistentOutputContent.replace('{count}', String(citesPerWork)),
        type: 'info'
      });
    }
  }

  // Recent activity
  if (scholar.twoYearMeanCitedness > 10) {
    findings.push({
      title: t.scholar.findings.sustainedImpact,
      content: t.scholar.findings.sustainedImpactContent.replace('{value}', scholar.twoYearMeanCitedness.toFixed(1)),
      type: 'success'
    });
  } else if (scholar.twoYearMeanCitedness < 1 && scholar.citedByCount > 10000) {
    findings.push({
      title: t.scholar.findings.classicScholar,
      content: t.scholar.findings.classicScholarContent,
      type: 'info'
    });
  }

  // Career pattern
  if (scholar.earlyCareer) {
    if (scholar.earlyCareer.earlyPct >= 50) {
      findings.push({
        title: t.scholar.findings.earlyBreakthrough,
        content: t.scholar.findings.earlyBreakthroughContent,
        type: 'warning'
      });
    } else if (scholar.earlyCareer.earlyPct <= 5 && scholar.citedByCount > 20000) {
      findings.push({
        title: t.scholar.findings.sustainedGrowth,
        content: t.scholar.findings.sustainedGrowthContent,
        type: 'info'
      });
    }
  }

  return findings;
}

export default function ScholarPage() {
  const params = useParams();
  const id = params.id as string;
  const { t } = useLanguage();

  const scholar = (scholarDetails as ScholarDetail[]).find(s => s.id === id);

  if (!scholar) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">{t.scholar.scholarNotFound}</h1>
          <Link href="/" className="text-blue-600 hover:underline">
            {t.common.backToDirectory}
          </Link>
        </div>
      </div>
    );
  }

  const impact = getImpactLevel(scholar.citedByCount, t);
  const career = getCareerStage(scholar.earlyCareer?.firstPubYear || null, t);
  const analyses = generateAnalysis(scholar, t);
  const keyFindings = generateKeyFindings(scholar, t);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-[#7C9CB5] text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <Link href="/" className="inline-flex items-center text-white/80 hover:text-white mb-4 text-sm">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {t.common.backToDirectory}
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
              <p className="text-xl text-white/90">{scholar.institution || t.common.independent}</p>
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
          <h2 className="text-xl font-bold text-gray-800 mb-4">{t.scholar.coreMetrics}</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <StatCard label={t.scholar.totalCitations} value={scholar.citedByCount} color="blue" />
            <StatCard label={t.common.hIndex} value={scholar.hIndex} color="green" />
            <StatCard label={t.common.publications} value={scholar.worksCount} color="purple" />
            <StatCard label={t.common.i10Index} value={scholar.i10Index} color="amber" />
            <StatCard
              label={t.scholar.twoYearCitedness}
              value={scholar.twoYearMeanCitedness.toFixed(1)}
              subtext={t.scholar.avgCitationsPerWork}
              color="red"
            />
          </div>
        </section>

        {/* Ability Dimensions */}
        <ScholarDimensions scholar={scholar} />

        {/* Summary & Analysis */}
        <section className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">{t.scholar.profileAnalysis}</h2>
          <div className="prose max-w-none text-gray-700">
            {analyses.map((para, idx) => (
              <p key={idx} className="mb-3">{para}</p>
            ))}
          </div>
        </section>

        {/* Key Findings */}
        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-4">{t.scholar.keyFindings}</h2>
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
            <h2 className="text-xl font-bold text-gray-800 mb-4">{t.scholar.earlyCareerAnalysis}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-sm text-gray-500">{t.scholar.careerStart}</p>
                <p className="text-xl font-bold text-amber-600">
                  {scholar.earlyCareer.firstPubYear} - {scholar.earlyCareer.earlyCareerEnd}
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-sm text-gray-500">{t.scholar.earlyCitations}</p>
                <p className="text-xl font-bold text-amber-600">
                  {scholar.earlyCareer.earlyCareerCitations.toLocaleString()}
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-sm text-gray-500">{t.scholar.earlyWorks}</p>
                <p className="text-xl font-bold text-amber-600">
                  {scholar.earlyCareer.earlyWorksCount}
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-sm text-gray-500">{t.scholar.earlyImpactPct}</p>
                <p className="text-xl font-bold text-amber-600">
                  {scholar.earlyCareer.earlyPct}%
                </p>
              </div>
            </div>
            {scholar.earlyCareer.topPaper && (
              <div className="bg-white rounded-lg p-4">
                <p className="text-sm text-gray-500 mb-1">{t.scholar.topEarlyPaper}</p>
                <p className="font-medium text-gray-800">{scholar.earlyCareer.topPaper}</p>
              </div>
            )}
          </section>
        )}

        {/* Publication Timeline */}
        {scholar.yearlyData && scholar.yearlyData.length > 0 && (
          <section className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">{t.scholar.publicationTimeline}</h2>
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
            <h2 className="text-xl font-bold text-gray-800 mb-4">{t.scholar.researchTopics}</h2>
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
            <h2 className="text-xl font-bold text-gray-800 mb-4">{t.scholar.topPublications}</h2>
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
                      <p className="text-xs text-gray-500">{t.common.citations}</p>
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
            <h2 className="text-xl font-bold text-gray-800 mb-4">{t.scholar.impactClassification}</h2>
            <div className="flex flex-wrap gap-3">
              {scholar.impactCategories.map((cat, idx) => (
                <div key={idx} className="px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg">
                  <p className="font-semibold text-gray-800">{cat.type}</p>
                  <p className="text-sm text-gray-500">{cat.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-400 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm">
          <p>{t.scholar.footerTitle}</p>
          <p className="mt-2">{t.scholar.footerSubtitle}</p>
        </div>
      </footer>
    </main>
  );
}
