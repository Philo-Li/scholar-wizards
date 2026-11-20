// Registry of the ten disciplines. Data files live in src/data/disciplines and
// are produced by scripts/fetch_disciplines.mjs.

export type Lang = 'en' | 'zh';
export type L10n = Record<Lang, string>;

export interface DisciplineInfo {
  slug: string;
  fieldId: number;
  name: L10n;
  /** One sentence on what the OpenAlex field covers. */
  scope: L10n;
  /** Field-specific reading notes: what the numbers mean here. */
  notes: L10n[];
}

export const DISCIPLINES: DisciplineInfo[] = [
  {
    slug: 'mathematics',
    fieldId: 26,
    name: { en: 'Mathematics', zh: '数学' },
    scope: {
      en: 'Pure and applied mathematics, statistics and probability, numerical analysis and mathematical physics.',
      zh: '纯数学与应用数学、统计与概率、数值分析以及数学物理。',
    },
    notes: [
      {
        en: 'Statistics and probability attract far more citations than algebra, geometry or number theory, where a lifetime h-index of 40 is exceptional. Compare scholars within a subfield.',
        zh: '统计与概率的引用量远高于代数、几何和数论。在后者中，终身 h 指数达到 40 已属罕见。请在同一子领域内比较。',
      },
      {
        en: 'Many landmark results appear in a handful of papers; the h-index understates scholars known for a few deep theorems.',
        zh: '许多里程碑式的成果只体现在少数几篇论文中，h 指数会低估以少量深刻定理著称的学者。',
      },
    ],
  },
  {
    slug: 'physics',
    fieldId: 31,
    name: { en: 'Physics & Astronomy', zh: '物理学与天文学' },
    scope: {
      en: 'High-energy, condensed-matter, atomic and molecular physics, astrophysics, optics and acoustics.',
      zh: '高能物理、凝聚态物理、原子分子物理、天体物理、光学与声学。',
    },
    notes: [
      {
        en: 'Experimental particle physics papers often list thousands of authors. Members of these collaborations reach h-indices above 200, so they are marked † and left out of the default ranking.',
        zh: '实验粒子物理论文常有上千位作者，合作组成员的 h 指数可超过 200。这类学者标记为 †，默认不参与排名。',
      },
      {
        en: 'Density-functional theory and graphene papers are among the most-cited in all of science, which lifts computational condensed-matter physicists.',
        zh: '密度泛函理论与石墨烯论文位列全科学被引最高的论文之列，计算凝聚态物理学者因此整体偏高。',
      },
    ],
  },
  {
    slug: 'chemistry',
    fieldId: 16,
    name: { en: 'Chemistry', zh: '化学' },
    scope: {
      en: 'Organic, inorganic, analytical, physical and theoretical chemistry, spectroscopy and electrochemistry.',
      zh: '有机、无机、分析、物理与理论化学，以及光谱学和电化学。',
    },
    notes: [
      {
        en: 'Chemistry has the most papers per researcher of any field here. Large groups publish 30–60 papers a year, so publication counts say more about lab size than about individual output.',
        zh: '化学是本站人均论文最多的学科。大型课题组每年发表 30–60 篇，论文数量更多反映课题组规模而非个人产出。',
      },
      {
        en: 'Software and method papers (crystallography, computational chemistry) collect very large citation counts.',
        zh: '软件与方法类论文（晶体学、计算化学）往往获得极高的引用。',
      },
    ],
  },
  {
    slug: 'biology',
    fieldId: 13,
    name: { en: 'Biology', zh: '生物学' },
    scope: {
      en: 'Biochemistry, genetics, molecular and cell biology, structural biology and cancer research.',
      zh: '生物化学、遗传学、分子与细胞生物学、结构生物学和癌症研究。',
    },
    notes: [
      {
        en: 'Bioinformatics tools (sequence alignment, genome assembly, statistical packages) dominate the citation tail. A tool author and a bench scientist with the same count have had very different careers.',
        zh: '生物信息学工具（序列比对、基因组组装、统计软件包）主导了高引用端。引用数相同的工具作者与实验科学家，学术生涯可能截然不同。',
      },
      {
        en: 'Consortium genomics (GWAS, sequencing projects) produces hundreds of co-authors per paper; such authors are marked †.',
        zh: '联盟式基因组学（GWAS、测序计划）的论文作者常达数百人，此类学者标记为 †。',
      },
    ],
  },
  {
    slug: 'computer-science',
    fieldId: 17,
    name: { en: 'Computer Science', zh: '计算机科学' },
    scope: {
      en: 'Artificial intelligence, computer vision, systems, networks, theory, software and human–computer interaction.',
      zh: '人工智能、计算机视觉、系统、网络、理论、软件以及人机交互。',
    },
    notes: [
      {
        en: 'Conference proceedings carry most of the field’s work. OpenAlex indexes the major venues, but coverage of workshops and older proceedings is uneven.',
        zh: '计算机科学的主要成果发表在会议论文集中。OpenAlex 收录了主要会议，但对研讨会和早期论文集的覆盖并不均衡。',
      },
      {
        en: 'Deep learning has reshaped the citation landscape since 2012; many of the most-cited people have academic ages under twenty.',
        zh: '2012 年以来深度学习重塑了引用格局，许多高被引学者的学术年龄不足二十年。',
      },
    ],
  },
  {
    slug: 'medicine',
    fieldId: 27,
    name: { en: 'Medicine', zh: '医学' },
    scope: {
      en: 'Clinical medicine across specialties, epidemiology, public health and health services research.',
      zh: '各临床专科、流行病学、公共卫生和卫生服务研究。',
    },
    notes: [
      {
        en: 'Clinical guidelines, global burden-of-disease studies and multicentre trials generate exceptionally large citation counts and author lists.',
        zh: '临床指南、全球疾病负担研究和多中心试验会产生极高的引用量和极长的作者名单。',
      },
      {
        en: 'Medicine is split into more than 40 subfields. The leaderboard keeps the leaders of the twelve largest; filter by subfield before comparing.',
        zh: '医学下设 40 多个子领域，排行榜收录了其中最大的十二个子领域的领军学者。比较前请先按子领域筛选。',
      },
    ],
  },
  {
    slug: 'neuroscience',
    fieldId: 28,
    name: { en: 'Neuroscience', zh: '神经科学' },
    scope: {
      en: 'Cognitive, cellular, molecular, systems and developmental neuroscience and neurology.',
      zh: '认知、细胞、分子、系统与发育神经科学，以及神经病学。',
    },
    notes: [
      {
        en: 'Neuroimaging software and atlases (FSL, FreeSurfer, SPM) sit at the top of the citation distribution, which favours methods developers.',
        zh: '神经影像软件与图谱（FSL、FreeSurfer、SPM）位居引用分布顶端，方法开发者因此更占优势。',
      },
      {
        en: 'For a curated deep dive on computational neuroscience, including early-career impact, see the collection page.',
        zh: '关于计算神经科学的专题深度分析（包括早期职业影响力），请参阅专题合集页面。',
      },
    ],
  },
  {
    slug: 'psychology',
    fieldId: 32,
    name: { en: 'Psychology', zh: '心理学' },
    scope: {
      en: 'Clinical, developmental, social, cognitive and applied psychology.',
      zh: '临床、发展、社会、认知与应用心理学。',
    },
    notes: [
      {
        en: 'Measurement and statistics papers (scales, structural equation modelling, effect sizes) are cited across the social sciences and inflate their authors’ totals.',
        zh: '测量与统计方法论文（量表、结构方程模型、效应量）在整个社会科学中被广泛引用，推高了作者的总引用量。',
      },
      {
        en: 'Books and test manuals are central in psychology but are indexed less completely than journal articles.',
        zh: '专著与测验手册在心理学中地位重要，但其收录完整度不及期刊论文。',
      },
    ],
  },
  {
    slug: 'economics',
    fieldId: 20,
    name: { en: 'Economics', zh: '经济学' },
    scope: {
      en: 'Economics, econometrics and finance.',
      zh: '经济学、计量经济学与金融学。',
    },
    notes: [
      {
        en: 'Economists publish few, long papers and circulate working papers for years before publication. Citation counts are low relative to the natural sciences; a median h-index here is not comparable to medicine.',
        zh: '经济学者论文数量少、篇幅长，且工作论文常流传多年才正式发表。其引用量相对自然科学偏低，这里的 h 指数中位数不能与医学直接比较。',
      },
      {
        en: 'Econometric methods papers (panel data, GMM, unit roots) are the most-cited works in the field.',
        zh: '计量方法论文（面板数据、GMM、单位根检验）是本领域被引最多的作品。',
      },
    ],
  },
  {
    slug: 'earth-sciences',
    fieldId: 19,
    name: { en: 'Earth & Planetary Sciences', zh: '地球与行星科学' },
    scope: {
      en: 'Atmospheric science, oceanography, geology, geochemistry, geophysics and planetary science.',
      zh: '大气科学、海洋学、地质学、地球化学、地球物理学与行星科学。',
    },
    notes: [
      {
        en: 'Climate-model intercomparison and reanalysis datasets (CMIP, ERA) are cited by thousands of studies, lifting atmospheric scientists.',
        zh: '气候模式比较计划与再分析数据集（CMIP、ERA）被数千项研究引用，使大气科学学者整体偏高。',
      },
      {
        en: 'Field geology and paleontology have smaller communities and slower citation accumulation.',
        zh: '野外地质学与古生物学社群规模较小，引用积累也较慢。',
      },
    ],
  },
];

export const DISCIPLINE_BY_SLUG = Object.fromEntries(DISCIPLINES.map(d => [d.slug, d]));

/** Chinese names for OpenAlex subfields. Falls back to the English name. */
export const SUBFIELD_ZH: Record<string, string> = {
  'Algebra and Number Theory': '代数与数论',
  'Applied Mathematics': '应用数学',
  'Computational Mathematics': '计算数学',
  'Discrete Mathematics and Combinatorics': '离散数学与组合学',
  'Geometry and Topology': '几何与拓扑',
  'Mathematical Physics': '数学物理',
  'Modeling and Simulation': '建模与仿真',
  'Numerical Analysis': '数值分析',
  'Statistics and Probability': '统计与概率',
  'Theoretical Computer Science': '理论计算机科学',
  'Nuclear and High Energy Physics': '核物理与高能物理',
  'Atomic and Molecular Physics, and Optics': '原子分子物理与光学',
  'Astronomy and Astrophysics': '天文学与天体物理',
  'Condensed Matter Physics': '凝聚态物理',
  'Radiation': '辐射物理',
  'Statistical and Nonlinear Physics': '统计与非线性物理',
  'Instrumentation': '仪器与测量',
  'Acoustics and Ultrasonics': '声学与超声',
  'Surfaces and Interfaces': '表面与界面',
  'General Physics and Astronomy': '物理与天文学（综合）',
  'Organic Chemistry': '有机化学',
  'Inorganic Chemistry': '无机化学',
  'Analytical Chemistry': '分析化学',
  'Physical and Theoretical Chemistry': '物理与理论化学',
  'Spectroscopy': '光谱学',
  'Electrochemistry': '电化学',
  'General Chemistry': '化学（综合）',
  'Molecular Biology': '分子生物学',
  'Genetics': '遗传学',
  'Cancer Research': '癌症研究',
  'Cell Biology': '细胞生物学',
  'Biochemistry': '生物化学',
  'Biotechnology': '生物技术',
  'Biophysics': '生物物理',
  'Structural Biology': '结构生物学',
  'Endocrinology': '内分泌学',
  'Clinical Biochemistry': '临床生物化学',
  'Physiology': '生理学',
  'Aging': '衰老生物学',
  'Developmental Biology': '发育生物学',
  'Molecular Medicine': '分子医学',
  'Artificial Intelligence': '人工智能',
  'Information Systems': '信息系统',
  'Computer Vision and Pattern Recognition': '计算机视觉与模式识别',
  'Computer Networks and Communications': '计算机网络与通信',
  'Computational Theory and Mathematics': '计算理论与数学',
  'Software': '软件',
  'Hardware and Architecture': '硬件与体系结构',
  'Signal Processing': '信号处理',
  'Computer Graphics and Computer-Aided Design': '计算机图形学与辅助设计',
  'Human-Computer Interaction': '人机交互',
  'Computer Science Applications': '计算机应用',
  'Public Health, Environmental and Occupational Health': '公共卫生、环境与职业健康',
  'Surgery': '外科学',
  'Cardiology and Cardiovascular Medicine': '心脏病学与心血管医学',
  'Oncology': '肿瘤学',
  'Infectious Diseases': '感染性疾病',
  'Clinical Neurology': '临床神经病学',
  'Pulmonary and Respiratory Medicine': '呼吸医学',
  'Endocrinology, Diabetes and Metabolism': '内分泌、糖尿病与代谢',
  'Epidemiology': '流行病学',
  'Hematology': '血液学',
  'Radiology, Nuclear Medicine and Imaging': '放射学、核医学与影像',
  'Ophthalmology': '眼科学',
  'Pediatrics, Perinatology and Child Health': '儿科学与围产医学',
  'Psychiatry and Mental health': '精神病学与心理健康',
  'Orthopedics and Sports Medicine': '骨科与运动医学',
  'Gastroenterology': '消化病学',
  'Physiology (medical)': '医学生理学',
  'Dermatology': '皮肤病学',
  'Obstetrics and Gynecology': '妇产科学',
  'Nephrology': '肾脏病学',
  'Rheumatology': '风湿病学',
  'Urology': '泌尿外科学',
  'Hepatology': '肝病学',
  'Pharmacology (medical)': '医学药理学',
  'Immunology and Allergy': '免疫学与变态反应',
  'Genetics (clinical)': '临床遗传学',
  'Health Informatics': '健康信息学',
  'Critical Care and Intensive Care Medicine': '重症医学',
  'Anesthesiology and Pain Medicine': '麻醉与疼痛医学',
  'Cognitive Neuroscience': '认知神经科学',
  'Cellular and Molecular Neuroscience': '细胞与分子神经科学',
  'Neurology': '神经病学',
  'Endocrine and Autonomic Systems': '内分泌与自主神经系统',
  'Sensory Systems': '感觉系统',
  'Developmental Neuroscience': '发育神经科学',
  'Behavioral Neuroscience': '行为神经科学',
  'Biological Psychiatry': '生物精神病学',
  'Clinical Psychology': '临床心理学',
  'Developmental and Educational Psychology': '发展与教育心理学',
  'Social Psychology': '社会心理学',
  'Experimental and Cognitive Psychology': '实验与认知心理学',
  'Applied Psychology': '应用心理学',
  'General Psychology': '普通心理学',
  'Neuropsychology and Physiological Psychology': '神经心理学与生理心理学',
  'Economics and Econometrics': '经济学与计量经济学',
  'Finance': '金融学',
  'General Economics, Econometrics and Finance': '经济、计量与金融（综合）',
  'Oceanography': '海洋学',
  'Atmospheric Science': '大气科学',
  'Geochemistry and Petrology': '地球化学与岩石学',
  'Geophysics': '地球物理学',
  'Earth-Surface Processes': '地表过程',
  'Paleontology': '古生物学',
  'Geology': '地质学',
  'Space and Planetary Science': '空间与行星科学',
};

export function subfieldName(name: string | null | undefined, lang: Lang): string {
  if (!name) return lang === 'zh' ? '未分类' : 'Unclassified';
  return lang === 'zh' ? SUBFIELD_ZH[name] ?? name : name;
}

/** Country names via Intl, with a fallback to the ISO code. */
export function countryName(code: string | null | undefined, lang: Lang): string {
  if (!code) return lang === 'zh' ? '未知' : 'Unknown';
  try {
    const dn = new Intl.DisplayNames([lang === 'zh' ? 'zh-CN' : 'en'], { type: 'region' });
    return dn.of(code.toUpperCase()) ?? code;
  } catch {
    return code;
  }
}
