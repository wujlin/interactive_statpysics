---
type: concept
title: Fermi–Dirac 分布 Fermi-Dirac distribution
tags: ['statmech', 'quantum', 'fermion']
prereq: ['巨正则系综 Grand canonical ensemble']
source: ['Fermi-Dirac statistics', 'Swendsen 2012 Ch27']
status: ready
---

## 一句话
Fermi–Dirac 分布给出无相互作用费米子在巨正则系综中的单能级平均占据数：\(\langle n\rangle = 1/(\exp(\beta(\varepsilon-\mu))+1)\)，其根源是单粒子态占据数约束 \(n\in\{0,1\}\)（泡利不相容）与权重 \(e^{-\beta(\varepsilon-\mu)n}\) 的归一化。

## 公式（占据数形式）
\[
\langle n_r\rangle = \frac{1}{e^{\beta(\varepsilon_r-\mu)}+1},\qquad \beta\equiv \frac{1}{k_BT}.
\]

## 最小性质
- \(T\to 0\) 时：\(\varepsilon_r<\mu\Rightarrow \langle n_r\rangle\to 1\)，\(\varepsilon_r>\mu\Rightarrow \langle n_r\rangle\to 0\)
- 经典极限（\(\langle n_r\rangle\ll 1\)）时：\(\langle n_r\rangle\approx e^{-\beta(\varepsilon_r-\mu)}\)（回到 Maxwell–Boltzmann）

## 关系与推导入口
- 从巨配分函数的能级乘积分解到 FD/BE/MB 的完整推导：[[从巨配分函数到 Fermi–Dirac / Bose–Einstein / Maxwell–Boltzmann（占据数法）]]

## Source anchors
- Swendsen Eq 27.53：\(\langle n_\alpha\rangle=(e^{\beta(\epsilon_\alpha-\mu)}+1)^{-1}\)
