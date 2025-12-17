import Link from "next/link";

const steps = [
  {
    title: "从路线开始",
    desc: "按 M0–M9 逐步阅读，勾选同步进度。每一节都指向相应的本地 Markdown。",
    href: "/modules",
    accent: "modules",
    hint: "阅读 → 勾选 → 下一个",
  },
  {
    title: "随时查证",
    desc: "KB 内把概念、推导、方法分门别类，支持 [[双链]] 与公式渲染，维持推理连贯。",
    href: "/kb",
    accent: "kb",
    hint: "概念-推导-方法三件套",
  },
  {
    title: "动手练习",
    desc: "Exercises 页面聚合书面题与 notebooks，便于从计算到解释来回切换。",
    href: "/exercises",
    accent: "exercises",
    hint: "先算再讲",
  },
  {
    title: "项目验证",
    desc: "Projects 汇总 README、notebooks 与 pytest 用例，把思路落到城市复杂动力的应用上。",
    href: "/projects",
    accent: "projects",
    hint: "结果要能跑",
  },
];

export function LearningFlow() {
  return (
    <div className="flow-card">
      <header className="flow-header">
        <div>
          <p className="kicker">逻辑链路</p>
          <h2 className="flow-title">阅读 → 检索 → 练习 → 项目，一条线走到底</h2>
          <p className="muted" style={{ marginTop: 8 }}>
            把碎片化的知识点串起来：每个步骤都能跳转对应入口，避免学习顺序断档。
          </p>
        </div>
        <span className="flow-chip">交互提示：悬停卡片可预览节奏</span>
      </header>

      <div className="flow-grid">
        {steps.map((step, idx) => (
          <Link key={step.href} href={step.href} className={`flow-step flow-step-${step.accent}`}>
            <div className="flow-step-head">
              <span className="flow-index">{String(idx + 1).padStart(2, "0")}</span>
              <span className="flow-hint">{step.hint}</span>
            </div>
            <div className="flow-body">
              <h3>{step.title}</h3>
              <p className="muted">{step.desc}</p>
            </div>
            <div className="flow-footer" aria-hidden>
              <span>查看入口</span>
              <span className="flow-arrow">→</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
