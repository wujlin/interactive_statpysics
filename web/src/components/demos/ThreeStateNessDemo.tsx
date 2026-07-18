"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type ThemeColors = {
  text: string;
  muted: string;
  border: string;
  surface: string;
  primary: string;
  accent: string;
};

type Point = { x: number; y: number };

type Rates = {
  w12: number;
  w23: number;
  w31: number;
};

type FlowStats = {
  pi: [number, number, number];
  J12: number;
  J23: number;
  J31: number;
  affinity: number;
  sigma: number;
};

type Particle = { offset: number; speed: number };

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function formatNumber(x: number, digits = 4) {
  if (!Number.isFinite(x)) return "NaN";
  const abs = Math.abs(x);
  if (abs > 0 && (abs < 1e-3 || abs > 1e4)) return x.toExponential(2);
  return x.toFixed(digits);
}

function getThemeColors(): ThemeColors {
  const style = getComputedStyle(document.documentElement);
  return {
    text: style.getPropertyValue("--text").trim() || "#0f172a",
    muted: style.getPropertyValue("--text-muted").trim() || "rgba(15, 23, 42, 0.72)",
    border: style.getPropertyValue("--border").trim() || "rgba(15, 23, 42, 0.12)",
    surface: style.getPropertyValue("--surface-solid").trim() || "#ffffff",
    primary: style.getPropertyValue("--primary").trim() || "#4f46e5",
    accent: style.getPropertyValue("--accent").trim() || "#10b981",
  };
}

function applyCanvasSize(canvas: HTMLCanvasElement, cssW: number, cssH: number) {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.max(1, Math.floor(cssW * dpr));
  canvas.height = Math.max(1, Math.floor(cssH * dpr));
  const ctx = canvas.getContext("2d");
  if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return ctx;
}

function solveLinear3(A: number[][], b: number[]) {
  const M = A.map((row) => row.slice());
  const v = b.slice();
  const n = 3;
  const eps = 1e-12;

  for (let col = 0; col < n; col++) {
    let pivot = col;
    let best = Math.abs(M[col]![col]!);
    for (let r = col + 1; r < n; r++) {
      const val = Math.abs(M[r]![col]!);
      if (val > best) {
        best = val;
        pivot = r;
      }
    }
    if (best < eps) return null;
    if (pivot !== col) {
      [M[col], M[pivot]] = [M[pivot]!, M[col]!];
      [v[col], v[pivot]] = [v[pivot]!, v[col]!];
    }

    const diag = M[col]![col]!;
    for (let c = col; c < n; c++) M[col]![c] = M[col]![c]! / diag;
    v[col] /= diag;

    for (let r = 0; r < n; r++) {
      if (r === col) continue;
      const factor = M[r]![col]!;
      if (Math.abs(factor) < 1e-15) continue;
      for (let c = col; c < n; c++) M[r]![c] = M[r]![c]! - factor * M[col]![c]!;
      v[r] -= factor * v[col]!;
    }
  }

  return v as [number, number, number];
}

function computeThreeStateNess(r: Rates): FlowStats {
  const w12 = Math.max(1e-6, r.w12);
  const w23 = Math.max(1e-6, r.w23);
  const w31 = Math.max(1e-6, r.w31);

  // 反向速率固定为 1（最小化界面复杂度）
  const w21 = 1;
  const w32 = 1;
  const w13 = 1;

  // 状态 1,2,3 映射为 0,1,2
  const w01 = w12;
  const w12i = w23;
  const w20 = w31;
  const w10 = w21;
  const w21i = w32;
  const w02 = w13;

  const W00 = -(w01 + w02);
  const W11 = -(w10 + w12i);

  // 解 πW=0 + 归一化
  // (πW)_0 = π0 W00 + π1 W10 + π2 W20 = 0
  // (πW)_1 = π0 W01 + π1 W11 + π2 W21 = 0
  // π0+π1+π2=1
  const A = [
    [W00, w10, w20],
    [w01, W11, w21i],
    [1, 1, 1],
  ];
  const b = [0, 0, 1];
  const sol = solveLinear3(A, b) ?? [1 / 3, 1 / 3, 1 / 3];
  let pi0 = sol[0];
  let pi1 = sol[1];
  let pi2 = sol[2];

  const sum = pi0 + pi1 + pi2;
  if (sum > 0) {
    pi0 /= sum;
    pi1 /= sum;
    pi2 /= sum;
  }
  pi0 = clamp(pi0, 0, 1);
  pi1 = clamp(pi1, 0, 1);
  pi2 = clamp(pi2, 0, 1);
  const renorm = pi0 + pi1 + pi2;
  pi0 /= renorm;
  pi1 /= renorm;
  pi2 /= renorm;

  const J12 = pi0 * w01 - pi1 * w10;
  const J23 = pi1 * w12i - pi2 * w21i;
  const J31 = pi2 * w20 - pi0 * w02;

  const affinity = Math.log((w01 * w12i * w20) / (w10 * w21i * w02));

  // σ = 1/2 Σ_{i≠j} J_ij ln(π_i w_ij / (π_j w_ji))
  // 在三态环上可按每条无向边写一次：J_{i,i+1} ln(π_i w_{i,i+1}/(π_{i+1} w_{i+1,i}))
  const eps = 1e-12;
  const term12 = J12 * Math.log(Math.max(eps, (pi0 * w01) / (pi1 * w10)));
  const term23 = J23 * Math.log(Math.max(eps, (pi1 * w12i) / (pi2 * w21i)));
  const term31 = J31 * Math.log(Math.max(eps, (pi2 * w20) / (pi0 * w02)));
  const sigma = term12 + term23 + term31;

  return { pi: [pi0, pi1, pi2], J12, J23, J31, affinity, sigma };
}

function drawArrow(ctx: CanvasRenderingContext2D, a: Point, b: Point, width: number, color: string) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy);
  if (len < 1e-6) return;
  const ux = dx / len;
  const uy = dy / len;

  const head = clamp(10 + width * 2, 10, 18);
  const tail = 10;
  const ax = a.x + ux * tail;
  const ay = a.y + uy * tail;
  const bx = b.x - ux * head;
  const by = b.y - uy * head;

  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(ax, ay);
  ctx.lineTo(bx, by);
  ctx.stroke();

  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(bx, by);
  ctx.lineTo(bx - ux * head - uy * (head * 0.55), by - uy * head + ux * (head * 0.55));
  ctx.lineTo(bx - ux * head + uy * (head * 0.55), by - uy * head - ux * (head * 0.55));
  ctx.closePath();
  ctx.fill();
}

function pointOnSegment(a: Point, b: Point, t: number) {
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
}

function drawScene(
  ctx: CanvasRenderingContext2D,
  nodes: [Point, Point, Point],
  stats: FlowStats,
  particles: Particle[],
  theme: ThemeColors,
  dt: number,
) {
  const w = ctx.canvas.clientWidth;
  const h = ctx.canvas.clientHeight;
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = theme.surface;
  ctx.fillRect(0, 0, w, h);

  const J = (stats.J12 + stats.J23 + stats.J31) / 3;
  const dir = Math.abs(J) < 1e-9 ? 0 : J > 0 ? 1 : -1;
  const speedScale = clamp(Math.abs(J) * 6, 0, 1);

  const width = 2.5 + 4.5 * speedScale;
  const edgeColor = theme.primary;

  const cw = [
    [0, 1],
    [1, 2],
    [2, 0],
  ] as const;
  const ccw = [
    [1, 0],
    [2, 1],
    [0, 2],
  ] as const;
  const edges = dir >= 0 ? cw : ccw;

  for (const [i, j] of edges) drawArrow(ctx, nodes[i], nodes[j], width, edgeColor);

  // 粒子沿着“顺/逆时针”三条边跑一圈（仅用来增强直觉；prefers-reduced-motion 时会在外层停掉更新）
  const cycle = dir >= 0 ? cw : ccw;
  const segLen = [0, 0, 0];
  for (let k = 0; k < 3; k++) {
    const [i, j] = cycle[k]!;
    segLen[k] = Math.hypot(nodes[j].x - nodes[i].x, nodes[j].y - nodes[i].y);
  }
  const totalLen = segLen[0]! + segLen[1]! + segLen[2]!;

  for (const p of particles) {
    const speed = (0.22 + 0.9 * speedScale) * p.speed;
    p.offset = (p.offset + (dir === 0 ? 0 : speed * dt * 0.001)) % 1;

    const s = p.offset * totalLen;
    let seg = 0;
    let t = s;
    while (seg < 2 && t > segLen[seg]!) {
      t -= segLen[seg]!;
      seg++;
    }
    const [i, j] = cycle[seg]!;
    const pt = pointOnSegment(nodes[i], nodes[j], segLen[seg]! < 1e-6 ? 0 : t / segLen[seg]!);
    ctx.beginPath();
    ctx.fillStyle = theme.accent;
    ctx.globalAlpha = 0.85;
    ctx.arc(pt.x, pt.y, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  // nodes
  for (let i = 0; i < 3; i++) {
    const n = nodes[i]!;
    ctx.beginPath();
    ctx.fillStyle = theme.surface;
    ctx.strokeStyle = theme.border;
    ctx.lineWidth = 2;
    ctx.arc(n.x, n.y, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = theme.text;
    ctx.font = "12px var(--font-sans, system-ui)";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(String(i + 1), n.x, n.y);
  }

  ctx.fillStyle = theme.muted;
  ctx.font = "12px var(--font-sans, system-ui)";
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.fillText(dir === 0 ? "J≈0（细致平衡）" : dir > 0 ? "顺时针环流" : "逆时针环流", 12, h - 10);
}

export function ThreeStateNessDemo() {
  const [rates, setRates] = useState<Rates>({ w12: 1, w23: 1, w31: 1 });

  const stats = useMemo(() => computeThreeStateNess(rates), [rates]);
  const isDb = Math.abs(stats.affinity) < 1e-6 && Math.abs(stats.sigma) < 1e-6;

  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const themeRef = useRef<ThemeColors | null>(null);
  const nodesRef = useRef<[Point, Point, Point]>([
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
  ]);
  const statsRef = useRef<FlowStats>(stats);
  const particlesRef = useRef<Particle[]>([]);
  const lastRef = useRef<number | null>(null);
  const reduceMotionRef = useRef(false);

  useEffect(() => {
    statsRef.current = stats;
  }, [stats]);

  useEffect(() => {
    const media = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    const handler = () => {
      reduceMotionRef.current = Boolean(media?.matches);
    };
    handler();
    media?.addEventListener?.("change", handler);
    return () => media?.removeEventListener?.("change", handler);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    const containerEl = container;
    const canvasEl = canvas;

    function buildNodes(w: number, h: number) {
      const center = { x: w / 2, y: h / 2 + 4 };
      const radius = Math.min(w, h) * 0.34;
      const angles = [-90, 30, 150].map((a) => (a * Math.PI) / 180);
      const nodes = angles.map((a) => ({
        x: center.x + Math.cos(a) * radius,
        y: center.y + Math.sin(a) * radius,
      })) as [Point, Point, Point];
      nodesRef.current = nodes;
    }

    function resetParticles() {
      const count = clamp(Math.round((canvasEl.clientWidth * canvasEl.clientHeight) / 9000), 22, 56);
      particlesRef.current = Array.from({ length: count }, () => ({
        offset: Math.random(),
        speed: 0.6 + Math.random() * 0.9,
      }));
    }

    function resize() {
      themeRef.current = getThemeColors();
      const w = containerEl.clientWidth;
      const h = clamp(Math.round(w * 0.62), 220, 320);
      applyCanvasSize(canvasEl, w, h);
      buildNodes(w, h);
      resetParticles();
    }

    const ro = new ResizeObserver(resize);
    ro.observe(containerEl);
    resize();
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    let raf = 0;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const tick = (t: number) => {
      const last = lastRef.current;
      const dt = last == null ? 16 : t - last;
      lastRef.current = t;
      const theme = themeRef.current ?? getThemeColors();
      const nodes = nodesRef.current;
      const s = statsRef.current;
      const particles = particlesRef.current;

      drawScene(ctx, nodes, s, particles, theme, reduceMotionRef.current ? 0 : dt);
      raf = window.requestAnimationFrame(tick);
    };

    raf = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(raf);
  }, []);

  return (
    <section className="ic-card">
      <div className="ic-header">
        <div>
          <div className="ic-title-main">三态环流：稳态 ≠ 平衡（EPR 可量化）</div>
          <div className="ic-title-sub">
            固定反向速率为 <span className="ic-mono">1</span>，只调顺时针三条边的速率{" "}
            <span className="ic-mono">W12,W23,W31</span>。观察稳态{" "}
            <span className="ic-mono">π</span>、净流{" "}
            <span className="ic-mono">J</span> 与熵产生率{" "}
            <span className="ic-mono">σ</span> 如何变化。
          </div>
        </div>
      </div>

      <div className="ic-grid-2" style={{ marginTop: 12 }}>
        <div className="ic-controls" aria-label="三态环流参数">
          <label className="ic-slider">
            <div className="ic-slider-row">
              <span>W12</span>
              <span className="ic-mono">{formatNumber(rates.w12, 3)}</span>
            </div>
            <input
              type="range"
              min={0.2}
              max={5}
              step={0.02}
              value={rates.w12}
              onChange={(e) => setRates((r) => ({ ...r, w12: Number(e.target.value) }))}
            />
          </label>
          <label className="ic-slider">
            <div className="ic-slider-row">
              <span>W23</span>
              <span className="ic-mono">{formatNumber(rates.w23, 3)}</span>
            </div>
            <input
              type="range"
              min={0.2}
              max={5}
              step={0.02}
              value={rates.w23}
              onChange={(e) => setRates((r) => ({ ...r, w23: Number(e.target.value) }))}
            />
          </label>
          <label className="ic-slider">
            <div className="ic-slider-row">
              <span>W31</span>
              <span className="ic-mono">{formatNumber(rates.w31, 3)}</span>
            </div>
            <input
              type="range"
              min={0.2}
              max={5}
              step={0.02}
              value={rates.w31}
              onChange={(e) => setRates((r) => ({ ...r, w31: Number(e.target.value) }))}
            />
          </label>

          <div style={{ display: "flex", gap: 10, marginTop: 10, alignItems: "center", flexWrap: "wrap" }}>
            <button className="ic-btn" type="button" onClick={() => setRates({ w12: 1, w23: 1, w31: 1 })}>
              Reset（细致平衡）
            </button>
            <span
              className="badge"
              style={{
                borderColor: isDb ? "color-mix(in oklab, var(--border), var(--accent) 45%)" : "color-mix(in oklab, var(--border), var(--primary) 40%)",
                color: isDb ? "var(--accent)" : "var(--primary)",
                fontWeight: 700,
              }}
            >
              {isDb ? "σ≈0：平衡" : "σ>0：NESS"}
            </span>
          </div>

          <p className="ic-footnote" style={{ marginTop: 10 }}>
            三态环上，细致平衡等价于“环路亲和力”{" "}
            <span className="ic-mono">A = ln(∏cw/∏ccw)</span> 为 0（Kolmogorov 条件）。这里{" "}
            <span className="ic-mono">∏ccw=1</span>，因此{" "}
            <span className="ic-mono">A = ln(W12·W23·W31)</span>。
          </p>
        </div>

        <div ref={containerRef} className="ic-flow-panel">
          <canvas ref={canvasRef} className="ic-canvas" aria-label="Three-state NESS canvas" />
        </div>
      </div>

      <div className="ic-metrics">
        <div className="ic-metric">
          <div className="ic-metric-label">稳态 π（1,2,3）</div>
          <div className="ic-metric-value">
            <span className="ic-mono">
              [{formatNumber(stats.pi[0], 4)}, {formatNumber(stats.pi[1], 4)}, {formatNumber(stats.pi[2], 4)}]
            </span>
          </div>
        </div>

        <div className="ic-metric">
          <div className="ic-metric-label">净流 J（沿 1→2,2→3,3→1）</div>
          <div className="ic-metric-value">
            <span className="ic-mono">
              J12={formatNumber(stats.J12, 5)} | J23={formatNumber(stats.J23, 5)} | J31={formatNumber(stats.J31, 5)}
            </span>
          </div>
        </div>

        <div className="ic-metric">
          <div className="ic-metric-label">环路亲和力 A</div>
          <div className="ic-metric-value">
            <span className="ic-mono">{formatNumber(stats.affinity, 6)}</span>
          </div>
        </div>

        <div className="ic-metric">
          <div className="ic-metric-label">熵产生率 σ</div>
          <div className="ic-metric-value">
            <span className="ic-mono">{formatNumber(stats.sigma, 6)}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
