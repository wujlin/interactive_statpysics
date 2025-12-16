import fs from "node:fs";
import path from "node:path";

import matter from "gray-matter";

import { KB_ROOT } from "@/lib/paths";

export type KbDoc = {
  id?: string;
  slug: string[];
  relPath: string;
  title: string;
  type?: string;
  tags?: string[];
  status?: string;
};

const SKIP_BASENAMES = new Set([".DS_Store"]);
const INCLUDE_UNDERSCORE_BASENAMES = new Set(["_notation_conventions.md"]);

type KbIndex = {
  docs: KbDoc[];
  titleToSlug: Map<string, string[]>;
};

let kbIndexCache: KbIndex | null = null;

function normalizeRelPath(relPath: string): string {
  return relPath.replaceAll("\\", "/");
}

function deriveKbType(relPath: string): string | undefined {
  const normalized = normalizeRelPath(relPath);
  if (normalized.startsWith("concepts/")) return "concept";
  if (normalized.startsWith("context/")) return "context";
  if (normalized.startsWith("derivations/")) return "derivation";
  if (normalized.startsWith("methods/")) return "method";
  if (normalized.startsWith("urban-mapping/")) return "urban_mapping";
  if (normalized.startsWith("sources/")) return "source";
  return undefined;
}

function walkMarkdownFiles(dirAbs: string, baseAbs: string): string[] {
  const entries = fs.readdirSync(dirAbs, { withFileTypes: true });
  const out: string[] = [];
  for (const ent of entries) {
    const abs = path.join(dirAbs, ent.name);
    if (ent.isDirectory()) {
      if (ent.name.startsWith(".")) continue;
      out.push(...walkMarkdownFiles(abs, baseAbs));
      continue;
    }
    if (!ent.isFile()) continue;
    if (SKIP_BASENAMES.has(ent.name)) continue;
    if (!ent.name.toLowerCase().endsWith(".md")) continue;
    if (ent.name.startsWith("_") && !INCLUDE_UNDERSCORE_BASENAMES.has(ent.name)) continue; // templates
    out.push(path.relative(baseAbs, abs));
  }
  return out;
}

function buildKbIndex(): KbIndex {
  if (!fs.existsSync(KB_ROOT)) {
    throw new Error(`KB root not found: ${KB_ROOT}`);
  }
  const relPaths = walkMarkdownFiles(KB_ROOT, KB_ROOT);
  const docs = relPaths.map((relPath) => {
    const absPath = path.join(KB_ROOT, relPath);
    const raw = fs.readFileSync(absPath, "utf-8");
    const parsed = matter(raw);

    const basename = path.basename(relPath, ".md");
    const slug = relPath.replace(/\.md$/i, "").split(path.sep);
    const derivedType = deriveKbType(relPath);
    const type = typeof parsed.data?.type === "string" ? parsed.data.type : derivedType;

    return {
      id: typeof parsed.data?.id === "string" ? parsed.data.id : undefined,
      slug,
      relPath: normalizeRelPath(relPath),
      title: String(parsed.data?.title ?? basename),
      type,
      tags: Array.isArray(parsed.data?.tags) ? (parsed.data.tags as string[]) : undefined,
      status: typeof parsed.data?.status === "string" ? parsed.data.status : undefined,
    } satisfies KbDoc;
  });

  docs.sort((a, b) => {
    const ta = a.type ?? "";
    const tb = b.type ?? "";
    if (ta !== tb) return ta.localeCompare(tb, "zh");
    return a.title.localeCompare(b.title, "zh");
  });

  const titleToSlug = new Map<string, string[]>();
  for (const d of docs) {
    const keys = new Set<string>();
    if (d.title.trim()) keys.add(d.title.trim());
    const basename = d.slug[d.slug.length - 1]?.trim();
    if (basename) keys.add(basename);
    const relKey = normalizeRelPath(d.relPath).replace(/\.md$/i, "");
    if (relKey) keys.add(relKey);
    for (const key of keys) {
      if (!titleToSlug.has(key)) titleToSlug.set(key, d.slug);
    }
  }

  return { docs, titleToSlug };
}

function getKbIndex(): KbIndex {
  // In development, always rebuild index to pick up new files immediately
  if (process.env.NODE_ENV === "development") {
    return buildKbIndex();
  }
  if (!kbIndexCache) kbIndexCache = buildKbIndex();
  return kbIndexCache;
}

export function listKbDocs(): KbDoc[] {
  return getKbIndex().docs;
}

function assertSafeSlug(slug: string[]) {
  for (const seg of slug) {
    if (!seg || seg === "." || seg === "..") throw new Error("invalid slug");
    if (seg.includes("/") || seg.includes("\\")) throw new Error("invalid slug");
  }
}

export function findKbSlugByTitle(title: string): string[] | undefined {
  return getKbIndex().titleToSlug.get(title.trim());
}

function safeDecodePathSegment(value: string): string {
  let out = value;
  for (let i = 0; i < 3; i++) {
    try {
      const decoded = decodeURIComponent(out);
      if (decoded === out) break;
      out = decoded;
    } catch {
      break;
    }
  }
  return out;
}

export function getKbDocBySlug(slug: string[]): { doc: KbDoc; content: string; data: Record<string, unknown> } {
  const decodedSlug = slug.map((s) => safeDecodePathSegment(String(s)));
  assertSafeSlug(decodedSlug);
  const relPath = path.join(...decodedSlug) + ".md";
  const absPath = path.join(KB_ROOT, relPath);
  if (!absPath.startsWith(KB_ROOT)) throw new Error("path traversal");
  const raw = fs.readFileSync(absPath, "utf-8");
  const parsed = matter(raw);
  const title = String(parsed.data?.title ?? decodedSlug[decodedSlug.length - 1]);
  const derivedType = deriveKbType(relPath);
  const type = typeof parsed.data?.type === "string" ? parsed.data.type : derivedType;
  const doc: KbDoc = {
    id: typeof parsed.data?.id === "string" ? parsed.data.id : undefined,
    slug: decodedSlug,
    relPath: normalizeRelPath(relPath),
    title,
    type,
    tags: Array.isArray(parsed.data?.tags) ? (parsed.data.tags as string[]) : undefined,
    status: typeof parsed.data?.status === "string" ? parsed.data.status : undefined,
  };
  return { doc, content: parsed.content, data: (parsed.data ?? {}) as Record<string, unknown> };
}
