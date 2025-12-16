import fs from "node:fs";
import path from "node:path";

import { REFERENCES_ROOT } from "@/lib/paths";

export type ReferenceDoc = {
  slug: string;
  relPath: string;
  title: string;
};

const SKIP_BASENAMES = new Set([".DS_Store"]);

function assertSafeSlug(slug: string) {
  if (!slug || slug === "." || slug === "..") throw new Error("invalid slug");
  if (slug.includes("/") || slug.includes("\\")) throw new Error("invalid slug");
}

function firstHeadingTitle(markdown: string): string | undefined {
  for (const line of markdown.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (trimmed.startsWith("# ")) return trimmed.replace(/^#\s+/, "").trim();
    return undefined;
  }
  return undefined;
}

export function listReferenceDocs(): ReferenceDoc[] {
  if (!fs.existsSync(REFERENCES_ROOT)) return [];
  const entries = fs.readdirSync(REFERENCES_ROOT, { withFileTypes: true });
  const docs: ReferenceDoc[] = [];

  for (const ent of entries) {
    if (!ent.isFile()) continue;
    if (SKIP_BASENAMES.has(ent.name)) continue;
    if (!ent.name.toLowerCase().endsWith(".md")) continue;
    if (ent.name.startsWith("_")) continue;

    const slug = ent.name.replace(/\.md$/i, "");
    const absPath = path.join(REFERENCES_ROOT, ent.name);
    const raw = fs.readFileSync(absPath, "utf-8");
    const title = firstHeadingTitle(raw) ?? slug;
    docs.push({ slug, relPath: `references/${ent.name}`, title });
  }

  docs.sort((a, b) => a.slug.localeCompare(b.slug, "en"));
  return docs;
}

export function getReferenceDocBySlug(slug: string): { doc: ReferenceDoc; content: string } {
  assertSafeSlug(slug);
  const filename = slug + ".md";
  const absPath = path.join(REFERENCES_ROOT, filename);
  if (!absPath.startsWith(REFERENCES_ROOT)) throw new Error("path traversal");
  const raw = fs.readFileSync(absPath, "utf-8");
  const title = firstHeadingTitle(raw) ?? slug;
  return { doc: { slug, relPath: `references/${filename}`, title }, content: raw };
}

