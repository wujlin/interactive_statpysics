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

type Pair = { i: number; j: number; cost: number };

type OnlineVariance = {
  n: number;
  mean: number;
  m2: number;
};

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

  // We do NOT set style.width/height here anymore to avoid layout thrashing loops.
  // CSS should handle the display size via style={{ width: '100%' }}.

  const ctx = canvas.getContext("2d");
  if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return ctx;
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function formatNumber(x: number, digits = 4) {
  if (!Number.isFinite(x)) return "NaN";
  const abs = Math.abs(x);
  if (abs > 0 && (abs < 1e-3 || abs > 1e4)) return x.toExponential(2);
  return x.toFixed(digits);
}

function welfordUpdate(state: OnlineVariance, x: number): OnlineVariance {
  const n = state.n + 1;
  const delta = x - state.mean;
  const mean = state.mean + delta / n;
  const m2 = state.m2 + delta * (x - mean);
  return { n, mean, m2 };
}

function welfordVariance(state: OnlineVariance): number {
  if (state.n < 2) return Number.NaN;
  return state.m2 / (state.n - 1);
}

function computeWeights(beta: number, pairs: Pair[]): number[] {
  const out = new Array(pairs.length);
  for (let k = 0; k < pairs.length; k++) out[k] = Math.exp(-beta * pairs[k].cost);
  return out;
}

function computeStatsFromWeights(weights: number[], pairs: Pair[]) {
  let Z = 0;
  for (const w of weights) Z += w;
  Z = Math.max(Number.EPSILON, Z);

  let mean = 0;
  for (let k = 0; k < weights.length; k++) mean += (weights[k] / Z) * pairs[k].cost;

  let varCost = 0;
  for (let k = 0; k < weights.length; k++) {
    const d = pairs[k].cost - mean;
    varCost += (weights[k] / Z) * d * d;
  }

  return { Z, meanCost: mean, varCost };
}

function computeMeanCost(beta: number, pairs: Pair[]) {
  const weights = computeWeights(beta, pairs);
  return computeStatsFromWeights(weights, pairs).meanCost;
}

function buildProbabilityGrid(n: number, weights: number[], pairs: Pair[]) {
  let Z = 0;
  for (const w of weights) Z += w;
  Z = Math.max(Number.EPSILON, Z);
  const P: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let k = 0; k < pairs.length; k++) {
    const { i, j } = pairs[k];
    P[i][j] = weights[k] / Z;
  }
  return P;
}

function drawHeatmap(
  ctx: CanvasRenderingContext2D,
  P: number[][],
  current: { i: number; j: number } | null,
  theme: ThemeColors,
) {
  const w = ctx.canvas.clientWidth;
  const h = ctx.canvas.clientHeight;
  ctx.clearRect(0, 0, w, h);

  const n = P.length;
  const margin = 18;
  const gridW = w - margin * 2;
  const gridH = h - margin * 2;
  const cell = Math.min(gridW / n, gridH / n);
  const x0 = margin + (gridW - cell * n) / 2;
  const y0 = margin + (gridH - cell * n) / 2;

  let pMax = 0;
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) pMax = Math.max(pMax, P[i][j]);
  pMax = Math.max(Number.EPSILON, pMax);

  ctx.fillStyle = theme.surface;
  ctx.fillRect(0, 0, w, h);

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const p = P[i][j];
      const t = Math.pow(p / pMax, 0.55);
      ctx.fillStyle = theme.surface;
      ctx.fillRect(x0 + j * cell, y0 + i * cell, cell, cell);

      ctx.save();
      ctx.globalAlpha = 0.1 + 0.85 * t;
      ctx.fillStyle = theme.primary;
      ctx.fillRect(x0 + j * cell, y0 + i * cell, cell, cell);
      ctx.restore();

      ctx.strokeStyle = theme.border;
      ctx.lineWidth = 1;
      ctx.strokeRect(x0 + j * cell + 0.5, y0 + i * cell + 0.5, cell, cell);
    }
  }

  ctx.fillStyle = theme.muted;
  ctx.font = "12px var(--font-sans, system-ui)";
  ctx.fillText("i → row (origin)", x0, y0 - 6);
  ctx.save();
  ctx.translate(x0 - 10, y0 + cell * n);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText("j → col (destination)", 0, 0);
  ctx.restore();

  if (current) {
    const cx = x0 + (current.j + 0.5) * cell;
    const cy = y0 + (current.i + 0.5) * cell;
    ctx.save();
    ctx.fillStyle = theme.accent;
    ctx.strokeStyle = "rgba(0,0,0,0.25)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, Math.max(5, cell * 0.18), 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }
}

export function OdSensitivityDemo() {
  const zones = useMemo(
    () => [
      { name: "A", x: 0.12, y: 0.18 },
      { name: "B", x: 0.28, y: 0.74 },
      { name: "C", x: 0.38, y: 0.28 },
      { name: "D", x: 0.56, y: 0.66 },
      { name: "E", x: 0.72, y: 0.22 },
      { name: "F", x: 0.82, y: 0.78 },
      { name: "G", x: 0.18, y: 0.52 },
      { name: "H", x: 0.62, y: 0.44 },
    ],
    [],
  );
  const n = zones.length;

  const pairs = useMemo<Pair[]>(() => {
    const out: Pair[] = [];
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (i === j) continue;
        const dx = zones[i].x - zones[j].x;
        const dy = zones[i].y - zones[j].y;
        const cost = Math.sqrt(dx * dx + dy * dy);
        out.push({ i, j, cost });
      }
    }
    return out;
  }, [n, zones]);

  const [beta, setBeta] = useState(0.8);
  const [eps, setEps] = useState(1e-2);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSampling, setIsSampling] = useState(true);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const heatmapRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  const themeRef = useRef<ThemeColors | null>(null);
  const betaRef = useRef(beta);
  const playDirRef = useRef(1);

  const distRef = useRef<{
    weights: number[];
    P: number[][];
    meanCost: number;
    varCost: number;
    dMeanCost: number;
  } | null>(null);

  const chainRef = useRef<{
    idx: number;
    accept: number;
    propose: number;
    stats: OnlineVariance;
  }>({ idx: 0, accept: 0, propose: 0, stats: { n: 0, mean: 0, m2: 0 } });

  const [mcmcUi, setMcmcUi] = useState<{ n: number; mean: number; var: number; accRate: number }>({
    n: 0,
    mean: Number.NaN,
    var: Number.NaN,
    accRate: Number.NaN,
  });

  const [exactUi, setExactUi] = useState<{
    meanCost: number;
    varCost: number;
    dMeanFd: number;
    errAbs: number;
    errRel: number;
  }>({ meanCost: 0, varCost: 0, dMeanFd: 0, errAbs: 0, errRel: 0 });

  function recomputeExact(nextBeta: number, nextEps: number) {
    const weights = computeWeights(nextBeta, pairs);
    const { meanCost, varCost } = computeStatsFromWeights(weights, pairs);
    const P = buildProbabilityGrid(n, weights, pairs);

    const meanPlus = computeMeanCost(nextBeta + nextEps, pairs);
    const meanMinus = computeMeanCost(nextBeta - nextEps, pairs);
    const dMeanFd = (meanPlus - meanMinus) / (2 * nextEps);

    const errAbs = dMeanFd - -varCost;
    const errRel = errAbs / Math.max(1e-12, Math.abs(varCost));

    distRef.current = { weights, P, meanCost, varCost, dMeanCost: dMeanFd };
    setExactUi({ meanCost, varCost, dMeanFd, errAbs, errRel });
  }

  function resetChain() {
    chainRef.current = { idx: Math.floor(Math.random() * pairs.length), accept: 0, propose: 0, stats: { n: 0, mean: 0, m2: 0 } };
    setMcmcUi({ n: 0, mean: Number.NaN, var: Number.NaN, accRate: Number.NaN });
  }

  function draw() {
    const ctx = ctxRef.current;
    if (!ctx) return;

    const theme = themeRef.current || getThemeColors();
    themeRef.current = theme;

    const dist = distRef.current;
    if (!dist) return;

    const current = isSampling && !isPlaying ? pairs[chainRef.current.idx] : null;
    drawHeatmap(ctx, dist.P, current ? { i: current.i, j: current.j } : null, theme);
  }

  useEffect(() => {
    const container = containerRef.current;
    const canvas = heatmapRef.current;
    if (!container || !canvas) return;

    const updateSize = () => {
      const cssW = Math.max(320, container.clientWidth);
      const cssH = 360;
      const ctx = applyCanvasSize(canvas, cssW, cssH);
      ctxRef.current = ctx;
      draw();
    };

    const observer = new ResizeObserver(() => {
      updateSize();
    });
    observer.observe(container);

    updateSize();

    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    betaRef.current = beta;
    recomputeExact(beta, eps);
    resetChain();
    draw();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [beta, eps]);

  useEffect(() => {
    let raf = 0;
    let lastMs: number | null = null;
    let uiTick = 0;

    function frame(ms: number) {
      const dt = lastMs == null ? 0 : Math.min(0.05, (ms - lastMs) / 1000);
      lastMs = ms;

      if (isPlaying) {
        const minBeta = 0;
        const maxBeta = 3;
        const speed = 0.55;
        let next = betaRef.current + playDirRef.current * speed * dt;
        if (next > maxBeta) {
          next = maxBeta;
          playDirRef.current = -1;
        } else if (next < minBeta) {
          next = minBeta;
          playDirRef.current = 1;
        }
        if (Math.abs(next - betaRef.current) > 1e-6) {
          betaRef.current = next;
          recomputeExact(next, eps);
        }
      }

      if (isSampling && !isPlaying) {
        const dist = distRef.current;
        if (dist) {
          const stepsPerFrame = 1200;
          let { idx, accept, propose, stats } = chainRef.current;
          const weights = dist.weights;
          for (let s = 0; s < stepsPerFrame; s++) {
            propose++;
            const cand = Math.floor(Math.random() * weights.length);
            const ratio = weights[cand] / Math.max(Number.EPSILON, weights[idx]);
            if (ratio >= 1 || Math.random() < ratio) {
              idx = cand;
              accept++;
            }
            const x = pairs[idx].cost;
            stats = welfordUpdate(stats, x);
          }
          chainRef.current = { idx, accept, propose, stats };

          uiTick += dt;
          if (uiTick > 0.2) {
            uiTick = 0;
            const varHat = welfordVariance(stats);
            setMcmcUi({
              n: stats.n,
              mean: stats.mean,
              var: varHat,
              accRate: propose > 0 ? accept / propose : Number.NaN,
            });
          }
        }
      }

      draw();
      raf = window.requestAnimationFrame(frame);
    }

    raf = window.requestAnimationFrame(frame);
    return () => window.cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, isSampling, eps, pairs]);

  useEffect(() => {
    // Legacy resize listener removed in favor of ResizeObserver
    return () => { };
  }, []);

  const derivativeTarget = -exactUi.varCost;
  const mcmcDerivative = Number.isFinite(mcmcUi.var) ? -mcmcUi.var : Number.NaN;

  return (
    <section className="ic-card" ref={containerRef}>
      <div className="ic-header">
        <div>
          <div className="ic-title-main">E05：敏感性 = 协方差（OD 选项的最小实验）</div>
          <div className="ic-title-sub">
            我们把每个 OD 对 (i→j) 当作一个“可选微观态”，成本为 c(i,j)，并定义 pβ(i,j) ∝ exp(−βc)。在这个指数族里：
            d⟨c⟩/dβ = −Var(c)。用“数值微分”与“采样协方差”互相校验，是抓 bug 的最快方式之一。
          </div>
        </div>
        <div className="ic-controls">
          <div className="ic-slider">
            <div className="ic-slider-label">β（成本敏感度）</div>
            <input
              type="range"
              min={0}
              max={3}
              step={0.01}
              value={beta}
              onChange={(e) => setBeta(Number(e.target.value))}
              aria-label="beta"
            />
            <div className="ic-mono">{formatNumber(beta, 2)}</div>
          </div>

          <div className="ic-slider">
            <div className="ic-slider-label">ε（差分步长）</div>
            <input
              type="range"
              min={1e-3}
              max={5e-2}
              step={1e-3}
              value={eps}
              onChange={(e) => setEps(Number(e.target.value))}
              aria-label="epsilon"
            />
            <div className="ic-mono">{formatNumber(eps, 3)}</div>
          </div>

          <button className={"ic-btn " + (isPlaying ? "ic-btn-primary" : "")} onClick={() => setIsPlaying((v) => !v)}>
            {isPlaying ? "暂停 β 动画" : "播放 β 动画"}
          </button>
          <button className={"ic-btn " + (isSampling ? "ic-btn-primary" : "")} onClick={() => setIsSampling((v) => !v)}>
            {isSampling ? "暂停采样" : "开始采样"}
          </button>
          <button className="ic-btn ic-btn-ghost" onClick={resetChain} disabled={isPlaying}>
            重置采样
          </button>
        </div>
      </div>

      <div className="ic-canvas-grid">
        <canvas ref={heatmapRef} className="ic-canvas" style={{ width: "100%", height: "360px" }} />
      </div>

      <div className="ic-metrics">
        <div className="ic-metric">
          <div className="ic-metric-label">⟨c⟩（精确）</div>
          <div className="ic-metric-value ic-mono">{formatNumber(exactUi.meanCost)}</div>
        </div>
        <div className="ic-metric">
          <div className="ic-metric-label">Var(c)（精确）</div>
          <div className="ic-metric-value ic-mono">{formatNumber(exactUi.varCost)}</div>
        </div>
        <div className="ic-metric">
          <div className="ic-metric-label">d⟨c⟩/dβ（差分）</div>
          <div className="ic-metric-value ic-mono">{formatNumber(exactUi.dMeanFd)}</div>
        </div>
        <div className="ic-metric">
          <div className="ic-metric-label">−Var(c)（应当等于上面）</div>
          <div className="ic-metric-value ic-mono">{formatNumber(derivativeTarget)}</div>
        </div>
        <div className="ic-metric">
          <div className="ic-metric-label">误差 d⟨c⟩/dβ − (−Var)</div>
          <div className="ic-metric-value ic-mono">{formatNumber(exactUi.errAbs)}</div>
        </div>
        <div className="ic-metric">
          <div className="ic-metric-label">相对误差 / Var</div>
          <div className="ic-metric-value ic-mono">{formatNumber(exactUi.errRel, 3)}</div>
        </div>
      </div>

      <div className="ic-metrics">
        <div className="ic-metric">
          <div className="ic-metric-label">MCMC 样本数（步）</div>
          <div className="ic-metric-value ic-mono">{mcmcUi.n}</div>
        </div>
        <div className="ic-metric">
          <div className="ic-metric-label">Var(c)（MCMC 估计）</div>
          <div className="ic-metric-value ic-mono">{formatNumber(mcmcUi.var)}</div>
        </div>
        <div className="ic-metric">
          <div className="ic-metric-label">−Var(c)（MCMC）</div>
          <div className="ic-metric-value ic-mono">{formatNumber(mcmcDerivative)}</div>
        </div>
        <div className="ic-metric">
          <div className="ic-metric-label">接受率</div>
          <div className="ic-metric-value ic-mono">{formatNumber(mcmcUi.accRate, 3)}</div>
        </div>
      </div>

      <div className="ic-footnote">
        小提示：采样对照建议在固定 β 下进行（播放 β 动画时已停止在热图上显示采样位置）。β 越大分布越尖，Metropolis 接受率可能变低，
        这也是“有效样本量”需要被认真对待的原因之一。
      </div>
    </section>
  );
}
