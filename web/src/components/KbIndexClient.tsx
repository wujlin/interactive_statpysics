"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type KbDocItem = {
  slug: string[];
  relPath: string;
  title: string;
  type?: string;
  status?: string;
};

function groupLabel(type?: string): string {
  switch (type) {
    case "overview":
      return "Overview";
    case "source":
      return "Sources";
    case "context":
      return "Context";
    case "module":
      return "Modules";
    case "concept":
      return "Concepts";
    case "derivation":
      return "Derivations";
    case "method":
      return "Methods";
    case "urban_mapping":
      return "Urban Mappings";
    default:
      return type ? `Other: ${type}` : "Other";
  }
}

export function KbIndexClient({ docs }: { docs: KbDocItem[] }) {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return docs;
    return docs.filter((d) => d.title.toLowerCase().includes(query) || (d.type ?? "").toLowerCase().includes(query));
  }, [docs, q]);

  const grouped = useMemo(() => {
    const groups = new Map<string, KbDocItem[]>();
    for (const doc of filtered) {
      const key = groupLabel(doc.type);
      const arr = groups.get(key) ?? [];
      arr.push(doc);
      groups.set(key, arr);
    }
    for (const [k, arr] of groups) {
      arr.sort((a, b) => a.title.localeCompare(b.title, "zh"));
      groups.set(k, arr);
    }
    const orderedKeys = [
      "Overview",
      "Modules",
      "Sources",
      "Context",
      "Concepts",
      "Derivations",
      "Methods",
      "Urban Mappings",
      ...Array.from(groups.keys()).filter(
        (k) => !["Overview", "Modules", "Sources", "Context", "Concepts", "Derivations", "Methods", "Urban Mappings"].includes(k),
      ),
    ].filter((k, idx, arr) => arr.indexOf(k) === idx && groups.has(k));
    return { groups, orderedKeys };
  }, [filtered]);

  return (
    <main className="container stack">
      <section className="card">
        <h1 className="page-title">知识库（KB）</h1>
        <p className="kicker">
          内容来源：<code>statphys_urban_learning/kb</code>
        </p>

        <div className="toolbar" style={{ marginTop: 12 }}>
          <input
            className="input"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="搜索：熵 / MaxEnt / ensemble / ..."
          />
          <span className="muted">{filtered.length} 条</span>
        </div>
      </section>

      {grouped.orderedKeys.map((key) => (
        <section key={key} className="card">
          <h2>{key}</h2>
          <ul style={{ marginTop: 12, paddingLeft: 18 }}>
            {(grouped.groups.get(key) ?? []).map((doc) => (
              <li key={doc.relPath} style={{ margin: "8px 0" }}>
                <Link href={`/kb/${doc.slug.map((s) => encodeURIComponent(s)).join("/")}`}>{doc.title}</Link>
                {doc.status ? <span className="muted"> · {doc.status}</span> : null}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </main>
  );
}
