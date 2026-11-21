# Scholar Wizards

> 一群不平庸的研究者的人物志，以及十个学科高被引研究者的 OpenAlex 数据。

[English](./README.md) | [在线访问](https://scholarwizards.com)

Scholar Wizards 仿照 Jack Schwager 的《金融怪杰》（*Market Wizards*）系列。那套书访谈了一批顶尖交易者，发现没有两个人的做法是一样的。本站用同样的方式写研究者：他们的背景、年龄、性格、学科和方法各不相同，共同点是都不平庸。引用数是衡量这一点的一种标准，但只是其中一种。

内容规范见 [docs/concept.md](./docs/concept.md)。

## 人物志

- **人物**（`/people/<slug>`）：每人一章。开头写为什么入选，然后是生平和年表、性格与工作方式、代表作、核实过原文的引语、真实访谈、口述史和报道的链接，以及读者可以借鉴的地方。生卒年、奖项和肖像来自 Wikidata 和 Wikimedia Commons。
- **专题**（`/themes/<slug>`）：把在同一方面与众不同的人放在一起，包括少年成名、大器晚成、体制之外、跨界者、被时间证明、一个想法、按自己的规则、开路的女性、伟大的合作、华人科学家。另有"数据里的新星"一章，由 OpenAlex 数据自动挑选。
- **共同点**（`/lessons`）：全书人物身上反复出现的特点，每条都链接到最能体现它的人。对应《金融怪杰》最后的经验总结一章。

## 学科数据

学科报告不做成仪表盘，而是把每个学科写成一篇短论文。每页都有带编号和图注的图、三线表、每张图背后可展开的数据表，以及该领域里数字容易误导之处的说明。每个学者页都会说明他为什么入选：在哪份名单里、按什么规则进入、排第几。

### 学科

数学、物理学、化学、生物学、计算机科学、医学、神经科学、心理学、经济学、地球科学，各自对应 OpenAlex 中的一个领域（field）。

每个学科页列出约 100–200 位资深学者，从全领域和最大的若干子领域中抽取；另列 40 位 2012 年及以后开始发表的新锐学者。页面内容如下：

- **排行榜**：可按 h 指数、引用、m 商、2023–2025 年引用或首篇论文年份排序，也可按子领域筛选。
- **图 1　学术生涯散点**：h 指数对学术年龄，带 m = 1、2、3 参考线。资深学者为蓝色，新锐学者为橙色。
- **图 2　引用集中度**：洛伦兹曲线，标注基尼系数和前 10% 学者所占份额。
- **图 3　子领域常模**：各子领域 h 指数的四分位距与中位数。
- **图 4–5　国家与机构**。
- **图 6　引用轨迹**：被引最多的 12 位学者的逐年引用，以小多图呈现。
- **该学科专属的阅读注意事项**。

学者页内容包括：与同学科同行相比的百分位条、逐年发文与引用、主要研究主题，以及同一子领域中指标最接近的同行。

原有的计算神经科学名单（从 Marr 到当代）保留为精选合集，位于 `/collections/computational-neuroscience`，其中也包含早期职业影响力分析。

### 指标

| 指标 | 定义 |
|---|---|
| h 指数 | 最大的 h，使得有 h 篇论文各被引至少 h 次 |
| 学术年龄 A | 2026 − 首篇论文年份 + 1 |
| m 商 | h / A（Hirsch 2005） |
| 近期引用 | 2023–2025 年获得的引用 |
| 基尼系数 | 引用在该学科入选学者中的集中程度 |

**†　超大规模合作。** 平均每个活跃年份发表 40 篇以上作品的学者标记为 †。在物理学、生物学、医学、神经科学和地球科学中，至少四分之一作品作者超过 100 人的学者也标记为 †。被标记的学者保留在名单中，但默认不计入排名和汇总统计。

完整的入选规则、局限和参考文献（含莱顿宣言、DORA）见 `/methods` 页。这些指标反映的是学者在本领域内的可见度，不宜用于跨学科比较，也不应作为招聘或评审的唯一依据。

## 项目结构

```
scholar-wizards/
├── docs/concept.md                 # 内容规范：入选标准、专题、人物页结构
├── scripts/fetch_disciplines.mjs   # OpenAlex → 全部学科与合集的 JSON
├── scripts/fetch_people.mjs        # Wikidata/Commons → 生卒年、奖项、肖像
├── data/                           # 旧 CSV、计算神经科学作者 ID、API 缓存（已忽略）
└── scholar-viz/                    # Next.js 15 静态站点
    └── src/
        ├── app/                    # /、/people、/themes、/lessons、/disciplines、/field、/scholar、/methods
        ├── content/                # people/*.json（手写）、themes.ts、lessons.ts
        ├── components/             # 图表（自绘 SVG）、页面视图、排行榜
        ├── data/disciplines/       # 每个学科一个 JSON
        ├── i18n/strings.ts         # 中英文文案
        └── lib/                    # 数据访问、统计、学科注册表
```

## 快速开始

```bash
# 更新数据（Node 18+），响应缓存在 data/openalex_cache/
node scripts/fetch_disciplines.mjs              # 全部
node scripts/fetch_disciplines.mjs physics      # 单个学科
node scripts/fetch_disciplines.mjs collection   # 仅精选合集
node scripts/fetch_people.mjs                   # 人物的结构化信息（缓存在 data/wiki_cache/）
# 可选：设置 OPENALEX_API_KEY=... 以提高每日请求额度

cd scholar-viz
npm install
npm run dev        # http://localhost:3000
npm run build      # 静态导出到 scholar-viz/out
```

推送到 `main` 后，`.github/workflows/deploy-pages.yml` 会自动部署到 Cloudflare Pages。

## 数据来源

[OpenAlex](https://openalex.org/)（CC0）。作者消歧并不完美，档案被错误合并或拆分时，个人的数字可能偏高或偏低。

人物的结构化信息来自 [Wikidata](https://www.wikidata.org/)（CC0），肖像来自 [Wikimedia Commons](https://commons.wikimedia.org/)，每页都注明作者和许可。访谈和报道都链接到原发布方，不是 Scholar Wizards 做的。

## 许可

MIT
