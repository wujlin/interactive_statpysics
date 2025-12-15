import fs from "node:fs";
import path from "node:path";

import { EXERCISES_ROOT } from "@/lib/paths";

export type WrittenExerciseDoc = {
  slug: string;
  relPath: string;
  title: string;
};

export type ExerciseNotebookDoc = {
  slug: string;
  relPath: string;
  title: string;
};

const WRITTEN_ROOT = path.join(EXERCISES_ROOT, "written");
const NOTEBOOKS_ROOT = path.join(EXERCISES_ROOT, "notebooks");

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

export function listWrittenExercises(): WrittenExerciseDoc[] {
  if (!fs.existsSync(WRITTEN_ROOT)) return [];
  const entries = fs.readdirSync(WRITTEN_ROOT, { withFileTypes: true });
  const docs: WrittenExerciseDoc[] = [];

  for (const ent of entries) {
    if (!ent.isFile()) continue;
    if (SKIP_BASENAMES.has(ent.name)) continue;
    if (!ent.name.toLowerCase().endsWith(".md")) continue;
    if (ent.name.startsWith("_")) continue;

    const slug = ent.name.replace(/\.md$/i, "");
    const absPath = path.join(WRITTEN_ROOT, ent.name);
    const raw = fs.readFileSync(absPath, "utf-8");
    const title = firstHeadingTitle(raw) ?? slug;
    docs.push({ slug, relPath: `exercises/written/${ent.name}`, title });
  }

  docs.sort((a, b) => a.slug.localeCompare(b.slug, "en"));
  return docs;
}

export function getWrittenExerciseBySlug(slug: string): { doc: WrittenExerciseDoc; content: string } {
  assertSafeSlug(slug);
  const filename = slug + ".md";
  const absPath = path.join(WRITTEN_ROOT, filename);
  if (!absPath.startsWith(WRITTEN_ROOT)) throw new Error("path traversal");
  const raw = fs.readFileSync(absPath, "utf-8");
  const title = firstHeadingTitle(raw) ?? slug;
  return { doc: { slug, relPath: `exercises/written/${filename}`, title }, content: raw };
}

export function listExerciseNotebooks(): ExerciseNotebookDoc[] {
  if (!fs.existsSync(NOTEBOOKS_ROOT)) return [];
  const entries = fs.readdirSync(NOTEBOOKS_ROOT, { withFileTypes: true });
  const docs: ExerciseNotebookDoc[] = [];

  for (const ent of entries) {
    if (!ent.isFile()) continue;
    if (SKIP_BASENAMES.has(ent.name)) continue;
    if (!ent.name.toLowerCase().endsWith(".ipynb")) continue;

    const slug = ent.name.replace(/\.ipynb$/i, "");
    docs.push({ slug, relPath: `exercises/notebooks/${ent.name}`, title: slug });
  }

  docs.sort((a, b) => a.slug.localeCompare(b.slug, "en"));
  return docs;
}

export function getExerciseNotebookBySlug(slug: string): { doc: ExerciseNotebookDoc; raw: string } {
  assertSafeSlug(slug);
  const filename = slug + ".ipynb";
  const absPath = path.join(NOTEBOOKS_ROOT, filename);
  if (!absPath.startsWith(NOTEBOOKS_ROOT)) throw new Error("path traversal");
  const raw = fs.readFileSync(absPath, "utf-8");
  return { doc: { slug, relPath: `exercises/notebooks/${filename}`, title: slug }, raw };
}

