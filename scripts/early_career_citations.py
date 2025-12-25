#!/usr/bin/env python3
"""
Early Career Citations Analysis

Analyze first 5 years citations for computational neuroscience scholars
to evaluate early academic impact.
"""

import requests
import pandas as pd
import time
from datetime import datetime

OPENALEX_BASE = "https://api.openalex.org"
EMAIL = "researcher@example.com"


def get_author_first_year(author_id, email=None):
    """Get author's first publication year."""
    author_short_id = author_id.split("/")[-1]
    url = f"{OPENALEX_BASE}/works"
    params = {
        "filter": f"author.id:{author_short_id}",
        "sort": "publication_year:asc",
        "per_page": 1,
    }
    if email:
        params["mailto"] = email

    try:
        resp = requests.get(url, params=params, timeout=15)
        if resp.status_code == 200:
            data = resp.json()
            results = data.get("results", [])
            if results:
                return results[0].get("publication_year")
    except Exception as e:
        print(f"  Error fetching first pub year: {e}")
    return None


def get_early_career_citations(author_id, first_year, years=5, email=None):
    """Get total citations for papers published in first N years."""
    if not first_year:
        return None, 0, []

    author_short_id = author_id.split("/")[-1]
    end_year = first_year + years - 1

    url = f"{OPENALEX_BASE}/works"
    params = {
        "filter": f"author.id:{author_short_id},publication_year:{first_year}-{end_year}",
        "per_page": 200,
    }
    if email:
        params["mailto"] = email

    total_citations = 0
    works_count = 0
    top_papers = []

    try:
        resp = requests.get(url, params=params, timeout=15)
        if resp.status_code == 200:
            data = resp.json()
            results = data.get("results", [])
            works_count = len(results)

            for work in results:
                cited = work.get("cited_by_count", 0)
                total_citations += cited
                top_papers.append({
                    "title": work.get("title", ""),
                    "year": work.get("publication_year"),
                    "citations": cited,
                })

            # Sort by citations, take top 3
            top_papers = sorted(top_papers, key=lambda x: x["citations"], reverse=True)[:3]

    except Exception as e:
        print(f"  Error fetching early papers: {e}")

    return total_citations, works_count, top_papers


def main():
    print("=" * 70)
    print("Early Career Citations Analysis (First 5 Years)")
    print("=" * 70)

    # Load raw data
    df = pd.read_csv("../data/comp_neuro_scholars_raw.csv")
    print(f"\nLoaded {len(df)} scholars")

    results = []

    for i, row in df.iterrows():
        name = row["name"]
        author_id = row["id"]
        total_citations = row["cited_by_count"]
        h_index = row["h_index"]
        institution = row["institution"]

        print(f"\n[{i+1}/{len(df)}] Processing: {name}")

        # Get first publication year
        first_year = get_author_first_year(author_id, EMAIL)

        if first_year:
            print(f"  First pub year: {first_year}")

            # Get first 5 years citations
            early_citations, early_works, top_papers = get_early_career_citations(
                author_id, first_year, years=5, email=EMAIL
            )

            print(f"  First 5 years: {early_works} works, {early_citations:,} citations")

            results.append({
                "name": name,
                "institution": institution,
                "first_pub_year": first_year,
                "early_career_end": first_year + 4,
                "early_works_count": early_works,
                "early_career_citations": early_citations,
                "total_citations": total_citations,
                "h_index": h_index,
                "early_pct": round(early_citations / total_citations * 100, 1) if total_citations > 0 else 0,
                "top_paper_1": top_papers[0]["title"] if len(top_papers) > 0 else "",
                "top_paper_1_citations": top_papers[0]["citations"] if len(top_papers) > 0 else 0,
            })
        else:
            print(f"  Cannot fetch first pub year")

        time.sleep(0.15)  # API rate limit

    # Convert to DataFrame
    results_df = pd.DataFrame(results)

    # Sort by early career citations
    results_df = results_df.sort_values("early_career_citations", ascending=False)

    # Save results
    results_df.to_csv("../data/early_career_citations.csv", index=False, encoding="utf-8")
    print(f"\n\nResults saved to ../data/early_career_citations.csv")

    # Print leaderboard
    print("\n" + "=" * 70)
    print("  Top 20 Early Career Citations Ranking")
    print("=" * 70)

    top20 = results_df.head(20)
    for i, (_, row) in enumerate(top20.iterrows(), 1):
        print(f"\n{i:2d}. {row['name']}")
        print(f"    Institution: {row['institution']}")
        print(f"    Career start: {int(row['first_pub_year'])} - {int(row['early_career_end'])}")
        print(f"    First 5 years: {row['early_career_citations']:,} citations ({row['early_pct']}% of total)")
        print(f"    First 5 years works: {row['early_works_count']}")
        if row['top_paper_1']:
            title = row['top_paper_1'][:60] + "..." if len(row['top_paper_1']) > 60 else row['top_paper_1']
            print(f"    Top work: {title}")

    # Additional stats
    print("\n\n" + "=" * 70)
    print("  Early Impact Analysis")
    print("=" * 70)

    print(f"\nFirst 5 years citation stats:")
    print(f"  Mean: {results_df['early_career_citations'].mean():,.0f}")
    print(f"  Median: {results_df['early_career_citations'].median():,.0f}")
    print(f"  Max: {results_df['early_career_citations'].max():,.0f}")

    # Highest early citation percentage
    print(f"\nHighest early citation percentage (first 5 years / total):")
    early_pct_top = results_df.nlargest(10, "early_pct")
    for i, (_, row) in enumerate(early_pct_top.iterrows(), 1):
        print(f"  {i}. {row['name']}: {row['early_pct']}% (first 5y {row['early_career_citations']:,} / total {row['total_citations']:,})")


if __name__ == "__main__":
    main()
