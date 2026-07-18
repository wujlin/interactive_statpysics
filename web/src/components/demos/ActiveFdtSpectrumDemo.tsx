"use client";

import { useMemo, useState } from "react";

type SpectrumPoint = {
  omega: number;
  equilibrium: number;
  total: number;
  dissipation: number;
};

const WIDTH = 720;
const HEIGHT = 250;
const PAD = { left: 58, right: 18, top: 18, bottom: 38 };

function logspace(minExponent: number, maxExponent: number, n: number) {
  return Array.from({ length: n }, (_, i) => {
    const exponent = minExponent + ((maxExponent - minExponent) * i) / (n - 1);
    return 10 ** exponent;
  });
}

function formatNumber(value: number) {
  if (value === 0) return "0";
  if (Math.abs(value) < 1e-3 || Math.abs(value) >= 1e3) return value.toExponential(2);
  return value.toFixed(4);
}

function buildLine(
  points: SpectrumPoint[],
  value: (point: SpectrumPoint) => number,
  yMin: number,
  yMax: number,
  logarithmicY: boolean,
) {
  const xMin = -2;
  const xMax = 2;
  const plotWidth = WIDTH - PAD.left - PAD.right;
  const plotHeight = HEIGHT - PAD.top - PAD.bottom;
  const safeMin = logarithmicY ? Math.log10(Math.max(yMin, 1e-16)) : yMin;
  const safeMax = logarithmicY ? Math.log10(Math.max(yMax, 1e-15)) : yMax;
  const span = Math.max(1e-12, safeMax - safeMin);

  return points
    .map((point) => {
      const x = PAD.left + ((Math.log10(point.omega) - xMin) / (xMax - xMin)) * plotWidth;
      const rawY = value(point);
      const transformedY = logarithmicY ? Math.log10(Math.max(rawY, 1e-16)) : rawY;
      const y = PAD.top + (1 - (transformedY - safeMin) / span) * plotHeight;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");
}

function SpectrumAxes({ yLabel }: { yLabel: string }) {
  const xTicks = [0.01, 0.1, 1, 10, 100];
  return (
    <>
      <line
        x1={PAD.left}
        y1={HEIGHT - PAD.bottom}
        x2={WIDTH - PAD.right}
        y2={HEIGHT - PAD.bottom}
        stroke="var(--border)"
      />
      <line
        x1={PAD.left}
        y1={PAD.top}
        x2={PAD.left}
        y2={HEIGHT - PAD.bottom}
        stroke="var(--border)"
      />
      {xTicks.map((tick) => {
        const x = PAD.left + ((Math.log10(tick) + 2) / 4) * (WIDTH - PAD.left - PAD.right);
        return (
          <g key={tick}>
            <line
              x1={x}
              y1={PAD.top}
              x2={x}
              y2={HEIGHT - PAD.bottom}
              stroke="var(--border)"
              strokeDasharray="3 5"
              opacity={0.55}
            />
            <text x={x} y={HEIGHT - 14} textAnchor="middle" fill="var(--text-muted)" fontSize="11">
              {tick}
            </text>
          </g>
        );
      })}
      <text x={(PAD.left + WIDTH - PAD.right) / 2} y={HEIGHT - 1} textAnchor="middle" fill="var(--text-muted)" fontSize="12">
        角频率 ω
      </text>
      <text
        x={15}
        y={HEIGHT / 2}
        textAnchor="middle"
        fill="var(--text-muted)"
        fontSize="12"
        transform={`rotate(-90 15 ${HEIGHT / 2})`}
      >
        {yLabel}
      </text>
    </>
  );
}

export function ActiveFdtSpectrumDemo() {
  const [activeStrength, setActiveStrength] = useState(2);
  const [activeTau, setActiveTau] = useState(0.8);
  const [trapStiffness, setTrapStiffness] = useState(1);
  const [friction, setFriction] = useState(1);

  const points = useMemo<SpectrumPoint[]>(() => {
    const kbt = 1;
    return logspace(-2, 2, 360).map((omega) => {
      const mechanicalDenominator = trapStiffness ** 2 + (friction * omega) ** 2;
      const equilibrium = (2 * friction * kbt) / mechanicalDenominator;
      const excess =
        activeStrength /
        ((1 + (omega * activeTau) ** 2) * mechanicalDenominator);
      const dissipation = friction * omega ** 2 * excess;
      return { omega, equilibrium, total: equilibrium + excess, dissipation };
    });
  }, [activeStrength, activeTau, friction, trapStiffness]);

  const spectrumRange = useMemo(() => {
    const values = points.flatMap((point) => [point.equilibrium, point.total]);
    return { min: Math.min(...values) * 0.72, max: Math.max(...values) * 1.35 };
  }, [points]);

  const dissipationMax = useMemo(
    () => Math.max(1e-12, ...points.map((point) => point.dissipation)) * 1.12,
    [points],
  );

  const equilibriumLine = buildLine(
    points,
    (point) => point.equilibrium,
    spectrumRange.min,
    spectrumRange.max,
    true,
  );
  const totalLine = buildLine(points, (point) => point.total, spectrumRange.min, spectrumRange.max, true);
  const dissipationLine = buildLine(points, (point) => point.dissipation, 0, dissipationMax, false);

  const heatRate = activeStrength / (2 * activeTau * (friction + trapStiffness * activeTau));
  const peakFrequency = Math.sqrt(trapStiffness / (friction * activeTau));
  const zeroFrequencyExcess = activeStrength / trapStiffness ** 2;

  return (
    <section className="ic-card">
      <header className="ic-header">
        <div>
          <div className="ic-title-main">FDT 等号断裂后，多出来的涨落去了哪里？</div>
          <div className="ic-title-sub">
            蓝线是温度与响应给出的平衡预测，橙线是热噪声与活性噪声共同产生的位置谱。下图把谱差乘上正确的
            <span className="ic-mono"> γω² </span>权重，面积才对应探针向热浴的耗散功率。
          </div>
        </div>
      </header>

      <div className="ic-controls" style={{ marginTop: 12 }} aria-label="活性涨落参数">
        <label className="ic-slider">
          <span className="ic-slider-label">
            A = <span className="ic-mono">{activeStrength.toFixed(2)}</span>
          </span>
          <input
            type="range"
            min={0}
            max={8}
            step={0.05}
            value={activeStrength}
            onChange={(event) => setActiveStrength(Number(event.target.value))}
          />
        </label>
        <label className="ic-slider">
          <span className="ic-slider-label">
            τA = <span className="ic-mono">{activeTau.toFixed(2)}</span>
          </span>
          <input
            type="range"
            min={0.1}
            max={3}
            step={0.05}
            value={activeTau}
            onChange={(event) => setActiveTau(Number(event.target.value))}
          />
        </label>
        <label className="ic-slider">
          <span className="ic-slider-label">
            k = <span className="ic-mono">{trapStiffness.toFixed(2)}</span>
          </span>
          <input
            type="range"
            min={0.2}
            max={3}
            step={0.05}
            value={trapStiffness}
            onChange={(event) => setTrapStiffness(Number(event.target.value))}
          />
        </label>
        <label className="ic-slider">
          <span className="ic-slider-label">
            γ = <span className="ic-mono">{friction.toFixed(2)}</span>
          </span>
          <input
            type="range"
            min={0.3}
            max={3}
            step={0.05}
            value={friction}
            onChange={(event) => setFriction(Number(event.target.value))}
          />
        </label>
        <button
          className="ic-btn ic-btn-ghost"
          type="button"
          onClick={() => {
            setActiveStrength(0);
            setActiveTau(0.8);
            setTrapStiffness(1);
            setFriction(1);
          }}
        >
          回到平衡 A=0
        </button>
      </div>

      <div style={{ display: "grid", gap: 12, marginTop: 12 }}>
        <div>
          <div className="ic-title-sub" style={{ marginBottom: 6 }}>
            位置涨落谱（对数纵轴）：
            <span style={{ color: "var(--primary)", fontWeight: 700 }}> 平衡 FDT 预测</span>
            <span style={{ color: "var(--accent)", fontWeight: 700 }}>　实测总谱</span>
          </div>
          <svg className="ic-canvas" viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-label="位置涨落谱与平衡响应预测">
            <SpectrumAxes yLabel="Cxx(ω)" />
            <polyline points={equilibriumLine} fill="none" stroke="var(--primary)" strokeWidth="3" />
            <polyline points={totalLine} fill="none" stroke="var(--accent)" strokeWidth="3" />
          </svg>
        </div>

        <div>
          <div className="ic-title-sub" style={{ marginBottom: 6 }}>
            频率分辨的探针耗散密度：
            <span className="ic-mono"> q(ω)=γω²ΔCxx(ω)</span>
          </div>
          <svg className="ic-canvas" viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-label="Harada-Sasa 耗散密度">
            <SpectrumAxes yLabel="q(ω)" />
            <polyline points={dissipationLine} fill="none" stroke="var(--accent)" strokeWidth="3" />
          </svg>
        </div>
      </div>

      <div className="ic-metrics">
        <div className="ic-metric">
          <div className="ic-metric-label">探针耗散功率</div>
          <div className="ic-metric-value ic-mono">{formatNumber(heatRate)}</div>
        </div>
        <div className="ic-metric">
          <div className="ic-metric-label">耗散谱峰值频率</div>
          <div className="ic-metric-value ic-mono">
            {activeStrength === 0 ? "—" : formatNumber(peakFrequency)}
          </div>
        </div>
        <div className="ic-metric">
          <div className="ic-metric-label">零频位置谱超额</div>
          <div className="ic-metric-value ic-mono">{formatNumber(zeroFrequencyExcess)}</div>
        </div>
      </div>

      <p className="ic-footnote">
        此交互固定 <span className="ic-mono">kBT=1</span>。逐频非负来自当前“线性陷阱 + 加性 OU 活性力”模型；一般多自由度、延迟或部分观测系统不保证具有相同谱形。
      </p>
    </section>
  );
}
