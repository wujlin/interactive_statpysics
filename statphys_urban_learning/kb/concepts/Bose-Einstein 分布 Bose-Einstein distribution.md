---
type: concept
title: Bose–Einstein 分布 Bose-Einstein distribution
tags: ['statmech', 'quantum', 'boson']
prereq: ['巨正则系综 Grand canonical ensemble']
source: ['Bose-Einstein statistics', 'Swendsen 2012 Ch27']
status: ready
---

## 一句话
Bose–Einstein 分布给出无相互作用玻色子在巨正则系综中的单能级平均占据数：\(\langle n\rangle = 1/(\exp(\beta(\varepsilon-\mu))-1)\)，其根源是占据数允许 \(n\in\{0,1,2,\dots\}\) 与权重 \(e^{-\beta(\varepsilon-\mu)n}\) 的几何级数求和（并要求 \(\mu<\varepsilon_0\) 以保证收敛）。

## 公式（占据数形式）
\[
\langle n_r\rangle = \frac{1}{e^{\beta(\varepsilon_r-\mu)}-1},\qquad \beta\equiv \frac{1}{k_BT}.
\]

## 最小条件
- 为保证 \(\langle n_r\rangle\ge 0\) 且级数收敛，需要 \(\mu<\varepsilon_0\equiv \min_r \varepsilon_r\)（玻色凝聚讨论的入口条件）

## 关系与推导入口
- 从巨配分函数的能级乘积分解到 FD/BE/MB 的完整推导：[[从巨配分函数到 Fermi–Dirac / Bose–Einstein / Maxwell–Boltzmann（占据数法）]]

## Source anchors
- Swendsen Eq 27.50：\(\langle n_\alpha\rangle=(e^{\beta(\epsilon_\alpha-\mu)}-1)^{-1}\)
