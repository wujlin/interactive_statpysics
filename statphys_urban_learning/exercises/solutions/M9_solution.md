---
type: solution
id: M9_solution
title: M9 Langevin 与 Fokker–Planck（参考解答）
tags: [langevin, fokker-planck, stochastic, solution]
---

## (1) Langevin：漂移与扩散

Itô 形式的随机微分方程：
\[
\mathrm{d}X_t = a(X_t)\,\mathrm{d}t + b(X_t)\,\mathrm{d}W_t
\]

其中 \(X_t\) 是随机过程，\(x\) 通常用来表示它在某一时刻可能取到的数值；\(W_t\) 是布朗运动（Wiener 过程）。

- \(a(\cdot)\)（漂移）：决定平均意义下的确定性趋势；若只保留这一项，得到确定性动力学 \(\mathrm{d}X_t/\mathrm{d}t = a(X_t)\)。
- \(b(\cdot)\)（噪声幅度）：刻画随机扰动的强度；\(\mathrm{d}W_t\) 满足 \(\mathbb{E}[\mathrm{d}W_t]=0\)、\(\mathrm{Var}(\mathrm{d}W_t)=\mathrm{d}t\)。
- 因此噪声对“方差增长”的尺度由 \(b(x)^2\) 控制（因为 \((\mathrm{d}W_t)^2\) 的量级与 \(\mathrm{d}t\) 同阶）。

## (2) Fokker–Planck：概率密度的演化方程

若随机过程 \(X_t\) 满足上述 Itô SDE，则其概率密度 \(p(x,t)\) 满足 Fokker–Planck 方程：
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

> 更详细的“互译”推导（为什么必然出现 \(b^2\) 与 \(1/2\)、如何写成概率流 \(J\) 的守恒形式、以及如何从 \(J=0\) 推出 OU 稳态高斯）见：`statphys_urban_learning/kb/derivations/Langevin 与 Fokker-Planck 的对应关系 形式.md`。
