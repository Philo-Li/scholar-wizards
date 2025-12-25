# Scholar Wizards Atlas

> Multi-metric scholar analytics & field maps — powered by OpenAlex.

[中文文档](./README.zh-CN.md) | [Live Demo](https://scholarwizards.com)

**Scholar Wizards Atlas** is an "academic field influence dashboard" that provides multi-dimensional scholar ranking matrices, distribution statistics, institutional & geographic maps, research direction clustering, and "early career / rising star" trajectory analysis for any discipline or tag.

- Data Source: OpenAlex (extensible to other sources)
- Positioning: **Like Market Wizards**, but instead of interviews, we visualize "Academic Wizards" through data

---

## Features

### 1) Multi-Metric Ranking Matrix
- Compare multiple metrics side-by-side (Total Citations / H-index / 2Yr / Efficiency / M-index / Pubs / i10)
- Support sorting, Top N filtering, color quantiles (Top 5% / 10% / 25% / 50%)
- Customizable composite score weights (adaptable to different evaluation goals: historical standing / current momentum / early potential)

### 2) Overview & Distributions
- Overview statistics for citations, h-index, publication count (mean/median/max)
- Distribution histograms (citation / h-index etc.)

### 3) Relationship Analysis
- Citations vs H-index scatter plot (supports coloring by research category)
- Useful for discovering outliers: tool papers, review-type authors, cross-disciplinary "citation amplifiers"

### 4) Geographic & Institutional Map
- Country/region distribution
- Top Institutions (aggregated by institution/organization)

### 5) Research Categories
- Field/direction proportions (pie chart + list)
- Supports multiple co-existing directions (AI×Neuro and other cross-disciplinary tags)

### 6) Early Career & Rising Stars
- Early Career Impact: cumulative citations in first N years, Early% (early citations as percentage of career total)
- Youngest / Rising Stars: potential rankings filtered by academic age (first publication year)
- Citations per Academic Year, Academic Age vs H-index charts

### 7) Narrative Insights (Optional)
- Auto-generated "insight cards": Power law, geographic concentration, cross-disciplinary trends, one-hit vs sustained, etc.

---

## Metrics (Default Definitions)

> Metrics are not "truth", just signals from different perspectives. Recommend viewing long-term + recent + normalized metrics together.

- **Total Citations**: Career cumulative impact (tends to favor reviews/tools/cross-disciplinary)
- **H-index**: Comprehensive impact of sustained output (strongly dependent on seniority)
- **2Yr**: Recent 2-year momentum (reflects current activity/frontier relevance)
- **Efficiency (Eff)**: Impact/output efficiency (identifies "few but excellent")
- **Academic Age**: Academic age = Current year - First publication year (proxy variable)
- **M-index**: H-index / Academic Age (fairer comparison across different seniority levels)
- **Pubs / i10**: Auxiliary explanatory items (usually lower information gain)

> **Disclaimer**: This project is for exploration and visualization purposes. It should not be used as the sole decision-making basis (for high-stakes scenarios like hiring/promotion/review, please combine with peer review and the academic contributions themselves).

---

## Project Structure

```
scholar-wizards/
├── scripts/           # Python data fetching scripts
│   ├── fetch_comp_neuro_scholars.py
│   ├── google_scholar_data.py
│   ├── early_career_citations.py
│   └── fetch_scholar_details.py
├── data/              # Raw CSV data files
├── docs/              # Analysis documents
└── scholar-viz/       # Next.js frontend application
    └── src/
        ├── app/       # Next.js app router
        ├── components/
        └── data/      # JSON data for frontend
```

---

## Quick Start

### 1) Install Dependencies

```bash
# Frontend
cd scholar-viz
npm install

# Python scripts
pip install requests pandas
```

### 2) Fetch Data

```bash
cd scripts
python fetch_comp_neuro_scholars.py    # Fetch scholars from OpenAlex
python early_career_citations.py       # Analyze early career impact
python fetch_scholar_details.py        # Fetch detailed profiles
```

### 3) Run Development Server

```bash
cd scholar-viz
npm run dev
```

Visit: `http://localhost:3000`

---

## Data Pipeline

The project is typically divided into three layers:

1. **Fetch**: Pull raw data from OpenAlex (authors/works/institutions)
2. **Enrich**: Calculate metrics, categories, academic age, 2yr momentum, efficiency, etc.
3. **Serve**: Frontend visualization + optional caching (JSON / Redis / DB)

---

## Configuration

### Weight Configuration (Example)

You can make "composite score perspectives" configurable via JSON:

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

## Roadmap / TODO

- [ ] Author disambiguation enhancement: same-name merge/split prompts
- [ ] More robust field classification: hybrid strategy based on concepts / topics / venue
- [ ] Custom time windows: 2yr → 1/3/5 year switchable
- [ ] Personal pages: representative works, time-series citations, collaboration networks
- [ ] Export reports: PDF / PNG / shareable link

---

## Contributing

PRs and Issues are welcome!

Suggested contribution workflow:

1. Fork this repository
2. Create a branch: `feat/xxx` or `fix/xxx`
3. Before committing, run:
   ```bash
   npm run lint
   npm run build
   ```
4. Submit PR with description of changes and screenshots (if UI-related)

---

## Ethics & Responsible Use

- Metrics inherently have biases (disciplinary differences, collaboration scale, review/tool amplification effects, etc.)
- This project **does not encourage** using rankings as the sole evaluation criterion
- Recommend UI to continuously display: metric explanations, limitation notes, and "contribution type" labels (method/tool/theory/experiment/review)

---

## Data Sources

- [OpenAlex](https://openalex.org/) — Open scholarly metadata
- Google Scholar — Citation counts and rankings

---

## License

MIT

---

## Acknowledgements

- OpenAlex — open scholarly metadata
- Inspiration: the "Wizards" framing from the trading world (Market Wizards)

---

## Contact

- Demo: [scholarwizards.com](https://scholarwizards.com)
- Issues: Welcome to submit feature requests and bug reports
