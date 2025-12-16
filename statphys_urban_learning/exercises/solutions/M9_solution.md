---
type: solution
id: M9_solution
title: M9 Langevin 与 Fokker–Planck（参考解答）
tags: [langevin, fokker-planck, stochastic, solution]
---

## (1) Langevin：漂移与扩散

Itô 形式的随机微分方程：
\[
dx=a(x)\,dt+b(x)\,dW_t.
\]

- \(a(x)\)（漂移）：决定平均意义下的确定性趋势；若只保留该项就是常微分方程 \(dx/dt=a(x)\)。
- \(b(x)\)（扩散强度）：噪声项的强度；\(dW_t\) 是 Wiener 过程增量，满足 \(\mathbb{E}[dW_t]=0\)、\(\mathrm{Var}(dW_t)=dt\)。
- 因此噪声对方差增长的尺度由 \(b(x)^2\) 控制（因为方差与 \(dW_t^2\sim dt\) 同阶）。

## (2) Fokker–Planck：概率密度的演化方程

若随机变量 \(x_t\) 满足上述 Itô SDE，则其概率密度 \(p(x,t)\) 满足 Fokker–Planck 方程：
\[
\partial_t p(x,t)=-\partial_x\!\big(a(x)p(x,t)\big)+\frac{1}{2}\partial_x^2\!\big(b(x)^2 p(x,t)\big).
\]

它描述的对象是：**随机过程在状态空间上的概率质量如何随时间流动/扩散**。

快速检查：

- 若 \(a=0\)、\(b=\sigma\) 常数，则
  \[
  \partial_t p=\frac{\sigma^2}{2}\partial_x^2 p,
  \]
  即标准扩散方程。
- 若 \(b\to 0\)，则只剩
  \[
  \partial_t p=-\partial_x(ap),
  \]
  即确定性输运（Liouville/continuity）形式。
