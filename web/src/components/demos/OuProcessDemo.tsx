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
  mean: number;
  variance: number;
  varianceTheory: number;
  varianceSteady: number;
};

const DEFAULT_N = 80;
const MIN_N = 20;
const MAX_N = 200;

const DEFAULT_THETA = 1.0;
const DEFAULT_SIGMA = 1.0;
const DEFAULT_DT = 0.02;
const DEFAULT_RATE = 1; // Euler–Maruyama steps per second (UI speed knob)

const MIN_THETA = 0.2;
const MAX_THETA = 3.0;

const MIN_SIGMA = 0.2;
const MAX_SIGMA = 3.0;

const MIN_DT = 0.005;
const MAX_DT = 0.05;

const MIN_RATE = 1;
const MAX_RATE = 240;

const HIST_BINS = 44;

function clamp(value: number, min: number, max: number) {
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

function randn(): number {
  // Box-Muller
  let u = 0;
  let v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

function gaussianPdf(x: number, variance: number) {
  const s2 = Math.max(1e-12, variance);
  const inv = 1 / Math.sqrt(2 * Math.PI * s2);
  return inv * Math.exp(-(x * x) / (2 * s2));
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

function computeMetrics(xs: Float64Array, t: number, theta: number, sigma: number): Metrics {
  const n = Math.max(1, xs.length);
  let sum = 0;
  for (let i = 0; i < xs.length; i++) sum += xs[i]!;
  const mean = sum / n;
  let sse = 0;
  for (let i = 0; i < xs.length; i++) {
    const dx = xs[i]! - mean;
    sse += dx * dx;
  }
  const variance = sse / n;
  const varianceSteady = (sigma * sigma) / (2 * theta);
  const varianceTheory = varianceSteady * (1 - Math.exp(-2 * theta * t));
  return { t, mean, variance, varianceTheory, varianceSteady };
}

function buildHistogram(xs: Float64Array, xMin: number, xMax: number, bins: number) {
  const counts = new Array<number>(bins).fill(0);
  const w = xMax - xMin;
  if (w <= 0) return counts;
  for (let i = 0; i < xs.length; i++) {
    const x = xs[i]!;
    const u = (x - xMin) / w;
    const b = Math.floor(u * bins);
    if (b < 0 || b >= bins) continue;
    counts[b] += 1;
  }
  return counts;
}

export function OuProcessDemo() {
  const [n, setN] = useState(DEFAULT_N);
  const [theta, setTheta] = useState(DEFAULT_THETA);
  const [sigma, setSigma] = useState(DEFAULT_SIGMA);
  const [dt, setDt] = useState(DEFAULT_DT);
  const [rate, setRate] = useState(DEFAULT_RATE);
  const [isPlaying, setIsPlaying] = useState(true);
  const [metrics, setMetrics] = useState<Metrics>(() =>
    computeMetrics(new Float64Array(DEFAULT_N), 0, DEFAULT_THETA, DEFAULT_SIGMA),
  );

  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasScatterRef = useRef<HTMLCanvasElement | null>(null);
  const canvasHistRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const themeRef = useRef<ThemeColors | null>(null);
  const lastMetricsUpdateRef = useRef<number>(0);
  const lastFrameMsRef = useRef<number | null>(null);
  const stepAccRef = useRef<number>(0);

  const xsRef = useRef<Float64Array>(new Float64Array(DEFAULT_N));
  const tRef = useRef<number>(0);

  function hardReset(next: { n?: number; theta?: number; sigma?: number; dt?: number } = {}) {
    const nextN = next.n ?? n;
    const nextTheta = next.theta ?? theta;
    const nextSigma = next.sigma ?? sigma;
    const nextDt = next.dt ?? dt;
    xsRef.current = new Float64Array(nextN);
    tRef.current = 0;
    lastFrameMsRef.current = null;
    stepAccRef.current = 0;
    setMetrics(computeMetrics(xsRef.current, 0, nextTheta, nextSigma));
    setN(nextN);
    setTheta(nextTheta);
    setSigma(nextSigma);
    setDt(nextDt);
  }

  function draw(scatterCtx: CanvasRenderingContext2D, histCtx: CanvasRenderingContext2D, m: Metrics) {
    const theme = themeRef.current ?? getThemeColors();
    themeRef.current = theme;

    // --- Scatter panel ---
    const sw = scatterCtx.canvas.width / (window.devicePixelRatio || 1);
    const sh = scatterCtx.canvas.height / (window.devicePixelRatio || 1);
    scatterCtx.clearRect(0, 0, sw, sh);
    scatterCtx.fillStyle = theme.surface;
    scatterCtx.fillRect(0, 0, sw, sh);
    scatterCtx.strokeStyle = theme.border;
    scatterCtx.lineWidth = 1;
    scatterCtx.strokeRect(0.5, 0.5, sw - 1, sh - 1);

    const pad = 14;
    const axisY = sh - pad - 18;
    const xMin = -4 * Math.sqrt(Math.max(1e-12, m.varianceSteady));
    const xMax = 4 * Math.sqrt(Math.max(1e-12, m.varianceSteady));

    scatterCtx.strokeStyle = "rgba(127,127,127,0.28)";
    scatterCtx.beginPath();
    scatterCtx.moveTo(pad, axisY);
    scatterCtx.lineTo(sw - pad, axisY);
    scatterCtx.stroke();

    scatterCtx.fillStyle = theme.muted;
    scatterCtx.font = "12px var(--font-mono)";
    scatterCtx.fillText(`${xMin.toFixed(1)}`, pad, axisY + 16);
    scatterCtx.fillText(`${xMax.toFixed(1)}`, sw - pad - 32, axisY + 16);

    const xs = xsRef.current;
    const nNow = xs.length;
    scatterCtx.fillStyle = theme.primary;
    for (let i = 0; i < nNow; i++) {
      const x = xs[i]!;
      const u = (x - xMin) / (xMax - xMin);
      const px = pad + clamp(u, 0, 1) * (sw - 2 * pad);
      const py = axisY - 10 - (i % 10) * 2.2;
      scatterCtx.beginPath();
      scatterCtx.arc(px, py, 2.2, 0, 2 * Math.PI);
      scatterCtx.fill();
    }

    // --- Histogram panel ---
    const hw = histCtx.canvas.width / (window.devicePixelRatio || 1);
    const hh = histCtx.canvas.height / (window.devicePixelRatio || 1);
    histCtx.clearRect(0, 0, hw, hh);
    histCtx.fillStyle = theme.surface;
    histCtx.fillRect(0, 0, hw, hh);
    histCtx.strokeStyle = theme.border;
    histCtx.lineWidth = 1;
    histCtx.strokeRect(0.5, 0.5, hw - 1, hh - 1);

    const hPad = 14;
    const plotW = hw - 2 * hPad;
    const plotH = hh - 2 * hPad - 18;
    const baseY = hPad + plotH;

    const counts = buildHistogram(xs, xMin, xMax, HIST_BINS);
    const maxCount = Math.max(1, ...counts);
    const barW = plotW / HIST_BINS;

    histCtx.fillStyle = "rgba(79,70,229,0.38)";
    for (let b = 0; b < HIST_BINS; b++) {
      const c = counts[b]!;
      const h = (c / maxCount) * plotH;
      histCtx.fillRect(hPad + b * barW, baseY - h, Math.max(0.6, barW - 0.8), h);
    }

    // theoretical PDF curve (scaled to histogram)
    const peakPdf = gaussianPdf(0, Math.max(1e-12, m.varianceTheory));
    const scale = (0.92 * plotH) / peakPdf;
    histCtx.strokeStyle = theme.accent;
    histCtx.lineWidth = 2;
    histCtx.beginPath();
    for (let k = 0; k <= 240; k++) {
      const u = k / 240;
      const x = xMin + u * (xMax - xMin);
      const y = gaussianPdf(x, Math.max(1e-12, m.varianceTheory));
      const px = hPad + u * plotW;
      const py = baseY - scale * y;
      if (k === 0) histCtx.moveTo(px, py);
      else histCtx.lineTo(px, py);
    }
    histCtx.stroke();

    histCtx.fillStyle = theme.muted;
    histCtx.font = "12px var(--font-mono)";
    histCtx.fillText("hist", hPad, hh - 8);
    histCtx.fillText("theory", hPad + 56, hh - 8);
  }

  // Resize canvases responsively
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const resize = () => {
      const w = Math.max(300, el.clientWidth);
      const scatterH = clamp(Math.round(w * 0.34), 170, 240);
      const histH = clamp(Math.round(w * 0.3), 150, 220);
      const scatterCanvas = canvasScatterRef.current;
      const histCanvas = canvasHistRef.current;
      if (!scatterCanvas || !histCanvas) return;
      const scatterCtx = applyCanvasSize(scatterCanvas, w, scatterH);
      const histCtx = applyCanvasSize(histCanvas, w, histH);
      if (!scatterCtx || !histCtx) return;
      draw(scatterCtx, histCtx, metrics);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [metrics]);

  // Simulation loop
  useEffect(() => {
    const scatterCanvas = canvasScatterRef.current;
    const histCanvas = canvasHistRef.current;
    if (!scatterCanvas || !histCanvas) return;
    const scatterCtx = scatterCanvas.getContext("2d");
    const histCtx = histCanvas.getContext("2d");
    if (!scatterCtx || !histCtx) return;

    const step = (ms: number) => {
      rafRef.current = window.requestAnimationFrame(step);
      if (!isPlaying) {
        lastFrameMsRef.current = null;
        draw(scatterCtx, histCtx, metrics);
        return;
      }

      const xs = xsRef.current;
      const last = lastFrameMsRef.current ?? ms;
      lastFrameMsRef.current = ms;
      const dtSec = Math.min(0.08, Math.max(0, (ms - last) / 1000));
      const stepsPerSecond = clamp(rate, MIN_RATE, MAX_RATE);
      stepAccRef.current += stepsPerSecond * dtSec;

      const sdt = Math.sqrt(dt);
      const stepBudget = 14;
      let steps = 0;
      while (stepAccRef.current >= 1 && steps < stepBudget) {
        for (let i = 0; i < xs.length; i++) {
          const x = xs[i]!;
          xs[i] = x + (-theta * x) * dt + sigma * sdt * randn();
        }
        tRef.current += dt;
        stepAccRef.current -= 1;
        steps += 1;
      }

      const now = performance.now();
      if (now - lastMetricsUpdateRef.current > 90) {
        lastMetricsUpdateRef.current = now;
        const m = computeMetrics(xs, tRef.current, theta, sigma);
        setMetrics(m);
        draw(scatterCtx, histCtx, m);
      } else {
        draw(scatterCtx, histCtx, metrics);
      }
    };

    rafRef.current = window.requestAnimationFrame(step);
    return () => {
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, theta, sigma, dt, rate]);

  return (
    <section className="ic-card">
      <header className="ic-header">
        <div>
          <div className="ic-title-main">OU 过程：从“收敛”到“稳定涨落”</div>
          <div className="ic-title-sub">
            轨迹满足 <MathInline tex={"dX_t=-\\theta X_t\\,dt+\\sigma\\,dW_t"} />。拖动 <span className="ic-mono">N</span>{" "}
            观察：样本数越小，估计的均值/方差越抖；样本数越大，越贴近理论曲线。
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
              onChange={(e) => hardReset({ n: clamp(Number(e.target.value) || DEFAULT_N, MIN_N, MAX_N) })}
            />
          </label>
          <label className="ic-slider">
            <span className="ic-slider-label">
              θ = <span className="ic-mono">{theta.toFixed(2)}</span>
            </span>
            <input
              type="range"
              min={MIN_THETA}
              max={MAX_THETA}
              step={0.02}
              value={theta}
              onChange={(e) => hardReset({ theta: clamp(Number(e.target.value) || DEFAULT_THETA, MIN_THETA, MAX_THETA) })}
            />
          </label>
          <label className="ic-slider">
            <span className="ic-slider-label">
              σ = <span className="ic-mono">{sigma.toFixed(2)}</span>
            </span>
            <input
              type="range"
              min={MIN_SIGMA}
              max={MAX_SIGMA}
              step={0.02}
              value={sigma}
              onChange={(e) => hardReset({ sigma: clamp(Number(e.target.value) || DEFAULT_SIGMA, MIN_SIGMA, MAX_SIGMA) })}
            />
          </label>
          <label className="ic-slider">
            <span className="ic-slider-label">
              dt = <span className="ic-mono">{dt.toFixed(3)}</span>
            </span>
            <input
              type="range"
              min={MIN_DT}
              max={MAX_DT}
              step={0.001}
              value={dt}
              onChange={(e) => hardReset({ dt: clamp(Number(e.target.value) || DEFAULT_DT, MIN_DT, MAX_DT) })}
            />
          </label>
          <label className="ic-slider">
            <span className="ic-slider-label">
              速度 = <span className="ic-mono">{rate}</span> 步/秒
            </span>
            <input
              type="range"
              min={MIN_RATE}
              max={MAX_RATE}
              step={1}
              value={rate}
              onChange={(e) => setRate(clamp(Number(e.target.value) || DEFAULT_RATE, MIN_RATE, MAX_RATE))}
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
        <canvas ref={canvasScatterRef} className="ic-canvas ic-flow-canvas" aria-label="OU scatter canvas" />
        <canvas ref={canvasHistRef} className="ic-canvas" aria-label="OU histogram canvas" />
      </div>

      <div className="ic-metrics">
        <div className="ic-metric">
          <div className="ic-metric-label">时间</div>
          <div className="ic-metric-value">
            <span className="ic-mono">{metrics.t.toFixed(2)}</span>
          </div>
        </div>
        <div className="ic-metric">
          <div className="ic-metric-label">样本均值</div>
          <div className="ic-metric-value">
            <span className="ic-mono">{metrics.mean.toFixed(3)}</span>
          </div>
        </div>
        <div className="ic-metric">
          <div className="ic-metric-label">样本方差</div>
          <div className="ic-metric-value">
            <span className="ic-mono">{metrics.variance.toFixed(3)}</span>
          </div>
        </div>
        <div className="ic-metric">
          <div className="ic-metric-label">理论方差（瞬时）</div>
          <div className="ic-metric-value">
            <span className="ic-mono">{metrics.varianceTheory.toFixed(3)}</span>
          </div>
        </div>
        <div className="ic-metric">
          <div className="ic-metric-label">理论方差（稳态）</div>
          <div className="ic-metric-value">
            <span className="ic-mono">{metrics.varianceSteady.toFixed(3)}</span>
          </div>
        </div>
      </div>

      <p className="ic-footnote">
        这段交互只依赖 Euler–Maruyama：<MathInline tex={"x\\leftarrow x-\\theta x\\,dt+\\sigma\\sqrt{dt}\\,\\eta"} />（{" "}
        <MathInline tex={"\\eta\\sim\\mathcal N(0,1)"} />）。拖动参数会重置初态为{" "}
        <MathInline tex={"X_0=0"} />，因此理论方差曲线使用{" "}
        <MathInline tex={"\\mathrm{Var}(X_t)=\\frac{\\sigma^2}{2\\theta}(1-e^{-2\\theta t})"} />。
      </p>
    </section>
  );
}
