#!/usr/bin/env python3
"""
职业生涯前五年引用数量分析

获取计算神经科学领域学者职业生涯前五年的引用数量，
用于评估学者的早期学术爆发力。
"""

import requests
import pandas as pd
import time
from datetime import datetime

OPENALEX_BASE = "https://api.openalex.org"
EMAIL = "researcher@example.com"


def get_author_first_year(author_id, email=None):
    """获取作者的首篇论文年份"""
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
        print(f"  获取首篇论文年份出错: {e}")
    return None


def get_early_career_citations(author_id, first_year, years=5, email=None):
    """获取作者职业生涯前N年发表论文的总引用数"""
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

            # 按引用排序，取前3篇
            top_papers = sorted(top_papers, key=lambda x: x["citations"], reverse=True)[:3]

    except Exception as e:
        print(f"  获取早期论文出错: {e}")

    return total_citations, works_count, top_papers


def main():
    print("=" * 70)
    print("职业生涯前五年引用数量分析")
    print("=" * 70)

    # 读取原始数据
    df = pd.read_csv("comp_neuro_scholars_raw.csv")
    print(f"\n读取到 {len(df)} 位学者数据")

    results = []

    for i, row in df.iterrows():
        name = row["name"]
        author_id = row["id"]
        total_citations = row["cited_by_count"]
        h_index = row["h_index"]
        institution = row["institution"]

        print(f"\n[{i+1}/{len(df)}] 处理: {name}")

        # 获取首篇论文年份
        first_year = get_author_first_year(author_id, EMAIL)

        if first_year:
            print(f"  首篇论文年份: {first_year}")

            # 获取前五年引用
            early_citations, early_works, top_papers = get_early_career_citations(
                author_id, first_year, years=5, email=EMAIL
            )

            print(f"  前五年论文数: {early_works}, 引用总数: {early_citations:,}")

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
            print(f"  无法获取首篇论文年份")

        time.sleep(0.15)  # API礼貌延迟

    # 转换为DataFrame
    results_df = pd.DataFrame(results)

    # 按前五年引用排序
    results_df = results_df.sort_values("early_career_citations", ascending=False)

    # 保存结果
    results_df.to_csv("early_career_citations.csv", index=False, encoding="utf-8")
    print(f"\n\n结果已保存到 early_career_citations.csv")

    # 打印排行榜
    print("\n" + "=" * 70)
    print("  职业生涯前五年最高引用数量排行榜 TOP 20")
    print("=" * 70)

    top20 = results_df.head(20)
    for i, (_, row) in enumerate(top20.iterrows(), 1):
        print(f"\n{i:2d}. {row['name']}")
        print(f"    机构: {row['institution']}")
        print(f"    学术生涯起始: {int(row['first_pub_year'])} - {int(row['early_career_end'])}")
        print(f"    前五年引用: {row['early_career_citations']:,} (占总引用 {row['early_pct']}%)")
        print(f"    前五年论文数: {row['early_works_count']}")
        if row['top_paper_1']:
            title = row['top_paper_1'][:60] + "..." if len(row['top_paper_1']) > 60 else row['top_paper_1']
            print(f"    代表作: {title}")

    # 额外统计
    print("\n\n" + "=" * 70)
    print("  早期爆发力分析")
    print("=" * 70)

    print(f"\n前五年引用统计:")
    print(f"  平均值: {results_df['early_career_citations'].mean():,.0f}")
    print(f"  中位数: {results_df['early_career_citations'].median():,.0f}")
    print(f"  最大值: {results_df['early_career_citations'].max():,.0f}")

    # 早期引用占比最高的学者
    print(f"\n早期引用占比最高的学者 (前五年引用/总引用):")
    early_pct_top = results_df.nlargest(10, "early_pct")
    for i, (_, row) in enumerate(early_pct_top.iterrows(), 1):
        print(f"  {i}. {row['name']}: {row['early_pct']}% (前五年 {row['early_career_citations']:,} / 总计 {row['total_citations']:,})")


if __name__ == "__main__":
    main()
