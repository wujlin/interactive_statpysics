import fs from "node:fs";

import Link from "next/link";

import { ChecklistProgressClient } from "@/components/ChecklistProgressClient";
import { MdxArticle } from "@/components/MdxArticle";
import { preprocessModuleMarkdown } from "@/lib/markdown";
import { CHECKLIST_PATH } from "@/lib/paths";

export default function ChecklistPage() {
  if (!fs.existsSync(CHECKLIST_PATH)) {
    return (
      <main className="container stack">
        <section className="card">
          <h1 className="page-title">Checklist</h1>
          <p className="kicker">
            未找到：<code>statphys_urban_learning/checklist.md</code>
          </p>
          <div className="toolbar" style={{ marginTop: 12 }}>
            <Link href="/">返回首页</Link>
          </div>
        </section>
      </main>
    );
  }

  const raw = fs.readFileSync(CHECKLIST_PATH, "utf-8");
  const source = preprocessModuleMarkdown(raw);
  return (
    <main className="container stack">
      <section className="card">
        <div className="toolbar" style={{ justifyContent: "space-between" }}>
          <Link href="/">← 返回首页</Link>
          <Link href="/modules">Modules</Link>
        </div>
        <h1 className="page-title" style={{ marginTop: 12 }}>
          Checklist（严格对齐版）
        </h1>
        <p className="kicker">
          <code>statphys_urban_learning/checklist.md</code>
        </p>
      </section>

      <section className="card">
        <ChecklistProgressClient markdown={raw} />
      </section>

      <section className="card">
        <details>
          <summary style={{ cursor: "pointer" }}>查看严格对齐清单（仓库硬标准）</summary>
          <MdxArticle source={source} />
        </details>
      </section>
    </main>
  );
}
