import scholarsData from './scholars.json';
import earlyCareerData from './earlyCareer.json';

export interface Scholar {
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

export const scholars: Scholar[] = scholarsData as Scholar[];

// Early career data
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

export const earlyCareerScholars: EarlyCareerScholar[] = earlyCareerData as EarlyCareerScholar[];

export function getEarlyCareerStatistics() {
  const citations = earlyCareerScholars.map(s => s.earlyCareerCitations);
  const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);
  const mean = (arr: number[]) => arr.length ? sum(arr) / arr.length : 0;
  const median = (arr: number[]) => {
    const sorted = [...arr].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
  };

  return {
    mean: Math.round(mean(citations)),
    median: Math.round(median(citations)),
    max: Math.max(...citations),
    total: earlyCareerScholars.length
  };
}

// Statistics
export function getStatistics() {
  const citations = scholars.map(s => s.cited_by_count).filter(c => c > 0);
  const hIndices = scholars.map(s => s.h_index).filter(h => h > 0);
  const worksCounts = scholars.map(s => s.works_count).filter(w => w > 0);

  const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);
  const mean = (arr: number[]) => arr.length ? sum(arr) / arr.length : 0;
  const median = (arr: number[]) => {
    const sorted = [...arr].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
  };

  return {
    totalScholars: scholars.length,
    citations: {
      mean: Math.round(mean(citations)),
      median: Math.round(median(citations)),
      max: Math.max(...citations),
      top10Percent: Math.round(citations.sort((a, b) => b - a)[Math.floor(citations.length * 0.1)])
    },
    hIndex: {
      mean: Math.round(mean(hIndices) * 10) / 10,
      median: Math.round(median(hIndices)),
      max: Math.max(...hIndices)
    },
    worksCount: {
      mean: Math.round(mean(worksCounts)),
      median: Math.round(median(worksCounts))
    }
  };
}

// Get country distribution
export function getCountryDistribution() {
  const counts: Record<string, number> = {};
  scholars.forEach(s => {
    if (s.country) {
      counts[s.country] = (counts[s.country] || 0) + 1;
    }
  });
  return Object.entries(counts)
    .map(([country, count]) => ({ country, count }))
    .sort((a, b) => b.count - a.count);
}

// Get institution distribution
export function getInstitutionDistribution() {
  const counts: Record<string, number> = {};
  scholars.forEach(s => {
    if (s.institution) {
      counts[s.institution] = (counts[s.institution] || 0) + 1;
    }
  });
  return Object.entries(counts)
    .map(([institution, count]) => ({ institution, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 15);
}

// Get category distribution
export function getCategoryDistribution() {
  const counts: Record<string, number> = {};
  scholars.forEach(s => {
    const cat = s.category || 'Other';
    counts[cat] = (counts[cat] || 0) + 1;
  });
  return Object.entries(counts)
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);
}

// Get top scholars
export function getTopScholars(n: number = 20) {
  return [...scholars]
    .sort((a, b) => b.cited_by_count - a.cited_by_count)
    .slice(0, n);
}

// Get citation distribution for histogram
export function getCitationDistribution() {
  const ranges = [
    { range: '0-5K', min: 0, max: 5000 },
    { range: '5K-10K', min: 5000, max: 10000 },
    { range: '10K-20K', min: 10000, max: 20000 },
    { range: '20K-50K', min: 20000, max: 50000 },
    { range: '50K-100K', min: 50000, max: 100000 },
    { range: '100K+', min: 100000, max: Infinity }
  ];

  return ranges.map(r => ({
    range: r.range,
    count: scholars.filter(s => s.cited_by_count >= r.min && s.cited_by_count < r.max).length
  }));
}

// Get h-index distribution
export function getHIndexDistribution() {
  const ranges = [
    { range: '0-20', min: 0, max: 20 },
    { range: '20-40', min: 20, max: 40 },
    { range: '40-60', min: 40, max: 60 },
    { range: '60-80', min: 60, max: 80 },
    { range: '80-100', min: 80, max: 100 },
    { range: '100+', min: 100, max: Infinity }
  ];

  return ranges.map(r => ({
    range: r.range,
    count: scholars.filter(s => s.h_index >= r.min && s.h_index < r.max).length
  }));
}

// Get scatter data for citations vs h-index
export function getScatterData() {
  return scholars
    .filter(s => s.cited_by_count > 0 && s.h_index > 0)
    .map(s => ({
      name: s.name,
      citations: s.cited_by_count,
      hIndex: s.h_index,
      works: s.works_count,
      category: s.category
    }));
}
