"use client";

import katex from "katex";
import type { ReactNode } from "react";
import { useEffect, useMemo, useRef, useState } from "react";

type ThemeColors = {
  text: string;
  muted: string;
  border: string;
  surface: string;
  primary: string;
  accent: string;
};

type Curve = { L: number; chi: number[] };

const TRUE_TC = 2.269;
const TRUE_NU = 1.0;
const TRUE_GAMMA_OVER_NU = 1.75;

const L_VALUES = [16, 32, 64];
const T_POINTS = 180;
const T_WINDOW = 0.18;

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

function pseudo01(seed: number) {
  const x = Math.sin(seed) * 43758.5453123;
  return x - Math.floor(x);
}

function scalingPeak(x: number) {
  // 一个“伪临界峰”形状：最大值不在 0，让峰值位置随 L 系统性漂移（T_peak(L)=Tc + O(L^{-1/nu}))
  const x0 = 0.8;
  const w = 1.25;
  const z = (x - x0) / w;
  return 1 / (1 + z * z);
}

function palette(i: number): string {
  const colors = ["#4f46e5", "#10b981", "#f97316", "#ef4444", "#06b6d4"];
  return colors[i % colors.length]!;
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

function interp1(xs: number[], ys: number[], x: number): number | null {
  if (xs.length !== ys.length || xs.length < 2) return null;
  if (x < xs[0]! || x > xs[xs.length - 1]!) return null;
  // xs 单调递增（这里按 T 排列后映射而来）
  let lo = 0;
  let hi = xs.length - 1;
  while (hi - lo > 1) {
    const mid = Math.floor((lo + hi) / 2);
    if (xs[mid]! <= x) lo = mid;
    else hi = mid;
  }
  const x0 = xs[lo]!;
  const x1 = xs[hi]!;
  const y0 = ys[lo]!;
  const y1 = ys[hi]!;
  const t = (x - x0) / Math.max(1e-12, x1 - x0);
  return y0 + (y1 - y0) * t;
}

export function FiniteSizeScalingDemo() {
  const [tcGuess, setTcGuess] = useState(TRUE_TC - 0.06);
  const [nuGuess, setNuGuess] = useState(TRUE_NU + 0.35);
  const [gammaOverNuGuess, setGammaOverNuGuess] = useState(TRUE_GAMMA_OVER_NU - 0.55);
  const [noise, setNoise] = useState(0.06);
  const [isAuto, setIsAuto] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const rawCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const collapseCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const themeRef = useRef<ThemeColors | null>(null);
  const sizeRef = useRef<{ w: number; rawH: number; colH: number }>({ w: 0, rawH: 0, colH: 0 });
  const autoDirRef = useRef(1);
  const tcAnimRef = useRef(tcGuess);

  const temps = useMemo(() => {
    const out: number[] = [];
    const tMin = TRUE_TC - T_WINDOW;
    const tMax = TRUE_TC + T_WINDOW;
    for (let i = 0; i < T_POINTS; i++) {
      const u = i / (T_POINTS - 1);
      out.push(tMin + (tMax - tMin) * u);
    }
    return out;
  }, []);

  const curvesClean = useMemo<Curve[]>(() => {
    return L_VALUES.map((L) => {
      const chi: number[] = temps.map((T) => {
        const t = (T - TRUE_TC) / TRUE_TC;
        const x = t * Math.pow(L, 1 / TRUE_NU);
        const amp = Math.pow(L, TRUE_GAMMA_OVER_NU);
        return Math.max(1e-9, amp * scalingPeak(x));
      });
      return { L, chi };
    });
  }, [temps]);

  const curvesNoisy = useMemo<Curve[]>(() => {
    const eps = clamp(noise, 0, 0.18);
    return curvesClean.map((c, idxL) => {
      const chi = c.chi.map((v, idxT) => {
        if (eps <= 0) return v;
        const r = pseudo01((idxL + 1) * 1000 + (idxT + 1) * 17.7);
        const jitter = (r - 0.5) * 2;
        const out = v * (1 + eps * jitter);
        return Math.max(1e-9, out);
      });
      return { L: c.L, chi };
    });
  }, [curvesClean, noise]);

  const curveSet = curvesNoisy;

  const collapseSummary = useMemo(() => {
    const xMin = -4;
    const xMax = 6;
    const samples = 70;
    const xs = Array.from({ length: samples }, (_v, i) => xMin + (i / (samples - 1)) * (xMax - xMin));

    const scaled = curveSet.map((c) => {
      const xArr: number[] = [];
      const yArr: number[] = [];
      for (let k = 0; k < temps.length; k++) {
        const T = temps[k]!;
        const t = (T - tcGuess) / tcGuess;
        const x = t * Math.pow(c.L, 1 / nuGuess);
        const y = c.chi[k]! / Math.pow(c.L, gammaOverNuGuess);
        xArr.push(x);
        yArr.push(y);
      }
      return { L: c.L, xArr, yArr };
    });

    // collapse 误差：对每个 x 采样点，看不同 L 的 y(x) 分散程度（std），再取平均
    let acc = 0;
    let count = 0;
    for (const x of xs) {
      const ys: number[] = [];
      for (const c of scaled) {
        const y = interp1(c.xArr, c.yArr, x);
        if (y != null && Number.isFinite(y)) ys.push(y);
      }
      if (ys.length < 2) continue;
      const mean = ys.reduce((a, b) => a + b, 0) / ys.length;
      const varY = ys.reduce((a, b) => a + (b - mean) * (b - mean), 0) / ys.length;
      acc += Math.sqrt(varY);
      count += 1;
    }
    const error = count > 0 ? acc / count : Number.NaN;
    return { error };
  }, [curveSet, gammaOverNuGuess, nuGuess, tcGuess, temps]);

  function draw() {
    const container = containerRef.current;
    const rawCanvas = rawCanvasRef.current;
    const collapseCanvas = collapseCanvasRef.current;
    if (!container || !rawCanvas || !collapseCanvas) return;

    const { w, rawH, colH } = sizeRef.current;
    if (w <= 0 || rawH <= 0 || colH <= 0) return;

    const theme = themeRef.current ?? getThemeColors();
    themeRef.current = theme;

    const rawCtx = rawCanvas.getContext("2d");
    const colCtx = collapseCanvas.getContext("2d");
    if (!rawCtx || !colCtx) return;

    // --- Raw plot: chi(T) ---
    {
      const ctx = rawCtx;
      ctx.clearRect(0, 0, w, rawH);
      ctx.fillStyle = theme.surface;
      ctx.fillRect(0, 0, w, rawH);
      ctx.strokeStyle = theme.border;
      ctx.lineWidth = 1;
      ctx.strokeRect(0.5, 0.5, w - 1, rawH - 1);

      const pad = 40;
      const x0 = pad;
      const y0 = 18;
      const plotW = w - pad - 16;
      const plotH = rawH - y0 - 34;

      const Tmin = temps[0]!;
      const Tmax = temps[temps.length - 1]!;
      let yMax = 0;
      for (const c of curveSet) for (const v of c.chi) yMax = Math.max(yMax, v);
      yMax = Math.max(1e-9, yMax) * 1.05;

      const sx = (T: number) => x0 + ((T - Tmin) / (Tmax - Tmin)) * plotW;
      const sy = (y: number) => y0 + plotH * (1 - y / yMax);

      // axes
      ctx.strokeStyle = theme.border;
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.lineTo(x0, y0 + plotH);
      ctx.lineTo(x0 + plotW, y0 + plotH);
      ctx.stroke();

      // Tc true & guess lines
      const drawVLine = (T: number, color: string, dash: number[]) => {
        ctx.save();
        ctx.strokeStyle = color;
        ctx.setLineDash(dash);
        ctx.beginPath();
        ctx.moveTo(sx(T), y0);
        ctx.lineTo(sx(T), y0 + plotH);
        ctx.stroke();
        ctx.restore();
      };
      drawVLine(TRUE_TC, theme.muted, [5, 4]);
      drawVLine(tcGuess, theme.accent, [3, 3]);

      // curves
      for (let i = 0; i < curveSet.length; i++) {
        const c = curveSet[i]!;
        ctx.strokeStyle = palette(i);
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(sx(temps[0]!), sy(c.chi[0]!));
        for (let k = 1; k < temps.length; k++) ctx.lineTo(sx(temps[k]!), sy(c.chi[k]!));
        ctx.stroke();
      }

      // labels
      ctx.fillStyle = theme.muted;
      ctx.font = "12px var(--font-sans, system-ui)";
      ctx.fillText("raw: χ(T)  (finite L)", x0, y0 - 6);
      ctx.fillText("T", x0 + plotW - 10, y0 + plotH + 22);
      ctx.save();
      ctx.translate(14, y0 + plotH / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText("χ", 0, 0);
      ctx.restore();
    }

    // --- Collapse plot: scaled ---
    {
      const ctx = colCtx;
      ctx.clearRect(0, 0, w, colH);
      ctx.fillStyle = theme.surface;
      ctx.fillRect(0, 0, w, colH);
      ctx.strokeStyle = theme.border;
      ctx.lineWidth = 1;
      ctx.strokeRect(0.5, 0.5, w - 1, colH - 1);

      const pad = 40;
      const x0 = pad;
      const y0 = 18;
      const plotW = w - pad - 16;
      const plotH = colH - y0 - 34;

      const xMin = -4;
      const xMax = 6;
      let yMax = 0;
      for (const c of curveSet) {
        for (let k = 0; k < temps.length; k++) {
          const T = temps[k]!;
          const t = (T - tcGuess) / tcGuess;
          const x = t * Math.pow(c.L, 1 / nuGuess);
          if (x < xMin || x > xMax) continue;
          const y = c.chi[k]! / Math.pow(c.L, gammaOverNuGuess);
          yMax = Math.max(yMax, y);
        }
      }
      yMax = Math.max(1e-9, yMax) * 1.08;

      const sx = (x: number) => x0 + ((x - xMin) / (xMax - xMin)) * plotW;
      const sy = (y: number) => y0 + plotH * (1 - y / yMax);

      // axes
      ctx.strokeStyle = theme.border;
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.lineTo(x0, y0 + plotH);
      ctx.lineTo(x0 + plotW, y0 + plotH);
      ctx.stroke();

      // x=0 line
      ctx.save();
      ctx.strokeStyle = theme.muted;
      ctx.setLineDash([5, 4]);
      ctx.beginPath();
      ctx.moveTo(sx(0), y0);
      ctx.lineTo(sx(0), y0 + plotH);
      ctx.stroke();
      ctx.restore();

      for (let i = 0; i < curveSet.length; i++) {
        const c = curveSet[i]!;
        ctx.strokeStyle = palette(i);
        ctx.lineWidth = 2;
        ctx.beginPath();
        let started = false;
        for (let k = 0; k < temps.length; k++) {
          const T = temps[k]!;
          const t = (T - tcGuess) / tcGuess;
          const x = t * Math.pow(c.L, 1 / nuGuess);
          if (x < xMin || x > xMax) continue;
          const y = c.chi[k]! / Math.pow(c.L, gammaOverNuGuess);
          if (!started) {
            ctx.moveTo(sx(x), sy(y));
            started = true;
          } else {
            ctx.lineTo(sx(x), sy(y));
          }
        }
        ctx.stroke();
      }

      ctx.fillStyle = theme.muted;
      ctx.font = "12px var(--font-sans, system-ui)";
      ctx.fillText("collapse: χ L^{-γ/ν} vs x = t L^{1/ν}", x0, y0 - 6);
      ctx.fillText("x", x0 + plotW - 10, y0 + plotH + 22);
      ctx.save();
      ctx.translate(14, y0 + plotH / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText("scaled χ", 0, 0);
      ctx.restore();
    }
  }

  // Resize
  useEffect(() => {
    const el = containerRef.current;
    const rawCanvas = rawCanvasRef.current;
    const colCanvas = collapseCanvasRef.current;
    if (!el || !rawCanvas || !colCanvas) return;

    const ro = new ResizeObserver(() => {
      const w = el.clientWidth;
      const rawH = clamp(Math.round(w * 0.36), 200, 290);
      const colH = clamp(Math.round(w * 0.36), 200, 290);
      sizeRef.current = { w, rawH, colH };
      const rawCtx = applyCanvasSize(rawCanvas, w, rawH);
      const colCtx = applyCanvasSize(colCanvas, w, colH);
      if (!rawCtx || !colCtx) return;
      draw();
    });
    ro.observe(el);

    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Redraw on params
  useEffect(() => {
    draw();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tcGuess, nuGuess, gammaOverNuGuess, noise]);

  // Auto sweep Tc
  useEffect(() => {
    if (!isAuto) return;
    tcAnimRef.current = tcGuess;
    autoDirRef.current = 1;

    const lo = TRUE_TC - 0.1;
    const hi = TRUE_TC + 0.1;
    const speed = 0.05; // Tc per second
    let last = performance.now();
    let raf = 0;

    const loop = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      const dir = autoDirRef.current;
      let next = tcAnimRef.current + dir * speed * dt;
      if (next > hi) {
        next = hi;
        autoDirRef.current = -1;
      }
      if (next < lo) {
        next = lo;
        autoDirRef.current = 1;
      }
      tcAnimRef.current = next;
      setTcGuess(next);
      raf = window.requestAnimationFrame(loop);
    };

    raf = window.requestAnimationFrame(loop);
    return () => window.cancelAnimationFrame(raf);
  }, [isAuto, tcGuess]);

  function legendRow() {
    return (
      <div className="ic-metrics" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))" }}>
        {curveSet.map((c, idx) => (
          <div key={c.L} className="ic-metric" style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ width: 10, height: 10, borderRadius: 999, background: palette(idx) }} />
            <div className="ic-metric-label" style={{ margin: 0 }}>
              L = <span className="ic-mono">{c.L}</span>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const sub: ReactNode = (
    <>
      左图是 <MathInline tex={"\\chi(T)"} /> 的“峰值变尖 / 漂移”；右图把横轴改成{" "}
      <MathInline tex={"x=tL^{1/\\nu}"} />、纵轴改成 <MathInline tex={"\\chi L^{-\\gamma/\\nu}"} />。
      试着调 <MathInline tex={"T_c,\\nu,\\gamma/\\nu"} /> 让曲线尽量重合（collapse）。
    </>
  );

  return (
    <section className="ic-card">
      <header className="ic-header">
        <div className="ic-title">
          <div className="ic-title-main">有限尺寸标度：Data Collapse（网页交互版）</div>
          <div className="ic-title-sub">{sub}</div>
        </div>
        <div className="ic-controls">
          <label className="ic-slider">
            <span className="ic-slider-label">
              Tc = <span className="ic-mono">{tcGuess.toFixed(3)}</span>
            </span>
            <input
              type="range"
              min={TRUE_TC - 0.2}
              max={TRUE_TC + 0.2}
              step={0.001}
              value={tcGuess}
              onChange={(e) => setTcGuess(Number(e.target.value))}
              disabled={isAuto}
            />
          </label>
          <label className="ic-slider">
            <span className="ic-slider-label">
              ν = <span className="ic-mono">{nuGuess.toFixed(2)}</span>
            </span>
            <input
              type="range"
              min={0.6}
              max={1.8}
              step={0.01}
              value={nuGuess}
              onChange={(e) => setNuGuess(Number(e.target.value))}
            />
          </label>
          <label className="ic-slider">
            <span className="ic-slider-label">
              γ/ν = <span className="ic-mono">{gammaOverNuGuess.toFixed(2)}</span>
            </span>
            <input
              type="range"
              min={0.8}
              max={2.6}
              step={0.01}
              value={gammaOverNuGuess}
              onChange={(e) => setGammaOverNuGuess(Number(e.target.value))}
            />
          </label>
          <label className="ic-slider">
            <span className="ic-slider-label">
              噪声 = <span className="ic-mono">{noise.toFixed(2)}</span>
            </span>
            <input
              type="range"
              min={0}
              max={0.15}
              step={0.01}
              value={noise}
              onChange={(e) => setNoise(Number(e.target.value))}
            />
          </label>
          <button
            className={`ic-btn ${isAuto ? "ic-btn-primary" : ""}`}
            onClick={() => setIsAuto((v) => !v)}
            aria-pressed={isAuto}
          >
            {isAuto ? "停止演示" : "演示：扫 Tc"}
          </button>
          <button
            className="ic-btn ic-btn-ghost"
            onClick={() => {
              setIsAuto(false);
              setTcGuess(TRUE_TC);
              setNuGuess(TRUE_NU);
              setGammaOverNuGuess(TRUE_GAMMA_OVER_NU);
              setNoise(0.06);
            }}
          >
            重置到参考值
          </button>
        </div>
      </header>

      <div ref={containerRef} className="ic-canvas-grid" style={{ gridTemplateColumns: "1fr" }}>
        <canvas ref={rawCanvasRef} className="ic-canvas" aria-label="raw chi(T) plot" />
        <canvas ref={collapseCanvasRef} className="ic-canvas" aria-label="data collapse plot" />
      </div>

      {legendRow()}

      <div className="ic-metrics">
        <div className="ic-metric">
          <div className="ic-metric-label">Collapse 误差（越小越好）</div>
          <div className="ic-metric-value">
            <span className="ic-mono">{Number.isFinite(collapseSummary.error) ? collapseSummary.error.toFixed(3) : "—"}</span>
          </div>
        </div>
        <div className="ic-metric">
          <div className="ic-metric-label">参考（用于对照，不必背）</div>
          <div className="ic-metric-value">
            <span className="ic-mono">
              Tc≈{TRUE_TC.toFixed(3)}
              <br />
              ν≈{TRUE_NU.toFixed(2)}, γ/ν≈{TRUE_GAMMA_OVER_NU.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      <p className="ic-footnote">
        说明：这里用一组“合成的有限尺寸 χ(T)”来演示标度算法（峰值会随 L 变尖、并向 Tc 收敛），目的是让你在网页里亲手做一次
        Data Collapse；真实数据可以换成你的 Ising 模拟输出（见 E07）。
      </p>
    </section>
  );
}

