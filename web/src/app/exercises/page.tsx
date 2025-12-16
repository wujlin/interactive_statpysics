import Link from "next/link";

import { listExerciseNotebooks, listExerciseSolutions, listWrittenExercises } from "@/lib/exercises";

export default function ExercisesIndexPage() {
  const written = listWrittenExercises();
  const notebooks = listExerciseNotebooks();
  const solutions = listExerciseSolutions();

  return (
    <main className="container stack">
      <section className="card">
        <h1 className="page-title">习题（Exercises）</h1>
        <p className="kicker">
          对应仓库：<code>statphys_urban_learning/exercises</code>
        </p>
        <div className="toolbar" style={{ marginTop: 12 }}>
          <Link href="/">首页</Link>
          <Link href="/modules">Modules</Link>
          <Link href="/checklist">Checklist</Link>
          <Link href="/kb">KB</Link>
          <Link href="/projects">Projects</Link>
        </div>
      </section>

      <section className="card">
        <h2>Written（手推/概念）</h2>
        <p className="muted" style={{ marginTop: 8 }}>
          {written.length} 篇
        </p>
        <ul style={{ marginTop: 12, paddingLeft: 18 }}>
          {written.map((d) => (
            <li key={d.relPath} style={{ margin: "8px 0" }}>
              <Link href={`/exercises/written/${encodeURIComponent(d.slug)}`}>{d.title}</Link>{" "}
              <span className="muted">
                · <code>{d.relPath}</code>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="card">
        <h2>Notebooks（可复现计算）</h2>
        <p className="muted" style={{ marginTop: 8 }}>
          {notebooks.length} 个（建议本地用 Jupyter 打开）
        </p>
        <ul style={{ marginTop: 12, paddingLeft: 18 }}>
          {notebooks.map((d) => (
            <li key={d.relPath} style={{ margin: "8px 0" }}>
              <Link href={`/exercises/notebooks/${encodeURIComponent(d.slug)}`}>{d.title}</Link>{" "}
              <span className="muted">
                · <code>{d.relPath}</code>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="card">
        <details>
          <summary style={{ cursor: "pointer" }}>Solutions（参考解答）</summary>
          <p className="muted" style={{ marginTop: 8 }}>
            建议先完成推导再对照；{solutions.length} 篇
          </p>
          <ul style={{ marginTop: 12, paddingLeft: 18 }}>
            {solutions.map((d) => (
              <li key={d.relPath} style={{ margin: "8px 0" }}>
                <Link href={`/exercises/solutions/${encodeURIComponent(d.slug)}`}>{d.title}</Link>{" "}
                <span className="muted">
                  · <code>{d.relPath}</code>
                </span>
              </li>
            ))}
          </ul>
        </details>
      </section>
    </main>
  );
}
