export const zh = {
  // Common
  common: {
    scholars: '学者',
    citations: '引用',
    publications: '论文',
    hIndex: 'H指数',
    i10Index: 'i10指数',
    institution: '机构',
    country: '国家',
    category: '类别',
    years: '年',
    yrs: '年',
    independent: '独立研究',
    backToDirectory: '返回目录',
    previous: '上一页',
    next: '下一页',
    page: '第',
    of: '/',
    showing: '显示',
    to: '至',
    dataSource: '数据来源：OpenAlex API',
    scholarsAnalyzed: '位学者已分析',
  },

  // Navigation
  nav: {
    siteName: 'Scholar Wizards',
    dashboard: '仪表盘',
    rankings: '排名',
    earlyCareer: '早期职业',
    risingStars: '新星',
    scholarsCount: '185 位学者',
  },

  // Home page
  home: {
    title: '计算神经科学学者分析',
    subtitle: '对计算神经科学领域顶尖研究者的全面分析，包括引用指标、H指数分布、机构归属和研究类别。',

    // Stats section
    overviewStats: '概览统计',
    totalScholars: '学者总数',
    inComputationalNeuroscience: '计算神经科学领域',
    avgCitations: '平均引用',
    median: '中位数',
    max: '最大值',
    avgHIndex: '平均H指数',
    avgPublications: '平均论文数',

    // Distribution
    distributionAnalysis: '分布分析',
    citationDistribution: '引用数量分布',
    hIndexDistribution: 'H指数分布',
    citationsVsHIndex: '引用与H指数',
    citationsVsHIndexSubtitle: 'H指数与总引用的关系（按类别）',

    // Geographic
    geographicDistribution: '地理与机构分布',
    distributionByCountry: '国家分布',
    topInstitutions: '顶尖机构',

    // Category
    categoryDistribution: '研究类别分布',
    researchCategories: '研究类别',
    categoryBreakdown: '类别细分',

    // Key Insights
    keyInsights: '关键洞察',
    citationPowerLaw: '引用幂律分布',
    citationPowerLawDesc: '引用遵循强幂律分布。前10%的学者引用超过{top10Percent}，而中位数仅为{median}。',
    geographicConcentration: '地理集中度',
    geographicConcentrationDesc: '该领域高度集中在北美和西欧，美国占{usCount}位学者（占样本的{usPercent}%）。',
    interdisciplinaryNature: '跨学科性质',
    interdisciplinaryNatureDesc: '许多顶尖学者横跨AI/ML和神经科学。引用最高的研究者往往开发跨学科的广泛使用方法或理论框架。',

    // Early Career Section
    earlyCareerTitle: '早期职业影响力排名',
    earlyCareerSubtitle: '根据学者学术生涯前5年的引用影响力进行排名。该指标揭示早期学术"爆发力"潜力和基础性贡献。',
    topEarlyCitations: '最高早期引用',
    avgEarlyCitations: '平均早期引用',
    medianEarlyCitations: '中位早期引用',
    scholarsAnalyzedLabel: '分析学者数',
    keyFindings: '关键发现',
    top15ByEarlyCareer: '早期职业引用前15名',
    earlyImpactPattern: '早期影响模式分析',
    marrEffect: '"Marr效应"',
    marrEffectDesc: 'David Marr的早期作品在短短5年内（1969-1973）积累了6,724次引用，占其职业生涯总引用的23.2%。他的理论框架成为被引用数十年的基础文献。',
    oneHitWonders: '一鸣惊人型 vs 持续增长型',
    oneHitWondersDesc: 'Davd Warland的单篇论文"Spikes"占100%引用，而Liam Paninski的早期7.5%暗示持续的职业增长。两种都是有效的影响路径。',
    modernAINeuro: '现代AI-神经交叉',
    modernAINeuroDesc: 'Benjamin Scellier（2016年起步）获得1,591次早期引用，主要来自"神经科学的深度学习框架"——显示该领域与AI日益交叉。',
    methodologicalImpact: '方法论影响',
    methodologicalImpactDesc: '像Paninski（"即时神经控制"）这样的方法开发者早期百分比通常较低，因为他们的工具随时间逐渐被采用。',
    completeEarlyCareerRankings: '完整早期职业排名（前20名）',

    // Youngest Scholars Section
    youngestTitle: '新星：最年轻学者',
    youngestSubtitle: '按学术生涯起始日期排列的10位最年轻的计算神经科学家。这些新兴研究者代表着该领域的未来。',
    youngestKeyFindings: '关键发现：新一代',
    gershmanLeads: 'Samuel Gershman效率领先',
    gershmanLeadsDesc: 'Gershman以每年1,127次引用展示了卓越的研究生产力。他在计算认知科学方面的工作迅速获得影响力。',
    aiNeuroConvergence: 'AI-神经融合',
    aiNeuroConvergenceDesc: '70%的最年轻学者专注于AI和神经科学的交叉领域，包括Scellier（平衡传播）、Zenke（脉冲网络）和Marblestone（神经工程）。',
    rapidHIndexGrowth: 'H指数快速增长',
    rapidHIndexGrowthDesc: 'Gershman在短短18年内达到H指数71，而Schapiro和Zenke都在不到17年内达到27——表明现代学术界影响力加速增长。',
    institutionalDiversity: '机构多样性',
    institutionalDiversityDesc: '年轻学者分布在顶尖机构：哈佛、MIT、NYU、帝国理工和Friedrich Miescher等研究所——显示全领域的人才培养。',
    completeYoungestRankings: '完整最年轻学者排名',

    // Ranking Matrix Section
    rankingMatrixTitle: '多指标排名矩阵',
    rankingMatrixSubtitle: '同时比较学者的所有指标。每个单元格显示该学者在该特定指标上的排名。悬停查看详细资料。',

    // Full Directory
    fullScholarDirectory: '完整学者目录',

    // Methodology
    methodologyTitle: '方法论与数据说明',
    dataSourceTitle: '数据来源',
    dataSourceDesc: '学者数据来自OpenAlex API，按计算神经科学概念（ID: C15286952）筛选。数据包括引用数、H指数、论文数和机构归属。',
    caveats: '注意事项',
    caveat1: '跨学科研究者可能指标被夸大',
    caveat2: '工具/方法开发者通常引用数更高',
    caveat3: 'H指数在不同子领域差异显著',
    caveat4: '原始指标未考虑学术年龄',

    // Footer
    footerTitle: '计算神经科学学者分析仪表盘',
    footerSubtitle: '数据：OpenAlex API | 技术栈：Next.js & Recharts',
  },

  // Scholar Table
  scholarTable: {
    title: '学者目录',
    searchPlaceholder: '按姓名、机构或国家搜索...',
    rank: '排名',
    name: '姓名',
  },

  // Scholar Detail Page
  scholar: {
    scholarNotFound: '未找到学者',
    coreMetrics: '核心指标',
    totalCitations: '总引用',
    twoYearCitedness: '两年引用率',
    avgCitationsPerWork: '每篇平均引用',
    profileAnalysis: '学者档案分析',
    keyFindings: '关键发现',
    earlyCareerAnalysis: '早期职业分析（前5年）',
    careerStart: '职业起点',
    earlyCitations: '早期引用',
    earlyWorks: '早期论文',
    earlyImpactPct: '早期影响占比',
    topEarlyPaper: '顶尖早期论文',
    publicationTimeline: '发表时间线',
    researchTopics: '研究主题',
    topPublications: '顶尖论文',
    impactClassification: '影响力分类',
    footerTitle: '计算神经科学学者分析',
    footerSubtitle: '数据：OpenAlex API | 技术栈：Next.js & Recharts',

    // Impact Levels
    impactLevels: {
      legendary: '传奇',
      legendaryDesc: '领域传奇人物，引用超10万',
      elite: '精英',
      eliteDesc: '顶级学者，引用超5万',
      distinguished: '杰出',
      distinguishedDesc: '杰出学者，引用超2万',
      established: '知名',
      establishedDesc: '知名学者，引用超1万',
      rising: '新锐',
      risingDesc: '新锐学者，引用超5千',
      emerging: '新兴',
      emergingDesc: '新兴学者',
    },

    // Career Stages
    careerStages: {
      unknown: '未知',
      senior: '资深学者（30年+）',
      established: '成熟学者（20-30年）',
      midCareer: '中期学者（10-20年）',
      earlyCareer: '早期学者（<10年）',
    },

    // Analysis templates
    analysis: {
      intro: '{name}是计算神经科学领域的{impact}，目前任职于{institution}。',
      independentResearch: '独立研究',
      productivity: '在{years}年的学术生涯中，共发表{works}篇论文（年均{perYear}篇），被引用{citations}次。',
      hIndexHigh: 'H指数达到{hIndex}，是极少数能达到此高度的学者，表明其研究具有持久且广泛的影响力。',
      hIndexMedium: 'H指数为{hIndex}，远高于领域平均水平，表明其有大量高引用论文。',
      hIndexLow: 'H指数为{hIndex}，是一个活跃且有影响力的研究者。',
      earlyCareerStrong: '早期职业表现突出：前5年引用占总引用的{pct}%（{count}次），显示出极强的早期爆发力。',
      earlyCareerGradual: '其学术影响力是逐步积累的：前5年引用仅占{pct}%，说明后期作品更具影响力。',
      researchAreas: '主要研究方向包括{topics}。',
    },

    // Key Findings
    findings: {
      signatureWork: '代表作品',
      signatureWorkContent: '《{title}》是其最具影响力的作品，被引用{citations}次，发表于{year}年。',
      highEfficiency: '高引用效率',
      highEfficiencyContent: '平均每篇论文被引用{count}次，表明其作品质量极高，而非依靠数量取胜。',
      consistentOutput: '稳定产出',
      consistentOutputContent: '平均每篇论文被引用{count}次，维持着稳定的高质量产出。',
      sustainedImpact: '持续影响力',
      sustainedImpactContent: '近两年平均引用率为{value}，表明其研究仍在持续产生影响。',
      classicScholar: '经典型学者',
      classicScholarContent: '虽然近两年引用率较低，但总引用量巨大，说明其影响主要来自经典作品。',
      earlyBreakthrough: '早期爆发型',
      earlyBreakthroughContent: '超过一半的引用来自职业生涯前5年，可能是开创性工作或经典教材的作者。',
      sustainedGrowth: '持续增长型',
      sustainedGrowthContent: '早期引用占比极低，说明其影响力是通过长期积累建立的，后期作品更具影响力。',
    },
  },

  // Early Career Ranking
  earlyCareer: {
    careerStart: '职业起点',
    earlyCitations: '早期引用',
    totalCitations: '总引用',
    earlyPapers: '早期论文',
    earlyPct: '早期占比',
    topPaper: '顶尖论文',
    papers: '论文',

    // Insights
    marrLegacy: 'David Marr的遗产',
    marrLegacyDesc: 'David Marr以6,724次早期引用领先。他1969-1973年的作品，尤其是"小脑皮层理论"，奠定了计算神经科学的基础。',
    singlePaper: '单篇论文：{count}次引用',
    earlyBurstPattern: '早期爆发模式',
    earlyBurstPatternDesc: '{count}位学者前5年引用占总引用>20%，表明该领域早期职业影响力强劲。',
    avgEarlyCitations: '平均早期引用：{count}',
    modernRisingStars: '现代新星',
    modernRisingStarsDesc: '{count}位2005年后起步的学者进入前20，显示该领域持续增长和新人才涌现。',
    newGenLeaders: 'Gershman、Scellier、Zenke引领新一代',
    sustainedVsEarly: '持续型 vs 早期型影响',
    sustainedVsEarlyDesc: '对比Warland（100%早期）vs Paninski（7.5%早期）：有些学者早期达到巅峰，有些则数十年积累影响力。',
    pre1990Scholars: '{count}位1990年前学者仍具影响力',
  },

  // Youngest Scholars
  youngest: {
    citationsPerYear: '年均引用',
    citationsPerYearSubtitle: '衡量研究效率：总引用除以学术年限',
    academicAgeVsHIndex: '学术年龄 vs H指数',
    bubbleSizeNote: '气泡大小代表总引用',
    scholar: '学者',
    firstPub: '首次发表',
    age: '年龄',
    citesPerYear: '年均引用',
    youngestScholar: '最年轻学者',
    startedIn: '{year}年起步，仅{age}年学术生涯',
    mostEfficient: '最高效率',
    citationsPerYearAvg: '年均{count}次引用',
    averageStats: '平均数据',
    avgAgeWithCitations: '平均年龄，平均{count}次引用',
    aiNeuroFocus: 'AI-神经焦点',
    aiNeuroFocusPct: '70%',
    aiNeuroFocusDesc: '的年轻学者从事AI与神经科学交叉研究',
  },

  // Ranking Matrix
  rankingMatrix: {
    title: '学者排名矩阵',
    subtitle: '对{count}位学者的多维度评估。悬停查看详情，点击表头排序。',
    metricExplanations: '指标解释与权重原则',

    // Controls
    perspective: '视角：',
    sortBy: '排序：',
    show: '显示：',
    top25: '前25',
    top50: '前50',
    top100: '前100',
    allScholars: '全部{count}',
    compositeScore: '综合得分',

    // Current weights
    currentWeights: '当前权重：',

    // Legend
    rankColors: '排名颜色：',
    top5Pct: '前5%',
    top10Pct: '前10%',
    top25Pct: '前25%',
    top50Pct: '前50%',
    bottom50Pct: '后50%',
    importance: '重要性：*主要 +次要 -辅助',

    // Table headers
    scholar: '学者',
    overall: '综合',

    // Metric categories
    categories: {
      stature: '历史地位 / 总体影响',
      statureMetrics: 'H指数、总引用',
      statureDesc: '反映在领域内积累的声望和长期影响。H指数比总引用更能体现"持续产出有影响力工作"。',
      momentum: '当前势头',
      momentumMetrics: '两年影响（2Yr）',
      momentumDesc: '反映"是否仍处于领域中心"。许多历史巨匠近期已不活跃，在寻找导师/合作者时，近期势头往往更关键。',
      structure: '产出结构',
      structureMetrics: '效率、论文数、i10',
      structureDesc: '区分"高产但影响一般"和"论文少但篇篇精品"。效率指标识别方法论型高影响学者。',
    },

    // Fairness
    fairnessTitle: '公平性调整：M指数',
    fairnessFormula: 'M指数 = H指数 / 学术年龄',
    fairnessDesc: '职业长度对所有指标影响太大。M指数区分"30年后达到高度"vs"仅10年就达到高度"——后者往往是更强的信号，代表更高的增长率和潜力。',

    // Weighting schemes
    weightingTitle: '三种评估视角及权重分配',
    academicStature: '学术地位',
    academicStatureWeights: 'H指数 35% | 2Yr 30% | 效率 15% | M指数 10% | 引用 10%',
    academicStatureDesc: '历史与当前活跃度的平衡评估',
    advisorCollaborator: '导师/合作者',
    advisorWeights: '2Yr 45% | H指数 20% | 效率 15% | M指数 15% | 引用 5%',
    advisorDesc: '强调当前活跃度和增长',
    historicalLegacy: '历史遗产',
    legacyWeights: '引用 40% | H指数 35% | 效率 15% | M指数 5% | 2Yr 5%',
    legacyDesc: '评估领域奠基人和累积贡献',

    // Important notes
    importantNotes: '重要说明',
    note1: '避免重复计数：引用和H指数高度相关；两者权重都高会导致"资历/规模"被重复计数',
    note2: 'i10冗余：与引用/H指数信息高度重叠，可忽略',
    note3: '跨领域偏差：像Bengio这样横跨AI-神经的学者可能因领域外引用而被夸大',
    note4: '工具开发者效应：广泛使用的方法/工具开发者自然引用更高',

    // Metrics
    metrics: {
      hIndex: 'H指数',
      hIndexDesc: '持续高影响工作的信号。比总引用更能衡量"长期稳定的学术产出质量"。注意：强烈依赖职业长度。',
      twoYearImpact: '两年影响',
      twoYearImpactDesc: '反映"是否仍处于领域中心"。判断当前活跃度和前沿状态的关键。在选择导师或合作者时尤为重要。',
      efficiency: '篇均引用',
      efficiencyDesc: '单位产出的影响。用于"惩罚纯数量堆积"并识别"少而精/方法论型高影响"学者。',
      mIndex: 'M指数',
      mIndexDesc: 'H指数除以学术年龄。区分"30年后达到高度"vs"仅10年就达到高度"的关键指标——后者往往是更强的信号。',
      totalCitations: '总引用',
      totalCitationsDesc: '直观但偏向"重要综述/主要工具/跨领域"研究者。作为"外部影响/跨社区影响"的信号，而非领域内地位的唯一依据。',
      publications: '论文数',
      publicationsDesc: '仅表示产出规模，与"地位"弱相关。高产不等于领军学者——有时只是"大团队+频繁小论文"。',
      i10Index: 'i10指数',
      i10IndexDesc: '与引用/H指数高度冗余，增量信息少。可降权或忽略。',
    },

    // Tooltip
    tooltip: {
      overall: '综合排名 #{rank}',
      academicAge: '学术年龄：{age}年',
      hIndexStature: 'H指数（地位）',
      twoYearMomentum: '两年影响（势头）',
      efficiencyStructure: '效率（结构）',
      mIndexFairness: 'M指数（公平）',
      perPaper: '/篇',
      totalCitations: '总引用：',
      publications: '论文数：',
      category: '类别：',
    },

    // Footer
    showingCount: '显示 {shown} / {total} 位学者 | M指数数据：{mIndexCount} | 点击表头排序',
  },

  // Charts
  charts: {
    distributionByCountry: '国家分布',
    topInstitutions: '顶尖机构',
    researchCategories: '研究类别',
  },

  // Scholar Dimensions
  dimensions: {
    title: '能力维度分析',
    overallScore: '综合评分',
    percentileNote: '* 百分位得分基于计算神经科学数据集中的所有学者计算。标签根据维度组合分配。悬停雷达图查看详情。',

    // Dimension names
    impact: '影响力',
    momentum: '动量',
    output: '产出',
    efficiency: '效率',
    novelty: '创新',
    breadth: '广度',
    peakPower: '爆发力',

    // Dimension descriptions
    impactDesc: '{citations}次引用，h={hIndex}',
    momentumDesc2yr: '2年均值：{value}',
    momentumDescTrend: '基于发表趋势',
    outputDesc: '{works}篇论文（{perYear}篇/年）',
    efficiencyDesc: '篇均{value}次引用',
    noveltyDesc: '{count}个独特研究主题',
    breadthDesc: '{count}个研究领域',
    peakPowerDesc: '前3篇论文占引用的{pct}%',

    // Tags
    tags: {
      prolific: '卷王',
      prolificDesc: '产出极高且保持持续动量',
      genius: '天赋怪',
      geniusDesc: '高影响力与卓越效率，质量胜于数量',
      lateBlocker: '厚积薄发',
      lateBlockerDesc: '学术影响力随时间显著增长',
      earlyBurst: '早期爆发',
      earlyBurstDesc: '早期职业生涯重大影响，可能有开创性工作',
      darkHorse: '黑马',
      darkHorseDesc: '领域影响力快速上升',
      allRounder: '全能型',
      allRounderDesc: '各维度表现均衡且强劲',
      landmarkPaper: '代表作驱动',
      landmarkPaperDesc: '影响力由标志性论文驱动',
      pioneer: '开拓者',
      pioneerDesc: '探索多元研究前沿',
      legend: '传奇',
      legendDesc: '领域内最具影响力的人物之一',
    },
  },
};
