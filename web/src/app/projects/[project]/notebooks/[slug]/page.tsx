import Link from "next/link";
import { notFound } from "next/navigation";

import { getProjectNotebookBySlug, listProjectNotebooks, listProjects } from "@/lib/projects";

export function generateStaticParams() {
  const projects = listProjects();
  return projects.flatMap((p) =>
    listProjectNotebooks(p.slug).map((nb) => ({
      project: p.slug,
      slug: nb.slug,
    })),
  );
}

export default async function ProjectNotebookPage({ params }: { params: Promise<{ project: string; slug: string }> }) {
  const { project, slug } = await params;
  let doc: ReturnType<typeof getProjectNotebookBySlug>["doc"];
  let raw: string;
  try {
    ({ doc, raw } = getProjectNotebookBySlug(project, slug));
  } catch {
    notFound();
  }

  return (
    <main className="container stack">
      <section className="card">
        <div className="toolbar" style={{ justifyContent: "space-between" }}>
          <Link href={`/projects/${encodeURIComponent(doc.project)}`}>← 返回 Project</Link>
          <Link href="/projects">Projects</Link>
        </div>
        <h1 className="page-title" style={{ marginTop: 12 }}>
          {doc.project} / Notebook: {doc.title}
        </h1>
        <details style={{ marginTop: 8 }}>
          <summary className="muted" style={{ cursor: "pointer" }}>
            显示源文件路径
          </summary>
          <p className="kicker" style={{ marginTop: 8 }}>
            <code>{doc.relPath}</code>
          </p>
        </details>
      </section>

      <section className="card">
        <h2>本地运行</h2>
        <p className="muted" style={{ marginTop: 8 }}>
          建议本地用 Jupyter 打开并运行（路线 A 不在网页内执行 Python）。
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
