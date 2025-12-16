import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

import { MdxPre } from "@/components/MdxPre";

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
          a: (props) => {
            const href = typeof props.href === "string" ? props.href : "";
            if (href.startsWith("/")) return <Link href={href}>{props.children}</Link>;
            return <a {...props} />;
          },
          pre: (props) => <MdxPre {...props} />,
        }}
      />
    </article>
  );
}

