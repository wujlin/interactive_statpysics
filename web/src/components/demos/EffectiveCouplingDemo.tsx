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

const LN2 = Math.log(2);

const N_SPINS = 8;
const N_STATES = 1 << N_SPINS;

const DEFAULT_T = 2.35;
const DEFAULT_J_BLOCK = 1.0;

// 这里把两个 2×2 块“面对面接触”的边界键设为 4 条（一一对应的 2×2 面）。
// 你可以把它理解成 3D 中两个 2×2×2 块接触的一张 2×2 截面：因此有 4 条边界键。
const J_EDGE = 1.0;

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

function spinsFromState(state: number, out: Int8Array) {
  for (let i = 0; i < N_SPINS; i++) out[i] = ((state >> i) & 1) === 1 ? 1 : -1;
}

// 左块：0..3，右块：4..7，按 2×2 排列：
// 0 1 | 4 5
// 2 3 | 6 7
function blockMag(spins: Int8Array, offset: 0 | 4) {
  return spins[offset] + spins[offset + 1] + spins[offset + 2] + spins[offset + 3];
}

function intraSum2x2(spins: Int8Array, offset: 0 | 4) {
  const a = spins[offset]!;
  const b = spins[offset + 1]!;
  const c = spins[offset + 2]!;
  const d = spins[offset + 3]!;
  // 2×2 的最近邻边：a-b, a-c, b-d, c-d
  return a * b + a * c + b * d + c * d;
}

function crossSumFace(spins: Int8Array) {
  // “2×2 面”一一对应的 4 条边界键
  return spins[0]! * spins[4]! + spins[1]! * spins[5]! + spins[2]! * spins[6]! + spins[3]! * spins[7]!;
}

function mapProb(m: number, S: 1 | -1): number {
  if (m > 0) return S === 1 ? 1 : 0;
  if (m < 0) return S === -1 ? 1 : 0;
  return 0.5; // 平局：随机打破对称（保证不引入偏置场）
}

function sampleFromCdf(cdf: Float64Array, total: number): number {
  const r = Math.random() * total;
  for (let i = 0; i < cdf.length; i++) {
    if (r <= cdf[i]!) return i;
  }
  return cdf.length - 1;
}

function atanh(x: number) {
  // for |x|<1
  return 0.5 * Math.log((1 + x) / (1 - x));
}

type CoarseWeights = { pp: number; pm: number; mp: number; mm: number };

type EffectiveCouplingStats = {
  beta: number;
  weights: Float64Array;
  cdf: Float64Array;
  totalWeight: number;
  coarse: CoarseWeights;
  JEff: number;
  coarseCorr: number;
  coherence: number; // ⟨|m_block|/4⟩（两块平均）
  boundaryCorr: number; // ⟨(1/4)∑ s_L s_R⟩
};

function computeStats(T: number, jBlock: number): EffectiveCouplingStats {
  const t = Math.max(1e-6, T);
  const beta = 1 / t;

  const spins = new Int8Array(N_SPINS);
  const logw = new Float64Array(N_STATES);
  let maxLog = Number.NEGATIVE_INFINITY;

  // Pass 1: compute log weights and find max for stable exponentiation
  for (let s = 0; s < N_STATES; s++) {
    spinsFromState(s, spins);
    const intra = intraSum2x2(spins, 0) + intraSum2x2(spins, 4);
    const cross = crossSumFace(spins);
    // E = - jBlock * intra - J_EDGE * cross  =>  -βE = β(jBlock*intra + J_EDGE*cross)
    const lw = beta * (jBlock * intra + J_EDGE * cross);
    logw[s] = lw;
    if (lw > maxLog) maxLog = lw;
  }

  const weights = new Float64Array(N_STATES);
  const cdf = new Float64Array(N_STATES);
  let total = 0;

  // Expectations
  let coherenceAcc = 0;
  let boundaryAcc = 0;

  // Coarse weights
  const coarse: CoarseWeights = { pp: 0, pm: 0, mp: 0, mm: 0 };

  for (let s = 0; s < N_STATES; s++) {
    spinsFromState(s, spins);
    const w = Math.exp(logw[s]! - maxLog); // scaled weight
    weights[s] = w;
    total += w;

    const m1 = blockMag(spins, 0);
    const m2 = blockMag(spins, 4);
    coherenceAcc += w * ((Math.abs(m1) + Math.abs(m2)) / 8); // /4 then average over 2 blocks => /8
    boundaryAcc += w * (crossSumFace(spins) / 4);

    const p1p = mapProb(m1, 1);
    const p1m = mapProb(m1, -1);
    const p2p = mapProb(m2, 1);
    const p2m = mapProb(m2, -1);

    coarse.pp += w * p1p * p2p;
    coarse.pm += w * p1p * p2m;
    coarse.mp += w * p1m * p2p;
    coarse.mm += w * p1m * p2m;
  }

  let acc = 0;
  for (let s = 0; s < N_STATES; s++) {
    acc += weights[s]!;
    cdf[s] = acc;
  }

  const coherence = total > 0 ? coherenceAcc / total : 0;
  const boundaryCorr = total > 0 ? boundaryAcc / total : 0;

  // Effective coupling: match to a 2-spin Ising H_eff = - J' S1 S2 (no fields by symmetry).
  // W_same / W_opp = exp(2βJ')  => J' = (1/(2β)) ln(W++ / W+-)
  const Wpp = coarse.pp;
  const Wpm = coarse.pm;
  const Wmp = coarse.mp;
  const Wmm = coarse.mm;
  const eps = 1e-15;
  const JEff = beta > 0 ? (1 / (2 * beta)) * Math.log((Wpp + eps) / (Wpm + eps)) : 0;

  // Coarse correlation ⟨S1 S2⟩ under the coarse-grained weights.
  const Wsame = Wpp + Wmm;
  const Wopp = Wpm + Wmp;
  const denom = Wsame + Wopp;
  const coarseCorr = denom > 0 ? (Wsame - Wopp) / denom : 0;

  return { beta, weights, cdf, totalWeight: total, coarse, JEff, coarseCorr, coherence, boundaryCorr };
}

function pickSuperSpinFromMicro(m: number): 1 | -1 {
  if (m > 0) return 1;
  if (m < 0) return -1;
  return Math.random() < 0.5 ? 1 : -1;
}

export function EffectiveCouplingDemo() {
  const [T, setT] = useState(DEFAULT_T);
  const [jBlock, setJBlock] = useState(DEFAULT_J_BLOCK);
  const [isRunning, setIsRunning] = useState(true);
  const [stateId, setStateId] = useState<number>(0);

  const wrapRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const themeRef = useRef<ThemeColors | null>(null);
  const spinsRef = useRef<Int8Array>(new Int8Array(N_SPINS));

  const stats = useMemo(() => computeStats(T, jBlock), [T, jBlock]);

  // Whenever parameters change, resample once so the picture is consistent.
  useEffect(() => {
    setStateId(sampleFromCdf(stats.cdf, stats.totalWeight));
  }, [stats.cdf, stats.totalWeight]);

  // Auto sampling
  useEffect(() => {
    if (!isRunning) return;
    const id = window.setInterval(() => {
      setStateId(sampleFromCdf(stats.cdf, stats.totalWeight));
    }, 420);
    return () => window.clearInterval(id);
  }, [isRunning, stats.cdf, stats.totalWeight]);

  // Resize canvas
  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const ro = new ResizeObserver(() => {
      const w = clamp(wrap.clientWidth, 260, 760);
      const h = clamp(Math.floor(w * 0.52), 220, 420);
      applyCanvasSize(canvas, w, h);
      draw();
    });
    ro.observe(wrap);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function draw() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const context = ctx;

    const theme = themeRef.current ?? getThemeColors();
    themeRef.current = theme;

    const w = context.canvas.width / (window.devicePixelRatio || 1);
    const h = context.canvas.height / (window.devicePixelRatio || 1);
    context.clearRect(0, 0, w, h);

    // Layout
    const margin = 18;
    const cell = Math.floor(
      Math.min((w - margin * 2) / 5, (h - margin * 2) / 2), // 2×2 + gap + 2×2 => ~5 cells width
    );
    const gap = cell;
    const leftX = margin;
    const topY = margin;
    const rightX = margin + 2 * cell + gap;

    // Background card
    context.fillStyle = theme.surface;
    context.fillRect(0, 0, w, h);
    context.strokeStyle = theme.border;
    context.lineWidth = 1;
    context.strokeRect(0.5, 0.5, w - 1, h - 1);

    // Decode spins
    const spins = spinsRef.current;
    spinsFromState(stateId, spins);
    const m1 = blockMag(spins, 0);
    const m2 = blockMag(spins, 4);
    const S1 = pickSuperSpinFromMicro(m1);
    const S2 = pickSuperSpinFromMicro(m2);

    const up = theme.primary;
    const down = "#f97316";

    function cellPos(block: "L" | "R", idx: 0 | 1 | 2 | 3) {
      const baseX = block === "L" ? leftX : rightX;
      const dx = idx === 1 || idx === 3 ? 1 : 0;
      const dy = idx === 2 || idx === 3 ? 1 : 0;
      return { x: baseX + dx * cell, y: topY + dy * cell };
    }

    // Draw blocks outline
    context.strokeStyle = theme.border;
    context.lineWidth = 1.5;
    context.strokeRect(leftX - 0.5, topY - 0.5, 2 * cell + 1, 2 * cell + 1);
    context.strokeRect(rightX - 0.5, topY - 0.5, 2 * cell + 1, 2 * cell + 1);

    // Draw spins
    for (let i = 0; i < 4; i++) {
      const p = cellPos("L", i as 0 | 1 | 2 | 3);
      context.fillStyle = spins[i]! === 1 ? up : down;
      context.fillRect(p.x, p.y, cell, cell);
    }
    for (let i = 0; i < 4; i++) {
      const p = cellPos("R", i as 0 | 1 | 2 | 3);
      context.fillStyle = spins[4 + i]! === 1 ? up : down;
      context.fillRect(p.x, p.y, cell, cell);
    }

    // Draw boundary bonds (4 lines)
    function drawBond(iL: number, iR: number) {
      const idxL = (iL as number) as 0 | 1 | 2 | 3;
      const idxR = (iR as number) as 0 | 1 | 2 | 3;
      const pL = cellPos("L", idxL);
      const pR = cellPos("R", idxR);
      const x1 = pL.x + cell;
      const y1 = pL.y + cell / 2;
      const x2 = pR.x;
      const y2 = pR.y + cell / 2;
      const aligned = spins[iL]! === spins[iR]!;
      context.strokeStyle = aligned ? "rgba(16,185,129,0.95)" : "rgba(239,68,68,0.95)";
      context.lineWidth = 3.0;
      context.beginPath();
      context.moveTo(x1, y1);
      context.lineTo(x2, y2);
      context.stroke();
    }

    drawBond(0, 4);
    drawBond(1, 5);
    drawBond(2, 6);
    drawBond(3, 7);

    // Grid lines inside blocks
    context.strokeStyle = "rgba(0,0,0,0.08)";
    context.lineWidth = 1;
    for (let k = 1; k < 2; k++) {
      context.beginPath();
      context.moveTo(leftX + k * cell + 0.5, topY);
      context.lineTo(leftX + k * cell + 0.5, topY + 2 * cell);
      context.stroke();
      context.beginPath();
      context.moveTo(leftX, topY + k * cell + 0.5);
      context.lineTo(leftX + 2 * cell, topY + k * cell + 0.5);
      context.stroke();

      context.beginPath();
      context.moveTo(rightX + k * cell + 0.5, topY);
      context.lineTo(rightX + k * cell + 0.5, topY + 2 * cell);
      context.stroke();
      context.beginPath();
      context.moveTo(rightX, topY + k * cell + 0.5);
      context.lineTo(rightX + 2 * cell, topY + k * cell + 0.5);
      context.stroke();
    }

    // Super spins (visual)
    function drawSuperSpin(cx: number, cy: number, S: 1 | -1, label: string) {
      const r = Math.max(10, Math.floor(cell * 0.55));
      context.fillStyle = "rgba(255,255,255,0.82)";
      context.strokeStyle = theme.border;
      context.lineWidth = 1.5;
      context.beginPath();
      context.arc(cx, cy, r, 0, Math.PI * 2);
      context.fill();
      context.stroke();

      context.fillStyle = theme.text;
      context.font = `700 ${Math.max(12, Math.floor(r * 0.55))}px ui-sans-serif, system-ui`;
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillText(S === 1 ? "+1" : "−1", cx, cy - 2);

      context.fillStyle = theme.muted;
      context.font = `600 ${Math.max(10, Math.floor(r * 0.35))}px ui-sans-serif, system-ui`;
      context.fillText(label, cx, cy + r * 0.78);
    }

    drawSuperSpin(leftX + cell, topY + cell, S1, "S1");
    drawSuperSpin(rightX + cell, topY + cell, S2, "S2");

    // Caption
    context.fillStyle = theme.muted;
    context.font = "12px ui-sans-serif, system-ui";
    context.textAlign = "left";
    context.textBaseline = "alphabetic";
    context.fillText(`微观态采样（T=${T.toFixed(2)}，J_block=${jBlock.toFixed(2)}，J_edge=1）`, margin, h - 16);
  }

  // Redraw on state changes
  useEffect(() => {
    draw();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stateId, T, jBlock]);

  const beta = stats.beta;
  const JEff = stats.JEff;
  const coarseCorr = stats.coarseCorr;
  const JFromCorr = Math.abs(coarseCorr) < 0.999 && beta > 0 ? atanh(coarseCorr) / beta : NaN;

  const sub = (
    <>
      两个相邻的 <MathInline tex={"2\\times2"} /> 块各用一个“超级自旋”{" "}
      <MathInline tex={"S_1,S_2\\in\\{\\pm1\\}"} /> 表示（多数表决；平局时随机）。微观层面边界有 4 条键（红线=不满足，绿线=满足）。
      这里把“相邻”定义成两个 <MathInline tex={"2\\times2"} /> 面一一对应接触，因此是 4 条键；若用纯 2D 的“并排”接触，边界只有 2 条键，结论结构不变，只是系数不同。
      <br />
      把块内自由度求和后，我们把粗粒化后的权重匹配到{" "}
      <MathInline tex={"H_{\\mathrm{eff}}(S_1,S_2)=-J' S_1S_2"} />，因此
      <MathInline tex={"\\;J'=\\frac{1}{2\\beta}\\ln\\frac{W_{++}}{W_{+-}}"} />。
      温度升高会增强块内涨落（coherence 变小），从而把有效耦合{" "}
      <MathInline tex={"J'"} /> “稀释”到更接近 0。
    </>
  );

  return (
    <section className="ic-card">
      <header className="ic-header">
        <div className="ic-title">
          <div className="ic-title-main">有效耦合：边界相互作用如何被块内涨落“稀释”</div>
          <div className="ic-title-sub">{sub}</div>
        </div>
        <div className="ic-controls">
          <label className="ic-slider">
            <span className="ic-slider-label">
              温度 <MathInline tex={"T"} /> = <span className="ic-mono">{T.toFixed(2)}</span>{" "}
              （<MathInline tex={"\\beta"} />={beta.toFixed(3)}）
            </span>
            <input type="range" min={0.8} max={6.0} step={0.02} value={T} onChange={(e) => setT(Number(e.target.value))} />
          </label>
          <label className="ic-slider">
            <span className="ic-slider-label">
              块内耦合 <MathInline tex={"J_{\\mathrm{block}}"} /> = <span className="ic-mono">{jBlock.toFixed(2)}</span>
            </span>
            <input
              type="range"
              min={0.0}
              max={2.0}
              step={0.02}
              value={jBlock}
              onChange={(e) => setJBlock(Number(e.target.value))}
            />
          </label>
          <button className="ic-btn ic-btn-ghost" onClick={() => setIsRunning((v) => !v)}>
            {isRunning ? "暂停采样" : "继续采样"}
          </button>
          <button
            className="ic-btn ic-btn-ghost"
            onClick={() => setStateId(sampleFromCdf(stats.cdf, stats.totalWeight))}
            type="button"
          >
            采样一次
          </button>
        </div>
      </header>

      <div ref={wrapRef}>
        <canvas ref={canvasRef} className="ic-canvas" aria-label="effective coupling demo" />
      </div>

      <div className="ic-metrics">
        <div className="ic-metric">
          <div className="ic-metric-label">
            有效耦合 <MathInline tex={"J'"} />
          </div>
          <div className="ic-metric-value">
            <span className="ic-mono">
              {JEff.toFixed(3)}{" "}
              <span style={{ color: "var(--text-muted)", fontWeight: 600 }}>
                （低温极限 → 约 {4 * J_EDGE}）
              </span>
            </span>
          </div>
        </div>
        <div className="ic-metric">
          <div className="ic-metric-label">块内一致性（coherence）</div>
          <div className="ic-metric-value">
            <span className="ic-mono">{stats.coherence.toFixed(3)}</span>
          </div>
        </div>
        <div className="ic-metric">
          <div className="ic-metric-label">边界自旋相关</div>
          <div className="ic-metric-value">
            <span className="ic-mono">{stats.boundaryCorr.toFixed(3)}</span>
          </div>
        </div>
        <div className="ic-metric">
          <div className="ic-metric-label">
            粗粒化相关 <MathInline tex={"\\langle S_1S_2\\rangle"} />
          </div>
          <div className="ic-metric-value">
            <span className="ic-mono">
              {coarseCorr.toFixed(3)}
              {Number.isFinite(JFromCorr) ? `  (≈tanh(βJ') 对应 J'=${JFromCorr.toFixed(3)})` : ""}
            </span>
          </div>
        </div>
      </div>

      <p className="ic-footnote">
        读法：边界的“原始相互作用”固定为 4 条键（<MathInline tex={"J_{\\mathrm{edge}}=1"} />）。当块内更一致（低温或
        <MathInline tex={"J_{\\mathrm{block}}"} /> 更大），每条边界键几乎都等价于“拉着”
        <MathInline tex={"S_1S_2"} />，于是 <MathInline tex={"J'"} /> 接近{" "}
        <MathInline tex={"4J_{\\mathrm{edge}}"} />；当块内涨落很强时，边界自旋与超级自旋不再一致，
        单条边界键被“稀释”，最终 <MathInline tex={"J'\\to 0"} />。
      </p>
    </section>
  );
}
