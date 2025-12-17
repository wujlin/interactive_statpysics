import Link from "next/link";

import { MdxArticle } from "@/components/MdxArticle";
import { ModuleProgressList } from "@/components/ModuleProgressList";
import { preprocessModuleMarkdown } from "@/lib/markdown";
import { getModulesIndexMarkdown, listModuleDocs } from "@/lib/modules";

export default function ModulesIndexPage() {
  const modules = listModuleDocs().map((m) => ({
    id: m.id,
    title: m.title,
    href: "/modules/" + encodeURIComponent(m.slug),
  }));
  const indexMarkdown = getModulesIndexMarkdown();
  const indexSource = preprocessModuleMarkdown(indexMarkdown);

  return (
    <main className="container stack">
      <section className="card">
        <h1 className="page-title">学习路线（Modules）</h1>
        <p className="kicker">
          对应仓库：<code>statphys_urban_learning/modules</code>
        </p>
        <div className="toolbar" style={{ marginTop: 12 }}>
          <Link href="/">首页</Link>
          <Link href="/checklist">Checklist</Link>
          <Link href="/kb">KB</Link>
          <Link href="/exercises">Exercises</Link>
          <Link href="/projects">Projects</Link>
        </div>
      </section>

      <section className="card">
        <ModuleProgressList modules={modules} />
      </section>

      <section className="card">
        <h2>路线索引（modules/index.md）</h2>
        <div style={{ marginTop: 12 }}>
          <MdxArticle source={indexSource} />
        </div>
      </section>

      <section className="card">
        <h2>模块列表</h2>
        <ul style={{ marginTop: 12, paddingLeft: 18 }}>
          {modules.map((m) => (
            <li key={m.href} style={{ margin: "8px 0" }}>
              <Link href={m.href}>
                {m.id} — {m.title}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
