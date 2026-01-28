---
type: concept
title: 非平衡稳态 Non-equilibrium steady state (NESS)
tags: ['stochastic', 'nonequilibrium', 'M8', 'M10']
prereq: ['主方程 Master equation', '细致平衡 Detailed balance 与净流']
source: ['standard Markov processes / stochastic thermodynamics (minimal)']
status: ready
---

## 一句话
非平衡稳态（NESS）是“分布不变但仍有净流/环流”的稳态：\(p(t)\) 已经收敛到 \(\pi\)，但 \(J_{ij}=\pi_iW_{ij}-\pi_jW_{ji}\neq 0\)，因此不满足细致平衡。

## 最小判别（离散 Markov）
- **稳态**：\(\pi W=0\)（连续时间）或 \(\pi=\pi P\)（离散时间）。
- **平衡（细致平衡）**：\(\pi_iW_{ij}=\pi_jW_{ji}\)（或 \(\pi_iP_{ij}=\pi_jP_{ji}\)），等价于所有边上 \(J_{ij}=0\)。
- 若稳态成立但存在 \(J_{ij}\neq 0\)，则为 NESS。

## 与其他概念的连接
- 概念锚点（最小反例：三态环流）：[[细致平衡 Detailed balance 与净流]]
- 不可逆性刻度：[[熵产生率 Entropy production rate (EPR)]]

