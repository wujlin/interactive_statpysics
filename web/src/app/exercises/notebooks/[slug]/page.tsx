import Link from "next/link";
import { notFound } from "next/navigation";

import { getExerciseNotebookBySlug, listExerciseNotebooks } from "@/lib/exercises";

export function generateStaticParams() {
  return listExerciseNotebooks().map((d) => ({ slug: d.slug }));
}

export default async function ExerciseNotebookPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let doc: ReturnType<typeof getExerciseNotebookBySlug>["doc"];
  let raw: string;
  try {
    ({ doc, raw } = getExerciseNotebookBySlug(slug));
  } catch {
    notFound();
  }

  return (
    <main className="container stack">
      <section className="card">
        <div className="toolbar" style={{ justifyContent: "space-between" }}>
          <Link href="/exercises">← 返回 Exercises</Link>
          <Link href="/modules">Modules</Link>
        </div>
        <h1 className="page-title" style={{ marginTop: 12 }}>
          Notebook: {doc.title}
        </h1>
        <p className="kicker">
          <code>{doc.relPath}</code>
        </p>
      </section>

      <section className="card">
        <h2>本地运行</h2>
        <p className="muted" style={{ marginTop: 8 }}>
          路线 A 不在网页内执行 Python；建议本地用 Jupyter 打开并运行。
        </p>
        <pre style={{ marginTop: 12, padding: 12, borderRadius: 10, overflow: "auto" }}>
          <code>{`cd statphys_urban_learning && jupyter lab ${doc.relPath}`}</code>
        </pre>
      </section>

      <section className="card">
        <details>
          <summary style={{ cursor: "pointer" }}>查看原始 ipynb（JSON）</summary>
          <pre style={{ marginTop: 12, padding: 12, borderRadius: 10, overflow: "auto" }}>
            <code>{raw}</code>
          </pre>
        </details>
      </section>
    </main>
  );
}
