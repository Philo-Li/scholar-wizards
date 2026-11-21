// Editorial themes ("专题"). Each groups people who are unusual in the same way.
// See docs/concept.md, section 4. People opt into a theme in their own JSON file;
// the "rising" theme is filled from the OpenAlex data instead.

import type { Bi } from '@/lib/people-types';

export interface Theme {
  slug: string;
  title: Bi;
  /** One line that says what the people in this theme have in common. */
  tagline: Bi;
  intro: Bi[];
  /** Who qualifies, stated as a rule. */
  criteria: Bi;
  /** What the theme's figure shows, in one sentence for its caption. */
  figureNote: Bi;
}

export const THEMES: Theme[] = [
  {
    slug: 'early',
    title: { en: 'Early starters', zh: '少年成名' },
    tagline: {
      en: 'They did the work they are remembered for before most people finish a doctorate.',
      zh: '大多数人还没读完博士，他们已经做出了让后人记住的工作。',
    },
    intro: [
      {
        en: 'Galois wrote down the theory that now carries his name before he was twenty. Lawrence Bragg worked out the law of X-ray diffraction as a 22-year-old research student and shared a Nobel Prize at 25. Early work like this is rarer than the stories suggest, and it usually rests on years of unusual preparation.',
        zh: '伽罗瓦不到二十岁就写下了后来以他命名的理论。劳伦斯·布拉格二十二岁读研究生时推出了 X 射线衍射定律，二十五岁分享了诺贝尔奖。这样早的成就其实比传说中少见，背后通常是多年不寻常的积累。',
      },
      {
        en: 'What these people share is less raw speed than an early, firm sense of which problem was worth their time.',
        zh: '这些人的共同点与其说是快，不如说是很早就清楚哪个问题值得花时间。',
      },
    ],
    criteria: {
      en: 'The contribution they are best known for was done by about age 25.',
      zh: '最为人所知的成果在 25 岁左右或更早做出。',
    },
    figureNote: {
      en: 'Most of the dots sit far to the left of the age at which researchers typically do their best-known work, which studies put around the late thirties.',
      zh: '研究者通常在三十多岁后段做出最为人所知的工作，而这里的点大多远远落在它的左边。',
    },
  },
  {
    slug: 'late',
    title: { en: 'Late bloomers', zh: '大器晚成' },
    tagline: {
      en: 'Their defining work came after fifty, or the recognition came decades after the work.',
      zh: '代表作在五十岁以后才出现，或者成果做出几十年后才被承认。',
    },
    intro: [
      {
        en: 'Yitang Zhang was 58 and working as a lecturer without tenure when he proved bounded gaps between primes. John Fenn was pushed into retirement at 70 and kept developing the electrospray method that won him a Nobel Prize at 85. Science has a reputation as a young person’s game, and the people in this chapter are the counter-evidence.',
        zh: '张益唐证明素数间隔有界时已经 58 岁，还是一名没有终身教职的讲师。约翰·芬恩 70 岁被迫退休，之后继续完善电喷雾电离方法，85 岁凭它获得诺贝尔奖。科学常被说成是年轻人的游戏，这一章里的人就是反例。',
      },
      {
        en: 'Some of them were slow to start. Others were quick but had to wait for the field to catch up. The figure separates the two: the dot is the work, the ring is the prize.',
        zh: '他们有的是起步晚，有的是做得早但要等学界追上来。图里把两者分开：实心点是成果，空心圈是获奖。',
      },
    ],
    criteria: {
      en: 'The key work came after about age 50, or the major recognition came 25 or more years after the work.',
      zh: '代表作在 50 岁左右或以后做出，或者重大承认比成果晚 25 年以上。',
    },
    figureNote: {
      en: 'Long lines mean a long wait between the work and the prize.',
      zh: '线越长，成果和获奖之间等得越久。',
    },
  },
  {
    slug: 'outsiders',
    title: { en: 'Outside the system', zh: '体制之外' },
    tagline: {
      en: 'No degree, the wrong degree, or no university post when it mattered.',
      zh: '没有学位，学的不是这一行，或者在关键时刻不在大学里。',
    },
    intro: [
      {
        en: 'Faraday left school at thirteen and learned science from the books he was binding. Ramanujan was a shipping clerk in Madras when he wrote to Hardy. June Huh dropped out of high school to write poetry and came to mathematics in his twenties. Each of them got into the conversation without the usual credentials.',
        zh: '法拉第十三岁辍学，从自己装订的书里学会了科学。拉马努金给哈代写信时，是马德拉斯港务局的一名职员。许埈珥高中退学去写诗，二十多岁才转向数学。他们都没有常规的资历，却进入了一流学者的圈子。',
      },
      {
        en: 'Their stories are less about overcoming the system than about finding the one person or the one result that made the system take notice.',
        zh: '这些故事的重点不在于对抗体制，而在于他们怎样找到了那一个人、那一个结果，让体制注意到自己。',
      },
    ],
    criteria: {
      en: 'Self-taught, career changers, people without a degree, or people working outside universities when they did their key work.',
      zh: '自学成才、中途转行、没有学位，或者做出代表作时不在大学里工作。',
    },
    figureNote: {
      en: 'Ages at key work spread across the whole range: there is no single late or early pattern for outsiders.',
      zh: '代表作的年龄分布很散：体制外的人没有统一的早晚规律。',
    },
  },
  {
    slug: 'polymaths',
    title: { en: 'Across fields', zh: '跨界者' },
    tagline: {
      en: 'First-rate work in more than one discipline.',
      zh: '在不止一个学科里做出一流工作。',
    },
    intro: [
      {
        en: 'Herbert Simon won the Turing Award and the Nobel Prize in economics, and is counted among the founders of cognitive psychology. Von Neumann did foundational work in set theory, quantum mechanics, game theory and computing. Crick moved from physics to molecular biology to the study of consciousness.',
        zh: '司马贺拿过图灵奖和诺贝尔经济学奖，同时还是认知心理学的奠基人之一。冯·诺伊曼在集合论、量子力学、博弈论和计算机上都做了奠基工作。克里克从物理转到分子生物学，晚年又去研究意识。',
      },
      {
        en: 'They rarely switched fields for the sake of variety. Usually a tool from one field opened a question in another.',
        zh: '他们很少是为了新鲜而换领域。通常是一个领域的工具，打开了另一个领域的问题。',
      },
    ],
    criteria: {
      en: 'Recognised contributions in two or more of the ten disciplines, or in a discipline and a separate field such as finance or engineering.',
      zh: '在十个学科中的两个以上、或者在一个学科和金融、工程等另一个领域都有公认的贡献。',
    },
    figureNote: {
      en: 'Rows show the age at the work each person is best known for, which is often not the field they started in.',
      zh: '每一行标出最为人所知的成果的年龄，那往往不是他们起步的领域。',
    },
  },
  {
    slug: 'vindicated',
    title: { en: 'Proven right by time', zh: '被时间证明' },
    tagline: {
      en: 'Dismissed or ignored at first, and later shown to be right.',
      zh: '一开始被否定或忽视，后来被证明是对的。',
    },
    intro: [
      {
        en: 'Wegener’s continental drift was ridiculed for decades. McClintock stopped publishing her work on jumping genes because no one understood it, and won a Nobel Prize three decades later. Shechtman was asked to leave his research group over quasicrystals. Karikó was demoted while she worked on modified mRNA.',
        zh: '魏格纳的大陆漂移说被嘲笑了几十年。麦克林托克因为没人看懂她关于跳跃基因的研究，一度不再发表，三十年后获得诺贝尔奖。谢赫特曼因为准晶体被要求离开研究组。卡里科研究修饰 mRNA 期间被降职。',
      },
      {
        en: 'Being rejected is not evidence of being right. What these people had was evidence, and the patience to keep producing it.',
        zh: '被拒绝并不能证明自己是对的。这些人手里有的是证据，以及持续拿出证据的耐心。',
      },
    ],
    criteria: {
      en: 'The key work was rejected, ridiculed or ignored by the field for years before it was accepted.',
      zh: '代表作在被接受之前，曾被学界拒绝、嘲笑或忽视多年。',
    },
    figureNote: {
      en: 'The gap between dot and ring is the time the field took to accept the work.',
      zh: '点和圈之间的距离，就是学界接受这项工作所用的时间。',
    },
  },
  {
    slug: 'one-idea',
    title: { en: 'One idea', zh: '一个想法' },
    tagline: {
      en: 'A single paper or idea that reorganised a field.',
      zh: '一篇论文或一个想法，重组了整个领域。',
    },
    intro: [
      {
        en: 'Shannon’s 1948 paper created information theory more or less complete. Nash’s doctoral thesis was 28 pages long. Turing wrote “On computable numbers” to settle a question in logic and defined the modern computer along the way.',
        zh: '香农 1948 年的论文几乎一次就建立了完整的信息论。纳什的博士论文只有 28 页。图灵写《论可计算数》本来是为了回答一个逻辑问题，顺带定义了现代计算机。',
      },
      {
        en: 'These are not people who had only one idea. They are people who saw one idea all the way through, until it was simple enough for everyone else to use.',
        zh: '这些人并不是只有一个想法，而是把一个想法彻底想清楚，直到它简单到别人都能拿去用。',
      },
    ],
    criteria: {
      en: 'One paper, thesis or result that defined or redefined a field.',
      zh: '一篇论文、一篇学位论文或一个结果，开创或重新定义了一个领域。',
    },
    figureNote: {
      en: 'Many of these ideas came in the person’s twenties or early thirties.',
      zh: '这些想法很多出现在二十多岁到三十出头。',
    },
  },
  {
    slug: 'own-terms',
    title: { en: 'On their own terms', zh: '按自己的规则' },
    tagline: {
      en: 'They refused prizes, left academia, or worked strictly by their own rules.',
      zh: '拒绝奖项，离开学界，或者只按自己的规则做事。',
    },
    intro: [
      {
        en: 'Perelman declined the Fields Medal and the million-dollar Clay prize. Grothendieck left the institute he helped build and spent his last decades in a village in the Pyrenees. Erdős had no home and no job for most of his life, and wrote some 1,500 papers with more than 500 coauthors. Knuth gave up email in 1990.',
        zh: '佩雷尔曼拒绝了菲尔兹奖和一百万美元的克雷奖。格罗滕迪克离开了自己参与创建的研究所，最后几十年隐居在比利牛斯山区的村子里。埃尔德什大半生没有房子也没有工作，却和五百多位合作者写了约 1500 篇论文。高德纳 1990 年起不再用电子邮件。',
      },
      {
        en: 'Their choices look eccentric from outside. From inside, each one protected the conditions in which they did their best work.',
        zh: '从外面看，这些选择很古怪。从他们自己的角度看，每个选择都是为了守住自己能做出最好工作的条件。',
      },
    ],
    criteria: {
      en: 'Notable refusals of prizes or posts, withdrawal from academic life, or working habits far outside the norm.',
      zh: '有拒绝奖项或职位、退出学术生活，或者工作方式远离常规的明确记录。',
    },
    figureNote: {
      en: 'Missing rings are often deliberate: some of these people declined the prizes.',
      zh: '有些人没有空心圈，是因为他们主动拒绝了奖项。',
    },
  },
  {
    slug: 'women',
    title: { en: 'Women who opened the way', zh: '开路的女性' },
    tagline: {
      en: 'First-rate work when there was almost no room for women in science.',
      zh: '在几乎没有女性位置的年代做出一流工作。',
    },
    intro: [
      {
        en: 'Emmy Noether lectured at Göttingen for years under Hilbert’s name because women could not hold the post. Meitner did her early work in a converted woodshop because women were not allowed in the main laboratory. Marie Tharp was not allowed on research ships, so she mapped the ocean floor from other people’s soundings.',
        zh: '诺特在哥廷根讲了好几年课，课表上挂的是希尔伯特的名字，因为女性不能担任讲师。迈特纳早年在一间改造过的木工房里做实验，因为女性不准进入主实验室。玛丽·撒普不准上科考船，就用别人测回来的数据画出了海底地图。',
      },
      {
        en: 'This chapter is not a list of firsts. Each person here is in the book for the science; the obstacles explain why the science is even more remarkable.',
        zh: '这一章不是"第一位女性"的清单。每个人入选都是因为科学成就本身，她们遇到的障碍只是让这些成就更加难得。',
      },
    ],
    criteria: {
      en: 'Women whose key work would earn a place in this book on its own, done when their field offered women little or no standing.',
      zh: '代表作本身就足以入选本书，而且是在本领域几乎不给女性地位的时候做出的。',
    },
    figureNote: {
      en: 'Several careers here have long gaps between the work and any recognition.',
      zh: '这里不少人的成果和承认之间隔了很久。',
    },
  },
  {
    slug: 'partnerships',
    title: { en: 'Partnerships', zh: '伟大的合作' },
    tagline: {
      en: 'Work that came out of two minds, not one.',
      zh: '出自两个人，而不是一个人的工作。',
    },
    intro: [
      {
        en: 'Kahneman and Tversky worked so closely that they flipped a coin to decide whose name went first. Hubel and Wiesel recorded from the visual cortex together for more than twenty years. Hardy said that his discovery of Ramanujan was the one romantic incident in his life.',
        zh: '卡尼曼和特沃斯基合作得密不可分，论文署名谁在前要靠抛硬币决定。休伯尔和威泽尔一起在视觉皮层上做了二十多年记录。哈代说，发现拉马努金是他一生中唯一一件浪漫的事。',
      },
      {
        en: 'The romantic image of science is a lone genius. Much of the best science in this book was a conversation.',
        zh: '人们心中的科学家常常是孤独的天才。可这本书里最好的科学，很多是两个人谈出来的。',
      },
    ],
    criteria: {
      en: 'The key work was done as a pair or a very small team, and the partnership itself is part of the story.',
      zh: '代表作由两人或很小的团队完成，而且合作本身就是故事的一部分。',
    },
    figureNote: {
      en: 'Partners often did their key work at very different ages.',
      zh: '合作者做出代表作时的年龄往往相差很大。',
    },
  },
  {
    slug: 'chinese',
    title: { en: 'Chinese scientists', zh: '华人科学家' },
    tagline: {
      en: 'Chinese-heritage researchers whose paths were as varied as their fields.',
      zh: '道路和学科一样各不相同的华人科研者。',
    },
    intro: [
      {
        en: 'Hua Luogeng left school after junior middle school and taught himself mathematics while working in his father’s shop. Tu Youyou had no doctorate, no study abroad and no academy membership when she won the Nobel Prize. Chien-Shiung Wu designed the experiment that overturned parity conservation. Terence Tao took the International Mathematical Olympiad gold medal at 13.',
        zh: '华罗庚初中毕业后就离开了学校，一边在父亲的杂货铺帮工，一边自学数学。屠呦呦获得诺贝尔奖时没有博士学位、没有留学经历，也不是院士。吴健雄设计的实验推翻了宇称守恒。陶哲轩 13 岁获得国际数学奥林匹克金牌。',
      },
      {
        en: 'They span a century and several countries, and they belong in most of the other chapters too.',
        zh: '他们跨越一个世纪、好几个国家，也几乎都能出现在本书的其他章节里。',
      },
    ],
    criteria: {
      en: 'Chinese-heritage scientists whose work also meets one of the book’s other selection reasons.',
      zh: '华人科学家，且其工作同时满足本书的其他入选理由之一。',
    },
    figureNote: {
      en: 'Ages at key work range from the twenties to the late fifties.',
      zh: '代表作的年龄从二十多岁一直延伸到快六十岁。',
    },
  },
];

export const RISING_THEME: Theme = {
  slug: 'rising',
  title: { en: 'Rising in the data', zh: '数据里的新星' },
  tagline: {
    en: 'Young researchers whose citation curves are rising unusually fast.',
    zh: '引用曲线异常陡峭的年轻研究者。',
  },
  intro: [
    {
      en: 'Every other chapter is written by hand. This one is chosen by the data: in each discipline, the rising scholars (first paper in 2012 or later) with the highest m-quotient, which is the h-index divided by years since the first paper.',
      zh: '其他章节都是人工挑选的，只有这一章由数据挑选：在每个学科的新锐学者（首篇论文发表于 2012 年及以后）中，选出 m 商最高的人。m 商是 h 指数除以发表首篇论文以来的年数。',
    },
    {
      en: 'A steep curve this early does not guarantee a place in the other chapters. It is one signal, worth reading alongside the work itself.',
      zh: '这么早就有陡峭的曲线，并不保证将来能进入其他章节。它只是一个信号，应该和工作本身一起看。',
    },
  ],
  criteria: {
    en: 'Top three m-quotients among each discipline’s rising scholars, excluding hyper-authorship (†) profiles and anyone with fewer than five years since their first paper.',
    zh: '每个学科新锐学者中 m 商排名前三，不含超大规模合作（†）的学者，也不含首篇论文至今不足五年的人。',
  },
  figureNote: { en: '', zh: '' },
};

export const ALL_THEMES = [...THEMES, RISING_THEME];
export const THEME_BY_SLUG: Record<string, Theme> = Object.fromEntries(ALL_THEMES.map(t => [t.slug, t]));

/** Selection reasons, concept.md section 3. */
export const REASONS: Record<string, Bi & { note: Bi }> = {
  pioneer: { en: 'Pioneer', zh: '开创', note: { en: 'Started a field, method or paradigm.', zh: '提出了新领域、新方法或新范式。' } },
  path: { en: 'Unusual path', zh: '非常规路径', note: { en: 'Did not follow the usual degree or career route.', zh: '没有走常规的学历或职位路线。' } },
  timing: { en: 'Timing', zh: '时间', note: { en: 'Very early or very late work, or recognised long after.', zh: '极早或极晚做出代表作，或成果很久之后才被承认。' } },
  crossing: { en: 'Across fields', zh: '跨界', note: { en: 'First-rate work in more than one field.', zh: '在两个以上领域有一流贡献。' } },
  integrity: { en: 'Integrity', zh: '风骨', note: { en: 'Held to their own way against prizes, institutions or pressure.', zh: '在名利、体制或压力面前坚持自己的做法。' } },
  opening: { en: 'Opening the way', zh: '开路', note: { en: 'Broke ground where few like them had a place.', zh: '在少有同类的环境里打开局面。' } },
  data: { en: 'In the data', zh: '数据', note: { en: 'At the top of their discipline by citations, h-index or m-quotient.', zh: '引用、h 指数或 m 商处于本学科顶端。' } },
};
