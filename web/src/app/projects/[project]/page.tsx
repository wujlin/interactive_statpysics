import Link from "next/link";
import { notFound } from "next/navigation";

import { MdxArticle } from "@/components/MdxArticle";
import { preprocessModuleMarkdown } from "@/lib/markdown";
import { getProjectReadmeBySlug, listProjectNotebooks, listProjects, listProjectTests } from "@/lib/projects";

export function generateStaticParams() {
  return listProjects().map((p) => ({ project: p.slug }));
}

export default async function ProjectPage({ params }: { params: Promise<{ project: string }> }) {
  const { project } = await params;
  let doc: ReturnType<typeof getProjectReadmeBySlug>["doc"];
  let content: string;
  try {
    ({ doc, content } = getProjectReadmeBySlug(project));
  } catch {
    notFound();
  }

  const notebooks = listProjectNotebooks(doc.slug);
  const tests = listProjectTests(doc.slug);
  const source = preprocessModuleMarkdown(content);

  return (
    <main className="container stack">
      <section className="card">
        <div className="toolbar" style={{ justifyContent: "space-between" }}>
          <Link href="/projects">← 返回 Projects</Link>
          <Link href="/modules">Modules</Link>
        </div>
        <h1 className="page-title" style={{ marginTop: 12 }}>
          {doc.title}
        </h1>
        <p className="kicker">
          <code>{doc.relPath}</code>
        </p>
      </section>

      <section className="card">
        <h2 id="notebooks">Notebooks</h2>
        {notebooks.length ? (
          <ul style={{ marginTop: 12, paddingLeft: 18 }}>
            {notebooks.map((nb) => (
              <li key={nb.relPath} style={{ margin: "8px 0" }}>
                <Link href={`/projects/${encodeURIComponent(nb.project)}/notebooks/${encodeURIComponent(nb.slug)}`}>
                  {nb.title}
                </Link>{" "}
                <span className="muted">
                  · <code>{nb.relPath}</code>
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="muted" style={{ marginTop: 8 }}>
            未找到 notebooks
          </p>
        )}
      </section>

      <section className="card">
        <h2 id="tests">pytest</h2>
        {tests.length ? (
          <ul style={{ marginTop: 12, paddingLeft: 18 }}>
            {tests.map((p) => (
              <li key={p} style={{ margin: "8px 0" }}>
                <code>{p}</code>
              </li>
            ))}
          </ul>
        ) : (
          <p className="muted" style={{ marginTop: 8 }}>
            未找到 tests
          </p>
        )}
        <pre style={{ marginTop: 12, padding: 12, borderRadius: 10, overflow: "auto" }}>
          <code>{"cd statphys_urban_learning && pytest -q"}</code>
        </pre>
      </section>

      <section className="card">
        <MdxArticle source={source} />
      </section>
    </main>
  );
}
