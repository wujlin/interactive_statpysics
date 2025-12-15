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
    <section style={{ marginTop: 24 }}>
      <h2>模块进度</h2>
      <p style={{ opacity: 0.8 }}>
        已完成 {doneCount}/{total}（本地保存：localStorage）
      </p>
      <div
        aria-hidden
        style={{
          height: 8,
          borderRadius: 999,
          background: "rgba(127,127,127,0.2)",
          overflow: "hidden",
          margin: "12px 0",
        }}
      >
        <div style={{ height: "100%", width: `${Math.round(ratio * 100)}%`, background: "rgba(80,120,255,0.8)" }} />
      </div>

      <ul style={{ marginTop: 8 }}>
        {modules.map((m) => {
          const checked = Boolean(progress[m.id]);
          return (
            <li key={m.id} style={{ display: "flex", gap: 12, alignItems: "center", margin: "8px 0" }}>
              <input
                type="checkbox"
                checked={checked}
                onChange={(e) => {
                  const next = { ...progress, [m.id]: e.target.checked };
                  setProgress(next);
                  saveProgress(next);
                }}
              />
              <span style={{ minWidth: 48, opacity: 0.8 }}>{m.id}</span>
              <Link href={m.href}>{m.title}</Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
