"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type ModuleItem = {
  id: string;
  title: string;
  href: string;
};

const STORAGE_KEY = "statphys_progress_v1";

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

export function ModuleProgressList({ modules }: { modules: ModuleItem[] }) {
  const [progress, setProgress] = useState<Record<string, boolean>>(() => loadProgress());

  const doneCount = useMemo(() => modules.filter((m) => progress[m.id]).length, [modules, progress]);
  const total = modules.length;
  const ratio = total > 0 ? doneCount / total : 0;
  const percent = Math.round(ratio * 100);
  const hasProgress = useMemo(() => Object.values(progress).some(Boolean), [progress]);

  function toggle(id: string, value: boolean) {
    const next = { ...progress, [id]: value };
    setProgress(next);
    saveProgress(next);
  }

  function resetAll() {
    setProgress({});
    saveProgress({});
  }

  return (
    <section>
      <div className="progress-head">
        <div>
          <h2>模块进度</h2>
          <p className="muted" style={{ marginTop: 6 }}>
            本地保存（localStorage）。点击标题跳转，勾选保持节奏。
          </p>
        </div>
        <button className="ghost-button" onClick={resetAll} disabled={!hasProgress} type="button">
          重置进度
        </button>
      </div>

      <div className="progress-summary" role="status" aria-live="polite">
        <div>
          <div className="progress-figure">{percent}%</div>
          <div className="muted">已完成 {doneCount}/{total}</div>
        </div>
        <div className="progress-pill">
          <span className="pulse-dot" aria-hidden />
          实时同步到浏览器本地
        </div>
      </div>

      <div aria-hidden className="progress-bar">
        <div className="progress-bar-fill" style={{ width: `${percent}%` }} />
      </div>

      <ul className="task-list">
        {modules.map((m) => {
          const checked = Boolean(progress[m.id]);
          return (
            <li key={m.href} className={`task-item ${checked ? "task-item-done" : ""}`}>
              <input
                type="checkbox"
                aria-label={`${m.title} 是否完成`}
                checked={checked}
                onChange={(e) => toggle(m.id, e.target.checked)}
              />
              <span className="task-meta">{m.id}</span>
              <Link href={m.href} className="task-link">
                {m.title}
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
