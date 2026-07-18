"use client";

import katex from "katex";
import { useEffect, useMemo, useRef, useState } from "react";

const FACES = [1, 2, 3, 4, 5, 6] as const;

function formatNumber(x: number, digits = 6) {
  if (!Number.isFinite(x)) return x > 0 ? "∞" : "-∞";
  const abs = Math.abs(x);
  if (abs > 0 && (abs < 1e-4 || abs > 1e4)) return x.toExponential(2);
  return x.toFixed(digits);
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

function distributionFromLambda(lambda: number, xs: number[]) {
  const logw = xs.map((x) => -lambda * x);
  const m = Math.max(...logw);
  const w = logw.map((v) => Math.exp(v - m));
  let Z = 0;
  for (const wi of w) Z += wi;
  Z = Math.max(Number.EPSILON, Z);
  const p = w.map((wi) => wi / Z);
  let mean = 0;
  for (let i = 0; i < xs.length; i++) mean += p[i]! * xs[i]!;
  return { p, mean, Z };
}

function solveLambdaForMean(targetMean: number, xs: number[]) {
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);

  // Endpoints: if mean is pinned to min/max, the max-entropy solution collapses to a point mass.
  const eps = 1e-12;
  if (targetMean <= minX + eps) {
    return {
      lambda: Number.POSITIVE_INFINITY,
      ...distributionFromLambda(1e6, xs), // numerically stable proxy; p will be ~delta at min
      clipped: true,
    };
  }
  if (targetMean >= maxX - eps) {
    return {
      lambda: Number.NEGATIVE_INFINITY,
      ...distributionFromLambda(-1e6, xs), // proxy; p ~delta at max
      clipped: true,
    };
  }

  // mean(lambda) is strictly decreasing in lambda for strictly ordered xs.
  // Find a bracket [lo, hi] such that mean(lo) >= target >= mean(hi).
  let lo = -1;
  let hi = 1;
  let meanLo = distributionFromLambda(lo, xs).mean;
  let meanHi = distributionFromLambda(hi, xs).mean;

  for (let i = 0; i < 60 && meanLo < targetMean; i++) {
    lo *= 2;
    meanLo = distributionFromLambda(lo, xs).mean;
  }
  for (let i = 0; i < 60 && meanHi > targetMean; i++) {
    hi *= 2;
    meanHi = distributionFromLambda(hi, xs).mean;
  }

  // Bisection.
  let mid = 0;
  let out = distributionFromLambda(mid, xs);
  for (let it = 0; it < 80; it++) {
    mid = 0.5 * (lo + hi);
    out = distributionFromLambda(mid, xs);
    const err = out.mean - targetMean;
    if (Math.abs(err) < 1e-12) break;
    if (err > 0) lo = mid; // mean too high -> increase lambda
    else hi = mid; // mean too low -> decrease lambda
  }

  return { lambda: mid, ...out, clipped: false };
}

export function MaxEntDiceDemo() {
  const [mu, setMu] = useState(3.5);
  const [isPlaying, setIsPlaying] = useState(false);

  const playDirRef = useRef<1 | -1>(1);
  const lastFrameMsRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isPlaying) {
      lastFrameMsRef.current = null;
      return;
    }

    const speed = 0.75; // mean points per second
    let raf = 0;
    const tick = (ms: number) => {
      const last = lastFrameMsRef.current;
      lastFrameMsRef.current = ms;
      if (last != null) {
        const dt = Math.max(0, (ms - last) / 1000);
        setMu((prev) => {
          let next = prev + playDirRef.current * dt * speed;
          if (next >= 6) {
            next = 6;
            playDirRef.current = -1;
          } else if (next <= 1) {
            next = 1;
            playDirRef.current = 1;
          }
          return next;
        });
      }
      raf = window.requestAnimationFrame(tick);
    };

    raf = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(raf);
  }, [isPlaying]);

  const solved = useMemo(() => solveLambdaForMean(mu, [...FACES]), [mu]);
  const p = solved.p;

  const hint = useMemo(() => {
    if (!Number.isFinite(solved.lambda)) return "均值被钉在端点时，分布会塌缩成一个点质量（“硬约束”效果）。";
    if (Math.abs(solved.lambda) < 1e-10) return "λ=0 ⇒ 均匀分布。";
    if (solved.lambda > 0) return "λ>0：惩罚高点数 ⇒ 分布偏向小点数（均值 < 3.5）。";
    return "λ<0：偏好高点数 ⇒ 分布偏向大点数（均值 > 3.5）。";
  }, [solved.lambda]);

  return (
    <section className="ic-card">
      <div className="ic-header">
        <div>
          <div className="ic-title-main">E01：离散 MaxEnt（平均骰子点数 → 乘子 λ）</div>
          <div className="ic-title-sub">
            你只给系统一条信息：目标均值 <span className="ic-math">μ</span>。最大熵会在“尽量摊平”和“满足均值约束”之间达成
            平衡，并把分布写成指数族。
          </div>
        </div>

        <div className="ic-controls">
          <div className="ic-slider">
            <div className="ic-slider-label">目标均值 μ=⟨x⟩</div>
            <input
              type="range"
              min={1}
              max={6}
              step={0.01}
              value={mu}
              onChange={(e) => setMu(Number(e.target.value))}
              aria-label="target mean"
            />
            <div className="ic-mono">{mu.toFixed(2)}</div>
          </div>
          <button
            className={"ic-btn " + (isPlaying ? "ic-btn-primary" : "")}
            onClick={() => setIsPlaying((v) => !v)}
          >
            {isPlaying ? "暂停 μ 动画" : "播放 μ 动画"}
          </button>
          <button className="ic-btn ic-btn-ghost" onClick={() => setMu(3.5)}>
            重置（均匀）
          </button>
        </div>
      </div>

      <div className="ic-toast">
        <MathInline tex={"p(x)=\\frac{1}{Z(\\lambda)}\\exp(-\\lambda x),\\quad x\\in\\{1,2,3,4,5,6\\}"} />{" "}
        <MathInline tex={"\\;\\text{选 }\\lambda\\text{ 使 }\\mathbb{E}[X]=\\mu."} />
      </div>

      <div className="ic-chart">
        {FACES.map((x, idx) => (
          <div className="ic-bar-row" key={x}>
            <div className="ic-bar-label">x = {x}</div>
            <div className="ic-bar-track" aria-label={`p(x=${x})`}>
              <div className="ic-bar-fill" style={{ width: `${Math.max(0, Math.min(1, p[idx] ?? 0)) * 100}%` }} />
            </div>
            <div className="ic-bar-meta">
              <span className="ic-mono">p={formatNumber(p[idx] ?? 0, 4)}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="ic-metrics">
        <div className="ic-metric">
          <div className="ic-metric-label">λ（拉格朗日乘子）</div>
          <div className="ic-metric-value ic-mono">{formatNumber(solved.lambda, 5)}</div>
        </div>
        <div className="ic-metric">
          <div className="ic-metric-label">⟨x⟩（解的均值）</div>
          <div className="ic-metric-value ic-mono">{formatNumber(solved.mean, 6)}</div>
        </div>
        <div className="ic-metric">
          <div className="ic-metric-label">误差 ⟨x⟩ − μ</div>
          <div className="ic-metric-value ic-mono">{formatNumber(solved.mean - mu, 2)}</div>
        </div>
        <div className="ic-metric">
          <div className="ic-metric-label">Z(λ)</div>
          <div className="ic-metric-value ic-mono">{formatNumber(solved.Z, 6)}</div>
        </div>
      </div>

      <div className="ic-footnote">{hint}</div>
    </section>
  );
}
