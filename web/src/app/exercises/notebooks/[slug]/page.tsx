import Link from "next/link";
import { notFound } from "next/navigation";

import { IsingCriticalSignalsDemo } from "@/components/demos/IsingCriticalSignalsDemo";
import { IsingMcmcRealtimeDemo } from "@/components/demos/IsingMcmcRealtimeDemo";
import { MaxEntDiceDemo } from "@/components/demos/MaxEntDiceDemo";
import { OdSensitivityDemo } from "@/components/demos/OdSensitivityDemo";
import { getExerciseNotebookBySlug, listExerciseNotebooks } from "@/lib/exercises";

export function generateStaticParams() {
  return listExerciseNotebooks().map((d) => ({ slug: d.slug }));
}

export default async function ExerciseNotebookPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let doc: ReturnType<typeof getExerciseNotebookBySlug>["doc"];
  let raw: string;
  try {
    ({ doc, raw } = getExerciseNotebookBySlug(slug));
  } catch {
    notFound();
  }

  const hasInteractiveDemo =
    slug === "E01_maxent_discrete_numeric" ||
    slug === "E05_sensitivity_od" ||
    slug === "E06_ising_mcmc" ||
    slug === "E07_ising_critical_signals";

  return (
    <main className="container stack">
      <section className="card">
        <div className="toolbar" style={{ justifyContent: "space-between" }}>
          <Link href="/exercises">← 返回 Exercises</Link>
          <Link href="/modules">Modules</Link>
        </div>
        <h1 className="page-title" style={{ marginTop: 12 }}>
          Notebook: {doc.title}
        </h1>
        <details style={{ marginTop: 8 }}>
          <summary className="muted" style={{ cursor: "pointer" }}>
            显示源文件路径
          </summary>
          <p className="kicker" style={{ marginTop: 8 }}>
            <code>{doc.relPath}</code>
          </p>
        </details>
      </section>

      {slug === "E01_maxent_discrete_numeric" ? (
        <section className="stack">
          <MaxEntDiceDemo />
        </section>
      ) : null}

      {slug === "E05_sensitivity_od" ? (
        <section className="stack">
          <OdSensitivityDemo />
        </section>
      ) : null}

      {slug === "E06_ising_mcmc" ? (
        <section className="stack">
          <IsingMcmcRealtimeDemo />
        </section>
      ) : null}

      {slug === "E07_ising_critical_signals" ? (
        <section className="stack">
          <IsingCriticalSignalsDemo />
        </section>
      ) : null}

      <section className="card">
        <h2>本地运行</h2>
        <p className="muted" style={{ marginTop: 8 }}>
          {hasInteractiveDemo
            ? "网页已提供交互版（不执行 Python）；若要复现/改代码，请本地用 Jupyter 打开并运行。"
            : "路线 A 不在网页内执行 Python；建议本地用 Jupyter 打开并运行。"}
        </p>
        <pre style={{ marginTop: 12, padding: 12, borderRadius: 10, overflow: "auto" }}>
          <code>{`cd statphys_urban_learning && jupyter lab ${doc.relPath}`}</code>
        </pre>
      </section>

      <section className="card">
        <details>
          <summary style={{ cursor: "pointer" }}>查看原始 ipynb（JSON）</summary>
          <pre style={{ marginTop: 12, padding: 12, borderRadius: 10, overflow: "auto" }}>
            <code>{raw}</code>
          </pre>
        </details>
      </section>
    </main>
  );
}
