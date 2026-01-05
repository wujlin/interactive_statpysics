"use client";

import katex from "katex";
import type { ReactNode } from "react";
import { useEffect, useMemo, useRef, useState } from "react";

type Rect = { x: number; y: number; w: number; h: number };
type Point = { x: number; y: number };
type ThemeColors = {
  text: string;
  muted: string;
  border: string;
  surface: string;
  primary: string;
  accent: string;
};

type Particle = {
  side: 0 | 1; // 0=left, 1=right
  x: number;
  y: number;
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  moveStartMs: number;
  moveDurationMs: number;
  moving: boolean;
};

type HistoryPoint = { t: number; s: number };
type FlowParticle = { offset: number; speed: number };

const MIN_N = 20;
const MAX_N = 200;
const DEFAULT_N = 50;

const LN2 = Math.log(2);
const LOG10_2 = Math.log10(2);
const LOG10_SECONDS_PER_YEAR = Math.log10(60 * 60 * 24 * 365.25);

const LOG_FACTORIAL = (() => {
  const arr = new Array(MAX_N + 1).fill(0);
  for (let i = 2; i <= MAX_N; i++) arr[i] = arr[i - 1] + Math.log(i);
  return arr;
})();

function logBinomial(n: number, k: number): number {
  if (k < 0 || k > n) return Number.NEGATIVE_INFINITY;
  return LOG_FACTORIAL[n] - LOG_FACTORIAL[k] - LOG_FACTORIAL[n - k];
}

function normalizedEntropy(n: number, left: number): number {
  if (n <= 0) return 0;
  const logOmega = logBinomial(n, left);
  return logOmega / (n * LN2);
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function sampleExpSeconds(rate: number): number {
  const u = Math.max(Number.EPSILON, Math.random());
  return -Math.log(u) / rate;
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

function MathInline({ tex, className }: { tex: string; className?: string }) {
  const html = useMemo(() => {
    try {
      return katex.renderToString(tex, { throwOnError: false, displayMode: false });
    } catch {
      return tex;
    }
  }, [tex]);
  return <span className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}

function roundRectPath(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  const radius = Math.max(0, Math.min(r, w / 2, h / 2));
  const anyCtx = ctx as unknown as { roundRect?: (x: number, y: number, w: number, h: number, radii?: number) => void };
  if (typeof anyCtx.roundRect === "function") {
    anyCtx.roundRect(x, y, w, h, radius);
    return;
  }
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

function applyCanvasSize(canvas: HTMLCanvasElement, cssW: number, cssH: number) {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.max(1, Math.floor(cssW * dpr));
  canvas.height = Math.max(1, Math.floor(cssH * dpr));
  canvas.style.width = `${cssW}px`;
  canvas.style.height = `${cssH}px`;

  const ctx = canvas.getContext("2d");
  if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return ctx;
}

function computeSlots(n: number): { cols: number; rows: number; u: number[]; v: number[] } {
  const cols = Math.max(4, Math.ceil(Math.sqrt(n)));
  const rows = Math.max(1, Math.ceil(n / cols));
  const u: number[] = new Array(n);
  const v: number[] = new Array(n);
  for (let i = 0; i < n; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    u[i] = (col + 0.5) / cols;
    v[i] = (row + 0.5) / rows;
  }
  return { cols, rows, u, v };
}

function targetPos(i: number, side: 0 | 1, layout: { left: Rect; right: Rect; padding: number; slots: any }) {
  const box = side === 0 ? layout.left : layout.right;
  const u = layout.slots.u[i] ?? 0.5;
  const v = layout.slots.v[i] ?? 0.5;
  const x = box.x + layout.padding + u * (box.w - 2 * layout.padding);
  const y = box.y + layout.padding + v * (box.h - 2 * layout.padding);
  return { x, y };
}

function buildLayout(n: number, w: number, h: number) {
  const margin = 14;
  const gap = 12;
  const padding = 12;
  const boxW = (w - margin * 2 - gap) / 2;
  const boxH = h - margin * 2;
  const left: Rect = { x: margin, y: margin, w: boxW, h: boxH };
  const right: Rect = { x: margin + boxW + gap, y: margin, w: boxW, h: boxH };
  const slots = computeSlots(n);
  const radius = clamp(Math.min(boxW / (slots.cols * 2.2), boxH / (slots.rows * 2.2)), 2.2, 6.5);
  return { left, right, padding, gap, margin, slots, radius };
}

/**
 * M1: 熵计数器（Ehrenfest 两盒模型）
 * - Poisson 事件：随机选一个粒子跨盒
 * - Canvas 渲染：平滑跨越 + 实时熵曲线
 */
function EntropyCounter() {
  const [n, setN] = useState(DEFAULT_N);
  const [isRunning, setIsRunning] = useState(false);
  const [leftCount, setLeftCount] = useState(DEFAULT_N);
  const [sNorm, setSNorm] = useState(0);
  const [toast, setToast] = useState<ReactNode | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const simCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const plotCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const themeRef = useRef<ThemeColors | null>(null);
  const layoutRef = useRef<ReturnType<typeof buildLayout> | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const historyRef = useRef<HistoryPoint[]>([]);

  const runningRef = useRef(false);
  const leftCountRef = useRef(DEFAULT_N);
  const sNormRef = useRef(0);
  const simTimeRef = useRef(0);
  const lastFrameMsRef = useRef<number | null>(null);
  const jumpAccumulatorRef = useRef(0);
  const nextJumpDelayRef = useRef(0.15);
  const toastTimerRef = useRef<number | null>(null);

  const jumpRate = 10; // events per second
  const moveDurationMs = 420;

  function showToast(node: ReactNode) {
    setToast(node);
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    toastTimerRef.current = window.setTimeout(() => setToast(null), 5200);
  }

  function syncUiFromRefs() {
    setLeftCount(leftCountRef.current);
    setSNorm(sNormRef.current);
  }

  function resetAll(nextN = n) {
    runningRef.current = false;
    setIsRunning(false);
    setN(nextN);

    simTimeRef.current = 0;
    jumpAccumulatorRef.current = 0;
    nextJumpDelayRef.current = sampleExpSeconds(jumpRate);

    leftCountRef.current = nextN;
    sNormRef.current = 0;
    historyRef.current = [{ t: 0, s: 0 }];

    const layout = layoutRef.current;
    if (!layout) return;
    const nowMs = performance.now();
    particlesRef.current = Array.from({ length: nextN }, (_v, i) => {
      const p = targetPos(i, 0, layout);
      return {
        side: 0,
        x: p.x,
        y: p.y,
        fromX: p.x,
        fromY: p.y,
        toX: p.x,
        toY: p.y,
        moveStartMs: nowMs,
        moveDurationMs,
        moving: false,
      };
    });

    syncUiFromRefs();
  }

  function performJump(nowMs: number) {
    const layout = layoutRef.current;
    if (!layout) return;
    const particles = particlesRef.current;
    if (!particles.length) return;

    const idx = Math.floor(Math.random() * particles.length);
    const p = particles[idx];
    const nextSide: 0 | 1 = p.side === 0 ? 1 : 0;

    if (p.side === 0) leftCountRef.current -= 1;
    else leftCountRef.current += 1;

    p.side = nextSide;
    const target = targetPos(idx, nextSide, layout);
    p.fromX = p.x;
    p.fromY = p.y;
    p.toX = target.x;
    p.toY = target.y;
    p.moveStartMs = nowMs;
    p.moveDurationMs = moveDurationMs;
    p.moving = true;

    const nextS = normalizedEntropy(particles.length, leftCountRef.current);
    sNormRef.current = nextS;
    historyRef.current.push({ t: simTimeRef.current, s: nextS });
    if (historyRef.current.length > 500) historyRef.current = historyRef.current.slice(-500);

    syncUiFromRefs();
  }

  function drawSimulation(ctx: CanvasRenderingContext2D, w: number, h: number) {
    const theme = themeRef.current ?? getThemeColors();
    themeRef.current = theme;
    const layout = layoutRef.current;
    if (!layout) return;

    ctx.clearRect(0, 0, w, h);

    // Panels
    ctx.fillStyle = theme.surface;
    ctx.strokeStyle = theme.border;
    ctx.lineWidth = 1;
    const drawBox = (r: Rect) => {
      ctx.beginPath();
      roundRectPath(ctx, r.x, r.y, r.w, r.h, 14);
      ctx.fill();
      ctx.stroke();
    };
    drawBox(layout.left);
    drawBox(layout.right);

    // Divider (visual cue only)
    ctx.strokeStyle = theme.border;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(layout.left.x + layout.left.w + layout.gap / 2, layout.left.y + 10);
    ctx.lineTo(layout.left.x + layout.left.w + layout.gap / 2, layout.left.y + layout.left.h - 10);
    ctx.stroke();
    ctx.setLineDash([]);

    // Labels
    ctx.fillStyle = theme.muted;
    ctx.font = "12px ui-sans-serif, system-ui";
    ctx.fillText("Left", layout.left.x + 10, layout.left.y + 18);
    ctx.fillText("Right", layout.right.x + 10, layout.right.y + 18);

    // Particles
    const particles = particlesRef.current;
    const r = layout.radius;
    for (const p of particles) {
      const fill = p.side === 0 ? "#ef4444" : "#3b82f6";
      ctx.fillStyle = fill;
      ctx.beginPath();
      ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function drawPlot(ctx: CanvasRenderingContext2D, w: number, h: number) {
    const theme = themeRef.current ?? getThemeColors();
    themeRef.current = theme;

    ctx.clearRect(0, 0, w, h);

    // Background
    ctx.fillStyle = theme.surface;
    ctx.strokeStyle = theme.border;
    ctx.lineWidth = 1;
    ctx.beginPath();
    roundRectPath(ctx, 0.5, 0.5, w - 1, h - 1, 14);
    ctx.fill();
    ctx.stroke();

    const pad = 14;
    const plotW = w - pad * 2;
    const plotH = h - pad * 2;
    const x0 = pad;
    const y0 = pad;

    // Axes (minimal)
    ctx.strokeStyle = theme.border;
    ctx.beginPath();
    ctx.moveTo(x0, y0 + plotH);
    ctx.lineTo(x0 + plotW, y0 + plotH);
    ctx.stroke();

    const hist = historyRef.current;
    if (hist.length < 2) return;

    const tMax = hist[hist.length - 1]!.t;
    const tMin = Math.max(0, tMax - 25); // last 25 seconds window
    const view = hist.filter((p) => p.t >= tMin);
    if (view.length < 2) return;

    const scaleX = (t: number) => x0 + ((t - tMin) / Math.max(1e-6, tMax - tMin)) * plotW;
    const scaleY = (s: number) => y0 + (1 - clamp(s, 0, 1)) * plotH;

    ctx.strokeStyle = theme.primary;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(scaleX(view[0]!.t), scaleY(view[0]!.s));
    for (let i = 1; i < view.length; i++) ctx.lineTo(scaleX(view[i]!.t), scaleY(view[i]!.s));
    ctx.stroke();

    // Current dot
    const last = view[view.length - 1]!;
    ctx.fillStyle = theme.accent;
    ctx.beginPath();
    ctx.arc(scaleX(last.t), scaleY(last.s), 3.2, 0, Math.PI * 2);
    ctx.fill();

    // Labels
    ctx.fillStyle = theme.muted;
    ctx.font = "12px ui-sans-serif, system-ui";
    ctx.fillText("Entropy (normalized)", x0, y0 + 12);
  }

  // Keep refs in sync
  useEffect(() => {
    runningRef.current = isRunning;
  }, [isRunning]);

  // Resize & layout
  useEffect(() => {
    const container = containerRef.current;
    const simCanvas = simCanvasRef.current;
    const plotCanvas = plotCanvasRef.current;
    if (!container || !simCanvas || !plotCanvas) return;

    function resize() {
      const containerEl = containerRef.current;
      if (!containerEl) return;
      const sim = simCanvasRef.current;
      const plot = plotCanvasRef.current;
      if (!sim || !plot) return;
      const w = containerEl.clientWidth;
      const simH = clamp(Math.round(w * 0.46), 220, 420);
      const plotH = clamp(Math.round(w * 0.22), 130, 220);

      const simCtx = applyCanvasSize(sim, w, simH);
      const plotCtx = applyCanvasSize(plot, w, plotH);
      if (!simCtx || !plotCtx) return;

      layoutRef.current = buildLayout(n, w, simH);

      // Snap non-moving particles to new targets
      const layout = layoutRef.current;
      const particles = particlesRef.current;
      if (layout && particles.length === n) {
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i]!;
          if (p.moving) continue;
          const t = targetPos(i, p.side, layout);
          p.x = t.x;
          p.y = t.y;
          p.fromX = t.x;
          p.fromY = t.y;
          p.toX = t.x;
          p.toY = t.y;
        }
      }

      drawSimulation(simCtx, w, simH);
      drawPlot(plotCtx, w, plotH);
    }

    const ro = new ResizeObserver(resize);
    ro.observe(container);
    resize();

    return () => ro.disconnect();
  }, [n]);

  // Initialize / reset when N changes
  useEffect(() => {
    if (!layoutRef.current) return;
    resetAll(n);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [n]);

  // Animation loop
  useEffect(() => {
    let raf = 0;
    const simCanvas = simCanvasRef.current;
    const plotCanvas = plotCanvasRef.current;
    if (!simCanvas || !plotCanvas) return;
    const simCtx = simCanvas.getContext("2d");
    const plotCtx = plotCanvas.getContext("2d");
    if (!simCtx || !plotCtx) return;

    const loop = (nowMs: number) => {
      const last = lastFrameMsRef.current ?? nowMs;
      const dt = (nowMs - last) / 1000;
      lastFrameMsRef.current = nowMs;

      if (runningRef.current) {
        simTimeRef.current += dt;
        jumpAccumulatorRef.current += dt;

        while (jumpAccumulatorRef.current >= nextJumpDelayRef.current) {
          jumpAccumulatorRef.current -= nextJumpDelayRef.current;
          nextJumpDelayRef.current = sampleExpSeconds(jumpRate);
          performJump(nowMs);
        }
      }

      // Update particle animation
      const particles = particlesRef.current;
      for (const p of particles) {
        if (!p.moving) continue;
        const t = clamp((nowMs - p.moveStartMs) / p.moveDurationMs, 0, 1);
        const e = easeInOutCubic(t);
        const arc = Math.sin(Math.PI * e) * -10;
        p.x = p.fromX + (p.toX - p.fromX) * e;
        p.y = p.fromY + (p.toY - p.fromY) * e + arc;
        if (t >= 1) {
          p.x = p.toX;
          p.y = p.toY;
          p.moving = false;
        }
      }

      const simW = parseFloat(simCanvas.style.width || "0") || simCanvas.getBoundingClientRect().width;
      const simH = parseFloat(simCanvas.style.height || "0") || simCanvas.getBoundingClientRect().height;
      const plotW = parseFloat(plotCanvas.style.width || "0") || plotCanvas.getBoundingClientRect().width;
      const plotH = parseFloat(plotCanvas.style.height || "0") || plotCanvas.getBoundingClientRect().height;

      if (simW > 0 && simH > 0) drawSimulation(simCtx, simW, simH);
      if (plotW > 0 && plotH > 0) drawPlot(plotCtx, plotW, plotH);

      raf = window.requestAnimationFrame(loop);
    };

    raf = window.requestAnimationFrame(loop);
    return () => window.cancelAnimationFrame(raf);
  }, []);

  const rightCount = n - leftCount;

  return (
    <section className="ic-card">
      <header className="ic-header">
        <div className="ic-title">
          <div className="ic-title-main">Ehrenfest 两盒模型：随机性如何产生宏观均衡</div>
          <div className="ic-title-sub">
            单次跳变是随机的，但多重度 <MathInline tex={"\\Omega"} className="ic-math" /> 的压倒性会把系统“吸”向{" "}
            <MathInline tex={"N_L\\approx N_R"} className="ic-math" />。
          </div>
        </div>
        <div className="ic-controls">
          <label className="ic-slider">
            <span className="ic-slider-label">
              N = <span className="ic-mono">{n}</span>
            </span>
            <input
              type="range"
              min={MIN_N}
              max={MAX_N}
              step={1}
              value={n}
              onChange={(e) => {
                const nextN = clamp(Number(e.target.value) || DEFAULT_N, MIN_N, MAX_N);
                setN(nextN);
              }}
            />
          </label>
          <button className="ic-btn" onClick={() => resetAll(n)}>
            Reset（低熵）
          </button>
          <button className="ic-btn ic-btn-primary" onClick={() => setIsRunning((v) => !v)}>
            {isRunning ? "Pause" : "Start"}
          </button>
          <button
            className="ic-btn ic-btn-ghost"
            onClick={() => {
              const log10Prob = -n * LOG10_2;
              const log10WaitSeconds = n * LOG10_2 - Math.log10(jumpRate);
              const log10WaitYears = log10WaitSeconds - LOG10_SECONDS_PER_YEAR;
              showToast(
                <span>
                  在混合状态下回到“全在左侧”的瞬时概率约为 <MathInline tex={`10^{${Math.round(log10Prob)}}`} />；
                  以当前速率约 <span className="ic-mono">{jumpRate}</span> 次/秒，期望等待约{" "}
                  <MathInline tex={`10^{${Math.round(log10WaitSeconds)}}`} /> 秒（约{" "}
                  <MathInline tex={`10^{${Math.round(log10WaitYears)}}`} /> 年）。
                </span>,
              );
            }}
          >
            Reverse?
          </button>
        </div>
      </header>

      <div ref={containerRef} className="ic-canvas-grid">
        <canvas ref={simCanvasRef} className="ic-canvas" aria-label="Ehrenfest simulation canvas" />
        <canvas ref={plotCanvasRef} className="ic-canvas" aria-label="Entropy plot canvas" />
      </div>

      <div className="ic-metrics">
        <div className="ic-metric">
          <div className="ic-metric-label">Left</div>
          <div className="ic-metric-value">
            <span className="ic-mono">{leftCount}</span> / <span className="ic-mono">{n}</span>
          </div>
        </div>
        <div className="ic-metric">
          <div className="ic-metric-label">Right</div>
          <div className="ic-metric-value">
            <span className="ic-mono">{rightCount}</span> / <span className="ic-mono">{n}</span>
          </div>
        </div>
        <div className="ic-metric">
          <div className="ic-metric-label">
            Entropy <MathInline tex={"S/(N\\ln 2)"} className="ic-math" />
          </div>
          <div className="ic-metric-value">
            <span className="ic-mono">{sNorm.toFixed(3)}</span>
          </div>
        </div>
      </div>

      {toast ? <div className="ic-toast">{toast}</div> : null}

      <p className="ic-footnote">
        这个模型的“驱动力”不是某种趋向平衡的力，而是计数：满足{" "}
        <MathInline tex={"N_L\\approx N_R"} className="ic-math" /> 的微观态数量远多于全左/全右（多重度{" "}
        <MathInline tex={"\\Omega"} className="ic-math" /> 的差别随 N 指数扩大）。
      </p>
    </section>
  );
}

function LogitPartition() {
  const DEFAULT_COSTS = [0.9, 1.4, 2.0, 2.6, 3.1];
  const MIN_BETA = 0.2;
  const MAX_BETA = 4.0;
  const LABELS = ["A", "B", "C", "D", "E"];

  const [beta, setBeta] = useState(1.2);
  const [costs, setCosts] = useState<number[]>(() => DEFAULT_COSTS);

  const metrics = useMemo(() => {
    const weights = costs.map((c) => Math.exp(-beta * c));
    const Z = weights.reduce((acc, v) => acc + v, 0) || 1;
    const probs = weights.map((w) => w / Z);
    const entropy = -probs.reduce((acc, p) => acc + (p > 0 ? p * Math.log(p) : 0), 0);
    const logZ = Math.log(Z);
    const freeEnergy = -logZ / beta;
    const logsum = logZ / beta;
    return { Z, probs, entropy, logZ, freeEnergy, logsum };
  }, [beta, costs]);

  function shuffleCosts() {
    setCosts(
      DEFAULT_COSTS.map(() => {
        const v = 0.7 + Math.random() * 2.9;
        return Math.round(v * 100) / 100;
      }),
    );
  }

  return (
    <section className="ic-card">
      <header className="ic-header">
        <div className="ic-title">
          <div className="ic-title-main">Logit 与配分函数：从“均匀”到“极化”</div>
          <div className="ic-title-sub">
            调节 <MathInline tex={"\\beta"} className="ic-math" /> 观察概率收缩；{" "}
            <MathInline tex={"Z=\\sum e^{-\\beta c_i}"} className="ic-math" /> 是所有选择的“加权计数”。
          </div>
        </div>
        <div className="ic-controls">
          <label className="ic-slider">
            <span className="ic-slider-label">
              β = <span className="ic-mono">{beta.toFixed(2)}</span>
            </span>
            <input
              type="range"
              min={MIN_BETA}
              max={MAX_BETA}
              step={0.05}
              value={beta}
              onChange={(e) => setBeta(clamp(Number(e.target.value) || 1, MIN_BETA, MAX_BETA))}
            />
          </label>
          <button className="ic-btn" onClick={shuffleCosts}>
            随机成本
          </button>
        </div>
      </header>

      <div className="ic-chart">
        {costs.map((cost, idx) => (
          <div key={`${cost}-${idx}`} className="ic-bar-row">
            <div className="ic-bar-label">Option {LABELS[idx] ?? idx + 1}</div>
            <div className="ic-bar-track">
              <div className="ic-bar-fill" style={{ width: `${metrics.probs[idx]! * 100}%` }} />
            </div>
            <div className="ic-bar-meta">
              <span className="ic-mono">c={cost.toFixed(2)}</span>
              <span className="ic-mono">p={metrics.probs[idx]!.toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="ic-metrics">
        <div className="ic-metric">
          <div className="ic-metric-label">
            Z <MathInline tex={"\\sum e^{-\\beta c_i}"} className="ic-math" />
          </div>
          <div className="ic-metric-value">
            <span className="ic-mono">{metrics.Z.toFixed(2)}</span>
          </div>
        </div>
        <div className="ic-metric">
          <div className="ic-metric-label">log Z</div>
          <div className="ic-metric-value">
            <span className="ic-mono">{metrics.logZ.toFixed(2)}</span>
          </div>
        </div>
        <div className="ic-metric">
          <div className="ic-metric-label">logsum = log Z / β</div>
          <div className="ic-metric-value">
            <span className="ic-mono">{metrics.logsum.toFixed(2)}</span>
          </div>
        </div>
        <div className="ic-metric">
          <div className="ic-metric-label">F = -log Z / β</div>
          <div className="ic-metric-value">
            <span className="ic-mono">{metrics.freeEnergy.toFixed(2)}</span>
          </div>
        </div>
        <div className="ic-metric">
          <div className="ic-metric-label">Entropy</div>
          <div className="ic-metric-value">
            <span className="ic-mono">{metrics.entropy.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <p className="ic-footnote">
        当 <MathInline tex={"\\beta"} className="ic-math" /> 增大时，分布向“最低成本”集中；当{" "}
        <MathInline tex={"\\beta\\to 0"} className="ic-math" /> 时，分布趋于均匀。logsum 增大表示“选项集合更好”（可达性/福利提升），对应自由能{" "}
        <MathInline tex={"F=-(1/\\beta)\\ln Z"} className="ic-math" /> 下降。
      </p>
    </section>
  );
}

function TwoLevelSchottky() {
  // Units: set k_B = 1, Δ = 1 by default. Only the dimensionless combination βΔ matters.
  const T_MIN = 0.05;
  const T_MAX = 5.0;

  const [T, setT] = useState(0.42);
  const [g1, setG1] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);

  const uPanelRef = useRef<HTMLDivElement | null>(null);
  const uCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const cvPanelRef = useRef<HTMLDivElement | null>(null);
  const cvCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const state = useMemo(() => {
    const TClamped = clamp(T, T_MIN, T_MAX);
    const betaDelta = 1 / TClamped;
    const w = Math.exp(-betaDelta);
    const Z = 1 + g1 * w;
    const pExcited = (g1 * w) / Z;
    const pGround = 1 - pExcited;
    const logZ = Math.log(Z);
    const U_over_Delta = pExcited;
    const Cv_over_kB = betaDelta * betaDelta * pExcited * (1 - pExcited);
    const F_over_Delta = -TClamped * logZ;
    return { T: TClamped, betaDelta, Z, logZ, pGround, pExcited, U_over_Delta, Cv_over_kB, F_over_Delta };
  }, [T, g1]);

  const curve = useMemo(() => {
    const n = 360;
    const xs = new Array(n);
    const u = new Array(n);
    const cv = new Array(n);
    let cvMax = 0;
    for (let i = 0; i < n; i++) {
      const t = i / (n - 1);
      const Ti = T_MIN + (T_MAX - T_MIN) * t;
      const betaDelta = 1 / Ti;
      const w = Math.exp(-betaDelta);
      const Z = 1 + g1 * w;
      const pExcited = (g1 * w) / Z;
      xs[i] = Ti;
      u[i] = pExcited;
      const cvi = betaDelta * betaDelta * pExcited * (1 - pExcited);
      cv[i] = cvi;
      cvMax = Math.max(cvMax, cvi);
    }
    return { xs, u, cv, cvMax };
  }, [g1]);

  useEffect(() => {
    if (!isPlaying) return;
    let raf = 0;
    let lastMs = 0;
    const speed = 0.55; // T units per second
    const loop = (now: number) => {
      if (!lastMs) lastMs = now;
      const dt = Math.min(0.05, (now - lastMs) / 1000);
      lastMs = now;
      setT((prev) => {
        const next = prev + speed * dt;
        return next > T_MAX ? T_MIN : next;
      });
      raf = window.requestAnimationFrame(loop);
    };
    raf = window.requestAnimationFrame(loop);
    return () => window.cancelAnimationFrame(raf);
  }, [isPlaying]);

  useEffect(() => {
    const panels: Array<[HTMLDivElement, HTMLCanvasElement]> = [];
    if (uPanelRef.current && uCanvasRef.current) panels.push([uPanelRef.current, uCanvasRef.current]);
    if (cvPanelRef.current && cvCanvasRef.current) panels.push([cvPanelRef.current, cvCanvasRef.current]);
    if (!panels.length) return;

    const resize = () => {
      for (const [panel, canvas] of panels) {
        const w = panel.clientWidth;
        const h = clamp(Math.round(w * 0.55), 220, 300);
        applyCanvasSize(canvas, w, h);
      }
    };

    const ro = new ResizeObserver(resize);
    for (const [panel] of panels) ro.observe(panel);
    resize();
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    function drawPlot(canvas: HTMLCanvasElement, title: string, xs: number[], ys: number[], yMax: number) {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const dpr = window.devicePixelRatio || 1;
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;

      const theme = getThemeColors();
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = theme.surface;
      ctx.fillRect(0, 0, w, h);

      const padL = 42;
      const padR = 14;
      const padT = 18;
      const padB = 34;
      const pw = w - padL - padR;
      const ph = h - padT - padB;

      const xMin = xs[0] ?? 0;
      const xMax = xs[xs.length - 1] ?? 1;
      const yMin = 0;
      const yMax2 = Math.max(1e-6, yMax);

      const xTo = (x: number) => padL + ((x - xMin) / (xMax - xMin)) * pw;
      const yTo = (y: number) => padT + (1 - (y - yMin) / (yMax2 - yMin)) * ph;

      // Frame
      ctx.strokeStyle = theme.border;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.rect(padL, padT, pw, ph);
      ctx.stroke();

      // Grid + ticks
      const tickN = 4;
      ctx.font = "12px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial";
      ctx.fillStyle = theme.muted;
      ctx.textBaseline = "middle";
      for (let i = 0; i <= tickN; i++) {
        const tx = i / tickN;
        const xv = xMin + (xMax - xMin) * tx;
        const px = xTo(xv);
        ctx.globalAlpha = 0.18;
        ctx.beginPath();
        ctx.moveTo(px, padT);
        ctx.lineTo(px, padT + ph);
        ctx.stroke();
        ctx.globalAlpha = 1;
        ctx.textAlign = "center";
        ctx.fillText(xv.toFixed(1), px, padT + ph + 14);
      }

      for (let i = 0; i <= tickN; i++) {
        const ty = i / tickN;
        const yv = yMin + (yMax2 - yMin) * ty;
        const py = yTo(yv);
        ctx.globalAlpha = 0.18;
        ctx.beginPath();
        ctx.moveTo(padL, py);
        ctx.lineTo(padL + pw, py);
        ctx.stroke();
        ctx.globalAlpha = 1;
        ctx.textAlign = "right";
        ctx.fillText(yv.toFixed(2), padL - 6, py);
      }

      // Title
      ctx.textAlign = "left";
      ctx.textBaseline = "alphabetic";
      ctx.fillStyle = theme.text;
      ctx.font = "13px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial";
      ctx.fillText(title, padL, 14);

      // Curve
      ctx.strokeStyle = theme.primary;
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i < xs.length; i++) {
        const px = xTo(xs[i]!);
        const py = yTo(ys[i]!);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Marker at current T
      const markY = title.startsWith("U") ? state.U_over_Delta : state.Cv_over_kB;
      const mx = xTo(state.T);
      const my = yTo(markY);
      ctx.fillStyle = theme.accent;
      ctx.beginPath();
      ctx.arc(mx, my, 4.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = theme.surface;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    const uCanvas = uCanvasRef.current;
    const cvCanvas = cvCanvasRef.current;
    if (uCanvas) drawPlot(uCanvas, "U/Δ (excited probability)", curve.xs, curve.u, 1);
    if (cvCanvas) drawPlot(cvCanvas, "C_V/k_B (Schottky peak)", curve.xs, curve.cv, curve.cvMax * 1.12);
  }, [curve, state]);

  return (
    <section className="ic-card">
      <header className="ic-header">
        <div className="ic-title">
          <div className="ic-title-main">两能级系统：Schottky anomaly（热容单峰）</div>
          <div className="ic-title-sub">
            只靠一个可解玩具模型，把 <MathInline tex={"Z\\,\\to\\,\\ln Z\\,\\to\\,U\\,\\to\\,C_V"} className="ic-math" /> 的生成关系练到条件反射。
            这里取 <MathInline tex={"k_B=1"} className="ic-math" />、<MathInline tex={"\\Delta=1"} className="ic-math" />；形状只依赖{" "}
            <MathInline tex={"\\beta\\Delta"} className="ic-math" /> 与简并度。
          </div>
        </div>
        <div className="ic-controls">
          <label className="ic-slider">
            <span className="ic-slider-label">
              T = <span className="ic-mono">{state.T.toFixed(2)}</span>
            </span>
            <input
              type="range"
              min={T_MIN}
              max={T_MAX}
              step={0.01}
              value={state.T}
              onChange={(e) => setT(clamp(Number(e.target.value) || 0.42, T_MIN, T_MAX))}
            />
          </label>
          <label className="ic-slider">
            <span className="ic-slider-label">
              g₁ = <span className="ic-mono">{g1}</span>
            </span>
            <input
              type="range"
              min={1}
              max={20}
              step={1}
              value={g1}
              onChange={(e) => setG1(clamp(Number(e.target.value) || 1, 1, 20))}
            />
          </label>
          <button className="ic-btn ic-btn-primary" onClick={() => setIsPlaying((v) => !v)}>
            {isPlaying ? "暂停" : "播放"}
          </button>
          <button
            className="ic-btn"
            onClick={() => {
              setIsPlaying(false);
              setT(0.42);
              setG1(1);
            }}
          >
            重置
          </button>
        </div>
      </header>

      <div className="ic-chart" style={{ marginTop: 12 }}>
        <div className="ic-bar-row">
          <div className="ic-bar-label">Ground (E=0)</div>
          <div className="ic-bar-track">
            <div className="ic-bar-fill" style={{ width: `${state.pGround * 100}%` }} />
          </div>
          <div className="ic-bar-meta">
            <span className="ic-mono">p={state.pGround.toFixed(2)}</span>
          </div>
        </div>
        <div className="ic-bar-row">
          <div className="ic-bar-label">Excited (E=Δ)</div>
          <div className="ic-bar-track">
            <div className="ic-bar-fill" style={{ width: `${state.pExcited * 100}%` }} />
          </div>
          <div className="ic-bar-meta">
            <span className="ic-mono">p={state.pExcited.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="ic-canvas-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
        <div ref={uPanelRef} className="ic-flow-panel">
          <canvas ref={uCanvasRef} className="ic-canvas" aria-label="Two-level U plot" />
        </div>
        <div ref={cvPanelRef} className="ic-flow-panel">
          <canvas ref={cvCanvasRef} className="ic-canvas" aria-label="Two-level Cv plot" />
        </div>
      </div>

      <div className="ic-metrics">
        <div className="ic-metric">
          <div className="ic-metric-label">
            βΔ <MathInline tex={"=\\Delta/(k_BT)"} className="ic-math" />
          </div>
          <div className="ic-metric-value">
            <span className="ic-mono">{state.betaDelta.toFixed(2)}</span>
          </div>
        </div>
        <div className="ic-metric">
          <div className="ic-metric-label">
            Z <MathInline tex={"=1+g_1 e^{-\\beta\\Delta}"} className="ic-math" />
          </div>
          <div className="ic-metric-value">
            <span className="ic-mono">{state.Z.toFixed(3)}</span>
          </div>
        </div>
        <div className="ic-metric">
          <div className="ic-metric-label">log Z</div>
          <div className="ic-metric-value">
            <span className="ic-mono">{state.logZ.toFixed(3)}</span>
          </div>
        </div>
        <div className="ic-metric">
          <div className="ic-metric-label">
            F/Δ <MathInline tex={"=-T\\ln Z"} className="ic-math" />
          </div>
          <div className="ic-metric-value">
            <span className="ic-mono">{state.F_over_Delta.toFixed(3)}</span>
          </div>
        </div>
        <div className="ic-metric">
          <div className="ic-metric-label">U/Δ</div>
          <div className="ic-metric-value">
            <span className="ic-mono">{state.U_over_Delta.toFixed(3)}</span>
          </div>
        </div>
        <div className="ic-metric">
          <div className="ic-metric-label">C_V/k_B</div>
          <div className="ic-metric-value">
            <span className="ic-mono">{state.Cv_over_kB.toFixed(3)}</span>
          </div>
        </div>
      </div>

      <p className="ic-footnote">
        microstates 的底层定义是 <MathInline tex={"Z=\\sum_{j\\in\\text{microstates}} e^{-\\beta E_j}"} className="ic-math" />；
        若按能级分组（简并度 <MathInline tex={"g(E)"} className="ic-math" />），也可写成{" "}
        <MathInline tex={"Z=\\sum_E g(E)e^{-\\beta E}"} className="ic-math" />。
      </p>
    </section>
  );
}

function computePoissonPmf(lambda: number, maxN: number): { p: number[]; tail: number } {
  const out = new Array(maxN + 1).fill(0);
  if (!(lambda >= 0)) return { p: out, tail: 1 };
  out[0] = Math.exp(-lambda);
  for (let n = 1; n <= maxN; n++) {
    out[n] = out[n - 1]! * (lambda / n);
  }
  const mass = out.reduce((a, b) => a + b, 0);
  return { p: out, tail: Math.max(0, 1 - mass) };
}

function sampleDiscreteFromCdf(cdf: number[]): number {
  const u = Math.random();
  for (let i = 0; i < cdf.length; i++) {
    if (u <= cdf[i]!) return i;
  }
  return Math.max(0, cdf.length - 1);
}

function GrandCanonicalPoisson() {
  // A minimal grand-canonical toy model where Z_N ∝ 1/N!  ⇒  𝒵 = Σ (e^{α})^N / N! = exp(e^{α})
  // Here α := βμ (absorbing a constant like ln Z_1), so:
  // ln 𝒵 = e^{α},   ⟨N⟩ = ∂_α ln 𝒵 = e^{α},   Var(N) = ∂_α^2 ln 𝒵 = e^{α}.
  const ALPHA_MIN = -2.0;
  const ALPHA_MAX = 5.0;

  const [alpha, setAlpha] = useState(1.2);
  const [isRunning, setIsRunning] = useState(true);
  const [sampleN, setSampleN] = useState(0);
  const [canvasTick, setCanvasTick] = useState(0);

  const panelRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sizeRef = useRef<{ w: number; h: number }>({ w: 640, h: 280 });

  const stats = useMemo(() => {
    const a = clamp(alpha, ALPHA_MIN, ALPHA_MAX);
    const lambda = Math.exp(a);
    const { p, tail } = computePoissonPmf(lambda, MAX_N);
    const mass = 1 - tail;
    const cdf: number[] = new Array(MAX_N + 1);
    let acc = 0;
    for (let n = 0; n <= MAX_N; n++) {
      acc += mass > 0 ? p[n]! / mass : 0;
      cdf[n] = acc;
    }
    const displayMaxN = clamp(Math.ceil(lambda + 6 * Math.sqrt(lambda + 1)), 24, MAX_N);
    return {
      alpha: a,
      lambda,
      lnXi: lambda,
      mean: lambda,
      varN: lambda,
      pmf: p,
      cdf,
      displayMaxN,
      tail,
    };
  }, [alpha]);

  useEffect(() => {
    const panel = panelRef.current;
    const canvas = canvasRef.current;
    if (!panel || !canvas) return;

    const resize = () => {
      const w = Math.max(280, panel.clientWidth);
      const h = clamp(Math.round(w * 0.52), 220, 320);
      sizeRef.current = { w, h };
      applyCanvasSize(canvas, w, h);
      setCanvasTick((t) => t + 1);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(panel);
    resize();
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!isRunning) return;
    let raf = 0;
    let last = 0;
    let acc = 0;
    const period = 0.55; // seconds per sample
    const loop = (now: number) => {
      if (!last) last = now;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      acc += dt;
      if (acc >= period) {
        acc = acc % period;
        setSampleN(sampleDiscreteFromCdf(stats.cdf.slice(0, stats.displayMaxN + 1)));
      }
      raf = window.requestAnimationFrame(loop);
    };
    raf = window.requestAnimationFrame(loop);
    return () => window.cancelAnimationFrame(raf);
  }, [isRunning, stats.cdf, stats.displayMaxN]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const theme = getThemeColors();
    const { w, h } = sizeRef.current;
    const padL = 46;
    const padR = 16;
    const padT = 28;
    const padB = 30;
    const plotW = w - padL - padR;
    const plotH = h - padT - padB;

    const maxN = stats.displayMaxN;
    const barW = plotW / (maxN + 1);

    let yMax = 0;
    for (let n = 0; n <= maxN; n++) yMax = Math.max(yMax, stats.pmf[n] ?? 0);
    yMax = yMax > 0 ? yMax * 1.12 : 1;

    const xOf = (n: number) => padL + n * barW;
    const yOf = (p: number) => padT + plotH - (p / yMax) * plotH;

    // background
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = theme.surface;
    ctx.fillRect(0, 0, w, h);

    // axis + grid
    ctx.strokeStyle = theme.border;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padL, padT);
    ctx.lineTo(padL, padT + plotH);
    ctx.lineTo(padL + plotW, padT + plotH);
    ctx.stroke();

    ctx.font = "12px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial";
    ctx.fillStyle = theme.muted;
    ctx.textBaseline = "middle";
    ctx.textAlign = "right";
    for (const frac of [0, 0.5, 1]) {
      const yv = yMax * frac;
      const py = yOf(yv);
      ctx.globalAlpha = frac === 0 ? 0.3 : 0.18;
      ctx.beginPath();
      ctx.moveTo(padL, py);
      ctx.lineTo(padL + plotW, py);
      ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.fillText(yv.toFixed(frac === 0 ? 0 : 2), padL - 8, py);
    }

    // title
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    ctx.fillStyle = theme.text;
    ctx.font = "13px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial";
    ctx.fillText("P(N) under grand canonical (Poisson toy model)", padL, 16);

    // mean line
    const meanX = padL + stats.mean * barW;
    ctx.strokeStyle = theme.accent;
    ctx.globalAlpha = 0.75;
    ctx.beginPath();
    ctx.moveTo(meanX, padT);
    ctx.lineTo(meanX, padT + plotH);
    ctx.stroke();
    ctx.globalAlpha = 1;

    // bars
    for (let n = 0; n <= maxN; n++) {
      const p = stats.pmf[n] ?? 0;
      const x = xOf(n);
      const y = yOf(p);
      const hh = padT + plotH - y;
      const isHit = n === sampleN;
      ctx.fillStyle = isHit ? theme.accent : theme.primary;
      ctx.globalAlpha = isHit ? 0.92 : 0.72;
      ctx.fillRect(x + 0.6, y, Math.max(1, barW - 1.2), hh);
    }
    ctx.globalAlpha = 1;

    // x labels
    ctx.fillStyle = theme.muted;
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    const ticks = [0, Math.floor(maxN / 2), maxN].filter((v, i, a) => a.indexOf(v) === i);
    for (const t of ticks) {
      ctx.fillText(String(t), xOf(t) + barW * 0.5, padT + plotH + 6);
    }

    // sample marker label
    const markerX = xOf(sampleN) + barW * 0.5;
    ctx.fillStyle = theme.text;
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    ctx.font = "12px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace";
    ctx.fillText(`N=${sampleN}`, markerX, padT - 4);
  }, [stats, sampleN, canvasTick]);

  return (
    <section className="ic-card">
      <header className="ic-header">
        <div className="ic-title">
          <div className="ic-title-main">巨正则直觉：调 μ 看 P(N)</div>
          <div className="ic-title-sub">
            用一个可解玩具模型把{" "}
            <MathInline
              tex={"\\mathcal{Z}\\,\\to\\,\\ln\\mathcal{Z}\\,\\to\\,\\langle N\\rangle\\,\\to\\,\\mathrm{Var}(N)"}
              className="ic-math"
            />{" "}
            串起来。
            这里把 <MathInline tex={"\\alpha:=\\beta\\mu"} className="ic-math" />（吸收常数）作为旋钮，得到{" "}
            <MathInline tex={"P(N)=e^{-\\lambda}\\,\\lambda^N/N!"} className="ic-math" />，其中{" "}
            <MathInline tex={"\\lambda=e^{\\alpha}"} className="ic-math" />。
          </div>
        </div>
        <div className="ic-controls">
          <label className="ic-slider">
            <span className="ic-slider-label">
              α = βμ = <span className="ic-mono">{stats.alpha.toFixed(2)}</span>
            </span>
            <input
              type="range"
              min={ALPHA_MIN}
              max={ALPHA_MAX}
              step={0.01}
              value={stats.alpha}
              onChange={(e) => setAlpha(clamp(Number(e.target.value) || 0, ALPHA_MIN, ALPHA_MAX))}
            />
          </label>
          <button className="ic-btn ic-btn-primary" onClick={() => setIsRunning((v) => !v)}>
            {isRunning ? "暂停采样" : "开始采样"}
          </button>
          <button className="ic-btn" onClick={() => setSampleN(sampleDiscreteFromCdf(stats.cdf.slice(0, stats.displayMaxN + 1)))}>
            采样一次
          </button>
        </div>
      </header>

      <div ref={panelRef} className="ic-flow-panel">
        <canvas ref={canvasRef} className="ic-canvas" aria-label="Grand canonical P(N) canvas" />
      </div>

      <div className="ic-metrics">
        <div className="ic-metric">
          <div className="ic-metric-label">
            λ <MathInline tex={"=e^{\\alpha}"} className="ic-math" />
          </div>
          <div className="ic-metric-value">
            <span className="ic-mono">{stats.lambda.toFixed(3)}</span>
          </div>
        </div>
        <div className="ic-metric">
          <div className="ic-metric-label">
            <MathInline tex={"\\ln\\mathcal{Z}"} className="ic-math" />{" "}
            <MathInline tex={"=e^{\\alpha}"} className="ic-math" />
          </div>
          <div className="ic-metric-value">
            <span className="ic-mono">{stats.lnXi.toFixed(3)}</span>
          </div>
        </div>
        <div className="ic-metric">
          <div className="ic-metric-label">
            ⟨N⟩ <MathInline tex={"=\\partial_{\\alpha}\\ln\\mathcal{Z}"} className="ic-math" />
          </div>
          <div className="ic-metric-value">
            <span className="ic-mono">{stats.mean.toFixed(3)}</span>
          </div>
        </div>
        <div className="ic-metric">
          <div className="ic-metric-label">
            Var(N) <MathInline tex={"=\\partial_{\\alpha}^2\\ln\\mathcal{Z}"} className="ic-math" />
          </div>
          <div className="ic-metric-value">
            <span className="ic-mono">{stats.varN.toFixed(3)}</span>
          </div>
        </div>
        <div className="ic-metric">
          <div className="ic-metric-label">Sample N(t)</div>
          <div className="ic-metric-value">
            <span className="ic-mono">{sampleN}</span>
          </div>
        </div>
      </div>

      <p className="ic-footnote">
        这不是“巨正则的全部”，但它把两件最关键的结构钉死：①{" "}
        <MathInline tex={"\\mathcal{Z}"} className="ic-math" /> 只是权重的归一化常数；②{" "}
        <MathInline tex={"\\ln\\mathcal{Z}"} className="ic-math" /> 的导数生成均值与涨落。更一般情形为{" "}
        <MathInline tex={"\\mathcal{Z}=\\sum_N e^{\\beta\\mu N} Z_N"} className="ic-math" />（见 M4 Part 2）。
      </p>
    </section>
  );
}

function computeFlow(drive: number) {
  const stay = 0.28;
  const cw = 1 + drive;
  const ccw = 1 - drive;
  const P = Array.from({ length: 3 }, () => [0, 0, 0]);
  for (let i = 0; i < 3; i++) {
    const total = stay + cw + ccw;
    P[i]![i] = stay / total;
    P[i]![(i + 1) % 3] = cw / total;
    P[i]![(i + 2) % 3] = ccw / total;
  }

  let pi = [1 / 3, 1 / 3, 1 / 3];
  for (let step = 0; step < 120; step++) {
    const next = [0, 0, 0];
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        next[j] += pi[i]! * P[i]![j]!;
      }
    }
    pi = next;
  }

  const J01 = pi[0]! * P[0]![1]! - pi[1]! * P[1]![0]!;
  const J12 = pi[1]! * P[1]![2]! - pi[2]! * P[2]![1]!;
  const J20 = pi[2]! * P[2]![0]! - pi[0]! * P[0]![2]!;
  const Jcw = J01 + J12 + J20;
  const dir = Math.abs(Jcw) < 1e-4 ? 0 : Jcw > 0 ? 1 : -1;
  return { P, pi, Jcw, dir };
}

function NetFlow() {
  const [drive, setDrive] = useState(0);
  const flow = useMemo(() => computeFlow(drive), [drive]);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const flowRef = useRef(flow);
  const particlesRef = useRef<FlowParticle[]>([]);
  const nodesRef = useRef<Point[]>([]);
  const lastFrameRef = useRef<number | null>(null);
  const reduceMotionRef = useRef(false);

  useEffect(() => {
    flowRef.current = flow;
  }, [flow]);

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

    function resetParticles(count: number) {
      particlesRef.current = Array.from({ length: count }, () => ({
        offset: Math.random(),
        speed: 0.6 + Math.random() * 0.8,
      }));
    }

    function buildNodes(w: number, h: number) {
      const center = { x: w / 2, y: h / 2 };
      const radius = Math.min(w, h) * 0.32;
      const angles = [-90, 30, 150].map((a) => (a * Math.PI) / 180);
      nodesRef.current = angles.map((a) => ({
        x: center.x + Math.cos(a) * radius,
        y: center.y + Math.sin(a) * radius,
      }));
    }

    function resize() {
      const w = containerEl.clientWidth;
      const h = clamp(Math.round(w * 0.58), 220, 320);
      const ctx = applyCanvasSize(canvasEl, w, h);
      if (!ctx) return;
      buildNodes(w, h);
      resetParticles(clamp(Math.round((w * h) / 8000), 30, 90));
      lastFrameRef.current = null;
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
    const canvasEl = canvas;
    const ctx2d = ctx;

    function drawArrow(from: Point, to: Point, color: string, width: number) {
      const angle = Math.atan2(to.y - from.y, to.x - from.x);
      const size = 8 + width * 0.8;
      ctx2d.strokeStyle = color;
      ctx2d.lineWidth = width;
      ctx2d.beginPath();
      ctx2d.moveTo(from.x, from.y);
      ctx2d.lineTo(to.x, to.y);
      ctx2d.stroke();
      ctx2d.fillStyle = color;
      ctx2d.beginPath();
      ctx2d.moveTo(to.x, to.y);
      ctx2d.lineTo(to.x - size * Math.cos(angle - Math.PI / 6), to.y - size * Math.sin(angle - Math.PI / 6));
      ctx2d.lineTo(to.x - size * Math.cos(angle + Math.PI / 6), to.y - size * Math.sin(angle + Math.PI / 6));
      ctx2d.closePath();
      ctx2d.fill();
    }

    function buildCycle(nodes: Point[], dir: number) {
      const order = dir >= 0 ? [0, 1, 2, 0] : [0, 2, 1, 0];
      const segments = [];
      let total = 0;
      for (let i = 0; i < 3; i++) {
        const a = nodes[order[i]!]!;
        const b = nodes[order[i + 1]!]!;
        const len = Math.hypot(b.x - a.x, b.y - a.y);
        segments.push({ a, b, len });
        total += len;
      }
      return { segments, total };
    }

    function pointOnCycle(segments: { a: Point; b: Point; len: number }[], total: number, offset: number) {
      let dist = offset * total;
      for (const seg of segments) {
        if (dist <= seg.len) {
          const t = seg.len === 0 ? 0 : dist / seg.len;
          return { x: seg.a.x + (seg.b.x - seg.a.x) * t, y: seg.a.y + (seg.b.y - seg.a.y) * t };
        }
        dist -= seg.len;
      }
      const last = segments[segments.length - 1]!;
      return last.b;
    }

    const loop = (now: number) => {
      const flowState = flowRef.current;
      const nodes = nodesRef.current;
      if (!nodes.length) {
        raf = window.requestAnimationFrame(loop);
        return;
      }

      const last = lastFrameRef.current ?? now;
      const dt = Math.min(0.04, (now - last) / 1000);
      lastFrameRef.current = now;

      const w = canvasEl.width / (window.devicePixelRatio || 1);
      const h = canvasEl.height / (window.devicePixelRatio || 1);

      const theme = getThemeColors();
      ctx2d.clearRect(0, 0, w, h);
      ctx2d.fillStyle = theme.surface;
      ctx2d.fillRect(0, 0, w, h);

      const dir = flowState.dir === 0 ? 1 : flowState.dir;
      const flowMag = Math.abs(flowState.Jcw);
      const lineWidth = clamp(1 + flowMag * 18, 1, 5);
      const baseSpeed = reduceMotionRef.current ? 0 : clamp(flowMag * 3 + 0.06, 0.06, 0.36);

      const { segments, total } = buildCycle(nodes, dir);
      const nodeRadius = 14;

      if (flowState.dir === 0) {
        ctx2d.strokeStyle = theme.border;
        ctx2d.setLineDash([6, 6]);
        ctx2d.lineWidth = 1.2;
        ctx2d.beginPath();
        ctx2d.moveTo(nodes[0]!.x, nodes[0]!.y);
        ctx2d.lineTo(nodes[1]!.x, nodes[1]!.y);
        ctx2d.lineTo(nodes[2]!.x, nodes[2]!.y);
        ctx2d.closePath();
        ctx2d.stroke();
        ctx2d.setLineDash([]);
      } else {
        for (const seg of segments) {
          const dx = seg.b.x - seg.a.x;
          const dy = seg.b.y - seg.a.y;
          const len = Math.hypot(dx, dy) || 1;
          const ux = dx / len;
          const uy = dy / len;
          const start = { x: seg.a.x + ux * nodeRadius, y: seg.a.y + uy * nodeRadius };
          const end = { x: seg.b.x - ux * (nodeRadius + 6), y: seg.b.y - uy * (nodeRadius + 6) };
          drawArrow(start, end, theme.primary, lineWidth);
        }
      }

      ctx2d.fillStyle = theme.accent;
      for (const n of nodes) {
        ctx2d.beginPath();
        ctx2d.arc(n.x, n.y, nodeRadius, 0, Math.PI * 2);
        ctx2d.fill();
      }

      if (baseSpeed > 0) {
        ctx2d.fillStyle = theme.primary;
        for (const p of particlesRef.current) {
          p.offset = (p.offset + (baseSpeed * p.speed * dt) / total) % 1;
          const pt = pointOnCycle(segments, total, p.offset);
          ctx2d.beginPath();
          ctx2d.arc(pt.x, pt.y, 2.4, 0, Math.PI * 2);
          ctx2d.fill();
        }
      }

      raf = window.requestAnimationFrame(loop);
    };

    raf = window.requestAnimationFrame(loop);
    return () => window.cancelAnimationFrame(raf);
  }, []);

  return (
    <section className="ic-card">
      <header className="ic-header">
        <div className="ic-title">
          <div className="ic-title-main">净流（Net Flow）：细致平衡是否被打破？</div>
          <div className="ic-title-sub">
            调节驱动强度，观察稳态与净流的变化；<MathInline tex={"J_{ij}=\\pi_i P_{ij}-\\pi_j P_{ji}"} className="ic-math" />。
          </div>
        </div>
        <div className="ic-controls">
          <label className="ic-slider">
            <span className="ic-slider-label">
              Drive = <span className="ic-mono">{drive.toFixed(2)}</span>
            </span>
            <input
              type="range"
              min={0}
              max={0.9}
              step={0.02}
              value={drive}
              onChange={(e) => setDrive(clamp(Number(e.target.value) || 0, 0, 0.9))}
            />
          </label>
          <button className="ic-btn" onClick={() => setDrive(0)}>
            细致平衡
          </button>
        </div>
      </header>

      <div ref={containerRef} className="ic-flow-panel">
        <canvas ref={canvasRef} className="ic-canvas ic-flow-canvas" aria-label="Net flow canvas" />
      </div>

      <div className="ic-metrics">
        <div className="ic-metric">
          <div className="ic-metric-label">π (stationary)</div>
          <div className="ic-metric-value">
            <span className="ic-mono">{flow.pi.map((v) => v.toFixed(2)).join(" · ")}</span>
          </div>
        </div>
        <div className="ic-metric">
          <div className="ic-metric-label">Net circulation</div>
          <div className="ic-metric-value">
            <span className="ic-mono">{flow.Jcw.toFixed(3)}</span>
          </div>
        </div>
      </div>

      <p className="ic-footnote">
        当 Drive → 0 时，净流趋于 0（细致平衡成立）；Drive 增大后出现稳定的环流方向。
      </p>
    </section>
  );
}

// --- Main Registry ---

const COMPONENT_MAP: Record<string, React.FC> = {
  "entropy-counter": EntropyCounter,
  "logit-partition": LogitPartition,
  "two-level-schottky": TwoLevelSchottky,
  "grand-canonical-poisson": GrandCanonicalPoisson,
  "net-flow": NetFlow,
};

export function InteractiveConcept({ type }: { type: string }) {
  const Component = COMPONENT_MAP[type];
  if (!Component) {
    return (
      <div className="card">
        <p className="muted">Unknown interactive concept: {type}</p>
      </div>
    );
  }
  return <Component />;
}
