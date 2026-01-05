---
type: concept
title: 全同粒子与不可分辨性 Indistinguishability
tags: ['statmech', 'quantum', 'M4']
prereq: ['多重度 multiplicity Ω']
source: ['Gibbs paradox / quantum statistics']
status: ready
---

## 一句话
“全同粒子”指粒子具有相同的内禀性质；“不可分辨性”指交换粒子标签不产生新的物理微观态，因此多体状态应以“占据数 \(\{n_r\}\)”（而非“谁在何处”）来描述，并在经典极限中体现为 \(1/N!\) 的计数修正（Gibbs 悖论的核心）。

## 为什么重要（你会在哪里用到它）
- **巨正则的关键转折**：当 \(N\) 可涨落时，粒子视角的相空间维数随 \(N\) 改变；不可分辨性允许你改用占据数 \(\{n_r\}\)，把“变维数问题”改写为固定能级集合上的计数与求和。
- **正则里的 \(1/N!\)**：理想气体的 \(Z_N=Z_1^N/N!\) 不是技巧，而是在避免把“交换标签”误当成新状态（Gibbs 悖论）。

## 两句话区分：identical vs indistinguishable
- **Identical（全同）**：粒子参数相同（质量、电荷、自旋等一致）。
- **Indistinguishable（不可分辨）**：交换标签不产生新态；你不能（也不需要）追踪“粒子 ID”。

## 最小公式（占据数表示）
对无相互作用量子气体，多体态可用占据数表示：
\[
N=\sum_r n_r,\qquad E=\sum_r n_r\varepsilon_r.
\]
因此在巨正则权重里
\[
e^{-\beta(E-\mu N)}=\prod_r e^{-\beta(\varepsilon_r-\mu)n_r},
\]
这就是 “\(\mathcal{Z}\) 因子化为能级乘积” 的数学入口（完整推导见：[[从巨配分函数到 Fermi–Dirac / Bose–Einstein / Maxwell–Boltzmann（占据数法）]]）。

## 城市类比（可选）
当你只关心“每条路段上的车流量/占据数”，而不关心“每辆车的 ID 与轨迹”，就从 Lagrangian 视角转到 Eulerian 视角；复杂度从“追踪个体”变成“统计每个位置/状态”。
