import Link from "next/link";
import { notFound } from "next/navigation";

import { MdxArticle } from "@/components/MdxArticle";
import { preprocessKbMarkdown } from "@/lib/markdown";
import { getKbDocBySlug, listKbDocs } from "@/lib/kb";

export function generateStaticParams() {
  return listKbDocs().map((d) => ({ slug: d.slug }));
}

export default function KbDocPage({ params }: { params: { slug: string[] } }) {
  let doc: ReturnType<typeof getKbDocBySlug>["doc"];
  let content: string;
  let data: Record<string, unknown>;
  try {
    ({ doc, content, data } = getKbDocBySlug(params.slug));
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
          <code>{doc.relPath}</code>
          {typeof data.type === "string" ? (
            <>
              {" "}
              · type: <code>{String(data.type)}</code>
            </>
          ) : null}
        </p>
      </section>

      <section className="card">
        <MdxArticle source={source} />
      </section>
    </main>
  );
}
