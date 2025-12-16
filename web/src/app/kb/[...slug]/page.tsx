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
        <p className="kicker">
          {doc.type ? (
            <>
              type: <code>{doc.type}</code>
            </>
          ) : null}
        </p>
        <details style={{ marginTop: 8 }}>
          <summary className="muted" style={{ cursor: "pointer" }}>
            显示源文件路径
          </summary>
          <p className="kicker" style={{ marginTop: 8 }}>
            <code>kb/{doc.relPath}</code>
          </p>
        </details>
      </section>

      <section className="card">
        <MdxArticle source={source} />
      </section>
    </main>
  );
}
