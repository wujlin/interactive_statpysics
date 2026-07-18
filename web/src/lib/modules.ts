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
  const m = slug.match(/^M\d+[a-z]?/i);
  if (!m) return slug;
  const raw = m[0];
  return raw[0].toUpperCase() + raw.slice(1);
}

type ParsedModuleId =
  | { kind: "module"; num: number; suffix: string }
  | { kind: "other"; key: string };

function parseModuleId(id: string): ParsedModuleId {
  const m = id.match(/^M(\d+)([a-z])?$/i);
  if (!m) return { kind: "other", key: id };
  return { kind: "module", num: Number(m[1]), suffix: (m[2] ?? "").toUpperCase() };
}

function compareModuleDocs(a: ModuleDoc, b: ModuleDoc): number {
  const pa = parseModuleId(a.id);
  const pb = parseModuleId(b.id);

  if (pa.kind !== pb.kind) return pa.kind === "module" ? -1 : 1;
  if (pa.kind === "other" && pb.kind === "other") {
    return pa.key.localeCompare(pb.key, "en");
  }
  if (pa.kind === "module" && pb.kind === "module") {
    if (pa.num !== pb.num) return pa.num - pb.num;
    if (pa.suffix === pb.suffix) return 0;
    if (!pa.suffix) return -1;
    if (!pb.suffix) return 1;
    return pa.suffix.localeCompare(pb.suffix, "en");
  }
  return 0;
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

  docs.sort(compareModuleDocs);
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
