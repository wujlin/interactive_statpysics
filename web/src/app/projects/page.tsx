import Link from "next/link";

import { listProjects } from "@/lib/projects";

export default function ProjectsIndexPage() {
  const projects = listProjects();

  return (
    <main className="container stack">
      <section className="card">
        <h1 className="page-title">项目（Projects）</h1>
        <p className="kicker">
          对应仓库：<code>statphys_urban_learning/projects</code>
        </p>
        <div className="toolbar" style={{ marginTop: 12 }}>
          <Link href="/">首页</Link>
          <Link href="/modules">Modules</Link>
          <Link href="/checklist">Checklist</Link>
          <Link href="/kb">KB</Link>
          <Link href="/exercises">Exercises</Link>
        </div>
      </section>

      <section className="card">
        <h2>项目列表</h2>
        <p className="muted" style={{ marginTop: 8 }}>
          {projects.length} 个
        </p>
        <ul style={{ marginTop: 12, paddingLeft: 18 }}>
          {projects.map((p) => (
            <li key={p.slug} style={{ margin: "8px 0" }}>
              <Link href={`/projects/${encodeURIComponent(p.slug)}`}>{p.title}</Link>{" "}
              <span className="muted">
                · <code>{p.slug}</code>
              </span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

