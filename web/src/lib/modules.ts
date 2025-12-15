import fs from "node:fs";
import path from "node:path";

import { MODULES_ROOT } from "@/lib/paths";

export type ModuleDoc = {
  id: string;
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

function deriveIdFromSlug(slug: string): string {
  const m = slug.match(/^M\d+/i);
  return m ? m[0].toUpperCase() : slug;
}

export function listModuleDocs(): ModuleDoc[] {
  if (!fs.existsSync(MODULES_ROOT)) {
    throw new Error(`Modules root not found: ${MODULES_ROOT}`);
  }
  const entries = fs.readdirSync(MODULES_ROOT, { withFileTypes: true });
  const docs: ModuleDoc[] = [];
  for (const ent of entries) {
    if (!ent.isFile()) continue;
    if (SKIP_BASENAMES.has(ent.name)) continue;
    if (!ent.name.toLowerCase().endsWith(".md")) continue;
    if (ent.name.startsWith("_")) continue;
    if (ent.name.toLowerCase() === "index.md") continue;

    const slug = ent.name.replace(/\.md$/i, "");
    const absPath = path.join(MODULES_ROOT, ent.name);
    const raw = fs.readFileSync(absPath, "utf-8");
    const title = firstHeadingTitle(raw) ?? slug;

    docs.push({
      id: deriveIdFromSlug(slug),
      slug,
      relPath: `modules/${ent.name}`,
      title,
    });
  }

  docs.sort((a, b) => a.id.localeCompare(b.id, "en"));
  return docs;
}

export function getModuleBySlug(slug: string): { doc: ModuleDoc; content: string } {
  assertSafeSlug(slug);
  const filename = slug + ".md";
  const absPath = path.join(MODULES_ROOT, filename);
  if (!absPath.startsWith(MODULES_ROOT)) throw new Error("path traversal");
  const raw = fs.readFileSync(absPath, "utf-8");
  const title = firstHeadingTitle(raw) ?? slug;
  return {
    doc: { id: deriveIdFromSlug(slug), slug, relPath: `modules/${filename}`, title },
    content: raw,
  };
}

export function getModulesIndexMarkdown(): string {
  const absPath = path.join(MODULES_ROOT, "index.md");
  if (!absPath.startsWith(MODULES_ROOT)) throw new Error("path traversal");
  return fs.readFileSync(absPath, "utf-8");
}
