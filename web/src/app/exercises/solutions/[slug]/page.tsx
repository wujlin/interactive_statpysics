import Link from "next/link";
import { notFound } from "next/navigation";

import { MdxArticle } from "@/components/MdxArticle";
import { preprocessModuleMarkdown } from "@/lib/markdown";
import { getExerciseSolutionBySlug, listExerciseSolutions } from "@/lib/exercises";

export function generateStaticParams() {
  return listExerciseSolutions().map((d) => ({ slug: d.slug }));
}

export default function ExerciseSolutionPage({ params }: { params: { slug: string } }) {
  let doc: ReturnType<typeof getExerciseSolutionBySlug>["doc"];
  let content: string;
  try {
    ({ doc, content } = getExerciseSolutionBySlug(params.slug));
  } catch {
    notFound();
  }

  const source = preprocessModuleMarkdown(content);

  return (
    <main className="container stack">
      <section className="card">
        <div className="toolbar" style={{ justifyContent: "space-between" }}>
          <Link href="/exercises">← 返回 Exercises</Link>
          <Link href="/modules">Modules</Link>
        </div>
        <h1 className="page-title" style={{ marginTop: 12 }}>
          参考解答：{doc.title}
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
