import Link from "next/link";
import { notFound } from "next/navigation";

import { MdxArticle } from "@/components/MdxArticle";
import { preprocessKbMarkdown } from "@/lib/markdown";
import { getKbDocBySlug, listKbDocs } from "@/lib/kb";

export function generateStaticParams() {
  return listKbDocs().map((d) => ({ slug: d.slug }));
}

export default async function KbDocPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  let doc: ReturnType<typeof getKbDocBySlug>["doc"];
  let content: string;
  try {
    ({ doc, content } = getKbDocBySlug(slug));
  } catch {
    notFound();
  }

  const source = preprocessKbMarkdown(content);
  return (
    <main className="container stack">
      <section className="card">
        <div className="toolbar" style={{ justifyContent: "space-between" }}>
          <Link href="/kb">← 返回 KB</Link>
          <Link href="/modules">Modules</Link>
        </div>
        <h1 className="page-title" style={{ marginTop: 12 }}>
          {doc.title}
        </h1>
        {doc.type || (doc.tags && doc.tags.length > 0) ? (
          <details style={{ marginTop: 8 }}>
            <summary className="muted" style={{ cursor: "pointer" }}>
              元信息（type / tags）
            </summary>
            <p className="kicker" style={{ marginTop: 8 }}>
              {doc.type ? (
                <>
                  type: <code>{doc.type}</code>
                </>
              ) : null}
              {doc.tags && doc.tags.length > 0 ? (
                <>
                  {" "}
                  · tags:{" "}
                  <code>
                    {doc.tags.slice(0, 6).join(", ")}
                    {doc.tags.length > 6 ? "…" : ""}
                  </code>
                </>
              ) : null}
            </p>
          </details>
        ) : null}
      </section>

      <section className="card">
        <MdxArticle source={source} />
      </section>
    </main>
  );
}
