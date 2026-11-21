#!/usr/bin/env node
/**
 * Fill in the structured facts for the hand-written person files.
 *
 *   node scripts/fetch_people.mjs
 *
 * Input:  scholar-viz/src/content/people/<slug>.json (editorial, written by hand)
 * Output: scholar-viz/src/data/people-meta.json
 *
 * For each person, from Wikidata (looked up by the English Wikipedia title):
 *   - birth and death dates (P569, P570)
 *   - major prizes with their year (P166 + P585), filtered to a short list
 *   - portrait (P18) with author and licence from Wikimedia Commons
 * and from the OpenAlex datasets already in the repo:
 *   - the OpenAlex author id, when the name matches exactly one listed scholar
 *
 * Responses are cached under data/wiki_cache/.
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PEOPLE_DIR = path.join(ROOT, 'scholar-viz', 'src', 'content', 'people');
const DATA_DIR = path.join(ROOT, 'scholar-viz', 'src', 'data');
const OUT = path.join(DATA_DIR, 'people-meta.json');
const CACHE_DIR = path.join(ROOT, 'data', 'wiki_cache');
// Wikidata item "nomination declined", used as a significant-event (P793) qualifier on awards.
const DECLINED = 'Q26252351';
const UA = 'ScholarWizards/1.0 (https://scholarwizards.com)';

// Prizes worth showing on a timeline. Matched against the English label.
const MAJOR_PRIZES = [
  /^Nobel Prize in (Physics|Chemistry|Physiology or Medicine)$/,
  /^Nobel Memorial Prize in Economic Sciences$/,
  /^Nobel Peace Prize$/,
  /^Fields Medal$/,
  /^Abel Prize$/,
  /^Turing Award$/,
  /^Wolf Prize in (Mathematics|Physics|Chemistry|Medicine|Agriculture)$/,
  /^Crafoord Prize$/,
  /^Kyoto Prize/,
  /^Shaw Prize/,
  /^Lasker/,
  /Breakthrough Prize/,
  /^Copley Medal$/,
  /^Kavli Prize/,
  /^National Medal of Science$/,
  /^Presidential Medal of Freedom$/,
  /^Royal Medal$/,
  /^Max Planck Medal$/,
  /^Dirac Medal/,
  /^Vetlesen Prize$/,
  /^Balzan Prize/,
  /^Japan Prize$/,
  /^Albert Einstein World Award of Science$/,
  /^Gruber Prize/,
  /^Ostrowski Prize$/,
  /^Crafoord Prize in/,
  /^Steele Prize/,
  /^Sylvester Medal$/,
  /^Hughes Medal$/,
  /^Rumford Medal$/,
  /^Darwin Medal$/,
  /^Gold Medal of the Royal Astronomical Society$/,
  /^William Bowie Medal$/,
  /^Tang Prize/,
  /^Princess of Asturias Award/,
  /^IEEE Medal of Honor$/,
  /^Grace Murray Hopper Award$/,
  /^John von Neumann Theory Prize$/,
  /^Royal Society's Copley Medal$/,
];

async function cached(url) {
  const key = crypto.createHash('sha1').update(url).digest('hex');
  const file = path.join(CACHE_DIR, `${key}.json`);
  try {
    return JSON.parse(await fs.readFile(file, 'utf8'));
  } catch {
    // not cached yet
  }
  for (let attempt = 0; attempt < 4; attempt++) {
    const res = await fetch(url, { headers: { 'User-Agent': UA, Accept: 'application/json' } });
    if (res.status === 429 || res.status >= 500) {
      await new Promise(r => setTimeout(r, 2000 * (attempt + 1)));
      continue;
    }
    if (!res.ok) throw new Error(`${res.status} ${url}`);
    const json = await res.json();
    await fs.mkdir(CACHE_DIR, { recursive: true });
    await fs.writeFile(file, JSON.stringify(json));
    return json;
  }
  throw new Error(`gave up on ${url}`);
}

function parseTime(claim) {
  const v = claim?.mainsnak?.datavalue?.value;
  if (!v?.time) return null;
  const m = /^([+-]\d+)-(\d\d)-(\d\d)/.exec(v.time);
  if (!m) return null;
  const year = Number(m[1]);
  // precision 11 = day, 10 = month, 9 = year
  return {
    year,
    month: v.precision >= 10 ? Number(m[2]) : null,
    day: v.precision >= 11 ? Number(m[3]) : null,
  };
}

function preferred(claims = []) {
  return claims.find(c => c.rank === 'preferred') ?? claims.find(c => c.rank !== 'deprecated') ?? null;
}

function stripHtml(s) {
  return (s ?? '')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

// Wikidata labels are sometimes lower case ("Fields medal").
function titleCase(s) {
  if (!s) return s;
  return s.replace(/(?<![A-Za-z-])([a-z])([a-z]*)/g, (w, a, b) => (/^(in|of|the|for|and|or|on)$/.test(w) ? w : a.toUpperCase() + b));
}

function label(entity, langs) {
  for (const l of langs) if (entity?.labels?.[l]) return entity.labels[l].value;
  return null;
}

async function entityFor(enTitle) {
  const json = await cached(
    `https://www.wikidata.org/w/api.php?action=wbgetentities&sites=enwiki&titles=${encodeURIComponent(enTitle)}&props=claims|labels&languages=en|zh-hans|zh-cn|zh&redirects=yes&format=json`,
  );
  const entity = Object.values(json.entities ?? {})[0];
  if (!entity || entity.missing !== undefined) return null;
  return entity;
}

async function labels(ids) {
  const out = {};
  for (let i = 0; i < ids.length; i += 50) {
    const batch = ids.slice(i, i + 50).join('|');
    const json = await cached(
      `https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${batch}&props=labels&languages=en|zh-hans|zh-cn|zh&format=json`,
    );
    Object.assign(out, json.entities);
  }
  return out;
}

async function portrait(fileName) {
  const json = await cached(
    `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(`File:${fileName}`)}&prop=imageinfo&iiprop=url|extmetadata&iiurlwidth=640&format=json`,
  );
  const page = Object.values(json.query?.pages ?? {})[0];
  const info = page?.imageinfo?.[0];
  if (!info) return null;
  const meta = info.extmetadata ?? {};
  const licence = stripHtml(meta.LicenseShortName?.value);
  if (!licence || /fair use|non-free/i.test(licence)) return null;
  return {
    src: info.thumburl ?? info.url,
    width: info.thumbwidth ?? null,
    height: info.thumbheight ?? null,
    page: info.descriptionurl,
    artist: stripHtml(meta.Artist?.value).slice(0, 160) || null,
    licence,
  };
}

function normName(s) {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

async function openAlexIndex() {
  const byName = new Map();
  const add = (s, slug) => {
    const k = normName(s.name);
    const list = byName.get(k) ?? [];
    if (!list.some(x => x.id === s.id)) list.push({ id: s.id, cites: s.cites, slug });
    byName.set(k, list);
  };
  const dir = path.join(DATA_DIR, 'disciplines');
  for (const f of await fs.readdir(dir)) {
    const json = JSON.parse(await fs.readFile(path.join(dir, f), 'utf8'));
    for (const s of json.scholars) add(s, json.slug);
  }
  const coll = JSON.parse(await fs.readFile(path.join(DATA_DIR, 'collections', 'computational-neuroscience.json'), 'utf8'));
  for (const s of coll.scholars) add(s, 'collection');
  return byName;
}

async function main() {
  const files = (await fs.readdir(PEOPLE_DIR)).filter(f => f.endsWith('.json')).sort();
  const index = await openAlexIndex();
  const out = {};

  for (const f of files) {
    const person = JSON.parse(await fs.readFile(path.join(PEOPLE_DIR, f), 'utf8'));
    const entry = { qid: null, born: null, died: null, prizes: [], portrait: null, openalex: null };

    const entity = await entityFor(person.wiki.en);
    if (!entity) {
      console.warn(`! ${person.slug}: no Wikidata item for "${person.wiki.en}"`);
    } else {
      entry.qid = entity.id;
      entry.born = parseTime(preferred(entity.claims.P569));
      entry.died = parseTime(preferred(entity.claims.P570));

      const awardClaims = (entity.claims.P166 ?? []).filter(c => c.rank !== 'deprecated');
      const ids = [...new Set(awardClaims.map(c => c.mainsnak?.datavalue?.value?.id).filter(Boolean))];
      const awardLabels = ids.length ? await labels(ids) : {};
      for (const c of awardClaims) {
        const id = c.mainsnak?.datavalue?.value?.id;
        const en = titleCase(label(awardLabels[id], ['en']));
        if (!en || !MAJOR_PRIZES.some(re => new RegExp(re.source, "i").test(en))) continue;
        const year = parseTime(c.qualifiers?.P585?.[0] ? { mainsnak: c.qualifiers.P585[0] } : null)?.year ?? null;
        if (entry.prizes.some(p => p.id === id && p.year === year)) continue;
        const declined = (c.qualifiers?.P793 ?? []).some(q => q.datavalue?.value?.id === DECLINED);
        entry.prizes.push({ id, en, zh: label(awardLabels[id], ["zh-hans", "zh-cn", "zh"]) ?? en, year, declined });
      }
      entry.prizes.sort((a, b) => (a.year ?? 9999) - (b.year ?? 9999));

      const image = preferred(entity.claims.P18)?.mainsnak?.datavalue?.value;
      if (image) entry.portrait = await portrait(image);
    }

    // OpenAlex: an explicit id in the person file wins; otherwise an exact,
    // unambiguous name match against the scholars already in the datasets.
    if (person.openalex) {
      entry.openalex = person.openalex;
    } else {
      const hits = index.get(normName(person.name.en)) ?? [];
      if (hits.length === 1) entry.openalex = hits[0].id;
    }

    if (entry.born && person.born && entry.born.year !== person.born) {
      console.warn(`! ${person.slug}: born ${person.born} in file, ${entry.born.year} in Wikidata`);
    }
    out[person.slug] = entry;
    console.log(
      `${person.slug.padEnd(28)} ${entry.qid ?? '-'} ${entry.born?.year ?? '?'}–${entry.died?.year ?? ''} prizes:${entry.prizes.length} img:${entry.portrait ? 'y' : 'n'} oa:${entry.openalex ?? '-'}`,
    );
  }

  await fs.writeFile(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log(`\nwrote ${Object.keys(out).length} people to ${path.relative(ROOT, OUT)}`);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
