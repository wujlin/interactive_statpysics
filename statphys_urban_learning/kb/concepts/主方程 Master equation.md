---
type: concept
title: 主方程 Master equation
tags: ['stochastic', 'M8']
prereq: ['Markov 链与稳态分布 Markov chain']
source: ['stochastic processes']
status: ready
---

## 一句话
- 主方程描述“状态概率随时间如何变化”，是离散状态随机动力学的基本方程。

## 连续时间主方程（最常用）
- 设转移率 \(W_{ij}\)（从 i 到 j）：
\[
\frac{dp_i}{dt} = \sum_{j\neq i}\big[p_j W_{ji} - p_i W_{ij}\big].
\]
- 结构：**流入 - 流出**。

## 稳态
- 稳态满足 \(dp_i/dt=0\)（通常是一个线性方程组）。

## 城市连接（最小）
- 人口/车辆在区域间连续时间迁移：\(p_i(t)\) 是占比，\(W_{ij}\) 是迁移率；稳态与净流给出长期格局与不可逆驱动。
