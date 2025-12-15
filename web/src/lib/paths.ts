import path from "node:path";

export const REPO_ROOT = path.join(process.cwd(), "..");
export const STATPHYS_ROOT = path.join(REPO_ROOT, "statphys_urban_learning");

export const KB_ROOT = path.join(STATPHYS_ROOT, "kb");
export const MODULES_ROOT = path.join(STATPHYS_ROOT, "modules");
export const EXERCISES_ROOT = path.join(STATPHYS_ROOT, "exercises");
export const PROJECTS_ROOT = path.join(STATPHYS_ROOT, "projects");

export const CHECKLIST_PATH = path.join(STATPHYS_ROOT, "checklist.md");

