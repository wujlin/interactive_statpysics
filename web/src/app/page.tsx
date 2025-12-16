import Link from "next/link";

import { ModuleProgressList } from "@/components/ModuleProgressList";
import { listModuleDocs } from "@/lib/modules";

export default function Home() {
  const modules = listModuleDocs().map((m) => ({
    id: m.id,
    title: m.title,
    href: "/modules/" + encodeURIComponent(m.slug),
  }));

  return (
    <main className="container stack">
      <section className="card">
        <h1 className="page-title">StatPhys × Urban Learning</h1>
        <p className="kicker">
          路线 A：阅读 + 检索 + 进度；代码验证走本地 <code>pytest</code>。
        </p>
        <div className="toolbar" style={{ marginTop: 12 }}>
          <Link href="/modules">Modules</Link>
          <Link href="/checklist">Checklist</Link>
          <Link href="/kb">KB</Link>
          <Link href="/exercises">Exercises</Link>
          <Link href="/projects">Projects</Link>
        </div>
      </section>

      <section className="card">
        <ModuleProgressList modules={modules} />
      </section>
    </main>
  );
}
