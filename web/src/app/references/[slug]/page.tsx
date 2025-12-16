import Link from "next/link";
import { notFound } from "next/navigation";

import { MdxArticle } from "@/components/MdxArticle";
import { preprocessModuleMarkdown } from "@/lib/markdown";
import { getReferenceDocBySlug, listReferenceDocs } from "@/lib/references";

export function generateStaticParams() {
  return listReferenceDocs().map((d) => ({ slug: d.slug }));
}

export default async function ReferenceDocPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let doc: ReturnType<typeof getReferenceDocBySlug>["doc"];
  let content: string;
  try {
    ({ doc, content } = getReferenceDocBySlug(slug));
  } catch {
    notFound();
  }

  const source = preprocessModuleMarkdown(content);
  return (
    <main className="container stack">
      <section className="card">
        <div className="toolbar" style={{ justifyContent: "space-between" }}>
          <Link href="/references">← 返回 References</Link>
          <Link href="/modules">Modules</Link>
        </div>
        <h1 className="page-title" style={{ marginTop: 12 }}>
          {doc.title}
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
        <MdxArticle source={source} />
      </section>
    </main>
  );
}
