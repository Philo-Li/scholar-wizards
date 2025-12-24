#!/usr/bin/env python3
"""
计算神经科学领域学者数据获取与分析工具

使用 OpenAlex API 获取计算神经科学领域顶级学者的详细信息，
并按照学术地位评估框架进行分析。

使用方法:
    python fetch_comp_neuro_scholars.py

依赖:
    pip install requests pandas matplotlib seaborn
"""

import requests
import pandas as pd
import json
from datetime import datetime
from collections import defaultdict
import time

# OpenAlex API 配置
OPENALEX_BASE = "https://api.openalex.org"
# Computational Neuroscience concept ID
CONCEPT_ID = "C15286952"
# 你的邮箱（礼貌性请求，可选但推荐）
EMAIL = "your-email@example.com"


def get_authors_by_concept(concept_id, limit=100, email=None):
    """通过概念ID获取该领域的顶级作者"""
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

            print(f"已获取 {len(authors)} 位作者...")
            time.sleep(0.1)  # 礼貌性延迟

        except Exception as e:
            print(f"获取第 {page} 页时出错: {e}")
            break

    return authors


def get_authors_by_works(concept_id, limit=100, email=None):
    """通过高引用论文获取该领域的顶级作者（备选方法）"""
    author_citations = defaultdict(lambda: {
        "name": "",
        "id": "",
        "works_count": 0,
        "cited_by_count": 0,
        "institution": "",
        "country": "",
    })

    # 获取该领域高引用论文
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

                # 获取机构
                institutions = authorship.get("institutions", [])
                if institutions and not entry["institution"]:
                    inst = institutions[0]
                    entry["institution"] = inst.get("display_name", "")
                    entry["country"] = inst.get("country_code", "")

        # 获取每个作者的详细信息
        print(f"从论文中发现 {len(author_citations)} 位作者，正在获取详细信息...")

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
                print(f"进度: {i}/{min(len(author_citations), limit)}")
            time.sleep(0.05)

        return authors

    except Exception as e:
        print(f"获取论文时出错: {e}")
        return []


def parse_author(author_data):
    """解析作者数据"""
    # 获取最近机构
    last_inst = author_data.get("last_known_institutions", [])
    institution = ""
    country = ""
    if last_inst:
        institution = last_inst[0].get("display_name", "")
        country = last_inst[0].get("country_code", "")

    # 获取研究领域 (concepts)
    concepts = author_data.get("x_concepts", [])
    top_concepts = [c.get("display_name", "") for c in concepts[:5]]

    # 获取 summary_stats
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
    """获取作者的首篇论文年份（用于估算学术年龄）"""
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
    """分析作者数据"""
    print("\n" + "="*60)
    print("计算神经科学领域 TOP 学者分析报告")
    print("="*60)

    # 基本统计
    print("\n## 1. 引用量统计")
    print(f"  总样本: {len(authors_df)} 人")
    print(f"  引用量 - 均值: {authors_df['cited_by_count'].mean():,.0f}")
    print(f"  引用量 - 中位数: {authors_df['cited_by_count'].median():,.0f}")
    print(f"  引用量 - 最大值: {authors_df['cited_by_count'].max():,.0f}")
    print(f"  引用量 - TOP 10%: {authors_df['cited_by_count'].quantile(0.9):,.0f}")

    print("\n## 2. H-index 统计")
    print(f"  H-index - 均值: {authors_df['h_index'].mean():.1f}")
    print(f"  H-index - 中位数: {authors_df['h_index'].median():.1f}")
    print(f"  H-index - 最大值: {authors_df['h_index'].max():.0f}")

    print("\n## 3. 产出量统计")
    print(f"  论文数 - 均值: {authors_df['works_count'].mean():.0f}")
    print(f"  论文数 - 中位数: {authors_df['works_count'].median():.0f}")

    # 机构分布
    print("\n## 4. 机构分布 (TOP 10)")
    inst_counts = authors_df['institution'].value_counts().head(10)
    for inst, count in inst_counts.items():
        if inst:
            print(f"  {inst}: {count} 人")

    # 国家分布
    print("\n## 5. 国家/地区分布")
    country_counts = authors_df['country'].value_counts().head(10)
    for country, count in country_counts.items():
        if country:
            print(f"  {country}: {count} 人")

    # TOP 20 学者
    print("\n## 6. TOP 20 学者 (按引用量)")
    top20 = authors_df.nlargest(20, 'cited_by_count')
    for i, (_, row) in enumerate(top20.iterrows(), 1):
        print(f"  {i:2d}. {row['name']}")
        print(f"      引用: {row['cited_by_count']:,} | H: {row['h_index']} | 论文: {row['works_count']}")
        print(f"      机构: {row['institution']}")

    return authors_df


def calculate_academic_age(authors_df, email=None):
    """计算学术年龄（基于首篇论文年份）"""
    print("\n正在获取学术年龄信息（首篇论文年份）...")
    current_year = datetime.now().year

    first_years = []
    for i, row in authors_df.iterrows():
        year = get_first_publication_year(row['id'], email)
        first_years.append(year)
        if i % 10 == 0:
            print(f"  进度: {i+1}/{len(authors_df)}")
        time.sleep(0.05)

    authors_df['first_pub_year'] = first_years
    authors_df['academic_age'] = current_year - authors_df['first_pub_year']
    authors_df['m_index'] = authors_df['h_index'] / authors_df['academic_age'].replace(0, 1)

    return authors_df


def categorize_scholars(authors_df):
    """对学者进行分类"""
    categories = []

    for _, row in authors_df.iterrows():
        concepts = row.get('top_concepts', '').lower()

        # 基于研究领域分类
        if any(k in concepts for k in ['machine learning', 'deep learning', 'artificial intelligence']):
            cat = "ML/AI + Neuro"
        elif any(k in concepts for k in ['neuroscience', 'brain', 'neural']):
            if 'cognitive' in concepts or 'psychology' in concepts:
                cat = "认知神经科学"
            elif 'computation' in concepts or 'model' in concepts:
                cat = "计算建模"
            else:
                cat = "系统神经科学"
        elif 'mathematics' in concepts or 'statistics' in concepts:
            cat = "数学/统计方法"
        else:
            cat = "其他"

        categories.append(cat)

    authors_df['category'] = categories
    return authors_df


def main():
    print("="*60)
    print("计算神经科学领域学者数据获取工具")
    print("="*60)

    # 方法1: 通过概念直接获取
    print("\n尝试方法1: 通过 x_concepts 获取...")
    authors = get_authors_by_concept(CONCEPT_ID, limit=100, email=EMAIL)

    # 如果方法1失败，尝试方法2
    if len(authors) < 50:
        print("\n方法1结果不足，尝试方法2: 通过高引用论文获取...")
        authors = get_authors_by_works(CONCEPT_ID, limit=100, email=EMAIL)

    if not authors:
        print("无法获取数据。请检查网络连接或尝试其他数据源。")
        return

    # 转换为 DataFrame
    df = pd.DataFrame(authors)

    # 保存原始数据
    df.to_csv("comp_neuro_scholars_raw.csv", index=False, encoding='utf-8')
    print(f"\n原始数据已保存到 comp_neuro_scholars_raw.csv ({len(df)} 条记录)")

    # 分析
    df = analyze_authors(df)

    # 分类
    df = categorize_scholars(df)

    # 可选：获取学术年龄（较慢）
    # df = calculate_academic_age(df, EMAIL)

    # 保存完整分析结果
    df.to_csv("comp_neuro_scholars_analyzed.csv", index=False, encoding='utf-8')
    print(f"\n分析结果已保存到 comp_neuro_scholars_analyzed.csv")

    # 打印分类统计
    print("\n## 7. 研究方向分类")
    for cat, count in df['category'].value_counts().items():
        print(f"  {cat}: {count} 人")


if __name__ == "__main__":
    main()
