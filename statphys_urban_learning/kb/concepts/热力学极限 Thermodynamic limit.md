---
type: concept
title: 热力学极限 Thermodynamic limit
tags: ['statmech', 'M2']
prereq: ['微正则系综 Microcanonical ensemble']
source: ['Any statmech textbook']
status: ready
---

## 一句话
热力学极限指 N,V→∞ 且密度 ρ=N/V 固定，使自由能等量按 N 线性标度并使相对涨落通常随 1/√N 消失。

## 典型表述
- 令 \(N\to\infty,\ V\to\infty\)，但 \(N/V\) 保持常数（密度固定）。
- 关注“每粒子/每体积”的量：例如 \(f=F/N\)，而不是 \(F\) 本身。

## 为什么“最概然≈平均”
- 许多可观测量的方差随 \(N\) 增长较慢（如 \(\mathrm{Var}\sim N\)），但均值 \(\sim N\)：
\[
\frac{\sqrt{\mathrm{Var}}}{\mathbb{E}} \sim \frac{1}{\sqrt{N}} \to 0.
\]
- 结果：分布在大 N 时高度集中。

## 注意
- 临界点附近可能出现“异常涨落”（相关长度变大），这就是相变/临界现象的核心之一。
