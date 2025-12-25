#!/usr/bin/env python3
"""
Computational Neuroscience Scholar Data Fetcher

Fetch top computational neuroscience scholars using OpenAlex API
and analyze their academic standing.

Usage:
    python fetch_comp_neuro_scholars.py

Dependencies:
    pip install requests pandas matplotlib seaborn
"""

import requests
import pandas as pd
import json
from datetime import datetime
from collections import defaultdict
import time

# OpenAlex API configuration
OPENALEX_BASE = "https://api.openalex.org"
# Computational Neuroscience concept ID
CONCEPT_ID = "C15286952"
# Your email (polite request, optional but recommended)
EMAIL = "your-email@example.com"


def get_authors_by_concept(concept_id, limit=100, email=None):
    """Get top authors in a field by concept ID."""
    authors = []
    per_page = 50

    for page in range(1, (limit // per_page) + 2):
        url = f"{OPENALEX_BASE}/authors"
        params = {
            "filter": f"x_concepts.id:{concept_id}",
            "sort": "cited_by_count:desc",
            "per_page": per_page,
            "page": page,
        }
        if email:
            params["mailto"] = email

        try:
            resp = requests.get(url, params=params, timeout=30)
            resp.raise_for_status()
            data = resp.json()

            if not data.get("results"):
                break

            for author in data["results"]:
                authors.append(parse_author(author))
                if len(authors) >= limit:
                    return authors

            print(f"Fetched {len(authors)} authors...")
            time.sleep(0.1)  # Rate limit delay

        except Exception as e:
            print(f"Error fetching page {page}: {e}")
            break

    return authors


def get_authors_by_works(concept_id, limit=100, email=None):
    """Get top authors in a field via highly-cited papers (fallback method)."""
    author_citations = defaultdict(lambda: {
        "name": "",
        "id": "",
        "works_count": 0,
        "cited_by_count": 0,
        "institution": "",
        "country": "",
    })

    # Get highly-cited papers in this field
    url = f"{OPENALEX_BASE}/works"
    params = {
        "filter": f"concepts.id:{concept_id}",
        "sort": "cited_by_count:desc",
        "per_page": 200,
    }
    if email:
        params["mailto"] = email

    try:
        resp = requests.get(url, params=params, timeout=30)
        resp.raise_for_status()
        data = resp.json()

        for work in data.get("results", []):
            for authorship in work.get("authorships", []):
                author = authorship.get("author", {})
                author_id = author.get("id", "")
                if not author_id:
                    continue

                entry = author_citations[author_id]
                entry["name"] = author.get("display_name", "")
                entry["id"] = author_id
                entry["works_count"] += 1

                # Get institution
                institutions = authorship.get("institutions", [])
                if institutions and not entry["institution"]:
                    inst = institutions[0]
                    entry["institution"] = inst.get("display_name", "")
                    entry["country"] = inst.get("country_code", "")

        # Get detailed info for each author
        print(f"Found {len(author_citations)} authors from papers, fetching details...")

        authors = []
        for i, (author_id, info) in enumerate(author_citations.items()):
            if i >= limit:
                break

            author_url = author_id.replace("https://openalex.org/", f"{OPENALEX_BASE}/")
            try:
                resp = requests.get(author_url, params={"mailto": email} if email else {}, timeout=10)
                if resp.status_code == 200:
                    author_data = resp.json()
                    authors.append(parse_author(author_data))
            except:
                pass

            if i % 10 == 0:
                print(f"Progress: {i}/{min(len(author_citations), limit)}")
            time.sleep(0.05)

        return authors

    except Exception as e:
        print(f"Error fetching papers: {e}")
        return []


def parse_author(author_data):
    """Parse author data."""
    # Get last known institution
    last_inst = author_data.get("last_known_institutions", [])
    institution = ""
    country = ""
    if last_inst:
        institution = last_inst[0].get("display_name", "")
        country = last_inst[0].get("country_code", "")

    # Get research areas (concepts)
    concepts = author_data.get("x_concepts", [])
    top_concepts = [c.get("display_name", "") for c in concepts[:5]]

    # Get summary_stats
    stats = author_data.get("summary_stats", {})

    return {
        "id": author_data.get("id", ""),
        "name": author_data.get("display_name", ""),
        "orcid": author_data.get("orcid", ""),
        "works_count": author_data.get("works_count", 0),
        "cited_by_count": author_data.get("cited_by_count", 0),
        "h_index": stats.get("h_index", 0),
        "i10_index": stats.get("i10_index", 0),
        "2yr_mean_citedness": stats.get("2yr_mean_citedness", 0),
        "institution": institution,
        "country": country,
        "top_concepts": ", ".join(top_concepts),
        "works_api_url": author_data.get("works_api_url", ""),
    }


def get_first_publication_year(author_id, email=None):
    """Get author's first publication year (for estimating academic age)."""
    works_url = author_id.replace("https://openalex.org/", f"{OPENALEX_BASE}/")
    works_url = works_url.replace("/authors/", "/works?filter=author.id:")
    works_url += "&sort=publication_year:asc&per_page=1"

    try:
        resp = requests.get(works_url, params={"mailto": email} if email else {}, timeout=10)
        if resp.status_code == 200:
            data = resp.json()
            results = data.get("results", [])
            if results:
                return results[0].get("publication_year")
    except:
        pass
    return None


def analyze_authors(authors_df):
    """Analyze author data."""
    print("\n" + "="*60)
    print("Computational Neuroscience TOP Scholar Analysis Report")
    print("="*60)

    # Basic statistics
    print("\n## 1. Citation Statistics")
    print(f"  Total sample: {len(authors_df)} scholars")
    print(f"  Citations - Mean: {authors_df['cited_by_count'].mean():,.0f}")
    print(f"  Citations - Median: {authors_df['cited_by_count'].median():,.0f}")
    print(f"  Citations - Max: {authors_df['cited_by_count'].max():,.0f}")
    print(f"  Citations - TOP 10%: {authors_df['cited_by_count'].quantile(0.9):,.0f}")

    print("\n## 2. H-index Statistics")
    print(f"  H-index - Mean: {authors_df['h_index'].mean():.1f}")
    print(f"  H-index - Median: {authors_df['h_index'].median():.1f}")
    print(f"  H-index - Max: {authors_df['h_index'].max():.0f}")

    print("\n## 3. Output Statistics")
    print(f"  Papers - Mean: {authors_df['works_count'].mean():.0f}")
    print(f"  Papers - Median: {authors_df['works_count'].median():.0f}")

    # Institution distribution
    print("\n## 4. Institution Distribution (TOP 10)")
    inst_counts = authors_df['institution'].value_counts().head(10)
    for inst, count in inst_counts.items():
        if inst:
            print(f"  {inst}: {count} scholars")

    # Country distribution
    print("\n## 5. Country/Region Distribution")
    country_counts = authors_df['country'].value_counts().head(10)
    for country, count in country_counts.items():
        if country:
            print(f"  {country}: {count} scholars")

    # TOP 20 scholars
    print("\n## 6. TOP 20 Scholars (by citations)")
    top20 = authors_df.nlargest(20, 'cited_by_count')
    for i, (_, row) in enumerate(top20.iterrows(), 1):
        print(f"  {i:2d}. {row['name']}")
        print(f"      Citations: {row['cited_by_count']:,} | H: {row['h_index']} | Papers: {row['works_count']}")
        print(f"      Institution: {row['institution']}")

    return authors_df


def calculate_academic_age(authors_df, email=None):
    """Calculate academic age (based on first publication year)."""
    print("\nFetching academic age info (first publication year)...")
    current_year = datetime.now().year

    first_years = []
    for i, row in authors_df.iterrows():
        year = get_first_publication_year(row['id'], email)
        first_years.append(year)
        if i % 10 == 0:
            print(f"  Progress: {i+1}/{len(authors_df)}")
        time.sleep(0.05)

    authors_df['first_pub_year'] = first_years
    authors_df['academic_age'] = current_year - authors_df['first_pub_year']
    authors_df['m_index'] = authors_df['h_index'] / authors_df['academic_age'].replace(0, 1)

    return authors_df


def categorize_scholars(authors_df):
    """Categorize scholars by research area."""
    categories = []

    for _, row in authors_df.iterrows():
        concepts = row.get('top_concepts', '').lower()

        # Categorize based on research area
        if any(k in concepts for k in ['machine learning', 'deep learning', 'artificial intelligence']):
            cat = "ML/AI + Neuro"
        elif any(k in concepts for k in ['neuroscience', 'brain', 'neural']):
            if 'cognitive' in concepts or 'psychology' in concepts:
                cat = "Cognitive Neuroscience"
            elif 'computation' in concepts or 'model' in concepts:
                cat = "Computational Modeling"
            else:
                cat = "Systems Neuroscience"
        elif 'mathematics' in concepts or 'statistics' in concepts:
            cat = "Mathematical/Statistical Methods"
        else:
            cat = "Other"

        categories.append(cat)

    authors_df['category'] = categories
    return authors_df


def main():
    print("="*60)
    print("Computational Neuroscience Scholar Data Fetcher")
    print("="*60)

    # Method 1: Fetch via concepts directly
    print("\nTrying Method 1: via x_concepts...")
    authors = get_authors_by_concept(CONCEPT_ID, limit=100, email=EMAIL)

    # If Method 1 fails, try Method 2
    if len(authors) < 50:
        print("\nMethod 1 insufficient, trying Method 2: via highly-cited papers...")
        authors = get_authors_by_works(CONCEPT_ID, limit=100, email=EMAIL)

    if not authors:
        print("Cannot fetch data. Please check network connection or try other data sources.")
        return

    # Convert to DataFrame
    df = pd.DataFrame(authors)

    # Save raw data
    df.to_csv("../data/comp_neuro_scholars_raw.csv", index=False, encoding='utf-8')
    print(f"\nRaw data saved to ../data/comp_neuro_scholars_raw.csv ({len(df)} records)")

    # Analyze
    df = analyze_authors(df)

    # Categorize
    df = categorize_scholars(df)

    # Optional: get academic age (slower)
    # df = calculate_academic_age(df, EMAIL)

    # Save complete analysis results
    df.to_csv("../data/comp_neuro_scholars_analyzed.csv", index=False, encoding='utf-8')
    print(f"\nAnalysis results saved to ../data/comp_neuro_scholars_analyzed.csv")

    # Print category statistics
    print("\n## 7. Research Area Categories")
    for cat, count in df['category'].value_counts().items():
        print(f"  {cat}: {count} scholars")


if __name__ == "__main__":
    main()
