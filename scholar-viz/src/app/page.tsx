'use client';

import { StatsGrid } from '@/components/StatCards';
import { Histogram, SimplePieChart, CitationScatterPlot, SimpleBarChart } from '@/components/Charts';
import { ScholarTable } from '@/components/ScholarTable';
import { EarlyCareerBarChart, EarlyCareerTable, EarlyCareerInsights } from '@/components/EarlyCareerRanking';
import {
  scholars,
  earlyCareerScholars,
  getStatistics,
  getCountryDistribution,
  getInstitutionDistribution,
  getCategoryDistribution,
  getCitationDistribution,
  getHIndexDistribution,
  getScatterData,
  getEarlyCareerStatistics
} from '@/data/scholars';

export default function Home() {
  const stats = getStatistics();
  const countryData = getCountryDistribution().slice(0, 8);
  const institutionData = getInstitutionDistribution();
  const categoryData = getCategoryDistribution();
  const citationDist = getCitationDistribution();
  const hIndexDist = getHIndexDistribution();
  const scatterData = getScatterData();
  const earlyCareerStats = getEarlyCareerStatistics();

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold mb-4">
            Computational Neuroscience Scholar Analysis
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl">
            Comprehensive analysis of top researchers in computational neuroscience,
            including citation metrics, h-index distribution, institutional affiliations, and research categories.
          </p>
          <div className="mt-6 flex gap-4 text-sm">
            <span className="bg-white/20 px-3 py-1 rounded-full">
              Data Source: OpenAlex API
            </span>
            <span className="bg-white/20 px-3 py-1 rounded-full">
              {stats.totalScholars} Scholars Analyzed
            </span>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Stats Overview */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Overview Statistics</h2>
          <StatsGrid stats={stats} />
        </section>

        {/* Distribution Charts */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Distribution Analysis</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Histogram
              data={citationDist}
              title="Citation Count Distribution"
              color="#3b82f6"
            />
            <Histogram
              data={hIndexDist}
              title="H-index Distribution"
              color="#10b981"
            />
          </div>
        </section>

        {/* Scatter Plot */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Citations vs H-index</h2>
          <CitationScatterPlot
            data={scatterData}
            title="Relationship between H-index and Total Citations (by Category)"
          />
        </section>

        {/* Geographic & Institutional */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Geographic & Institutional Distribution</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SimplePieChart
              data={countryData.map(c => ({ name: c.country, value: c.count }))}
              title="Distribution by Country"
            />
            <SimpleBarChart
              data={institutionData.map(i => ({ name: i.institution.length > 30 ? i.institution.slice(0, 30) + '...' : i.institution, value: i.count }))}
              title="Top Institutions"
              color="#8b5cf6"
            />
          </div>
        </section>

        {/* Category Distribution */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Research Category Distribution</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SimplePieChart
              data={categoryData.map(c => ({ name: c.category, value: c.count }))}
              title="Research Categories"
            />
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Category Breakdown</h3>
              <div className="space-y-4">
                {categoryData.map((cat, idx) => {
                  const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500', 'bg-cyan-500'];
                  const percent = ((cat.count / stats.totalScholars) * 100).toFixed(1);
                  return (
                    <div key={cat.category}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-gray-700">{cat.category}</span>
                        <span className="text-gray-500">{cat.count} scholars ({percent}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`${colors[idx % colors.length]} h-2 rounded-full transition-all`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Key Insights */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Key Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="text-3xl mb-3">🎯</div>
              <h3 className="font-semibold text-gray-800 mb-2">Citation Power Law</h3>
              <p className="text-gray-600 text-sm">
                Citations follow a strong power law distribution. The top 10% of scholars
                account for citations above {stats.citations.top10Percent.toLocaleString()},
                while the median is only {stats.citations.median.toLocaleString()}.
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="text-3xl mb-3">🌍</div>
              <h3 className="font-semibold text-gray-800 mb-2">Geographic Concentration</h3>
              <p className="text-gray-600 text-sm">
                The field is heavily concentrated in North America and Western Europe,
                with the US accounting for {countryData.find(c => c.country === 'US')?.count || 0} scholars
                ({((countryData.find(c => c.country === 'US')?.count || 0) / stats.totalScholars * 100).toFixed(0)}% of the sample).
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="text-3xl mb-3">🔬</div>
              <h3 className="font-semibold text-gray-800 mb-2">Interdisciplinary Nature</h3>
              <p className="text-gray-600 text-sm">
                Many top scholars bridge AI/ML and neuroscience. The highest-cited researchers
                often develop widely-used methods or theoretical frameworks that cross disciplines.
              </p>
            </div>
          </div>
        </section>

        {/* Early Career Citations Ranking */}
        <section className="bg-gradient-to-r from-amber-50 to-orange-50 -mx-4 px-4 py-8 rounded-2xl">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">🏆</span>
            <h2 className="text-2xl font-bold text-gray-800">Early Career Impact Rankings</h2>
          </div>
          <p className="text-gray-600 mb-6 max-w-3xl">
            Ranking scholars by their citation impact during the first 5 years of their academic careers.
            This metric reveals early academic "explosion" potential and foundational contributions.
          </p>

          {/* Early Career Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg p-4 shadow">
              <p className="text-sm text-gray-500">Top Early Citations</p>
              <p className="text-2xl font-bold text-amber-600">{earlyCareerStats.max.toLocaleString()}</p>
              <p className="text-xs text-gray-400">David Marr</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow">
              <p className="text-sm text-gray-500">Average Early Citations</p>
              <p className="text-2xl font-bold text-blue-600">{earlyCareerStats.mean.toLocaleString()}</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow">
              <p className="text-sm text-gray-500">Median Early Citations</p>
              <p className="text-2xl font-bold text-green-600">{earlyCareerStats.median.toLocaleString()}</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow">
              <p className="text-sm text-gray-500">Scholars Analyzed</p>
              <p className="text-2xl font-bold text-purple-600">{earlyCareerStats.total}</p>
            </div>
          </div>

          {/* Key Insights for Early Career */}
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Key Findings</h3>
          <EarlyCareerInsights data={earlyCareerScholars} />

          {/* Chart and Table */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
            <EarlyCareerBarChart
              data={earlyCareerScholars}
              title="Top 15 by Early Career Citations"
            />
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Early Impact Pattern Analysis</h3>
              <div className="space-y-4 text-sm text-gray-600">
                <div className="p-4 bg-amber-50 rounded-lg border-l-4 border-amber-500">
                  <p className="font-semibold text-amber-800">The "Marr Effect"</p>
                  <p className="mt-1">David Marr's early works accumulated 6,724 citations in just 5 years (1969-1973), representing 23.2% of his total career citations. His theoretical frameworks became foundational texts cited for decades.</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                  <p className="font-semibold text-blue-800">One-Hit Wonders vs. Sustained Growth</p>
                  <p className="mt-1">Davd Warland's single paper "Spikes" accounts for 100% of citations, while Liam Paninski's early 7.5% suggests continuous career growth. Both are valid paths to impact.</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                  <p className="font-semibold text-green-800">Modern AI-Neuro Crossover</p>
                  <p className="mt-1">Benjamin Scellier (2016 start) achieved 1,591 early citations largely from "A deep learning framework for neuroscience" - showing the field's growing intersection with AI.</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                  <p className="font-semibold text-purple-800">Methodological Impact</p>
                  <p className="mt-1">Method developers like Paninski ("Instant neural control") often have lower early % because their tools gain adoption gradually over time.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Full Ranking Table */}
          <div className="mt-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Complete Early Career Rankings (Top 20)</h3>
            <EarlyCareerTable data={earlyCareerScholars} />
          </div>
        </section>

        {/* Scholar Table */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Full Scholar Directory</h2>
          <ScholarTable scholars={scholars} />
        </section>

        {/* Methodology */}
        <section className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Methodology & Data Notes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Data Source</h3>
              <p>
                Scholar data retrieved from OpenAlex API, filtering by the Computational Neuroscience
                concept (ID: C15286952). Data includes citation counts, h-index, publication counts,
                and institutional affiliations.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Caveats</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Cross-disciplinary researchers may have inflated metrics</li>
                <li>Tool/method developers typically have higher citation counts</li>
                <li>H-index varies significantly across sub-fields</li>
                <li>Academic age is not factored into raw metrics</li>
              </ul>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-400 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm">
          <p>Computational Neuroscience Scholar Analysis Dashboard</p>
          <p className="mt-2">Data: OpenAlex API | Built with Next.js & Recharts</p>
        </div>
      </footer>
    </main>
  );
}
