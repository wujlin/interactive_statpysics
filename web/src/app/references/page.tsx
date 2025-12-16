import Link from "next/link";

import { listReferenceDocs } from "@/lib/references";

export default function ReferencesIndexPage() {
  const docs = listReferenceDocs();

  return (
    <main className="container stack">
      <section className="card">
        <h1 className="page-title">References（文献与资源）</h1>
        <p className="kicker">
          对应仓库：<code>statphys_urban_learning/references</code>
        </p>
        <div className="toolbar" style={{ marginTop: 12 }}>
          <Link href="/">首页</Link>
          <Link href="/modules">Modules</Link>
          <Link href="/kb">KB</Link>
          <Link href="/exercises">Exercises</Link>
          <Link href="/projects">Projects</Link>
        </div>
      </section>

      <section className="card">
        <h2>目录</h2>
        <p className="muted" style={{ marginTop: 8 }}>
          {docs.length} 篇
        </p>
        <ul style={{ marginTop: 12, paddingLeft: 18 }}>
          {docs.map((d) => (
            <li key={d.relPath} style={{ margin: "8px 0" }}>
              <Link href={`/references/${encodeURIComponent(d.slug)}`}>{d.title}</Link>{" "}
              <span className="muted">
                · <code>{d.relPath}</code>
              </span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

