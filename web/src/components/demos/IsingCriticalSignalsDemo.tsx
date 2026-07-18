"use client";

import { useMemo, useState } from "react";

type Curve = {
  L: number;
  chi: number[];
  binder: number[];
};

type PeakRow = {
  L: number;
  tPeak: number;
  chiPeak: number;
};

const TRUE_TC = 2.269;
const TRUE_NU = 1.0;
const TRUE_GAMMA_OVER_NU = 1.75;

const L_VALUES = [12, 16, 24, 32, 48];
const T_MIN = 1.7;
const T_MAX = 3.8;
const T_POINTS = 140;

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function pseudo01(seed: number) {
  const x = Math.sin(seed * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

function palette(i: number): string {
  const colors = ["#2563eb", "#10b981", "#f97316", "#ef4444", "#7c3aed"];
  return colors[i % colors.length]!;
}

function pathFromXY(xs: number[], ys: number[], mapX: (x: number) => number, mapY: (y: number) => number) {
  if (xs.length === 0 || ys.length !== xs.length) return "";
  let d = "";
  for (let i = 0; i < xs.length; i++) {
    const px = mapX(xs[i]!).toFixed(2);
    const py = mapY(ys[i]!).toFixed(2);
    d += i === 0 ? `M${px},${py}` : ` L${px},${py}`;
  }
  return d;
}

function interp1(xs: number[], ys: number[], x: number): number | null {
  if (xs.length < 2 || ys.length !== xs.length) return null;
  if (x < xs[0]! || x > xs[xs.length - 1]!) return null;
  let lo = 0;
  let hi = xs.length - 1;
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
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

export function IsingCriticalSignalsDemo() {
  const [tcGuess, setTcGuess] = useState(TRUE_TC - 0.05);
  const [nuGuess, setNuGuess] = useState(1.18);
  const [gammaOverNuGuess, setGammaOverNuGuess] = useState(1.45);
  const [noise, setNoise] = useState(0.05);

  const temperatures = useMemo(() => {
    const out: number[] = [];
    for (let i = 0; i < T_POINTS; i++) {
      const u = i / (T_POINTS - 1);
      out.push(T_MIN + (T_MAX - T_MIN) * u);
    }
    return out;
  }, []);

  const curves = useMemo<Curve[]>(() => {
    return L_VALUES.map((L, idxL) => {
      const chi: number[] = [];
      const binder: number[] = [];
      for (let i = 0; i < temperatures.length; i++) {
        const T = temperatures[i]!;
        const t = (T - TRUE_TC) / TRUE_TC;
        const x = t * Math.pow(L, 1 / TRUE_NU);

        const peak = 1 / (1 + ((x - 0.8) / 1.25) ** 2);
        const amp = Math.pow(L, TRUE_GAMMA_OVER_NU);
        const noiseChi = 1 + (pseudo01((idxL + 1) * 1000 + (i + 1) * 7.3) - 0.5) * 2 * noise;
        chi.push(Math.max(1e-9, amp * peak * noiseChi));

        const uBase = (2 / 3) / (1 + Math.exp(2.5 * x));
        const correction = 0.055 * Math.pow(L, -0.82) * (1 + 0.35 * x);
        const noiseU = (pseudo01((idxL + 1) * 2000 + (i + 1) * 13.7) - 0.5) * 0.012 * noise;
        binder.push(clamp(uBase + correction + noiseU, 0, 0.72));
      }
      return { L, chi, binder };
    });
  }, [noise, temperatures]);

  const peakRows = useMemo<PeakRow[]>(() => {
    return curves.map((c) => {
      let idx = 0;
      for (let i = 1; i < c.chi.length; i++) {
        if (c.chi[i]! > c.chi[idx]!) idx = i;
      }
      return { L: c.L, tPeak: temperatures[idx]!, chiPeak: c.chi[idx]! };
    });
  }, [curves, temperatures]);

  const binderCrossing = useMemo(() => {
    let bestT = temperatures[0]!;
    let bestSpread = Number.POSITIVE_INFINITY;
    for (let i = 0; i < temperatures.length; i++) {
      const values = curves.map((c) => c.binder[i]!);
      const mean = values.reduce((a, b) => a + b, 0) / values.length;
      let spread = 0;
      for (const v of values) spread += (v - mean) * (v - mean);
      spread /= values.length;
      if (spread < bestSpread) {
        bestSpread = spread;
        bestT = temperatures[i]!;
      }
    }
    return { T: bestT, spread: Math.sqrt(bestSpread) };
  }, [curves, temperatures]);

  const collapse = useMemo(() => {
    const xMin = -4;
    const xMax = 6;
    const transformed = curves.map((c) => {
      const xs: number[] = [];
      const ys: number[] = [];
      for (let i = 0; i < temperatures.length; i++) {
        const T = temperatures[i]!;
        const t = (T - tcGuess) / tcGuess;
        xs.push(t * Math.pow(c.L, 1 / nuGuess));
        ys.push(c.chi[i]! / Math.pow(c.L, gammaOverNuGuess));
      }
      return { L: c.L, xs, ys };
    });

    let yMax = 0;
    for (const c of transformed) {
      for (let i = 0; i < c.xs.length; i++) {
        const x = c.xs[i]!;
        if (x < xMin || x > xMax) continue;
        yMax = Math.max(yMax, c.ys[i]!);
      }
    }
    yMax = Math.max(1e-9, yMax);

    const sampleX: number[] = [];
    for (let i = 0; i < 70; i++) sampleX.push(xMin + (i / 69) * (xMax - xMin));
    let err = 0;
    let count = 0;
    for (const x of sampleX) {
      const ys: number[] = [];
      for (const c of transformed) {
        const y = interp1(c.xs, c.ys, x);
        if (y == null || !Number.isFinite(y)) continue;
        ys.push(y);
      }
      if (ys.length < 2) continue;
      const mean = ys.reduce((a, b) => a + b, 0) / ys.length;
      let v = 0;
      for (const y of ys) v += (y - mean) * (y - mean);
      err += Math.sqrt(v / ys.length);
      count += 1;
    }

    return {
      curves: transformed,
      xMin,
      xMax,
      yMax,
      error: count > 0 ? err / count : Number.NaN,
    };
  }, [curves, gammaOverNuGuess, nuGuess, tcGuess, temperatures]);

  const chiYMax = useMemo(() => {
    let m = 1e-9;
    for (const c of curves) for (const y of c.chi) m = Math.max(m, y);
    return m * 1.05;
  }, [curves]);

  const W = 760;
  const H = 260;
  const padL = 52;
  const padR = 18;
  const padT = 20;
  const padB = 34;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;

  const mapT = (T: number) => padL + ((T - T_MIN) / (T_MAX - T_MIN)) * plotW;
  const mapChi = (y: number) => padT + (1 - y / chiYMax) * plotH;
  const mapBinder = (u: number) => padT + (1 - u / 0.72) * plotH;
  const mapXCollapse = (x: number) => padL + ((x - collapse.xMin) / (collapse.xMax - collapse.xMin)) * plotW;
  const mapYCollapse = (y: number) => padT + (1 - y / (collapse.yMax * 1.05)) * plotH;

  return (
    <section className="ic-card">
      <header className="ic-header">
        <div>
          <div className="ic-title-main">E07：临界信号交互版（峰值 / 交点 / 塌缩）</div>
          <div className="ic-title-sub">
            一次完成三件事：1) 看 <span className="ic-mono">χ(T)</span> 峰值随 L 长高并漂移；2) 用
            <span className="ic-mono"> U_L(T)</span> 交点估计 <span className="ic-mono">Tc</span>；3) 调
            <span className="ic-mono"> Tc, ν, γ/ν</span> 做 Data Collapse。
          </div>
        </div>
        <div className="ic-controls">
          <label className="ic-slider">
            <span className="ic-slider-label">
              Tc=<span className="ic-mono">{tcGuess.toFixed(3)}</span>
            </span>
            <input
              type="range"
              min={TRUE_TC - 0.2}
              max={TRUE_TC + 0.2}
              step={0.001}
              value={tcGuess}
              onChange={(e) => setTcGuess(Number(e.target.value))}
            />
          </label>
          <label className="ic-slider">
            <span className="ic-slider-label">
              ν=<span className="ic-mono">{nuGuess.toFixed(2)}</span>
            </span>
            <input type="range" min={0.65} max={1.7} step={0.01} value={nuGuess} onChange={(e) => setNuGuess(Number(e.target.value))} />
          </label>
          <label className="ic-slider">
            <span className="ic-slider-label">
              γ/ν=<span className="ic-mono">{gammaOverNuGuess.toFixed(2)}</span>
            </span>
            <input
              type="range"
              min={0.8}
              max={2.5}
              step={0.01}
              value={gammaOverNuGuess}
              onChange={(e) => setGammaOverNuGuess(Number(e.target.value))}
            />
          </label>
          <label className="ic-slider">
            <span className="ic-slider-label">
              噪声=<span className="ic-mono">{noise.toFixed(2)}</span>
            </span>
            <input type="range" min={0} max={0.15} step={0.01} value={noise} onChange={(e) => setNoise(Number(e.target.value))} />
          </label>
          <button
            className="ic-btn ic-btn-ghost"
            onClick={() => {
              setTcGuess(TRUE_TC);
              setNuGuess(TRUE_NU);
              setGammaOverNuGuess(TRUE_GAMMA_OVER_NU);
              setNoise(0.05);
            }}
          >
            重置参考值
          </button>
        </div>
      </header>

      <div className="ic-canvas-grid" style={{ gridTemplateColumns: "1fr" }}>
        <div style={{ border: "1px solid var(--border)", borderRadius: 12, background: "var(--surface-solid)", padding: 8 }}>
          <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="260" role="img" aria-label="chi vs T for different L">
            <rect x="0.5" y="0.5" width={W - 1} height={H - 1} fill="none" stroke="var(--border)" />
            <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke="var(--border)" />
            <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke="var(--border)" />
            <line
              x1={mapT(TRUE_TC)}
              y1={padT}
              x2={mapT(TRUE_TC)}
              y2={padT + plotH}
              stroke="#10b981"
              strokeDasharray="5 4"
            />
            <text x={padL + 6} y={padT - 4} fill="var(--text-muted)" fontSize="12">
              χ(T): 峰值随 L 长高并向 Tc 漂移
            </text>
            {curves.map((c, i) => (
              <path key={`chi-${c.L}`} d={pathFromXY(temperatures, c.chi, mapT, mapChi)} fill="none" stroke={palette(i)} strokeWidth="2.2" />
            ))}
            {peakRows.map((row, i) => (
              <circle key={`peak-${row.L}`} cx={mapT(row.tPeak)} cy={mapChi(row.chiPeak)} r="3.2" fill={palette(i)} />
            ))}
            <text x={padL + plotW - 8} y={H - 8} textAnchor="end" fill="var(--text-muted)" fontSize="12">
              T
            </text>
          </svg>
        </div>

        <div style={{ border: "1px solid var(--border)", borderRadius: 12, background: "var(--surface-solid)", padding: 8 }}>
          <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="260" role="img" aria-label="binder cumulant crossing">
            <rect x="0.5" y="0.5" width={W - 1} height={H - 1} fill="none" stroke="var(--border)" />
            <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke="var(--border)" />
            <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke="var(--border)" />
            <line
              x1={mapT(TRUE_TC)}
              y1={padT}
              x2={mapT(TRUE_TC)}
              y2={padT + plotH}
              stroke="#10b981"
              strokeDasharray="5 4"
            />
            <line
              x1={mapT(binderCrossing.T)}
              y1={padT}
              x2={mapT(binderCrossing.T)}
              y2={padT + plotH}
              stroke="#ef4444"
              strokeDasharray="3 4"
            />
            <text x={padL + 6} y={padT - 4} fill="var(--text-muted)" fontSize="12">
              Binder U_L(T): 交点估计 Tc（红虚线）
            </text>
            {curves.map((c, i) => (
              <path key={`u-${c.L}`} d={pathFromXY(temperatures, c.binder, mapT, mapBinder)} fill="none" stroke={palette(i)} strokeWidth="2.2" />
            ))}
            <text x={padL + plotW - 8} y={H - 8} textAnchor="end" fill="var(--text-muted)" fontSize="12">
              T
            </text>
          </svg>
        </div>

        <div style={{ border: "1px solid var(--border)", borderRadius: 12, background: "var(--surface-solid)", padding: 8 }}>
          <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="260" role="img" aria-label="data collapse chart">
            <rect x="0.5" y="0.5" width={W - 1} height={H - 1} fill="none" stroke="var(--border)" />
            <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke="var(--border)" />
            <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke="var(--border)" />
            <line
              x1={mapXCollapse(0)}
              y1={padT}
              x2={mapXCollapse(0)}
              y2={padT + plotH}
              stroke="var(--text-muted)"
              strokeDasharray="5 4"
            />
            <text x={padL + 6} y={padT - 4} fill="var(--text-muted)" fontSize="12">
              Data Collapse: χL^(-γ/ν) vs x=(T-Tc)L^(1/ν)
            </text>
            {collapse.curves.map((c, i) => {
              const xs: number[] = [];
              const ys: number[] = [];
              for (let k = 0; k < c.xs.length; k++) {
                const x = c.xs[k]!;
                if (x < collapse.xMin || x > collapse.xMax) continue;
                xs.push(x);
                ys.push(c.ys[k]!);
              }
              return <path key={`collapse-${c.L}`} d={pathFromXY(xs, ys, mapXCollapse, mapYCollapse)} fill="none" stroke={palette(i)} strokeWidth="2.2" />;
            })}
            <text x={padL + plotW - 8} y={H - 8} textAnchor="end" fill="var(--text-muted)" fontSize="12">
              x
            </text>
          </svg>
        </div>
      </div>

      <div className="ic-metrics">
        <div className="ic-metric">
          <div className="ic-metric-label">Binder 交点估计 Tc</div>
          <div className="ic-metric-value ic-mono">{binderCrossing.T.toFixed(3)}</div>
        </div>
        <div className="ic-metric">
          <div className="ic-metric-label">真实 Tc</div>
          <div className="ic-metric-value ic-mono">{TRUE_TC.toFixed(3)}</div>
        </div>
        <div className="ic-metric">
          <div className="ic-metric-label">Collapse 误差（越小越好）</div>
          <div className="ic-metric-value ic-mono">{Number.isFinite(collapse.error) ? collapse.error.toFixed(3) : "—"}</div>
        </div>
        <div className="ic-metric">
          <div className="ic-metric-label">参考指数</div>
          <div className="ic-metric-value ic-mono">
            ν≈{TRUE_NU.toFixed(2)}, γ/ν≈{TRUE_GAMMA_OVER_NU.toFixed(2)}
          </div>
        </div>
      </div>

      <div className="ic-metrics" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))" }}>
        {peakRows.map((row, i) => (
          <div key={row.L} className="ic-metric">
            <div className="ic-metric-label" style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 10, height: 10, borderRadius: 999, background: palette(i), display: "inline-block" }} />
              L={row.L}
            </div>
            <div className="ic-mono" style={{ marginTop: 6, fontSize: 13, lineHeight: 1.5 }}>
              T_peak={row.tPeak.toFixed(3)}
              <br />
              χ_peak={row.chiPeak.toFixed(1)}
            </div>
          </div>
        ))}
      </div>

      <p className="ic-footnote">
        说明：这是面向 E07 的在线交互示意数据，保留了有限尺寸三大关键信号（峰值长高/漂移、Binder 交点、Data Collapse）。
        参数调节的目标是训练“读图 + 反推临界参数”的手感，再回到本地 notebook 做真实 MCMC 数据。
      </p>
    </section>
  );
}
