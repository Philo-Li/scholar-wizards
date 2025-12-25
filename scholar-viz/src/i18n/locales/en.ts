export const en = {
  // Common
  common: {
    scholars: 'Scholars',
    citations: 'Citations',
    publications: 'Publications',
    hIndex: 'H-Index',
    i10Index: 'i10-Index',
    institution: 'Institution',
    country: 'Country',
    category: 'Category',
    years: 'years',
    yrs: 'yrs',
    independent: 'Independent',
    backToDirectory: 'Back to Directory',
    previous: 'Previous',
    next: 'Next',
    page: 'Page',
    of: 'of',
    showing: 'Showing',
    to: 'to',
    dataSource: 'Data Source: OpenAlex API',
    scholarsAnalyzed: 'Scholars Analyzed',
  },

  // Navigation
  nav: {
    siteName: 'Scholar Wizards',
    dashboard: 'Dashboard',
    rankings: 'Rankings',
    earlyCareer: 'Early Career',
    risingStars: 'Rising Stars',
    scholarsCount: '185 Scholars',
  },

  // Home page
  home: {
    title: 'Computational Neuroscience Scholar Analysis',
    subtitle: 'Comprehensive analysis of top researchers in computational neuroscience, including citation metrics, h-index distribution, institutional affiliations, and research categories.',

    // Stats section
    overviewStats: 'Overview Statistics',
    totalScholars: 'Total Scholars',
    inComputationalNeuroscience: 'In computational neuroscience',
    avgCitations: 'Avg Citations',
    median: 'Median',
    max: 'Max',
    avgHIndex: 'Avg H-index',
    avgPublications: 'Avg Publications',

    // Distribution
    distributionAnalysis: 'Distribution Analysis',
    citationDistribution: 'Citation Count Distribution',
    hIndexDistribution: 'H-index Distribution',
    citationsVsHIndex: 'Citations vs H-index',
    citationsVsHIndexSubtitle: 'Relationship between H-index and Total Citations (by Category)',

    // Geographic
    geographicDistribution: 'Geographic & Institutional Distribution',
    distributionByCountry: 'Distribution by Country',
    topInstitutions: 'Top Institutions',

    // Category
    categoryDistribution: 'Research Category Distribution',
    researchCategories: 'Research Categories',
    categoryBreakdown: 'Category Breakdown',

    // Key Insights
    keyInsights: 'Key Insights',
    citationPowerLaw: 'Citation Power Law',
    citationPowerLawDesc: 'Citations follow a strong power law distribution. The top 10% of scholars account for citations above {top10Percent}, while the median is only {median}.',
    geographicConcentration: 'Geographic Concentration',
    geographicConcentrationDesc: 'The field is heavily concentrated in North America and Western Europe, with the US accounting for {usCount} scholars ({usPercent}% of the sample).',
    interdisciplinaryNature: 'Interdisciplinary Nature',
    interdisciplinaryNatureDesc: 'Many top scholars bridge AI/ML and neuroscience. The highest-cited researchers often develop widely-used methods or theoretical frameworks that cross disciplines.',

    // Early Career Section
    earlyCareerTitle: 'Early Career Impact Rankings',
    earlyCareerSubtitle: 'Ranking scholars by their citation impact during the first 5 years of their academic careers. This metric reveals early academic "explosion" potential and foundational contributions.',
    topEarlyCitations: 'Top Early Citations',
    avgEarlyCitations: 'Average Early Citations',
    medianEarlyCitations: 'Median Early Citations',
    scholarsAnalyzedLabel: 'Scholars Analyzed',
    keyFindings: 'Key Findings',
    top15ByEarlyCareer: 'Top 15 by Early Career Citations',
    earlyImpactPattern: 'Early Impact Pattern Analysis',
    marrEffect: 'The "Marr Effect"',
    marrEffectDesc: "David Marr's early works accumulated 6,724 citations in just 5 years (1969-1973), representing 23.2% of his total career citations. His theoretical frameworks became foundational texts cited for decades.",
    oneHitWonders: 'One-Hit Wonders vs. Sustained Growth',
    oneHitWondersDesc: "Davd Warland's single paper \"Spikes\" accounts for 100% of citations, while Liam Paninski's early 7.5% suggests continuous career growth. Both are valid paths to impact.",
    modernAINeuro: 'Modern AI-Neuro Crossover',
    modernAINeuroDesc: 'Benjamin Scellier (2016 start) achieved 1,591 early citations largely from "A deep learning framework for neuroscience" - showing the field\'s growing intersection with AI.',
    methodologicalImpact: 'Methodological Impact',
    methodologicalImpactDesc: 'Method developers like Paninski ("Instant neural control") often have lower early % because their tools gain adoption gradually over time.',
    completeEarlyCareerRankings: 'Complete Early Career Rankings (Top 20)',

    // Youngest Scholars Section
    youngestTitle: 'Rising Stars: Youngest Scholars',
    youngestSubtitle: 'The 10 youngest computational neuroscientists by academic career start date. These emerging researchers represent the future of the field.',
    youngestKeyFindings: 'Key Findings: The New Generation',
    gershmanLeads: 'Samuel Gershman Leads Efficiency',
    gershmanLeadsDesc: 'With 1,127 citations per year, Gershman demonstrates exceptional research productivity. His work on computational cognitive science has rapidly gained influence.',
    aiNeuroConvergence: 'AI-Neuro Convergence',
    aiNeuroConvergenceDesc: '70% of the youngest scholars focus on the intersection of AI and neuroscience, including Scellier (equilibrium propagation), Zenke (spiking networks), and Marblestone (neural engineering).',
    rapidHIndexGrowth: 'Rapid H-Index Growth',
    rapidHIndexGrowthDesc: 'Gershman achieved H-index 71 in just 18 years, while Schapiro and Zenke both reached 27 in under 17 years - indicating accelerating impact in modern academia.',
    institutionalDiversity: 'Institutional Diversity',
    institutionalDiversityDesc: 'Young scholars are distributed across top institutions: Harvard, MIT, NYU, Imperial College, and research institutes like Friedrich Miescher - showing field-wide talent development.',
    completeYoungestRankings: 'Complete Youngest Scholars Rankings',

    // Ranking Matrix Section
    rankingMatrixTitle: 'Multi-Metric Ranking Matrix',
    rankingMatrixSubtitle: 'Compare scholars across all metrics simultaneously. Each cell shows the scholar\'s rank for that specific metric. Hover over names for detailed profiles.',

    // Full Directory
    fullScholarDirectory: 'Full Scholar Directory',

    // Methodology
    methodologyTitle: 'Methodology & Data Notes',
    dataSourceTitle: 'Data Source',
    dataSourceDesc: 'Scholar data retrieved from OpenAlex API, filtering by the Computational Neuroscience concept (ID: C15286952). Data includes citation counts, h-index, publication counts, and institutional affiliations.',
    caveats: 'Caveats',
    caveat1: 'Cross-disciplinary researchers may have inflated metrics',
    caveat2: 'Tool/method developers typically have higher citation counts',
    caveat3: 'H-index varies significantly across sub-fields',
    caveat4: 'Academic age is not factored into raw metrics',

    // Footer
    footerTitle: 'Computational Neuroscience Scholar Analysis Dashboard',
    footerSubtitle: 'Data: OpenAlex API | Built with Next.js & Recharts',
  },

  // Scholar Table
  scholarTable: {
    title: 'Scholar Directory',
    searchPlaceholder: 'Search by name, institution, or country...',
    rank: 'Rank',
    name: 'Name',
  },

  // Scholar Detail Page
  scholar: {
    scholarNotFound: 'Scholar Not Found',
    coreMetrics: 'Core Metrics',
    totalCitations: 'Total Citations',
    twoYearCitedness: '2-Year Citedness',
    avgCitationsPerWork: 'avg citations per work',
    profileAnalysis: 'Scholar Profile Analysis',
    keyFindings: 'Key Findings',
    earlyCareerAnalysis: 'Early Career Analysis (First 5 Years)',
    careerStart: 'Career Start',
    earlyCitations: 'Early Citations',
    earlyWorks: 'Early Works',
    earlyImpactPct: 'Early Impact %',
    topEarlyPaper: 'Top Early Career Paper',
    publicationTimeline: 'Publication Timeline',
    researchTopics: 'Research Topics',
    topPublications: 'Top Publications',
    impactClassification: 'Impact Classification',
    footerTitle: 'Computational Neuroscience Scholar Analysis',
    footerSubtitle: 'Data: OpenAlex API | Built with Next.js & Recharts',

    // Impact Levels
    impactLevels: {
      legendary: 'Legendary',
      legendaryDesc: 'Legendary figure in the field with 100k+ citations',
      elite: 'Elite',
      eliteDesc: 'Elite scholar with 50k+ citations',
      distinguished: 'Distinguished',
      distinguishedDesc: 'Distinguished scholar with 20k+ citations',
      established: 'Established',
      establishedDesc: 'Established scholar with 10k+ citations',
      rising: 'Rising',
      risingDesc: 'Rising scholar with 5k+ citations',
      emerging: 'Emerging',
      emergingDesc: 'Emerging scholar',
    },

    // Career Stages
    careerStages: {
      unknown: 'Unknown',
      senior: 'Senior Scholar (30+ years)',
      established: 'Established Scholar (20-30 years)',
      midCareer: 'Mid-Career Scholar (10-20 years)',
      earlyCareer: 'Early-Career Scholar (<10 years)',
    },

    // Analysis templates
    analysis: {
      intro: '{name} is a {impact} in computational neuroscience, currently affiliated with {institution}.',
      independentResearch: 'Independent Research',
      productivity: 'Over a {years}-year academic career, published {works} papers (averaging {perYear} per year), with {citations} citations.',
      hIndexHigh: 'With an h-index of {hIndex}, one of the rare scholars to reach this level, indicating lasting and broad research impact.',
      hIndexMedium: 'An h-index of {hIndex}, well above field average, indicates a substantial body of highly-cited work.',
      hIndexLow: 'An h-index of {hIndex} reflects an active and influential researcher.',
      earlyCareerStrong: 'Outstanding early career performance: first 5 years account for {pct}% of total citations ({count}), showing strong early impact.',
      earlyCareerGradual: 'Academic impact accumulated gradually: first 5 years account for only {pct}%, indicating later works are more influential.',
      researchAreas: 'Primary research areas include {topics}.',
    },

    // Key Findings
    findings: {
      signatureWork: 'Signature Work',
      signatureWorkContent: '"{title}" is the most influential work, with {citations} citations, published in {year}.',
      highEfficiency: 'High Citation Efficiency',
      highEfficiencyContent: 'Averaging {count} citations per paper, indicating exceptional quality over quantity.',
      consistentOutput: 'Consistent Output',
      consistentOutputContent: 'Averaging {count} citations per paper, maintaining steady high-quality output.',
      sustainedImpact: 'Sustained Impact',
      sustainedImpactContent: 'Two-year mean citedness of {value} indicates research continues to generate significant impact.',
      classicScholar: 'Classic Scholar',
      classicScholarContent: 'Despite lower recent citations, the substantial total citations suggest impact comes primarily from classic works.',
      earlyBreakthrough: 'Early Breakthrough',
      earlyBreakthroughContent: 'Over half of citations come from the first 5 years, possibly from pioneering work or classic textbooks.',
      sustainedGrowth: 'Sustained Growth',
      sustainedGrowthContent: 'Very low early citation share indicates influence built through long-term accumulation, with later works being more impactful.',
    },
  },

  // Early Career Ranking
  earlyCareer: {
    careerStart: 'Career Start',
    earlyCitations: 'Early Citations',
    totalCitations: 'Total Citations',
    earlyPapers: 'Early Papers',
    earlyPct: 'Early %',
    topPaper: 'Top Paper',
    papers: 'Papers',

    // Insights
    marrLegacy: "David Marr's Legacy",
    marrLegacyDesc: "David Marr leads with 6,724 early citations. His 1969-1973 works, especially 'A theory of cerebellar cortex', defined computational neuroscience's foundations.",
    singlePaper: 'Single paper: {count} citations',
    earlyBurstPattern: 'Early Burst Pattern',
    earlyBurstPatternDesc: '{count} scholars have >20% of total citations from their first 5 years, indicating strong early-career impact in this field.',
    avgEarlyCitations: 'Average early citations: {count}',
    modernRisingStars: 'Modern Rising Stars',
    modernRisingStarsDesc: '{count} scholars starting after 2005 made the top 20, showing the field\'s continued growth and new talent emergence.',
    newGenLeaders: 'Gershman, Scellier, Zenke lead the new generation',
    sustainedVsEarly: 'Sustained vs. Early Impact',
    sustainedVsEarlyDesc: 'Compare Warland (100% early) vs Paninski (7.5% early): some scholars peak early, others build influence over decades.',
    pre1990Scholars: '{count} pre-1990 scholars still influential',
  },

  // Youngest Scholars
  youngest: {
    citationsPerYear: 'Citations per Academic Year',
    citationsPerYearSubtitle: 'Measuring research efficiency: total citations divided by years in academia',
    academicAgeVsHIndex: 'Academic Age vs H-Index',
    bubbleSizeNote: 'Bubble size represents total citations',
    scholar: 'Scholar',
    firstPub: 'First Pub',
    age: 'Age',
    citesPerYear: 'Cites/Year',
    youngestScholar: 'Youngest Scholar',
    startedIn: 'Started in {year}, only {age} years in academia',
    mostEfficient: 'Most Efficient',
    citationsPerYearAvg: '{count} citations/year average',
    averageStats: 'Average Stats',
    avgAgeWithCitations: 'Avg age with {count} avg citations',
    aiNeuroFocus: 'AI-Neuro Focus',
    aiNeuroFocusPct: '70%',
    aiNeuroFocusDesc: 'of young scholars work on AI + neuroscience intersection',
  },

  // Ranking Matrix
  rankingMatrix: {
    title: 'Scholar Ranking Matrix',
    subtitle: 'Multi-dimensional evaluation of {count} scholars. Hover over names for details, click headers to sort.',
    metricExplanations: 'Metric Explanations & Weighting Principles',

    // Controls
    perspective: 'Perspective:',
    sortBy: 'Sort by:',
    show: 'Show:',
    top25: 'Top 25',
    top50: 'Top 50',
    top100: 'Top 100',
    allScholars: 'All {count}',
    compositeScore: 'Composite Score',

    // Current weights
    currentWeights: 'Current weights:',

    // Legend
    rankColors: 'Rank colors:',
    top5Pct: 'Top 5%',
    top10Pct: 'Top 10%',
    top25Pct: 'Top 25%',
    top50Pct: 'Top 50%',
    bottom50Pct: 'Bottom 50%',
    importance: 'Importance: *Primary +Secondary -Auxiliary',

    // Table headers
    scholar: 'Scholar',
    overall: 'Overall',

    // Metric categories
    categories: {
      stature: 'Historical Stature / Total Impact',
      statureMetrics: 'H-Index, Total Citations',
      statureDesc: 'Reflects accumulated prestige and long-term impact in the field. H-index better captures "sustained production of impactful work" than total citations.',
      momentum: 'Current Momentum',
      momentumMetrics: '2-Year Impact (2Yr)',
      momentumDesc: 'Reflects "whether still at the center of the field". Many historical giants are no longer active recently, and when finding advisors/collaborators, recent momentum is often more critical.',
      structure: 'Output Structure',
      structureMetrics: 'Efficiency, Publications, i10',
      structureDesc: 'Distinguishes "high output but average impact" from "few papers but each one counts". Efficiency metric identifies methodology-type high-impact scholars.',
    },

    // Fairness
    fairnessTitle: 'Fairness Adjustment: M-Index',
    fairnessFormula: 'M-Index = H-Index / Academic Age',
    fairnessDesc: 'Career length affects all metrics too much. M-index distinguishes "high after 30 years" vs "high after just 10 years" - the latter is often a stronger signal, representing higher growth rate and potential.',

    // Weighting schemes
    weightingTitle: 'Three Evaluation Perspectives & Weight Allocations',
    academicStature: 'Academic Stature',
    academicStatureWeights: 'H-Index 35% | 2Yr 30% | Eff 15% | M-Idx 10% | Citations 10%',
    academicStatureDesc: 'Balanced evaluation of history and current activity',
    advisorCollaborator: 'Advisor/Collaborator',
    advisorWeights: '2Yr 45% | H-Index 20% | Eff 15% | M-Idx 15% | Citations 5%',
    advisorDesc: 'Emphasizes current activity and growth',
    historicalLegacy: 'Historical Legacy',
    legacyWeights: 'Citations 40% | H-Index 35% | Eff 15% | M-Idx 5% | 2Yr 5%',
    legacyDesc: 'Evaluates field founders and cumulative contributions',

    // Important notes
    importantNotes: 'Important Notes',
    note1: 'Avoid double-counting: Citations and H-index are highly correlated; weighting both heavily results in "seniority/scale" being double-counted',
    note2: 'i10 redundancy: High overlap with citations/h-index information, can be ignored',
    note3: 'Cross-domain bias: Scholars like Bengio who span AI-Neuro may have citations inflated by out-of-field citations',
    note4: 'Tool developer effect: Developers of widely-used methods/tools naturally have higher citations',

    // Metrics
    metrics: {
      hIndex: 'H-Index',
      hIndexDesc: 'Signal of sustained high-impact work. Better than total citations for measuring "long-term stable academic output quality". Caveat: strongly dependent on career length.',
      twoYearImpact: '2-Year Impact',
      twoYearImpactDesc: 'Reflects "whether still at the center of the field". Critical for judging current activity and frontier status. Especially important when selecting advisors or collaborators.',
      efficiency: 'Citations/Paper',
      efficiencyDesc: 'Impact per unit output. Used to "penalize pure paper quantity padding" and identify "few but impactful / methodology-type high-impact" scholars.',
      mIndex: 'M-Index',
      mIndexDesc: 'H-index divided by academic age. Key metric for distinguishing "high after 30 years" vs "high after just 10 years" - the latter is often a stronger signal.',
      totalCitations: 'Total Citations',
      totalCitationsDesc: 'Intuitive but favors "major reviews/major tools/cross-domain" researchers. Use as signal for "external influence/cross-community impact" rather than sole basis for in-field status.',
      publications: 'Publications',
      publicationsDesc: 'Only indicates output scale, weakly correlated with "status". High output does not equal leading scholar - sometimes just "large team + frequent small papers".',
      i10Index: 'i10-Index',
      i10IndexDesc: 'Highly redundant with citations/h-index, little incremental information. Can be de-weighted or ignored.',
    },

    // Tooltip
    tooltip: {
      overall: 'Overall #{rank}',
      academicAge: 'Academic age: {age} yrs',
      hIndexStature: 'H-Index (Stature)',
      twoYearMomentum: '2Yr Impact (Momentum)',
      efficiencyStructure: 'Efficiency (Structure)',
      mIndexFairness: 'M-Index (Fairness)',
      perPaper: '/paper',
      totalCitations: 'Total Citations:',
      publications: 'Publications:',
      category: 'Category:',
    },

    // Footer
    showingCount: 'Showing {shown} / {total} scholars | M-Index data: {mIndexCount} | Click headers to sort',
  },

  // Charts
  charts: {
    distributionByCountry: 'Distribution by Country',
    topInstitutions: 'Top Institutions',
    researchCategories: 'Research Categories',
  },

  // Scholar Dimensions
  dimensions: {
    title: 'Ability Dimensions',
    overallScore: 'Overall Score',
    percentileNote: '* Percentile scores are calculated relative to all scholars in the computational neuroscience dataset. Tags are assigned based on dimension combinations. Hover over the radar chart for details.',

    // Dimension names
    impact: 'Impact',
    momentum: 'Momentum',
    output: 'Output',
    efficiency: 'Efficiency',
    novelty: 'Novelty',
    breadth: 'Breadth',
    peakPower: 'Peak Power',

    // Dimension descriptions
    impactDesc: '{citations} citations, h={hIndex}',
    momentumDesc2yr: '2yr mean: {value}',
    momentumDescTrend: 'Based on publication trend',
    outputDesc: '{works} papers ({perYear}/year)',
    efficiencyDesc: '{value} cites/paper',
    noveltyDesc: '{count} unique research topics',
    breadthDesc: '{count} topic areas',
    peakPowerDesc: 'Top 3 papers: {pct}% of citations',

    // Tags
    tags: {
      prolific: 'Prolific',
      prolificDesc: 'Extremely high output with sustained momentum',
      genius: 'Genius',
      geniusDesc: 'High impact with exceptional efficiency, quality over quantity',
      lateBlocker: 'Late Bloomer',
      lateBlockerDesc: 'Academic influence grew significantly over time',
      earlyBurst: 'Early Burst',
      earlyBurstDesc: 'Major early career impact, possibly seminal work',
      darkHorse: 'Dark Horse',
      darkHorseDesc: 'Rapidly rising influence in the field',
      allRounder: 'All-Rounder',
      allRounderDesc: 'Strong and balanced across all dimensions',
      landmarkPaper: 'Landmark Paper',
      landmarkPaperDesc: 'Impact driven by iconic publications',
      pioneer: 'Pioneer',
      pioneerDesc: 'Exploring diverse research frontiers',
      legend: 'Legend',
      legendDesc: 'One of the most influential figures in the field',
    },
  },
};
