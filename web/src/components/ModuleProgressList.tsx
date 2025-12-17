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

  return (
    <section>
      <h2>模块进度</h2>
      <p className="muted" style={{ marginTop: 8 }}>
        已完成 {doneCount}/{total}（本地保存：localStorage）
      </p>
      <div aria-hidden className="progress-bar">
        <div className="progress-bar-fill" style={{ width: `${Math.round(ratio * 100)}%` }} />
      </div>

      <ul className="task-list">
        {modules.map((m) => {
          const checked = Boolean(progress[m.id]);
          return (
            <li key={m.href} className="task-item">
              <input
                type="checkbox"
                checked={checked}
                onChange={(e) => {
                  const next = { ...progress, [m.id]: e.target.checked };
                  setProgress(next);
                  saveProgress(next);
                }}
              />
              <span className="task-meta">{m.id}</span>
              <Link href={m.href}>{m.title}</Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
