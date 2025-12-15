import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

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
    <main style={{ padding: 24, maxWidth: 960, margin: "0 auto" }}>
      <p style={{ marginBottom: 12 }}>
        <Link href="/kb">← 返回目录</Link>
      </p>
      <h1>{doc.title}</h1>
      <p style={{ opacity: 0.7, marginTop: 8 }}>
        <code>{doc.relPath}</code>
      </p>
      {typeof data.type === "string" ? (
        <p style={{ opacity: 0.7, marginTop: 8 }}>
          type: <code>{String(data.type)}</code>
        </p>
      ) : null}

      <article className="markdown" style={{ marginTop: 16 }}>
        <MDXRemote
          source={source}
          options={{
            mdxOptions: {
              remarkPlugins: [remarkGfm, remarkMath],
              rehypePlugins: [rehypeKatex],
            },
          }}
          components={{
            a: (props) => {
              const href = typeof props.href === "string" ? props.href : "";
              if (href.startsWith("/")) {
                return <Link href={href}>{props.children}</Link>;
              }
              return <a {...props} />;
            },
          }}
        />
      </article>
    </main>
  );
}
