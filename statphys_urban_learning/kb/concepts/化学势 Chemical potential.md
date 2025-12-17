---
type: concept
title: 化学势 Chemical potential
tags: ['thermodynamics', 'M0', 'M4']
prereq: ['热力学势 Thermodynamic potentials']
source: ['Any thermo/statmech textbook']
status: ready
---

## 一句话
化学势 μ 是粒子数 \(N\) 的共轭强度量：在 \((T,V)\) 固定下 \(\mu=(\partial F/\partial N)_{T,V}\)（在 \((T,P)\) 固定下 \(\mu=(\partial G/\partial N)_{T,P}\)），并在巨正则系综中作为控制 \(\langle N\rangle\) 的外参/拉格朗日乘子出现。

## 定义（最常用）
- 在 \(U(S,V,N)\) 表示下：
\[
\mu = \left(\frac{\partial U}{\partial N}\right)_{S,V}.
\]
- 在 \(F(T,V,N)\) 表示下：
\[
\mu = \left(\frac{\partial F}{\partial N}\right)_{T,V}.
\]

## 直觉
- 在巨正则权重 \(p(x,N)\propto e^{-\beta(E(x,N)-\mu N)}\) 下，在其他条件不变时，\(\mu\) 增大将提高较大 \(N\) 的权重，从而增大 \(\langle N\rangle\)；\(\mu\) 减小则相反。
- 两系统可交换粒子时，粒子将流动直到两侧 \(\mu\) 相等；平衡条件为 \(\mu_1=\mu_2\)。

## 与统计物理的连接（巨正则）
- 在巨正则里，权重是：
\[
p(x,N) \propto e^{-\beta(E(x,N)-\mu N)}.
\]
- \(\mu\) 是控制 \(\langle N\rangle\) 的外参/拉格朗日乘子（与 \(N\) 共轭）。

## 城市映射（最小）
- 若把“出行次数/迁移事件数/总体强度”当作可变的 N，那么 \(\mu\)（或等价乘子）就是控制总体强度的参数。

## Source anchors
- Swendsen Eq 12.11：\(dU = T\,dS - P\,dV + \mu\,dN\)
- Swendsen Eq 20.7：\(-\mu_R\beta_R \equiv \partial_{N_T}\ln\Omega_R\)（巨正则推导里的 \(\mu\) 定义锚点）
