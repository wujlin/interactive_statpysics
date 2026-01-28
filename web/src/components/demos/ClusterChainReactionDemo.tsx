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

type ClusterStats = { size: number; frac: number };
type RandomFn = () => number;

const TC_2D_ISING = 2.269;

const DEFAULT_T_CONTROL = 5.0;
const DEFAULT_T_PROBE = 2.35;

const L = 48;

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

function bondProb(T: number) {
  // Wolff / Swendsen–Wang bond probability for Ising with J=1, k_B=1:
  // p = 1 - exp(-2 beta J) = 1 - exp(-2/T)
  const t = Math.max(1e-6, T);
  return 1 - Math.exp(-2 / t);
}

function randomSeed32(): number {
  if (typeof crypto !== "undefined" && "getRandomValues" in crypto) {
    const buf = new Uint32Array(1);
    crypto.getRandomValues(buf);
    return buf[0]!;
  }
  return Math.floor(Math.random() * 2 ** 32);
}

function makeRng(seed: number): RandomFn {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function randSpin(rand: RandomFn) {
  return rand() < 0.5 ? (1 as const) : (-1 as const);
}

function randomizeSpins(spins: Int8Array, rand: RandomFn) {
  for (let i = 0; i < spins.length; i++) spins[i] = randSpin(rand);
}

function index(x: number, y: number) {
  return y * L + x;
}

function neighbors(i: number) {
  const x = i % L;
  const y = Math.floor(i / L);
  const xp = x + 1 < L ? x + 1 : 0;
  const xm = x - 1 >= 0 ? x - 1 : L - 1;
  const yp = y + 1 < L ? y + 1 : 0;
  const ym = y - 1 >= 0 ? y - 1 : L - 1;
  return [index(xp, y), index(xm, y), index(x, yp), index(x, ym)] as const;
}

function wolffClusterFlip(spins: Int8Array, pBond: number, seedIndex: number, rand: RandomFn) {
  const target = spins[seedIndex] as 1 | -1;
  const visited = new Uint8Array(spins.length);
  const stack: number[] = [seedIndex];
  const cluster: number[] = [];
  visited[seedIndex] = 1;

  while (stack.length > 0) {
    const i = stack.pop()!;
    cluster.push(i);
    for (const j of neighbors(i)) {
      if (visited[j]) continue;
      if (spins[j] !== target) continue;
      if (rand() > pBond) continue;
      visited[j] = 1;
      stack.push(j);
    }
  }

  for (const i of cluster) spins[i] = (spins[i] === 1 ? -1 : 1) as 1 | -1;
  return cluster;
}

function thermalize(spins: Int8Array, T: number, rand: RandomFn) {
  randomizeSpins(spins, rand);
  const p = bondProb(T);
  // Wolff 更新在临界附近混合得很快；这里不追求严格采样，只要“典型团簇结构”即可。
  const updates = Math.max(24, Math.floor((L * L) / 40));
  for (let k = 0; k < updates; k++) {
    const seedIndex = Math.floor(rand() * spins.length);
    wolffClusterFlip(spins, p, seedIndex, rand);
  }
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

export function ClusterChainReactionDemo() {
  const [tControl, setTControl] = useState(DEFAULT_T_CONTROL);
  const [tProbe, setTProbe] = useState(DEFAULT_T_PROBE);
  const [lockControl, setLockControl] = useState(true);
  const [lastLeft, setLastLeft] = useState<ClusterStats | null>(null);
  const [lastRight, setLastRight] = useState<ClusterStats | null>(null);

  const leftWrapRef = useRef<HTMLDivElement | null>(null);
  const rightWrapRef = useRef<HTMLDivElement | null>(null);
  const leftCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const rightCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const leftSpinsRef = useRef<Int8Array>(new Int8Array(L * L));
  const rightSpinsRef = useRef<Int8Array>(new Int8Array(L * L));

  const highlightLeftRef = useRef<number[] | null>(null);
  const highlightRightRef = useRef<number[] | null>(null);
  const highlightUntilRef = useRef<{ left: number; right: number }>({ left: 0, right: 0 });
  const rafRef = useRef<number | null>(null);

  const themeRef = useRef<ThemeColors | null>(null);
  const leftRngRef = useRef<RandomFn>(makeRng(0x12345678));
  const rightRngRef = useRef<RandomFn>(makeRng(0x87654321));

  function drawPanel(ctx: CanvasRenderingContext2D, spins: Int8Array, highlight: number[] | null, highlightAlpha: number) {
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

    const pad = 10;
    const gridW = w - pad * 2;
    const gridH = h - pad * 2;
    const cell = Math.floor(Math.min(gridW, gridH) / L);
    const gx0 = pad + Math.floor((gridW - cell * L) / 2);
    const gy0 = pad + Math.floor((gridH - cell * L) / 2);

    const up = theme.primary;
    const down = "#f97316";

    for (let y = 0; y < L; y++) {
      for (let x = 0; x < L; x++) {
        const s = spins[index(x, y)]!;
        ctx.fillStyle = s === 1 ? up : down;
        ctx.fillRect(gx0 + x * cell, gy0 + y * cell, cell, cell);
      }
    }

    // subtle grid
    ctx.strokeStyle = "rgba(0,0,0,0.06)";
    ctx.lineWidth = 1;
    for (let i = 0; i <= L; i++) {
      const x = gx0 + i * cell;
      const y = gy0 + i * cell;
      ctx.beginPath();
      ctx.moveTo(x + 0.5, gy0);
      ctx.lineTo(x + 0.5, gy0 + L * cell);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(gx0, y + 0.5);
      ctx.lineTo(gx0 + L * cell, y + 0.5);
      ctx.stroke();
    }

    if (highlight && highlight.length > 0 && highlightAlpha > 0) {
      ctx.save();
      ctx.globalAlpha = clamp(highlightAlpha, 0, 1);
      ctx.fillStyle = theme.accent;
      for (const idx of highlight) {
        const x = idx % L;
        const y = Math.floor(idx / L);
        ctx.fillRect(gx0 + x * cell, gy0 + y * cell, cell, cell);
      }
      ctx.restore();
    }
  }

  function draw() {
    const leftCanvas = leftCanvasRef.current;
    const rightCanvas = rightCanvasRef.current;
    if (!leftCanvas || !rightCanvas) return;
    const leftCtx = leftCanvas.getContext("2d");
    const rightCtx = rightCanvas.getContext("2d");
    if (!leftCtx || !rightCtx) return;

    const now = performance.now();
    const tLeft = highlightUntilRef.current.left;
    const tRight = highlightUntilRef.current.right;
    const aLeft = tLeft > now ? 0.38 : 0;
    const aRight = tRight > now ? 0.38 : 0;

    drawPanel(leftCtx, leftSpinsRef.current, highlightLeftRef.current, aLeft);
    drawPanel(rightCtx, rightSpinsRef.current, highlightRightRef.current, aRight);

    const needsMore = tLeft > now || tRight > now;
    if (needsMore && rafRef.current == null) {
      rafRef.current = window.requestAnimationFrame(() => {
        rafRef.current = null;
        draw();
      });
    }
  }

  function resetLeft() {
    thermalize(leftSpinsRef.current, tControl, leftRngRef.current);
    highlightLeftRef.current = null;
    setLastLeft(null);
  }

  function resetRight() {
    thermalize(rightSpinsRef.current, tProbe, rightRngRef.current);
    highlightRightRef.current = null;
    setLastRight(null);
  }

  function resetAll() {
    resetLeft();
    resetRight();
    highlightUntilRef.current = { left: 0, right: 0 };
    draw();
  }

  // Resize both canvases
  useEffect(() => {
    const leftWrap = leftWrapRef.current;
    const rightWrap = rightWrapRef.current;
    const leftCanvas = leftCanvasRef.current;
    const rightCanvas = rightCanvasRef.current;
    if (!leftWrap || !rightWrap || !leftCanvas || !rightCanvas) return;

    const ro = new ResizeObserver(() => {
      const lw = leftWrap.clientWidth;
      const rw = rightWrap.clientWidth;
      const sizeL = clamp(lw, 240, 520);
      const sizeR = clamp(rw, 240, 520);
      applyCanvasSize(leftCanvas, sizeL, sizeL);
      applyCanvasSize(rightCanvas, sizeR, sizeR);
      draw();
    });
    ro.observe(leftWrap);
    ro.observe(rightWrap);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Initial state
  useEffect(() => {
    leftRngRef.current = makeRng(randomSeed32());
    rightRngRef.current = makeRng(randomSeed32());
    resetAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-thermalize (debounced) when temperatures change.
  // 关键：对照/观察两窗的温度是独立控制的；调右侧温度不应让左侧“换一张图”，否则读者无法把差异归因到温度。
  useEffect(() => {
    if (lockControl) return;
    const id = window.setTimeout(() => {
      resetLeft();
      highlightUntilRef.current.left = 0;
      draw();
    }, 250);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tControl]);

  useEffect(() => {
    const id = window.setTimeout(() => {
      resetRight();
      highlightUntilRef.current.right = 0;
      draw();
    }, 250);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tProbe]);

  function clickOn(canvas: HTMLCanvasElement, panel: "left" | "right", e: React.PointerEvent) {
    const rect = canvas.getBoundingClientRect();
    const u = (e.clientX - rect.left) / rect.width;
    const v = (e.clientY - rect.top) / rect.height;
    if (u < 0 || u > 1 || v < 0 || v > 1) return;

    const padFrac = 10 / Math.min(rect.width, rect.height); // match draw pad≈10px
    const u2 = clamp((u - padFrac) / (1 - 2 * padFrac), 0, 1);
    const v2 = clamp((v - padFrac) / (1 - 2 * padFrac), 0, 1);
    const x = clamp(Math.floor(u2 * L), 0, L - 1);
    const y = clamp(Math.floor(v2 * L), 0, L - 1);
    const seed = index(x, y);

    if (panel === "left") {
      const p = bondProb(tControl);
      const cluster = wolffClusterFlip(leftSpinsRef.current, p, seed, leftRngRef.current);
      highlightLeftRef.current = cluster;
      highlightUntilRef.current.left = performance.now() + 520;
      setLastLeft({ size: cluster.length, frac: cluster.length / (L * L) });
    } else {
      const p = bondProb(tProbe);
      const cluster = wolffClusterFlip(rightSpinsRef.current, p, seed, rightRngRef.current);
      highlightRightRef.current = cluster;
      highlightUntilRef.current.right = performance.now() + 520;
      setLastRight({ size: cluster.length, frac: cluster.length / (L * L) });
    }

    draw();
  }

  const pControl = bondProb(tControl);
  const pProbe = bondProb(tProbe);
  const reducedControl = (tControl - TC_2D_ISING) / TC_2D_ISING;
  const reducedProbe = (tProbe - TC_2D_ISING) / TC_2D_ISING;

  const sub = (
    <>
      左侧是<strong>对照窗</strong>：固定一个远离 <MathInline tex={"T_c"} /> 的高温{" "}
      <MathInline tex={"T_{\\mathrm{control}}"} />（短相关）。右侧是<strong>观察窗</strong>：你拖动{" "}
      <MathInline tex={"T_{\\mathrm{probe}}"} /> 让它接近 <MathInline tex={"T_c"} />（长相关）。
      <br />
      点击任意格点触发一次 Wolff 团簇翻转：相同自旋的近邻以概率 <MathInline tex={"p(T)=1-e^{-2/T}"} /> 被吸收进团簇。
      <strong>拖动右侧温度时，只会重新取样右图</strong>（左侧对照保持不变）；如果你想改变左图，请点“解锁对照温度”。
    </>
  );

  return (
    <section className="ic-card">
      <header className="ic-header">
        <div className="ic-title">
          <div className="ic-title-main">团簇链式反应：把“相关长度变大”变成可见现象</div>
          <div className="ic-title-sub">{sub}</div>
        </div>
        <div className="ic-controls">
          <div className="ic-slider">
            <span className="ic-slider-label">
              对照窗 <MathInline tex={"T_{\\mathrm{control}}"} /> = <span className="ic-mono">{tControl.toFixed(2)}</span>
              {"  "}（远离 <MathInline tex={"T_c"} />；|t|≈<span className="ic-mono">{Math.abs(reducedControl).toFixed(2)}</span>）
            </span>
            <button
              className="ic-btn ic-btn-ghost"
              type="button"
              onClick={() => {
                const next = !lockControl;
                setLockControl(next);
                if (next) {
                  // 恢复“锁定对照”时，把左窗重置到默认高温，避免读者误以为随 T_probe 变化。
                  setTControl(DEFAULT_T_CONTROL);
                  thermalize(leftSpinsRef.current, DEFAULT_T_CONTROL, leftRngRef.current);
                  highlightLeftRef.current = null;
                  setLastLeft(null);
                  highlightUntilRef.current.left = 0;
                  draw();
                }
              }}
            >
              {lockControl ? "解锁对照温度" : "锁定对照温度"}
            </button>
          </div>
          {!lockControl && (
            <label className="ic-slider">
              <span className="ic-slider-label muted">调整对照温度（高级）：只影响左图</span>
              <input
                type="range"
                min={3.0}
                max={8.0}
                step={0.05}
                value={tControl}
                onChange={(e) => setTControl(Number(e.target.value))}
              />
            </label>
          )}
          <label className="ic-slider">
            <span className="ic-slider-label">
              观察组 <MathInline tex={"T_{\\mathrm{probe}}"} /> = <span className="ic-mono">{tProbe.toFixed(2)}</span>
              {"  "}（Tc≈{TC_2D_ISING.toFixed(3)}；T−Tc≈<span className="ic-mono">{(tProbe - TC_2D_ISING).toFixed(2)}</span>；|t|≈
              <span className="ic-mono">{Math.abs(reducedProbe).toFixed(2)}</span>）
            </span>
            <input
              type="range"
              min={1.8}
              max={3.0}
              step={0.01}
              value={tProbe}
              onChange={(e) => setTProbe(Number(e.target.value))}
            />
          </label>
          <button className="ic-btn ic-btn-ghost" onClick={() => resetAll()}>
            重新取样
          </button>
        </div>
      </header>

      <div className="ic-canvas-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
        <div ref={leftWrapRef}>
          <div className="muted" style={{ fontSize: 12, marginBottom: 8 }}>
            左：对照窗（短相关） ·{" "}
            <MathInline tex={"T_{\\mathrm{control}}"} />=<span className="ic-mono">{tControl.toFixed(2)}</span> · |t|≈
            <span className="ic-mono">{Math.abs(reducedControl).toFixed(2)}</span> ·{" "}
            <MathInline tex={"p(T_{\\mathrm{control}})"} />≈<span className="ic-mono">{pControl.toFixed(2)}</span>
          </div>
          <canvas
            ref={leftCanvasRef}
            className="ic-canvas"
            aria-label="high temperature cluster cascade"
            onPointerDown={(e) => {
              const canvas = leftCanvasRef.current;
              if (!canvas) return;
              clickOn(canvas, "left", e);
            }}
          />
        </div>
        <div ref={rightWrapRef}>
          <div className="muted" style={{ fontSize: 12, marginBottom: 8 }}>
            右：观察窗（接近 Tc） · <MathInline tex={"T_{\\mathrm{probe}}"} />=<span className="ic-mono">{tProbe.toFixed(2)}</span> · |t|≈
            <span className="ic-mono">{Math.abs(reducedProbe).toFixed(2)}</span> · <MathInline tex={"p(T_{\\mathrm{probe}})"} />≈
            <span className="ic-mono">{pProbe.toFixed(2)}</span>
          </div>
          <canvas
            ref={rightCanvasRef}
            className="ic-canvas"
            aria-label="near critical cluster cascade"
            onPointerDown={(e) => {
              const canvas = rightCanvasRef.current;
              if (!canvas) return;
              clickOn(canvas, "right", e);
            }}
          />
        </div>
      </div>

      <div className="ic-metrics">
        <div className="ic-metric">
          <div className="ic-metric-label">上次团簇（左）</div>
          <div className="ic-metric-value">
            <span className="ic-mono">
              {lastLeft ? `${lastLeft.size} (${(100 * lastLeft.frac).toFixed(1)}%)` : "—"}
            </span>
          </div>
        </div>
        <div className="ic-metric">
          <div className="ic-metric-label">上次团簇（右）</div>
          <div className="ic-metric-value">
            <span className="ic-mono">
              {lastRight ? `${lastRight.size} (${(100 * lastRight.frac).toFixed(1)}%)` : "—"}
            </span>
          </div>
        </div>
      </div>

      <p className="ic-footnote">
        读法：把一次点击当作“局部扰动”。高温时，扰动几乎只影响局部；接近{" "}
        <MathInline tex={"T_c"} /> 时，团簇尺寸分布变宽，偶尔会出现跨尺度的“链式反应”——这就是“相关长度变大”的直观影子。
      </p>
    </section>
  );
}
