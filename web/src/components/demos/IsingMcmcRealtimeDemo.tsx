"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type SimState = {
  L: number;
  spins: Int8Array;
  energy: number;
  magnetization: number;
  attempted: number;
  accepted: number;
  sweeps: number;
};

type MetricsState = {
  m: number;
  mAbs: number;
  energyPerSpin: number;
  acceptance: number;
  sweeps: number;
};

type TracePoint = {
  sweep: number;
  mAbs: number;
};

type ScanPoint = {
  T: number;
  mAbs: number;
  chi: number;
};

const TRUE_TC = 2.269;
const MEAN_FIELD_TC = 4.0;

const DEFAULT_TEMPERATURE = 2.4;
const DEFAULT_LATTICE_SIZE = 40;
const DEFAULT_SWEEPS_PER_SEC = 26;

const MIN_T = 1.2;
const MAX_T = 5.0;

const TRACE_MAX_POINTS = 220;

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function randomSpin() {
  return Math.random() < 0.5 ? (1 as const) : (-1 as const);
}

function makeSimulation(L: number): SimState {
  const n = L * L;
  const spins = new Int8Array(n);
  let magnetization = 0;
  for (let i = 0; i < n; i++) {
    const s = randomSpin();
    spins[i] = s;
    magnetization += s;
  }

  let energy = 0;
  for (let y = 0; y < L; y++) {
    for (let x = 0; x < L; x++) {
      const i = y * L + x;
      const s = spins[i]!;
      const right = spins[y * L + ((x + 1) % L)]!;
      const down = spins[((y + 1) % L) * L + x]!;
      energy += -s * right - s * down;
    }
  }

  return {
    L,
    spins,
    energy,
    magnetization,
    attempted: 0,
    accepted: 0,
    sweeps: 0,
  };
}

function metropolisAttempt(sim: SimState, temperature: number) {
  const L = sim.L;
  const n = L * L;
  const idx = Math.floor(Math.random() * n);
  const x = idx % L;
  const y = (idx / L) | 0;

  const spins = sim.spins;
  const s = spins[idx]!;
  const up = spins[((y - 1 + L) % L) * L + x]!;
  const down = spins[((y + 1) % L) * L + x]!;
  const left = spins[y * L + ((x - 1 + L) % L)]!;
  const right = spins[y * L + ((x + 1) % L)]!;
  const nn = up + down + left + right;

  const dE = 2 * s * nn;
  sim.attempted += 1;

  if (dE <= 0 || Math.random() < Math.exp(-dE / temperature)) {
    spins[idx] = -s as 1 | -1;
    sim.accepted += 1;
    sim.energy += dE;
    sim.magnetization += -2 * s;
  }
}

function metropolisUpdates(sim: SimState, temperature: number, updates: number, trackSweeps = true) {
  if (updates <= 0) return;
  for (let i = 0; i < updates; i++) metropolisAttempt(sim, temperature);
  if (trackSweeps) {
    const n = sim.L * sim.L;
    sim.sweeps += updates / n;
  }
}

function variance(xs: number[]) {
  if (xs.length < 2) return 0;
  let mean = 0;
  for (const x of xs) mean += x;
  mean /= xs.length;
  let v = 0;
  for (const x of xs) {
    const d = x - mean;
    v += d * d;
  }
  return v / (xs.length - 1);
}

function buildPath(points: TracePoint[], mapX: (p: TracePoint, i: number) => number, mapY: (p: TracePoint) => number) {
  if (points.length === 0) return "";
  let out = "";
  for (let i = 0; i < points.length; i++) {
    const p = points[i]!;
    const x = mapX(p, i).toFixed(2);
    const y = mapY(p).toFixed(2);
    out += i === 0 ? `M${x},${y}` : ` L${x},${y}`;
  }
  return out;
}

function nextFrame() {
  return new Promise<void>((resolve) => {
    window.requestAnimationFrame(() => resolve());
  });
}

export function IsingMcmcRealtimeDemo() {
  const [temperature, setTemperature] = useState(DEFAULT_TEMPERATURE);
  const [latticeSize, setLatticeSize] = useState(DEFAULT_LATTICE_SIZE);
  const [sweepsPerSecond, setSweepsPerSecond] = useState(DEFAULT_SWEEPS_PER_SEC);
  const [isRunning, setIsRunning] = useState(true);

  const [metrics, setMetrics] = useState<MetricsState>({
    m: 0,
    mAbs: 0,
    energyPerSpin: 0,
    acceptance: 0,
    sweeps: 0,
  });
  const [trace, setTrace] = useState<TracePoint[]>([]);

  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanData, setScanData] = useState<ScanPoint[]>([]);

  const wrapRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const simRef = useRef<SimState | null>(null);
  const rafRef = useRef<number | null>(null);
  const pendingUpdatesRef = useRef(0);
  const lastFrameRef = useRef<number | null>(null);
  const lastMetricsRef = useRef<number>(0);
  const scanTokenRef = useRef(0);

  const temperatureRef = useRef(temperature);
  const rateRef = useRef(sweepsPerSecond);
  const runningRef = useRef(isRunning);
  const sizeRef = useRef<{ side: number; dpr: number }>({ side: 0, dpr: 0 });

  function writeMetricsFromSim(sim: SimState) {
    const n = sim.L * sim.L;
    const m = sim.magnetization / n;
    const e = sim.energy / n;
    const acceptance = sim.attempted > 0 ? sim.accepted / sim.attempted : 0;
    setMetrics({
      m,
      mAbs: Math.abs(m),
      energyPerSpin: e,
      acceptance,
      sweeps: sim.sweeps,
    });
  }

  function pushTracePoint(sim: SimState) {
    const n = sim.L * sim.L;
    const point: TracePoint = { sweep: sim.sweeps, mAbs: Math.abs(sim.magnetization / n) };
    setTrace((prev) => {
      const next = [...prev, point];
      if (next.length > TRACE_MAX_POINTS) next.shift();
      return next;
    });
  }

  function resetSimulation(nextL: number) {
    const sim = makeSimulation(nextL);
    simRef.current = sim;
    pendingUpdatesRef.current = 0;
    lastFrameRef.current = null;
    lastMetricsRef.current = 0;
    setTrace([]);
    writeMetricsFromSim(sim);
  }

  function ensureCanvasSize() {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return null;

    const cssSide = clamp(Math.floor(wrap.clientWidth), 240, 520);
    const dpr = window.devicePixelRatio || 1;
    if (sizeRef.current.side !== cssSide || sizeRef.current.dpr !== dpr) {
      sizeRef.current = { side: cssSide, dpr };
      canvas.width = Math.max(1, Math.floor(cssSide * dpr));
      canvas.height = Math.max(1, Math.floor(cssSide * dpr));
      canvas.style.width = `${cssSide}px`;
      canvas.style.height = `${cssSide}px`;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { ctx, side: cssSide };
  }

  function drawLattice() {
    const out = ensureCanvasSize();
    const sim = simRef.current;
    if (!out || !sim) return;

    const { ctx, side } = out;
    const L = sim.L;
    const spins = sim.spins;

    ctx.clearRect(0, 0, side, side);
    ctx.fillStyle = "var(--surface-solid)";
    ctx.fillRect(0, 0, side, side);
    ctx.strokeStyle = "var(--border)";
    ctx.lineWidth = 1;
    ctx.strokeRect(0.5, 0.5, side - 1, side - 1);

    const pad = 8;
    const cell = Math.max(1, Math.floor((side - pad * 2) / L));
    const gridW = cell * L;
    const x0 = Math.floor((side - gridW) / 2);
    const y0 = x0;

    const upColor = "#2563eb";
    const downColor = "#f97316";

    for (let y = 0; y < L; y++) {
      for (let x = 0; x < L; x++) {
        const s = spins[y * L + x]!;
        ctx.fillStyle = s === 1 ? upColor : downColor;
        ctx.fillRect(x0 + x * cell, y0 + y * cell, cell, cell);
      }
    }
  }

  useEffect(() => {
    temperatureRef.current = temperature;
  }, [temperature]);

  useEffect(() => {
    rateRef.current = sweepsPerSecond;
  }, [sweepsPerSecond]);

  useEffect(() => {
    runningRef.current = isRunning;
  }, [isRunning]);

  useEffect(() => {
    resetSimulation(latticeSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [latticeSize]);

  useEffect(() => {
    resetSimulation(DEFAULT_LATTICE_SIZE);

    const tick = (now: number) => {
      const sim = simRef.current;
      if (sim) {
        const last = lastFrameRef.current;
        lastFrameRef.current = now;
        if (last != null && runningRef.current) {
          const dt = Math.max(0, (now - last) / 1000);
          const n = sim.L * sim.L;
          pendingUpdatesRef.current += dt * rateRef.current * n;
          let updates = Math.floor(pendingUpdatesRef.current);
          pendingUpdatesRef.current -= updates;

          const maxUpdates = n * 90;
          if (updates > maxUpdates) {
            pendingUpdatesRef.current += updates - maxUpdates;
            updates = maxUpdates;
          }
          metropolisUpdates(sim, temperatureRef.current, updates, true);
        }

        if (now - lastMetricsRef.current > 120) {
          lastMetricsRef.current = now;
          writeMetricsFromSim(sim);
          pushTracePoint(sim);
        }
      }

      drawLattice();
      rafRef.current = window.requestAnimationFrame(tick);
    };

    rafRef.current = window.requestAnimationFrame(tick);
    return () => {
      if (rafRef.current != null) window.cancelAnimationFrame(rafRef.current);
      scanTokenRef.current += 1;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scanTemperatures = useMemo(() => {
    const values: number[] = [];
    for (let i = 0; i < 16; i++) values.push(1.6 + i * 0.2);
    return values;
  }, []);

  const scanSummary = useMemo(() => {
    if (scanData.length === 0) return null;
    let best = scanData[0]!;
    for (const p of scanData) if (p.chi > best.chi) best = p;
    const chiMax = best.chi;
    return { estimatedTc: best.T, chiMax };
  }, [scanData]);

  const tracePath = useMemo(() => {
    const W = 640;
    const H = 180;
    const padL = 34;
    const padR = 12;
    const padT = 14;
    const padB = 24;
    const w = W - padL - padR;
    const h = H - padT - padB;
    const n = Math.max(1, trace.length - 1);
    return buildPath(
      trace,
      (_p, i) => padL + (i / n) * w,
      (p) => padT + (1 - clamp(p.mAbs, 0, 1)) * h,
    );
  }, [trace]);

  const scanChart = useMemo(() => {
    if (scanData.length === 0) return { mPath: "", chiPath: "", chiMax: 1 };
    const W = 720;
    const H = 280;
    const padL = 44;
    const padR = 16;
    const padT = 18;
    const padB = 34;
    const w = W - padL - padR;
    const h = H - padT - padB;

    const tMin = scanTemperatures[0]!;
    const tMax = scanTemperatures[scanTemperatures.length - 1]!;
    let chiMax = 1e-9;
    for (const p of scanData) chiMax = Math.max(chiMax, p.chi);

    const mPath = buildPath(
      scanData.map((p) => ({ sweep: p.T, mAbs: p.mAbs })),
      (p) => padL + ((p.sweep - tMin) / (tMax - tMin)) * w,
      (p) => padT + (1 - clamp(p.mAbs, 0, 1)) * h,
    );

    const chiPath = buildPath(
      scanData.map((p) => ({ sweep: p.T, mAbs: p.chi / chiMax })),
      (p) => padL + ((p.sweep - tMin) / (tMax - tMin)) * w,
      (p) => padT + (1 - clamp(p.mAbs, 0, 1)) * h,
    );

    return { mPath, chiPath, chiMax };
  }, [scanData, scanTemperatures]);

  async function runTemperatureScan() {
    if (isScanning) return;
    const token = ++scanTokenRef.current;
    setIsScanning(true);
    setScanProgress(0);
    setScanData([]);

    const scanL = 28;
    const n = scanL * scanL;
    const burnSweeps = 160;
    const sampleSweeps = 240;
    const thin = 2;

    const points: ScanPoint[] = [];

    for (let i = 0; i < scanTemperatures.length; i++) {
      const T = scanTemperatures[i]!;
      const sim = makeSimulation(scanL);
      const samples: number[] = [];
      const totalSweeps = burnSweeps + sampleSweeps;

      for (let sweep = 0; sweep < totalSweeps; sweep++) {
        metropolisUpdates(sim, T, n, false);
        if (sweep >= burnSweeps && (sweep - burnSweeps) % thin === 0) {
          samples.push(sim.magnetization / n);
        }
        if (sweep % 12 === 0) {
          await nextFrame();
          if (token !== scanTokenRef.current) return;
        }
      }

      let mAbs = 0;
      for (const m of samples) mAbs += Math.abs(m);
      mAbs /= Math.max(1, samples.length);

      const chi = (n / T) * variance(samples);
      points.push({ T, mAbs, chi });
      setScanData([...points]);
      setScanProgress((i + 1) / scanTemperatures.length);

      await nextFrame();
      if (token !== scanTokenRef.current) return;
    }

    if (token !== scanTokenRef.current) return;
    setIsScanning(false);
    setScanProgress(1);
  }

  return (
    <section className="ic-card">
      <header className="ic-header">
        <div>
          <div className="ic-title-main">E06：2D Ising（Metropolis）实时动画</div>
          <div className="ic-title-sub">
            在线模拟单自旋翻转，实时观察晶格构型与序参量。再做一次温度扫描，对比真实临界温度
            <span className="ic-mono"> Tc≈2.27 </span>与平均场预测 <span className="ic-mono">Tc=4</span>。
          </div>
        </div>
        <div className="ic-controls">
          <label className="ic-slider">
            <span className="ic-slider-label">
              温度 T=<span className="ic-mono">{temperature.toFixed(2)}</span>
            </span>
            <input
              type="range"
              min={MIN_T}
              max={MAX_T}
              step={0.01}
              value={temperature}
              onChange={(e) => setTemperature(Number(e.target.value))}
            />
          </label>
          <label className="ic-slider">
            <span className="ic-slider-label">
              速率=<span className="ic-mono">{sweepsPerSecond.toFixed(0)}</span> sweeps/s
            </span>
            <input
              type="range"
              min={4}
              max={70}
              step={1}
              value={sweepsPerSecond}
              onChange={(e) => setSweepsPerSecond(Number(e.target.value))}
            />
          </label>
          <label className="ic-slider">
            <span className="ic-slider-label">
              尺寸 L=<span className="ic-mono">{latticeSize}</span>
            </span>
            <input
              type="range"
              min={20}
              max={64}
              step={4}
              value={latticeSize}
              onChange={(e) => setLatticeSize(Number(e.target.value))}
            />
          </label>
          <button className={`ic-btn ${isRunning ? "ic-btn-primary" : ""}`} onClick={() => setIsRunning((v) => !v)}>
            {isRunning ? "暂停" : "继续"}
          </button>
          <button className="ic-btn ic-btn-ghost" onClick={() => resetSimulation(latticeSize)}>
            随机重置
          </button>
        </div>
      </header>

      <div className="ic-toast">
        用法建议：先把 T 调到 <span className="ic-mono">1.8</span>、<span className="ic-mono">2.27</span>、
        <span className="ic-mono">4.0</span>、<span className="ic-mono">4.6</span> 对比构型，再运行下方温度扫描看
        <span className="ic-mono"> χ(T)</span> 的峰值位置。
      </div>

      <div style={{ display: "grid", gap: 12, marginTop: 12, gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
        <div>
          <div ref={wrapRef}>
            <canvas ref={canvasRef} className="ic-canvas" aria-label="Ising lattice animation" />
          </div>
          <div className="ic-footnote">蓝色=+1，橙色=-1。低温时出现大团簇，高温时快速碎裂。</div>
          <div className="ic-controls" style={{ marginTop: 8 }}>
            <button className="ic-btn ic-btn-ghost" onClick={() => setTemperature(1.8)}>
              低温 1.8
            </button>
            <button className="ic-btn ic-btn-ghost" onClick={() => setTemperature(TRUE_TC)}>
              临界 2.27
            </button>
            <button className="ic-btn ic-btn-ghost" onClick={() => setTemperature(MEAN_FIELD_TC)}>
              平均场 4.0
            </button>
            <button className="ic-btn ic-btn-ghost" onClick={() => setTemperature(4.6)}>
              高温 4.6
            </button>
          </div>
        </div>

        <div className="stack" style={{ gap: 10 }}>
          <div className="ic-metrics">
            <div className="ic-metric">
              <div className="ic-metric-label">磁化 m</div>
              <div className="ic-metric-value ic-mono">{metrics.m.toFixed(3)}</div>
            </div>
            <div className="ic-metric">
              <div className="ic-metric-label">|m|</div>
              <div className="ic-metric-value ic-mono">{metrics.mAbs.toFixed(3)}</div>
            </div>
            <div className="ic-metric">
              <div className="ic-metric-label">能量 e/N</div>
              <div className="ic-metric-value ic-mono">{metrics.energyPerSpin.toFixed(3)}</div>
            </div>
            <div className="ic-metric">
              <div className="ic-metric-label">接受率</div>
              <div className="ic-metric-value ic-mono">{(metrics.acceptance * 100).toFixed(1)}%</div>
            </div>
            <div className="ic-metric">
              <div className="ic-metric-label">累计 sweeps</div>
              <div className="ic-metric-value ic-mono">{metrics.sweeps.toFixed(1)}</div>
            </div>
          </div>

          <div style={{ border: "1px solid var(--border)", borderRadius: 12, padding: 8, background: "var(--surface-solid)" }}>
            <svg viewBox="0 0 640 180" width="100%" height="180" role="img" aria-label="running |m| trace">
              <rect x="0.5" y="0.5" width="639" height="179" fill="none" stroke="var(--border)" />
              <line x1="34" y1="14" x2="34" y2="156" stroke="var(--border)" />
              <line x1="34" y1="156" x2="628" y2="156" stroke="var(--border)" />
              <text x="40" y="14" fill="var(--text-muted)" fontSize="12">
                实时 |m| 轨迹
              </text>
              <path d={tracePath} fill="none" stroke="#2563eb" strokeWidth="2.2" />
              <text x="608" y="172" fill="var(--text-muted)" fontSize="12">
                time
              </text>
              <text x="10" y="22" fill="var(--text-muted)" fontSize="12">
                1
              </text>
              <text x="10" y="158" fill="var(--text-muted)" fontSize="12">
                0
              </text>
            </svg>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 12, border: "1px solid var(--border)", borderRadius: 12, padding: 10, background: "var(--surface-solid)" }}>
        <div className="ic-header" style={{ marginBottom: 8 }}>
          <div className="ic-title-sub" style={{ marginTop: 0 }}>
            温度扫描实验：计算不同 T 下的 <span className="ic-mono">|m|</span> 与
            <span className="ic-mono"> χ=(N/T)Var(m)</span>（χ 已归一化显示）。
          </div>
          <div className="ic-controls">
            <button className={`ic-btn ${isScanning ? "ic-btn-primary" : ""}`} onClick={runTemperatureScan} disabled={isScanning}>
              {isScanning ? `扫描中 ${(scanProgress * 100).toFixed(0)}%` : "运行温度扫描"}
            </button>
          </div>
        </div>

        <svg viewBox="0 0 720 280" width="100%" height="280" role="img" aria-label="scan result chart">
          <rect x="0.5" y="0.5" width="719" height="279" fill="none" stroke="var(--border)" />
          <line x1="44" y1="18" x2="44" y2="246" stroke="var(--border)" />
          <line x1="44" y1="246" x2="704" y2="246" stroke="var(--border)" />
          <line x1={44 + ((TRUE_TC - 1.6) / (4.6 - 1.6)) * 660} y1="18" x2={44 + ((TRUE_TC - 1.6) / (4.6 - 1.6)) * 660} y2="246" stroke="#10b981" strokeDasharray="5 4" />
          <line x1={44 + ((MEAN_FIELD_TC - 1.6) / (4.6 - 1.6)) * 660} y1="18" x2={44 + ((MEAN_FIELD_TC - 1.6) / (4.6 - 1.6)) * 660} y2="246" stroke="#ef4444" strokeDasharray="3 4" />
          <text x="54" y="18" fill="var(--text-muted)" fontSize="12">
            蓝：|m|，橙：χ/χmax，绿虚线：Tc≈2.27，红虚线：Tc=4
          </text>
          <path d={scanChart.mPath} fill="none" stroke="#2563eb" strokeWidth="2.4" />
          <path d={scanChart.chiPath} fill="none" stroke="#f97316" strokeWidth="2.4" />
          <text x="694" y="268" fill="var(--text-muted)" fontSize="12">
            T
          </text>
          <text x="8" y="26" fill="var(--text-muted)" fontSize="12">
            1
          </text>
          <text x="8" y="248" fill="var(--text-muted)" fontSize="12">
            0
          </text>
        </svg>

        <div className="ic-metrics">
          <div className="ic-metric">
            <div className="ic-metric-label">扫描估计 Tc（χ 峰）</div>
            <div className="ic-metric-value ic-mono">{scanSummary ? scanSummary.estimatedTc.toFixed(2) : "—"}</div>
          </div>
          <div className="ic-metric">
            <div className="ic-metric-label">真实 Tc（2D Ising）</div>
            <div className="ic-metric-value ic-mono">{TRUE_TC.toFixed(3)}</div>
          </div>
          <div className="ic-metric">
            <div className="ic-metric-label">平均场 Tc</div>
            <div className="ic-metric-value ic-mono">{MEAN_FIELD_TC.toFixed(1)}</div>
          </div>
        </div>

        <p className="ic-footnote">
          为什么平均场高估有序能力：平均场把邻域替换成“平滑平均值”，忽略了临界附近最关键的局部团簇涨落。真实二维系统里，这些涨落会持续破坏长程序，因此需要更低温度才稳定有序，表现为
          <span className="ic-mono"> Tc(real) &lt; Tc(MF)</span>。
        </p>
      </div>
    </section>
  );
}
