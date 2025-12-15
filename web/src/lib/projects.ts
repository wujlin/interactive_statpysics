import fs from "node:fs";
import path from "node:path";

import { PROJECTS_ROOT } from "@/lib/paths";

export type ProjectDoc = {
  slug: string;
  relPath: string;
  title: string;
};

export type ProjectNotebookDoc = {
  project: string;
  slug: string;
  relPath: string;
  title: string;
};

const SKIP_BASENAMES = new Set([".DS_Store"]);

function assertSafeSeg(seg: string) {
  if (!seg || seg === "." || seg === "..") throw new Error("invalid segment");
  if (seg.includes("/") || seg.includes("\\")) throw new Error("invalid segment");
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

export function listProjects(): ProjectDoc[] {
  if (!fs.existsSync(PROJECTS_ROOT)) return [];
  const entries = fs.readdirSync(PROJECTS_ROOT, { withFileTypes: true });
  const docs: ProjectDoc[] = [];

  for (const ent of entries) {
    if (!ent.isDirectory()) continue;
    if (ent.name.startsWith(".")) continue;
    if (SKIP_BASENAMES.has(ent.name)) continue;

    const readmeAbs = path.join(PROJECTS_ROOT, ent.name, "README.md");
    if (!readmeAbs.startsWith(PROJECTS_ROOT)) continue;
    if (!fs.existsSync(readmeAbs)) continue;

    const raw = fs.readFileSync(readmeAbs, "utf-8");
    const title = firstHeadingTitle(raw) ?? ent.name;
    docs.push({ slug: ent.name, relPath: `projects/${ent.name}/README.md`, title });
  }

  docs.sort((a, b) => a.slug.localeCompare(b.slug, "en"));
  return docs;
}

export function getProjectReadmeBySlug(slug: string): { doc: ProjectDoc; content: string } {
  assertSafeSeg(slug);
  const readmeAbs = path.join(PROJECTS_ROOT, slug, "README.md");
  if (!readmeAbs.startsWith(PROJECTS_ROOT)) throw new Error("path traversal");
  const raw = fs.readFileSync(readmeAbs, "utf-8");
  const title = firstHeadingTitle(raw) ?? slug;
  return { doc: { slug, relPath: `projects/${slug}/README.md`, title }, content: raw };
}

export function listProjectNotebooks(project: string): ProjectNotebookDoc[] {
  assertSafeSeg(project);
  const notebooksAbs = path.join(PROJECTS_ROOT, project, "notebooks");
  if (!notebooksAbs.startsWith(PROJECTS_ROOT)) throw new Error("path traversal");
  if (!fs.existsSync(notebooksAbs)) return [];

  const entries = fs.readdirSync(notebooksAbs, { withFileTypes: true });
  const docs: ProjectNotebookDoc[] = [];
  for (const ent of entries) {
    if (!ent.isFile()) continue;
    if (SKIP_BASENAMES.has(ent.name)) continue;
    if (!ent.name.toLowerCase().endsWith(".ipynb")) continue;
    const slug = ent.name.replace(/\.ipynb$/i, "");
    docs.push({
      project,
      slug,
      relPath: `projects/${project}/notebooks/${ent.name}`,
      title: slug,
    });
  }

  docs.sort((a, b) => a.slug.localeCompare(b.slug, "en"));
  return docs;
}

export function getProjectNotebookBySlug(project: string, slug: string): { doc: ProjectNotebookDoc; raw: string } {
  assertSafeSeg(project);
  assertSafeSeg(slug);
  const filename = slug + ".ipynb";
  const absPath = path.join(PROJECTS_ROOT, project, "notebooks", filename);
  if (!absPath.startsWith(PROJECTS_ROOT)) throw new Error("path traversal");
  const raw = fs.readFileSync(absPath, "utf-8");
  return { doc: { project, slug, relPath: `projects/${project}/notebooks/${filename}`, title: slug }, raw };
}

export function listProjectTests(project: string): string[] {
  assertSafeSeg(project);
  const testsAbs = path.join(PROJECTS_ROOT, project, "tests");
  if (!testsAbs.startsWith(PROJECTS_ROOT)) throw new Error("path traversal");
  if (!fs.existsSync(testsAbs)) return [];
  const entries = fs.readdirSync(testsAbs, { withFileTypes: true });
  const out: string[] = [];
  for (const ent of entries) {
    if (!ent.isFile()) continue;
    if (SKIP_BASENAMES.has(ent.name)) continue;
    if (!ent.name.toLowerCase().endsWith(".py")) continue;
    out.push(`projects/${project}/tests/${ent.name}`);
  }
  out.sort((a, b) => a.localeCompare(b, "en"));
  return out;
}

