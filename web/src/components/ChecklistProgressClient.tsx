"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type ChecklistItem = {
  id: string;
  moduleId: string;
  text: string;
  relPath: string;
  href?: string;
};

type ChecklistModule = {
  id: string;
  title: string;
  items: ChecklistItem[];
};

const STORAGE_KEY = "statphys_checklist_progress_v1";

function safeParseJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function loadProgress(): Record<string, boolean> {
  if (typeof window === "undefined") return {};
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return {};
  const parsed = safeParseJson(raw);
  if (!parsed || typeof parsed !== "object") return {};
  const out: Record<string, boolean> = {};
  for (const [k, v] of Object.entries(parsed)) {
    if (typeof v === "boolean") out[k] = v;
  }
  return out;
}

function saveProgress(progress: Record<string, boolean>) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

function encodePathSegments(pathname: string): string {
  return pathname
    .split("/")
    .filter((s) => s.length > 0)
    .map((s) => encodeURIComponent(s))
    .join("/");
}

function hrefForRepoRelPath(relPath: string): string | undefined {
  const p = relPath.trim();

  if (p.startsWith("kb/") && p.toLowerCase().endsWith(".md")) {
    const rel = p.replace(/^kb\//, "").replace(/\.md$/i, "");
    return "/kb/" + encodePathSegments(rel);
  }
  if (p.startsWith("modules/") && p.toLowerCase().endsWith(".md")) {
    const slug = p.replace(/^modules\//, "").replace(/\.md$/i, "");
    return "/modules/" + encodeURIComponent(slug);
  }
  if (p.startsWith("exercises/written/") && p.toLowerCase().endsWith(".md")) {
    const slug = p.replace(/^exercises\/written\//, "").replace(/\.md$/i, "");
    return "/exercises/written/" + encodeURIComponent(slug);
  }
  if (p.startsWith("exercises/notebooks/") && p.toLowerCase().endsWith(".ipynb")) {
    const slug = p.replace(/^exercises\/notebooks\//, "").replace(/\.ipynb$/i, "");
    return "/exercises/notebooks/" + encodeURIComponent(slug);
  }

  const projDir = p.match(/^projects\/([^/]+)\/$/);
  if (projDir) return "/projects/" + encodeURIComponent(projDir[1]);

  const projReadme = p.match(/^projects\/([^/]+)\/README\.md$/i);
  if (projReadme) return "/projects/" + encodeURIComponent(projReadme[1]);

  const projNb = p.match(/^projects\/([^/]+)\/notebooks\/(.+)\.ipynb$/i);
  if (projNb) return `/projects/${encodeURIComponent(projNb[1])}/notebooks/${encodeURIComponent(projNb[2])}`;

  return undefined;
}

function parseChecklistMarkdown(markdown: string): ChecklistModule[] {
  const lines = markdown.split("\n");
  const modules: ChecklistModule[] = [];
  let current: ChecklistModule | null = null;

  for (const line of lines) {
    const header = line.match(/^##\s+(M\d+)\s*(.*)$/);
    if (header) {
      const id = header[1].toUpperCase();
      const title = `${id}${header[2] ? " " + header[2].trim() : ""}`;
      current = { id, title, items: [] };
      modules.push(current);
      continue;
    }

    if (!current) continue;

    const item = line.match(/^\s*-\s*\[[ xX]\]\s*(.*)$/);
    if (!item) continue;

    const text = item[1].trim();
    const relPathMatch = text.match(/`([^`]+)`/);
    if (!relPathMatch) continue;
    const relPath = relPathMatch[1].trim();

    const id = `${current.id}::${relPath}`;
    current.items.push({
      id,
      moduleId: current.id,
      text,
      relPath,
      href: hrefForRepoRelPath(relPath),
    });
  }

  return modules;
}

export function ChecklistProgressClient({ markdown }: { markdown: string }) {
  const modules = useMemo(() => parseChecklistMarkdown(markdown), [markdown]);
  const [progress, setProgress] = useState<Record<string, boolean>>(() => loadProgress());

  const allItems = useMemo(() => modules.flatMap((m) => m.items), [modules]);
  const doneCount = useMemo(() => allItems.filter((it) => progress[it.id]).length, [allItems, progress]);
  const total = allItems.length;
  const ratio = total > 0 ? doneCount / total : 0;

  return (
    <section>
      <div className="toolbar" style={{ justifyContent: "space-between" }}>
        <div>
          <h2>学习进度（子项）</h2>
          <p className="muted" style={{ marginTop: 8 }}>
            已完成 {doneCount}/{total}（本地保存：localStorage）
          </p>
        </div>
        <button
          type="button"
          className="input"
          style={{ flex: "0 0 auto", minWidth: 0, padding: "8px 10px", cursor: "pointer" }}
          onClick={() => {
            const ok = window.confirm("确认清空本地学习进度？");
            if (!ok) return;
            setProgress({});
            saveProgress({});
          }}
        >
          清空进度
        </button>
      </div>

      <div aria-hidden className="progress-bar">
        <div className="progress-bar-fill" style={{ width: `${Math.round(ratio * 100)}%` }} />
      </div>

      {modules.length === 0 ? (
        <p className="muted">未解析到模块段落（## M0...）。</p>
      ) : (
        modules.map((m) => {
          const mDone = m.items.filter((it) => progress[it.id]).length;
          const mTotal = m.items.length;
          const mRatio = mTotal > 0 ? mDone / mTotal : 0;

          return (
            <section key={m.id} className="card" style={{ padding: 12 }}>
              <div className="toolbar" style={{ justifyContent: "space-between" }}>
                <div>
                  <h3>{m.title}</h3>
                  <p className="muted" style={{ marginTop: 6 }}>
                    已完成 {mDone}/{mTotal}
                  </p>
                </div>
                <div style={{ width: 220 }}>
                  <div aria-hidden className="progress-bar" style={{ margin: 0 }}>
                    <div className="progress-bar-fill" style={{ width: `${Math.round(mRatio * 100)}%` }} />
                  </div>
                </div>
              </div>

              <ul className="task-list" style={{ marginTop: 12 }}>
                {m.items.map((it) => {
                  const checked = Boolean(progress[it.id]);
                  return (
                    <li key={it.id} className="task-item">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) => {
                          const next = { ...progress, [it.id]: e.target.checked };
                          setProgress(next);
                          saveProgress(next);
                        }}
                      />
                      <span className="task-meta">{m.id}</span>
                      {it.href ? (
                        <Link href={it.href}>
                          <code>{it.relPath}</code>
                        </Link>
                      ) : (
                        <code>{it.relPath}</code>
                      )}
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })
      )}
    </section>
  );
}

