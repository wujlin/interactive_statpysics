"use client";

import katex from "katex";
import { useEffect, useMemo, useRef, useState } from "react";

type ThemeColors = {
  text: string;
  muted: string;
  border: string;
  surface: string;
  primary: string;
  accent: string;
};

type Metrics = {
  t: number;
  tvToUniform: number;
  maxP: number;
  minP: number;
};

const DEFAULT_GRID = 25;
const MIN_GRID = 10;
const MAX_GRID = 45;

const DEFAULT_STAY = 0.5; // lazy random walk to avoid checkerboard periodicity
const MIN_STAY = 0.0;
const MAX_STAY = 0.8;

const DEFAULT_SPEED = 40; // steps per second
const MIN_SPEED = 1;
const MAX_SPEED = 220;

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
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
  canvas.style.width = `${cssW}px`;
  canvas.style.height = `${cssH}px`;
  const ctx = canvas.getContext("2d");
  if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return ctx;
}

function MathInline({ tex }: { tex: string }) {
  const html = useMemo(() => {
    try {
      return katex.renderToString(tex, { throwOnError: false, displayMode: false });
    } catch {
      return tex;
    }
  }, [tex]);
  return <span className="ic-math" dangerouslySetInnerHTML={{ __html: html }} />;
}

function buildWrapNeighbors(n: number) {
  const len = n * n;
  const up = new Int32Array(len);
  const down = new Int32Array(len);
  const left = new Int32Array(len);
  const right = new Int32Array(len);
  for (let y = 0; y < n; y++) {
    const yUp = (y - 1 + n) % n;
    const yDown = (y + 1) % n;
    for (let x = 0; x < n; x++) {
      const xLeft = (x - 1 + n) % n;
      const xRight = (x + 1) % n;
      const i = y * n + x;
      up[i] = yUp * n + x;
      down[i] = yDown * n + x;
      left[i] = y * n + xLeft;
      right[i] = y * n + xRight;
    }
  }
  return { up, down, left, right };
}

function computeMetrics(p: Float64Array, t: number): Metrics {
  const n = Math.max(1, p.length);
  const u = 1 / n;
  let tv = 0;
  let maxP = 0;
  let minP = Number.POSITIVE_INFINITY;
  for (let i = 0; i < p.length; i++) {
    const v = p[i]!;
    tv += Math.abs(v - u);
    if (v > maxP) maxP = v;
    if (v < minP) minP = v;
  }
  tv *= 0.5;
  if (!Number.isFinite(minP)) minP = 0;
  return { t, tvToUniform: tv, maxP, minP };
}

type HeatmapLayout = {
  grid: number;
  cell: number;
  gap: number;
  originX: number;
  originY: number;
  drawW: number;
  drawH: number;
};

function computeHeatmapLayout(grid: number, w: number, h: number): HeatmapLayout {
  const pad = 14;
  const maxW = Math.max(160, w - 2 * pad);
  const maxH = Math.max(160, h - 2 * pad);
  const cell = Math.max(2, Math.floor(Math.min(maxW / grid, maxH / grid)));
  const gap = cell >= 5 ? 1 : 0;
  const drawW = cell * grid;
  const drawH = cell * grid;
  const originX = Math.floor((w - drawW) / 2);
  const originY = Math.floor((h - drawH) / 2);
  return { grid, cell, gap, originX, originY, drawW, drawH };
}

export function DiffusionHeatmapDemo() {
  const [grid, setGrid] = useState(DEFAULT_GRID);
  const [stay, setStay] = useState(DEFAULT_STAY);
  const [speed, setSpeed] = useState(DEFAULT_SPEED);
  const [isPlaying, setIsPlaying] = useState(true);
  const [metrics, setMetrics] = useState<Metrics>(() => computeMetrics(new Float64Array(DEFAULT_GRID * DEFAULT_GRID), 0));

  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const themeRef = useRef<ThemeColors | null>(null);
  const neighborsRef = useRef<ReturnType<typeof buildWrapNeighbors> | null>(null);
  const layoutRef = useRef<HeatmapLayout | null>(null);

  const pRef = useRef<Float64Array>(new Float64Array(DEFAULT_GRID * DEFAULT_GRID));
  const qRef = useRef<Float64Array>(new Float64Array(DEFAULT_GRID * DEFAULT_GRID));
  const tRef = useRef<number>(0);

  const rafRef = useRef<number | null>(null);
  const lastMsRef = useRef<number | null>(null);
  const stepAccRef = useRef<number>(0);
  const lastMetricsMsRef = useRef<number>(0);

  function resetAt(index: number) {
    const len = pRef.current.length;
    const p = pRef.current;
    for (let i = 0; i < len; i++) p[i] = 0;
    p[clamp(index, 0, len - 1)] = 1;
    tRef.current = 0;
    setMetrics(computeMetrics(pRef.current, 0));
  }

  function hardReset(next?: { grid?: number; stay?: number; speed?: number }) {
    const nextGrid = next?.grid ?? grid;
    const nextStay = next?.stay ?? stay;
    const nextSpeed = next?.speed ?? speed;

    const n = nextGrid * nextGrid;
    pRef.current = new Float64Array(n);
    qRef.current = new Float64Array(n);
    neighborsRef.current = buildWrapNeighbors(nextGrid);
    tRef.current = 0;
    stepAccRef.current = 0;
    lastMsRef.current = null;

    // default: center delta
    const cx = Math.floor(nextGrid / 2);
    const cy = Math.floor(nextGrid / 2);
    pRef.current[cy * nextGrid + cx] = 1;

    setGrid(nextGrid);
    setStay(nextStay);
    setSpeed(nextSpeed);
    setMetrics(computeMetrics(pRef.current, 0));
  }

  // Init once
  useEffect(() => {
    hardReset({ grid: DEFAULT_GRID, stay: DEFAULT_STAY, speed: DEFAULT_SPEED });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function stepOnce() {
    const n = grid;
    const neigh = neighborsRef.current;
    if (!neigh) return;

    const p = pRef.current;
    const q = qRef.current;
    const len = p.length;
    if (len !== n * n) return;

    const stayW = clamp(stay, 0, 1);
    const moveW = 1 - stayW;
    const w = moveW / 4;

    for (let i = 0; i < len; i++) {
      q[i] = stayW * p[i]! + w * (p[neigh.up[i]!]! + p[neigh.down[i]!]! + p[neigh.left[i]!]! + p[neigh.right[i]!]!);
    }

    pRef.current = q;
    qRef.current = p;
    tRef.current += 1;
  }

  function draw(ctx: CanvasRenderingContext2D) {
    const theme = themeRef.current ?? getThemeColors();
    themeRef.current = theme;

    const w = ctx.canvas.width / (window.devicePixelRatio || 1);
    const h = ctx.canvas.height / (window.devicePixelRatio || 1);
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = theme.surface;
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = theme.border;
    ctx.lineWidth = 1;
    ctx.strokeRect(0.5, 0.5, w - 1, h - 1);

    const layout = computeHeatmapLayout(grid, w, h);
    layoutRef.current = layout;

    const p = pRef.current;
    let maxP = 0;
    for (let i = 0; i < p.length; i++) maxP = Math.max(maxP, p[i]!);
    maxP = Math.max(1e-12, maxP);

    const { cell, gap, originX, originY } = layout;
    const inner = Math.max(1, cell - gap);

    // heat cells
    ctx.fillStyle = theme.primary;
    for (let y = 0; y < grid; y++) {
      for (let x = 0; x < grid; x++) {
        const i = y * grid + x;
        const v = p[i]! / maxP;
        const alpha = 0.06 + 0.94 * Math.sqrt(clamp(v, 0, 1));
        ctx.globalAlpha = alpha;
        ctx.fillRect(originX + x * cell, originY + y * cell, inner, inner);
      }
    }
    ctx.globalAlpha = 1;

    // annotate max/min for quick reading
    ctx.fillStyle = theme.muted;
    ctx.font = "12px var(--font-mono)";
    ctx.fillText(`p_max=${maxP.toExponential(2)}`, 14, 18);
  }

  // Responsive resize
  useEffect(() => {
    const el = containerRef.current;
    const canvas = canvasRef.current;
    if (!el || !canvas) return;

    const resize = () => {
      const w = Math.max(320, el.clientWidth);
      const h = clamp(Math.round(w * 0.9), 260, 520);
      const ctx = applyCanvasSize(canvas, w, h);
      if (!ctx) return;
      draw(ctx);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [grid]);

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const loop = (ms: number) => {
      rafRef.current = window.requestAnimationFrame(loop);
      if (!isPlaying) {
        draw(ctx);
        return;
      }

      const last = lastMsRef.current ?? ms;
      lastMsRef.current = ms;
      const dt = Math.min(80, Math.max(0, ms - last)) / 1000;
      const rate = clamp(speed, MIN_SPEED, MAX_SPEED);
      stepAccRef.current += rate * dt;

      const stepBudget = 14; // cap work per frame for safety
      let steps = 0;
      while (stepAccRef.current >= 1 && steps < stepBudget) {
        stepOnce();
        stepAccRef.current -= 1;
        steps += 1;
      }

      const now = performance.now();
      if (now - lastMetricsMsRef.current > 90) {
        lastMetricsMsRef.current = now;
        setMetrics(computeMetrics(pRef.current, tRef.current));
      }
      draw(ctx);
    };

    rafRef.current = window.requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [grid, isPlaying, speed, stay]);

  function onCanvasClick(e: React.MouseEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const layout = layoutRef.current;
    if (!layout) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const gx = Math.floor((x - layout.originX) / layout.cell);
    const gy = Math.floor((y - layout.originY) / layout.cell);
    if (gx < 0 || gx >= layout.grid || gy < 0 || gy >= layout.grid) return;

    resetAt(gy * layout.grid + gx);
  }

  return (
    <section className="ic-card">
      <header className="ic-header">
        <div>
          <div className="ic-title-main">网络扩散热图：主方程的“可视化版本”</div>
          <div className="ic-title-sub">
            我们把概率分布当作“墨水”，每一步做一次 <MathInline tex={"p_{t+1}=p_tP"} />。点击热图任意格点，把{" "}
            <MathInline tex={"p_0"} /> 设为该点的“脉冲”，看它如何扩散并趋向均匀稳态。
          </div>
        </div>

        <div className="ic-controls">
          <label className="ic-slider">
            <span className="ic-slider-label">
              grid = <span className="ic-mono">{grid}</span>
            </span>
            <input
              type="range"
              min={MIN_GRID}
              max={MAX_GRID}
              step={1}
              value={grid}
              onChange={(e) => hardReset({ grid: clamp(Number(e.target.value) || DEFAULT_GRID, MIN_GRID, MAX_GRID) })}
            />
          </label>
          <label className="ic-slider">
            <span className="ic-slider-label">
              stay = <span className="ic-mono">{stay.toFixed(2)}</span>
            </span>
            <input
              type="range"
              min={MIN_STAY}
              max={MAX_STAY}
              step={0.02}
              value={stay}
              onChange={(e) => hardReset({ stay: clamp(Number(e.target.value) || DEFAULT_STAY, MIN_STAY, MAX_STAY) })}
            />
          </label>
          <label className="ic-slider">
            <span className="ic-slider-label">
              speed = <span className="ic-mono">{speed}</span> step/s
            </span>
            <input
              type="range"
              min={MIN_SPEED}
              max={MAX_SPEED}
              step={1}
              value={speed}
              onChange={(e) => setSpeed(clamp(Number(e.target.value) || DEFAULT_SPEED, MIN_SPEED, MAX_SPEED))}
            />
          </label>

          <button className={"ic-btn " + (isPlaying ? "ic-btn-primary" : "")} onClick={() => setIsPlaying((v) => !v)}>
            {isPlaying ? "暂停" : "播放"}
          </button>
          <button className="ic-btn ic-btn-ghost" onClick={() => hardReset()} disabled={isPlaying}>
            重置
          </button>
        </div>
      </header>

      <div ref={containerRef} className="ic-canvas-grid" style={{ gridTemplateColumns: "1fr" }}>
        <canvas
          ref={canvasRef}
          className="ic-canvas"
          aria-label="diffusion heatmap canvas"
          onClick={onCanvasClick}
          style={{ cursor: "pointer" }}
        />
      </div>

      <div className="ic-metrics">
        <div className="ic-metric">
          <div className="ic-metric-label">步数</div>
          <div className="ic-metric-value">
            <span className="ic-mono">{metrics.t}</span>
          </div>
        </div>
        <div className="ic-metric">
          <div className="ic-metric-label">到均匀的 TV 距离</div>
          <div className="ic-metric-value">
            <span className="ic-mono">{metrics.tvToUniform.toFixed(4)}</span>
          </div>
        </div>
        <div className="ic-metric">
          <div className="ic-metric-label">max / min</div>
          <div className="ic-metric-value">
            <span className="ic-mono">
              {metrics.maxP.toExponential(2)} / {metrics.minP.toExponential(2)}
            </span>
          </div>
        </div>
      </div>

      <p className="ic-footnote">
        为了让“趋近稳态”的过程更直观，这里用的是<strong>懒惰随机游走</strong>：以概率{" "}
        <MathInline tex={"\\text{stay}"} /> 留在原地，其余概率平均分到四个邻居（周期边界）。这样能避免纯最近邻随机游走的
        “棋盘振荡”，也保证稳态是均匀分布。
      </p>
    </section>
  );
}

