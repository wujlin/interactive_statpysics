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
      "Modules",
      "Concepts",
      "Derivations",
      "Methods",
      "Urban Mappings",
      ...Array.from(groups.keys()).filter(
        (k) => !["Modules", "Concepts", "Derivations", "Methods", "Urban Mappings"].includes(k),
      ),
    ].filter((k, idx, arr) => arr.indexOf(k) === idx && groups.has(k));
    return { groups, orderedKeys };
  }, [filtered]);

  return (
    <main style={{ padding: 24, maxWidth: 960, margin: "0 auto" }}>
      <h1>知识库（kb/）</h1>
      <p style={{ opacity: 0.8 }}>
        内容来源：<code>statphys_urban_learning/kb</code>
      </p>

      <div style={{ marginTop: 16, display: "flex", gap: 12, alignItems: "center" }}>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="搜索：熵 / MaxEnt / ensemble / ..."
          style={{
            flex: 1,
            padding: "10px 12px",
            borderRadius: 8,
            border: "1px solid rgba(127,127,127,0.35)",
            background: "transparent",
            color: "inherit",
          }}
        />
        <span style={{ opacity: 0.7 }}>{filtered.length} 条</span>
      </div>

      {grouped.orderedKeys.map((key) => (
        <section key={key} style={{ marginTop: 24 }}>
          <h2>{key}</h2>
          <ul>
            {(grouped.groups.get(key) ?? []).map((doc) => (
              <li key={doc.relPath}>
                <Link href={{ pathname: "/kb/" + doc.slug.join("/") }}>{doc.title}</Link>
                {doc.status ? <span style={{ marginLeft: 8, opacity: 0.7 }}>({doc.status})</span> : null}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </main>
  );
}

