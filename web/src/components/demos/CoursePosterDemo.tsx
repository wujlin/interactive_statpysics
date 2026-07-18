"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type LayerKey = "tractability" | "emergence" | "noneq";

type ModuleRef = {
  slug: string;
  label: string;
};

type ToolRow = {
  tool: string;
  solves: string;
  modules?: ModuleRef[];
};

function ChipLink({ href, children }: { href: string; children: string }) {
  return (
    <Link
      href={href}
      className="badge"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "4px 10px",
        borderRadius: 999,
      }}
    >
      {children}
    </Link>
  );
}

function ModuleChips({ modules }: { modules: ModuleRef[] }) {
  return (
    <span style={{ display: "inline-flex", flexWrap: "wrap", gap: 8 }}>
      {modules.map((m) => (
        <ChipLink key={m.slug} href={`/modules/${encodeURIComponent(m.slug)}`}>
          {m.label}
        </ChipLink>
      ))}
    </span>
  );
}

export function CoursePosterDemo() {
  const [layer, setLayer] = useState<LayerKey>("tractability");

  const title = useMemo(() => {
    switch (layer) {
      case "tractability":
        return { label: "可计算性（Tractability）", sub: "从 e^N 的穷举，走到可计算的生成函数与近似。", accent: "primary" as const };
      case "emergence":
        return { label: "涌现与普适性（Emergence & Universality）", sub: "为什么宏观规律“稳”，微观细节常常不重要？", accent: "accent" as const };
      case "noneq":
        return { label: "不可逆与非平衡（Irreversibility & Non-equilibrium）", sub: "平衡语言的边界在哪里？稳态≠平衡。", accent: "accent" as const };
    }
  }, [layer]);

  const toolRows: ToolRow[] = useMemo(
    () => [
      {
        tool: "系综（M2–M4）",
        solves: "把“态数 Ω ~ e^N 的计数”转写为可微的 ln Z；用导数生成宏观量与涨落。",
        modules: [
          { slug: "M2_microcanonical", label: "M2" },
          { slug: "M3_canonical_partition_function", label: "M3" },
          { slug: "M4_grand_canonical_variable_N", label: "M4" },
        ],
      },
      {
        tool: "平均场（M6）",
        solves: "把相互作用的 N 体问题近似成“独立的有效单体”，让 Z 可分解、F(m) 可比较。",
        modules: [{ slug: "M6_interactions_mean_field", label: "M6" }],
      },
      {
        tool: "RG（M7b）",
        solves: "识别哪些“自由度/微扰”能被积分掉而不改变宏观临界行为（relevant vs irrelevant）。",
        modules: [{ slug: "M7b_renormalization_group", label: "M7b" }],
      },
      {
        tool: "主方程 / Fokker–Planck（M8–M9）",
        solves: "把“轨迹怎么跳/怎么走”转写为“分布怎么演化”；用线性算子/偏微分方程替代枚举。",
        modules: [
          { slug: "M8_markov_master_equation", label: "M8" },
          { slug: "M9_fokker_planck_langevin", label: "M9" },
        ],
      },
      {
        tool: "MCMC（采样）",
        solves: "用马尔可夫链采样替代穷举：不必枚举所有态，也能估计期望、方差与敏感度。",
      },
    ],
    [],
  );

  return (
    <section className="ic-card">
      <div className="ic-header">
        <div>
          <div className="ic-title-main">课程海报：三层问题地图</div>
          <div className="ic-title-sub">
            这张海报回答一个定位问题：我们学的不只是“公式”，而是一套把微观随机性翻译成宏观规律的语言体系。
          </div>
        </div>
        <div className="ic-controls" aria-label="课程海报层级切换">
          <button
            className={`ic-btn ${layer === "tractability" ? "ic-btn-primary" : ""}`}
            type="button"
            onClick={() => setLayer("tractability")}
          >
            可计算性
          </button>
          <button
            className={`ic-btn ${layer === "emergence" ? "ic-btn-primary" : ""}`}
            type="button"
            onClick={() => setLayer("emergence")}
          >
            涌现/普适
          </button>
          <button className={`ic-btn ${layer === "noneq" ? "ic-btn-primary" : ""}`} type="button" onClick={() => setLayer("noneq")}>
            非平衡
          </button>
        </div>
      </div>

      <div className="markdown" style={{ marginTop: 12 }}>
        <p>
          <span
            className="badge"
            style={{
              borderColor: `color-mix(in oklab, var(--border), var(--${title.accent}) 35%)`,
              color: `var(--${title.accent})`,
              fontWeight: 700,
            }}
          >
            {title.label}
          </span>{" "}
          <span className="muted">{title.sub}</span>
        </p>

        {layer === "tractability" ? (
          <>
            <p>
              微观态数目经常是 <code>~ e^N</code>，直接求和/积分几乎永远不可能。主线工具的共同目标是：把“不可算”改写为“可算”。
            </p>
            <table>
              <thead>
                <tr>
                  <th style={{ width: "28%" }}>工具</th>
                  <th>解决的可计算性问题</th>
                </tr>
              </thead>
              <tbody>
                {toolRows.map((row) => (
                  <tr key={row.tool}>
                    <td>
                      <strong>{row.tool}</strong>
                      {row.modules ? (
                        <div style={{ marginTop: 8 }}>
                          <ModuleChips modules={row.modules} />
                        </div>
                      ) : null}
                    </td>
                    <td>{row.solves}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="muted">
              但可计算性只是“手段层”。下面两层回答的是更深的“为什么”：为什么宏观规律可靠？以及它何时会失效？
            </p>
          </>
        ) : null}

        {layer === "emergence" ? (
          <>
            <p>
              这一层问的是：为什么从 <code>10^23</code> 个自由度的混乱里，会涌现出稳定、可重复、甚至具有幂律的宏观规律？
            </p>
            <ul>
              <li>
                <strong>典型性（M2）</strong>：宏观“不抖”不是因为遍历，而是测度集中——“几乎所有”微观态都长得一样。
                <span style={{ marginLeft: 8 }}>
                  <ChipLink href="/modules/M2_microcanonical">M2</ChipLink>
                </span>
              </li>
              <li>
                <strong>涨落—响应（M5）</strong>：平衡动力学用自发涨落约束线性响应；指数族则用协方差给出静态参数敏感度。
                <span style={{ marginLeft: 8 }}>
                  <ChipLink href="/modules/M5_fluctuation_response_correlation">M5</ChipLink>
                </span>
              </li>
              <li>
                <strong>普适性（M7b）</strong>：不同微观细节共享同一组临界指数，因为粗粒化会把无关差异洗掉，只留下少数相关方向。
                <span style={{ marginLeft: 8 }}>
                  <ChipLink href="/modules/M7b_renormalization_group">M7b</ChipLink>
                </span>
              </li>
            </ul>
            <p className="muted">一句话：可算只是入口；“为什么算出来的东西能对上实验/数据”才是解释层的目标。</p>
          </>
        ) : null}

        {layer === "noneq" ? (
          <>
            <p>
              平衡态的语言（<code>Z</code>、<code>F</code>、<code>π</code>）很强，但它的边界也很清晰：很多系统被持续驱动，稳态分布可以不变，但仍有净流。
            </p>
            <ul>
              <li>
                <strong>主方程（M8）</strong>：回答“分布怎么随时间演化”“多久到稳态”“稳态是否细致平衡”；并用净流区分平衡稳态与 NESS。
                <span style={{ marginLeft: 8 }}>
                  <ChipLink href="/modules/M8_markov_master_equation">M8</ChipLink>
                </span>
              </li>
              <li>
                <strong>Langevin / Fokker–Planck（M9）</strong>：把离散跳变取连续极限；在“轨迹语言”和“分布语言”之间切换，并处理连续噪声。
                <span style={{ marginLeft: 8 }}>
                  <ChipLink href="/modules/M9_fokker_planck_langevin">M9</ChipLink>
                </span>
              </li>
              <li>
                <strong>NESS 与熵产生（M10）</strong>：从概率净流和路径倒放的不对称定义 Markov 不可逆性，并说明它何时才具有热力学含义。
                <span style={{ marginLeft: 8 }}>
                  <ChipLink href="/modules/M10_nonequilibrium_steady_state_entropy_production">M10</ChipLink>
                </span>
              </li>
              <li>
                <strong>FDT 违背与 Harada–Sasa（M11）</strong>：独立测量涨落谱与响应函数，把正确加权的差值转化为探针可见耗散。
                <span style={{ marginLeft: 8 }}>
                  <ChipLink href="/modules/M11_fdt_violation_harada_sasa">M11</ChipLink>
                </span>
              </li>
            </ul>
            <p className="muted">一句话：平衡可以用变分刻画；非平衡没有统一的变分原理——这是统计物理最核心的开放问题之一。</p>
          </>
        ) : null}

        <blockquote style={{ marginTop: 12 }}>
          课程主线一句话：如何从微观随机性推导出宏观确定性——包括平衡态（可算）、临界态（可理解）、以及远离平衡的稳态（可刻画）。
        </blockquote>
      </div>
    </section>
  );
}
