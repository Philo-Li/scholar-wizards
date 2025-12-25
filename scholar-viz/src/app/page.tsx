'use client';

import { StatsGrid } from '@/components/StatCards';
import { Histogram, SimplePieChart, CitationScatterPlot, SimpleBarChart } from '@/components/Charts';
import { ScholarTable } from '@/components/ScholarTable';
import { EarlyCareerBarChart, EarlyCareerTable, EarlyCareerInsights } from '@/components/EarlyCareerRanking';
import { YoungestScholarsChart, YoungestScholarsBubble, YoungestScholarsTable, YoungestScholarsInsights } from '@/components/YoungestScholars';
import { RankingMatrix } from '@/components/RankingMatrix';
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
import youngestScholarsData from '@/data/youngestScholars.json';
import { useLanguage } from '@/i18n/LanguageContext';

export default function Home() {
  const { t } = useLanguage();
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
      <header className="bg-[#7C9CB5] text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold mb-4">
            {t.home.title}
          </h1>
          <p className="text-xl text-white/80 max-w-3xl">
            {t.home.subtitle}
          </p>
          <div className="mt-6 flex gap-4 text-sm">
            <span className="bg-white/20 px-3 py-1 rounded-full">
              {t.common.dataSource}
            </span>
            <span className="bg-white/20 px-3 py-1 rounded-full">
              {stats.totalScholars} {t.common.scholarsAnalyzed}
            </span>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Stats Overview */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">{t.home.overviewStats}</h2>
          <StatsGrid stats={stats} />
        </section>

        {/* Distribution Charts */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">{t.home.distributionAnalysis}</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Histogram
              data={citationDist}
              title={t.home.citationDistribution}
              color="#3b82f6"
            />
            <Histogram
              data={hIndexDist}
              title={t.home.hIndexDistribution}
              color="#10b981"
            />
          </div>
        </section>

        {/* Scatter Plot */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">{t.home.citationsVsHIndex}</h2>
          <CitationScatterPlot
            data={scatterData}
            title={t.home.citationsVsHIndexSubtitle}
          />
        </section>

        {/* Geographic & Institutional */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">{t.home.geographicDistribution}</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SimplePieChart
              data={countryData.map(c => ({ name: c.country, value: c.count }))}
              title={t.home.distributionByCountry}
            />
            <SimpleBarChart
              data={institutionData.map(i => ({ name: i.institution.length > 30 ? i.institution.slice(0, 30) + '...' : i.institution, value: i.count }))}
              title={t.home.topInstitutions}
              color="#8b5cf6"
            />
          </div>
        </section>

        {/* Category Distribution */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">{t.home.categoryDistribution}</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SimplePieChart
              data={categoryData.map(c => ({ name: c.category, value: c.count }))}
              title={t.home.researchCategories}
            />
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">{t.home.categoryBreakdown}</h3>
              <div className="space-y-4">
                {categoryData.map((cat, idx) => {
                  const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500', 'bg-cyan-500'];
                  const percent = ((cat.count / stats.totalScholars) * 100).toFixed(1);
                  return (
                    <div key={cat.category}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-gray-700">{cat.category}</span>
                        <span className="text-gray-500">{cat.count} {t.common.scholars} ({percent}%)</span>
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
          <h2 className="text-2xl font-bold text-gray-800 mb-6">{t.home.keyInsights}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="text-3xl mb-3">🎯</div>
              <h3 className="font-semibold text-gray-800 mb-2">{t.home.citationPowerLaw}</h3>
              <p className="text-gray-600 text-sm">
                {t.home.citationPowerLawDesc
                  .replace('{top10Percent}', stats.citations.top10Percent.toLocaleString())
                  .replace('{median}', stats.citations.median.toLocaleString())}
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="text-3xl mb-3">🌍</div>
              <h3 className="font-semibold text-gray-800 mb-2">{t.home.geographicConcentration}</h3>
              <p className="text-gray-600 text-sm">
                {t.home.geographicConcentrationDesc
                  .replace('{usCount}', String(countryData.find(c => c.country === 'US')?.count || 0))
                  .replace('{usPercent}', ((countryData.find(c => c.country === 'US')?.count || 0) / stats.totalScholars * 100).toFixed(0))}
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="text-3xl mb-3">🔬</div>
              <h3 className="font-semibold text-gray-800 mb-2">{t.home.interdisciplinaryNature}</h3>
              <p className="text-gray-600 text-sm">
                {t.home.interdisciplinaryNatureDesc}
              </p>
            </div>
          </div>
        </section>

        {/* Early Career Citations Ranking */}
        <section id="early-career" className="bg-gradient-to-r from-amber-50 to-orange-50 -mx-4 px-4 py-8 rounded-2xl scroll-mt-20">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">🏆</span>
            <h2 className="text-2xl font-bold text-gray-800">{t.home.earlyCareerTitle}</h2>
          </div>
          <p className="text-gray-600 mb-6 max-w-3xl">
            {t.home.earlyCareerSubtitle}
          </p>

          {/* Early Career Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg p-4 shadow">
              <p className="text-sm text-gray-500">{t.home.topEarlyCitations}</p>
              <p className="text-2xl font-bold text-amber-600">{earlyCareerStats.max.toLocaleString()}</p>
              <p className="text-xs text-gray-400">David Marr</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow">
              <p className="text-sm text-gray-500">{t.home.avgEarlyCitations}</p>
              <p className="text-2xl font-bold text-blue-600">{earlyCareerStats.mean.toLocaleString()}</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow">
              <p className="text-sm text-gray-500">{t.home.medianEarlyCitations}</p>
              <p className="text-2xl font-bold text-green-600">{earlyCareerStats.median.toLocaleString()}</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow">
              <p className="text-sm text-gray-500">{t.home.scholarsAnalyzedLabel}</p>
              <p className="text-2xl font-bold text-purple-600">{earlyCareerStats.total}</p>
            </div>
          </div>

          {/* Key Insights for Early Career */}
          <h3 className="text-xl font-semibold text-gray-800 mb-4">{t.home.keyFindings}</h3>
          <EarlyCareerInsights data={earlyCareerScholars} />

          {/* Chart and Table */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
            <EarlyCareerBarChart
              data={earlyCareerScholars}
              title={t.home.top15ByEarlyCareer}
            />
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">{t.home.earlyImpactPattern}</h3>
              <div className="space-y-4 text-sm text-gray-600">
                <div className="p-4 bg-amber-50 rounded-lg border-l-4 border-amber-500">
                  <p className="font-semibold text-amber-800">{t.home.marrEffect}</p>
                  <p className="mt-1">{t.home.marrEffectDesc}</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                  <p className="font-semibold text-blue-800">{t.home.oneHitWonders}</p>
                  <p className="mt-1">{t.home.oneHitWondersDesc}</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                  <p className="font-semibold text-green-800">{t.home.modernAINeuro}</p>
                  <p className="mt-1">{t.home.modernAINeuroDesc}</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                  <p className="font-semibold text-purple-800">{t.home.methodologicalImpact}</p>
                  <p className="mt-1">{t.home.methodologicalImpactDesc}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Full Ranking Table */}
          <div className="mt-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">{t.home.completeEarlyCareerRankings}</h3>
            <EarlyCareerTable data={earlyCareerScholars} />
          </div>
        </section>

        {/* Youngest Scholars Section */}
        <section id="youngest" className="bg-gradient-to-r from-cyan-50 to-blue-50 -mx-4 px-4 py-8 rounded-2xl scroll-mt-20">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">🌟</span>
            <h2 className="text-2xl font-bold text-gray-800">{t.home.youngestTitle}</h2>
          </div>
          <p className="text-gray-600 mb-6 max-w-3xl">
            {t.home.youngestSubtitle}
          </p>

          {/* Insights Cards */}
          <YoungestScholarsInsights data={youngestScholarsData} />

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
            <YoungestScholarsChart data={youngestScholarsData} />
            <YoungestScholarsBubble data={youngestScholarsData} />
          </div>

          {/* Analysis Box */}
          <div className="bg-white rounded-xl shadow-lg p-6 mt-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">{t.home.youngestKeyFindings}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="p-4 bg-cyan-50 rounded-lg border-l-4 border-cyan-500">
                <p className="font-semibold text-cyan-800">{t.home.gershmanLeads}</p>
                <p className="mt-1 text-gray-700">{t.home.gershmanLeadsDesc}</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                <p className="font-semibold text-blue-800">{t.home.aiNeuroConvergence}</p>
                <p className="mt-1 text-gray-700">{t.home.aiNeuroConvergenceDesc}</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                <p className="font-semibold text-purple-800">{t.home.rapidHIndexGrowth}</p>
                <p className="mt-1 text-gray-700">{t.home.rapidHIndexGrowthDesc}</p>
              </div>
              <div className="p-4 bg-pink-50 rounded-lg border-l-4 border-pink-500">
                <p className="font-semibold text-pink-800">{t.home.institutionalDiversity}</p>
                <p className="mt-1 text-gray-700">{t.home.institutionalDiversityDesc}</p>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="mt-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">{t.home.completeYoungestRankings}</h3>
            <YoungestScholarsTable data={youngestScholarsData} />
          </div>
        </section>

        {/* Ranking Matrix */}
        <section id="ranking-matrix" className="bg-gradient-to-r from-indigo-50 to-purple-50 -mx-4 px-4 py-8 rounded-2xl scroll-mt-20">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">📊</span>
            <h2 className="text-2xl font-bold text-gray-800">{t.home.rankingMatrixTitle}</h2>
          </div>
          <p className="text-gray-600 mb-6 max-w-3xl">
            {t.home.rankingMatrixSubtitle}
          </p>
          <RankingMatrix scholars={scholars} />
        </section>

        {/* Scholar Table */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">{t.home.fullScholarDirectory}</h2>
          <ScholarTable scholars={scholars} />
        </section>

        {/* Methodology */}
        <section className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">{t.home.methodologyTitle}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">{t.home.dataSourceTitle}</h3>
              <p>
                {t.home.dataSourceDesc}
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">{t.home.caveats}</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>{t.home.caveat1}</li>
                <li>{t.home.caveat2}</li>
                <li>{t.home.caveat3}</li>
                <li>{t.home.caveat4}</li>
              </ul>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-400 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm">
          <p>{t.home.footerTitle}</p>
          <p className="mt-2">{t.home.footerSubtitle}</p>
        </div>
      </footer>
    </main>
  );
}
