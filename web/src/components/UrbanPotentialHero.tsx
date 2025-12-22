"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

type Point = { x: number; y: number };
type Center = { x: number; y: number; strength: number; sigma: number };
type Segment = { a: Point; b: Point };
type HeroParticle = { x: number; y: number; prevX: number; prevY: number; life: number; speed: number };
type HeroColors = {
  backdrop: string;
  contour: string;
  flow: string;
  node: string;
  grid: string;
  text: string;
  textMuted: string;
};

type HeroLayout = {
  w: number;
  h: number;
  pad: number;
  gridW: number;
  gridH: number;
};

const CENTERS: Center[] = [
  { x: 0.22, y: 0.32, strength: -1.15, sigma: 0.18 },
  { x: 0.74, y: 0.28, strength: -1.0, sigma: 0.2 },
  { x: 0.56, y: 0.74, strength: -0.9, sigma: 0.22 },
  { x: 0.36, y: 0.62, strength: 0.55, sigma: 0.2 },
];

const MARCHING_CASES: Array<Array<[number, number]>> = [
  [],
  [[3, 0]],
  [[0, 1]],
  [[3, 1]],
  [[1, 2]],
  [
    [3, 2],
    [0, 1],
  ],
  [[0, 2]],
  [[3, 2]],
  [[2, 3]],
  [[0, 2]],
  [
    [0, 3],
    [1, 2],
  ],
  [[1, 2]],
  [[1, 3]],
  [[0, 1]],
  [[3, 0]],
  [],
];

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
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

function getHeroColors(): HeroColors {
  const style = getComputedStyle(document.documentElement);
  return {
    backdrop: style.getPropertyValue("--hero-backdrop").trim() || "rgba(255, 255, 255, 0.72)",
    contour: style.getPropertyValue("--hero-contour").trim() || "rgba(15, 23, 42, 0.28)",
    flow: style.getPropertyValue("--hero-flow").trim() || "rgba(16, 185, 129, 0.5)",
    node: style.getPropertyValue("--hero-node").trim() || "#1b4f8b",
    grid: style.getPropertyValue("--hero-grid").trim() || "rgba(15, 23, 42, 0.08)",
    text: style.getPropertyValue("--text").trim() || "#0f172a",
    textMuted: style.getPropertyValue("--text-muted").trim() || "rgba(15, 23, 42, 0.72)",
  };
}

function potentialAt(x: number, y: number) {
  let v = 0;
  for (const c of CENTERS) {
    const dx = x - c.x;
    const dy = y - c.y;
    const r2 = dx * dx + dy * dy;
    const s2 = c.sigma * c.sigma;
    v += c.strength * Math.exp(-r2 / (2 * s2));
  }
  return v;
}

function gradientAt(x: number, y: number) {
  let gx = 0;
  let gy = 0;
  for (const c of CENTERS) {
    const dx = x - c.x;
    const dy = y - c.y;
    const r2 = dx * dx + dy * dy;
    const s2 = c.sigma * c.sigma;
    const falloff = Math.exp(-r2 / (2 * s2));
    const coeff = c.strength * falloff * (-1 / s2);
    gx += coeff * dx;
    gy += coeff * dy;
  }
  return { gx, gy };
}

function interpolate(p1: Point, p2: Point, v1: number, v2: number, level: number): Point {
  const t = Math.abs(v2 - v1) < 1e-6 ? 0.5 : (level - v1) / (v2 - v1);
  return { x: p1.x + (p2.x - p1.x) * t, y: p1.y + (p2.y - p1.y) * t };
}

function buildContours(layout: HeroLayout) {
  const cols = clamp(Math.round(layout.w / 18), 30, 90);
  const rows = clamp(Math.round(layout.h / 18), 22, 70);
  const values = new Array((rows + 1) * (cols + 1));
  let min = Infinity;
  let max = -Infinity;

  for (let r = 0; r <= rows; r++) {
    for (let c = 0; c <= cols; c++) {
      const x = c / cols;
      const y = r / rows;
      const v = potentialAt(x, y);
      values[r * (cols + 1) + c] = v;
      min = Math.min(min, v);
      max = Math.max(max, v);
    }
  }

  const levels = 9;
  const thresholds = Array.from({ length: levels }, (_v, i) => min + ((max - min) * (i + 1)) / (levels + 1));
  const contours = thresholds.map((level, idx) => ({
    level,
    alpha: 0.08 + 0.2 * (idx / Math.max(1, levels - 1)),
    segments: [] as Segment[],
  }));

  for (let r = 0; r < rows; r++) {
    const y0 = layout.pad + (r / rows) * layout.gridH;
    const y1 = layout.pad + ((r + 1) / rows) * layout.gridH;
    for (let c = 0; c < cols; c++) {
      const x0 = layout.pad + (c / cols) * layout.gridW;
      const x1 = layout.pad + ((c + 1) / cols) * layout.gridW;
      const v0 = values[r * (cols + 1) + c]!;
      const v1 = values[r * (cols + 1) + c + 1]!;
      const v2 = values[(r + 1) * (cols + 1) + c + 1]!;
      const v3 = values[(r + 1) * (cols + 1) + c]!;

      const p0 = { x: x0, y: y0 };
      const p1 = { x: x1, y: y0 };
      const p2 = { x: x1, y: y1 };
      const p3 = { x: x0, y: y1 };

      for (const contour of contours) {
        const level = contour.level;
        const s0 = v0 > level ? 1 : 0;
        const s1 = v1 > level ? 1 : 0;
        const s2 = v2 > level ? 1 : 0;
        const s3 = v3 > level ? 1 : 0;
        const idx = s0 | (s1 << 1) | (s2 << 2) | (s3 << 3);
        const segments = MARCHING_CASES[idx];
        if (!segments || segments.length === 0) continue;

        for (const [e0, e1] of segments) {
          const a =
            e0 === 0
              ? interpolate(p0, p1, v0, v1, level)
              : e0 === 1
                ? interpolate(p1, p2, v1, v2, level)
                : e0 === 2
                  ? interpolate(p2, p3, v2, v3, level)
                  : interpolate(p3, p0, v3, v0, level);
          const b =
            e1 === 0
              ? interpolate(p0, p1, v0, v1, level)
              : e1 === 1
                ? interpolate(p1, p2, v1, v2, level)
                : e1 === 2
                  ? interpolate(p2, p3, v2, v3, level)
                  : interpolate(p3, p0, v3, v0, level);
          contour.segments.push({ a, b });
        }
      }
    }
  }

  return contours;
}

function spawnParticle(): HeroParticle {
  const x = Math.random();
  const y = Math.random();
  return {
    x,
    y,
    prevX: x,
    prevY: y,
    life: Math.random(),
    speed: 0.6 + Math.random() * 0.8,
  };
}

export function UrbanPotentialHero() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const staticRef = useRef<HTMLCanvasElement | null>(null);
  const layoutRef = useRef<HeroLayout | null>(null);
  const particlesRef = useRef<HeroParticle[]>([]);
  const lastFrameRef = useRef<number | null>(null);
  const reduceMotionRef = useRef(false);

  useEffect(() => {
    const media = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    const handler = () => {
      reduceMotionRef.current = Boolean(media?.matches);
    };
    handler();
    media?.addEventListener?.("change", handler);
    return () => media?.removeEventListener?.("change", handler);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    const containerEl = container;
    const canvasEl = canvas;

    function resize() {
      const w = containerEl.clientWidth;
      const h = containerEl.clientHeight;
      const ctx = applyCanvasSize(canvasEl, w, h);
      if (!ctx) return;

      const pad = clamp(Math.min(w, h) * 0.08, 18, 36);
      layoutRef.current = { w, h, pad, gridW: w - pad * 2, gridH: h - pad * 2 };

      const staticCanvas = staticRef.current ?? document.createElement("canvas");
      staticRef.current = staticCanvas;
      const staticCtx = applyCanvasSize(staticCanvas, w, h);
      if (!staticCtx) return;

      const colors = getHeroColors();
      staticCtx.clearRect(0, 0, w, h);
      staticCtx.fillStyle = colors.backdrop;
      staticCtx.fillRect(0, 0, w, h);

      const contours = buildContours(layoutRef.current);
      for (const contour of contours) {
        staticCtx.strokeStyle = colors.contour;
        staticCtx.globalAlpha = contour.alpha;
        staticCtx.lineWidth = 1;
        staticCtx.beginPath();
        for (const seg of contour.segments) {
          staticCtx.moveTo(seg.a.x, seg.a.y);
          staticCtx.lineTo(seg.b.x, seg.b.y);
        }
        staticCtx.stroke();
      }
      staticCtx.globalAlpha = 1;

      // City nodes
      staticCtx.fillStyle = colors.node;
      for (const c of CENTERS) {
        const cx = layoutRef.current.pad + c.x * layoutRef.current.gridW;
        const cy = layoutRef.current.pad + c.y * layoutRef.current.gridH;
        staticCtx.beginPath();
        staticCtx.arc(cx, cy, 4, 0, Math.PI * 2);
        staticCtx.fill();
      }

      const particleCount = clamp(Math.round((w * h) / 7000), 60, 180);
      particlesRef.current = Array.from({ length: particleCount }, () => spawnParticle());
      lastFrameRef.current = null;

      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(staticCanvas, 0, 0);
    }

    const ro = new ResizeObserver(resize);
    ro.observe(containerEl);
    resize();

    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    let raf = 0;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const ctx2d = ctx;

    const loop = (now: number) => {
      const layout = layoutRef.current;
      const staticCanvas = staticRef.current;
      if (!layout || !staticCanvas) {
        raf = window.requestAnimationFrame(loop);
        return;
      }

      const last = lastFrameRef.current ?? now;
      const dt = Math.min(0.04, (now - last) / 1000);
      lastFrameRef.current = now;

      ctx2d.clearRect(0, 0, layout.w, layout.h);
      ctx2d.drawImage(staticCanvas, 0, 0);

      const colors = getHeroColors();
      ctx2d.strokeStyle = colors.flow;
      ctx2d.lineWidth = 1.1;
      ctx2d.globalAlpha = 0.7;

      const speedBase = reduceMotionRef.current ? 0 : 0.1;
      for (const p of particlesRef.current) {
        p.prevX = p.x;
        p.prevY = p.y;

        if (!reduceMotionRef.current) {
          const { gx, gy } = gradientAt(p.x, p.y);
          let vx = -gx;
          let vy = -gy;
          const norm = Math.hypot(vx, vy) + 1e-6;
          vx /= norm;
          vy /= norm;

          const swirl = 0.22;
          const sx = -vy * swirl;
          const sy = vx * swirl;

          p.x += (vx + sx) * speedBase * p.speed * dt;
          p.y += (vy + sy) * speedBase * p.speed * dt;
        }

        p.life += dt * 0.1;
        if (p.x < 0 || p.x > 1 || p.y < 0 || p.y > 1 || p.life > 1.4) {
          Object.assign(p, spawnParticle());
        }

        const ax = layout.pad + p.prevX * layout.gridW;
        const ay = layout.pad + p.prevY * layout.gridH;
        const bx = layout.pad + p.x * layout.gridW;
        const by = layout.pad + p.y * layout.gridH;
        ctx2d.beginPath();
        ctx2d.moveTo(ax, ay);
        ctx2d.lineTo(bx, by);
        ctx2d.stroke();
      }
      ctx2d.globalAlpha = 1;

      raf = window.requestAnimationFrame(loop);
    };

    raf = window.requestAnimationFrame(loop);
    return () => window.cancelAnimationFrame(raf);
  }, []);

  return (
    <section className="hero" ref={containerRef}>
      <canvas className="hero-canvas" ref={canvasRef} aria-label="Urban potential contours and flow lines" />
      <div className="hero-content">
        <div className="hero-eyebrow">Physics meets City</div>
        <h1 className="hero-title">StatPhys × Urban Learning</h1>
        <p className="hero-subtitle">
          用<strong>势能面</strong>刻画结构，用<strong>流线</strong>揭示驱动：把统计物理的“势函数语言”迁移到城市流动。
        </p>
        <div className="hero-actions">
          <Link className="hero-link hero-link-primary" href="/modules">
            进入主线
          </Link>
          <Link className="hero-link" href="/kb">
            知识库
          </Link>
          <Link className="hero-link" href="/projects">
            项目库
          </Link>
          <Link className="hero-link" href="/checklist">
            Checklist
          </Link>
        </div>
        <div className="hero-legend">
          <span className="hero-legend-item">
            <span className="hero-dot hero-dot-contour" />
            等势线
          </span>
          <span className="hero-legend-item">
            <span className="hero-dot hero-dot-flow" />
            流线
          </span>
          <span className="hero-legend-item hero-muted">路线 A：阅读 + 检索 + 进度</span>
        </div>
      </div>
    </section>
  );
}
