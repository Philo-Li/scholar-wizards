# Scholar Wizards

> Portraits of researchers who were not ordinary, plus OpenAlex data on the most cited researchers in ten disciplines.

[中文文档](./README.zh-CN.md) | [Live site](https://scholarwizards.com)

Scholar Wizards is modelled on Jack Schwager's *Market Wizards*, a series of books that interviewed exceptional traders and found that no two of them worked the same way. This site does the same for researchers. They differ in background, age, temperament, discipline and method. What they share is that none of them was ordinary. Citations are one way to measure that, and only one.

The editorial spec is [docs/concept.md](./docs/concept.md) (in Chinese).

## The book

- **People** (`/people/<slug>`): one chapter per person. It opens with why the person was chosen, then gives their life with a timeline, their character and way of working, key works, verified quotes, links to real interviews, oral histories and coverage, and what a reader can take from them. Dates, prizes and portraits come from Wikidata and Wikimedia Commons.
- **Chapters** (`/themes/<slug>`): groups of people who were unusual in the same way: early starters, late bloomers, outsiders, people who worked across fields, people proven right by time, single ideas that changed a field, people who worked on their own terms, women who opened the way, partnerships, and Chinese scientists. One more chapter, rising in the data, is chosen automatically from the OpenAlex data.
- **Lessons** (`/lessons`): traits that recur across the book, each linked to the people who show them. This follows the closing "lessons" chapter in *Market Wizards*.

## The data

The discipline reports read like short papers rather than dashboards. Every page has numbered figures with captions, booktabs tables, a data-table view behind each chart, and notes on where the numbers mislead in that field. Every scholar page says why the scholar is listed: which list they are on, the rule that put them there, and where they rank.

### Disciplines

Mathematics, Physics, Chemistry, Biology, Computer Science, Medicine, Neuroscience, Psychology, Economics, and Earth Sciences. Each uses the corresponding OpenAlex field.

Each discipline page lists about 100–200 established scholars, sampled from the whole field and from its largest subfields, plus 40 rising scholars who started publishing in 2012 or later. It also contains:

- **Leaderboard**: sort by h-index, citations, m-quotient, citations from 2023–2025, or first-paper year; filter by subfield.
- **Fig. 1, career scatter**: h-index against academic age, with m = 1, 2 and 3 reference lines. Established scholars are shown in blue and rising scholars in orange.
- **Fig. 2, concentration of citations**: a Lorenz curve with the Gini coefficient and the share held by the top 10%.
- **Fig. 3, subfield norms**: interquartile range and median of h for each subfield.
- **Figs. 4–5, countries and institutions**.
- **Fig. 6, trajectories**: citations per year for the 12 most cited scholars, shown as small multiples.
- **Field-specific reading notes**.

Scholar pages show percentile strips against peers in the same discipline, works and citations per year, main topics, and the nearest peers in the same subfield.

The original computational neuroscience list, which runs from Marr to the current generation, is kept as a curated collection at `/collections/computational-neuroscience`. It also includes the early-career impact analysis.

### Indicators

| Indicator | Definition |
|---|---|
| h-index | the largest h such that h papers have at least h citations each |
| Academic age A | 2026 − first-paper year + 1 |
| m-quotient | h / A (Hirsch 2005) |
| Recent citations | citations received in 2023–2025 |
| Gini | concentration of citations across a field's listed scholars |

**†, hyper-authorship.** A scholar is marked † if they average 40 or more works per active year. In physics, biology, medicine, neuroscience and earth sciences, a scholar is also marked † if at least a quarter of their works list more than 100 authors. Marked scholars stay in the lists, but they are excluded from rankings and summary statistics by default.

The `/methods` page gives the full selection rules, limitations and references, including the Leiden Manifesto and DORA. These indicators describe visibility within a field. Do not use them to compare fields, or as the sole basis for hiring and evaluation.

## Project structure

```
scholar-wizards/
├── docs/concept.md                 # editorial spec: selection, chapters, person pages
├── scripts/fetch_disciplines.mjs   # OpenAlex → JSON for all disciplines + collection
├── scripts/fetch_people.mjs        # Wikidata/Commons → dates, prizes, portraits
├── data/                           # legacy CSVs, comp-neuro author ids, API cache (ignored)
└── scholar-viz/                    # Next.js 15 static site
    └── src/
        ├── app/                    # /, /people, /themes, /lessons, /disciplines, /field, /scholar, /methods
        ├── content/                # people/*.json (hand-written), themes.ts, lessons.ts
        ├── components/             # charts (custom SVG), views, leaderboard
        ├── data/disciplines/       # one JSON per discipline
        ├── i18n/strings.ts         # English and Chinese strings
        └── lib/                    # data access, statistics, discipline registry
```

## Getting started

```bash
# Refresh data (Node 18+). Responses are cached in data/openalex_cache/.
node scripts/fetch_disciplines.mjs              # everything
node scripts/fetch_disciplines.mjs physics      # one discipline
node scripts/fetch_disciplines.mjs collection   # curated collection only
node scripts/fetch_people.mjs                   # facts for the person files (cache: data/wiki_cache/)
# Optional: OPENALEX_API_KEY=... raises the daily request budget.

cd scholar-viz
npm install
npm run dev        # http://localhost:3000
npm run build      # static export to scholar-viz/out
```

Pushes to `main` deploy to Cloudflare Pages through `.github/workflows/deploy-pages.yml`.

## Data source

[OpenAlex](https://openalex.org/) (CC0). Author disambiguation is imperfect. Merged or split profiles can inflate or deflate any individual's numbers.

Person facts come from [Wikidata](https://www.wikidata.org/) (CC0) and portraits from [Wikimedia Commons](https://commons.wikimedia.org/), credited on each page. Interviews and coverage are links to their original publishers; Scholar Wizards did not conduct them.

## License

MIT
