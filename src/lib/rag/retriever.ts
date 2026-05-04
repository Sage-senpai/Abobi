import "server-only";

import { GUIDES } from "@/data/guides";
import type { GuideArticle, GuideSection } from "@/data/guides";

export interface RetrievedArticle {
  country: string;
  flag: string;
  category: string;
  title: string;
  summary: string;
  tags: string[];
  sources: { label: string; url: string }[];
  lastUpdated: string;
  score: number;
}

interface FlatArticle {
  country: string;
  flag: string;
  category: string;
  article: GuideArticle;
  searchText: string;
}

const STOPWORDS = new Set([
  "a", "an", "and", "are", "as", "at", "be", "by", "do", "does", "for",
  "from", "have", "how", "i", "if", "in", "is", "it", "me", "my", "of",
  "on", "or", "should", "so", "that", "the", "this", "to", "was", "we",
  "what", "when", "where", "which", "who", "why", "will", "with", "you",
  "your", "can", "did", "would", "could", "any", "some", "there",
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s+\-]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length >= 2 && !STOPWORDS.has(t));
}

let _flatIndex: FlatArticle[] | null = null;

function getFlatIndex(): FlatArticle[] {
  if (_flatIndex) return _flatIndex;
  const out: FlatArticle[] = [];
  for (const section of GUIDES as GuideSection[]) {
    for (const article of section.articles) {
      const searchText = [
        section.title,
        section.category,
        article.title,
        article.summary,
        article.tags.join(" "),
        article.content,
      ]
        .join(" ")
        .toLowerCase();
      out.push({
        country: section.title,
        flag: section.flag,
        category: section.category,
        article,
        searchText,
      });
    }
  }
  _flatIndex = out;
  return out;
}

/**
 * Score every article against the query using simple keyword matching with
 * field-weighted scoring. Title matches count more than content matches.
 * Returns the top `k` results above a minimum score threshold.
 */
export function retrieveArticles(query: string, k = 3): RetrievedArticle[] {
  const tokens = tokenize(query);
  if (tokens.length === 0) return [];

  const index = getFlatIndex();
  const scored: Array<RetrievedArticle> = [];

  for (const entry of index) {
    let score = 0;
    const titleLower = entry.article.title.toLowerCase();
    const summaryLower = entry.article.summary.toLowerCase();
    const tagText = entry.article.tags.join(" ").toLowerCase();
    const countryLower = entry.country.toLowerCase();

    for (const token of tokens) {
      if (titleLower.includes(token)) score += 5;
      if (countryLower.includes(token)) score += 4;
      if (tagText.includes(token)) score += 3;
      if (summaryLower.includes(token)) score += 2;
      // body matches are cheap signal
      const bodyHits = entry.searchText.split(token).length - 1;
      score += Math.min(bodyHits, 3);
    }

    if (score < 4) continue;

    scored.push({
      country: entry.country,
      flag: entry.flag,
      category: entry.category,
      title: entry.article.title,
      summary: entry.article.summary,
      tags: entry.article.tags,
      sources: entry.article.sources,
      lastUpdated: entry.article.lastUpdated,
      score,
    });
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, k);
}

/**
 * Format retrieved articles into a system-prompt suffix for grounding.
 * The model is instructed to cite using bracketed numbers that match the
 * provided sources list.
 */
export function formatRetrievedAsContext(retrieved: RetrievedArticle[]): string {
  if (retrieved.length === 0) return "";

  const blocks = retrieved.map((r, i) => {
    const sourcesText = r.sources
      .slice(0, 3)
      .map((s) => `${s.label}: ${s.url}`)
      .join("; ");
    return `[${i + 1}] ${r.flag} ${r.country} — ${r.title}
Summary: ${r.summary}
Tags: ${r.tags.join(", ")}
Last updated: ${r.lastUpdated}
Authoritative sources: ${sourcesText}`;
  });

  return `\n\n═══════════════════════════════════════════════════════════════
RETRIEVED REFERENCE MATERIAL (from ZeroViza's guide library)
═══════════════════════════════════════════════════════════════

The following ZeroViza guide articles match the user's question. Use them as primary grounding for facts about fees, processing times, and procedural steps. When you reference a specific number or rule from this material, append the citation in brackets like [1] or [2] matching the numbered source below. Do not invent citations beyond what is listed here.

${blocks.join("\n\n")}

═══════════════════════════════════════════════════════════════
END OF RETRIEVED MATERIAL
═══════════════════════════════════════════════════════════════
`;
}
