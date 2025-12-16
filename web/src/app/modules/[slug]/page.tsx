import Link from "next/link";
import { notFound } from "next/navigation";

import { MdxArticle } from "@/components/MdxArticle";
import { preprocessModuleMarkdown } from "@/lib/markdown";
import { getModuleBySlug, listModuleDocs } from "@/lib/modules";

export function generateStaticParams() {
  return listModuleDocs().map((m) => ({ slug: m.slug }));
}

export default async function ModulePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let doc: ReturnType<typeof getModuleBySlug>["doc"];
  let content: string;
  try {
    ({ doc, content } = getModuleBySlug(slug));
  } catch {
    notFound();
  }

  const source = preprocessModuleMarkdown(content);
  return (
    <main className="container stack">
      <section className="card">
        <div className="toolbar" style={{ justifyContent: "space-between" }}>
          <Link href="/modules">← 返回 Modules</Link>
          <Link href="/checklist">Checklist</Link>
        </div>
        <h1 className="page-title" style={{ marginTop: 12 }}>
          {doc.id}: {doc.title}
        </h1>
        <p className="kicker">
          <code>{doc.relPath}</code>
        </p>
      </section>

      <section className="card">
        <MdxArticle source={source} />
      </section>
    </main>
  );
}
