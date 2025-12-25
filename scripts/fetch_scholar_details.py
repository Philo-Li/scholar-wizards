#!/usr/bin/env python3
"""
Fetch detailed information for each scholar to generate profile pages.
"""

import requests
import pandas as pd
import json
import time
from datetime import datetime

OPENALEX_BASE = "https://api.openalex.org"
EMAIL = "researcher@example.com"


def get_author_details(author_id, email=None):
    """Get complete author details."""
    author_short_id = author_id.split("/")[-1]
    url = f"{OPENALEX_BASE}/authors/{author_short_id}"

    params = {}
    if email:
        params["mailto"] = email

    try:
        resp = requests.get(url, params=params, timeout=15)
        if resp.status_code == 200:
            return resp.json()
    except Exception as e:
        print(f"  Error fetching author details: {e}")
    return None


def get_author_works(author_id, email=None, limit=50):
    """Get author's top publications."""
    author_short_id = author_id.split("/")[-1]
    url = f"{OPENALEX_BASE}/works"
    params = {
        "filter": f"author.id:{author_short_id}",
        "sort": "cited_by_count:desc",
        "per_page": limit,
    }
    if email:
        params["mailto"] = email

    works = []
    try:
        resp = requests.get(url, params=params, timeout=15)
        if resp.status_code == 200:
            data = resp.json()
            for work in data.get("results", []):
                works.append({
                    "title": work.get("title", ""),
                    "year": work.get("publication_year"),
                    "citations": work.get("cited_by_count", 0),
                    "type": work.get("type", ""),
                    "doi": work.get("doi", ""),
                    "venue": work.get("primary_location", {}).get("source", {}).get("display_name", "") if work.get("primary_location") else "",
                })
    except Exception as e:
        print(f"  Error fetching works: {e}")
    return works


def get_yearly_citations(author_id, email=None):
    """Get author's yearly publication and citation data."""
    author_short_id = author_id.split("/")[-1]
    url = f"{OPENALEX_BASE}/works"
    params = {
        "filter": f"author.id:{author_short_id}",
        "group_by": "publication_year",
    }
    if email:
        params["mailto"] = email

    yearly_data = []
    try:
        resp = requests.get(url, params=params, timeout=15)
        if resp.status_code == 200:
            data = resp.json()
            for item in data.get("group_by", []):
                year = item.get("key")
                if year and str(year).isdigit():
                    yearly_data.append({
                        "year": int(year),
                        "works": item.get("count", 0),
                    })
            yearly_data.sort(key=lambda x: x["year"])
    except Exception as e:
        print(f"  Error fetching yearly data: {e}")
    return yearly_data


def get_coauthors(author_id, email=None, limit=10):
    """Get main collaborators."""
    author_short_id = author_id.split("/")[-1]
    url = f"{OPENALEX_BASE}/authors"
    params = {
        "filter": f"x_concepts.id:C15286952",  # Computational Neuroscience
        "per_page": 200,
    }
    if email:
        params["mailto"] = email

    # Simplified: extracting from papers would be more accurate
    # but skipped for performance
    return []


def analyze_research_topics(concepts):
    """Analyze research topics."""
    if not concepts:
        return []

    topics = []
    for concept in concepts[:10]:
        topics.append({
            "name": concept.get("display_name", ""),
            "score": round(concept.get("score", 0) * 100, 1),
            "level": concept.get("level", 0),
        })
    return topics


def generate_scholar_summary(name, details, works, early_career_data):
    """Generate text summary for scholar."""
    summary = []

    if not details:
        return "No detailed information available."

    # Basic info
    cited_by = details.get("cited_by_count", 0)
    works_count = details.get("works_count", 0)
    h_index = details.get("summary_stats", {}).get("h_index", 0)

    # Institution info
    institutions = details.get("last_known_institutions", [])
    inst_name = institutions[0].get("display_name", "") if institutions else ""
    country = institutions[0].get("country_code", "") if institutions else ""

    # Research areas
    concepts = details.get("x_concepts", [])
    top_concepts = [c.get("display_name", "") for c in concepts[:5]]

    # Generate summary
    if inst_name:
        summary.append(f"{name} is currently affiliated with {inst_name}.")

    summary.append(f"Published {works_count} academic papers with {cited_by:,} citations and h-index of {h_index}.")

    if top_concepts:
        summary.append(f"Main research areas include {', '.join(top_concepts[:3])}.")

    # Top work
    if works and len(works) > 0:
        top_work = works[0]
        summary.append(f"Top cited work \"{top_work['title'][:50]}...\" has {top_work['citations']:,} citations.")

    # Early career analysis
    if early_career_data:
        early_pct = early_career_data.get("earlyPct", 0)
        early_citations = early_career_data.get("earlyCareerCitations", 0)
        if early_pct >= 20:
            summary.append(f"First 5 years citations account for {early_pct}% ({early_citations:,}) of total, showing strong early impact.")
        elif early_pct <= 5:
            summary.append(f"First 5 years citations only {early_pct}%, indicating gradual accumulation of academic influence.")

    return " ".join(summary)


def categorize_impact(cited_by, h_index, works_count):
    """Evaluate scholar's impact type."""
    categories = []

    if cited_by > 50000:
        categories.append({"type": "Top Impact", "description": "Over 50k citations, top scholar in the field"})
    elif cited_by > 20000:
        categories.append({"type": "High Impact", "description": "Over 20k citations, recognized leader in the field"})
    elif cited_by > 10000:
        categories.append({"type": "Medium-High Impact", "description": "Over 10k citations, significant influence in specific areas"})

    if h_index > 100:
        categories.append({"type": "Sustained Output", "description": "h-index over 100, long-term high-quality output"})
    elif h_index > 50:
        categories.append({"type": "Stable Output", "description": "h-index over 50, consistent academic output"})

    if works_count > 500:
        categories.append({"type": "Prolific Scholar", "description": f"Over {works_count} publications, extremely productive"})

    return categories


def main():
    print("=" * 70)
    print("Fetching Scholar Details")
    print("=" * 70)

    # Load raw data
    df = pd.read_csv("../data/comp_neuro_scholars_raw.csv")

    # Load early career data
    early_career_df = pd.read_csv("../data/early_career_citations.csv")
    early_career_dict = {row["name"]: row.to_dict() for _, row in early_career_df.iterrows()}

    scholars_details = []

    for i, row in df.iterrows():
        name = row["name"]
        author_id = row["id"]

        print(f"\n[{i+1}/{len(df)}] Processing: {name}")

        # Get details
        details = get_author_details(author_id, EMAIL)
        if not details:
            print(f"  Skipped: cannot fetch details")
            continue

        time.sleep(0.1)

        # Get works
        works = get_author_works(author_id, EMAIL, limit=30)
        print(f"  Fetched {len(works)} works")

        time.sleep(0.1)

        # Get yearly data
        yearly = get_yearly_citations(author_id, EMAIL)
        print(f"  Fetched {len(yearly)} years of data")

        time.sleep(0.1)

        # Analyze topics
        topics = analyze_research_topics(details.get("x_concepts", []))

        # Get early career data
        early_data = early_career_dict.get(name, {})

        # Generate summary
        summary = generate_scholar_summary(name, details, works, early_data)

        # Impact categories
        impact_categories = categorize_impact(
            details.get("cited_by_count", 0),
            details.get("summary_stats", {}).get("h_index", 0),
            details.get("works_count", 0)
        )

        # Build complete record
        scholar_detail = {
            "id": author_id.split("/")[-1],
            "name": name,
            "orcid": details.get("orcid", ""),
            "worksCount": details.get("works_count", 0),
            "citedByCount": details.get("cited_by_count", 0),
            "hIndex": details.get("summary_stats", {}).get("h_index", 0),
            "i10Index": details.get("summary_stats", {}).get("i10_index", 0),
            "twoYearMeanCitedness": round(details.get("summary_stats", {}).get("2yr_mean_citedness", 0), 2),
            "institution": row.get("institution", ""),
            "country": row.get("country", ""),
            "topics": topics,
            "topWorks": works[:15],
            "yearlyData": yearly,
            "summary": summary,
            "impactCategories": impact_categories,
            "earlyCareer": {
                "firstPubYear": int(early_data.get("first_pub_year", 0)) if pd.notna(early_data.get("first_pub_year")) else None,
                "earlyCareerEnd": int(early_data.get("early_career_end", 0)) if pd.notna(early_data.get("early_career_end")) else None,
                "earlyWorksCount": int(early_data.get("early_works_count", 0)) if pd.notna(early_data.get("early_works_count")) else 0,
                "earlyCareerCitations": int(early_data.get("early_career_citations", 0)) if pd.notna(early_data.get("early_career_citations")) else 0,
                "earlyPct": float(early_data.get("early_pct", 0)) if pd.notna(early_data.get("early_pct")) else 0,
                "topPaper": early_data.get("top_paper_1", "") if pd.notna(early_data.get("top_paper_1")) else "",
            } if early_data else None,
            "openAlexUrl": author_id,
        }

        scholars_details.append(scholar_detail)

    # Save results (handle NaN values)
    output_path = "../scholar-viz/src/data/scholarDetails.json"

    # Convert NaN to None for valid JSON
    def clean_nan(obj):
        if isinstance(obj, float) and (obj != obj):  # NaN check
            return None
        elif isinstance(obj, dict):
            return {k: clean_nan(v) for k, v in obj.items()}
        elif isinstance(obj, list):
            return [clean_nan(v) for v in obj]
        return obj

    scholars_details = clean_nan(scholars_details)

    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(scholars_details, f, ensure_ascii=False, indent=2)

    print(f"\n\nSaved {len(scholars_details)} scholar details to {output_path}")


if __name__ == "__main__":
    main()
