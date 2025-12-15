---
type: concept
title: 化学势 Chemical potential
tags: ['thermodynamics', 'M0', 'M4']
prereq: ['热力学势 Thermodynamic potentials']
source: ['Any thermo/statmech textbook']
status: ready
---

## 一句话
- 化学势 \(\mu\) 是 **“粒子数/规模 N” 的共轭量**：它告诉你“再多一个粒子/个体”对势（或自由能）有多贵。

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
- \(\mu\) 大：系统“再加一个粒子”代价高 ⇒ 平衡时平均 N 会被压低。
- \(\mu\) 小（甚至负得更大）：更容易“进粒子/进个体” ⇒ 平均 N 变大。

## 与统计物理的连接（巨正则）
- 在巨正则里，权重是：
\[
p(x,N) \propto e^{-\beta(E(x,N)-\mu N)}.
\]
- \(\mu\) 就是控制“平均粒子数/规模”的旋钮。

## 城市映射（最小）
- 若把“出行次数/迁移事件数/总体强度”当作可变的 N，那么 \(\mu\)（或等价乘子）就是控制总体强度的参数。
