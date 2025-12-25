# Scholar Wizards Atlas

> 多维度学者分析与领域地图 — 基于 OpenAlex 数据驱动。

[English](./README.md) | [在线演示](https://scholarwizards.com)

**Scholar Wizards Atlas** 是一个"学术领域影响力全景仪表盘"，面向任意学科/标签，提供多维指标的学者排名矩阵、分布统计、机构与地域版图、研究方向聚类，以及"早期爆发 / 新星"视角的职业轨迹分析。

- 数据源：OpenAlex（可扩展为其他来源）
- 定位：**像 Market Wizards 一样**，但不是采访，而是用数据把"学术 Wizards"可视化出来

---

## 功能特性

### 1) 多指标排名矩阵
- 同屏对比多个指标（例如 Total Citations / H-index / 2Yr / Efficiency / M-index / Pubs / i10）
- 支持排序、Top N 过滤、颜色分位（Top 5% / 10% / 25% / 50%）
- 支持自定义综合评分权重（适配不同评估目标：历史地位 / 当前动量 / 早期潜力）

### 2) 概览与分布
- 引用量、h-index、发表量等概览统计（均值/中位数/最大值）
- 分布直方图（citation / h-index 等）

### 3) 关系分析
- Citations vs H-index 散点图（支持按研究类别着色）
- 可用于发现异常点：工具型论文、综述型作者、跨领域"引用放大器"

### 4) 地理与机构版图
- 国家/地区分布
- Top Institutions（机构/单位聚合）

### 5) 研究方向分类
- 领域/方向占比（饼图 + 列表）
- 支持多个方向并存（AI×Neuro 等交叉标签）

### 6) 早期职业与新星
- Early Career Impact：职业前 N 年累计引用、Early%（早期引用占职业总引用比例）
- Youngest / Rising Stars：按学术年龄（首篇论文年份）筛选的潜力榜单
- Citations per Academic Year、Academic Age vs H-index 等图表

### 7) 洞察卡片（可选）
- 自动生成"洞察卡片"：Power law、地域集中度、跨学科趋势、one-hit vs sustained 等

---

## 指标说明（默认口径）

> 指标不是"真理"，只是不同侧面的信号。建议同时看长期 + 近期 + 归一化指标。

- **Total Citations**：职业累计影响力（易偏向综述/工具/跨领域）
- **H-index**：持续产出的综合影响力（强依赖资历）
- **2Yr**：近 2 年动量（反映当前活跃度/前沿度）
- **Efficiency (Eff)**：影响力/产出效率（识别"少而精"）
- **Academic Age**：学术年龄 = 当前年 - 首篇论文年（代理变量）
- **M-index**：H-index / Academic Age（更公平比较不同资历）
- **Pubs / i10**：辅助解释项（通常信息增量较小）

> **免责声明**：此项目用于探索与可视化，不应作为唯一决策依据（招聘/晋升/评审等高风险场景请结合同行评议与学术贡献本身）。

---

## 项目结构

```
scholar-wizards/
├── scripts/           # Python 数据获取脚本
│   ├── fetch_comp_neuro_scholars.py
│   ├── google_scholar_data.py
│   ├── early_career_citations.py
│   └── fetch_scholar_details.py
├── data/              # CSV 原始数据
├── docs/              # 分析文档
└── scholar-viz/       # Next.js 前端应用
    └── src/
        ├── app/       # Next.js app router
        ├── components/
        └── data/      # 前端 JSON 数据
```

---

## 快速开始

### 1) 安装依赖

```bash
# 前端
cd scholar-viz
npm install

# Python 脚本
pip install requests pandas
```

### 2) 获取数据

```bash
cd scripts
python fetch_comp_neuro_scholars.py    # 从 OpenAlex 获取学者
python early_career_citations.py       # 分析早期职业影响
python fetch_scholar_details.py        # 获取详细资料
```

### 3) 运行开发环境

```bash
cd scholar-viz
npm run dev
```

访问：`http://localhost:3000`

---

## 数据管线

项目通常分三层：

1. **Fetch**：从 OpenAlex 拉取作者/作品/机构等原始数据
2. **Enrich**：计算指标、分类、学术年龄、2yr 动量、效率等
3. **Serve**：前端可视化 + 可选缓存（JSON / Redis / DB）

---

## 配置

### 权重配置（示例）

你可以把"综合评分视角"做成可配置的 JSON，例如：

```json
{
  "stature_balanced": {
    "h_index": 0.40,
    "two_year": 0.35,
    "efficiency": 0.15,
    "citations": 0.10
  },
  "mentor_hiring_mode": {
    "two_year": 0.50,
    "m_index": 0.25,
    "efficiency": 0.20,
    "citations": 0.05
  }
}
```

---

## 路线图 / TODO

- [ ] 作者消歧增强：同名合并/拆分提示
- [ ] 更稳健的领域分类：基于 concepts / topics / venue 的混合策略
- [ ] 自定义时间窗：2yr → 1/3/5 年可切换
- [ ] 个人页：代表作、时间序列引用、合作网络
- [ ] 导出报告：PDF / PNG / shareable link

---

## 贡献指南

欢迎 PR / Issue！

建议的贡献流程：

1. Fork 本仓库
2. 创建分支：`feat/xxx` or `fix/xxx`
3. 提交前运行：
   ```bash
   npm run lint
   npm run build
   ```
4. 提交 PR，说明改动、截图（若有 UI）

---

## 伦理与负责任使用

- 指标天然有偏差（学科差异、合作规模、综述/工具放大效应等）
- 本项目**不鼓励**将排名作为单一评价标准
- 建议 UI 中持续展示：指标解释、局限性提示、以及"贡献类型"标签（方法/工具/理论/实验/综述）

---

## 数据来源

- [OpenAlex](https://openalex.org/) — 开放学术元数据
- Google Scholar — 引用量与排名

---

## 许可证

MIT

---

## 致谢

- OpenAlex — 开放学术元数据
- 灵感来源：交易界的 "Wizards" 概念（Market Wizards）

---

## 联系方式

- 演示：[scholarwizards.com](https://scholarwizards.com)
- Issues：欢迎提需求与 bug 报告
