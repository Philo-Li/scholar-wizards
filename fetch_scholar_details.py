#!/usr/bin/env python3
"""
获取每位学者的详细信息，用于生成个人页面
"""

import requests
import pandas as pd
import json
import time
from datetime import datetime

OPENALEX_BASE = "https://api.openalex.org"
EMAIL = "researcher@example.com"


def get_author_details(author_id, email=None):
    """获取作者的完整详细信息"""
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
        print(f"  获取作者详情出错: {e}")
    return None


def get_author_works(author_id, email=None, limit=50):
    """获取作者的主要论文"""
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
        print(f"  获取论文列表出错: {e}")
    return works


def get_yearly_citations(author_id, email=None):
    """获取作者每年的论文发表和引用情况"""
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
        print(f"  获取年度数据出错: {e}")
    return yearly_data


def get_coauthors(author_id, email=None, limit=10):
    """获取主要合作者"""
    author_short_id = author_id.split("/")[-1]
    url = f"{OPENALEX_BASE}/authors"
    params = {
        "filter": f"x_concepts.id:C15286952",  # Computational Neuroscience
        "per_page": 200,
    }
    if email:
        params["mailto"] = email

    # 这里简化处理，从论文中提取合作者会更准确
    # 但为了性能，我们跳过这一步
    return []


def analyze_research_topics(concepts):
    """分析研究主题"""
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
    """生成学者的文字总结"""
    summary = []

    if not details:
        return "暂无详细信息。"

    # 基本信息
    cited_by = details.get("cited_by_count", 0)
    works_count = details.get("works_count", 0)
    h_index = details.get("summary_stats", {}).get("h_index", 0)

    # 机构信息
    institutions = details.get("last_known_institutions", [])
    inst_name = institutions[0].get("display_name", "") if institutions else ""
    country = institutions[0].get("country_code", "") if institutions else ""

    # 研究方向
    concepts = details.get("x_concepts", [])
    top_concepts = [c.get("display_name", "") for c in concepts[:5]]

    # 生成总结段落
    if inst_name:
        summary.append(f"{name} 目前任职于 {inst_name}，")

    summary.append(f"累计发表 {works_count} 篇学术论文，被引用 {cited_by:,} 次，h-index 为 {h_index}。")

    if top_concepts:
        summary.append(f"主要研究方向包括 {', '.join(top_concepts[:3])} 等领域。")

    # 代表作
    if works and len(works) > 0:
        top_work = works[0]
        summary.append(f"代表作《{top_work['title'][:50]}...》被引用 {top_work['citations']:,} 次。")

    # 早期职业分析
    if early_career_data:
        early_pct = early_career_data.get("earlyPct", 0)
        early_citations = early_career_data.get("earlyCareerCitations", 0)
        if early_pct >= 20:
            summary.append(f"职业生涯前五年引用占总引用的 {early_pct}%（{early_citations:,} 次），显示出较强的早期爆发力。")
        elif early_pct <= 5:
            summary.append(f"职业生涯前五年引用仅占 {early_pct}%，说明其学术影响力是逐步积累而成。")

    return " ".join(summary)


def categorize_impact(cited_by, h_index, works_count):
    """评估学者的影响力类型"""
    categories = []

    if cited_by > 50000:
        categories.append({"type": "顶级影响力", "description": "总引用超过5万次，属于领域顶级学者"})
    elif cited_by > 20000:
        categories.append({"type": "高影响力", "description": "总引用超过2万次，是领域内公认的重要人物"})
    elif cited_by > 10000:
        categories.append({"type": "中高影响力", "description": "总引用超过1万次，在特定方向具有显著影响"})

    if h_index > 100:
        categories.append({"type": "持续产出", "description": "h-index超过100，表明长期高质量产出"})
    elif h_index > 50:
        categories.append({"type": "稳定产出", "description": "h-index超过50，具有持续的学术产出能力"})

    if works_count > 500:
        categories.append({"type": "高产学者", "description": f"发表超过{works_count}篇论文，产出极为丰富"})

    return categories


def main():
    print("=" * 70)
    print("获取学者详细信息")
    print("=" * 70)

    # 读取原始数据
    df = pd.read_csv("comp_neuro_scholars_raw.csv")

    # 读取早期职业数据
    early_career_df = pd.read_csv("early_career_citations.csv")
    early_career_dict = {row["name"]: row.to_dict() for _, row in early_career_df.iterrows()}

    scholars_details = []

    for i, row in df.iterrows():
        name = row["name"]
        author_id = row["id"]

        print(f"\n[{i+1}/{len(df)}] 处理: {name}")

        # 获取详细信息
        details = get_author_details(author_id, EMAIL)
        if not details:
            print(f"  跳过: 无法获取详情")
            continue

        time.sleep(0.1)

        # 获取论文列表
        works = get_author_works(author_id, EMAIL, limit=30)
        print(f"  获取到 {len(works)} 篇论文")

        time.sleep(0.1)

        # 获取年度数据
        yearly = get_yearly_citations(author_id, EMAIL)
        print(f"  获取到 {len(yearly)} 年的数据")

        time.sleep(0.1)

        # 分析研究主题
        topics = analyze_research_topics(details.get("x_concepts", []))

        # 获取早期职业数据
        early_data = early_career_dict.get(name, {})

        # 生成摘要
        summary = generate_scholar_summary(name, details, works, early_data)

        # 影响力分类
        impact_categories = categorize_impact(
            details.get("cited_by_count", 0),
            details.get("summary_stats", {}).get("h_index", 0),
            details.get("works_count", 0)
        )

        # 构建完整记录
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

    # 保存结果 (处理NaN值)
    output_path = "scholar-viz/src/data/scholarDetails.json"

    # 将NaN转换为None以确保有效JSON
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

    print(f"\n\n已保存 {len(scholars_details)} 位学者的详细信息到 {output_path}")


if __name__ == "__main__":
    main()
