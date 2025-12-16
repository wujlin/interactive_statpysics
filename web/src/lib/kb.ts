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
  hint?: string;
  tags?: string[];
  status?: string;
};

export type KbPreview = {
  href: string;
  title: string;
  type?: string;
  hint?: string;
};

const SKIP_BASENAMES = new Set([".DS_Store"]);
const INCLUDE_UNDERSCORE_BASENAMES = new Set(["_notation_conventions.md"]);

type KbIndex = {
  docs: KbDoc[];
  titleToSlug: Map<string, string[]>;
  hrefToPreview: Map<string, KbPreview>;
};

let kbIndexCache: KbIndex | null = null;

function normalizeRelPath(relPath: string): string {
  return relPath.replaceAll("\\", "/");
}

function encodeSlug(slug: string[]): string {
  return slug.map((s) => encodeURIComponent(s)).join("/");
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

function cleanHintText(text: string): string {
  let out = text.trim();
  if (!out) return "";

  out = out
    .replace(/\[\[([^[\]]+)\]\]/g, (_m, inner: string) => {
      const raw = String(inner).trim();
      const parts = raw.split("|").map((s) => s.trim());
      return parts.length === 2 ? parts[1] : parts[0];
    })
    .replace(/\[([^\]]+)\]\([^)]+\)/g, (_m, label: string) => String(label))
    .replaceAll("`", "")
    .replaceAll("**", "")
    .replaceAll("*", "")
    .replaceAll("\\(", "")
    .replaceAll("\\)", "")
    .replaceAll("\\[", "")
    .replaceAll("\\]", "")
    .replace(/\s+/g, " ")
    .trim();

  const maxLen = 240;
  if (out.length > maxLen) out = out.slice(0, maxLen - 1).trimEnd() + "…";
  return out;
}

function extractKbHint(content: string): string | undefined {
  const lines = content.split("\n");

  function firstLineAfterHeading(headingRegex: RegExp): string | undefined {
    for (let i = 0; i < lines.length; i++) {
      const t = lines[i].trim();
      if (!t.startsWith("#")) continue; // Optimization: Must be a header
      if (!headingRegex.test(t)) continue;

      let j = i + 1;
      while (j < lines.length && !lines[j].trim()) j++;
      if (j >= lines.length) return undefined;

      const raw = lines[j].trim().replace(/^[-*]\s+/, "").replace(/^\d+[.)]\s+/, "");
      const cleaned = cleanHintText(raw);
      if (cleaned) return cleaned;
    }
    return undefined;
  }

  const hint =
    firstLineAfterHeading(/^##\s*一句话/) ??
    firstLineAfterHeading(/^##\s*TL[:;]?DR/i) ??
    firstLineAfterHeading(/^##\s*(核心)?目标/) ??
    firstLineAfterHeading(/^##\s*(Abstract|Summary|简介|概述)/i) ??
    (() => {
      for (const line of lines) {
        const t = line.trim();
        if (!t) continue;
        if (t.startsWith("#")) continue;
        if (t.startsWith("```") || t.startsWith("~~~")) continue;
        if (t.startsWith(">")) continue;
        // Don't take a short metadata line?
        if (t.startsWith("render_diffs")) continue;

        const cleaned = cleanHintText(t.replace(/^[-*]\s+/, ""));
        if (cleaned) return cleaned;
      }
      return undefined;
    })();

  return hint;
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
    const hint = extractKbHint(parsed.content);

    return {
      id: typeof parsed.data?.id === "string" ? parsed.data.id : undefined,
      slug,
      relPath: normalizeRelPath(relPath),
      title: String(parsed.data?.title ?? basename),
      type,
      hint,
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

  const hrefToPreview = new Map<string, KbPreview>();
  for (const d of docs) {
    const href = "/kb/" + encodeSlug(d.slug);
    hrefToPreview.set(href, { href, title: d.title, type: d.type, hint: d.hint });
  }

  return { docs, titleToSlug, hrefToPreview };
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

function normalizeHref(href: string): string {
  let out = href.split("#")[0]?.split("?")[0] ?? href;
  while (out.length > 1 && out.endsWith("/")) out = out.slice(0, -1);
  return out;
}

export function findKbPreviewByHref(href: string): KbPreview | undefined {
  const key = normalizeHref(href);
  return getKbIndex().hrefToPreview.get(key);
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
