import Link from "next/link";

import { ModuleProgressList } from "@/components/ModuleProgressList";
import { listKbDocs } from "@/lib/kb";

export default function Home() {
  const modules = listKbDocs()
    .filter((d) => d.type === "module" && typeof d.id === "string")
    .map((d) => ({
      id: d.id as string,
      title: d.title,
      href: "/kb/" + d.slug.join("/"),
    }))
    .sort((a, b) => a.id.localeCompare(b.id));

  return (
    <main style={{ padding: 24, maxWidth: 960, margin: "0 auto" }}>
      <h1>StatPhys × Urban Learning</h1>
      <p style={{ opacity: 0.8 }}>
        路线 A（阅读 + 检索 + 进度）前端 MVP：先把仓库里的知识库（<code>kb/</code>）变成可浏览的网站。
      </p>
      <ul>
        <li>
          <Link href="/kb">打开知识库</Link>
        </li>
      </ul>

      <ModuleProgressList modules={modules} />
    </main>
  );
}
