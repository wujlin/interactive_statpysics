import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import type { ReactNode } from "react";

import { KbTooltipLink } from "@/components/KbTooltipLink";
import { MdxPre } from "@/components/MdxPre";
import { InteractiveConcept } from "@/components/InteractiveConcept";
import { findKbPreviewByHref } from "@/lib/kb";

function plainText(node: ReactNode): string {
  if (node == null) return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(plainText).join("");
  if (typeof node === "object" && "props" in node) {
    const anyNode = node as { props?: { children?: ReactNode } };
    return plainText(anyNode.props?.children);
  }
  return "";
}

export function MdxArticle({ source }: { source: string }) {
  return (
    <article className="markdown">
      <MDXRemote
        source={source}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm, remarkMath],
            rehypePlugins: [rehypeKatex],
          },
        }}
        components={{
          h3: (props) => {
            const text = plainText(props.children).trim();
            const id = typeof (props as { id?: unknown }).id === "string" ? String((props as { id?: unknown }).id) : "";
            const nextId = id || (text.startsWith("SP-") ? text : undefined);
            return (
              <h3 {...props} id={nextId}>
                {props.children}
              </h3>
            );
          },
          a: (props) => {
            const href = typeof props.href === "string" ? props.href : "";
            if (href.startsWith("/kb/")) {
              const preview = findKbPreviewByHref(href);
              if (preview) {
                return (
                  <KbTooltipLink href={href} title={preview.title} hint={preview.hint}>
                    {props.children}
                  </KbTooltipLink>
                );
              }
            }
            if (href.startsWith("/")) return <Link href={href}>{props.children}</Link>;
            return <a {...props} />;
          },
          pre: (props) => <MdxPre {...props} />,
          InteractiveConcept: (props: { type: string }) => <InteractiveConcept {...props} />,
        }}
      />
    </article>
  );
}
