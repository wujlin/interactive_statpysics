"use client";

import { useEffect, useId, useMemo, useState } from "react";

function normalizeMermaidId(id: string): string {
  return id.replace(/[^a-zA-Z0-9_-]/g, "_");
}

export function MermaidDiagram({ code }: { code: string }) {
  const reactId = useId();
  const renderId = useMemo(() => `mmd_${normalizeMermaidId(reactId)}`, [reactId]);
  const [svg, setSvg] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    let cancelled = false;
    async function run() {
      const src = code.trim();
      if (!src) return;

      try {
        const mermaidModule = await import("mermaid");
        const mermaid = mermaidModule.default;

        const isDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: "strict",
          theme: isDark ? "dark" : "neutral",
        });

        const rendered = await mermaid.render(renderId, src);
        if (cancelled) return;
        setSvg(rendered.svg ?? "");
        setError("");
      } catch (e) {
        if (cancelled) return;
        setSvg("");
        setError(e instanceof Error ? e.message : String(e));
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [code, renderId]);

  if (error) {
    return (
      <pre>
        <code>{code.trim()}</code>
        <div className="muted" style={{ marginTop: 8 }}>
          Mermaid 渲染失败：{error}
        </div>
      </pre>
    );
  }

  if (!svg) {
    return (
      <pre>
        <code>{code.trim()}</code>
      </pre>
    );
  }

  return <div className="mermaid-diagram" dangerouslySetInnerHTML={{ __html: svg }} />;
}

