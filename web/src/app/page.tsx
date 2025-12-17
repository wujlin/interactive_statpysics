import Link from "next/link";

import { LearningFlow } from "@/components/LearningFlow";
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
      <section className="card hero-card">
        <div className="hero-grid">
          <div className="hero-copy">
            <h1 className="page-title">StatPhys × Urban Learning</h1>
            <p className="kicker" style={{ marginTop: 10 }}>
              路线 A：阅读 + 检索 + 练习 + 项目，交互组件帮你串起推理节奏。
            </p>

            <ul className="hero-list">
              <li>即时进度：勾选同步到浏览器，回到页面继续上次位置。</li>
              <li>可视化互动：熵计数器等示例用动画展示关键概念。</li>
              <li>逻辑导航：按“路线 → KB → Exercises → Projects”顺序无缝衔接。</li>
            </ul>

            <div className="toolbar" style={{ marginTop: 14 }}>
              <Link href="/modules">Modules</Link>
              <Link href="/checklist">Checklist</Link>
              <Link href="/kb">KB</Link>
              <Link href="/exercises">Exercises</Link>
              <Link href="/projects">Projects</Link>
            </div>
          </div>

          <div className="hero-visual" aria-hidden>
            <div className="hero-bubble">交互</div>
            <div className="hero-bubble">动画</div>
            <div className="hero-bubble hero-bubble-strong">逻辑链</div>
            <div className="hero-meter">
              <div className="hero-meter-label">连贯度</div>
              <div className="hero-meter-bar">
                <span style={{ width: "86%" }} />
              </div>
              <div className="hero-meter-note">模块与 KB 双向跳转</div>
            </div>
          </div>
        </div>
      </section>

      <section className="card">
        <ModuleProgressList modules={modules} />
      </section>

      <section className="card">
        <LearningFlow />
      </section>
    </main>
  );
}
